import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { FaBed, FaUserCheck, FaUserClock, FaSignOutAlt } from "react-icons/fa";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadNursePatients } from "../../../redux/nurse/nurseThunk";
import {
  selectNursePatientsList,
  selectNursePatientsLoading,
  selectNursePatientsError,
  selectNurseActiveTab,
  setActivePatientsTab,
} from "../../../redux/nurse/nurseSlice";

const NursePatientsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabQuery = searchParams.get("tab") || "upcoming";

  const patientsList = useSelector(selectNursePatientsList);
  const loading = useSelector(selectNursePatientsLoading);
  const error = useSelector(selectNursePatientsError);
  const activeTab = useSelector(selectNurseActiveTab);

  const [currentTab, setCurrentTab] = useState(tabQuery);

  useEffect(() => {
    const tab = searchParams.get("tab") || "upcoming";
    setCurrentTab(tab);
    dispatch(setActivePatientsTab(tab));
    dispatch(loadNursePatients({ tab }));
  }, [dispatch, searchParams]);

  const handleTabChange = (tabKey) => {
    setCurrentTab(tabKey);
    setSearchParams({ tab: tabKey });
    dispatch(setActivePatientsTab(tabKey));
    dispatch(loadNursePatients({ tab: tabKey }));
  };

  const counts = patientsList?.counts || {
    upcoming: 0,
    admitted: 0,
    discharged: 0,
  };

  const patients = Array.isArray(patientsList?.data) ? patientsList.data : [];

  const getRoomBadgeColor = (roomType = "") => {
    const lower = roomType.toLowerCase();
    if (lower.includes("garden")) {
      return "bg-[#FEF6E4] text-[#8F6612] dark:bg-[#3D3015] dark:text-[#F3CA68]";
    }
    if (lower.includes("non-ac") || lower.includes("non ac")) {
      return "bg-[#E1F3FE] text-[#1E5799] dark:bg-[#162D42] dark:text-[#88C6F7]";
    }
    // Default AC or other
    return "bg-[#FDECEB] text-[#8C3A36] dark:bg-[#3D1E1C] dark:text-[#F3A5A0]";
  };

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6 font-sans space-y-6">
        {/* ========================================================= */}
        {/* BREADCRUMB */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 text-sm text-[#7D726B] dark:text-[#A8988D]">
          <button
            type="button"
            onClick={() => navigate("/nurse/dashboard")}
            className="hover:text-[#4B2E2A] dark:hover:text-white transition font-medium cursor-pointer"
          >
            Dashboard
          </button>
          <HiOutlineChevronRight size={14} />
          <span className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">
            IPD Patients
          </span>
        </div>

        {/* ========================================================= */}
        {/* TAB CARDS (UPCOMING, ADMITTED, DISCHARGED) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Upcoming */}
          <button
            type="button"
            onClick={() => handleTabChange("upcoming")}
            className={`rounded-2xl p-5 text-left transition-all cursor-pointer ${
              currentTab === "upcoming"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#251E1A] shadow-sm"
                : "border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              {counts.upcoming ?? 0}
            </div>
            <div className="text-xs font-semibold text-[#7D726B] dark:text-[#A8988D] mt-1">
              Upcoming
            </div>
          </button>

          {/* Card 2: Admitted */}
          <button
            type="button"
            onClick={() => handleTabChange("admitted")}
            className={`rounded-2xl p-5 text-left transition-all cursor-pointer ${
              currentTab === "admitted"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#251E1A] shadow-sm"
                : "border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              {counts.admitted ?? 0}
            </div>
            <div className="text-xs font-semibold text-[#7D726B] dark:text-[#A8988D] mt-1">
              Admitted
            </div>
          </button>

          {/* Card 3: Discharged */}
          <button
            type="button"
            onClick={() => handleTabChange("discharged")}
            className={`rounded-2xl p-5 text-left transition-all cursor-pointer ${
              currentTab === "discharged"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#251E1A] shadow-sm"
                : "border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              {counts.discharged ?? 0}
            </div>
            <div className="text-xs font-semibold text-[#7D726B] dark:text-[#A8988D] mt-1">
              Discharged
            </div>
          </button>
        </div>

        {/* ========================================================= */}
        {/* PATIENT LIST CARDS */}
        {/* ========================================================= */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-24 rounded-2xl bg-white dark:bg-[#241E1B] border border-[#E7DBD3] dark:border-[#382D25] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-6 text-center text-sm text-red-600 dark:text-red-400">
            {typeof error === "string" ? error : "Failed to load patients list."}
          </div>
        ) : patients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white/50 dark:bg-[#201A17]/50 p-12 text-center">
            <FaBed className="mx-auto text-3xl text-[#B3A499] mb-3" />
            <h4 className="text-sm font-bold text-[#4B2E2A] dark:text-[#EDE3DA]">
              No {currentTab} patients found
            </h4>
            <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
              {currentTab === "upcoming"
                ? "New patient admissions forwarded from Front Office will appear here."
                : currentTab === "admitted"
                ? "Currently admitted patients with assigned rooms appear here."
                : "Discharged IPD patients appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map((patient, idx) => {
              const patientId = patient.id || patient.admission_no || `p-${idx}`;
              const pCode = patient.patient_code || patient.patient_id || "";
              const pName = patient.name || patient.patient_name || "Patient";
              const doctor =
                patient.sr_doctor ||
                patient.doctor_name ||
                patient.day_doctor ||
                "";
              const room = patient.room_number || patient.room_no || "";
              const roomType = patient.room_type || patient.badge || "";
              const floor = patient.floor || "";
              const admDate = patient.admission_date || "";

              if (currentTab === "upcoming") {
                return (
                  <div
                    key={patientId}
                    className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-5 shadow-xs flex items-center justify-between gap-4 hover:border-[#D5C2B4] transition"
                  >
                    <div>
                      <h3 className="text-[15px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                        {pName}
                      </h3>
                      <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
                        {patient.subtitle || (pCode ? `Patient ID: ${pCode}${doctor ? ` · ${doctor}` : ""}` : doctor)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const targetId = patient.id || patient.admission_no || patient.patient_id;
                        navigate(`/nurse/admit-patient/${targetId}`, {
                          state: { patient, fromTab: "upcoming" },
                        });
                      }}
                      className="rounded-xl border border-[#D5C2B4] dark:border-[#4B392F] bg-white dark:bg-[#2C211B] px-5 py-2.5 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] hover:bg-[#FAF4ED] dark:hover:bg-[#382B23] transition cursor-pointer shrink-0"
                    >
                      {patient.action_button_text || "View Details"}
                    </button>
                  </div>
                );
              }

              if (currentTab === "admitted") {
                return (
                  <div
                    key={patientId}
                    className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-5 shadow-xs flex items-center justify-between gap-4 hover:border-[#D5C2B4] transition"
                  >
                    <div className="space-y-1">
                      <h3 className="text-[15px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                        {pName}
                      </h3>
                      <p className="text-xs text-[#7D726B] dark:text-[#A8988D]">
                        {patient.subtitle || (pCode ? `Patient ID: ${pCode}${admDate ? ` · Admitted ${admDate}` : ""}` : admDate)}
                      </p>
                      {[room, roomType, doctor, floor].filter(Boolean).length > 0 && (
                        <p className="text-xs text-[#7D726B] dark:text-[#A8988D]">
                          {[room, roomType, doctor, floor].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      {roomType && (
                        <span
                          className={`inline-block px-5 py-1.5 rounded-full text-xs font-bold tracking-wide ${getRoomBadgeColor(
                            roomType
                          )}`}
                        >
                          {roomType}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const targetId = patient.id || patient.admission_no || patient.patient_id;
                          navigate(`/nurse/admit-patient/${targetId}`, {
                            state: { patient, fromTab: "admitted" },
                          });
                        }}
                        className="rounded-xl border border-[#D5C2B4] dark:border-[#4B392F] bg-white dark:bg-[#2C211B] px-5 py-2.5 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] hover:bg-[#FAF4ED] dark:hover:bg-[#382B23] transition cursor-pointer shrink-0"
                      >
                        {patient.is_checkout_today ? "Confirm Checkout" : "Manage Admission"}
                      </button>
                    </div>
                  </div>
                );
              }

              // Discharged tab
              return (
                <div
                  key={patientId}
                  className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-5 shadow-xs flex items-center justify-between gap-4 hover:border-[#D5C2B4] transition"
                >
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                      {pName}
                    </h3>
                    <p className="text-xs text-[#7D726B] dark:text-[#A8988D]">
                      {patient.subtitle || (pCode ? `Patient ID: ${pCode}${patient.discharge_date ? ` · Discharged ${patient.discharge_date}` : ""}` : "")}
                    </p>
                    {[room, doctor].filter(Boolean).length > 0 && (
                      <p className="text-xs text-[#7D726B] dark:text-[#A8988D]">
                        {[room, doctor].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
                      Discharged
                    </span>
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

export default NursePatientsList;

