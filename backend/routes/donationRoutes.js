
import express from "express";
import { createDonation } from "../controllers/DonationController.js";
import { acceptDonation } from "../controllers/MatchingController.js";
import { protect } from "../Middleware/authmiddlewares.js";

const router = express.Router();

// Create a donation
router.post("/", protect, createDonation);

// Accept a donation request
router.patch("/requests/:requestId/accept", protect, acceptDonation);

export default router;
