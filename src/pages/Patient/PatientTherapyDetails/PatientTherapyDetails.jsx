import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineArrowLeft,
  HiChevronDown,
  HiChevronUp,
  HiCheck,
  HiArrowRight,
  HiOutlineSparkles,
} from "react-icons/hi";
import { FaSpa, FaUserCheck, FaHeartbeat } from "react-icons/fa";
import { GiLotus, GiDroplets } from "react-icons/gi";
import toast from "react-hot-toast";
import {
  loadTreatments,
  loadAvailableSlots,
  bookTherapySession,
} from "../../../redux/patient/patientThunk";
import {
  setSelectedTreatment,
  clearBookingResult,
} from "../../../redux/patient/patientSlice";

// Helper to format date strings like "2026-10-28"
const formatDateYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to format 24h "09:00" or "09:00:00" to "9:00 AM"
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

const PatientTherapyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    treatments,
    selectedTreatment,
    availableSlots,
    slotsLoading,
    bookingResult,
    bookingLoading,
  } = useSelector((state) => state.patient);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  // Find active treatment by URL param or state
  const activeTherapy = useMemo(() => {
    if (selectedTreatment && selectedTreatment.id === id) {
      return selectedTreatment;
    }
    const found = (treatments || []).find((t) => t.id === id);
    if (found) return found;
    return treatments?.[0] || null;
  }, [id, selectedTreatment, treatments]);

  useEffect(() => {
    if (!treatments || treatments.length === 0) {
      dispatch(loadTreatments());
    }
  }, [dispatch, treatments]);

  useEffect(() => {
    if (activeTherapy) {
      dispatch(setSelectedTreatment(activeTherapy));
    }
  }, [dispatch, activeTherapy]);

  // Load slots whenever selected date changes
  useEffect(() => {
    if (selectedDate) {
      dispatch(loadAvailableSlots(selectedDate));
      setSelectedSlot(null);
    }
  }, [dispatch, selectedDate]);

  // Clear booking on unmount
  useEffect(() => {
    return () => {
      dispatch(clearBookingResult());
    };
  }, [dispatch]);

  const priceFormatted = activeTherapy?.op_price
    ? `₹${parseInt(activeTherapy.op_price, 10).toLocaleString()}`
    : "₹1,200";

  // Handle Book Therapy Submit
  const handleBookTherapy = async () => {
    if (!selectedSlot) {
      toast.error("Please select an available time slot.");
      return;
    }

    const payload = {
      treatment_id: activeTherapy?.id || id,
      booking_date: selectedDate,
      slot_time: selectedSlot.time,
      notes: `${activeTherapy?.name || "Ayurvedic therapy"} session booked via patient portal`,
    };

    dispatch(bookTherapySession(payload));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] text-[#2C1810] dark:text-[#EDE3DA] font-sans pb-28">
      {/* Top Header / Back Bar */}
      <div className="sticky top-0 z-40 w-full border-b border-[#EFE5DC] dark:border-[#382E28] bg-[#FFFDFB] dark:bg-[#1E1714] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button
              type="button"
              onClick={() => navigate("/patient/book-therapy")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:text-[#2C1810] transition cursor-pointer"
            >
              <HiOutlineArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7 animate-fadeIn">
        {/* ========================================================= */}
        {/* HERO CARD: THERAPY TITLE, PRICE & PHOTO */}
        {/* ========================================================= */}
        <div className="rounded-[28px] bg-gradient-to-r from-[#4E2F26] via-[#43271F] to-[#2E1812] text-white p-6 sm:p-8 relative overflow-hidden shadow-md flex flex-col md:flex-row items-stretch justify-between gap-6">
          {/* Left Details */}
          <div className="flex-1 flex flex-col justify-between space-y-3 z-10">
            <div>
              <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight">
                {activeTherapy?.name || "Shirodhara"}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 font-medium">
                {activeTherapy?.type_label || "Relaxation Therapy"}
              </p>

              <p className="text-sm font-bold text-[#F7D8C6] mt-2">
                {priceFormatted} <span className="mx-1 text-white/50">|</span>{" "}
                {activeTherapy?.treatment_duration || `${activeTherapy?.duration_minutes || 45} min`}
              </p>

              <p className="text-xs sm:text-sm text-white/85 mt-2.5 max-w-lg leading-relaxed">
                {activeTherapy?.description ||
                  "A deeply relaxing therapy that calms the mind, reduces stress and improves sleep quality."}
              </p>
            </div>

            {/* Toggle Details Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#4D2E23] px-5 py-2 text-xs font-bold shadow-sm hover:bg-[#F8EFE8] transition cursor-pointer"
              >
                <span>{showDetails ? "Hide Details" : "View Details"}</span>
                {showDetails ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Right Image Banner */}
          <div className="h-44 sm:h-52 w-full md:w-72 shrink-0 rounded-2xl overflow-hidden bg-white/10 shadow-inner">
            <img
              src={
                activeTherapy?.image_url ||
                "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80"
              }
              alt={activeTherapy?.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* EXPANDED DETAILS (Image 4): ABOUT, BENEFITS, WHO IS IT FOR */}
        {/* ========================================================= */}
        {showDetails && (
          <div className="space-y-4 animate-fadeIn">
            {/* 1. About */}
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-5 shadow-xs flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF3EC] dark:bg-[#34241C] text-[#6F4432] dark:text-[#C59B82] shrink-0 mt-0.5">
                <FaSpa size={18} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  About {activeTherapy?.name}
                </h4>
                <p className="text-xs sm:text-[13px] text-[#6F5F56] dark:text-[#B5A59B] mt-1 leading-relaxed whitespace-pre-line">
                  {activeTherapy?.about ||
                    "Warm herbal oil is poured on the forehead in a continuous stream to induce deep relaxation."}
                </p>
              </div>
            </div>

            {/* 2. Benefits */}
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-5 shadow-xs flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF3EC] dark:bg-[#34241C] text-[#6F4432] dark:text-[#C59B82] shrink-0 mt-0.5">
                <GiLotus size={20} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Benefits
                </h4>
                <p className="text-xs sm:text-[13px] text-[#6F5F56] dark:text-[#B5A59B] mt-1 leading-relaxed whitespace-pre-line">
                  {activeTherapy?.benefits ||
                    "Reduces stress, improves sleep, enhances mental clarity, and balances Vata."}
                </p>
              </div>
            </div>

            {/* 3. Who is it for */}
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-5 shadow-xs flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF3EC] dark:bg-[#34241C] text-[#6F4432] dark:text-[#C59B82] shrink-0 mt-0.5">
                <FaUserCheck size={18} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Who is it for?
                </h4>
                <p className="text-xs sm:text-[13px] text-[#6F5F56] dark:text-[#B5A59B] mt-1 leading-relaxed">
                  {activeTherapy?.who_is_it_for ||
                    "People with stress, anxiety, insomnia, mental fatigue and Vata imbalance."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BOOKING SECTION (Image 3 & 4): SELECT DATE & AVAILABILITY */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* LEFT: SELECT DATE */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-[15px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Select Date
            </h3>

            {/* Horizontal Date Picker Cards */}
            <div className="grid grid-cols-6 gap-2">
              {upcomingDates.slice(0, 6).map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`rounded-2xl py-3 px-1 text-center transition cursor-pointer flex flex-col items-center justify-center shadow-xs ${
                      isSelected
                        ? "border-2 border-[#4D2E23] dark:border-[#C59B82] bg-[#FAF3EC] dark:bg-[#34241C] text-[#4D2E23] dark:text-[#EDE3DA] font-bold"
                        : "border border-[#E5DCD5] dark:border-[#382E28] bg-white dark:bg-[#241E1B] text-[#7F726A] dark:text-[#A8988D] hover:border-[#6F4432]"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      {item.dayName}
                    </span>
                    <span className="text-base sm:text-lg font-bold mt-1">
                      {item.dayNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: AVAILABILITY SLOTS */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-[15px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Availability
            </h3>

            {slotsLoading ? (
              <div className="py-8 text-center text-xs text-[#8A7D75]">
                Loading available slots for {selectedDate}...
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8A7D75]">
                No slots available on this date. Please select another date.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSlots.map((slot, idx) => {
                  const isAvailable = Boolean(slot.is_available);
                  const isSelected = selectedSlot?.time === slot.time;
                  const displayTime = formatSlotDisplay(slot.time, slot.label);

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl py-3 px-3 text-center text-xs font-semibold transition ${
                        !isAvailable
                          ? "bg-[#FAF8F5] dark:bg-[#1A1412] text-[#B8AAA0] dark:text-[#5C4F46] border border-[#EFE8DF] dark:border-[#2C231F] cursor-not-allowed opacity-60"
                          : isSelected
                          ? "bg-[#F5E8DC] dark:bg-[#3D2C24] border-2 border-[#6F4432] dark:border-[#C59B82] text-[#4D2E23] dark:text-[#EDE3DA] font-bold shadow-xs cursor-pointer"
                          : "bg-white dark:bg-[#241E1B] border border-[#E5DCD5] dark:border-[#382E28] text-[#2C1810] dark:text-[#EDE3DA] hover:border-[#6F4432] cursor-pointer"
                      }`}
                    >
                      {displayTime}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* STICKY BOTTOM BOOK THERAPY BAR */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#EFE5DC] dark:border-[#382E28] bg-[#FFFDFB]/95 dark:bg-[#1E1714]/95 backdrop-blur-md p-4 sm:p-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-xs text-[#7F726A] dark:text-[#A8988D]">Selected Slot</span>
            <p className="text-sm font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
              {selectedSlot
                ? `${selectedDate} at ${formatSlotDisplay(selectedSlot.time, selectedSlot.label)}`
                : "Choose date & time slot"}
            </p>
          </div>

          <button
            type="button"
            disabled={bookingLoading || !selectedSlot}
            onClick={handleBookTherapy}
            className="w-full sm:w-auto sm:min-w-[280px] inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6F4432] hover:bg-[#5C3829] text-white py-3.5 px-8 text-sm font-bold transition shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            <span>{bookingLoading ? "Booking Session..." : "Book Therapy"}</span>
            <HiArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUCCESS CONFIRMATION MODAL (Image 5) */}
      {/* ========================================================= */}
      {bookingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-[32px] bg-white dark:bg-[#241E1B] p-8 text-center shadow-2xl border border-[#EFE5DC] dark:border-[#382E28]">
            {/* Big Green Circle with Checkmark */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2A6E3F] text-white shadow-md mb-6 ring-8 ring-[#2A6E3F]/15">
              <HiCheck size={40} className="stroke-[2.5]" />
            </div>

            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-tight">
              Your therapy session is booked!
            </h3>

            <p className="mt-2 text-xs text-[#7F726A] dark:text-[#A8988D]">
              The timing will be confirmed shortly.
            </p>

            {/* Pill: THERAPY NO: #... */}
            <div className="my-6 inline-block rounded-full border border-[#D5C2B4] dark:border-[#52443C] bg-[#FAF5F0] dark:bg-[#1F1916] px-5 py-2">
              <span className="text-[12px] font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
                THERAPY NO: #{bookingResult.data?.booking_no || bookingResult.booking_no || "KBPS816812"}
              </span>
            </div>

            {/* Go to Dashboard button */}
            <button
              type="button"
              onClick={() => {
                dispatch(clearBookingResult());
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

export default PatientTherapyDetails;

