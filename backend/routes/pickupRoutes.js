
import express from "express";

import {
  createPickup,
  getAllPickups,
  getPickupById,
  updatePickupStatus,
  getPickupByDonationId,
} from "../controllers/pickupController.js";

import { protect } from "../Middleware/authmiddlewares.js";

const router = express.Router();

// All pickup routes require authentication
router.use(protect);

// Create a pickup record
router.post("/", createPickup);

// Get all pickups for the authenticated user
router.get("/", getAllPickups);

// Get pickup details using donation ID
router.get("/donation/:donationId", getPickupByDonationId);

// Get pickup details using pickup ID
router.get("/:id", getPickupById);

// Update pickup status
router.patch("/:id/status", updatePickupStatus);

export default router;
