
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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

    role: {
      type: String,
      enum: ["admin", "donor", "recipient"],
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

    // Account verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    accountStatus: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
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

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
