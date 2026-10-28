
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    foodType: {
      type: String,
      default: "Cooked Food",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      default: "portions",
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Available", "Claimed", "Picked Up", "Delivered"],
      default: "Available",
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimedAt: {
  type: Date,
  default: null,
},
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
