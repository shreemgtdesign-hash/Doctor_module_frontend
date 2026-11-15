import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineMagnifyingGlass,
  HiOutlineMicrophone,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadPatientsAdmitted } from "../../../redux/nurse/nurseThunk";
import {
  selectNursePatientsAdmitted,
  selectNursePatientsAdmittedData,
  selectNursePatientsAdmittedLoading,
  selectNursePatientsAdmittedError,
} from "../../../redux/nurse/nurseSlice";

const NursePatientsAdmitted = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPeriod = searchParams.get("period") || "month";
  const [period, setPeriod] = useState(initialPeriod);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 9;

  const rawAdmitted = useSelector(selectNursePatientsAdmitted);
  const patientsList = useSelector(selectNursePatientsAdmittedData);
  const loading = useSelector(selectNursePatientsAdmittedLoading);
  const error = useSelector(selectNursePatientsAdmittedError);

  // Sync state to URL and fetch data
  useEffect(() => {
    const params = {
      period,
      page,
      limit,
    };
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    setSearchParams(
      {
        period,
        page: String(page),
        ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
      },
      { replace: true }
    );

    dispatch(loadPatientsAdmitted(params));
  }, [dispatch, period, page, searchTerm]);

  // Fallback pagination calculations
  const totalCount =
    rawAdmitted?.total_records ??
    rawAdmitted?.count ??
    rawAdmitted?.pagination?.total ??
    rawAdmitted?.pagination?.total_records ??
    patientsList.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const showingText = useMemo(() => {
    if (rawAdmitted?.showing_text) {
      return rawAdmitted.showing_text;
    }
    if (rawAdmitted?.pagination?.showing_text) {
      return rawAdmitted.pagination.showing_text;
    }
    if (totalCount === 0) {
      return "Showing Actions 0 of 0";
    }
    const from = (page - 1) * limit + 1;
    const to = Math.min(totalCount, page * limit);
    return `Showing Actions ${from} - ${to} of ${totalCount}`;
  }, [rawAdmitted, totalCount, page, limit]);

  const handleViewDetails = (item) => {
    const targetId = item.patient_id || item.admission_id || item.id;
    const url = item.action_url || `/nurse/patients/${targetId}/daily-log`;
    navigate(url, {
      state: { patient: item },
    });
  };

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6 font-sans space-y-5">
        {/* ========================================================= */}
        {/* TOP BAR: BREADCRUMB & PERIOD DROPDOWN */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => navigate("/nurse/dashboard")}
              className="font-medium text-[#7D726B] hover:text-[#4B2E2A] dark:text-[#A8988D] dark:hover:text-white transition cursor-pointer"
            >
              Dashboard
            </button>
            <span className="text-[#A8988D] dark:text-[#7D726B] font-semibold">&gt;</span>
            <span className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Patients Admitted
            </span>
          </div>

          {/* Period Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setPage(1);
              }}
              className="appearance-none h-10 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#251E1A] pl-9 pr-8 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] outline-none cursor-pointer shadow-xs hover:bg-[#FAF6F2]"
            >
              <option value="month">This Month</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="all">All</option>
            </select>
            <HiOutlineCalendar
              size={15}
              className="pointer-events-none absolute left-3 text-[#8A7D75]"
            />
            <HiOutlineChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5 text-[#8A7D75]"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* SEARCH BAR */}
        {/* ========================================================= */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Name or Patient ID"
            className="w-full h-12 rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] pl-11 pr-11 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] placeholder:text-[#A8988D] outline-none shadow-xs focus:border-[#8A4F32] transition"
          />
          <HiOutlineMagnifyingGlass
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7D75]"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7D75] hover:text-[#4B2E2A] dark:hover:text-[#EDE3DA] transition cursor-pointer"
            title="Voice search"
          >
            <HiOutlineMicrophone size={18} />
          </button>
        </div>

        {/* ========================================================= */}
        {/* PAGINATION TEXT AND CONTROLS */}
        {/* ========================================================= */}
        <div className="flex items-center justify-end gap-3 text-xs text-[#7D726B] dark:text-[#A8988D]">
          <span>{showingText}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 rounded-lg border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] flex items-center justify-center text-[#7D726B] dark:text-[#A8988D] hover:bg-[#FAF6F2] dark:hover:bg-[#2E2521] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
              title="Previous Page"
            >
              <HiChevronLeft size={14} />
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 rounded-lg border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] flex items-center justify-center text-[#7D726B] dark:text-[#A8988D] hover:bg-[#FAF6F2] dark:hover:bg-[#2E2521] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
              title="Next Page"
            >
              <HiChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ERROR NOTIFICATION */}
        {/* ========================================================= */}
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-3 text-xs text-red-600 dark:text-red-400">
            {typeof error === "string" ? error : "Failed to load patients admitted list."}
          </div>
        )}

        {/* ========================================================= */}
        {/* PATIENTS ADMITTED TABLE */}
        {/* ========================================================= */}
        <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF4EF] dark:bg-[#201A17] border-b border-[#E7DBD3] dark:border-[#382D25] text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                  <th className="py-4 px-6 font-semibold">Patient Name</th>
                  <th className="py-4 px-6 font-semibold">Date of Admission</th>
                  <th className="py-4 px-6 font-semibold">Assigned Ward / Room</th>
                  <th className="py-4 px-6 font-semibold">Treating Doctor</th>
                  <th className="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2E8E1] dark:divide-[#332A24] text-xs">
                {loading && patientsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#7D726B] dark:text-[#A8988D]">
                      Loading admitted patients...
                    </td>
                  </tr>
                ) : patientsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#7D726B] dark:text-[#A8988D]">
                      No admitted patients found for this period.
                    </td>
                  </tr>
                ) : (
                  patientsList.map((item, index) => {
                    const patientId =
                      item.display_patient_id || item.patient_code || item.patient_id || "--";
                    const patientName = item.name || item.patient_name || "Unnamed Patient";

                    const dateDisplay =
                      item.admission_date_formatted ||
                      item.date_of_admission ||
                      item.admission_date_ordinal ||
                      item.admission_date ||
                      "--";

                    const timeDisplay = item.admission_time_display || item.admission_time || "";

                    const roomDisplay =
                      item.assigned_ward_room ||
                      item.assigned_room_display ||
                      `${item.room_number || "Rm --"} • ${item.room_type || item.badge || ""}`.trim();

                    const wardDisplay =
                      item.assigned_ward_floor ||
                      item.assigned_ward_display ||
                      item.ward_floor ||
                      `${item.ward || "Ward --"} • ${item.floor || "Floor 1"}`.trim();

                    const doctorDisplay =
                      item.treating_doctor ||
                      item.doctor_name ||
                      item.sr_doctor ||
                      "Treating Doctor Assigned";

                    const actionLabel =
                      item.action_button_text || item.action_button || "View Details";

                    return (
                      <tr
                        key={item.admission_id || item.id || `${patientId}-${index}`}
                        className="hover:bg-[#FFFDFC] dark:hover:bg-[#28211E] transition"
                      >
                        {/* 1. Patient Name */}
                        <td className="py-4 px-6 align-middle">
                          <div className="font-semibold text-[#2C1810] dark:text-[#EDE3DA] text-[13px]">
                            {patientName}
                          </div>
                          <div className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                            Patient ID: {patientId}
                          </div>
                        </td>

                        {/* 2. Date of Admission */}
                        <td className="py-4 px-6 align-middle">
                          <div className="font-semibold text-[#2C1810] dark:text-[#EDE3DA] text-[13px]">
                            {dateDisplay}
                          </div>
                          {timeDisplay && (
                            <div className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                              {timeDisplay}
                            </div>
                          )}
                        </td>

                        {/* 3. Assigned Ward / Room */}
                        <td className="py-4 px-6 align-middle">
                          <div className="font-semibold text-[#2C1810] dark:text-[#EDE3DA] text-[13px]">
                            {roomDisplay}
                          </div>
                          <div className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                            {wardDisplay}
                          </div>
                        </td>

                        {/* 4. Treating Doctor */}
                        <td className="py-4 px-6 align-middle">
                          <div className="font-medium text-[#4B2E2A] dark:text-[#EDE3DA] text-[13px]">
                            {doctorDisplay}
                          </div>
                        </td>

                        {/* 5. Actions */}
                        <td className="py-4 px-6 align-middle text-center">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(item)}
                            className="rounded-xl border border-[#E7DBD3] dark:border-[#4A3B31] bg-white dark:bg-[#2C231F] px-4 py-1.5 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] hover:bg-[#FAF4EF] dark:hover:bg-[#382D25] hover:border-[#8A4F32] transition cursor-pointer shadow-2xs"
                          >
                            {actionLabel}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NursePatientsAdmitted;
