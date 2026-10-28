import "dotenv/config";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();

const requiredEnv = [
  "JWT_SECRET",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "ADMIN_EMAIL",
  "ADMIN_NAME",
  "MONGODB_URI",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters.");
}

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === "production";
const ORGANIZATION_ROLES = ["RESTAURANT", "NGO"];
const USER_ROLES = ["RESTAURANT", "NGO", "RECEIVER", "VOLUNTEER"];
const VERIFICATION_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

// -------------------- ADMIN SETTINGS MODEL --------------------

const adminSettingsSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminSettings =
  mongoose.models.AdminSettings ||
  mongoose.model("AdminSettings", adminSettingsSchema);

// -------------------- FOOD SAFETY REVIEW MODEL --------------------

const safetyReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    organization: { type: String, trim: true, default: "" },
    details: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_REVIEW", "RESOLVED"],
      default: "OPEN",
    },
    notes: { type: String, trim: true, default: "", maxlength: 2000 },
    createdBy: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

const SafetyReview =
  mongoose.models.SafetyReview ||
  mongoose.model("SafetyReview", safetyReviewSchema);

// -------------------- ADMIN HELPERS --------------------

async function getAdminSettings() {
  let settings = await AdminSettings.findOne();

  if (!settings) {
    settings = await AdminSettings.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      name: process.env.ADMIN_NAME,
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
    });
  }

  return settings;
}

function createAdminToken(settings) {
  return jwt.sign(
    {
      role: "admin",
      email: settings.email,
      name: settings.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
}

function requireAdmin(req, res, next) {
  const token = req.cookies.annora_admin;

  if (!token) {
    return res.status(401).json({
      message: "Please log in as admin.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Session expired. Log in again.",
    });
  }
}

// -------------------- SIGNUP --------------------

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role, registrationNumber } =
      req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Name, valid email and password (minimum 8 characters) are required.",
      });
    }

    if (!ORGANIZATION_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Please select Donor or NGO.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role,
      registrationNumber:
        typeof registrationNumber === "string"
          ? registrationNumber.trim()
          : "",
      verificationStatus: "PENDING",
    });

    return res.status(201).json({
      message: "Registration submitted! Please wait for admin approval.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    console.error("Signup error:", error.message);

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
});

// -------------------- ADMIN LOGIN --------------------

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid admin username or password.",
      });
    }

    const settings = await getAdminSettings();

    if (
      username !== settings.username ||
      !(await bcrypt.compare(password, settings.passwordHash))
    ) {
      return res.status(401).json({
        message: "Invalid admin username or password.",
      });
    }

    res.cookie("annora_admin", createAdminToken(settings), {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Admin login successful.",
      admin: {
        name: settings.name,
        email: settings.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in. Please try again.",
    });
  }
});

// -------------------- ADMIN SESSION --------------------

app.get("/api/admin/me", requireAdmin, async (req, res) => {
  try {
    const settings = await getAdminSettings();

    return res.json({
      admin: {
        name: settings.name,
        email: settings.email,
        username: settings.username,
        role: "admin",
      },
    });
  } catch {
    return res.status(500).json({
      message: "Could not load admin profile.",
    });
  }
});

// -------------------- LOGOUT --------------------

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("annora_admin", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });

  res.json({ message: "Logged out successfully." });
});

// -------------------- USERS LIST --------------------

app.get("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const filter = {
      role: { $in: USER_ROLES },
    };

    if (USER_ROLES.includes(req.query.role)) {
      filter.role = req.query.role;
    }

    if (VERIFICATION_STATUSES.includes(req.query.status)) {
      filter.verificationStatus = req.query.status;
    }

    const users = await User.find(filter)
      .select(
        "name email role registrationNumber verificationStatus rejectionReason createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.json({ users });
  } catch (error) {
    console.error("Admin users error:", error.message);

    res.status(500).json({
      message: "Failed to load users.",
    });
  }
});

// -------------------- DASHBOARD + REPORT COUNTS --------------------

app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const [
      totalDonors,
      totalReceivers,
      approvedDonors,
      approvedReceivers,
      pendingUsers,
      registeredUsers,
      pendingDonors,
      pendingReceivers,
      rejectedDonors,
      rejectedReceivers,
      safetyReviews,
    ] = await Promise.all([
      User.countDocuments({ role: "RESTAURANT" }),

      User.countDocuments({ role: "NGO" }),

      User.countDocuments({
        role: "RESTAURANT",
        verificationStatus: "APPROVED",
      }),

      User.countDocuments({
        role: "NGO",
        verificationStatus: "APPROVED",
      }),

      User.find({
        role: { $in: ORGANIZATION_ROLES },
        verificationStatus: "PENDING",
      })
        .select(
          "name email role registrationNumber verificationStatus createdAt"
        )
        .sort({ createdAt: -1 })
        .lean(),

      User.countDocuments({
        role: { $in: USER_ROLES },
      }),

      User.countDocuments({
        role: "RESTAURANT",
        verificationStatus: "PENDING",
      }),

      User.countDocuments({
        role: "NGO",
        verificationStatus: "PENDING",
      }),

      User.countDocuments({
        role: "RESTAURANT",
        verificationStatus: "REJECTED",
      }),

      User.countDocuments({
        role: "NGO",
        verificationStatus: "REJECTED",
      }),

      SafetyReview.countDocuments(),
    ]);

    res.json({
      stats: {
        totalDonors,
        totalReceivers,
        registeredUsers,
        approvedDonors,
        approvedReceivers,
        pendingDonors,
        pendingReceivers,
        totalPending: pendingDonors + pendingReceivers,
        rejectedDonors,
        rejectedReceivers,
        safetyReviews,
        totalDonations: null,
        mealsRescued: null,
      },
      pendingUsers,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);

    res.status(500).json({
      message: "Failed to load dashboard data.",
    });
  }
});

// -------------------- APPROVE / REJECT USER --------------------

async function decideUser(req, res, status) {
  try {
    const update = {
      $set: { verificationStatus: status },
    };

    if (status === "APPROVED") {
      update.$unset = { rejectionReason: 1 };
    } else {
      update.$set.rejectionReason =
        typeof req.body?.rejectionReason === "string"
          ? req.body.rejectionReason.trim()
          : "Rejected by admin.";
    }

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: { $in: ORGANIZATION_ROLES },
        verificationStatus: "PENDING",
      },
      update,
      { new: true, runValidators: true }
    ).select("name email role verificationStatus rejectionReason");

    if (!user) {
      return res.status(404).json({
        message: "Pending registration not found.",
      });
    }

    return res.json({
      message: `Registration ${status.toLowerCase()}.`,
      user,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    console.error("User decision error:", error.message);

    return res.status(500).json({
      message: "Failed to update registration.",
    });
  }
}

app.patch("/api/admin/users/:id/approve", requireAdmin, (req, res) =>
  decideUser(req, res, "APPROVED")
);

app.patch("/api/admin/users/:id/reject", requireAdmin, (req, res) =>
  decideUser(req, res, "REJECTED")
);

// -------------------- FOOD SAFETY REVIEWS --------------------

// Get all reviews
app.get("/api/admin/safety-reviews", requireAdmin, async (req, res) => {
  try {
    const reviews = await SafetyReview.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({ reviews });
  } catch (error) {
    console.error("Safety reviews error:", error.message);

    res.status(500).json({
      message: "Could not load safety reviews.",
    });
  }
});

// Create a review
app.post("/api/admin/safety-reviews", requireAdmin, async (req, res) => {
  try {
    const { title, organization = "", details } = req.body || {};

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof details !== "string" ||
      !details.trim()
    ) {
      return res.status(400).json({
        message: "Review title and details are required.",
      });
    }

    const review = await SafetyReview.create({
      title: title.trim(),
      organization: String(organization).trim(),
      details: details.trim(),
      createdBy: req.admin.name || "Admin",
    });

    res.status(201).json({
      message: "Safety review created.",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error.message);

    res.status(500).json({
      message: "Could not create safety review.",
    });
  }
});

// Update review status and notes
app.patch(
  "/api/admin/safety-reviews/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const { status, notes } = req.body || {};
      const update = {};

      if (status !== undefined) {
        if (!["OPEN", "IN_REVIEW", "RESOLVED"].includes(status)) {
          return res.status(400).json({
            message: "Invalid review status.",
          });
        }

        update.status = status;
      }

      if (notes !== undefined) {
        if (typeof notes !== "string") {
          return res.status(400).json({
            message: "Notes must be text.",
          });
        }

        update.notes = notes.trim();
      }

      if (Object.keys(update).length === 0) {
        return res.status(400).json({
          message: "Provide a status or notes update.",
        });
      }

      const review = await SafetyReview.findByIdAndUpdate(
        req.params.id,
        { $set: update },
        { new: true, runValidators: true }
      );

      if (!review) {
        return res.status(404).json({
          message: "Review not found.",
        });
      }

      res.json({
        message: "Safety review updated.",
        review,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid review ID.",
        });
      }

      console.error("Update review error:", error.message);

      res.status(500).json({
        message: "Could not update safety review.",
      });
    }
  }
);

// -------------------- ADMIN SETTINGS --------------------

app.patch("/api/admin/settings", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      currentPassword,
      newPassword,
    } = req.body || {};

    const settings = await getAdminSettings();

    if (typeof name === "string" && name.trim()) {
      settings.name = name.trim();
    }

    if (typeof email === "string" && email.trim()) {
      settings.email = email.trim().toLowerCase();
    }

    if (typeof username === "string" && username.trim()) {
      settings.username = username.trim();
    }

    if (newPassword !== undefined && newPassword !== "") {
      if (
        typeof currentPassword !== "string" ||
        !(await bcrypt.compare(currentPassword, settings.passwordHash))
      ) {
        return res.status(400).json({
          message: "Current password is incorrect.",
        });
      }

      if (typeof newPassword !== "string" || newPassword.length < 8) {
        return res.status(400).json({
          message: "New password must be at least 8 characters.",
        });
      }

      settings.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await settings.save();

    res.json({
      message:
        "Settings saved. Log in again if you changed your username or password.",
      admin: {
        name: settings.name,
        email: settings.email,
        username: settings.username,
        role: "admin",
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "That username is already in use.",
      });
    }

    console.error("Settings update error:", error.message);

    res.status(500).json({
      message: "Could not save settings.",
    });
  }
});

// -------------------- HEALTH CHECK --------------------

app.get("/", (req, res) => {
  res.json({
    message: "ANNORA API is running.",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// -------------------- START SERVER --------------------

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");

    app.listen(port, () => {
      console.log(`ANNORA backend running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();