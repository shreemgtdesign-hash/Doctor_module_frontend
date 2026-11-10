import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { HiOutlinePhotograph } from "react-icons/hi";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadWardSummary } from "../../../redux/nurse/nurseThunk";
import {
  selectNurseWardSummaryRooms,
  selectNurseWardSummaryFilters,
  selectNurseWardSummaryHeader,
  selectNurseWardSummaryLoading,
  selectNurseWardSummaryError,
} from "../../../redux/nurse/nurseSlice";

const DEFAULT_ROOM_TYPES = [
  { key: "ac", label: "AC Rooms" },
  { key: "non-ac", label: "Non-AC Rooms" },
  { key: "garden", label: "Garden Rooms" },
];

const DEFAULT_STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "occupied", label: "Occupied" },
  { key: "available", label: "Available" },
];

const NurseWardSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get active filters from URL or location state, defaulting to "ac" and "all"
  const currentType =
    searchParams.get("type") ||
    location.state?.type ||
    "ac";
  const currentStatus =
    searchParams.get("status") ||
    location.state?.status ||
    "all";

  const rooms = useSelector(selectNurseWardSummaryRooms);
  const filters = useSelector(selectNurseWardSummaryFilters);
  const header = useSelector(selectNurseWardSummaryHeader);
  const loading = useSelector(selectNurseWardSummaryLoading);
  const error = useSelector(selectNurseWardSummaryError);

  // Fetch ward summary whenever type or status filter changes
  useEffect(() => {
    dispatch(
      loadWardSummary({
        type: currentType,
        status: currentStatus,
      })
    );
  }, [dispatch, currentType, currentStatus]);

  // Handle changing room type (AC, Non-AC, Garden)
  const handleTypeSelect = (typeKey) => {
    setSearchParams({
      type: typeKey,
      status: currentStatus,
    });
  };

  // Handle changing status filter (All, Occupied, Available)
  const handleStatusSelect = (statusKey) => {
    setSearchParams({
      type: currentType,
      status: statusKey,
    });
  };

  // Derive display types for pills (excluding "all" as in Figma design)
  const typesToDisplay =
    Array.isArray(filters?.types) && filters.types.length > 0
      ? filters.types.filter((t) => t.key !== "all")
      : DEFAULT_ROOM_TYPES;

  // Derive status tabs
  const statusTabsToDisplay =
    Array.isArray(filters?.statuses) && filters.statuses.length > 0
      ? filters.statuses
      : DEFAULT_STATUS_TABS;

  // Helper for badge color styling
  const getBadgeStyles = (badgeColor, status) => {
    const color = (badgeColor || status || "").toLowerCase();
    if (color.includes("green") || color.includes("occupied")) {
      return "bg-[#EAF5EA] text-[#2E7D32] dark:bg-[#1A3320] dark:text-[#86EFAC]";
    }
    if (color.includes("blue") || color.includes("maintenance")) {
      return "bg-[#E0F2FE] text-[#0369A1] dark:bg-[#164E63] dark:text-[#7DD3FC]";
    }
    // tan / free / available
    return "bg-[#F5EFEB] text-[#8A7263] dark:bg-[#342923] dark:text-[#D5A794]";
  };

  // Helper for room subtitle (patient and doctor names)
  const getRoomSubtitle = (room) => {
    if (room.patient_name && room.doctor_name) {
      return `${room.patient_name} · ${room.doctor_name}`;
    }
    if (room.patient_name) {
      return room.patient_name;
    }
    if (room.subtitle && room.subtitle !== "Occupied") {
      return room.subtitle;
    }
    if (room.status === "Available" || room.badge === "Free") {
      return "Available";
    }
    if (room.status === "Maintenance" || room.badge === "Maintenance") {
      return "Under Maintenance";
    }
    return room.subtitle || room.status || "Occupied";
  };

  const handleCardClick = (room) => {
    if (room.admission_id) {
      navigate(`/nurse/patients/${room.admission_id}/daily-log`);
    }
  };

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-8 py-7 font-sans">
        {/* ========================================================= */}
        {/* BREADCRUMB HEADER */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
          <button
            type="button"
            onClick={() => navigate("/nurse/dashboard")}
            className="hover:text-[#8A5035] transition cursor-pointer"
          >
            Dashboard

          </button>
          <span className="text-[#8A7D75] font-normal text-lg">&gt;</span>
          <span>{header?.title || "Ward Summary"}</span>
        </div>

        {/* ========================================================= */}
        {/* ROOM TYPE PILL BUTTONS (AC Rooms, Non-AC Rooms, Garden Rooms) */}
        {/* ========================================================= */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {typesToDisplay.map((t) => {
            const isActive = currentType.toLowerCase() === t.key.toLowerCase();
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => handleTypeSelect(t.key)}
                className={`rounded-xl text-xs px-5 py-2 transition cursor-pointer font-medium ${
                  isActive
                    ? "border border-[#2C1810] dark:border-[#EDE3DA] bg-white dark:bg-[#201A17] text-[#2C1810] dark:text-[#EDE3DA] font-semibold shadow-xs"
                    : "border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] text-[#7D726B] dark:text-[#A8988D] hover:border-[#8A7D75]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* STATUS UNDERLINE TABS (All, Occupied, Available) */}
        {/* ========================================================= */}
        <div className="mt-5 flex items-center gap-6">
          {statusTabsToDisplay.map((s) => {
            const isActive = currentStatus.toLowerCase() === s.key.toLowerCase();
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => handleStatusSelect(s.key)}
                className={`text-xs pb-2 relative transition cursor-pointer ${
                  isActive
                    ? "text-[#2C1810] dark:text-[#EDE3DA] font-semibold"
                    : "text-[#7D726B] dark:text-[#A8988D] font-medium hover:text-[#2C1810] dark:hover:text-[#EDE3DA]"
                }`}
              >
                <span>{s.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2C1810] dark:bg-[#EDE3DA] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* ROOM CARDS GRID */}
        {/* ========================================================= */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-5 text-xs text-red-600 dark:text-red-400">
            {typeof error === "string" ? error : "Failed to load ward summary."}
          </div>
        )}

        {loading ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-[20px] bg-white dark:bg-[#201A17] border border-[#E7DBD3] dark:border-[#382D25] animate-pulse p-3"
              >
                <div className="w-full h-40 rounded-2xl bg-[#F5EFEB] dark:bg-[#2A221E]" />
                <div className="px-1.5 pt-3 space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="mt-10 rounded-[20px] border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] p-12 text-center">
            <HiOutlinePhotograph size={36} className="mx-auto text-[#8A7D75] stroke-[1.5]" />
            <p className="text-sm font-semibold text-[#2C1810] dark:text-[#EDE3DA] mt-3">
              No rooms found
            </p>
            <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
              There are no rooms matching the selected {currentType} ward and {currentStatus} status filter.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => {
              const badgeText = room.badge || room.status || "Occupied";
              const badgeClass = getBadgeStyles(room.badge_color, badgeText);
              const subtitle = getRoomSubtitle(room);
              const priceText =
                room.price_display ||
                (room.daily_charge
                  ? `₹${Number(room.daily_charge).toLocaleString()} / night`
                  : "₹2,500 / night");

              return (
                <div
                  key={room.id || room.room_number}
                  onClick={() => handleCardClick(room)}
                  className={`rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] p-3 shadow-xs hover:border-[#CBB4A5] transition flex flex-col justify-between ${
                    room.admission_id ? "cursor-pointer" : ""
                  }`}
                >
                  {/* Room Photo Area */}
                  <div className="w-full h-40 rounded-2xl bg-[#F5EFEB] dark:bg-[#2A221E] flex flex-col items-center justify-center gap-1.5 text-[#8A7D75] dark:text-[#A8988D] overflow-hidden">
                    {room.photo_url ? (
                      <img
                        src={room.photo_url}
                        alt={room.room_number}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <HiOutlinePhotograph size={24} className="stroke-[1.5]" />
                        <span className="text-xs font-normal text-[#8A7D75] dark:text-[#A8988D]">
                          Room photo
                        </span>
                      </>
                    )}
                  </div>

                  {/* Details Area */}
                  <div className="px-1.5 pt-3 pb-1">
                    {/* Room Number & Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                        {room.room_number}
                      </h3>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeClass}`}
                      >
                        {badgeText}
                      </span>
                    </div>

                    {/* Subtitle / Patient & Doctor */}
                    <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1 truncate">
                      {subtitle}
                    </p>

                    {/* Price */}
                    <p className="text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA] mt-2">
                      {priceText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NurseWardSummary;
