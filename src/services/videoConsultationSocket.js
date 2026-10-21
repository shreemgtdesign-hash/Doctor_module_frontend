// src/services/videoConsultationSocket.js

const RAW_WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

export const getWebSocketUrl = (appointmentNo, extraParams = {}) => {
  if (!appointmentNo) {
    throw new Error("Appointment number is required for WebSocket");
  }

  let baseUrl = (RAW_WS_BASE_URL || "").trim();

  const isPageHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";

  if (!baseUrl && typeof window !== "undefined") {
    baseUrl = `${isPageHttps ? "wss" : "ws"}://${window.location.host}`;
  }

  // Enforce wss:// on HTTPS environments
  if (baseUrl.startsWith("http://")) {
    baseUrl = (isPageHttps ? "wss://" : "ws://") + baseUrl.slice(7);
  } else if (baseUrl.startsWith("https://")) {
    baseUrl = "wss://" + baseUrl.slice(8);
  } else if (baseUrl.startsWith("ws://")) {
    if (isPageHttps) {
      baseUrl = "wss://" + baseUrl.slice(5);
    }
  } else if (!baseUrl.startsWith("wss://")) {
    baseUrl = (isPageHttps ? "wss://" : "ws://") + baseUrl;
  }

  baseUrl = baseUrl.replace(/\/+$/, "");
  const endpoint = baseUrl.endsWith("/ws/chat") ? baseUrl : `${baseUrl}/ws/chat`;
  const url = new URL(endpoint);

  url.searchParams.set("consultationId", appointmentNo);
  url.searchParams.set("appointment_id", appointmentNo);

  if (extraParams.userId || extraParams.user_id) {
    url.searchParams.set("userId", extraParams.userId || extraParams.user_id);
    url.searchParams.set("user_id", extraParams.userId || extraParams.user_id);
  }
  if (extraParams.role) url.searchParams.set("role", extraParams.role);
  if (extraParams.token) url.searchParams.set("token", extraParams.token);
  if (extraParams.name) url.searchParams.set("name", extraParams.name);

  return url.toString();
};

export const connectVideoConsultationSocket = (
  appointmentNo,
  onMessage,
  onStatusChange,
  extraParams = {}
) => {
  if (!appointmentNo) {
    throw new Error("Appointment number is required for WebSocket");
  }

  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";

  let socket = null;

  try {
    const wsUrl = getWebSocketUrl(appointmentNo, extraParams);

    // If loaded on HTTPS and still using raw IP 72.62.78.53:5000 (which has no SSL cert),
    // log helpful instructions so developers/users know how to configure the reverse proxy
    try {
      const parsedUrl = new URL(wsUrl);
      if (
        isHttps &&
        parsedUrl.hostname === "72.62.78.53" &&
        parsedUrl.port === "5000"
      ) {
        console.warn(
          "⚠️ WebSocket notice: wss://72.62.78.53:5000 was requested over HTTPS. Raw IP port 5000 lacks an SSL certificate (net::ERR_SSL_PROTOCOL_ERROR). Ensure an SSL reverse proxy (e.g. wss://api.sadop.in or wss://72-62-78-53.sslip.io) is configured on Hostinger CloudPanel/Nginx, or set VITE_WS_BASE_URL accordingly in Vercel."
        );
      }
    } catch (_) {}

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("✅ Video consultation WebSocket connected:", wsUrl);
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
      console.log(
        "🔌 Video consultation WebSocket disconnected:",
        event?.code,
        event?.reason
      );
      onStatusChange?.("disconnected");
    };
  } catch (err) {
    console.warn("⚠️ WebSocket connection failed:", err);
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
