import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import donationRoutes from "./routes/donationRoutes.js";
import matchingRoutes from "./routes/matchingRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api/donations", donationRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/requests", requestRoutes);

app.get("/api/requests-test", (req, res) => {
  res.json({
    success: true,
    message: "Requests test route working",
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to FoodBridge Backend API",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FoodBridge backend is running",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`FoodBridge backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start FoodBridge:", error.message);
    process.exit(1);
  }
};

startServer();