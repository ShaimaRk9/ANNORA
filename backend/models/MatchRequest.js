
import mongoose from "mongoose";

const matchRequestSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      index: true,
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    requestedQuantity: {
      type: Number,
      required: true,
      min: [0.1, "Requested quantity must be greater than zero."],
    },

    quantityUnit: {
      type: String,
      trim: true,
      default: "kg",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
      ],
      default: "pending",
      index: true,
    },

    responseMessage: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same recipient from creating duplicate requests
// for the same donation.
matchRequestSchema.index(
  { donation: 1, recipient: 1 },
  { unique: true }
);

const MatchRequest = mongoose.model("MatchRequest", matchRequestSchema);

export default MatchRequest;
