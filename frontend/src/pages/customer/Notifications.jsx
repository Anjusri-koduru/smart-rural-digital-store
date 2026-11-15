import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Package,
  Tag,
  Gift,
  ShoppingBag,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [markingAll, setMarkingAll] =
    useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response =
        await getNotifications();

      if (response.success) {
        setNotifications(
          response.notifications || []
        );
      }
    } catch (error) {
      console.error(
        "Notifications error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (
    notificationId
  ) => {
    try {
      const response =
        await markNotificationAsRead(
          notificationId
        );

      if (response.success) {
        setNotifications((previous) =>
          previous.map((notification) =>
            notification._id ===
            notificationId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification
          )
        );
      }
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to mark notification as read"
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);

      const response =
        await markAllNotificationsAsRead();

      if (response.success) {
        setNotifications((previous) =>
          previous.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );

        toast.success(
          "All notifications marked as read"
        );
      }
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to mark all notifications"
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <Package size={21} />;

      case "product":
        return <ShoppingBag size={21} />;

      case "coupon":
        return <Tag size={21} />;

      case "referral":
        return <Gift size={21} />;

      default:
        return <Info size={21} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="notification-page">

      {/* Header */}

      <div className="notification-page-header">

        <div className="notification-title">

          <div className="notification-header-icon">
            <Bell size={25} />
          </div>

          <div>
            <h1>Notifications</h1>

            <p>
              Stay updated with your
              Smart Rural Digital Store activity
            </p>
          </div>

        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="mark-all-button"
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
          >
            <CheckCheck size={18} />

            {markingAll
              ? "Marking..."
              : "Mark all as read"}
          </button>
        )}

      </div>


      {/* Unread Count */}

      {notifications.length > 0 && (
        <div className="notification-summary">

          <span>
            {unreadCount} unread
          </span>

          <span>
            {notifications.length} total
          </span>

        </div>
      )}


      {/* Notifications */}

      {notifications.length === 0 ? (
        <div className="notification-empty">

          <div className="notification-empty-icon">
            <Bell size={40} />
          </div>

          <h2>
            No notifications
          </h2>

          <p>
            You are all caught up!
          </p>

        </div>
      ) : (
        <div className="notification-list">

          {notifications.map(
            (notification) => (
              <div
                key={notification._id}
                className={`notification-card ${
                  notification.isRead
                    ? "read"
                    : "unread"
                }`}
              >

                <div
                  className={`notification-icon notification-${notification.type}`}
                >
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>


                <div className="notification-content">

                  <div className="notification-card-top">

                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.isRead && (
                      <span className="unread-dot">
                        New
                      </span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <small>
                    {formatDate(
                      notification.createdAt
                    )}
                  </small>

                </div>


                {!notification.isRead && (
                  <button
                    type="button"
                    className="notification-read-button"
                    onClick={() =>
                      handleMarkAsRead(
                        notification._id
                      )
                    }
                    title="Mark as read"
                  >
                    <Check size={18} />
                  </button>
                )}

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
};

export default Notifications;