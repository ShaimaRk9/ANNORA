import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

async function createAdmin() {
  try {
    const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const name = process.env.ADMIN_NAME?.trim();
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !email || !name || !password) {
      throw new Error("Admin credentials .env file mein missing hain.");
    }

    if (password.length < 12) {
      throw new Error("Admin password kam se kam 12 characters ka hona chahiye.");
    }

    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.role !== "ADMIN") {
        throw new Error(
          "Ye username ya email pehle se non-admin account use kar raha hai."
        );
      }

      console.log("Admin account pehle se exist karta hai.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      username,
      email,
      name,
      password: hashedPassword,
      role: "ADMIN",
      verificationStatus: "APPROVED",
    });

    console.log("Admin account successfully created!");
    console.log("Username:", username);
    console.log("Password: .env mein configured hai.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();