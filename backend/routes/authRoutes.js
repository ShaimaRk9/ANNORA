
import express from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authmiddlewares.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route: requires a valid JWT token
router.get("/me", protect, getMe);

export default router;
