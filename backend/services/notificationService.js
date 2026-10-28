
import Notification from "../models/notification.js";

/**
 * Create a notification for one user.
 */
export const createNotification = async ({
  userId,
  title,
  message,
  type = "system",
  relatedDonation = null,
  relatedMatchRequest = null,
  relatedPickup = null,
  link = "",
}) => {
  if (!userId) {
    throw new Error("A recipient user ID is required.");
  }

  if (!title || !message) {
    throw new Error("Notification title and message are required.");
  }

  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    relatedDonation,
    relatedMatchRequest,
    relatedPickup,
    link,
  });

  return notification;
};

/**
 * Create the same notification for multiple users.
 */
export const createBulkNotifications = async ({
  userIds,
  title,
  message,
  type = "system",
  relatedDonation = null,
  relatedMatchRequest = null,
  relatedPickup = null,
  link = "",
}) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  if (!title || !message) {
    throw new Error("Notification title and message are required.");
  }

  const uniqueUserIds = [
    ...new Set(userIds.filter(Boolean).map(String)),
  ];

  const notifications = uniqueUserIds.map((userId) => ({
    user: userId,
    title,
    message,
    type,
    relatedDonation,
    relatedMatchRequest,
    relatedPickup,
    link,
  }));

  return Notification.insertMany(notifications);
};

/**
 * Mark a notification as read.
 * The user can only mark their own notification as read.
 */
export const markNotificationRead = async ({
  notificationId,
  userId,
}) => {
  if (!notificationId || !userId) {
    throw new Error("Notification ID and user ID are required.");
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      user: userId,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return notification;
};

/**
 * Get a user's notifications.
 */
export const getUserNotifications = async ({
  userId,
  unreadOnly = false,
  limit = 20,
}) => {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  const safeLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || 20, 1),
    100
  );

  const filter = { user: userId };

  if (unreadOnly) {
    filter.isRead = false;
  }

  return Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .lean();
};
