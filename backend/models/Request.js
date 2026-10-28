import mongoose from "mongoose";

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
      enum: [
        "OPEN",
        "ACCEPTED",
        "CLOSED",
        "REJECTED",
        "EXPIRED",
      ],
      default: "OPEN",
    },

    respondedAt: Date,
  },
  { timestamps: true }
);

// A particular NGO must not receive duplicate request records
// for the same donation.
donationRequestSchema.index(
  { donation: 1, ngo: 1 },
  { unique: true }
);

const Request =
  mongoose.models.Request ||
  mongoose.model("Request", donationRequestSchema);

export default Request;