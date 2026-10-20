export const connectVideoConsultationSocket = (
  appointmentNo,
  onMessage,
  onStatusChange
) => {
  if (!appointmentNo) {
    throw new Error("Appointment number is required for WebSocket");
  }

  let wsBase = import.meta.env.VITE_WS_BASE_URL || "ws://72.62.78.53:5000";

  // 72.62.78.53:5000 does not have SSL/TLS certificate; enforce ws:// to prevent ERR_SSL_PROTOCOL_ERROR
  if (wsBase.includes("72.62.78.53")) {
    wsBase = wsBase.replace(/^wss:\/\//i, "ws://");
  } else if (!wsBase.startsWith("ws://") && !wsBase.startsWith("wss://")) {
    wsBase = wsBase.replace(/^https:\/\//i, "wss://").replace(/^http:\/\//i, "ws://");
  }

  const url = new URL(`${wsBase}/ws/chat`);
  url.searchParams.set("consultationId", appointmentNo);
  url.searchParams.set("appointment_id", appointmentNo);

  const socket = new WebSocket(url.toString());

  socket.onopen = () => {
    console.log("✅ Video consultation WebSocket connected successfully:", url.toString());
    onStatusChange?.("connected");
  };

  socket.onmessage = (event) => {
    console.log("📩 Video consultation WebSocket message:", event.data);
    try {
      const message = JSON.parse(event.data);
      onMessage?.(message);
    } catch (error) {
      console.error("Invalid WebSocket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.warn("⚠️ Video consultation WebSocket error:", error);
    onStatusChange?.("error");
  };

  socket.onclose = (event) => {
    console.log("🔌 Video consultation WebSocket disconnected:", event.code, event.reason);
    onStatusChange?.("disconnected");
  };

  return {
    socket,
    disconnect() {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      if (
        socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN
      ) {
        socket.close();
      }
    },
  };
};
