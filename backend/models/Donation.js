
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    foodName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    foodCategory: {
      type: String,
      required: true,
      enum: [
        "Cooked Food",
        "Fruits",
        "Vegetables",
        "Bakery",
        "Packaged Food",
        "Dairy",
        "Other",
      ],
    },
    description: {
      type: String,
      required: true,
      maxlength: 1500,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.1,
    },
    quantityUnit: {
      type: String,
      required: true,
      enum: ["kg", "portions", "packets", "litres"],
    },
    preparedAt: Date,
    expiresAt: {
      type: Date,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    pickupWindowStart: {
      type: Date,
      required: true,
    },
    pickupWindowEnd: {
      type: Date,
      required: true,
    },
    dietaryTags: [String],
    allergenInfo: [String],
    imageUrls: [String],
    status: {
      type: String,
      enum: [
        "PENDING_MATCHING",
        "OPEN",
        "ACCEPTED",
        "PICKUP_ASSIGNED",
        "PICKED_UP",
        "IN_TRANSIT",
        "DELIVERED",
        "COMPLETED",
        "CANCELLED",
        "EXPIRED",
      ],
      default: "PENDING_MATCHING",
      index: true,
    },
    recommendedNGOs: [
      {
        ngo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        score: Number,
        distanceKm: Number,
        reasons: [String],
      },
    ],
    assignedNGO: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    acceptedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

donationSchema.index({ location: "2dsphere" });
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ status: 1, expiresAt: 1 });

const Donation =
  mongoose.models.Donation ||
  mongoose.model("Donation", donationSchema);

export default Donation;
