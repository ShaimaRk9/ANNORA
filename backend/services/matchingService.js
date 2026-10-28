
import User from "../models/User.js";

const MAX_RESULTS = 5;

export async function findMatchingNGOs(donation) {
  if (
    !donation.location?.coordinates ||
    donation.location.coordinates.length !== 2
  ) {
    throw new Error("Donation must have valid location coordinates");
  }

  const [longitude, latitude] = donation.location.coordinates;

  // User.js currently defines "recipient", not "NGO".
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
