import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  HiChevronUp,
  HiChevronDown,
  HiArrowLeft,
  HiPaperAirplane,
  HiMicrophone,
  HiPaperClip,
} from "react-icons/hi2";
import {
  getChatStatus,
  getChatMessages,
  sendChatMessage,
  markChatMessagesAsRead,
  uploadChatFile,
} from "../../../api/consultationChatApi";
import { getWebSocketUrl } from "../../../services/videoConsultationSocket";

const formatMessageTime = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
};

const formatTimeSlot = (time) => {
  if (!time) return "";
  if (time.includes("AM") || time.includes("PM")) return time;
  const [hour, minute] = time.split(":");
  const h = Number(hour);
  if (isNaN(h)) return time;
  return `${((h + 11) % 12) + 1}:${minute || "00"} ${h >= 12 ? "PM" : "AM"}`;
};

// Check if an appointment is specifically a video consultation
const isVideoConsultation = (patient, profile) => {
  if (!patient) return false;

  if (
    patient.is_video === true ||
    patient.is_video_consultation === true ||
    patient.appointment?.is_video === true ||
    patient.appointment?.is_video_consultation === true ||
    profile?.is_video === true ||
    profile?.is_video_consultation === true
  ) {
    return true;
  }

  const apptNo = String(
    patient.appointment_no ||
    patient.appointmentNo ||
    patient.token ||
    patient.id ||
    ""
  ).toUpperCase();

  if (apptNo.startsWith("VC") || apptNo.includes("VIDEO")) {
    return true;
  }

  const rawValues = [
    patient.type,
    patient.consultation_type,
    patient.appointment_type,
    patient.mode,
    patient.consultation_mode,
    patient.service_type,
    patient.category,
    patient.reason,
    patient.notes,
    patient.description,
    patient.appointment?.type,
    patient.appointment?.consultation_type,
    patient.appointment?.appointment_type,
    patient.appointment?.mode,
    patient.appointment?.reason,
    patient.visit?.type,
    profile?.type,
    profile?.consultation_type,
    profile?.appointment_type,
    profile?.mode,
    profile?.consultation_mode,
    profile?.reason,
  ];

  return rawValues.some((val) => {
    if (!val || typeof val !== "string") return false;
    const lower = val.toLowerCase().trim();

    // Check for video/teleconsultation indicators
    if (
      lower.includes("video") ||
      lower === "online" ||
      lower === "teleconsultation" ||
      lower === "virtual"
    ) {
      if (
        (lower === "in-person and video" || lower === "in_person and video") &&
        !lower.includes("consultation")
      ) {
        return false;
      }
      return true;
    }

    return false;
  });
};

// Check if appointment is not cancelled or rejected
const isNotCancelled = (patient) => {
  if (!patient) return false;
  const status = String(patient.status || "").toLowerCase().trim();
  const cancelledStatuses = ["cancelled", "canceled", "rejected"];
  return !cancelledStatuses.includes(status);
};

// Safely extract text string from message object
const extractMessageText = (msg) => {
  if (!msg) return "";
  if (typeof msg === "string") return msg;
  if (typeof msg.message === "string") return msg.message;
  if (typeof msg.text === "string") return msg.text;
  if (typeof msg.message === "object" && msg.message !== null) {
    if (typeof msg.message.message === "string") return msg.message.message;
    if (typeof msg.message.text === "string") return msg.message.text;
    return "";
  }
  return "";
};

// Normalize message objects so no nested message object causes React child error
const sanitizeMessage = (m) => {
  if (!m) return null;
  if (typeof m === "string") {
    return {
      id: `msg_${Date.now()}`,
      message: m,
      createdAt: new Date().toISOString(),
    };
  }
  if (m.message && typeof m.message === "object") {
    return {
      ...m.message,
      ...m,
      message: extractMessageText(m.message) || extractMessageText(m) || "",
    };
  }
  return {
    ...m,
    message: extractMessageText(m),
  };
};

// Deduplicate messages by id / messageId
const deduplicateMessages = (msgList) => {
  if (!Array.isArray(msgList)) return [];
  const seenIds = new Set();
  const result = [];

  for (const m of msgList) {
    if (!m) continue;
    const id = m.id || m.messageId || m.message_id;
    if (id && !String(id).startsWith("temp_")) {
      if (seenIds.has(id)) {
        continue;
      }
      seenIds.add(id);
    }
    result.push(m);
  }
  return result;
};

export default function JuniorDoctorConsultationChat({ period = "today" }) {
  const user = useSelector((state) => state.auth.user);
  const jdState = useSelector((state) => state.juniorDoctorAppointment);
  const {
    appointments: consultationAppts = [],
    selectedPatient,
    patientProfile,
  } = useSelector((state) => state.consultation);

  const doctorId = user?.doctor_id || user?.id || "JD_1";
  const doctorName = user?.name || user?.doctor_name || "Junior Doctor";

  // Widget view states
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatPatient, setActiveChatPatient] = useState(null);

  // Search in conversation list
  const [searchQuery, setSearchQuery] = useState("");

  // Chat message & status states
  const [messages, setMessages] = useState([]);
  const [chatStatus, setChatStatus] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Extract junior doctor appointments
  const jdAppointmentsList = useMemo(() => {
    const raw = jdState?.appointments;
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object") {
      const current = raw[period]?.data || raw["today"]?.data;
      if (Array.isArray(current)) return current;
      const combined = [];
      Object.values(raw).forEach((val) => {
        if (val?.data && Array.isArray(val.data)) {
          combined.push(...val.data);
        } else if (Array.isArray(val)) {
          combined.push(...val);
        }
      });
      return combined;
    }
    return [];
  }, [jdState, period]);

  // Filter strictly for VIDEO CONSULTATION patients
  const conversationPatients = useMemo(() => {
    const allCandidates = [...jdAppointmentsList];

    if (Array.isArray(consultationAppts) && consultationAppts.length > 0) {
      consultationAppts.forEach((ca) => {
        if (!allCandidates.some((p) => p.id === ca.id || p.token === ca.token)) {
          allCandidates.push(ca);
        }
      });
    }

    // Filter for video consultations that are not cancelled
    const list = allCandidates.filter(
      (p) =>
        isVideoConsultation(
          p,
          p.id === selectedPatient?.id ? patientProfile : null
        ) && isNotCancelled(p)
    );

    // If selectedPatient on the dashboard is a video consultation, include them if not already present
    if (
      selectedPatient &&
      isVideoConsultation(selectedPatient, patientProfile) &&
      isNotCancelled(selectedPatient) &&
      !list.some(
        (p) =>
          (p.id && p.id === selectedPatient.id) ||
          (p.token && p.token === selectedPatient.token)
      )
    ) {
      list.unshift(selectedPatient);
    }
    return list;
  }, [jdAppointmentsList, consultationAppts, selectedPatient, patientProfile]);

  // Filtered by search query
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return conversationPatients;
    const q = searchQuery.toLowerCase();
    return conversationPatients.filter((p) => {
      const name = (p.patient_name || p.name || "").toLowerCase();
      const token = String(p.token || p.code || p.patient_code || "").toLowerCase();
      const phone = String(p.phone || p.contact || "").toLowerCase();
      return name.includes(q) || token.includes(q) || phone.includes(q);
    });
  }, [conversationPatients, searchQuery]);

  // Auto-scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeChatPatient && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, activeChatPatient]);

  // ==========================================
  // FETCH STATUS & MESSAGES WHEN PATIENT SELECTED
  // ==========================================
  const loadChatData = async (patient) => {
    if (!patient) return;
    const consultationId =
      patient.consultation_id ||
      patient.consultationId ||
      patient.id;

    setLoadingMessages(true);

    try {
      // 1. Fetch Chat Availability Status
      const statusRes = await getChatStatus(consultationId).catch((err) => {
        console.warn("Could not fetch chat status:", err);
        return { data: { chatEnabled: true, chatStatus: "OPEN" } };
      });
      if (statusRes?.data) {
        setChatStatus(statusRes.data);
      }

      // 2. Fetch Chat History
      const msgRes = await getChatMessages(consultationId, {
        page: 1,
        limit: 50,
      }).catch((err) => {
        console.warn("Could not fetch messages:", err);
        return { data: { messages: [] } };
      });

      const fetchedMessages =
        msgRes?.data?.messages ||
        msgRes?.data?.data ||
        (Array.isArray(msgRes?.data) ? msgRes.data : []);
      setMessages(deduplicateMessages(fetchedMessages.map(sanitizeMessage).filter(Boolean)));

      // 3. Mark Messages as Read
      markChatMessagesAsRead(consultationId).catch(() => {});
    } catch (err) {
      console.error("Error loading chat data:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ==========================================
  // WEBSOCKET MANAGEMENT & REST FALLBACK
  // ==========================================
  useEffect(() => {
    if (!isOpen || !activeChatPatient) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setWsConnected(false);
      return;
    }

    loadChatData(activeChatPatient);

    const appointmentId =
      activeChatPatient.id ||
      activeChatPatient.appointment_id ||
      activeChatPatient.appointmentId ||
      activeChatPatient.consultation_id;

    try {
      const wsUrl = getWebSocketUrl(appointmentId, {
        userId: doctorId,
        role: "doctor",
        name: doctorName,
      });

      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ Junior Doctor Consultation Chat WebSocket connected:", wsUrl);
        setWsConnected(true);
      };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("📩 Junior Doctor Chat WS message received:", data);

            if (data.type === "connected") {
              setWsConnected(true);
              return;
            }

            // Handle incoming message
            let incomingMsg = data.messageData || data.data || data;
            if (data.message && typeof data.message === "object") {
              incomingMsg = data.message;
            }

            const cleanMsg = sanitizeMessage(incomingMsg);
            if (cleanMsg && (cleanMsg.message || cleanMsg.text || cleanMsg.fileUrl)) {
              setMessages((prev) => {
                const msgId =
                  cleanMsg.id ||
                  cleanMsg.message_id ||
                  cleanMsg.messageId;

                // Check if already in list by id
                if (
                  msgId &&
                  prev.some(
                    (m) =>
                      m.id === msgId ||
                      m.messageId === msgId ||
                      m.message_id === msgId
                  )
                ) {
                  return prev;
                }

                // Check if matching pending optimistic message from this junior doctor
                const tempIndex = prev.findIndex(
                  (m) =>
                    String(m.id || "").startsWith("temp_") &&
                    extractMessageText(m) === extractMessageText(cleanMsg)
                );

                if (tempIndex !== -1) {
                  const next = [...prev];
                  next[tempIndex] = cleanMsg;
                  return deduplicateMessages(next);
                }

                return deduplicateMessages([...prev, cleanMsg]);
              });

              // Mark as read if from patient
              const senderRole = (
                cleanMsg.senderRole ||
                cleanMsg.sender_role ||
                ""
              ).toUpperCase();
              if (senderRole === "PATIENT") {
                const consultationId =
                  activeChatPatient.consultation_id ||
                  activeChatPatient.consultationId ||
                  activeChatPatient.id;
                markChatMessagesAsRead(consultationId).catch(() => {});
              }
            }
          } catch (err) {
            console.error("WS message parse error:", err);
          }
        };

        socket.onerror = (err) => {
          console.warn("Junior Doctor Chat WS error:", err);
          setWsConnected(false);
        };

        socket.onclose = () => {
          console.log("Junior Doctor Chat WS closed");
          setWsConnected(false);
        };
      } catch (err) {
        console.warn("WebSocket initialization skipped or failed (falling back to REST):", err);
        setWsConnected(false);
      }

    // Background polling fallback to ensure messages stay updated
    const pollInterval = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        return;
      }

      const consultationId =
        activeChatPatient.consultation_id ||
        activeChatPatient.consultationId ||
        activeChatPatient.id;
      if (consultationId) {
        getChatMessages(consultationId, { page: 1, limit: 50 })
          .then((msgRes) => {
            const fetched =
              msgRes?.data?.messages ||
              msgRes?.data?.data ||
              (Array.isArray(msgRes?.data) ? msgRes.data : []);
            if (fetched && fetched.length > 0) {
              const cleaned = deduplicateMessages(fetched.map(sanitizeMessage).filter(Boolean));
              setMessages((prev) => {
                const tempMsgs = prev.filter((m) => String(m.id || "").startsWith("temp_"));
                const combined = deduplicateMessages([...cleaned, ...tempMsgs]);
                if (
                  combined.length !== prev.length ||
                  combined[combined.length - 1]?.id !== prev[prev.length - 1]?.id
                ) {
                  return combined;
                }
                return prev;
              });
            }
          })
          .catch(() => {});
      }
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setWsConnected(false);
    };
  }, [isOpen, activeChatPatient]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text || !activeChatPatient || isSending) return;

    const consultationId =
      activeChatPatient.consultation_id ||
      activeChatPatient.consultationId ||
      activeChatPatient.id;

    setIsSending(true);

    const tempId = `temp_${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      messageId: tempId,
      message: text,
      messageType: "TEXT",
      senderId: doctorId,
      senderRole: "DOCTOR",
      senderName: doctorName,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => deduplicateMessages([...prev, optimisticMessage]));
    setInputText("");

    // 1. Send via WebSocket if open
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(
          JSON.stringify({
            type: "SEND_MESSAGE",
            message: text,
          })
        );
        setIsSending(false);
        return;
      } catch (wsErr) {
        console.warn("Failed sending over WS, falling back to REST:", wsErr);
      }
    }

    // 2. Fallback: Persist via REST API
    try {
      const res = await sendChatMessage(consultationId, {
        message: text,
        message_type: "TEXT",
        sender_id: doctorId,
        sender_role: "DOCTOR",
        sender_name: doctorName,
      });

      if (res?.data?.data) {
        const confirmedMsg = sanitizeMessage(res.data.data);
        setMessages((prev) => {
          const replaced = prev.map((m) => (m.id === tempId ? confirmedMsg : m));
          return deduplicateMessages(replaced);
        });
      }
    } catch (restErr) {
      console.error("REST send message error:", restErr);
    } finally {
      setIsSending(false);
    }
  };

  // ==========================================
  // SPEECH TO TEXT
  // ==========================================
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // ==========================================
  // FILE ATTACHMENT
  // ==========================================
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatPatient) return;

    const consultationId =
      activeChatPatient.consultation_id ||
      activeChatPatient.consultationId ||
      activeChatPatient.id;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadChatFile(consultationId, formData);
      loadChatData(activeChatPatient);
    } catch (err) {
      console.error("Chat file upload error:", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // 1. COLLAPSED FLOATING PILL (Bottom-Right)
  // ==========================================
  if (!isOpen) {
    return (
      <div className="fixed bottom-0 right-8 z-[99999]">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-6 py-2.5 bg-[#FFEAD8] hover:bg-[#FFE0C4] text-[#2C1810] font-semibold text-sm rounded-t-2xl shadow-[0_-4px_14px_rgba(0,0,0,0.1)] border-t border-x border-[#EADCD0] transition-all cursor-pointer"
        >
          <span className="text-[15px] font-bold">Chat</span>
          <HiChevronUp className="w-4 h-4 text-[#2C1810] stroke-[2.5]" />
        </button>
      </div>
    );
  }

  // ==========================================
  // 2. EXPANDED DRAWER CONTAINER
  // ==========================================
  return (
    <div className="fixed bottom-0 right-4 sm:right-8 z-[99999] w-[350px] sm:w-[390px] h-[530px] max-h-[85vh] bg-white rounded-t-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#E5DCD5] flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* ---------------- HEADER ---------------- */}
      <div className="bg-[#FFEAD8] px-4 py-3.5 border-b border-[#ECDED5] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          {activeChatPatient && (
            <button
              onClick={() => setActiveChatPatient(null)}
              className="p-1 -ml-1 text-[#2C1810] hover:bg-[#F3DEC9] rounded-lg transition-colors cursor-pointer"
              title="Back to patient list"
            >
              <HiArrowLeft className="w-5 h-5 text-[#2C1810]" />
            </button>
          )}
          <h3 className="font-bold text-[17px] text-[#2C1810]">Chat</h3>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-[#2C1810] hover:bg-[#F3DEC9] rounded-lg transition-colors cursor-pointer"
          title="Minimize"
        >
          <HiChevronDown className="w-5 h-5 text-[#2C1810]" />
        </button>
      </div>

      {/* ---------------- VIEW 1: PATIENTS LIST ---------------- */}
      {!activeChatPatient ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Search Bar */}
          <div className="p-3 border-b border-[#F0EAE4] bg-[#FAF7F4]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient by name or token..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#E2D8CF] rounded-lg text-[#2C1810] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A4B3A]"
            />
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F5EFE9]">
            {filteredPatients.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-400">
                <div className="w-12 h-12 rounded-full bg-[#FFEAD8] text-[#4D2E23] flex items-center justify-center text-xl mb-3">
                  📹
                </div>
                <p className="text-sm font-semibold text-[#2C1810]">
                  No video consultations
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
                  Video consultation patients scheduled for today will appear here.
                </p>
              </div>
            ) : (
              filteredPatients.map((patient, idx) => {
                const name =
                  patient.patient_name || patient.name || "Patient";
                const token =
                  patient.token || patient.code || patient.patient_code || idx + 1;
                const slot = formatTimeSlot(patient.slot_time);
                const isSelectedOnDashboard =
                  selectedPatient &&
                  (selectedPatient.id === patient.id ||
                    selectedPatient.token === patient.token);

                return (
                  <div
                    key={`${patient.id || patient.token || "p"}_${idx}`}
                    onClick={() => setActiveChatPatient(patient)}
                    className="p-3.5 flex items-center justify-between hover:bg-[#FFF8F3] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#FFEAD8] border border-[#ECDCD0] text-[#4D2E23] font-bold text-sm flex items-center justify-center shrink-0">
                        {patient.profile_image ? (
                          <img
                            src={patient.profile_image}
                            alt={name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          name.charAt(0).toUpperCase()
                        )}
                      </div>

                      {/* Patient Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-semibold text-[#2C1810] truncate">
                            {name}
                          </h4>
                          <span className="text-[10px] font-medium bg-[#E8F0FE] text-[#1967D2] px-1.5 py-0.2 rounded shrink-0">
                            Video
                          </span>
                          {isSelectedOnDashboard && (
                            <span className="text-[10px] font-medium bg-[#E6F4EA] text-[#1E7E34] px-1.5 py-0.2 rounded shrink-0">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7A756F] truncate mt-0.5">
                          #{token} • {patient.reason || "Video Consultation"}
                        </p>
                      </div>
                    </div>

                    {/* Time / Badge */}
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[11px] font-medium text-gray-400">
                        {slot || "Today"}
                      </span>
                      {patient.unread_count > 0 && (
                        <div className="mt-1 w-4 h-4 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center justify-center ml-auto">
                          {patient.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* ---------------- VIEW 2: ACTIVE 1-ON-1 CHAT ---------------- */
        <div className="flex-1 flex flex-col overflow-hidden bg-[#FAF7F5]">
          {/* Subheader: Active Patient info */}
          <div className="px-4 py-2.5 bg-[#FAF7F5] border-b border-[#EFE8E1] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FFEAD8] border border-[#ECDCD0] text-[#4D2E23] font-bold text-xs flex items-center justify-center shrink-0">
                {(
                  activeChatPatient.patient_name ||
                  activeChatPatient.name ||
                  "P"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#2C1810] truncate">
                  {activeChatPatient.patient_name ||
                    activeChatPatient.name ||
                    "Patient"}
                </h4>
                <p className="text-[10px] text-gray-500 truncate">
                  #{activeChatPatient.token || activeChatPatient.patient_code || "PT"}{" "}
                  • {formatTimeSlot(activeChatPatient.slot_time) || "Consultation"}
                </p>
              </div>
            </div>

            {/* Live Chat Status Pill */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`w-2 h-2 rounded-full ${
                  wsConnected
                    ? "bg-green-500 animate-pulse"
                    : loadingMessages
                    ? "bg-amber-400 animate-pulse"
                    : "bg-emerald-500"
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  wsConnected || !loadingMessages
                    ? "text-emerald-700"
                    : "text-gray-500"
                }`}
              >
                {wsConnected ? "Online" : loadingMessages ? "Connecting..." : "Online"}
              </span>
            </div>
          </div>

          {/* Chat Window Closed/Notice Banner */}
          {chatStatus &&
            chatStatus.chatStatus === "CLOSED" && (
              <div className="px-3 py-1.5 bg-[#FFF2E2] border-b border-[#F7E1C8] text-[#8A5012] text-[11px] text-center font-medium">
                Chat closed (available from 15 min before to 15 min after scheduled consultation).
              </div>
            )}

          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#FCFAF8]">
            {loadingMessages ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-[#FFEAD8] text-[#4D2E23] flex items-center justify-center font-bold text-base mb-2">
                  💬
                </div>
                <p className="text-xs font-semibold text-[#2C1810]">
                  No messages yet
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Send a message to start the consultation chat.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const role = (
                  msg.senderRole ||
                  msg.sender_role ||
                  ""
                ).toUpperCase();
                const isDoctor =
                  role === "DOCTOR" ||
                  msg.senderId === doctorId ||
                  msg.sender_id === doctorId;
                const messageText = extractMessageText(msg);
                const timeStr = formatMessageTime(
                  msg.createdAt || msg.created_at || msg.readAt
                );

                return (
                  <div
                    key={`${msg.id || msg.messageId || "msg"}_${idx}`}
                    className={`flex flex-col ${
                      isDoctor ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                        isDoctor
                          ? "bg-[#FDE8D7] text-[#2C1810] border border-[#F3D6BF] rounded-tr-xs"
                          : "bg-white text-[#2C1810] border border-[#E9E1D8] rounded-tl-xs"
                      }`}
                    >
                      {messageText}

                      {/* File attachment preview if available */}
                      {(msg.fileUrl || msg.file_url) && (
                        <div className="mt-2 pt-2 border-t border-[#EFE7DE]">
                          <a
                            href={msg.fileUrl || msg.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#7A4B3A] underline font-medium break-all"
                          >
                            📎 {msg.fileName || msg.file_name || "Attachment"}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="mt-1 px-1 flex items-center gap-1 text-[10px] text-gray-400">
                      <span>{isDoctor ? "You" : activeChatPatient.patient_name || "Patient"}</span>
                      {timeStr && <span>• {timeStr}</span>}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 bg-white border-t border-[#EFE8E1] flex items-center gap-2"
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Paper clip for attachments */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-[#4D2E23] hover:bg-[#FAF7F5] rounded-full transition-colors cursor-pointer"
              title="Attach document"
            >
              <HiPaperClip className="w-5 h-5 rotate-45" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Start typing.."
              className="flex-1 bg-[#F5F2EF] rounded-full px-4 py-2 text-xs text-[#2C1810] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A4B3A]"
            />

            {/* Speech-to-Text Microphone button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-gray-400 hover:text-[#4D2E23] hover:bg-[#FAF7F5]"
              }`}
              title={isListening ? "Listening... click to stop" : "Voice input"}
            >
              <HiMicrophone className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2 bg-[#4D2E23] text-white hover:bg-[#3B2219] disabled:opacity-40 disabled:hover:bg-[#4D2E23] rounded-full transition-colors cursor-pointer shrink-0"
              title="Send"
            >
              <HiPaperAirplane className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

