import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiChevronDown,
  HiArrowRight,
} from "react-icons/hi";
import { getCorporateMyEvents } from "../../../api/corporateDashboardApi";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import PackageDetailsModal from "../components/PackageDetailsModal";

// =========================================================
// MOCK DATA (From User's API Response)
// =========================================================
const FALLBACK_EVENTS_DATA = [
  {
    id: "e7a8b001-628d-4b82-9842-7cf3b04c9001",
    event_no: "EVT141226001",
    title: "Yoga & Meditation",
    subtitle: "Improves focus, reduces stress and enhances well-being.",
    description: "Improves focus, reduces stress and enhances well-being.",
    date: "2026-12-14",
    formatted_date: "14th December, 2026",
    time: "10AM - 6PM",
    timings: "10AM - 6PM",
    time_display: "10AM - 6PM",
    duration: "1 Day",
    attendees: 0,
    attendees_count: 0,
    attendees_label: "-",
    meta: "14th December, 2026 | 10AM - 6PM | -",
    status: "Confirmation Pending",
    status_badge: {
      label: "Confirmation Pending",
      color: "orange",
      background_color: "#FFF3E8",
      text_color: "#B45309",
    },
    image_url:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
    category: "Workshops",
    action_label: "View Details →",
    action_url: "/corporate/events/e7a8b001-628d-4b82-9842-7cf3b04c9001",
  },
  {
    id: "e7a8b002-628d-4b82-9842-7cf3b04c9002",
    event_no: "EVT171126002",
    title: "Yoga & Meditation",
    subtitle: "Improves focus, reduces stress and enhances well-being.",
    description: "Improves focus, reduces stress and enhances well-being.",
    date: "2026-12-14",
    formatted_date: "14th December, 2026",
    time: "10AM - 6PM",
    timings: "10AM - 6PM",
    time_display: "10AM - 6PM",
    duration: "1 Day",
    attendees: 0,
    attendees_count: 0,
    attendees_label: "-",
    meta: "14th December, 2026 | 10AM - 6PM | -",
    status: "Upcoming",
    status_badge: {
      label: "Upcoming",
      color: "blue",
      background_color: "#E0F2FE",
      text_color: "#0284C7",
    },
    image_url:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    category: "Workshops",
    action_label: "View Details →",
    action_url: "/corporate/events/e7a8b002-628d-4b82-9842-7cf3b04c9002",
  },
  {
    id: "e7a8b003-628d-4b82-9842-7cf3b04c9003",
    event_no: "EVT171126003",
    title: "Stress Management",
    subtitle: "Improves focus, reduces stress and enhances well-being.",
    description: "Improves focus, reduces stress and enhances well-being.",
    date: "2026-11-17",
    formatted_date: "17th November, 2026",
    time: "10AM - 1PM",
    timings: "10AM - 1PM",
    time_display: "10AM - 1PM",
    duration: "1/2 Day",
    attendees: 0,
    attendees_count: 0,
    attendees_label: "-",
    meta: "17th November, 2026 | 10AM - 1PM | -",
    status: "Upcoming",
    status_badge: {
      label: "Upcoming",
      color: "blue",
      background_color: "#E0F2FE",
      text_color: "#0284C7",
    },
    image_url:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    category: "Workshops",
    action_label: "View Details →",
    action_url: "/corporate/events/e7a8b003-628d-4b82-9842-7cf3b04c9003",
  },
  {
    id: "e7a8b004-628d-4b82-9842-7cf3b04c9004",
    event_no: "EVT140726004",
    title: "Nutrition & Diet",
    subtitle: "Improves focus, reduces stress and enhances well-being.",
    description: "Improves focus, reduces stress and enhances well-being.",
    date: "2026-07-14",
    formatted_date: "14th July, 2026",
    time: "10AM - 6PM",
    timings: "10AM - 6PM",
    time_display: "10AM - 6PM",
    duration: "1 Day",
    attendees: 76,
    attendees_count: 76,
    attendees_label: "76 Attendees",
    meta: "14th July, 2026 | 10AM - 6PM | 76 Attendees",
    status: "Completed",
    status_badge: {
      label: "Completed",
      color: "green",
      background_color: "#E6F4EA",
      text_color: "#137333",
    },
    image_url:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    category: "Seminars",
    action_label: "View Details →",
    action_url: "/corporate/events/e7a8b004-628d-4b82-9842-7cf3b04c9004",
  },
  {
    id: "e7a8b005-628d-4b82-9842-7cf3b04c9005",
    event_no: "EVT170926005",
    title: "Stress Management",
    subtitle: "Improves focus, reduces stress and enhances well-being.",
    description: "Improves focus, reduces stress and enhances well-being.",
    date: "2026-09-17",
    formatted_date: "17th September, 2026",
    time: "10AM - 1PM",
    timings: "10AM - 1PM",
    time_display: "10AM - 1PM",
    duration: "1/2 Day",
    attendees: 79,
    attendees_count: 79,
    attendees_label: "79 Attendees",
    meta: "17th September, 2026 | 10AM - 1PM | 79 Attendees",
    status: "Completed",
    status_badge: {
      label: "Completed",
      color: "green",
      background_color: "#E6F4EA",
      text_color: "#137333",
    },
    image_url:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    category: "Workshops",
    action_label: "View Details →",
    action_url: "/corporate/events/e7a8b005-628d-4b82-9842-7cf3b04c9005",
  },
  {
    id: "e7a8b006-628d-4b82-9842-7cf3b04c9006",
    event_no: "EVT140726006",
    title: "Nutrition & Diet",
    subtitle: "Improves focus, reduces stress and enhances well-being.",
    description: "Improves focus, reduces stress and enhances well-being.",
    date: "2026-07-14",
    formatted_date: "14th July, 2026",
    time: "10AM - 6PM",
    timings: "10AM - 6PM",
    time_display: "10AM - 6PM",
    duration: "1 Day",
    attendees: 76,
    attendees_count: 76,
    attendees_label: "76 Attendees",
    meta: "14th July, 2026 | 10AM - 6PM | 76 Attendees",
    status: "Completed",
    status_badge: {
      label: "Completed",
      color: "green",
      background_color: "#E6F4EA",
      text_color: "#137333",
    },
    image_url:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    category: "Seminars",
    action_label: "View Details →",
    action_url: "/corporate/events/e7a8b006-628d-4b82-9842-7cf3b04c9006",
  },
  {
    id: "e7a8b007-628d-4b82-9842-7cf3b04c9007",
    event_no: "EVT280726007",
    title: "Ayurvedic Wellness Retreat",
    subtitle: "Improves focus, reduces stress and enhances well-being.",
    description: "Improves focus, reduces stress and enhances well-being.",
    date: "2026-07-28",
    formatted_date: "28th July, 2026",
    time: "9AM - 6PM",
    timings: "9AM - 6PM",
    time_display: "9AM - 6PM",
    duration: "2 Days",
    attendees: 85,
    attendees_count: 85,
    attendees_label: "85 Attendees",
    meta: "28th July, 2026 | 9AM - 6PM | 85 Attendees",
    status: "Completed",
    status_badge: {
      label: "Completed",
      color: "green",
      background_color: "#E6F4EA",
      text_color: "#137333",
    },
    image_url:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
    category: "Retreats",
    action_label: "View Details →",
    action_url: "/corporate/events/e7a8b007-628d-4b82-9842-7cf3b04c9007",
  },
];

const DEFAULT_TABS = [
  { key: "all", label: "All", count: 47 },
  { key: "upcoming", label: "Upcoming", count: 14 },
  { key: "past", label: "Past", count: 33 },
];

const DURATIONS = [
  { label: "Select Duration", value: "all" },
  { label: "1/2 Day", value: "1/2 Day" },
  { label: "1 Day", value: "1 Day" },
  { label: "2 Days", value: "2 Days" },
];

const CorporateMyEvents = () => {
  const navigate = useNavigate();

  // Active user / organization name
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [activeTab, setActiveTab] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [events, setEvents] = useState([]);
  const [tabsData, setTabsData] = useState(DEFAULT_TABS);
  const [headerInfo, setHeaderInfo] = useState({
    title: "My Events",
    subtitle: "Track and manage all events for your organization.",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 47,
    total_pages: 8,
    showing_start: 1,
    showing_end: 6,
    showing_text: "Showing Services 1 - 6 of 47",
    has_prev: false,
    has_next: true,
  });
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Fetch events from API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getCorporateMyEvents({
        tab: activeTab,
        status: activeTab,
        duration: selectedDuration,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (res.data?.success || res.data?.data || res.data?.events) {
        const dataList = res.data.data || res.data.events || [];
        setEvents(dataList);

        if (res.data.tabs) {
          setTabsData(res.data.tabs);
        }
        if (res.data.title || res.data.subtitle) {
          setHeaderInfo({
            title: res.data.title || "My Events",
            subtitle:
              res.data.subtitle ||
              "Track and manage all events for your organization.",
          });
        }
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        } else {
          const totalCount = res.data.count || res.data.total || dataList.length;
          const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
          const showingStart = (currentPage - 1) * itemsPerPage + 1;
          const showingEnd = Math.min(currentPage * itemsPerPage, totalCount);

          setPagination({
            page: currentPage,
            limit: itemsPerPage,
            total: totalCount,
            total_pages: totalPages,
            showing_start: showingStart,
            showing_end: showingEnd,
            showing_text: `Showing Services ${showingStart} - ${showingEnd} of ${totalCount}`,
            has_prev: currentPage > 1,
            has_next: currentPage < totalPages,
          });
        }
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.warn("Could not load from API, falling back to mock data:", err);

      // Client-side fallback filtering
      let filtered = [...FALLBACK_EVENTS_DATA];

      if (activeTab === "upcoming") {
        filtered = filtered.filter((item) => {
          const st = (item.status || "").toLowerCase();
          return st.includes("upcoming") || st.includes("pending");
        });
      } else if (activeTab === "past") {
        filtered = filtered.filter((item) => {
          const st = (item.status || "").toLowerCase();
          return st.includes("completed") || st.includes("past");
        });
      }

      if (selectedDuration !== "all") {
        filtered = filtered.filter(
          (item) => item.duration === selectedDuration
        );
      }

      const totalCount = filtered.length || 47;
      const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
      const startIdx = (currentPage - 1) * itemsPerPage;
      const paged = filtered.slice(startIdx, startIdx + itemsPerPage);
      const showingStart = Math.min(startIdx + 1, totalCount);
      const showingEnd = Math.min(startIdx + itemsPerPage, totalCount);

      setEvents(paged.length > 0 ? paged : filtered);
      setPagination({
        page: currentPage,
        limit: itemsPerPage,
        total: totalCount,
        total_pages: totalPages,
        showing_start: showingStart,
        showing_end: showingEnd,
        showing_text: `Showing Services ${showingStart} - ${showingEnd} of ${totalCount}`,
        has_prev: currentPage > 1,
        has_next: currentPage < totalPages,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab, selectedDuration, currentPage]);

  const handlePageChange = (direction) => {
    if (direction === "prev" && (pagination.has_prev || currentPage > 1)) {
      setCurrentPage((p) => Math.max(1, p - 1));
    } else if (
      direction === "next" &&
      (pagination.has_next || currentPage < (pagination.total_pages || 1))
    ) {
      setCurrentPage((p) => p + 1);
    }
  };

  // Status Badge Styling Helper
  const renderStatusBadge = (item) => {
    const status = (item.status || item.status_badge?.label || "").toLowerCase();

    // 1. Confirmation Pending (Peach / Amber)
    if (status.includes("pending")) {
      return (
        <span className="inline-flex items-center rounded-md bg-[#FFF3E8] px-3 py-1 text-xs font-semibold text-[#B45309]">
          {item.status_badge?.label || "Confirmation Pending"}
        </span>
      );
    }

    // 2. Upcoming (Light Blue)
    if (status.includes("upcoming")) {
      return (
        <span className="inline-flex items-center rounded-md bg-[#E0F2FE] px-3 py-1 text-xs font-semibold text-[#0284C7]">
          {item.status_badge?.label || "Upcoming"}
        </span>
      );
    }

    // 3. Completed (Soft Green)
    if (status.includes("completed")) {
      return (
        <span className="inline-flex items-center rounded-md bg-[#E6F4EA] px-3 py-1 text-xs font-semibold text-[#137333]">
          {item.status_badge?.label || "Completed"}
        </span>
      );
    }

    // Default badge
    const bg = item.status_badge?.background_color || "#FAF4EF";
    const text = item.status_badge?.text_color || "#4D2E23";
    return (
      <span
        style={{ backgroundColor: bg, color: text }}
        className="inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold"
      >
        {item.status_badge?.label || item.status || "Upcoming"}
      </span>
    );
  };

  // Determine Organization Title: matches "IBM's Events" from screenshot
  const orgName =
    user?.organization_name ||
    user?.company_name ||
    user?.company ||
    (headerInfo.title && headerInfo.title !== "My Events"
      ? headerInfo.title.replace(/['’]s Events/i, "").trim()
      : "");

  const pageTitle = `${orgName}' Events`;

  return (
    <DashboardLayout role="corporate">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* ========================================================= */}
        {/* HEADER: Title & Subtitle */}
        {/* ========================================================= */}
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#2C1810] tracking-tight">
            {pageTitle}
          </h1>
          <p className="mt-1 text-[14px] text-[#7F726A]">
            {headerInfo.subtitle || "Track and manage all events for your organization."}
          </p>
        </div>

        {/* ========================================================= */}
        {/* TABS: All, Upcoming, Past */}
        {/* ========================================================= */}
        <div className="border-b border-[#EFE5DC] pt-1">
          <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar">
            {tabsData.map((tab) => {
              const isActive =
                activeTab === tab.key || activeTab === tab.label?.toLowerCase();
              return (
                <button
                  key={tab.key || tab.label}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key || tab.label.toLowerCase());
                    setCurrentPage(1);
                  }}
                  className={`pb-3 text-[15px] transition-all whitespace-nowrap relative ${
                    isActive
                      ? "text-[#2C1810] font-bold border-b-2 border-[#2C1810]"
                      : "text-[#8B7A70] hover:text-[#2C1810] font-medium"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* FILTER BAR: Duration dropdown + Pagination info */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-4 pt-1">
          {/* Duration Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDurationDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-[#EFE5DC] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#4D2E23] shadow-xs hover:border-[#D5C2B4] transition"
            >
              <span>
                {selectedDuration === "all" || selectedDuration === "All"
                  ? "Select Duration"
                  : selectedDuration}
              </span>
              <HiChevronDown
                size={14}
                className={`text-[#7F726A] transition-transform ${
                  durationDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {durationDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 z-20 w-44 rounded-2xl border border-[#EFE5DC] bg-white p-1.5 shadow-xl">
                {DURATIONS.map((dur) => {
                  const isSelected = selectedDuration === dur.value;
                  return (
                    <button
                      key={dur.value}
                      type="button"
                      onClick={() => {
                        setSelectedDuration(dur.value);
                        setDurationDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left rounded-xl px-3.5 py-2 text-xs transition ${
                        isSelected
                          ? "bg-[#FAF4EF] font-bold text-[#4D2E23]"
                          : "text-[#7F726A] hover:bg-[#FAF6F2] hover:text-[#4D2E23]"
                      }`}
                    >
                      {dur.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Showing Count & Pagination Controls */}
          <div className="flex items-center gap-3 text-xs text-[#7F726A]">
            <span>
              {pagination.showing_text ||
                `Showing Services 1 - ${events.length} of ${pagination.total || 47}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePageChange("prev")}
                disabled={!pagination.has_prev && currentPage <= 1}
                aria-label="Previous Page"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EFE5DC] bg-white text-[#4D2E23] hover:bg-[#FAF4EF] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <HiOutlineChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => handlePageChange("next")}
                disabled={
                  !pagination.has_next &&
                  currentPage >= (pagination.total_pages || 1)
                }
                aria-label="Next Page"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EFE5DC] bg-white text-[#4D2E23] hover:bg-[#FAF4EF] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <HiOutlineChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* EVENTS LIST */}
        {/* ========================================================= */}
        {loading ? (
          <div className="py-20 text-center text-[#7F726A]">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-[#EFE5DC] bg-white p-8">
            <p className="text-[15px] font-semibold text-[#4D2E23]">
              No events found
            </p>
            <p className="mt-1 text-xs text-[#7F726A]">
              Try choosing another tab or duration filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0E6DE] bg-transparent">
            {events.map((event) => {
              // Attendees text logic: if > 0 show e.g. "76 Attendees", otherwise show "-"
              const attendeesCount = Number(
                event.attendees_count ?? event.attendees ?? 0
              );
              const attendeesDisplay =
                attendeesCount > 0
                  ? event.attendees_label || `${attendeesCount} Attendees`
                  : "-";

              const formattedDate =
                event.formatted_date ||
                (event.date
                  ? new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Date TBA");

              const timingDisplay =
                event.time_display || event.timings || event.time || "10AM - 6PM";

              return (
                <div
                  key={event.id || event.event_no}
                  className="py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group transition"
                >
                  {/* Event Thumbnail */}
                  <div className="w-[110px] h-[110px] sm:w-[120px] sm:h-[120px] rounded-2xl overflow-hidden shrink-0 bg-[#F5ECE5] shadow-xs">
                    <img
                      src={
                        event.image_url ||
                        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={event.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0 w-full flex flex-col justify-between self-stretch py-0.5">
                    {/* Top Row: Title + Status Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-[16px] sm:text-[17px] font-bold text-[#2C1810] tracking-tight truncate">
                        {event.title}
                      </h2>
                      <div className="shrink-0">{renderStatusBadge(event)}</div>
                    </div>

                    {/* Meta Row: Date | Time | Attendees */}
                    <div className="flex flex-wrap items-center gap-2 text-[12px] sm:text-[13px] text-[#8B7A70] mt-1.5 font-normal">
                      <span>{formattedDate}</span>
                      <span className="text-[#D5C2B4]">|</span>
                      <span>{timingDisplay}</span>
                      <span className="text-[#D5C2B4]">|</span>
                      <span>{attendeesDisplay}</span>
                    </div>

                    {/* Description */}
                    <p className="mt-1.5 text-[13px] sm:text-[14px] text-[#6B5E57] line-clamp-2 leading-relaxed">
                      {event.description || event.subtitle}
                    </p>

                    {/* Action: View Details */}
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEventId(event.id);
                        }}
                        className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#4D2E23] hover:text-[#7A4933] transition group-hover:translate-x-0.5 duration-200 cursor-pointer"
                      >
                        <span>{event.action_label || "View Details →"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* DETAILS MODAL */}
        {/* ========================================================= */}
        {selectedEventId && (
          <PackageDetailsModal
            packageId={selectedEventId}
            packageData={events.find((e) => e.id === selectedEventId)}
            isOpen={Boolean(selectedEventId)}
            onClose={() => setSelectedEventId(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CorporateMyEvents;

