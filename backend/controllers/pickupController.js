import mongoose from "mongoose";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const Donation = require("../models/Donation.js");
const Pickup = require("../models/Pickup.js");

// POST /api/pickups
// Create a pickup record for a donation owned by the logged-in donor.
export const createPickup = async (req, res) => {
  try {
    const { donationId, pickupTime, pickupAddress, notes } = req.body;

    if (!mongoose.isValidObjectId(donationId)) {
      return res.status(400).json({
        success: false,
        message: "A valid donation ID is required",
      });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Only the donor who owns this donation can create its pickup.
    if (String(donation.donor) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You cannot create a pickup for this donation",
      });
    }

    if (["completed", "cancelled"].includes(donation.status)) {
      return res.status(400).json({
        success: false,
        message: "A pickup cannot be created for this donation status",
      });
    }

    const existingPickup = await Pickup.findOne({
      donation: donation._id,
      status: { $ne: "cancelled" },
    });

    if (existingPickup) {
      return res.status(409).json({
        success: false,
        message: "An active pickup already exists for this donation",
        pickup: existingPickup,
      });
    }

    if (
      pickupTime &&
      (!Number.isFinite(Date.parse(pickupTime)) ||
        new Date(pickupTime) <= new Date())
    ) {
      return res.status(400).json({
        success: false,
        message: "Pickup time must be a valid future date",
      });
    }

    const pickup = await Pickup.create({
      donation: donation._id,
      donor: req.user._id,
      pickupTime: pickupTime || undefined,
      pickupAddress: pickupAddress || donation.pickupAddress,
      notes: notes || "",
      status: "scheduled",
    });

    return res.status(201).json({
      success: true,
      message: "Pickup created successfully",
      pickup,
    });
  } catch (error) {
    console.error("createPickup:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create pickup",
    });
  }
};

// GET /api/pickups
// Return pickups associated with the logged-in user.
export const getAllPickups = async (req, res) => {
  try {
    const filter =
      req.user.role === "ngo"
        ? { ngo: req.user._id }
        : { donor: req.user._id };

    const pickups = await Pickup.find(filter)
      .populate("donation")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    console.error("getAllPickups:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pickups",
    });
  }
};

// GET /api/pickups/donation/:donationId
// Find a pickup associated with a donation.
export const getPickupByDonationId = async (req, res) => {
  try {
    const { donationId } = req.params;

    if (!mongoose.isValidObjectId(donationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation ID",
      });
    }

    const donation = await Donation.findById(donationId).select(
      "donor status"
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    const isDonor = String(donation.donor) === String(req.user._id);

    // NGOs may only access pickups explicitly assigned to them.
    const filter = {
      donation: donationId,
      ...(req.user.role === "ngo"
        ? { ngo: req.user._id }
        : { donor: req.user._id }),
    };

    if (req.user.role !== "ngo" && !isDonor) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this pickup",
      });
    }

    const pickup = await Pickup.findOne(filter)
      .populate("donation")
      .lean();

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    return res.status(200).json({
      success: true,
      pickup,
    });
  } catch (error) {
    console.error("getPickupByDonationId:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pickup",
    });
  }
};

// GET /api/pickups/:id
// Find one pickup, checking ownership.
export const getPickupById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup ID",
      });
    }

    const filter = {
      _id: id,
      ...(req.user.role === "ngo"
        ? { ngo: req.user._id }
        : { donor: req.user._id }),
    };

    const pickup = await Pickup.findOne(filter)
      .populate("donation")
      .lean();

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      pickup,
    });
  } catch (error) {
    console.error("getPickupById:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pickup",
    });
  }
};

// PATCH /api/pickups/:id/status
// Update pickup status for an authorized donor or assigned NGO.
export const updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup ID",
      });
    }

    const allowedStatuses = [
      "scheduled",
      "picked_up",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup status",
      });
    }

    const filter = {
      _id: id,
      ...(req.user.role === "ngo"
        ? { ngo: req.user._id }
        : { donor: req.user._id }),
    };

    const pickup = await Pickup.findOne(filter);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found or access denied",
      });
    }

    const transitions = {
      scheduled: ["picked_up", "cancelled"],
      picked_up: ["completed"],
      completed: [],
      cancelled: [],
    };

    if (!transitions[pickup.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change pickup status from ${pickup.status} to ${status}`,
      });
    }

    // Only the assigned NGO can confirm collection or completion.
    if (
      ["picked_up", "completed"].includes(status) &&
      req.user.role !== "ngo"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the assigned NGO can confirm pickup progress",
      });
    }

    pickup.status = status;
    await pickup.save();

    // Keep donation status in sync with pickup progress.
    if (status === "picked_up" || status === "completed") {
      await Donation.findByIdAndUpdate(pickup.donation, {
        status,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pickup status updated successfully",
      pickup,
    });
  } catch (error) {
    console.error("updatePickupStatus:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update pickup status",
    });
  }
};
