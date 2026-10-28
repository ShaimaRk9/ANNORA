
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authroutes.js";
import donorRoutes from "./routes/donorRoutes.js";
//import recipientRoutes from "./routes/recipientRoutes.js";
//import adminRoutes from "./routes/adminRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import pickupRoutes from "./routes/pickupRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));

app.use(express.json());

// Register API routes here
app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
//app.use("/api/recipient", recipientRoutes);
//app.use("/api/admin", adminRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/pickups", pickupRoutes);

// Health-check routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ANNORA Backend API",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ANNORA backend is running",
  });
});

// Start the server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`ANNORA backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start ANNORA:", error.message);
    process.exit(1);
  }
};

startServer();
