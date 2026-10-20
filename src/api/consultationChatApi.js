import api from "./axios";

/**
 * Consultation Chat API endpoints
 */

// 1. Get Chat Status / Availability
// GET /consultations/:consultationId/chat-status
export const getChatStatus = (consultationId) => {
  return api.get(`/consultations/${consultationId}/chat-status`);
};

// 2. Get Chat History
// GET /consultations/:consultationId/messages?page=1&limit=30
export const getChatMessages = (consultationId, params = { page: 1, limit: 30 }) => {
  return api.get(`/consultations/${consultationId}/messages`, { params });
};

// 3. Send Message via REST
// POST /consultations/:consultationId/messages
export const sendChatMessage = (consultationId, payload) => {
  return api.post(`/consultations/${consultationId}/messages`, {
    message: payload.message,
    message_type: payload.message_type || "TEXT",
    sender_id: payload.sender_id,
    sender_role: payload.sender_role || "DOCTOR",
    sender_name: payload.sender_name,
  });
};

// 4. Batch Mark Messages as Read
// POST /consultations/:consultationId/messages/read
export const markChatMessagesAsRead = (consultationId) => {
  return api.post(`/consultations/${consultationId}/messages/read`);
};

// 5. Single Message Mark as Read
// POST /messages/:messageId/read
export const markSingleMessageAsRead = (messageId) => {
  return api.post(`/messages/${messageId}/read`);
};

// 6. Upload File
// POST /consultations/:consultationId/upload
export const uploadChatFile = (consultationId, formData) => {
  return api.post(`/consultations/${consultationId}/upload`, formData);
};

