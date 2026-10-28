import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // Keep both branches' role values for compatibility.
    role: {
      type: String,
      enum: [
        "admin",
        "donor",
        "recipient",
        "ADMIN",
        "RESTAURANT",
        "NGO",
        "RECEIVER",
        "VOLUNTEER",
      ],
      required: true,
      default: "donor",
      index: true,
    },

    // Donor business profile
    businessName: {
      type: String,
      trim: true,
      default: "",
    },

    businessType: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Donor account verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    accountStatus: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },

    // Main branch verification fields
    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    registrationNumber: {
      type: String,
      trim: true,
      default: "",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    // Donor notification preferences
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },

      smsNotifications: {
        type: Boolean,
        default: false,
      },

      pushNotifications: {
        type: Boolean,
        default: true,
      },

      language: {
        type: String,
        default: "en",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Reuse the existing model if already registered.
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;