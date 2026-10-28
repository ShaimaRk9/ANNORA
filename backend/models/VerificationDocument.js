
import mongoose from "mongoose";

const verificationDocumentSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    documentType: {
      type: String,
      enum: [
        "business_license",
        "identity_proof",
        "food_safety_certificate",
        "tax_document",
        "other",
      ],
      required: true,
    },

    documentName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // Store the uploaded file's URL or storage key, not the file itself.
    documentUrl: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    reviewNote: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

verificationDocumentSchema.index({
  donor: 1,
  createdAt: -1,
});

const VerificationDocument = mongoose.model(
  "VerificationDocument",
  verificationDocumentSchema
);

export default VerificationDocument;
