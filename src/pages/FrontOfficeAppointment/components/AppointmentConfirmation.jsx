import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  confirmFrontOfficeAppointment,
  loadFrontOfficeAppointmentConfirmation,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

const AppointmentConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    confirmation,
    confirmationLoading,
    confirmationError,
    loading,
    error,
    message,
  } = useSelector((state) => state.frontOfficeAppointment);

  // ==========================================
  // DATE FILTER STATE
  // ==========================================

  const todayDateStr = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const urlDate = searchParams.get("date");
  const [filterDate, setFilterDate] = useState(urlDate || todayDateStr);

  useEffect(() => {
    if (urlDate && urlDate !== filterDate) {
      setFilterDate(urlDate);
    }
  }, [urlDate]);

  useEffect(() => {
    const targetDate = urlDate || filterDate || todayDateStr;
    const params = { date: targetDate };
    if (doctorId) {
      params.doctor_id = doctorId;
    }
    dispatch(loadFrontOfficeAppointmentConfirmation(params));
  }, [dispatch, doctorId]);

  const handleDateChange = (selectedDate) => {
    setFilterDate(selectedDate);
    if (!selectedDate) return;

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("date", selectedDate);
        return next;
      },
      { replace: true }
    );

    const params = { date: selectedDate };
    const docId = doctorId || confirmation?.doctor?.doctor_id;
    if (docId) {
      params.doctor_id = docId;
    }
    dispatch(loadFrontOfficeAppointmentConfirmation(params));
  };

  const handleQuickToday = () => {
    setFilterDate(todayDateStr);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("date", todayDateStr);
        return next;
      },
      { replace: true }
    );

    const params = { date: todayDateStr };
    const docId = doctorId || confirmation?.doctor?.doctor_id;
    if (docId) {
      params.doctor_id = docId;
    }
    dispatch(loadFrontOfficeAppointmentConfirmation(params));
  };

  const doctor = confirmation?.doctor;

  const schedule = useMemo(() => {
    const slots =
      confirmation?.schedule_overview?.schedule_slots || [];

    // Conflicts are intentionally hidden from this screen.
    return slots.filter(
      (slot) => slot.status?.toLowerCase() !== "conflict"
    );
  }, [confirmation]);

  const patientCount = useMemo(() => {
    if (
      confirmation?.schedule_overview?.total_patients_today !== undefined &&
      confirmation?.schedule_overview?.total_patients_today !== null
    ) {
      return confirmation.schedule_overview.total_patients_today;
    }
    return schedule.filter(
      (slot) => slot.appointment_id || slot.patient_id || slot.patient_name
    ).length;
  }, [confirmation, schedule]);



  const getPatientName = (slot) => {
    return slot.patient_name || slot.patient?.name || "Available";
  };

  const getPatientCode = (slot) => {
    return (
      slot.patient_code ||
      slot.patient?.patient_code ||
      ""
    );
  };

  const getSlotRange = (slot) => {
    return (
      slot.slot_range ||
      slot.time_range ||
      slot.formatted_time ||
      slot.time ||
      "--"
    );
  };


  return (
    <DashboardLayout role="frontoffice">
      <div className="min-h-screen bg-white px-6 py-5 text-[#4B2E2A]">
        {/* ========================================= */}
        {/* BREADCRUMB */}
        {/* ========================================= */}

        <div className="mb-4 flex items-center gap-2 text-[14px]">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/frontoffice/pending-actions/appointment-confirmations"
              )
            }
            className="font-medium text-[#2F2926] hover:text-[#8A4F32]"
          >
            Pending Actions
          </button>

          <span className="text-[#8A817B]">›</span>

          <span className="font-medium text-[#2F2926]">
            Appointment Confirmation
          </span>

          {doctor?.doctor_name && (
            <>
              <span className="text-[#8A817B]">›</span>
              <span className="font-medium text-[#2F2926]">
                {doctor.doctor_name}
              </span>
            </>
          )}
        </div>

        {/* ========================================= */}
        {/* PAGE TITLE */}
        {/* ========================================= */}

        <div className="border-b border-[#E8DDD6] pb-4">
          <h1 className="text-[21px] font-semibold text-[#2F2926]">
            Appointment Confirmation
          </h1>

          <div className="mt-1 flex items-center gap-2 text-[13px] text-[#634238]">
            <span className="h-2 w-2 rounded-full bg-[#4B2E2A]" />
            {patientCount} Patients
          </div>
        </div>

        {/* ========================================= */}
        {/* DOCTOR INFORMATION */}
        {/* ========================================= */}

        {doctor && (
          <div className="flex items-center border-b border-[#E8DDD6] py-4">
            {/* Doctor */}
            <div className="flex min-w-[280px] items-center gap-3">
              <div className="h-[58px] w-[58px] overflow-hidden rounded-full border border-[#E8DDD6] bg-[#FFF7F1]">
                {doctor.profile_image ? (
                  <img
                    src={doctor.profile_image}
                    alt={doctor.doctor_name || "Doctor"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-[#8A4F32]">
                    {doctor.doctor_name?.charAt(0) || "D"}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-[15px] font-semibold text-[#2F2926]">
                  {doctor.doctor_name}
                </h2>

                <p className="text-[12px] text-[#159A9C]">
                  {doctor.specialization}
                </p>

                <p className="mt-1 text-[11px] text-[#8A817B]">
                  🎓 {doctor.qualification}
                  {doctor.experience
                    ? ` • ${doctor.experience}`
                    : ""}
                </p>
              </div>
            </div>

            {/* Consultation Type */}
            <div className="min-w-[220px] border-l border-[#E8DDD6] px-5">
              <p className="text-[11px] text-[#7D726B]">
                Consultation Type
              </p>

              <p className="mt-1 text-[14px] font-semibold text-[#4B2E2A]">
                {doctor.consultation_type || "--"}
              </p>
            </div>

            {/* Fees */}
            <div className="min-w-[165px] border-l border-[#E8DDD6] px-5">
              <p className="text-[11px] text-[#7D726B]">
                Consultation Fees
              </p>

              <p className="mt-1 text-[14px] font-semibold text-[#4B2E2A]">
                {doctor.formatted_fees ||
                  (doctor.consultation_fees != null
                    ? `₹${doctor.consultation_fees}`
                    : "--")}
              </p>
            </div>

            {/* Available Slots */}
            <div className="min-w-[145px] border-l border-[#E8DDD6] px-5">
              <p className="text-[11px] text-[#7D726B]">
                Available Slots
              </p>

              <p className="mt-1 text-[14px] font-semibold text-[#4B2E2A]">
                {String(
                  doctor.available_slots ?? schedule.length
                ).padStart(2, "0")}
              </p>
            </div>

            {/* Working Hours */}
            <div className="border-l border-[#E8DDD6] px-5">
              <p className="text-[11px] text-[#7D726B]">
                Working Hours
              </p>

              <p className="mt-1 whitespace-nowrap text-[14px] font-semibold text-[#4B2E2A]">
                {doctor.working_hours || "--"}
              </p>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* SUCCESS */}
        {/* ========================================= */}

        {message && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[11px] text-green-700">
            {message}
          </div>
        )}

        {/* ========================================= */}
        {/* ERROR */}
        {/* ========================================= */}

        {(error || confirmationError) && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[11px] text-red-600">
            {typeof error === "string"
              ? error
              : error?.message ||
              confirmationError?.message ||
              (typeof confirmationError === "string"
                ? confirmationError
                : "Failed to load appointment confirmation.")}
          </div>
        )}

        {/* ========================================= */}
        {/* DATE FILTER */}
        {/* ========================================= */}

        <div className="mt-5 flex flex-col items-end gap-3 mb-[16px]">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[12px] font-medium text-[#634238]">
              Date:
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={confirmationLoading}
              className="h-9 rounded-lg border border-[#E8DDD6] bg-white px-3 text-[13px] text-[#2F2926] shadow-inner focus:border-[#8A4F32] focus:outline-none disabled:opacity-60 cursor-pointer"
            />
            <button
              type="button"
              onClick={handleQuickToday}
              disabled={confirmationLoading}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E7D2C0] bg-[#FFF9F4] px-3 text-[12px] font-medium text-[#8A4F32] hover:bg-[#FCEFE3] transition-colors disabled:opacity-60 cursor-pointer"
            >
              <HiOutlineCalendarDays size={14} />
              Today
            </button>
            {confirmationLoading && (
              <div className="flex items-center gap-1.5 text-xs text-[#8A4F32] ml-1">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#8A4F32] border-t-transparent" />
                <span>Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* SCHEDULE */}
        {/* ========================================= */}

        <div className="overflow-hidden rounded-[15px] border border-[#E8DDD6] bg-white">
          {/* Header */}
          <div className="grid grid-cols-[120px_1fr] border-b border-[#E8DDD6] bg-[#FFF9F4] text-[11px] font-medium text-[#4B2E2A]">
            <div className="px-5 py-3 text-center">
              Time
            </div>

            <div className="border-l border-[#E8DDD6] px-5 py-3">
              Schedule
            </div>
          </div>

          {/* Loading */}
          {confirmationLoading ? (
            <div className="px-5 py-12 text-center text-[12px] text-[#8A817B]">
              Loading schedule...
            </div>
          ) : schedule.length === 0 ? (
            <div className="px-5 py-12 text-center text-[12px] text-[#8A817B]">
              No appointments available for this date.
            </div>
          ) : (
            schedule.map((slot, index) => {
              const confirmed = Boolean(
                slot.appointment_id ||
                (slot.status && slot.status.toLowerCase() === "confirmed") ||
                slot.patient_id ||
                slot.patient_name
              );
              return (
                <div
                  key={
                    slot.appointment_id ||
                    `${slot.time}-${index}`
                  }
                  className="grid min-h-[92px] grid-cols-[120px_1fr] border-b border-[#EEE4DD] last:border-b-0"
                >
                  {/* Time */}
                  <div className="flex items-start justify-center px-3 py-7 text-[12px] font-medium text-[#4B2E2A]">
                    {slot.time || "--"}
                  </div>

                  {/* Schedule */}
                  <div className="border-l border-[#EEE4DD] p-3">
                    <div
                      className={`
  flex min-h-[66px] items-center justify-between rounded-xl border px-3 py-2.5
  ${confirmed
    ? "border-green-200 bg-[#EEFFF1]"
    : "border-[#E8DDD6] bg-white"
  }
`}
                    >
                      <div>
                        <p
                          className={`
  text-[12px] font-medium
  ${confirmed
    ? "text-[#1B5D2B]"
    : "text-[#4B2E2A]"
  }
`}
                        >
                          {getSlotRange(slot)}
                        </p>

                        <p className="mt-1 text-[11px] text-[#4B2E2A]">
                          {getPatientName(slot)}

                          {slot.type && (
                            <>
                              {" "}
                              ({slot.type})
                            </>
                          )}
                        </p>

                        {getPatientCode(slot) && (
                          <p className="mt-0.5 text-[10px] text-[#81756E]">
                            Patient ID: {getPatientCode(slot)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
  {confirmed ? (
    <>
      <span className="text-[10px] font-medium text-[#1B5D2B]">
        Confirmed
      </span>

      <HiOutlineCheckCircle
        size={16}
        className="text-green-700"
      />
    </>
  ) : (
    <>
      <span className="text-[10px] text-[#8A4F32]">
        Available
      </span>

      <HiOutlineClock
        size={16}
        className="text-[#8A4F32]"
      />
    </>
  )}
</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentConfirmation;
