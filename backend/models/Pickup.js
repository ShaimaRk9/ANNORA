
import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      unique: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    scheduledAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    status: {
      type: String,
      enum: [
        "ASSIGNED",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "ASSIGNED",
      index: true,
    },
    trackingEvents: [
      {
        status: String,
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Pickup =
  mongoose.models.Pickup ||
  mongoose.model("Pickup", pickupSchema);

export default Pickup;
