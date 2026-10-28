
import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import DonationRequest from "../models/Request.js";

export const acceptDonation = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let acceptedDonation;

    await session.withTransaction(async () => {
      const request = await DonationRequest.findOne({
        _id: req.params.requestId,
        ngo: req.user._id,
        status: "OPEN",
      }).session(session);

      if (!request) {
        const error = new Error(
          "This request is unavailable or already closed."
        );
        error.statusCode = 409;
        throw error;
      }

      const donation = await Donation.findOneAndUpdate(
        {
          _id: request.donation,
          status: "OPEN",
          assignedNGO: null,
          expiresAt: { $gt: new Date() },
        },
        {
          $set: {
            status: "ACCEPTED",
            assignedNGO: req.user._id,
            acceptedAt: new Date(),
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!donation) {
        const error = new Error(
          "Another NGO accepted this donation, or it is no longer available."
        );
        error.statusCode = 409;
        throw error;
      }

      request.status = "ACCEPTED";
      request.respondedAt = new Date();
      await request.save({ session });

      await DonationRequest.updateMany(
        {
          donation: donation._id,
          _id: { $ne: request._id },
          status: "OPEN",
        },
        {
          $set: {
            status: "CLOSED",
            respondedAt: new Date(),
          },
        },
        { session }
      );

      acceptedDonation = donation;
    });

    return res.status(200).json({
      message: "Donation accepted successfully.",
      donation: acceptedDonation,
    });
  } catch (error) {
    console.error("Accept donation error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Unable to accept donation.",
    });
  } finally {
    await session.endSession();
  }
};
