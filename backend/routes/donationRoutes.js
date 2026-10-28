
import express from "express";
import Donation from "../models/Donation.js";

const router = express.Router();

// 1. Get all available donations (NGO dashboard)
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find({
      status: "Available",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
      error: error.message,
    });
  }
});

// 2. Donor creates a food donation
router.post("/", async (req, res) => {
  try {
    const {
      donorName,
      foodName,
      foodType,
      quantity,
      unit,
      pickupAddress,
      expiryTime,
      description,
    } = req.body;

    if (
      !donorName ||
      !foodName ||
      quantity === undefined ||
      !pickupAddress ||
      !expiryTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Donor name, food name, quantity, pickup address and expiry time are required",
      });
    }

    if (
      !Number.isFinite(Number(quantity)) ||
      Number(quantity) < 1 ||
      !Number.isFinite(Date.parse(expiryTime))
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid quantity and expiry time",
      });
    }

    const donation = await Donation.create({
      donorName,
      foodName,
      foodType,
      quantity: Number(quantity),
      unit,
      pickupAddress,
      expiryTime,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Food donation added successfully",
      donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add donation",
      error: error.message,
    });
  }
});

// 3. NGO claims an available donation
router.patch("/:id/claim", async (req, res) => {
  try {
    const mongoose = await import("mongoose");
    const { id } = req.params;
    const { ngoId } = req.body;

    if (!mongoose.default.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation ID",
      });
    }

    if (
      !ngoId ||
      !mongoose.default.Types.ObjectId.isValid(ngoId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid NGO user ID is required",
      });
    }

    const donation = await Donation.findOneAndUpdate(
      {
        _id: id,
        status: "Available",
        expiryTime: { $gt: new Date() },
      },
      {
        $set: {
          status: "Claimed",
          claimedBy: ngoId,
          claimedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!donation) {
      return res.status(409).json({
        success: false,
        message: "Donation is unavailable, expired, or already claimed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Donation claimed successfully",
      donation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to claim donation",
      error: error.message,
    });
  }
});

export default router;
