import api from "./axios";


// ========================================
// Register FCM Device Token
// ========================================

export const registerFCMToken = (
  data
) => {

  return api.post(
    "/notifications/register-token",
    data
  );

};


// ========================================
// Get Notifications
// ========================================

export const getNotifications = () => {

  return api.get(
    "/notifications"
  );

};


export const markNotificationAsRead = (notificationId) => {
  return api.put(
    `/notifications/${notificationId}/read`
  );
};


// ======================================================
// MARK ALL NOTIFICATIONS AS READ
// ======================================================

export const markAllNotificationsAsRead = () => {
  return api.put(
    "/notifications/read-all"
  );
};