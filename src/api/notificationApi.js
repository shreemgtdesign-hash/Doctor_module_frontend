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