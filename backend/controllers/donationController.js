
import Donation from "../models/Donation.js";

import DonationRequest from "../models/Request.js";
import { findMatchingNGOs } from "../services/matchingService.js";
export const createDonation = async (req, res) => {
  try {
    const {
      foodName,
      foodCategory,
      description,
      quantity,
      quantityUnit,
      preparedAt,
      expiresAt,
      pickupAddress,
      location,
      pickupWindowStart,
      pickupWindowEnd,
      dietaryTags = [],
      allergenInfo = [],
      imageUrls = [],
    } = req.body;

    if (
      !foodName?.trim() ||
      !foodCategory ||
      !description?.trim() ||
      !pickupAddress?.trim() ||
      !quantityUnit
    ) {
      return res.status(400).json({
        message: "Please provide all required donation details.",
      });
    }

    const amount = Number(quantity);
    const expiry = new Date(expiresAt);
    const start = new Date(pickupWindowStart);
    const end = new Date(pickupWindowEnd);
    const now = new Date();

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than zero.",
      });
    }

    if (
      Number.isNaN(expiry.getTime()) ||
      expiry <= now
    ) {
      return res.status(400).json({
        message: "Food expiry must be in the future.",
      });
    }

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start < now ||
      end <= start ||
      end > expiry
    ) {
      return res.status(400).json({
        message: "Please provide a valid pickup time window.",
      });
    }

    const coords = location?.coordinates;

    if (
      !Array.isArray(coords) ||
      coords.length !== 2 ||
      !coords.every(Number.isFinite) ||
      coords[0] < -180 ||
      coords[0] > 180 ||
      coords[1] < -90 ||
      coords[1] > 90
    ) {
      return res.status(400).json({
        message: "A valid pickup location is required.",
      });
    }

    // req.user must be populated by your existing auth middleware.
    const donation = await Donation.create({
      donor: req.user._id,
      foodName: foodName.trim(),
      foodCategory,
      description: description.trim(),
      quantity: amount,
      quantityUnit,
      preparedAt,
      expiresAt: expiry,
      pickupAddress: pickupAddress.trim(),
      location: {
        type: "Point",
        coordinates: coords,
      },
      pickupWindowStart: start,
      pickupWindowEnd: end,
      dietaryTags,
      allergenInfo,
      imageUrls,
      status: "PENDING_MATCHING",
    });

    const matches = await findMatchingNGOs(donation);

    if (matches.length === 0) {
      donation.status = "OPEN";
      await donation.save();

      return res.status(201).json({
        message:
          "Donation created, but no eligible NGOs were found. You can retry matching later.",
        donation,
        matches: [],
      });
    }

    // Create one request for every recommended NGO.
    await DonationRequest.insertMany(
      matches.map((match) => ({
        donation: donation._id,
        ngo: match.ngoId,
        matchScore: match.score,
        distanceKm: match.distanceKm,
        status: "OPEN",
      }))
    );

    donation.recommendedNGOs = matches.map((match) => ({
      ngo: match.ngoId,
      score: match.score,
      distanceKm: match.distanceKm,
      reasons: match.reasons,
    }));

    donation.status = "OPEN";
    await donation.save();

    // TODO: Publish notifications to each recommended NGO.
    // Notifications should be retriable and should not be lost
    // if notification delivery fails.

    return res.status(201).json({
      message: "Donation created and NGO requests opened.",
      donation,
      matches,
    });
  } catch (error) {
    console.error("Create donation error:", error);

    return res.status(500).json({
      message: "Unable to create donation.",
    });
  }
};