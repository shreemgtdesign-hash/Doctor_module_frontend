import {
  registerFCMToken,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notificationApi";


// ========================================
// Register FCM Token
// ========================================

export const saveFCMToken =
  async (payload) => {

    const response =
      await registerFCMToken(
        payload
      );

    return response.data;

  };


// ========================================
// Get Notifications
// ========================================

export const fetchNotifications =
  async () => {

    const response =
      await getNotifications();

    return response.data;

  };

export const readNotification = async (
  notificationId
) => {

  const response =
    await markNotificationAsRead(
      notificationId
    );

  return response.data;

};


// ======================================================
// MARK ALL NOTIFICATIONS AS READ
// ======================================================

export const readAllNotifications = async () => {

  const response =
    await markAllNotificationsAsRead();

  return response.data;

};