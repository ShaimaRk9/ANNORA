
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import donationRoutes from "./routes/donationRoutes.js";
import matchingRoutes from "./routes/matchingRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
      : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "ANNORA / FoodBridge backend is running successfully!",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

// API routes
app.use("/api/donations", donationRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/requests", requestRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
