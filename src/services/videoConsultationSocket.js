
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

export const connectVideoConsultationSocket = (
  appointmentNo,
  onMessage,
  onStatusChange
) => {
  if (!appointmentNo) {
    throw new Error("Appointment number is required for WebSocket");
  }

  if (!WS_BASE_URL) {
    throw new Error("VITE_WS_BASE_URL is not configured");
  }

  const url = new URL(`${WS_BASE_URL}/ws/chat`);
  url.searchParams.set("consultationId", appointmentNo);

  const socket = new WebSocket(url.toString());

socket.onopen = () => {
  console.log("✅ WebSocket connected successfully");
  onStatusChange?.("connected");
};

socket.onmessage = (event) => {
  console.log("📩 WebSocket message:", event.data);

  try {
    const message = JSON.parse(event.data);
    onMessage?.(message);
  } catch (error) {
    console.error("Invalid WebSocket message:", error);
  }
};

socket.onerror = (error) => {
  console.error("❌ WebSocket error:", error);
  onStatusChange?.("error");
};

socket.onclose = (event) => {
  console.log("🔌 WebSocket disconnected:", event.code, event.reason);
  onStatusChange?.("disconnected");
};

  socket.onerror = (error) => {
    console.error("Video consultation WebSocket error:", error);
    onStatusChange?.("error");
  };

  socket.onclose = () => {
    console.log("Video consultation WebSocket disconnected");
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
