const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const notificationController =
  require(
    "../controllers/notificationController"
  );


router.use(authMiddleware);


// All notifications
router.get(
  "/",
  notificationController.getNotifications
);


// Unread count
router.get(
  "/unread-count",
  notificationController.getUnreadCount
);


// Mark one as read
router.put(
  "/:id/read",
  notificationController.markAsRead
);


// Mark all as read
router.put(
  "/read-all",
  notificationController.markAllAsRead
);


module.exports = router;