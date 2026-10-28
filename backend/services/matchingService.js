
import User from "../models/User.js";

const MAX_RESULTS = 5;

const normalize = (value) =>
  String(value || "").trim().toLowerCase();

// Calculate how well a donation matches an NGO request
export function calculateMatchScore(donation, request) {
  const reasons = [];
  let score = 0;

  // 1. Food type compatibility
  const acceptedTypes = (request.acceptedFoodTypes || []).map(normalize);
  const foodType = normalize(donation.foodType);

  const foodMatches =
    acceptedTypes.includes("all") ||
    acceptedTypes.includes("any") ||
    acceptedTypes.includes(foodType);

  if (!foodMatches) {
    return {
      score: 0,
      suitable: false,
      reasons: ["Food type does not match NGO requirements"],
    };
  }

  score += 30;
  reasons.push("Food type matches");

  // 2. Dietary compatibility
  const preference = normalize(request.dietaryPreference);
  const description = normalize(
    `${donation.foodName} ${donation.description} ${donation.foodType}`
  );

  const containsNonVeg =
    description.includes("non-vegetarian") ||
    description.includes("non vegetarian") ||
    description.includes("chicken") ||
    description.includes("meat") ||
    description.includes("fish");

  const containsDairyOrEgg =
    description.includes("milk") ||
    description.includes("cheese") ||
    description.includes("butter") ||
    description.includes("egg");

  let dietaryCompatible = false;

  if (preference === "any") {
    dietaryCompatible = true;
  } else if (preference === "vegetarian") {
    dietaryCompatible = !containsNonVeg;
  } else if (preference === "vegan") {
    dietaryCompatible = !containsNonVeg && !containsDairyOrEgg;
  } else if (preference === "non-vegetarian") {
    dietaryCompatible = true;
  }

  if (!dietaryCompatible) {
    return {
      score: 0,
      suitable: false,
      reasons: ["Dietary compatibility could not be confirmed"],
    };
  }

  score += 20;
  reasons.push("Dietary preference appears compatible");

  // 3. Quantity and unit compatibility
  const donationUnit = normalize(donation.unit || "portions");
  const requestUnit = normalize(request.unit || "portions");

  if (donationUnit !== requestUnit) {
    return {
      score: 0,
      suitable: false,
      reasons: ["Donation and request units do not match"],
    };
  }

  if (Number(donation.quantity) < Number(request.requiredQuantity)) {
    return {
      score: 0,
      suitable: false,
      reasons: ["Available quantity is insufficient"],
    };
  }

  score += 20;
  reasons.push("Available quantity meets requirements");

  // 4. Expiry and pickup deadline validation
  const now = new Date();
  const expiry = new Date(donation.expiryTime);
  const deadline = new Date(request.pickupDeadline);

  if (
    Number.isNaN(expiry.getTime()) ||
    Number.isNaN(deadline.getTime()) ||
    expiry <= now ||
    deadline <= now ||
    deadline > expiry
  ) {
    return {
      score: 0,
      suitable: false,
      reasons: ["Pickup deadline is invalid or after food expiry"],
    };
  }

  score += 20;
  reasons.push("Pickup deadline is before food expiry");

  // 5. Urgency bonus
  const hoursUntilExpiry = (expiry - now) / (1000 * 60 * 60);

  if (hoursUntilExpiry <= 6) {
    score += 10;
    reasons.push("Urgent: food expires within 6 hours");
  } else if (hoursUntilExpiry <= 24) {
    score += 5;
    reasons.push("Food expires within 24 hours");
  }

  return {
    score: Math.min(score, 100),
    suitable: true,
    reasons,
  };
}

// Generate recommendations between donations and open requests
export function getRecommendations(donations, requests) {
  const recommendations = [];

  for (const donation of donations) {
    if (donation.status !== "Available") continue;

    for (const request of requests) {
      if (request.status !== "Open") continue;

      const match = calculateMatchScore(donation, request);

      if (match.suitable) {
        recommendations.push({
          donation,
          request,
          score: match.score,
          reasons: match.reasons,
        });
      }
    }
  }

  return recommendations.sort((a, b) => b.score - a.score);
}

// Find verified recipient accounts for a donation
export async function findMatchingNGOs(donation) {
  if (
    !donation.location?.coordinates ||
    donation.location.coordinates.length !== 2
  ) {
    throw new Error("Donation must have valid location coordinates");
  }

  const recipients = await User.find({
    role: "recipient",
    isVerified: true,
    accountStatus: "active",
  })
    .select("_id name address")
    .lean();

  const matches = recipients.map((recipient) => ({
    ngoId: recipient._id,
    name: recipient.name,
    distanceKm: null,
    score: 0,
    reasons: [
      "Verified active recipient account",
      "Distance matching is unavailable until recipient location data is added",
    ],
  }));

  return matches.slice(0, MAX_RESULTS);
}
