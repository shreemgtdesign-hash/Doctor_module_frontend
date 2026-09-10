import {
  registerFCMToken,
  getNotifications,
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