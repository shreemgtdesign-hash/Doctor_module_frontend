
import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { initiateVideoCall } from "../../../services/videoConsultationService";
import { connectVideoConsultationSocket } from "../../../services/videoConsultationSocket";

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

      setStatus("Connecting to Agora...");

      // Use the channel, UID and token issued by your backend.
      await client.join(
        doctor.appId,
        channelName,
        doctor.token,
        doctor.uid
      );

      const [audioTrack, videoTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();

      tracksRef.current = [audioTrack, videoTrack];

      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      await client.publish([audioTrack, videoTrack]);

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
