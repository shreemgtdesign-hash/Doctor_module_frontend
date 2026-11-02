import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import {
  FaBed,
  FaDoorOpen,
  FaFileMedical,
  FaPills,
  FaUtensils,
  FaRunning,
  FaCamera,
  FaLeaf,
} from "react-icons/fa";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadNurseDashboard } from "../../../redux/nurse/nurseThunk";
import {
  selectNurseDashboard,
  selectNurseDashboardLoading,
  selectNurseDashboardError,
  selectNursePeriod,
  setNursePeriod,
} from "../../../redux/nurse/nurseSlice";

const WardLeafIcon = ({ className = "h-4.5 w-4.5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    <path d="M10 15c2-.5 4-1.5 5-3" />
    <path d="M13 11c1.5-.5 3-1.5 3.5-2.5" />
  </svg>
);

const PERIOD_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
];

const NurseDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dashboard = useSelector(selectNurseDashboard);
  const loading = useSelector(selectNurseDashboardLoading);
  const error = useSelector(selectNurseDashboardError);
  const period = useSelector(selectNursePeriod);

  const [topPeriod, setTopPeriod] = useState("Today");
  const [wardPeriod, setWardPeriod] = useState("Today");
  const [recentPeriod, setRecentPeriod] = useState("Today");
  const [actionsPeriod, setActionsPeriod] = useState("Today");

  useEffect(() => {
    dispatch(loadNurseDashboard({ period }));
  }, [dispatch, period]);

  const handlePeriodChange = (val) => {
    setTopPeriod(val);
    dispatch(setNursePeriod(val.toLowerCase()));
    dispatch(loadNurseDashboard({ period: val.toLowerCase() }));
  };

  const {
    patients_admitted = 0,
    growth_comparison = "+0.0%",
    comparison_label = "Compared to last week",
    room_breakdown = {},
    admit_patient_action = {},
    ward_summary = {},
    recent_admissions = [],
    nurse_actions = {},
  } = dashboard || {};

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6 font-sans space-y-4">
        {/* ========================================================= */}
        {/* ERROR NOTIFICATION (IF ANY) */}
        {/* ========================================================= */}
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-3 text-xs text-red-600 dark:text-red-400">
            {typeof error === "string" ? error : "Failed to load dashboard data."}
          </div>
        )}

        {/* ========================================================= */}
        {/* TOP ROW: PATIENTS ADMITTED & ADMIT PATIENT QUICK ACTION */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Patients Admitted & Room Breakdown (9 cols) */}
          <div className="lg:col-span-9 rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-gradient-to-br from-white to-[#FAF6F2] dark:from-[#241E1B] dark:to-[#1C1613] p-6 shadow-xs flex flex-col justify-between">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
                  {patients_admitted}
                </span>
                <span className="text-[18px] font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
                   Patients Admitted
                </span>
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-[#15803D] bg-[#EBF8EE] dark:bg-[#16331E] px-2 py-0.5 rounded-full">
                  {growth_comparison}
                </span>
                <span className="text-xs text-[#7D726B] dark:text-[#A8988D]">
                  {comparison_label}
                </span>
              </div>

              {/* Period Dropdown */}
              <div className="relative inline-flex items-center">
                <select
                  value={topPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="appearance-none h-9 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#251E1A] pl-8 pr-8 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] outline-none cursor-pointer hover:bg-[#FAF6F2]"
                >
                  {PERIOD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <HiOutlineCalendar
                  size={14}
                  className="pointer-events-none absolute left-2.5 text-[#8A7D75]"
                />
                <HiOutlineChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2.5 text-[#8A7D75]"
                />
              </div>
            </div>

            {/* Metric Columns (6 stats) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 pt-6 border-t border-[#F2E8E1] dark:border-[#332A24] mt-5">
              <div className="text-center">
                <span className="block text-xs font-medium text-[#7D726B] dark:text-[#A8988D] mb-1">
                  Engaged
                </span>
                <span className="text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {room_breakdown.engaged ?? 0}
                </span>
              </div>

              <div className="text-center">
                <span className="block text-xs font-medium text-[#7D726B] dark:text-[#A8988D] mb-1">
                  Free
                </span>
                <span className="text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {room_breakdown.free ?? 0}
                </span>
              </div>

              <div className="text-center">
                <span className="block text-xs font-medium text-[#7D726B] dark:text-[#A8988D] mb-1">
                  Maintenance
                </span>
                <span className="text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {room_breakdown.maintenance ?? 0}
                </span>
              </div>

              <div className="text-center">
                <span className="block text-xs font-medium text-[#7D726B] dark:text-[#A8988D] mb-1">
                  AC Rooms
                </span>
                <span className="text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {room_breakdown.ac_rooms ?? 0}
                </span>
              </div>

              <div className="text-center">
                <span className="block text-xs font-medium text-[#7D726B] dark:text-[#A8988D] mb-1">
                  Non-AC
                </span>
                <span className="text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {room_breakdown.non_ac_rooms ?? 0}
                </span>
              </div>

              <div className="text-center">
                <span className="block text-xs font-medium text-[#7D726B] dark:text-[#A8988D] mb-1">
                  Garden
                </span>
                <span className="text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {room_breakdown.garden_rooms ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Admit Patient Action Card (3 cols) */}
          <div className="lg:col-span-3 rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-gradient-to-br from-white to-[#FAF6F2] dark:from-[#241E1B] dark:to-[#1C1613] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#4B2E2A] dark:text-[#EDE3DA] leading-snug">
                {admit_patient_action.title || "Admit Patient"}
              </h2>
              <p className="mt-2.5 text-xs leading-5 text-[#7D726B] dark:text-[#A8988D]">
                {admit_patient_action.description ||
                  "Quickly admit a new IPD patient and assign a room."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/nurse/ipd-patients?tab=upcoming")}
              className="mt-5 w-full h-11 rounded-xl bg-[#6E3C27] hover:bg-[#582F1E] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>View</span>
              <span className="h-5 w-5 rounded-full bg-[#542B1A] flex items-center justify-center text-[11px] font-bold">
                {admit_patient_action.pending_count ?? 0}
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 2: WARD SUMMARY CARD */}
        {/* ========================================================= */}
        <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-gradient-to-br from-white to-[#FAF6F2] dark:from-[#241E1B] dark:to-[#1C1613] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Ward Summary
            </h2>

            <div className="relative inline-flex items-center">
              <select
                value={wardPeriod}
                onChange={(e) => setWardPeriod(e.target.value)}
                className="appearance-none h-8 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#251E1A] pl-7 pr-7 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] outline-none cursor-pointer hover:bg-[#FAF6F2]"
              >
                {PERIOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <HiOutlineCalendar
                size={13}
                className="pointer-events-none absolute left-2 text-[#8A7D75]"
              />
              <HiOutlineChevronDown
                size={11}
                className="pointer-events-none absolute right-2 text-[#8A7D75]"
              />
            </div>
          </div>

          {/* 3 Occupancy Cards matching design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
            {/* Card 1: AC Occupancy */}
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#1E1714] p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#FBF1EA] dark:bg-[#342923] flex items-center justify-center text-[#8A4F32] dark:text-[#D5A794] shrink-0">
                  <WardLeafIcon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[13px] font-semibold text-[#3E2723] dark:text-[#EDE3DA]">
                  AC Occupancy
                </span>
              </div>
              <p className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] mt-4 tracking-tight leading-none">
                {ward_summary?.ac_occupancy?.engaged ?? 0}
              </p>
              <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-2">
                {ward_summary?.ac_occupancy?.label || `${ward_summary?.ac_occupancy?.engaged ?? 0} Engaged AC Rooms`}
              </p>
            </div>

            {/* Card 2: Non-AC Occupancy */}
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#1E1714] p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#FBF1EA] dark:bg-[#342923] flex items-center justify-center text-[#8A4F32] dark:text-[#D5A794] shrink-0">
                  <WardLeafIcon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[13px] font-semibold text-[#3E2723] dark:text-[#EDE3DA]">
                  Non-AC Occupancy
                </span>
              </div>
              <p className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] mt-4 tracking-tight leading-none">
                {ward_summary?.non_ac_occupancy?.engaged ?? 0}
              </p>
              <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-2">
                {ward_summary?.non_ac_occupancy?.label || `${ward_summary?.non_ac_occupancy?.engaged ?? 0} Engaged Non-AC Rooms`}
              </p>
            </div>

            {/* Card 3: Garden Occupancy */}
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#1E1714] p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#FBF1EA] dark:bg-[#342923] flex items-center justify-center text-[#8A4F32] dark:text-[#D5A794] shrink-0">
                  <WardLeafIcon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[13px] font-semibold text-[#3E2723] dark:text-[#EDE3DA]">
                  Garden Occupancy
                </span>
              </div>
              <p className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] mt-4 tracking-tight leading-none">
                {ward_summary?.garden_occupancy?.engaged ?? 0}
              </p>
              <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-2">
                {ward_summary?.garden_occupancy?.label || `${ward_summary?.garden_occupancy?.engaged ?? 0} Engaged Garden Rooms`}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 3: RECENT ADMISSIONS & NURSE ACTIONS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Recent Admissions (7 cols) */}
          <div className="lg:col-span-7 rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-gradient-to-br from-white to-[#FAF6F2] dark:from-[#241E1B] dark:to-[#1C1613] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Recent Admissions
                </h2>

                <div className="relative inline-flex items-center">
                  <select
                    value={recentPeriod}
                    onChange={(e) => setRecentPeriod(e.target.value)}
                    className="appearance-none h-8 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#251E1A] pl-7 pr-7 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] outline-none cursor-pointer hover:bg-[#FAF6F2]"
                  >
                    {PERIOD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <HiOutlineCalendar
                    size={13}
                    className="pointer-events-none absolute left-2 text-[#8A7D75]"
                  />
                  <HiOutlineChevronDown
                    size={11}
                    className="pointer-events-none absolute right-2 text-[#8A7D75]"
                  />
                </div>
              </div>

              {/* Admissions List */}
              {recent_admissions.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#7D726B] dark:text-[#A8988D]">
                  No recent admissions found.
                </div>
              ) : (
                <div className="divide-y divide-[#F2E8E1] dark:divide-[#332A24]">
                  {recent_admissions.map((adm, idx) => (
                    <div
                      key={`${adm.id || idx}`}
                      className="py-3.5 flex items-center justify-between gap-4 first:pt-1 last:pb-1"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA] truncate">
                          {adm.patient_name || adm.name}{" "}
                          <span className="font-normal text-[#7D726B] dark:text-[#A8988D]">
                            (Patient ID: {adm.patient_code})
                          </span>
                        </p>
                        <p className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5 truncate">
                          {adm.room_no || adm.room_number || "Rm 104"} • {adm.room_type || "AC"} • {adm.doctor_name || adm.sr_doctor || "Dr. Sharma"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <span className="text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                          {adm.department || "IPD"}
                        </span>
                        <span className="text-xs text-[#7D726B] dark:text-[#A8988D] w-16">
                          {adm.time || "10:43 AM"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nurse Actions (5 cols) */}
          <div className="lg:col-span-5 rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-gradient-to-br from-white to-[#FAF6F2] dark:from-[#241E1B] dark:to-[#1C1613] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Nurse Actions
                </h2>

                <div className="relative inline-flex items-center">
                  <select
                    value={actionsPeriod}
                    onChange={(e) => setActionsPeriod(e.target.value)}
                    className="appearance-none h-8 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#251E1A] pl-7 pr-7 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] outline-none cursor-pointer hover:bg-[#FAF6F2]"
                  >
                    {PERIOD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <HiOutlineCalendar
                    size={13}
                    className="pointer-events-none absolute left-2 text-[#8A7D75]"
                  />
                  <HiOutlineChevronDown
                    size={11}
                    className="pointer-events-none absolute right-2 text-[#8A7D75]"
                  />
                </div>
              </div>

              {/* Nurse Action List */}
              <div className="space-y-3 pt-1">
                {[
                  {
                    label: "Patient Logs",
                    count: nurse_actions.patient_logs ?? 12,
                    path: "/nurse/patient-logs",
                  },
                  {
                    label: "Activities Incomplete",
                    count: nurse_actions.activities_incomplete ?? 9,
                    path: "/nurse/activities",
                  },
                  {
                    label: "Photo Uploads Due",
                    count: nurse_actions.photo_uploads_due ?? 4,
                    path: "/nurse/photo-uploads",
                  },
                  {
                    label: "Pending Medicines",
                    count: nurse_actions.pending_medicines ?? 4,
                    path: "/nurse/pending-actions/medicines",
                  },
                  {
                    label: "Pending Therapies",
                    count: nurse_actions.pending_therapies ?? 4,
                    path: "/nurse/pending-actions/therapies",
                  },
                  {
                    label: "Pending Meals",
                    count: nurse_actions.pending_meals ?? 4,
                    path: "/nurse/pending-actions/meals",
                  },
                ].map((act) => (
                  <div
                    key={act.label}
                    onClick={() => navigate(act.path)}
                    className="flex items-center justify-between py-2 border-b border-[#F7EFE9] dark:border-[#2D231E] last:border-0 hover:bg-[#FAF6F2] dark:hover:bg-[#2B221D] px-2 rounded-lg transition cursor-pointer"
                  >
                    <span className="text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA]">
                      {act.label}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="min-w-[28px] h-6 rounded-full bg-[#FAF2EB] dark:bg-[#342923] text-[#8A4F32] dark:text-[#D5A794] text-[11px] font-bold flex items-center justify-center px-2">
                        {act.count}
                      </span>
                      <HiOutlineChevronRight
                        size={14}
                        className="text-[#9C8F85] dark:text-[#6E6157]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NurseDashboard;
