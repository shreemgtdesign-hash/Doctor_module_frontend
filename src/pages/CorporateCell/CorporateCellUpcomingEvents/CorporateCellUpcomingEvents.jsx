import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight, HiRefresh } from "react-icons/hi";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { getCorporateCellUpcomingEvents } from "../../../api/corporateCellApi";

const getBadgeStyle = (type, badgeColor) => {
  const t = (type || "").toLowerCase();
  const c = (badgeColor || "").toLowerCase();

  if (c === "green" || t.includes("seminar")) {
    return "bg-[#E6F8EB] text-[#22843F]";
  }
  if (c === "purple" || t.includes("retreat")) {
    return "bg-[#F3EBFB] text-[#7A3EB5]";
  }
  if (c === "blue" || t.includes("online")) {
    return "bg-[#E8F3FD] text-[#2470B8]";
  }
  if (c === "orange" || t.includes("talk") || t.includes("workshop") || t.includes("check-up")) {
    return "bg-[#FEF1E4] text-[#B85D1B]";
  }
  return "bg-[#EFE8DF] text-[#6F4432]";
};

const FALLBACK_EVENTS = [
  {
    id: "ce_evt_sept22_01",
    event_no: "EVT-260922-001",
    title: "Yoga & Meditation",
    company_name: "Reliance Industries Limited",
    date_badge: { month: "SEPT", day: "22" },
    time_display: "10 AM- 11:30 AM",
    mode: "On-site",
    type_badge: "Seminar",
    badge_color: "green",
  },
  {
    id: "ce_evt_sept28_02",
    event_no: "EVT-260928-002",
    title: "Yoga & Meditation",
    company_name: "Reliance Industries Limited",
    date_badge: { month: "SEPT", day: "28" },
    time_display: "10 AM- 11:30 AM",
    mode: "On-site",
    type_badge: "Retreat",
    badge_color: "purple",
  },
  {
    id: "ce_evt_oct21_03",
    event_no: "EVT-261021-003",
    title: "Diet & Nutrition Talk",
    company_name: "Reliance Industries Limited",
    date_badge: { month: "OCT", day: "21" },
    time_display: "10 AM- 11:30 AM",
    mode: "On-site",
    type_badge: "Talk",
    badge_color: "orange",
  },
  {
    id: "ce_evt_oct30_04",
    event_no: "EVT-261030-004",
    title: "Stress Management Workshop",
    company_name: "Reliance Industries Limited",
    date_badge: { month: "OCT", day: "30" },
    time_display: "10 AM- 11:30 AM",
    mode: "Online",
    type_badge: "Workshop",
    badge_color: "blue",
  },
  {
    id: "e7a8b010-628d-4b82-9842-7cf3b04c9010",
    event_no: "EVT061126010",
    title: "Corporate Detox & Cleansing Camp",
    company_name: "Reliance Industries Limited",
    date_badge: { month: "NOV", day: "06" },
    time_display: "9AM - 6PM",
    mode: "On-site",
    type_badge: "Retreat",
    badge_color: "orange",
  },
  {
    id: "e7a8b013-628d-4b82-9842-7cf3b04c9013",
    event_no: "EVT151126013",
    title: "Ayurvedic Ahara Nutrition Masterclass",
    company_name: "Reliance Industries Limited",
    date_badge: { month: "NOV", day: "15" },
    time_display: "10AM - 6PM",
    mode: "On-site",
    type_badge: "Seminar",
    badge_color: "orange",
  },
  {
    id: "e7a8b002-628d-4b82-9842-7cf3b04c9002",
    event_no: "EVT171126002",
    title: "Stress Management",
    company_name: "Reliance Industries Limited",
    date_badge: { month: "NOV", day: "17" },
    time_display: "10AM - 1PM",
    mode: "On-site",
    type_badge: "Seminar",
    badge_color: "blue",
  },
  {
    id: "e7a8b007-628d-4b82-9842-7cf3b04c9007",
    event_no: "EVT221126007",
    title: "Executive Cardiac Wellness Screening",
    company_name: "Reliance Industries Limited",
    date_badge: { month: "NOV", day: "22" },
    time_display: "9AM - 5PM",
    mode: "On-site",
    type_badge: "Check-up",
    badge_color: "orange",
  },
];

const CorporateCellUpcomingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getCorporateCellUpcomingEvents()
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setEvents(res.data.data);
        }
      })
      .catch((err) => {
        console.warn("Could not load upcoming events from API, using fallback:", err);
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
              Upcoming Events
            </h1>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-[#8A7D75] gap-2">
                <HiRefresh className="animate-spin text-[#6F4432]" size={22} />
                <span className="text-sm font-medium">Loading events...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="py-20 text-center text-[#8A7D75]">
                <p className="text-base font-semibold text-[#2C1810]">No upcoming events</p>
                <p className="text-xs mt-1">There are no upcoming corporate wellness events scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((evt) => {
                  const month = evt.date_badge?.month || "OCT";
                  const day = evt.date_badge?.day || "15";
                  const badgeText = evt.type_badge || "Seminar";

                  return (
                    <div
                      key={evt.id || evt.event_no}
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
                            <h3 className="text-[16px] font-bold text-[#2C1810] truncate">
                              {evt.title}
                            </h3>
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
                              navigate(`/corporate-cell/upcoming-events/${evt.id}`)
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

export default CorporateCellUpcomingEvents;

