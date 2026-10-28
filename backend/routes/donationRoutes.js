
import express from "express";

import express from "express";
import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import { createDonation } from "../controllers/DonationController.js";
import { acceptDonation } from "../controllers/MatchingController.js";
import { protect } from "../Middleware/authmiddlewares.js";

const router = express.Router();

// Get available donations for NGO dashboard
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find({
      status: { $in: ["Available", "OPEN"] },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
      error: error.message,
    });
  }
});

// Create a donation using the main branch controller
router.post("/", protect, createDonation);

// NGO claims an available donation
router.patch("/:id/claim", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const ngoId = req.user?._id || req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation ID",
      });
    }

    if (!ngoId || !mongoose.Types.ObjectId.isValid(String(ngoId))) {
      return res.status(401).json({
        success: false,
        message: "Authenticated NGO user is required",
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

// Accept a matched donation request
router.patch("/requests/:requestId/accept", protect, acceptDonation);

export default router;


export default router;
