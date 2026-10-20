import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiChevronDown,
  HiArrowRight,
  HiRefresh,
} from "react-icons/hi";
import {
  FaUsers,
  FaSpa,
  FaComments,
  FaHandHoldingHeart,
  FaHospitalUser,
  FaThLarge,
} from "react-icons/fa";
import { GiLotus } from "react-icons/gi";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { getCorporateCellDashboard } from "../../../api/corporateCellApi";

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
  if (c === "orange" || t.includes("talk") || t.includes("workshop")) {
    return "bg-[#FEF1E4] text-[#B85D1B]";
  }
  return "bg-[#EFE8DF] text-[#6F4432]";
};

const getCategoryIcon = (key, iconName) => {
  const k = (key || iconName || "").toLowerCase();
  if (k.includes("workshop") || k.includes("user")) {
    return <FaUsers size={20} className="text-[#8B5E43]" />;
  }
  if (k.includes("yoga") || k.includes("meditation") || k.includes("lotus")) {
    return <GiLotus size={22} className="text-[#8B5E43]" />;
  }
  if (k.includes("talk") || k.includes("comment")) {
    return <FaComments size={20} className="text-[#8B5E43]" />;
  }
  if (k.includes("retreat") || k.includes("spa")) {
    return <FaSpa size={20} className="text-[#8B5E43]" />;
  }
  if (k.includes("camp") || k.includes("health") || k.includes("medical")) {
    return <FaHandHoldingHeart size={20} className="text-[#8B5E43]" />;
  }
  return <FaThLarge size={18} className="text-[#8B5E43]" />;
};

const FALLBACK_DASHBOARD = {
  greeting: "Namaste Rajkumari",
  corporate_engagements: {
    filter_applied: "till_date",
    large_enterprise: { count: 28, label: "Large Enterprise", range: "250+ Employees" },
    medium_enterprise: { count: 15, label: "Medium Enterprise", range: "100-250 Employees" },
    small_enterprise: { count: 79, label: "Small Enterprise", range: "20-100 Employees" },
    microenterprise: { count: 143, label: "Microenterprise", range: "<20 Employees" },
  },
  upcoming_events: [
    {
      id: "ce_evt_sept22_01",
      event_no: "EVT-260922-001",
      title: "Yoga & Meditation",
      company_name: "Reliance Industries Limited",
      date_badge: { month: "SEPT", day: "22" },
      time_display: "10 AM- 11:30 AM",
      mode: "On-site",
      location: "West Mambalam",
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
      location: "West Mambalam",
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
      location: "West Mambalam",
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
      location: "Online",
      type_badge: "Workshop",
      badge_color: "blue",
    },
  ],
  event_categories: [
    { key: "workshops", name: "Workshops", count: 24, display: "24 Workshops", icon: "users" },
    { key: "yoga_meditation", name: "Yoga & Meditation", count: 65, display: "65 Events", icon: "lotus" },
    { key: "talks", name: "Talks", count: 15, display: "15 Talks", icon: "talk" },
    { key: "retreats", name: "Retreats", count: 24, display: "24 Retreats", icon: "spa" },
    { key: "health_camps", name: "Health Camps", count: 24, display: "24 Health Camps", icon: "medical" },
    { key: "other", name: "Other", count: 24, display: "24", icon: "grid" },
  ],
};

const CorporateCellDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(FALLBACK_DASHBOARD);
  const [engagementFilter, setEngagementFilter] = useState("Till Date");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getCorporateCellDashboard()
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.success && res.data?.data) {
          setDashboardData(res.data.data);
        }
      })
      .catch((err) => {
        console.warn("Could not load corporate cell dashboard API, using fallback data:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const engagements = dashboardData?.corporate_engagements || FALLBACK_DASHBOARD.corporate_engagements;
  const upcomingEvents = dashboardData?.upcoming_events || FALLBACK_DASHBOARD.upcoming_events;
  const eventCategories = dashboardData?.event_categories || FALLBACK_DASHBOARD.event_categories;

  const engagementItems = [
    {
      key: "large",
      count: engagements.large_enterprise?.count ?? 28,
      label: engagements.large_enterprise?.label || "Large Enterprise",
      range: engagements.large_enterprise?.range || "250+ Employees",
    },
    {
      key: "medium",
      count: engagements.medium_enterprise?.count ?? 15,
      label: engagements.medium_enterprise?.label || "Medium Enterprise",
      range: engagements.medium_enterprise?.range || "100-250 Employees",
    },
    {
      key: "small",
      count: engagements.small_enterprise?.count ?? 79,
      label: engagements.small_enterprise?.label || "Small Enterprise",
      range: engagements.small_enterprise?.range || "20-100 Employees",
    },
    {
      key: "micro",
      count: engagements.microenterprise?.count ?? 143,
      label: engagements.microenterprise?.label || "Microenterprise",
      range: engagements.microenterprise?.range || "<20 Employees",
    },
  ];

  return (
    <DashboardLayout role="corporate_cell">
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ========================================================= */}
          {/* 1. TOP CARD: CORPORATE ENGAGEMENTS */}
          {/* ========================================================= */}
          <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-[19px] sm:text-[21px] font-bold text-[#2C1810] tracking-tight">
                Corporate Engagements
              </h2>

              {/* Till Date Filter Dropdown */}
              <div className="relative self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 rounded-xl border border-[#E6DCD1] bg-[#FAF6F2] px-3.5 py-2 text-xs sm:text-sm font-medium text-[#4D2E23] hover:bg-[#F3ECE4] transition cursor-pointer"
                >
                  <HiOutlineCalendar size={15} />
                  <span>{engagementFilter}</span>
                  <HiChevronDown size={14} />
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 z-20 w-36 rounded-xl border border-[#E6DCD1] bg-white py-1.5 shadow-lg">
                    {["Till Date", "This Month", "This Quarter", "This Year"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setEngagementFilter(opt);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs transition ${
                          engagementFilter === opt
                            ? "bg-[#FAF3EB] font-bold text-[#4D2E23]"
                            : "text-[#5A4E46] hover:bg-[#FAF6F2]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4 Enterprise Stat Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {engagementItems.map((item) => (
                <div key={item.key} className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FAF3EC] border border-[#ECDCCF] text-xl font-bold text-[#2C1810]">
                    {item.count}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#2C1810] leading-snug">
                      {item.label}
                    </h3>
                    <p className="text-[12px] text-[#7F726A] mt-0.5">{item.range}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. TWO COLUMN SECTION: UPCOMING EVENTS & EVENT CATEGORIES */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: UPCOMING EVENTS (7 cols) */}
            <div className="lg:col-span-7 rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[19px] sm:text-[21px] font-bold text-[#2C1810] tracking-tight">
                  Upcoming Events
                </h2>
                <button
                  type="button"
                  onClick={() => navigate("/corporate-cell/upcoming-events")}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#4D2E23] hover:text-[#2C1810] transition cursor-pointer"
                >
                  <span>View All</span>
                  <HiArrowRight size={14} />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16 text-[#8A7D75] gap-2">
                  <HiRefresh className="animate-spin text-[#6F4432]" size={20} />
                  <span className="text-sm">Loading events...</span>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {upcomingEvents.slice(0, 4).map((evt) => {
                    const month = evt.date_badge?.month || "OCT";
                    const day = evt.date_badge?.day || "15";
                    const badgeText = evt.type_badge || "Seminar";

                    return (
                      <div
                        key={evt.id || evt.event_no}
                        className="rounded-2xl border border-[#F0E8DF] bg-[#FFFDFC] p-4 transition hover:border-[#E0D2C4] hover:shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            {/* Date Badge */}
                            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[#EFE5DC] bg-[#F9F2E8]">
                              <span className="text-[10px] font-bold tracking-wider text-[#8A5A43] uppercase">
                                {month}
                              </span>
                              <span className="text-[19px] font-bold text-[#2C1810] leading-none">
                                {day}
                              </span>
                            </div>

                            {/* Event Details */}
                            <div className="min-w-0">
                              <h4 className="text-[15px] font-bold text-[#2C1810] truncate">
                                {evt.title}
                              </h4>
                              <p className="text-[13px] text-[#6B5E55] mt-0.5 truncate">
                                {evt.company_name}
                              </p>
                              <p className="text-[12px] text-[#8C7E74] mt-0.5">
                                {evt.time_display}
                                {evt.mode && (
                                  <span className="ml-2 font-medium">| {evt.mode}</span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Right Badge & View Details Link */}
                          <div className="flex flex-col items-end justify-between shrink-0 h-14">
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${getBadgeStyle(
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
                              className="flex items-center gap-1 text-[12.5px] font-semibold text-[#4D2E23] hover:text-[#2C1810] transition cursor-pointer"
                            >
                              <span>View Details</span>
                              <HiArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: EVENT CATEGORIES (5 cols) */}
            <div className="lg:col-span-5 rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
              <h2 className="text-[19px] sm:text-[21px] font-bold text-[#2C1810] tracking-tight mb-5">
                Event Categories
              </h2>

              <div className="grid grid-cols-2 divide-x divide-y divide-[#F0E8DF] border-y border-[#F0E8DF]">
                {eventCategories.map((cat, idx) => {
                  return (
                    <div
                      key={cat.key || idx}
                      className="flex flex-col items-center justify-center p-6 text-center transition hover:bg-[#FAF6F2]/50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF3EC] border border-[#EFE4DA] mb-3">
                        {getCategoryIcon(cat.key, cat.icon)}
                      </div>
                      <h4 className="text-[14.5px] font-bold text-[#2C1810]">
                        {cat.name}
                      </h4>
                      <p className="text-[12.5px] text-[#7F726A] mt-1">
                        {cat.display || `${cat.count} Events`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateCellDashboard;

