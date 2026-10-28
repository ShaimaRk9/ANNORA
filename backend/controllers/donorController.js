
import Donation from "../models/Donation.js";
import User from "../models/User.js";

// GET /api/donor/dashboard
export const getDashboard = async (req, res) => {
  try {
    const donorId = req.user._id;

    const [
      totalDonations,
      activeDonations,
      completedDonations,
      recentDonations,
    ] = await Promise.all([
      Donation.countDocuments({ donor: donorId }),
      Donation.countDocuments({
        donor: donorId,
        status: {
          $nin: ["COMPLETED", "CANCELLED", "EXPIRED", "DELIVERED"],
        },
      }),
      Donation.countDocuments({
        donor: donorId,
        status: { $in: ["COMPLETED", "DELIVERED"] },
      }),
      Donation.find({ donor: donorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalDonations,
        activeDonations,
        completedDonations,
        recentDonations,
      },
    });
  } catch (error) {
    console.error("getDashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load donor dashboard",
    });
  }
};

// GET /api/donor/donations/my
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("getMyDonations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your donations",
    });
  }
};

// GET /api/donor/donations/history
export const getDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.find({
      donor: req.user._id,
      status: {
        $in: ["COMPLETED", "DELIVERED", "CANCELLED", "EXPIRED"],
      },
    })
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error("getDonationHistory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donation history",
    });
  }
};

// GET /api/donor/profile
export const getBusinessProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error("getBusinessProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donor profile",
    });
  }
};

// PATCH /api/donor/profile
export const updateBusinessProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "businessName",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "businessType",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile fields provided",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: user,
    });
  } catch (error) {
    console.error("updateBusinessProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update donor profile",
    });
  }
};

// GET /api/donor/settings
export const getDonorSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Donor account not found",
      });
    }

    return res.status(200).json({
      success: true,
      settings: user.settings || {},
    });
  } catch (error) {
    console.error("getDonorSettings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

// PATCH /api/donor/settings
export const updateDonorSettings = async (req, res) => {
  try {
    const allowedSettings = [
      "notifications",
      "emailNotifications",
      "smsNotifications",
      "language",
    ];

    const settings = {};

    for (const field of allowedSettings) {
      if (req.body[field] !== undefined) {
        settings[`settings.${field}`] = req.body[field];
      }
    }

    if (Object.keys(settings).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid settings provided",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: settings },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Donor account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: user.settings || {},
    });
  } catch (error) {
    console.error("updateDonorSettings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};
