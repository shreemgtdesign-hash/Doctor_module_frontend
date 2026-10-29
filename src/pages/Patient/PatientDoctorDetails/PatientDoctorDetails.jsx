import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineArrowLeft,
  HiChevronDown,
  HiChevronUp,
  HiCheck,
  HiArrowRight,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineUser,
} from "react-icons/hi";
import { Star, ShieldCheck, Stethoscope, Video, Home } from "lucide-react";
import toast from "react-hot-toast";
import {
  loadDoctors,
  loadDoctorAvailableSlots,
  bookDoctorAppointment,
} from "../../../redux/patient/patientThunk";
import {
  setSelectedDoctor,
  setSelectedAppointmentDate,
  setSelectedAppointmentSlot,
  setSelectedBranch,
  clearAppointmentBookingResult,
} from "../../../redux/patient/patientSlice";

// Helper to format date strings like "2026-10-29"
const formatDateYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to format 24h "16:00" or "16:00:00" to "4:00 PM"
const formatSlotDisplay = (timeStr, label) => {
  if (label) return label;
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  let hour = parseInt(parts[0], 10);
  const minute = parts[1] || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const PatientDoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    doctors,
    selectedDoctor,
    doctorSlots,
    doctorSlotsLoading,
    appointmentBookingResult,
    appointmentBookingLoading,
  } = useSelector((state) => state.patient);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [visitReason, setVisitReason] = useState("Out-Patient Clinic Visit");

  // Generate next 14 days for date picker
  const upcomingDates = useMemo(() => {
    const list = [];
    const today = new Date();
    const daysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      list.push({
        dateStr: formatDateYMD(d),
        dayName: daysShort[d.getDay()],
        dayNum: d.getDate(),
        fullDate: d,
      });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState(() => upcomingDates[0].dateStr);

  // Active doctor
  const activeDoctor = useMemo(() => {
    if (selectedDoctor && String(selectedDoctor.id) === String(id)) {
      return selectedDoctor;
    }
    const found = (doctors || []).find((d) => String(d.id) === String(id));
    if (found) return found;
    return doctors?.[0] || null;
  }, [id, selectedDoctor, doctors]);

  // Branches list
  const doctorBranches = useMemo(() => {
    if (!activeDoctor?.branches) return ["West Mambalam"];
    const list = activeDoctor.branches
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    return list.length > 0 ? list : ["West Mambalam"];
  }, [activeDoctor]);

  const [activeBranch, setActiveBranch] = useState(() => doctorBranches[0] || "West Mambalam");

  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      dispatch(loadDoctors());
    }
  }, [dispatch, doctors]);

  useEffect(() => {
    if (activeDoctor) {
      dispatch(setSelectedDoctor(activeDoctor));
      if (doctorBranches.length > 0 && !doctorBranches.includes(activeBranch)) {
        setActiveBranch(doctorBranches[0]);
      }
    }
  }, [activeDoctor, dispatch]);

  // Load slots when doctor, date or branch changes
  useEffect(() => {
    if (activeDoctor?.id && selectedDate) {
      dispatch(
        loadDoctorAvailableSlots({
          doctorId: activeDoctor.id,
          date: selectedDate,
          branch: activeBranch,
        })
      );
      setSelectedSlot(null);
    }
  }, [activeDoctor?.id, selectedDate, activeBranch, dispatch]);

  const fee = activeDoctor?.consultation_fee
    ? `₹${parseInt(activeDoctor.consultation_fee, 10).toLocaleString()}`
    : activeDoctor?.fee_in_person
    ? `₹${parseInt(activeDoctor.fee_in_person, 10).toLocaleString()}`
    : "₹600";

  const rating = activeDoctor?.rating || 4.7;
  const experience = activeDoctor?.experience_years ? `${activeDoctor.experience_years}y exp.` : "10y exp.";

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      toast.error("Please select a convenient time slot first.");
      return;
    }

    const payload = {
      doctor_id: activeDoctor.id,
      appointment_date: selectedDate,
      slot_time: selectedSlot.time,
      duration_minutes: 15,
      type: "OP",
      branch: activeBranch || "West Mambalam",
      reason: visitReason || "Out-Patient Clinic Visit",
      booked_via: "system",
    };

    try {
      const res = await dispatch(bookDoctorAppointment(payload)).unwrap();
      toast.success("Appointment booked successfully!");
    } catch (err) {
      toast.error(err || "Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] text-[#2C1810] dark:text-[#EDE3DA] font-sans pb-32">
      {/* Top Header / Back Bar */}
      <div className="sticky top-0 z-40 w-full border-b border-[#EFE5DC] dark:border-[#382E28] bg-[#FFFDFB] dark:bg-[#1E1714] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button
              type="button"
              onClick={() => navigate("/patient/book-appointment")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:text-[#2C1810] transition cursor-pointer"
            >
              <HiOutlineArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6 animate-fadeIn">
        {/* ========================================================= */}
        {/* DOCTOR HERO CARD (Matching Reference Image Screen 2) */}
        {/* ========================================================= */}
        {activeDoctor && (
          <div className="relative overflow-hidden rounded-[28px] border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              {/* Doctor Details */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                    {activeDoctor.name}
                  </h1>
                </div>

                <p className="text-sm font-semibold text-[#8A5035] dark:text-[#D5A794]">
                  {activeDoctor.specialization}
                </p>

                <p className="text-xs text-[#7F726A] dark:text-[#A8988D]">
                  🎓 {activeDoctor.qualification || "BAMS, MD"} • {experience}
                </p>

                <div className="pt-1 flex items-center justify-center sm:justify-start gap-3">
                  <span className="text-lg font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
                    {fee}/h
                  </span>

                  <div className="rounded-md bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 flex items-center gap-1 shadow-2xs">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      {rating}
                    </span>
                  </div>
                </div>

                {/* Hide / View Details Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D5C2B4] dark:border-[#52443C] bg-[#FAF5F0] dark:bg-[#1E1714] px-4 py-1.5 text-xs font-bold text-[#4D2E23] dark:text-[#EDE3DA] shadow-2xs hover:bg-[#F3EBE3] transition cursor-pointer"
                  >
                    <span>{showDetails ? "Hide Details" : "View Details"}</span>
                    {showDetails ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Doctor Image / Portrait */}
              <div className="h-32 w-32 sm:h-36 sm:w-36 shrink-0 rounded-2xl overflow-hidden bg-[#FAF4EF] dark:bg-[#1E1714] border border-[#EFE5DC] dark:border-[#382E28] flex items-center justify-center shadow-xs">
                {activeDoctor.profile_image ? (
                  <img
                    src={activeDoctor.profile_image}
                    alt={activeDoctor.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  style={{ display: activeDoctor.profile_image ? "none" : "flex" }}
                  className="h-full w-full items-center justify-center text-3xl font-bold text-[#6F4432] dark:text-[#EDE3DA]"
                >
                  {activeDoctor.name.replace("Dr. ", "").charAt(0)}
                </div>
              </div>
            </div>

            {/* Collapsible Info Cards */}
            {showDetails && (
              <div className="mt-6 pt-6 border-t border-[#EFE5DC] dark:border-[#382E28] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-fadeIn">
                <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] p-4 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
                    <Stethoscope size={14} className="text-[#8A5035]" />
                    <span>Department & Speciality</span>
                  </div>
                  <p className="text-[#7F726A] dark:text-[#A8988D]">
                    {activeDoctor.department || activeDoctor.specialization}
                  </p>
                  <p className="text-[#7F726A] dark:text-[#A8988D] pt-1">
                    <strong className="text-[#4D2E23] dark:text-[#EDE3DA]">Type:</strong>{" "}
                    {activeDoctor.doctor_type === "both" ? "Consultation & Therapy" : "Consultation"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] p-4 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
                    <Video size={14} className="text-[#8A5035]" />
                    <span>Consultation Modes & Fees</span>
                  </div>
                  <p className="text-[#7F726A] dark:text-[#A8988D]">
                    🏥 In-Person: ₹{activeDoctor.fee_in_person || activeDoctor.consultation_fee || "600"}
                  </p>
                  <p className="text-[#7F726A] dark:text-[#A8988D]">
                    💻 Video Call: ₹{activeDoctor.fee_video_call || "600"}
                  </p>
                  <p className="text-[#7F726A] dark:text-[#A8988D]">
                    🏡 Home Visit: ₹{activeDoctor.fee_home_visit || "1,200"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] p-4 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
                    <ShieldCheck size={14} className="text-[#8A5035]" />
                    <span>Languages & Timings</span>
                  </div>
                  <p className="text-[#7F726A] dark:text-[#A8988D]">
                    🗣️ Languages: {activeDoctor.languages || "English, Tamil"}
                  </p>
                  <p className="text-[#7F726A] dark:text-[#A8988D]">
                    🕒 Shift: {activeDoctor.shift_timings || "9:00 AM - 6:00 PM"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Branch Selector (if multiple branches exist) */}
        {doctorBranches.length > 1 && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA] flex items-center gap-1.5">
              <HiOutlineLocationMarker size={16} className="text-[#8A5035]" />
              <span>Select Branch</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {doctorBranches.map((branch) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => setActiveBranch(branch)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    activeBranch === branch
                      ? "bg-[#6F4432] text-white shadow-xs"
                      : "border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] text-[#7F726A] dark:text-[#A8988D] hover:bg-[#FAF4ED]"
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SELECT DATE CAROUSEL */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Select Date
            </h2>
            <span className="text-xs font-medium text-[#7F726A] dark:text-[#A8988D]">
              Next 14 Days
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {upcomingDates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => {
                    setSelectedDate(item.dateStr);
                    dispatch(setSelectedAppointmentDate(item.dateStr));
                  }}
                  className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[80px] h-[82px] sm:h-[90px] rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#6F4432] bg-[#FAF5F0] dark:bg-[#2F241F] dark:border-[#C59B82] shadow-sm ring-1 ring-[#6F4432]/30"
                      : "border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] hover:border-[#D5C2B4] hover:bg-[#FAF6F2] dark:hover:bg-[#2C231F]"
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold tracking-wider uppercase ${
                      isSelected
                        ? "text-[#6F4432] dark:text-[#E8C2AC]"
                        : "text-[#8A7D75] dark:text-[#A8988D]"
                    }`}
                  >
                    {item.dayName}
                  </span>
                  <span
                    className={`text-xl sm:text-2xl font-extrabold mt-0.5 ${
                      isSelected
                        ? "text-[#2C1810] dark:text-[#EDE3DA]"
                        : "text-[#4D2E23] dark:text-[#C5B4A8]"
                    }`}
                  >
                    {item.dayNum}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* AVAILABILITY SLOTS */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Availability
            </h2>
            <span className="text-xs text-[#7F726A] dark:text-[#A8988D]">
              {doctorSlots.filter((s) => s.is_available !== false).length} slots available
            </span>
          </div>

          {doctorSlotsLoading ? (
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-8 text-center text-xs text-[#8A7D75]">
              Fetching available doctor consultation slots...
            </div>
          ) : doctorSlots.length === 0 ? (
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-8 text-center text-xs text-[#8A7D75]">
              No available consultation slots for this date. Please select another date.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {doctorSlots.map((slot, idx) => {
                const isSelected = selectedSlot?.time === slot.time;
                const isAvailable = slot.is_available !== false;
                const display = formatSlotDisplay(slot.time, slot.label);

                return (
                  <button
                    key={`${slot.time}-${idx}`}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      setSelectedSlot(slot);
                      dispatch(setSelectedAppointmentSlot(slot.time));
                    }}
                    className={`rounded-xl py-3 px-2 text-xs font-bold transition text-center cursor-pointer border ${
                      !isAvailable
                        ? "border-[#F0EBE5] dark:border-[#332A24] bg-[#F7F4F0] dark:bg-[#1C1715] text-[#B8ACA3] dark:text-[#6E6158] cursor-not-allowed line-through"
                        : isSelected
                        ? "border-[#6F4432] bg-[#FAF5F0] dark:bg-[#2F241F] text-[#4D2E23] dark:text-[#EDE3DA] ring-2 ring-[#6F4432]/40 shadow-xs"
                        : "border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] text-[#4D2E23] dark:text-[#EDE3DA] hover:border-[#6F4432] hover:bg-[#FAF6F2] dark:hover:bg-[#2C231F]"
                    }`}
                  >
                    <span>{display}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Reason for consultation (Optional) */}
        <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-4 space-y-2">
          <label className="text-xs font-bold text-[#4D2E23] dark:text-[#EDE3DA] block">
            Reason for Consultation / Symptoms
          </label>
          <input
            type="text"
            value={visitReason}
            onChange={(e) => setVisitReason(e.target.value)}
            placeholder="e.g. Chronic back pain, skin rash, digestion issue, general wellness"
            className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] px-4 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#6F4432]"
          />
        </div>
      </main>

      {/* ========================================================= */}
      {/* STICKY BOTTOM BAR */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#EFE5DC] dark:border-[#382E28] bg-[#FFFDFB]/95 dark:bg-[#1E1714]/95 backdrop-blur-md p-4 sm:p-5 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-xs text-[#7F726A] dark:text-[#A8988D]">Appointment Summary</span>
            <p className="text-sm font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
              {selectedSlot
                ? `${selectedDate} at ${formatSlotDisplay(selectedSlot.time, selectedSlot.label)} • ${activeBranch}`
                : "Choose date & time slot"}
            </p>
          </div>

          <button
            type="button"
            disabled={appointmentBookingLoading || !selectedSlot}
            onClick={handleBookAppointment}
            className="w-full sm:w-auto sm:min-w-[280px] inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6F4432] hover:bg-[#5C3829] text-white py-3.5 px-8 text-sm font-bold transition shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            <span>{appointmentBookingLoading ? "Confirming Appointment..." : "Book Consultation"}</span>
            <HiArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUCCESS CONFIRMATION MODAL (Matching Screen 3) */}
      {/* ========================================================= */}
      {appointmentBookingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-[32px] bg-white dark:bg-[#241E1B] p-8 text-center shadow-2xl border border-[#EFE5DC] dark:border-[#382E28]">
            {/* Big Green Circle with Checkmark */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2A6E3F] text-white shadow-md mb-6 ring-8 ring-[#2A6E3F]/15">
              <HiCheck size={40} className="stroke-[2.5]" />
            </div>

            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-tight">
              Your appointment is confirmed!
            </h3>

            <p className="mt-2 text-xs text-[#7F726A] dark:text-[#A8988D]">
              The timing will be confirmed shortly.
            </p>

            {/* Doctor Card in Confirmation (Matching Screenshot 3) */}
            <div className="my-5 rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] p-3.5 flex items-center gap-3 text-left shadow-2xs">
              <div className="h-11 w-11 rounded-full overflow-hidden bg-[#FAF4EF] dark:bg-[#241E1B] flex items-center justify-center shrink-0 border border-[#EFE5DC] dark:border-[#382E28]">
                {activeDoctor?.profile_image ? (
                  <img
                    src={activeDoctor.profile_image}
                    alt={activeDoctor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-[#6F4432] text-sm">
                    {activeDoctor?.name?.replace("Dr. ", "").charAt(0) || "D"}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA] truncate">
                  {activeDoctor?.name || "Dr. Preeti Shetty"}
                </h4>
                <p className="text-xs text-[#8A5035] dark:text-[#D5A794] truncate">
                  {activeDoctor?.specialization || "Ayurvedic Specialist"}
                </p>
              </div>
            </div>

            {/* Pill: APPOINTMENT NO: #... */}
            <div className="mb-6 inline-block rounded-full border border-[#D5C2B4] dark:border-[#52443C] bg-[#FAF5F0] dark:bg-[#1F1916] px-5 py-2">
              <span className="text-[12px] font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
                APPOINTMENT NO: #{appointmentBookingResult.data?.appointment_no || appointmentBookingResult.appointment_no || "OP291026001"}
              </span>
            </div>

            {/* Go to Dashboard button */}
            <button
              type="button"
              onClick={() => {
                dispatch(clearAppointmentBookingResult());
                navigate("/patient/dashboard");
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#6F4432] hover:bg-[#5C3829] text-white py-3 px-6 text-sm font-bold shadow-md transition cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <HiArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDoctorDetails;

