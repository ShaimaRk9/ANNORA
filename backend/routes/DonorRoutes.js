
import express from "express";
import { protect } from "../Middleware/authmiddlewares.js";

import {
  getDashboard,
  getMyDonations,
  getDonationHistory,
  getBusinessProfile,
  updateBusinessProfile,
  getDonorSettings,
  updateDonorSettings,
} from "../controllers/donorController.js";

import { createDonation } from "../controllers/donationController.js";
import { acceptDonation } from "../controllers/matchingController.js";

const router = express.Router();

// All donor routes require authentication
router.use(protect);

// Dashboard
router.get("/dashboard", getDashboard);

// Donation management
router.post("/donations", createDonation);
router.get("/donations/my", getMyDonations);
router.get("/donations/history", getDonationHistory);

// Business profile
router.get("/profile", getBusinessProfile);
router.patch("/profile", updateBusinessProfile);

// Settings
router.get("/settings", getDonorSettings);
router.patch("/settings", updateDonorSettings);

// Accept a donation request
router.patch("/requests/:requestId/accept", acceptDonation);

export default router;
