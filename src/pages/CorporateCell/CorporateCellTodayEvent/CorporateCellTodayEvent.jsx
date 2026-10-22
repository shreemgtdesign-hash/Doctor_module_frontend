import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiCheck,
  HiRefresh,
} from "react-icons/hi";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  getCorporateCellTodayEventDetails,
  checkInTodayEvent,
  checkOutTodayEvent,
} from "../../../api/corporateCellApi";

const getBadgeStyle = (type, badgeColor) => {
  const t = (type || "").toLowerCase();
  const c = (badgeColor || "").toLowerCase();

  if (c === "green" || t.includes("seminar")) {
    return "bg-[#E6F8EB] text-[#22843F]";
  }
  if (c === "purple" || t.includes("retreat")) {
    return "bg-[#F1EDFD] text-[#7F56D9]";
  }
  if (c === "blue" || t.includes("workshop") || t.includes("online")) {
    return "bg-[#E8F4FD] text-[#2563EB]";
  }
  if (c === "orange" || t.includes("talk") || t.includes("check-up")) {
    return "bg-[#FDF2E9] text-[#D97706]";
  }
  return "bg-[#EFE8DF] text-[#6F4432]";
};

const extractDateBadge = (evt) => {
  if (evt?.date_badge?.month && evt?.date_badge?.day) {
    return evt.date_badge;
  }
  const dateStr = evt?.event_date_formatted || evt?.event_date;
  if (!dateStr) return { month: "OCT", day: "21" };

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
      return {
        month: monthNames[d.getMonth()],
        day: String(d.getDate()).padStart(2, "0"),
      };
    }
  } catch (_) {}

  return { month: "OCT", day: "21" };
};

const CorporateCellTodayEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    setLoading(true);
    getCorporateCellTodayEventDetails(id)
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.success && res.data?.data) {
          setEventData(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching today's event details:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Check In and Check Out status resolution (handles flat or nested attendance object)
  const isCheckedIn = Boolean(
    eventData?.is_checked_in ||
    eventData?.attendance?.check_in?.is_checked_in ||
    eventData?.checked_in_time ||
    eventData?.attendance?.check_in?.checked_in_time
  );

  const isCheckedOut = Boolean(
    eventData?.is_checked_out ||
    eventData?.attendance?.check_out?.is_checked_out ||
    eventData?.checked_out_time ||
    eventData?.attendance?.check_out?.checked_out_time
  );

  // Handle Check In
  const handleCheckIn = async () => {
    if (checkingIn || isCheckedIn) return;
    const eventId = eventData?.id || id;
    if (!eventId) return;

    setCheckingIn(true);
    try {
      const res = await checkInTodayEvent(eventId);
      if (res.data?.success) {
        toast.success(res.data.message || "Checked in successfully");
        const checkInData = res.data.data;
        const nowTime =
          checkInData?.checked_in_time ||
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setEventData((prev) => ({
          ...prev,
          is_checked_in: true,
          checked_in_time: nowTime,
          attendance: {
            ...prev?.attendance,
            check_in: {
              is_checked_in: true,
              checked_in_time: nowTime,
              checked_in_at: checkInData?.checked_in_at || new Date().toISOString(),
              status_text:
                checkInData?.status_text || `Checked in at ${nowTime}`,
            },
          },
        }));
      }
    } catch (err) {
      console.error("Check-in error:", err);
      toast.error(err.response?.data?.message || "Failed to check in");
    } finally {
      setCheckingIn(false);
    }
  };

  // Handle Check Out - Only allowed if check-in is true
  const handleCheckOut = async () => {
    if (!isCheckedIn) {
      toast.error("Please check in first before checking out.");
      return;
    }
    if (checkingOut || isCheckedOut) {
      return;
    }
    const eventId = eventData?.id || id;
    if (!eventId) return;

    setCheckingOut(true);
    try {
      const res = await checkOutTodayEvent(eventId);
      if (res.data?.success) {
        toast.success(res.data.message || "Checked out successfully");
        const checkOutData = res.data.data;
        const nowTime =
          checkOutData?.checked_out_time ||
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setEventData((prev) => ({
          ...prev,
          is_checked_out: true,
          checked_out_time: nowTime,
          attendance: {
            ...prev?.attendance,
            check_out: {
              is_checked_out: true,
              checked_out_time: nowTime,
              checked_out_at: checkOutData?.checked_out_at || new Date().toISOString(),
              status_text:
                checkOutData?.status_text || `Checked out at ${nowTime}`,
            },
          },
        }));
      }
    } catch (err) {
      console.error("Check-out error:", err);
      toast.error(err.response?.data?.message || "Failed to check out");
    } finally {
      setCheckingOut(false);
    }
  };

  const dateBadge = extractDateBadge(eventData);
  const badgeText = eventData?.type_badge || eventData?.category || "Workshop";
  const infoTiles = eventData?.info_tiles || {};

  return (
    <DashboardLayout role="corporate_cell">
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back to Dashboard Link */}
          <button
            type="button"
            onClick={() => navigate("/corporate-cell/dashboard")}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#4D2E23] hover:text-[#2C1810] transition cursor-pointer"
          >
            <HiOutlineArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-[#8A7D75] gap-2">
              <HiRefresh className="animate-spin text-[#6F4432]" size={22} />
              <span className="text-sm font-medium">Loading today's event details...</span>
            </div>
          ) : !eventData ? (
            <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-12 text-center text-[#8A7D75]">
              <p className="text-base font-semibold text-[#2C1810]">Event details not found</p>
              <p className="text-xs mt-1">Please return to the dashboard and try again.</p>
            </div>
          ) : (
            <>
              {/* ========================================================= */}
              {/* 1. TOP EVENT HEADER CARD */}
              {/* ========================================================= */}
              <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Info with Date Badge */}
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    {/* Date Badge */}
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-[#EFE5DC] bg-[#F9F2E8]">
                      <span className="text-[11px] font-bold tracking-wider text-[#8A5A43] uppercase">
                        {dateBadge.month}
                      </span>
                      <span className="text-[22px] font-bold text-[#2C1810] leading-none">
                        {dateBadge.day}
                      </span>
                    </div>

                    {/* Event Text Info */}
                    <div className="min-w-0">
                      <h2 className="text-[18px] sm:text-[20px] font-bold text-[#2C1810] truncate">
                        {eventData.title}
                      </h2>
                      <p className="text-[13.5px] text-[#6B5E55] mt-0.5 truncate">
                        {eventData.company_name || "Reliance Industries Limited"}
                      </p>
                      <p className="text-[12.5px] text-[#8C7E74] mt-0.5">
                        {eventData.time_display}
                        {eventData.mode && (
                          <span className="ml-2 font-medium">| {eventData.mode}</span>
                        )}
                        {eventData.location && eventData.location !== eventData.mode && (
                          <span className="ml-2 text-[#A89A8F]">({eventData.location})</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right Type Badge */}
                  <div className="self-start sm:self-center">
                    <span
                      className={`rounded-full px-4 py-1 text-[11px] font-semibold tracking-wide ${getBadgeStyle(
                        badgeText,
                        eventData.badge_color
                      )}`}
                    >
                      {badgeText}
                    </span>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* 2. 8 INFO TILES (2 ROWS OF 4) */}
              {/* ========================================================= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tile 1: COMPANY */}
                <div className="rounded-2xl border border-[#EFE5DC] bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8A7D75] uppercase tracking-wider block">
                    COMPANY
                  </span>
                  <h4 className="text-[14px] font-bold text-[#2C1810] mt-1 truncate">
                    {infoTiles.company || eventData.company_name || "Reliance Industries Limited"}
                  </h4>
                </div>

                {/* Tile 2: DATE */}
                <div className="rounded-2xl border border-[#EFE5DC] bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8A7D75] uppercase tracking-wider block">
                    DATE
                  </span>
                  <h4 className="text-[14px] font-bold text-[#2C1810] mt-1 truncate">
                    {infoTiles.date || eventData.event_date_formatted || "22 September 2026"}
                  </h4>
                </div>

                {/* Tile 3: TIME */}
                <div className="rounded-2xl border border-[#EFE5DC] bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8A7D75] uppercase tracking-wider block">
                    TIME
                  </span>
                  <h4 className="text-[14px] font-bold text-[#2C1810] mt-1 truncate">
                    {infoTiles.time || eventData.time_display || "10 AM – 11:30 AM"}
                  </h4>
                </div>

                {/* Tile 4: LOCATION */}
                <div className="rounded-2xl border border-[#EFE5DC] bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8A7D75] uppercase tracking-wider block">
                    LOCATION
                  </span>
                  <h4 className="text-[14px] font-bold text-[#2C1810] mt-1 truncate">
                    {infoTiles.location || eventData.mode || "On-site"}
                  </h4>
                </div>

                {/* Tile 5: VENUE */}
                <div className="rounded-2xl border border-[#EFE5DC] bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8A7D75] uppercase tracking-wider block">
                    VENUE
                  </span>
                  <h4 className="text-[14px] font-bold text-[#2C1810] mt-1 truncate">
                    {infoTiles.venue || eventData.location || "Wellness Hall, Tower B"}
                  </h4>
                </div>

                {/* Tile 6: ATTENDEES */}
                <div className="rounded-2xl border border-[#EFE5DC] bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8A7D75] uppercase tracking-wider block">
                    ATTENDEES
                  </span>
                  <h4 className="text-[14px] font-bold text-[#2C1810] mt-1 truncate">
                    {infoTiles.attendees || (eventData.attendees ? `${eventData.attendees} expected` : "76 expected")}
                  </h4>
                </div>

                {/* Tile 7: FACILITATOR */}
                <div className="rounded-2xl border border-[#EFE5DC] bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8A7D75] uppercase tracking-wider block">
                    FACILITATOR
                  </span>
                  <h4 className="text-[14px] font-bold text-[#2C1810] mt-1 truncate">
                    {infoTiles.facilitator || "Dr. Ananya Krishnan"}
                  </h4>
                </div>

                {/* Tile 8: CATEGORY */}
                <div className="rounded-2xl border border-[#EFE5DC] bg-white p-4 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#8A7D75] uppercase tracking-wider block">
                    CATEGORY
                  </span>
                  <h4 className="text-[14px] font-bold text-[#2C1810] mt-1 truncate">
                    {infoTiles.category || eventData.category || "Seminar"}
                  </h4>
                </div>
              </div>

              {/* ========================================================= */}
              {/* 3. ABOUT THIS EVENT */}
              {/* ========================================================= */}
              <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
                <h3 className="text-[16px] font-bold text-[#2C1810] mb-2">
                  About this event
                </h3>
                <p className="text-[13.5px] text-[#5D514A] leading-relaxed">
                  {eventData.about_this_event ||
                    eventData.description ||
                    "A guided yoga and meditation session designed to improve focus, reduce workplace stress, and support holistic well-being for employees."}
                </p>
              </div>

              {/* ========================================================= */}
              {/* 4. TIMINGS (CHECK-IN / CHECK-OUT) */}
              {/* ========================================================= */}
              <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
                <h3 className="text-[16px] font-bold text-[#2C1810]">
                  {eventData?.attendance?.title || "Timings"}
                </h3>
                <p className="text-[12.5px] text-[#7F726A] mt-0.5 mb-5">
                  {eventData?.attendance?.subtitle || "Mark the beginning of today's session."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Check In Action Box */}
                  <div
                    onClick={handleCheckIn}
                    className={`rounded-2xl border p-4.5 flex items-center gap-3.5 transition ${
                      isCheckedIn
                        ? "border-[#7A4933] bg-[#FFF8F4] cursor-default"
                        : "border-[#EFE5DC] bg-white hover:border-[#D5C6BA] hover:shadow-2xs cursor-pointer"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                        isCheckedIn
                          ? "bg-[#4D2E23] text-white"
                          : "border border-[#C5B7AD] bg-white"
                      }`}
                    >
                      {isCheckedIn && <HiCheck size={14} />}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-[14px] font-bold text-[#2C1810]">
                        Check In
                      </h4>
                      <p className="text-[12px] text-[#7F726A] mt-0.5 truncate">
                        {checkingIn
                          ? "Checking in..."
                          : eventData?.attendance?.check_in?.status_text ||
                            (isCheckedIn
                              ? `Checked in at ${eventData?.attendance?.check_in?.checked_in_time || "10:02 AM"}`
                              : "Click to check in")}
                      </p>
                    </div>
                  </div>

                  {/* Check Out Action Box */}
                  <div
                    onClick={() => {
                      if (!isCheckedIn) {
                        toast.error("Please check in first before checking out.");
                        return;
                      }
                      if (!isCheckedOut && !checkingOut) {
                        handleCheckOut();
                      }
                    }}
                    className={`rounded-2xl border p-4.5 flex items-center gap-3.5 transition select-none ${
                      isCheckedOut
                        ? "border-[#7A4933] bg-[#FFF8F4] cursor-default"
                        : isCheckedIn
                        ? "border-[#EFE5DC] bg-white hover:border-[#D5C6BA] hover:shadow-2xs cursor-pointer"
                        : "border-[#EFE5DC] bg-[#FAF8F5] opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                        isCheckedOut
                          ? "bg-[#4D2E23] text-white"
                          : isCheckedIn
                          ? "border border-[#C5B7AD] bg-white"
                          : "border border-[#D9CECA] bg-[#EFE8E1]"
                      }`}
                    >
                      {isCheckedOut && <HiCheck size={14} />}
                    </div>

                    <div className="min-w-0">
                      <h4
                        className={`text-[14px] font-bold ${
                          isCheckedIn ? "text-[#2C1810]" : "text-[#8C7E74]"
                        }`}
                      >
                        Check Out
                      </h4>
                      <p className="text-[12px] text-[#7F726A] mt-0.5 truncate">
                        {checkingOut
                          ? "Checking out..."
                          : eventData?.attendance?.check_out?.status_text ||
                            (isCheckedOut
                              ? `Checked out at ${eventData?.checked_out_time || eventData?.attendance?.check_out?.checked_out_time || "6:16 PM"}`
                              : isCheckedIn
                              ? "Ready to check out (Click to check out)"
                              : "Check-in required before check out")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateCellTodayEvent;

