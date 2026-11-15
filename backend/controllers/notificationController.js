const notificationService =
  require(
    "../services/notificationService"
  );


// Get notifications
const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await notificationService
        .getNotifications(
          req.user.id
        );

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Unread count
const getUnreadCount = async (
  req,
  res
) => {
  try {
    const count =
      await notificationService
        .getUnreadCount(
          req.user.id
        );

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Mark one read
const markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await notificationService
        .markAsRead(
          req.user.id,
          req.params.id
        );

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


// Mark all read
const markAllAsRead = async (
  req,
  res
) => {
  try {
    await notificationService
      .markAllAsRead(
        req.user.id
      );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};