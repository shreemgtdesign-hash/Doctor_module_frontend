export const connectVideoConsultationSocket = (
  appointmentNo,
  onMessage,
  onStatusChange
) => {
  if (!appointmentNo) {
    throw new Error("Appointment number is required for WebSocket");
  }

  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  let wsBase = import.meta.env.VITE_WS_BASE_URL || "ws://72.62.78.53:5000";

  // When loaded over HTTPS in production (e.g. Vercel), browsers strictly forbid insecure ws://
  // and will throw "Uncaught SecurityError: An insecure WebSocket connection may not be initiated from a page loaded over HTTPS."
  // If the target is an unencrypted IP with no SSL certificate (like 72.62.78.53:5000), skip constructing the insecure socket.
  if (isHttps && wsBase.includes("72.62.78.53") && !wsBase.startsWith("wss://")) {
    console.warn(
      "⚠️ WebSocket skipped on HTTPS production: 72.62.78.53 lacks an SSL certificate. Video consultation will connect directly via Agora RTC."
    );
    onStatusChange?.("disconnected");
    return {
      socket: null,
      disconnect() {},
    };
  }

  let socket = null;

  try {
    if (isHttps) {
      wsBase = wsBase.replace(/^ws:\/\//i, "wss://");
    }

    const url = new URL(`${wsBase}/ws/chat`);
    url.searchParams.set("consultationId", appointmentNo);
    url.searchParams.set("appointment_id", appointmentNo);

    socket = new WebSocket(url.toString());

    socket.onopen = () => {
      console.log("✅ Video consultation WebSocket connected:", url.toString());
      onStatusChange?.("connected");
    };

    socket.onmessage = (event) => {
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
      console.log("🔌 Video consultation WebSocket disconnected:", event?.code, event?.reason);
      onStatusChange?.("disconnected");
    };
  } catch (err) {
    console.warn("⚠️ WebSocket connection failed (e.g. HTTPS mixed content or network restrictions):", err);
    onStatusChange?.("error");
  }

  return {
    socket,
    disconnect() {
      if (!socket) return;
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      try {
        if (
          socket.readyState === WebSocket.CONNECTING ||
          socket.readyState === WebSocket.OPEN
        ) {
          socket.close();
        }
      } catch (_) {}
    },
  };
};
