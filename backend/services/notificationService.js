const Notification = require(
  "../models/Notification"
);


// Create notification
const createNotification = async (
  userId,
  title,
  message,
  type = "system",
  relatedId = null
) => {
  return await Notification.create({
    user: userId,
    title,
    message,
    type,
    relatedId,
  });
};


// Get notifications
const getNotifications = async (
  userId
) => {
  return await Notification.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};


// Get unread count
const getUnreadCount = async (
  userId
) => {
  return await Notification.countDocuments({
    user: userId,
    isRead: false,
  });
};


// Mark one as read
const markAsRead = async (
  userId,
  notificationId
) => {
  const notification =
    await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: userId,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

  if (!notification) {
    throw new Error(
      "Notification not found"
    );
  }

  return notification;
};


// Mark all as read
const markAllAsRead = async (
  userId
) => {
  await Notification.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      isRead: true,
    }
  );
};


module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};