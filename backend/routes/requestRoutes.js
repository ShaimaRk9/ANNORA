
import express from "express";
import Request from "../models/Request.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Fetch requests error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const request = await Request.create(req.body);

    res.status(201).json({
      success: true,
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    console.error("Create request error:", error.message);
    res.status(400).json({
      success: false,
      message: "Failed to create request",
      error: error.message,
    });
  }
});

export default router;
