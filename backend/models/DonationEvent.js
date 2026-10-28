const mongoose = require("mongoose");

const donationEventSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      index: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    actorRole: {
      type: String,
      enum: ["DONOR", "NGO", "ADMIN", "SYSTEM"],
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    previousStatus: String,
    newStatus: String,
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

donationEventSchema.index({
  donation: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "DonationEvent",
  donationEventSchema
);