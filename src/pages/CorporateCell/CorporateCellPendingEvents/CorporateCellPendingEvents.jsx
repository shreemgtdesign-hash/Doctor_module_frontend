import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight, HiRefresh } from "react-icons/hi";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { getCorporateCellPendingEvents } from "../../../api/corporateCellApi";

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
  if (evt.date_badge?.month && evt.date_badge?.day) {
    return evt.date_badge;
  }
  const dateStr = evt.event_date_formatted || evt.event_date;
  if (!dateStr) return { month: "OCT", day: "21" };

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
      return {
        month: monthNames[d.getMonth()],
        day: String(d.getDate()),
      };
    }
  } catch (_) {}

  // Parse strings like "22nd September, 2026"
  const match = dateStr.match(/(\d+)(?:st|nd|rd|th)?\s+([A-Za-z]+)/i);
  if (match) {
    const day = match[1];
    const month = match[2].slice(0, 4).toUpperCase();
    return { month: month.startsWith("SEPT") ? "SEPT" : month.slice(0, 3), day };
  }

  return { month: "OCT", day: "21" };
};

const CorporateCellPendingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getCorporateCellPendingEvents()
      .then((res) => {
        if (!isMounted) return;
        const apiData = res.data?.data || res.data?.events;
        if (res.data?.success && Array.isArray(apiData)) {
          // Deduplicate events by id or event_no so each event is rendered once
          const seen = new Set();
          const uniqueEvents = apiData.filter((evt) => {
            const key = evt.id || evt.event_no;
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setEvents(uniqueEvents);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => {
        console.error("Could not load pending events from API:", err);
        if (isMounted) setEvents([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout role="corporate_cell">
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 sm:p-8 shadow-2xs">
            <h1 className="text-[22px] sm:text-[24px] font-bold text-[#2C1810] tracking-tight mb-6">
              Pending Requests
            </h1>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-[#8A7D75] gap-2">
                <HiRefresh className="animate-spin text-[#6F4432]" size={22} />
                <span className="text-sm font-medium">Loading pending requests...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="py-20 text-center text-[#8A7D75]">
                <p className="text-base font-semibold text-[#2C1810]">No pending requests</p>
                <p className="text-xs mt-1">There are no pending corporate event requests to review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((evt) => {
                  const dateBadge = extractDateBadge(evt);
                  const month = dateBadge.month;
                  const day = dateBadge.day;
                  const badgeText = evt.type_badge || evt.category || "Seminar";

                  return (
                    <div
                      key={evt.event_no || evt.request_no || evt.id}
                      className="rounded-2xl border border-[#F0E8DF] bg-[#FFFDFC] p-4 sm:p-5 transition hover:border-[#E0D2C4] hover:shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left Info with Date Badge */}
                        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                          {/* Date Badge */}
                          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-[#EFE5DC] bg-[#F9F2E8]">
                            <span className="text-[11px] font-bold tracking-wider text-[#8A5A43] uppercase">
                              {month}
                            </span>
                            <span className="text-[22px] font-bold text-[#2C1810] leading-none">
                              {day}
                            </span>
                          </div>

                          {/* Event Text Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[16px] font-bold text-[#2C1810] truncate">
                                {evt.title}
                              </h3>
                              {(evt.event_no || evt.request_no) && (
                                <span className="text-[11px] font-semibold text-[#8A7D75] bg-[#FAF4ED] px-2 py-0.5 rounded border border-[#EFE5DC]">
                                  {evt.event_no || evt.request_no}
                                </span>
                              )}
                            </div>
                            <p className="text-[13.5px] text-[#6B5E55] mt-0.5 truncate">
                              {evt.company_name}
                            </p>
                            <p className="text-[12.5px] text-[#8C7E74] mt-0.5">
                              {evt.time_display}
                              {evt.mode && (
                                <span className="ml-2 font-medium">| {evt.mode}</span>
                              )}
                              {evt.location && evt.location !== evt.mode && (
                                <span className="ml-2 text-[#A89A8F]">({evt.location})</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Right Info: Type Badge & Action Link */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between shrink-0 sm:h-16 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F2EAE1]">
                          <span
                            className={`rounded-full px-3.5 py-1 text-[11px] font-semibold tracking-wide ${getBadgeStyle(
                              badgeText,
                              evt.badge_color
                            )}`}
                          >
                            {badgeText}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/corporate-cell/pending-events/${evt.event_no || evt.request_no || evt.id}`)
                            }
                            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#4D2E23] hover:text-[#2C1810] transition cursor-pointer"
                          >
                            <span>View Details</span>
                            <HiArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateCellPendingEvents;

