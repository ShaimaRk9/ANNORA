
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },

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
    },

    foodType: {
      type: String,
      default: "Cooked Food",
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
      default: "",
      maxlength: 1500,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.1,
    },

    unit: {
      type: String,
      default: "portions",
    },

    quantityUnit: {
      type: String,
      required: true,
      enum: ["kg", "portions", "packets", "litres"],
    },

    preparedAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    expiryTime: {
      type: Date,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
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

    pickupAddress: {
      type: String,
      required: true,
      trim: true,
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

    // Basic references; verify these against your existing project
    // before deploying if your application uses additional fields.
    assignedNGO: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

    acceptedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Database indexes
donationSchema.index({ location: "2dsphere" });
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ status: 1, expiresAt: 1 });

const Donation =
  mongoose.models.Donation ||
  mongoose.model("Donation", donationSchema);

export default Donation;
