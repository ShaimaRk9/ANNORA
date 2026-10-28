
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    // NGO or recipient details
    ngoName: {
      type: String,
      required: true,
      trim: true,
    },

    // Food types accepted by this NGO
    acceptedFoodTypes: {
      type: [String],
      required: true,
      validate: {
        validator: (types) => types.length > 0,
        message: "At least one accepted food type is required",
      },
    },

    // Dietary preference of the recipients
    dietaryPreference: {
      type: String,
      enum: ["Any", "Vegetarian", "Vegan", "Non-Vegetarian"],
      default: "Any",
    },

    // Quantity required by the NGO
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

    // Where the NGO can collect food
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional coordinates for distance matching
    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    // Latest time the NGO can collect the food
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
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
