import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineArrowLeft,
  HiCheck,
  HiArrowRight,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiX,
} from "react-icons/hi";
import { Star, ChevronRight, Home, MapPin, Edit3 } from "lucide-react";
import toast from "react-hot-toast";

import {
  loadHomeVisitDoctors,
  loadHomeServiceAvailableSlots,
  bookHomeService,
  updatePatientAddress,
} from "../../../redux/patient/patientThunk";
import {
  setSelectedHomeVisitDoctor,
  setSelectedHomeVisitDate,
  setSelectedHomeVisitSlot,
  clearHomeVisitBookingResult,
  setPatientAddress,
} from "../../../redux/patient/patientSlice";

// Helper for YYYY-MM-DD
const formatDateYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper for slot 12-hour format
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

const PatientHomeVisitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    homeVisitDoctors,
    selectedHomeVisitDoctor,
    homeVisitDoctorSlots,
    homeVisitDoctorSlotsLoading,
    homeVisitBookingResult,
    homeVisitBookingLoading,
    patientAddress,
    addressUpdating,
  } = useSelector((state) => state.patient);

  const [selectedSlot, setSelectedSlot] = useState("17:00");
  const [visitNotes, setVisitNotes] = useState("Patient prefers morning visit");
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Address edit state for the modal
  const [addressForm, setAddressForm] = useState({
    address: patientAddress?.address || "5645/207, Radhe Shyam CHS, Ramakrishnanapuram 1st Street",
    area: patientAddress?.area || "West Mambalam",
    landmark: patientAddress?.landmark || "Near Temple",
    city: patientAddress?.city || "Chennai",
    district: patientAddress?.district || "Chennai",
    state: patientAddress?.state || "Tamil Nadu",
    pincode: patientAddress?.pincode || "600033",
    zip: patientAddress?.zip || "600033",
  });

  // Generate next 14 upcoming dates
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

  // Find active doctor
  const activeDoctor = useMemo(() => {
    if (selectedHomeVisitDoctor && String(selectedHomeVisitDoctor.id) === String(id)) {
      return selectedHomeVisitDoctor;
    }
    const found = (homeVisitDoctors || []).find((d) => String(d.id) === String(id));
    if (found) return found;
    return homeVisitDoctors?.[0] || null;
  }, [id, selectedHomeVisitDoctor, homeVisitDoctors]);

  // Load home visit doctors if needed
  useEffect(() => {
    if (!homeVisitDoctors || homeVisitDoctors.length === 0) {
      dispatch(loadHomeVisitDoctors());
    }
  }, [dispatch, homeVisitDoctors]);

  // Load available slots when doctor or date changes
  useEffect(() => {
    if (activeDoctor?.id && selectedDate) {
      dispatch(
        loadHomeServiceAvailableSlots({
          doctor_id: activeDoctor.id,
          date: selectedDate,
        })
      );
    }
  }, [dispatch, activeDoctor?.id, selectedDate]);

  // Sync address form when patientAddress updates
  useEffect(() => {
    if (patientAddress) {
      setAddressForm({
        address: patientAddress.address || "5645/207, Radhe Shyam CHS, Ramakrishnanapuram 1st Street",
        area: patientAddress.area || "West Mambalam",
        landmark: patientAddress.landmark || "Near Temple",
        city: patientAddress.city || "Chennai",
        district: patientAddress.district || "Chennai",
        state: patientAddress.state || "Tamil Nadu",
        pincode: patientAddress.pincode || "600033",
        zip: patientAddress.zip || patientAddress.pincode || "600033",
      });
    }
  }, [patientAddress]);

  // Price calculations matching design
  const consultationFee = useMemo(() => {
    if (activeDoctor?.fee_in_person) {
      return parseInt(activeDoctor.fee_in_person, 10);
    }
    if (activeDoctor?.consultation_fee) {
      return parseInt(activeDoctor.consultation_fee, 10);
    }
    return 600;
  }, [activeDoctor]);

  const totalFee = useMemo(() => {
    if (activeDoctor?.fee_home_visit) {
      return parseInt(activeDoctor.fee_home_visit, 10);
    }
    return 1200;
  }, [activeDoctor]);

  const visitCharges = useMemo(() => {
    return Math.max(0, totalFee - consultationFee) || 200;
  }, [totalFee, consultationFee]);

  // Format full address for display
  const formattedAddress = useMemo(() => {
    const parts = [
      patientAddress?.address,
      patientAddress?.area,
      patientAddress?.city,
      patientAddress?.pincode,
    ].filter(Boolean);
    return (
      parts.join(", ") ||
      "5645/207, Radhe Shyam CHS, Ramakrishnanapuram 1st Street, West Mambalam, Chennai 600033"
    );
  }, [patientAddress]);

  // Handle Save Address
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const payload = {
      address: addressForm.address.trim(),
      area: addressForm.area.trim(),
      landmark: addressForm.landmark.trim(),
      city: addressForm.city.trim(),
      district: addressForm.district.trim(),
      state: addressForm.state.trim(),
      pincode: addressForm.pincode.trim(),
      zip: addressForm.pincode.trim(),
    };

    const res = await dispatch(updatePatientAddress(payload));
    if (!res.error) {
      dispatch(setPatientAddress(payload));
      toast.success("Home address updated successfully!");
      setShowAddressModal(false);
    } else {
      toast.error(res.payload || "Failed to update address");
    }
  };

  // Handle Book Home Visit
  const handleProceedBooking = async () => {
    if (!activeDoctor) {
      toast.error("Please select a doctor");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please choose a time slot");
      return;
    }

    const payload = {
      doctor_id: activeDoctor.id,
      booking_date: selectedDate,
      slot_time: selectedSlot,
      address: formattedAddress,
      city: patientAddress?.city || "Chennai",
      pincode: patientAddress?.pincode || "600033",
      notes: visitNotes.trim() || "Patient prefers morning visit",
    };

    const res = await dispatch(bookHomeService(payload));
    if (!res.error) {
      toast.success("Home visit booked successfully!");
    } else {
      toast.error(res.payload || "Failed to book home visit.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] text-[#2C1810] dark:text-[#EDE3DA] font-sans pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-40 w-full border-b border-[#EFE5DC] dark:border-[#382E28] bg-[#FFFDFB] dark:bg-[#1E1714] backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center">
            <button
              type="button"
              onClick={() => navigate("/patient/book-home-service")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:text-[#2C1810] transition cursor-pointer"
            >
              <HiOutlineArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
        {/* ========================================================= */}
        {/* DOCTOR PREVIEW CARD (Matching Screen 2) */}
        {/* ========================================================= */}
        {activeDoctor && (
          <div className="rounded-[24px] border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-5 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                {activeDoctor.name}
              </h1>
              <p className="text-sm font-semibold text-[#8A5035] dark:text-[#D5A794]">
                {activeDoctor.specialization || "Panchakarma Specialist"}
              </p>
              <p className="text-xs text-[#7F726A] dark:text-[#A8988D] flex items-center justify-center sm:justify-start gap-1 pt-0.5">
                <span>🎓 {activeDoctor.qualification || "BAMS"}</span>
                <span>•</span>
                <span>
                  {activeDoctor.experience_years
                    ? `${activeDoctor.experience_years}y exp.`
                    : activeDoctor.experience || "10y exp."}
                </span>
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
                <span className="text-base font-extrabold text-[#4D2E23] dark:text-[#EDE3DA]">
                  ₹{consultationFee}/h
                </span>
                <div className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 shadow-2xs">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {activeDoctor.rating || 4.6}
                  </span>
                </div>
              </div>
            </div>

            {/* Doctor Photo */}
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-2xl overflow-hidden bg-[#FAF4EF] dark:bg-[#1E1714] border border-[#EFE5DC] dark:border-[#382E28] shadow-xs">
              {activeDoctor.profile_image ? (
                <img
                  src={activeDoctor.profile_image}
                  alt={activeDoctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold text-[#6F4432] text-3xl">
                  {activeDoctor.name.replace("Dr. ", "").charAt(0)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SELECT DATE (Matching Screen 2) */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">
            Select Date
          </h2>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {upcomingDates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => {
                    setSelectedDate(item.dateStr);
                    dispatch(setSelectedHomeVisitDate(item.dateStr));
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
        {/* AVAILABILITY TIME SLOTS */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Availability
            </h2>
            <span className="text-xs text-[#7F726A] dark:text-[#A8988D]">
              {homeVisitDoctorSlots.filter((s) => s.is_available !== false).length} slots available
            </span>
          </div>

          {homeVisitDoctorSlotsLoading ? (
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-8 text-center text-xs text-[#8A7D75]">
              Fetching available home consultation slots...
            </div>
          ) : homeVisitDoctorSlots.length === 0 ? (
            <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-8 text-center text-xs text-[#8A7D75]">
              No available slots for this date. Please pick another date.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {homeVisitDoctorSlots.map((slot, idx) => {
                const isSelected = selectedSlot === slot.time;
                const isAvailable = slot.is_available !== false;
                const display = formatSlotDisplay(slot.time, slot.label);

                return (
                  <button
                    key={`${slot.time}-${idx}`}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      setSelectedSlot(slot.time);
                      dispatch(setSelectedHomeVisitSlot(slot.time));
                    }}
                    className={`rounded-xl py-3 px-3 text-xs font-bold transition text-center cursor-pointer border ${
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

        {/* ========================================================= */}
        {/* HOME VISIT DETAILS (Matching Screen 2) */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">
            Home Visit Details
          </h2>

          <div className="rounded-[24px] border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-base font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {patientAddress?.name || "Kriti Balaji"}
                </p>
                <p className="text-xs sm:text-[13px] text-[#7F726A] dark:text-[#A8988D] max-w-xl leading-relaxed">
                  {formattedAddress}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#6F4432] dark:text-[#E8C2AC] hover:underline cursor-pointer shrink-0"
              >
                <span>Change address</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Visit Notes input */}
            <div className="pt-2 border-t border-[#EFE5DC] dark:border-[#382E28]">
              <label className="block text-xs font-semibold text-[#8A7D75] dark:text-[#A8988D] mb-1.5">
                Special Instructions / Notes (Optional)
              </label>
              <input
                type="text"
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                placeholder="e.g. Patient prefers morning visit, ground floor ring bell"
                className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] px-4 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#6F4432]"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PRICE DETAILS (Matching Screen 2) */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">
            Price Details
          </h2>

          <div className="rounded-[24px] border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-5 shadow-xs space-y-3 text-sm">
            <div className="flex items-center justify-between text-[#7F726A] dark:text-[#A8988D]">
              <span>Consultation Fees</span>
              <span className="font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                ₹{consultationFee.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-[#7F726A] dark:text-[#A8988D]">
              <span>Visit Charges</span>
              <span className="font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                ₹{visitCharges.toLocaleString()}
              </span>
            </div>

            <div className="pt-3 border-t border-[#EFE5DC] dark:border-[#382E28] flex items-center justify-between text-base font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              <span>Total Amount</span>
              <span className="text-[#6F4432] dark:text-[#E8C2AC]">
                ₹{totalFee.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PROCEED BUTTON (Matching Screen 2) */}
        {/* ========================================================= */}
        <div className="pt-2">
          <button
            type="button"
            disabled={homeVisitBookingLoading || !selectedSlot}
            onClick={handleProceedBooking}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6F4432] hover:bg-[#5C3829] text-white py-4 px-8 text-sm sm:text-base font-bold transition shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {homeVisitBookingLoading ? "Processing Booking..." : "Proceed to Payment"}
            </span>
            <HiArrowRight size={17} />
          </button>
        </div>
      </main>

      {/* ========================================================= */}
      {/* CHANGE ADDRESS MODAL */}
      {/* ========================================================= */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#241E1B] p-6 sm:p-7 shadow-2xl border border-[#EFE5DC] dark:border-[#382E28] space-y-4">
            <button
              type="button"
              onClick={() => setShowAddressModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[#8A7D75] hover:bg-[#FAF4ED] transition cursor-pointer"
            >
              <HiX size={18} />
            </button>

            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#6F4432]" />
              <h3 className="text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                Update Home Address
              </h3>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#8A7D75] dark:text-[#A8988D] mb-1">
                  Street Address / House No.
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#6F4432]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8A7D75] dark:text-[#A8988D] mb-1">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.area}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, area: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#6F4432]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8A7D75] dark:text-[#A8988D] mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={addressForm.landmark}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, landmark: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#6F4432]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8A7D75] dark:text-[#A8988D] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#6F4432]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8A7D75] dark:text-[#A8988D] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#6F4432]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8A7D75] dark:text-[#A8988D] mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        pincode: e.target.value,
                        zip: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#6F4432]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="rounded-xl border border-[#E1D5CD] dark:border-[#382E28] px-5 py-2.5 text-xs font-semibold text-[#4D2E23] hover:bg-[#FAF4ED] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressUpdating}
                  className="rounded-xl bg-[#6F4432] hover:bg-[#5C3829] text-white px-6 py-2.5 text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {addressUpdating ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUCCESS CONFIRMATION MODAL (Matching Screen 3) */}
      {/* ========================================================= */}
      {homeVisitBookingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-[32px] bg-white dark:bg-[#241E1B] p-8 text-center shadow-2xl border border-[#EFE5DC] dark:border-[#382E28]">
            {/* Big Green Circle with Checkmark */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2A6E3F] text-white shadow-md mb-6 ring-8 ring-[#2A6E3F]/15">
              <HiCheck size={40} className="stroke-[2.5]" />
            </div>

            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-tight">
              Your home visit is confirmed!
            </h3>

            <p className="mt-2 text-xs text-[#7F726A] dark:text-[#A8988D]">
              Your journey to healing begins now.
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

            {/* Pill: APPOINTMENT NO: #HS... */}
            <div className="mb-6 inline-block rounded-full border border-[#D5C2B4] dark:border-[#52443C] bg-[#FAF5F0] dark:bg-[#1F1916] px-5 py-2">
              <span className="text-[12px] font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
                APPOINTMENT NO: #
                {homeVisitBookingResult.data?.appointment_no ||
                  homeVisitBookingResult.appointment_no ||
                  "HS301026001"}
              </span>
            </div>

            {/* Go to Dashboard button */}
            <button
              type="button"
              onClick={() => {
                dispatch(clearHomeVisitBookingResult());
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

export default PatientHomeVisitDetails;

