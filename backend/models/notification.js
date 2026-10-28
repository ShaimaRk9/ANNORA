
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: [
        "donation",
        "match_request",
        "pickup",
        "verification",
        "account",
        "system",
      ],
      default: "system",
      index: true,
    },

    relatedDonation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      default: null,
    },

    relatedMatchRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchRequest",
      default: null,
    },

    relatedPickup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pickup",
      default: null,
    },

    link: {
      type: String,
      trim: true,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Efficiently retrieve a user's newest notifications.
notificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
