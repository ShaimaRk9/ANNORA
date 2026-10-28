
import mongoose from "mongoose";

// NGO's food requirements
const requestSchema = new mongoose.Schema(
  {
    ngoName: {
      type: String,
      required: true,
      trim: true,
    },
    acceptedFoodTypes: {
      type: [String],
      required: true,
      validate: {
        validator: (types) => types.length > 0,
        message: "At least one accepted food type is required",
      },
    },
    dietaryPreference: {
      type: String,
      enum: ["Any", "Vegetarian", "Vegan", "Non-Vegetarian"],
      default: "Any",
    },
    requiredQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      default: "portions",
      trim: true,
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    pickupDeadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Matched", "Fulfilled", "Cancelled"],
      default: "Open",
    },
  },
  { timestamps: true }
);

// Request sent to a specific NGO for a donation
const donationRequestSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      index: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    distanceKm: Number,
    status: {
      type: String,
      enum: ["OPEN", "ACCEPTED", "CLOSED", "REJECTED", "EXPIRED"],
      default: "OPEN",
    },
    respondedAt: Date,
  },
  { timestamps: true }
);

donationRequestSchema.index(
  { donation: 1, ngo: 1 },
  { unique: true }
);

const Request =
  mongoose.models.Request ||
  mongoose.model("Request", requestSchema);

const DonationRequest =
  mongoose.models.DonationRequest ||
  mongoose.model("DonationRequest", donationRequestSchema);

export { DonationRequest };
export default Request;
