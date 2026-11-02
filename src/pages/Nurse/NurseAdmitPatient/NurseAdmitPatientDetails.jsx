import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineArrowUpTray,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  loadNurseAdmissionDetail,
  admitPatientAndAssignRoom,
} from "../../../redux/nurse/nurseThunk";
import {
  selectNurseSelectedAdmission,
  selectNurseAdmissionLoading,
  selectNurseAdmissionError,
  selectAdmitActionLoading,
  selectAdmitActionSuccess,
  selectAdmitActionError,
  selectNursePatientsList,
  resetAdmitActionState,
} from "../../../redux/nurse/nurseSlice";

const DEFAULT_DURATIONS = [
  { value: 3, label: "3 Days" },
  { value: 5, label: "5 Days" },
  { value: 7, label: "7 Days" },
  { value: 10, label: "10 Days" },
  { value: 14, label: "14 Days" },
  { value: 21, label: "21 Days" },
];

const BODY_TYPES = ["Select", "Pitta", "Vata", "Kapha", "Vata-Pitta", "Pitta-Kapha", "Tridoshic"];

const normalizeGender = (g) => {
  if (!g) return "";
  const s = String(g).trim().toLowerCase();
  if (s.startsWith("f")) return "Female";
  if (s.startsWith("m")) return "Male";
  return g;
};

const getOptionKey = (item, idx, prefix = "opt") => {
  if (item === null || item === undefined) return `${prefix}-${idx}`;
  if (typeof item === "string" || typeof item === "number") return `${prefix}-${item}-${idx}`;
  return `${prefix}-${item.id || item.value || item.name || item.room_number || idx}`;
};

const getDoctorName = (doc) => {
  if (!doc) return "";
  if (typeof doc === "string") return doc;
  return doc.name || doc.doctor_name || doc.id || "";
};

const getDoctorLabel = (doc) => {
  if (!doc) return "";
  if (typeof doc === "string") return doc;
  const name = doc.name || doc.doctor_name || doc.id || "";
  return doc.specialization ? `${name} (${doc.specialization})` : name;
};

const getWardValue = (w) => {
  if (!w) return "";
  if (typeof w === "string") return w;
  return w.name || w.ward || w.value || "";
};

const getWardLabel = (w) => {
  if (!w) return "";
  if (typeof w === "string") return w;
  return w.label || w.name || w.ward || w.value || "";
};

const getRoomValue = (rm) => {
  if (!rm) return "";
  if (typeof rm === "string") return rm;
  return rm.value || rm.room_number || rm.name || "";
};

const getRoomLabel = (rm) => {
  if (!rm) return "";
  if (typeof rm === "string") return rm;
  return rm.label || rm.room_number || rm.name || rm.value || "";
};

const NurseAdmitPatientDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const patientFromState = location.state?.patient;
  const patientsList = useSelector(selectNursePatientsList);
  const patientFromList = patientsList?.data?.find(
    (item) =>
      item.id === id ||
      item.admission_no === id ||
      item.patient_id === id ||
      item.patient_code === id
  );

  const admission = useSelector(selectNurseSelectedAdmission);
  const loading = useSelector(selectNurseAdmissionLoading);
  const error = useSelector(selectNurseAdmissionError);
  const actionLoading = useSelector(selectAdmitActionLoading);
  const actionSuccess = useSelector(selectAdmitActionSuccess);
  const actionError = useSelector(selectAdmitActionError);

  // Form State initialized empty, populated dynamically from the patient ID data
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    attendant: "",
    // Vitals
    bp: "",
    sugar: "",
    pulse: "",
    spo2: "",
    temperature: "",
    body_toxicity: "",
    ayurvedic_body_type: "",
    upload_reports: "",
    // Room Assignment
    room_number: "",
    room_type: "",
    sr_doctor: "",
    day_doctor: "",
    night_doctor: "",
    admission_date: new Date().toISOString().split("T")[0],
    no_of_days: 10,
    floor: "",
    ward: "",
    other_comments: "",
  });

  const [dateHeader, setDateHeader] = useState("");
  const [timeHeader, setTimeHeader] = useState("");

  useEffect(() => {
    if (!id && !patientFromState) {
      // If accessed without a specific patient ID, redirect to upcoming patients list
      navigate("/nurse/ipd-patients?tab=upcoming", { replace: true });
    } else if (id) {
      dispatch(loadNurseAdmissionDetail(id));
    }
  }, [dispatch, id, navigate, patientFromState]);

  // Populate form by merging patient details from route state, list cache, and API admission detail
  useEffect(() => {
    const rawData = admission?.data || admission || {};
    const nestedPatient = rawData.patient || rawData.admission || {};

    const source = {
      ...(patientFromList || {}),
      ...(patientFromState || {}),
      ...(rawData || {}),
      ...(nestedPatient || {}),
    };

    const v =
      source.vitals ||
      rawData.vitals ||
      admission?.vitals ||
      {};

    const dropdowns =
      rawData.dropdown_options ||
      admission?.dropdown_options ||
      {};

    const pName =
      source.name ||
      source.patient_name ||
      source.patientName ||
      source.full_name ||
      source.fullName ||
      (source.first_name ? `${source.first_name} ${source.last_name || ""}`.trim() : "");

    const pAge =
      source.age !== undefined && source.age !== null
        ? String(source.age)
        : source.patient?.age
        ? String(source.patient.age)
        : "";

    const pGender = normalizeGender(
      source.gender || source.sex || source.patient?.gender || ""
    );

    const pMobile =
      source.mobile ||
      source.phone ||
      source.mobile_number ||
      source.phoneNumber ||
      source.patient?.mobile ||
      source.patient?.phone ||
      "";

    const pEmail =
      source.email ||
      source.email_id ||
      source.emailId ||
      source.patient?.email ||
      "";

    const attendantVal = source.attendee
      ? source.attendee.has_attendee
        ? (source.attendee_name || "Yes")
        : "No"
      : (source.attendant || source.attendee_name || "");

    const firstRoom = dropdowns.available_rooms?.[0];
    const defaultRoom = firstRoom
      ? getRoomValue(firstRoom)
      : (source.room_number || source.room_no || "");

    const firstSrDoctor = dropdowns.sr_doctors?.[0];
    const defaultSrDoctor = firstSrDoctor
      ? getDoctorName(firstSrDoctor)
      : (source.sr_doctor || source.doctor_name || "");

    const firstDayDoctor = dropdowns.day_doctors?.[0];
    const defaultDayDoctor = firstDayDoctor
      ? getDoctorName(firstDayDoctor)
      : (source.day_doctor || "");

    const firstNightDoctor = dropdowns.night_doctors?.[0];
    const defaultNightDoctor = firstNightDoctor
      ? getDoctorName(firstNightDoctor)
      : (source.night_doctor || "");

    const firstWard = dropdowns.wards_and_floors?.[0];
    const defaultWard = firstWard
      ? getWardValue(firstWard)
      : (source.ward || "");
    const defaultFloor = firstWard
      ? (getWardValue(firstWard).includes("Floor 2") ? "Floor 2" : "Floor 1")
      : (source.floor || "Floor 1");

    const rType =
      (typeof firstRoom === "object" && (firstRoom.type || firstRoom.room_type)) ||
      source.room_type ||
      source.badge ||
      (defaultRoom.toLowerCase().includes("garden")
        ? "Garden"
        : defaultRoom.toLowerCase().includes("non-ac")
        ? "Non-AC"
        : defaultRoom.toLowerCase().includes("ac")
        ? "AC"
        : "");

    if (pName || pAge || pGender || pMobile || pEmail || source.id) {
      setFormData((prev) => ({
        ...prev,
        name: pName || prev.name,
        age: pAge || prev.age,
        gender: pGender || prev.gender,
        mobile: pMobile || prev.mobile,
        email: pEmail || prev.email,
        attendant: attendantVal || prev.attendant,
        bp: v.bp || source.bp || prev.bp,
        sugar: v.sugar || source.sugar || prev.sugar,
        pulse: v.pulse || source.pulse || prev.pulse,
        spo2: v.spo2 || source.spo2 || prev.spo2,
        temperature: v.temperature || source.temperature || prev.temperature,
        body_toxicity: v.body_toxicity || source.body_toxicity || prev.body_toxicity,
        ayurvedic_body_type: v.ayurvedic_body_type || source.ayurvedic_body_type || prev.ayurvedic_body_type,
        upload_reports: v.upload_reports || source.upload_reports || prev.upload_reports,
        room_number: defaultRoom || prev.room_number,
        room_type: rType || prev.room_type,
        sr_doctor: defaultSrDoctor || prev.sr_doctor,
        day_doctor: defaultDayDoctor || prev.day_doctor,
        night_doctor: defaultNightDoctor || prev.night_doctor,
        admission_date: source.admission_date || source.date || prev.admission_date,
        no_of_days: Number(source.no_of_days) || prev.no_of_days || 10,
        floor: defaultFloor || prev.floor,
        ward: defaultWard || prev.ward,
        other_comments: source.other_comments || prev.other_comments,
      }));

      setDateHeader(source.date || source.admission_date || "");
      setTimeHeader(source.time || "");
    }
  }, [admission, patientFromState, patientFromList]);

  useEffect(() => {
    if (actionSuccess) {
      toast.success("Patient admitted and room assigned successfully!");
      dispatch(resetAdmitActionState());
      navigate("/nurse/ipd-patients?tab=admitted");
    }
  }, [actionSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomSelect = (roomVal) => {
    let rType = "";
    let rFloor = "";
    let rWard = "";

    const matched = roomOptions.find((r) => {
      const v = typeof r === "object" ? (r.value || r.room_number || r.name) : r;
      return v === roomVal;
    });

    if (matched && typeof matched === "object") {
      rType = matched.type || matched.room_type || "";
      rFloor = matched.floor || "";
      rWard = matched.ward || "";
    } else if (roomVal.toLowerCase().includes("garden")) {
      rType = "Garden";
      rFloor = "Floor 1";
      rWard = "Garden Ward";
    } else if (roomVal.toLowerCase().includes("non-ac")) {
      rType = "Non-AC";
      rFloor = "Floor 2";
      rWard = "Floor 2 Ward";
    } else if (roomVal.toLowerCase().includes("ac")) {
      rType = "AC";
      rFloor = "Floor 1";
      rWard = "Floor 1 Ward";
    }

    setFormData((prev) => ({
      ...prev,
      room_number: roomVal,
      room_type: rType || prev.room_type,
      floor: rFloor || prev.floor,
      ward: rWard || prev.ward,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetId = id || patientFromState?.id || patientFromList?.id || admission?.id;
    if (!targetId) {
      toast.error("Invalid patient admission reference.");
      return;
    }

    const payload = {
      room_number: formData.room_number,
      room_type: formData.room_type,
      sr_doctor: formData.sr_doctor,
      day_doctor: formData.day_doctor,
      night_doctor: formData.night_doctor,
      admission_date: formData.admission_date,
      no_of_days: Number(formData.no_of_days) || 10,
      floor: formData.floor,
      ward: formData.ward,
      other_comments: formData.other_comments,
    };

    dispatch(admitPatientAndAssignRoom({ admissionId: targetId, payload }));
  };

  const dropdownOptions = admission?.dropdown_options || {};
  const roomOptions = dropdownOptions.available_rooms || [];
  const srDoctors = dropdownOptions.sr_doctors || [];
  const dayDoctors = dropdownOptions.day_doctors || [];
  const nightDoctors = dropdownOptions.night_doctors || [];
  const wards = dropdownOptions.wards_and_floors || [];
  const durationOptions = dropdownOptions.duration_options || DEFAULT_DURATIONS;

  const isFemale = normalizeGender(formData.gender) === "Female";
  const isMale = normalizeGender(formData.gender) === "Male";

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ========================================================= */}
          {/* HEADER (Date & Time on right) */}
          {/* ========================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E7DBD3] dark:border-[#382D25] pb-5">
            <div>
              <h1 className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
                Enter Patient Details
              </h1>
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
                Admit patient and assign a room.
              </p>
            </div>

            {(dateHeader || timeHeader) && (
              <div className="flex items-center gap-3 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                {dateHeader && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 py-2">
                    <HiOutlineCalendar size={15} className="text-[#8A4F32]" />
                    <span>{dateHeader}</span>
                  </div>
                )}
                {timeHeader && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 py-2">
                    <HiOutlineClock size={15} className="text-[#8A4F32]" />
                    <span>{timeHeader}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && !formData.name && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 text-xs text-red-600 dark:text-red-400">
              {typeof error === "string" ? error : "Failed to load patient admission details."}
            </div>
          )}

          {actionError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 text-xs text-red-600 dark:text-red-400">
              {typeof actionError === "string" ? actionError : "Failed to admit patient."}
            </div>
          )}

          {/* ========================================================= */}
          {/* MAIN FORM */}
          {/* ========================================================= */}
          {loading && !formData.name ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#8A4F32] border-t-transparent" />
              <p className="text-xs font-semibold text-[#7D726B] dark:text-[#A8988D]">
                Loading patient admission details...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. PATIENT BASIC INFORMATION */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Patient Name (6 cols) */}
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                      placeholder="Patient Name"
                    />
                  </div>

                  {/* Age (3 cols) */}
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                      placeholder="Age"
                    />
                  </div>

                  {/* Gender (3 cols) */}
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Gender
                    </label>
                    <div className="flex items-center gap-2 h-11">
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, gender: "Female" }))}
                        className={`flex-1 h-full rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isFemale
                            ? "border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#2F241F] text-[#542F1E] dark:text-[#EDE3DA] shadow-xs font-bold"
                            : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] text-[#7D726B] hover:bg-[#FAF6F2]"
                        }`}
                      >
                        <span>♀</span> Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, gender: "Male" }))}
                        className={`flex-1 h-full rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isMale
                            ? "border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#2F241F] text-[#542F1E] dark:text-[#EDE3DA] shadow-xs font-bold"
                            : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] text-[#7D726B] hover:bg-[#FAF6F2]"
                        }`}
                      >
                        <span>♂</span> Male
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Mobile Number (5 cols) */}
                  <div className="md:col-span-5 space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                      placeholder="Mobile Number"
                    />
                  </div>

                  {/* Email ID (4 cols) */}
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Email ID
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                      placeholder="Email ID"
                    />
                  </div>

                  {/* Attendant (3 cols) */}
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Attendant
                    </label>
                    <input
                      type="text"
                      name="attendant"
                      value={formData.attendant}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                      placeholder="Yes / No"
                    />
                  </div>
                </div>
              </div>

              {/* 2. VITALS SECTION */}
              <div className="space-y-3 pt-2">
                <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Vitals
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      BP
                    </label>
                    <input
                      type="text"
                      name="bp"
                      value={formData.bp}
                      onChange={handleChange}
                      placeholder="Enter Value"
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Sugar
                    </label>
                    <input
                      type="text"
                      name="sugar"
                      value={formData.sugar}
                      onChange={handleChange}
                      placeholder="Enter Value"
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Pulse
                    </label>
                    <input
                      type="text"
                      name="pulse"
                      value={formData.pulse}
                      onChange={handleChange}
                      placeholder="Enter Value"
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      SpO2
                    </label>
                    <input
                      type="text"
                      name="spo2"
                      value={formData.spo2}
                      onChange={handleChange}
                      placeholder="Enter Value"
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Temperature
                    </label>
                    <input
                      type="text"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                      placeholder="Enter Value"
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>
                </div>

                {/* Lower Vitals Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Body Toxicity
                    </label>
                    <input
                      type="text"
                      name="body_toxicity"
                      value={formData.body_toxicity}
                      onChange={handleChange}
                      placeholder="Enter Value"
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Ayurvedic Body Type
                    </label>
                    <div className="relative">
                      <select
                        name="ayurvedic_body_type"
                        value={formData.ayurvedic_body_type}
                        onChange={handleChange}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 pr-8 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        {BODY_TYPES.map((bt) => (
                          <option key={bt} value={bt === "Select" ? "" : bt}>
                            {bt}
                          </option>
                        ))}
                      </select>
                      <HiOutlineChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-3.5 text-[#8A7D75]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Upload Reports
                    </label>
                    <label className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 text-xs font-medium text-[#7D726B] dark:text-[#A8988D] flex items-center justify-between cursor-pointer hover:bg-[#FAF6F2]">
                      <span className="truncate">
                        {formData.upload_reports ? formData.upload_reports : "Select files"}
                      </span>
                      <HiOutlineArrowUpTray size={14} className="text-[#8A4F32] shrink-0" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFormData((p) => ({
                              ...p,
                              upload_reports: e.target.files[0].name,
                            }));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. ASSIGN ROOM & DOCTOR SECTION */}
              <div className="space-y-4 pt-2">
                {/* Assign Room Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                    Assign Room Number
                  </label>
                  <div className="relative">
                    <select
                      value={formData.room_number}
                      onChange={(e) => handleRoomSelect(e.target.value)}
                      className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 pr-9 text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                    >
                      {roomOptions.length === 0 ? (
                        <option value={formData.room_number || ""}>
                          {formData.room_number || "No rooms available"}
                        </option>
                      ) : (
                        roomOptions.map((rm, idx) => {
                          const val = getRoomValue(rm);
                          const lbl = getRoomLabel(rm);
                          const key = getOptionKey(rm, idx, "room");
                          return (
                            <option key={key} value={val}>
                              {lbl}
                            </option>
                          );
                        })
                      )}
                    </select>
                    <HiOutlineChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3.5 top-3.5 text-[#8A7D75]"
                    />
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                    Room Type
                  </label>
                  <input
                    type="text"
                    name="room_type"
                    value={formData.room_type}
                    onChange={handleChange}
                    className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-[#FAF8F5] dark:bg-[#1E1714] px-4 text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA] outline-none"
                    placeholder="AC / Non-AC / Garden"
                  />
                </div>

                {/* 3 Doctors: Sr. Doctor, Day Doctor, Night Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Sr. Doctor
                    </label>
                    <div className="relative">
                      <select
                        name="sr_doctor"
                        value={formData.sr_doctor}
                        onChange={handleChange}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 pr-8 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        {srDoctors.length === 0 ? (
                          <option value={formData.sr_doctor || ""}>
                            {formData.sr_doctor || "Select Doctor"}
                          </option>
                        ) : (
                          srDoctors.map((doc, idx) => {
                            const val = getDoctorName(doc);
                            const lbl = getDoctorLabel(doc);
                            const key = getOptionKey(doc, idx, "sr-doc");
                            return (
                              <option key={key} value={val}>
                                {lbl}
                              </option>
                            );
                          })
                        )}
                      </select>
                      <HiOutlineChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-3.5 text-[#8A7D75]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Day Doctor
                    </label>
                    <div className="relative">
                      <select
                        name="day_doctor"
                        value={formData.day_doctor}
                        onChange={handleChange}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 pr-8 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        {dayDoctors.length === 0 ? (
                          <option value={formData.day_doctor || ""}>
                            {formData.day_doctor || "Select Doctor"}
                          </option>
                        ) : (
                          dayDoctors.map((doc, idx) => {
                            const val = getDoctorName(doc);
                            const lbl = getDoctorLabel(doc);
                            const key = getOptionKey(doc, idx, "day-doc");
                            return (
                              <option key={key} value={val}>
                                {lbl}
                              </option>
                            );
                          })
                        )}
                      </select>
                      <HiOutlineChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-3.5 text-[#8A7D75]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Night Doctor
                    </label>
                    <div className="relative">
                      <select
                        name="night_doctor"
                        value={formData.night_doctor}
                        onChange={handleChange}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 pr-8 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        {nightDoctors.length === 0 ? (
                          <option value={formData.night_doctor || ""}>
                            {formData.night_doctor || "Select Doctor"}
                          </option>
                        ) : (
                          nightDoctors.map((doc, idx) => {
                            const val = getDoctorName(doc);
                            const lbl = getDoctorLabel(doc);
                            const key = getOptionKey(doc, idx, "night-doc");
                            return (
                              <option key={key} value={val}>
                                {lbl}
                              </option>
                            );
                          })
                        )}
                      </select>
                      <HiOutlineChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-3.5 text-[#8A7D75]"
                      />
                    </div>
                  </div>
                </div>

                {/* Admission Date, No. of Days, Ward / Floor */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Admission Date
                    </label>
                    <input
                      type="date"
                      name="admission_date"
                      value={formData.admission_date}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      No. of Days
                    </label>
                    <div className="relative">
                      <select
                        name="no_of_days"
                        value={formData.no_of_days}
                        onChange={handleChange}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 pr-8 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        {durationOptions.map((dur) => {
                          const val = typeof dur === "object" ? dur.value : dur;
                          const lbl = typeof dur === "object" ? dur.label : `${dur} Days`;
                          return (
                            <option key={val} value={val}>
                              {lbl}
                            </option>
                          );
                        })}
                      </select>
                      <HiOutlineChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-3.5 text-[#8A7D75]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Ward / Floor
                    </label>
                    <div className="relative">
                      <select
                        name="ward"
                        value={formData.ward}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((p) => ({
                            ...p,
                            ward: val,
                            floor: val.includes("Floor 2") ? "Floor 2" : "Floor 1",
                          }));
                        }}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 pr-8 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        {wards.length === 0 ? (
                          <option value={formData.ward || ""}>
                            {formData.ward || "Select Ward / Floor"}
                          </option>
                        ) : (
                          wards.map((w, idx) => {
                            const val = getWardValue(w);
                            const lbl = getWardLabel(w);
                            const key = getOptionKey(w, idx, "ward");
                            return (
                              <option key={key} value={val}>
                                {lbl}
                              </option>
                            );
                          })
                        )}
                      </select>
                      <HiOutlineChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-3.5 text-[#8A7D75]"
                      />
                    </div>
                  </div>
                </div>

                {/* Other Comments */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                    Other Comments (Optional)
                  </label>
                  <textarea
                    rows={3}
                    name="other_comments"
                    value={formData.other_comments}
                    onChange={handleChange}
                    placeholder="Enter comments"
                    className="w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS (Cancel and Register ->) */}
              <div className="pt-4 flex items-center justify-end gap-4 border-t border-[#E7DBD3] dark:border-[#382D25]">
                <button
                  type="button"
                  onClick={() => navigate("/nurse/ipd-patients?tab=upcoming")}
                  className="rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-7 py-3 text-xs font-bold text-[#4B2E2A] dark:text-[#EDE3DA] hover:bg-[#FAF6F2] transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-xl bg-[#6E3C27] hover:bg-[#582F1E] text-white px-8 py-3 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Register</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NurseAdmitPatientDetails;
