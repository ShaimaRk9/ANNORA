
import express from "express";
import Donation from "../models/Donation.js";
import Request from "../models/Request.js";
import { getRecommendations } from "../services/matchingService.js";

const router = express.Router();
console.log("Matching routes file loaded");

// GET /api/matching/recommendations
router.get("/", async (req, res) => {
  try {
    const now = new Date();

    // Fetch donations that are available and not expired
    const donations = await Donation.find({
      status: "Available",
      expiryTime: { $gt: now },
    }).lean();

    // Fetch requests that are open and whose deadlines have not passed
    const requests = await Request.find({
      status: "Open",
      pickupDeadline: { $gt: now },
    }).lean();

    // Apply the matching algorithm
    const recommendations = getRecommendations(donations, requests);

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("Matching recommendations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
    });
  }
});

export default router;
