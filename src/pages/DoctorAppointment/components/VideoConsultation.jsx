
import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { initiateVideoCall } from "../../../services/videoConsultationService";
import { connectVideoConsultationSocket } from "../../../services/videoConsultationSocket";

// Set Agora log level to suppress internal racing candidate probe closure logs
try {
  AgoraRTC.setLogLevel(2);
} catch (_) {}

export default function VideoConsultation({ appointmentNo }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const clientRef = useRef(null);
  const tracksRef = useRef([]);
  const startingRef = useRef(false);
const socketRef = useRef(null);

const [socketStatus, setSocketStatus] = useState("disconnected");
const [callStatus, setCallStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [status, setStatus] = useState("Not connected");
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!appointmentNo) return;

  const connection = connectVideoConsultationSocket(
    appointmentNo,
    (message) => {
      switch (message.type) {
        case "connected":
          setSocketStatus("connected");
          break;

        case "INCOMING_CALL":
          // This event is primarily for the patient.
          console.log("Incoming call event:", message);
          break;

        case "CALL_ACCEPTED":
          setCallStatus("connected");
          setStatus("Patient accepted the call");
          break;

        case "CALL_REJECTED":
          setCallStatus("rejected");
          setStatus(
            message.reason
              ? `Patient rejected the call: ${message.reason}`
              : "Patient rejected the call"
          );
          break;

        case "CALL_ENDED":
          setCallStatus("completed");
          setStatus("Call ended");
          break;

        default:
          console.log("Unhandled consultation event:", message.type);
      }
    },
    setSocketStatus
  );

  socketRef.current = connection;

  return () => {
    connection.disconnect();
    socketRef.current = null;
  };
}, [appointmentNo]);
  const cleanupCall = async () => {
    const client = clientRef.current;
    const tracks = tracksRef.current;

    clientRef.current = null;
    tracksRef.current = [];
    startingRef.current = false;

    if (client) {
      client.removeAllListeners();

      try {
        client.stopProxyServer();
      } catch (_) {}

      try {
        await client.leave();
      } catch (err) {
        console.error("Agora leave error:", err);
      }
    }

    tracks.forEach((track) => {
      try {
        track.stop();
        track.close();
      } catch (err) {
        console.error("Track cleanup error:", err);
      }
    });

    if (localVideoRef.current) {
      localVideoRef.current.innerHTML = "";
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.innerHTML = "";
    }

    setInCall(false);
    setMicEnabled(true);
    setCameraEnabled(true);
    setStatus("Not connected");
  };

  const startCall = async () => {
    if (!appointmentNo) {
      setError("Appointment number is missing.");
      return;
    }

    if (startingRef.current || clientRef.current) return;

    startingRef.current = true;
    setLoading(true);
    setError("");
    setStatus("Initiating call and notifying patient...");

    let client;

    try {
      // Initiates the backend call and sends the patient notification.
      const call = await initiateVideoCall(appointmentNo);

      const { channelName, doctor } = call;

      if (
        !channelName ||
        !doctor?.appId ||
        !doctor?.token ||
        doctor.uid == null
      ) {
        throw new Error("Invalid Agora credentials returned by backend.");
      }

      client = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      clientRef.current = client;

      client.on("user-published", async (user, mediaType) => {
        try {
          await client.subscribe(user, mediaType);

          if (mediaType === "video" && user.videoTrack) {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.innerHTML = "";
              user.videoTrack.play(remoteVideoRef.current);
            }

            setStatus("Patient video connected");
          }

          if (mediaType === "audio" && user.audioTrack) {
            user.audioTrack.play();
          }
        } catch (err) {
          console.error("Remote media subscription failed:", err);
          setError("Unable to receive the patient's media.");
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video" && remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = "";
        }

        if (mediaType === "audio") {
          setStatus("Patient microphone is unavailable");
        }
      });

      client.on("user-left", () => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = "";
        }

        setStatus("Patient disconnected");
      });

      client.on("connection-state-change", (curState, revState, reason) => {
        console.log("Agora connection state change:", curState, revState, reason);
        if (curState === "CONNECTED") {
          setStatus("Agora connected");
        } else if (curState === "CONNECTING") {
          setStatus("Connecting to Agora...");
        } else if (curState === "RECONNECTING") {
          setStatus("Reconnecting to video server...");
        } else if (curState === "DISCONNECTED") {
          console.warn("Agora disconnected:", reason);
        }
      });

      client.on("join-fallback-to-proxy", (proxyServer) => {
        console.log("Agora joined via fallback proxy:", proxyServer);
      });

      setStatus("Connecting to Agora...");

      // Convert UID to integer if numeric
      const uid =
        doctor.uid != null && !isNaN(Number(doctor.uid)) && typeof doctor.uid !== "boolean"
          ? Number(doctor.uid)
          : doctor.uid;

      console.log("Agora initiating join:", {
        appId: doctor.appId,
        channelName,
        uid,
      });

      // Join with automatic Cloud Proxy fallback if direct edge WebSocket/UDP is blocked
      try {
        await client.join(
          doctor.appId,
          channelName,
          doctor.token,
          uid
        );
      } catch (directJoinErr) {
        console.warn("Direct Agora connection failed, trying Cloud Proxy (mode 3)...", directJoinErr);
        try {
          client.startProxyServer(3);
          await client.join(
            doctor.appId,
            channelName,
            doctor.token,
            uid
          );
        } catch (proxyErr3) {
          console.warn("Cloud Proxy mode 3 failed, trying TCP TLS 443 (mode 5)...", proxyErr3);
          try {
            client.startProxyServer(5);
            await client.join(
              doctor.appId,
              channelName,
              doctor.token,
              uid
            );
          } catch (tcpErr) {
            throw tcpErr || proxyErr3 || directJoinErr;
          }
        }
      }

      // Create camera and microphone tracks with graceful fallback
      let audioTrack, videoTrack;
      try {
        [audioTrack, videoTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();
      } catch (trackErr) {
        console.warn("Failed creating combined tracks, trying audio only:", trackErr);
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        } catch (audioErr) {
          throw new Error("Unable to access camera or microphone. Please verify device permissions in your browser.");
        }
      }

      tracksRef.current = [audioTrack, videoTrack].filter(Boolean);

      if (videoTrack && localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      if (tracksRef.current.length > 0) {
        await client.publish(tracksRef.current);
      }

      setInCall(true);
      setStatus("Calling patient — waiting for response...");
    } catch (err) {
      console.error("Unable to start video consultation:", err);

      setError(
        err?.message || "Unable to start the video consultation."
      );

      await cleanupCall();
    } finally {
      startingRef.current = false;
      setLoading(false);
    }
  };

  const toggleMicrophone = async () => {
    const audioTrack = tracksRef.current[0];
    if (!audioTrack) return;

    try {
      const nextEnabled = !micEnabled;
      await audioTrack.setEnabled(nextEnabled);
      setMicEnabled(nextEnabled);
    } catch (err) {
      console.error("Microphone toggle failed:", err);
      setError("Unable to change microphone state.");
    }
  };

  const toggleCamera = async () => {
    const videoTrack = tracksRef.current[1];
    if (!videoTrack) return;

    try {
      const nextEnabled = !cameraEnabled;
      await videoTrack.setEnabled(nextEnabled);
      setCameraEnabled(nextEnabled);
    } catch (err) {
      console.error("Camera toggle failed:", err);
      setError("Unable to change camera state.");
    }
  };

  useEffect(() => {
    return () => {
      // Release camera, microphone and Agora connection on unmount.
      void cleanupCall();
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B4A3D]">{status}</p>

        {inCall && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
            Agora connected
          </span>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="relative min-h-48 overflow-hidden rounded-2xl bg-[#173E50]">
          <div
            ref={remoteVideoRef}
            className="absolute inset-0 h-full w-full"
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-white">
            {!inCall && "Patient video will appear here"}
          </div>
        </div>

        <div className="relative min-h-48 overflow-hidden rounded-2xl bg-[#E9DED6]">
          <div
            ref={localVideoRef}
            className="absolute inset-0 h-full w-full"
          />

          {!inCall && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-[#6B4A3D]">
              Your camera preview will appear here
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!inCall ? (
          <button
            type="button"
            disabled={loading}
            onClick={startCall}
            className="rounded-xl bg-[#80513B] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Connecting..." : "Start Video Call"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={toggleMicrophone}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              {micEnabled ? "Mute microphone" : "Unmute microphone"}
            </button>

            <button
              type="button"
              onClick={toggleCamera}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              {cameraEnabled ? "Turn camera off" : "Turn camera on"}
            </button>

            <button
              type="button"
              onClick={cleanupCall}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white"
            >
              Leave Video Call
            </button>
          </>
        )}
      </div>
    </div>
  );
}
