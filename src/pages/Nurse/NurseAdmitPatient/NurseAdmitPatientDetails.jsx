import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineArrowUpTray,
  HiOutlineChevronDown,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  loadNurseAdmissionDetail,
  admitPatientAndAssignRoom,
} from "../../../redux/nurse/nurseThunk";
import { loadFrontOfficeDoctors } from "../../../redux/frontOffice/frontOfficeAppointmentThunk";
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

const DEFAULT_DOCTORS = [
  { id: "doc-1", name: "Dr. Jayasree", specialization: "Senior Ayurvedic Consultant" },
  { id: "doc-2", name: "Dr. Sharma", specialization: "General Medicine" },
  { id: "doc-3", name: "Dr. Nair", specialization: "Panchakarma Specialist" },
  { id: "doc-4", name: "Dr. Patel", specialization: "Clinical Specialist" },
  { id: "doc-5", name: "Dr. Abhinaya", specialization: "Inpatient Care" },
  { id: "doc-6", name: "Dr. Menon", specialization: "Ayurvedic Medicine" },
  { id: "doc-7", name: "Dr. Iyer", specialization: "Kayachikitsa" },
  { id: "doc-8", name: "Dr. Savitri", specialization: "Ayurvedic Medicine" },
  { id: "doc-9", name: "Dr. Jayashree D", specialization: "Autoimmune & General Medicine" },
  { id: "doc-10", name: "Dr. Divya", specialization: "Clinical Coordination" },
  { id: "doc-11", name: "Dr. Preeti Nagarajan", specialization: "Panchakarma Specialist" },
  { id: "doc-12", name: "Dr. Malavika", specialization: "Ayurvedic General Medicine" },
];

const DEFAULT_ROOMS = [
  { id: "rm-101", room_number: "Rm 101", room_type: "AC", floor: "Floor 1", label: "Rm 101 — AC" },
  { id: "rm-102", room_number: "Rm 102", room_type: "AC", floor: "Floor 1", label: "Rm 102 — AC" },
  { id: "rm-103", room_number: "Rm 103", room_type: "AC", floor: "Floor 1", label: "Rm 103 — AC" },
  { id: "rm-104", room_number: "Rm 104", room_type: "AC", floor: "Floor 1", label: "Rm 104 — AC" },
  { id: "rm-105", room_number: "Rm 105", room_type: "AC", floor: "Floor 1", label: "Rm 105 — AC" },
  { id: "rm-112", room_number: "Rm 112", room_type: "Garden", floor: "Floor 1", label: "Rm 112 — Garden" },
  { id: "rm-201", room_number: "Rm 201", room_type: "Non-AC", floor: "Floor 2", label: "Rm 201 — Non-AC" },
];

const DEFAULT_WARDS = [
  "Floor 1",
  "Floor 2",
  "Floor 3",
  "Garden Ward",
];

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
    attendee_name: "",
    attendee_phone: "",
    attendee_gender: "Male",
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
  const [isCheckingOutToday, setIsCheckingOutToday] = useState(false);
  const [checkoutComments, setCheckoutComments] = useState("Patient discharged in good health");
  const [lastActionType, setLastActionType] = useState("checkin"); // "checkin" | "checkout"

  useEffect(() => {
    const targetAdmissionId =
      id ||
      patientFromState?.id ||
      patientFromState?.admission_no ||
      patientFromList?.id;

    if (!id && !patientFromState && !patientFromList) {
      // If accessed without a specific patient ID, redirect to upcoming patients list
      navigate("/nurse/ipd-patients?tab=upcoming", { replace: true });
    } else if (targetAdmissionId) {
      dispatch(loadNurseAdmissionDetail(targetAdmissionId));
    }
    dispatch(loadFrontOfficeDoctors());
  }, [dispatch, id, navigate, patientFromState, patientFromList]);

  // Populate form by merging patient details from route state, list cache, and API admission detail
  useEffect(() => {
    const rawData = admission?.data || admission || {};
    const nestedAdmission = rawData.admission || rawData.patient || {};

    const source = {
      ...(patientFromList || {}),
      ...(patientFromState || {}),
      ...(rawData || {}),
      ...(nestedAdmission || {}),
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

    const attendantVal =
      source.attendant ||
      (source.has_attendee ? "Yes" : source.has_attendee === false ? "No" : "");

    const pAttendeeName =
      source.attendee_name ||
      source.attendee?.name ||
      source.attendant_name ||
      source.attendantName ||
      "";

    const pAttendeePhone =
      source.attendee_phone ||
      source.attendee?.phone ||
      source.attendee?.mobile ||
      source.attendant_phone ||
      source.attendantPhone ||
      source.attendant_mobile ||
      "";

    const rawAttendeeGender =
      source.attendee_gender ||
      source.attendee?.gender ||
      source.attendant_gender ||
      "";

    const pAttendeeGender = rawAttendeeGender ? normalizeGender(rawAttendeeGender) : "Male";

    const firstRoom = dropdowns.available_rooms?.[0];
    const defaultRoom =
      source.room_number ||
      source.room_no ||
      (firstRoom ? getRoomValue(firstRoom) : "");

    const firstSrDoctor = dropdowns.sr_doctors?.[0] || dropdowns.doctors?.[0];
    const defaultSrDoctor =
      source.sr_doctor ||
      source.doctor_name ||
      (firstSrDoctor ? getDoctorName(firstSrDoctor) : "Dr. Jayasree");

    const firstDayDoctor = dropdowns.day_doctors?.[0] || dropdowns.doctors?.[0];
    const defaultDayDoctor =
      source.day_doctor ||
      (firstDayDoctor ? getDoctorName(firstDayDoctor) : "Dr. Sharma");

    const firstNightDoctor = dropdowns.night_doctors?.[0] || dropdowns.doctors?.[0];
    const defaultNightDoctor =
      source.night_doctor ||
      (firstNightDoctor ? getDoctorName(firstNightDoctor) : "Dr. Sharma");

    const firstWard = dropdowns.wards_and_floors?.[0];
    const defaultWard =
      source.ward ||
      (firstWard ? getWardValue(firstWard) : "Floor 1 Ward");
    const defaultFloor =
      source.floor ||
      (defaultWard.includes("Floor 2") ? "Floor 2" : "Floor 1");

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
        attendee_name: pAttendeeName || prev.attendee_name,
        attendee_phone: pAttendeePhone || prev.attendee_phone,
        attendee_gender: pAttendeeGender || prev.attendee_gender || "Male",
        sr_doctor: defaultSrDoctor || prev.sr_doctor,
        day_doctor: defaultDayDoctor || prev.day_doctor,
        night_doctor: defaultNightDoctor || prev.night_doctor,
        admission_date: source.admission_date || source.admission_date_iso || source.date || prev.admission_date,
        no_of_days: Number(source.no_of_days) || prev.no_of_days || 10,
        floor: defaultFloor || prev.floor,
        ward: defaultWard || prev.ward,
        other_comments: source.other_comments || source.comments || prev.other_comments,
      }));

      setDateHeader(source.admission_date || source.date || "29 June, 2026");
      setTimeHeader(source.admission_time || source.time || "10:30 AM");
    }
  }, [admission, patientFromState, patientFromList]);

  useEffect(() => {
    if (actionSuccess) {
      if (lastActionType === "checkout") {
        toast.success("Patient checked out successfully and room released!");
        dispatch(resetAdmitActionState());
        navigate("/nurse/ipd-patients?tab=discharged");
      } else {
        toast.success("Patient admitted successfully and room assigned!");
        dispatch(resetAdmitActionState());
        navigate("/nurse/ipd-patients?tab=admitted");
      }
    }
  }, [actionSuccess, dispatch, navigate, lastActionType]);

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
    if (e && e.preventDefault) e.preventDefault();
    const targetId = id || patientFromState?.id || patientFromList?.id || admission?.id;
    if (!targetId) {
      toast.error("Invalid patient admission reference.");
      return;
    }

    if (!formData.room_number) {
      toast.error("Please assign a room before proceeding.");
      return;
    }

    setLastActionType("checkin");

    const payload = {
      room_number: formData.room_number,
      room_type: formData.room_type,
      attendee_name: formData.attendee_name,
      attendee_phone: formData.attendee_phone,
      attendee_gender: formData.attendee_gender,
      sr_doctor: formData.sr_doctor,
      day_doctor: formData.day_doctor,
      night_doctor: formData.night_doctor,
      admission_date: formData.admission_date,
      checkin: true,
      checkout: false,
      no_of_days: Number(formData.no_of_days) || 10,
      floor: formData.floor,
      ward: formData.ward,
      other_comments: formData.other_comments || "Room assigned by Nurse",
    };

    dispatch(admitPatientAndAssignRoom({ admissionId: targetId, payload }));
  };

  const handleConfirmCheckout = () => {
    const targetId = id || patientFromState?.id || patientFromList?.id || admission?.id;
    if (!targetId) {
      toast.error("Invalid patient admission reference.");
      return;
    }

    setLastActionType("checkout");

    const payload = {
      checkin: true,
      checkout: true,
      other_comments: checkoutComments || formData.other_comments || "Patient discharged in good health",
    };

    dispatch(admitPatientAndAssignRoom({ admissionId: targetId, payload }));
  };

  const rawAdmissionData = admission?.data || admission || {};
  const nestedAdmission = rawAdmissionData.admission || rawAdmissionData.patient || {};
  const source = {
    ...(patientFromList || {}),
    ...(patientFromState || {}),
    ...(rawAdmissionData || {}),
    ...(nestedAdmission || {}),
  };

  const isCheckedIn = Boolean(
    source.checkin === true ||
    source.status === "admitted" ||
    Boolean(source.checkin_date) ||
    rawAdmissionData.checkin === true ||
    nestedAdmission.checkin === true
  );

  const isDischarged = Boolean(
    source.checkout === true ||
    source.status === "discharged" ||
    Boolean(source.checkout_date) ||
    rawAdmissionData.checkout === true ||
    nestedAdmission.checkout === true
  );

  const isFirstTimeAdmission = !isCheckedIn && !isDischarged;

  const isLastDay = Boolean(
    source.is_checkout_today === true ||
    rawAdmissionData.is_checkout_today === true ||
    nestedAdmission.is_checkout_today === true ||
    (source.expected_discharge_date && (() => {
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        const expStr = new Date(source.expected_discharge_date).toISOString().split("T")[0];
        return todayStr >= expStr;
      } catch {
        return false;
      }
    })())
  );

  useEffect(() => {
    if (isLastDay) {
      setIsCheckingOutToday(true);
    }
  }, [isLastDay]);

  const dropdownOptions =
    rawAdmissionData?.dropdown_options ||
    admission?.dropdown_options ||
    {};

  const frontOfficeDoctors = useSelector(
    (state) => state.frontOfficeAppointment?.doctors || []
  );

  // Combine all available doctors with fallback
  const masterDoctors = (() => {
    const list = [];
    if (Array.isArray(dropdownOptions.doctors) && dropdownOptions.doctors.length > 0) {
      list.push(...dropdownOptions.doctors);
    }
    if (Array.isArray(frontOfficeDoctors) && frontOfficeDoctors.length > 0) {
      list.push(...frontOfficeDoctors);
    }
    list.push(...DEFAULT_DOCTORS);

    const seen = new Set();
    const deduped = [];
    for (const doc of list) {
      const name = getDoctorName(doc);
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        deduped.push(doc);
      }
    }
    return deduped;
  })();

  const srDoctors =
    Array.isArray(dropdownOptions.sr_doctors) && dropdownOptions.sr_doctors.length > 0
      ? dropdownOptions.sr_doctors
      : masterDoctors;

  const dayDoctors =
    Array.isArray(dropdownOptions.day_doctors) && dropdownOptions.day_doctors.length > 0
      ? dropdownOptions.day_doctors
      : masterDoctors;

  const nightDoctors =
    Array.isArray(dropdownOptions.night_doctors) && dropdownOptions.night_doctors.length > 0
      ? dropdownOptions.night_doctors
      : masterDoctors;

  const roomOptions =
    Array.isArray(dropdownOptions.available_rooms) && dropdownOptions.available_rooms.length > 0
      ? dropdownOptions.available_rooms
      : DEFAULT_ROOMS;

  const wards =
    Array.isArray(dropdownOptions.wards_and_floors) && dropdownOptions.wards_and_floors.length > 0
      ? dropdownOptions.wards_and_floors
      : DEFAULT_WARDS;

  const durationOptions = dropdownOptions.duration_options || DEFAULT_DURATIONS;

  const isFemale = normalizeGender(formData.gender) === "Female";
  const isMale = normalizeGender(formData.gender) === "Male";
  const isAttendeeFemale = normalizeGender(formData.attendee_gender) === "Female";
  const isAttendeeMale = normalizeGender(formData.attendee_gender) === "Male";

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ========================================================= */}
          {/* HEADER (Date & Time on right) */}
          {/* ========================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E7DBD3] dark:border-[#382D25] pb-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
                  {isCheckedIn ? "Patient Admission & Room Details" : "Enter Patient Details"}
                </h1>
                {isCheckedIn && !isDischarged && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E7F3EC] dark:bg-[#1A3326] text-[#2E7D32] dark:text-[#81C784]">
                    Admitted
                  </span>
                )}
                {isDischarged && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
                    Discharged
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
                {isCheckedIn
                  ? "View and manage room allotment, doctors, and confirm checkout."
                  : "Admit patient and assign a room."}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">Date</span>
                <div className="flex items-center gap-2 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 py-2">
                  <HiOutlineCalendar size={15} className="text-[#8A4F32]" />
                  <span>{dateHeader || "29 June, 2026"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">Time</span>
                <div className="flex items-center gap-2 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 py-2">
                  <HiOutlineClock size={15} className="text-[#8A4F32]" />
                  <span>{timeHeader || "10:30 AM"}</span>
                </div>
              </div>
            </div>
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

              {/* 3. ROOM DETAILS */}
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Room Details
                </h2>

                {/* Row 1: Assign Room Number & Room Type (2 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Assign Room Number
                    </label>
                    <div className="relative">
                      <select
                        name="room_number"
                        value={formData.room_number || ""}
                        onChange={(e) => handleRoomSelect(e.target.value)}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 pr-9 text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        <option value="">Select Room</option>
                        {formData.room_number &&
                          !roomOptions.some(
                            (rm) => getRoomValue(rm)?.toLowerCase() === formData.room_number?.toLowerCase()
                          ) && (
                            <option value={formData.room_number}>{formData.room_number}</option>
                          )}
                        {roomOptions.map((rm, idx) => {
                          const val = getRoomValue(rm);
                          const lbl = getRoomLabel(rm);
                          const key = getOptionKey(rm, idx, "room");
                          return (
                            <option key={key} value={val}>
                              {lbl}
                            </option>
                          );
                        })}
                      </select>
                      <HiOutlineChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3.5 top-3.5 text-[#8A7D75]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Room Type
                    </label>
                    <input
                      type="text"
                      name="room_type"
                      value={formData.room_type}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                      placeholder="AC / Non-AC / Garden"
                    />
                  </div>
                </div>

                {/* Row 2: Attendant Name, Mobile Number, Gender (3 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Attendant Name
                    </label>
                    <input
                      type="text"
                      name="attendee_name"
                      value={formData.attendee_name}
                      onChange={handleChange}
                      placeholder="Attendant Name"
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="attendee_phone"
                      value={formData.attendee_phone}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                      className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Gender
                    </label>
                    <div className="flex items-center gap-2 h-11">
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, attendee_gender: "Female" }))}
                        className={`flex-1 h-full rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isAttendeeFemale
                            ? "border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#2F241F] text-[#542F1E] dark:text-[#EDE3DA] shadow-xs font-bold"
                            : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] text-[#7D726B] hover:bg-[#FAF6F2]"
                        }`}
                      >
                        <span>♀</span> Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, attendee_gender: "Male" }))}
                        className={`flex-1 h-full rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isAttendeeMale
                            ? "border-[#542F1E] dark:border-[#D5A794] bg-[#FFFDFC] dark:bg-[#2F241F] text-[#542F1E] dark:text-[#EDE3DA] shadow-xs font-bold"
                            : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] text-[#7D726B] hover:bg-[#FAF6F2]"
                        }`}
                      >
                        <span>♂</span> Male
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. DOCTOR DETAILS */}
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Doctor Details
                </h2>

                {/* Row 1: Sr. Doctor, Day Doctor, Night Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Sr. Doctor
                    </label>
                    <div className="relative">
                      <select
                        name="sr_doctor"
                        value={formData.sr_doctor || ""}
                        onChange={handleChange}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 pr-8 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        <option value="">Select Doctor</option>
                        {formData.sr_doctor &&
                          !srDoctors.some(
                            (d) => getDoctorName(d)?.toLowerCase() === formData.sr_doctor?.toLowerCase()
                          ) && (
                            <option value={formData.sr_doctor}>{formData.sr_doctor}</option>
                          )}
                        {srDoctors.map((doc, idx) => {
                          const val = getDoctorName(doc);
                          const lbl = getDoctorLabel(doc);
                          const key = getOptionKey(doc, idx, "sr-doc");
                          return (
                            <option key={key} value={val}>
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
                      Day Doctor
                    </label>
                    <div className="relative">
                      <select
                        name="day_doctor"
                        value={formData.day_doctor || ""}
                        onChange={handleChange}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 pr-8 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        <option value="">Select Doctor</option>
                        {formData.day_doctor &&
                          !dayDoctors.some(
                            (d) => getDoctorName(d)?.toLowerCase() === formData.day_doctor?.toLowerCase()
                          ) && (
                            <option value={formData.day_doctor}>{formData.day_doctor}</option>
                          )}
                        {dayDoctors.map((doc, idx) => {
                          const val = getDoctorName(doc);
                          const lbl = getDoctorLabel(doc);
                          const key = getOptionKey(doc, idx, "day-doc");
                          return (
                            <option key={key} value={val}>
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
                      Night Doctor
                    </label>
                    <div className="relative">
                      <select
                        name="night_doctor"
                        value={formData.night_doctor || ""}
                        onChange={handleChange}
                        className="appearance-none w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 pr-8 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                      >
                        <option value="">Select Doctor</option>
                        {formData.night_doctor &&
                          !nightDoctors.some(
                            (d) => getDoctorName(d)?.toLowerCase() === formData.night_doctor?.toLowerCase()
                          ) && (
                            <option value={formData.night_doctor}>{formData.night_doctor}</option>
                          )}
                        {nightDoctors.map((doc, idx) => {
                          const val = getDoctorName(doc);
                          const lbl = getDoctorLabel(doc);
                          const key = getOptionKey(doc, idx, "night-doc");
                          return (
                            <option key={key} value={val}>
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
                </div>

                {/* Row 2: Admission Date, No. of Days, Ward / Floor */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                      Admission Date
                    </label>
                    <input
                      type="text"
                      name="admission_date"
                      value={formData.admission_date}
                      onChange={handleChange}
                      placeholder="28 Oct 2026"
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
                        value={formData.ward || ""}
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
                        <option value="">Select Ward / Floor</option>
                        {formData.ward &&
                          !wards.some(
                            (w) => getWardValue(w)?.toLowerCase() === formData.ward?.toLowerCase()
                          ) && (
                            <option value={formData.ward}>{formData.ward}</option>
                          )}
                        {wards.map((w, idx) => {
                          const val = getWardValue(w);
                          const lbl = getWardLabel(w);
                          const key = getOptionKey(w, idx, "ward");
                          return (
                            <option key={key} value={val}>
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
                </div>

                {/* Row 3: Other Comments */}
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

              {/* 5. CHECKOUT & DISCHARGE CONFIRMATION (Rendered for admitted patients / last day of stay) */}
              {isCheckedIn && !isDischarged && (
                <div className="space-y-4 pt-2">
                  <div className="rounded-2xl border-2 border-[#D5A794] dark:border-[#542F1E] bg-[#FFFDFC] dark:bg-[#251D18] p-5 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E7DBD3] dark:border-[#382D25] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6E3C27]/10 dark:bg-[#6E3C27]/30 text-[#6E3C27] dark:text-[#D5A794]">
                          <HiOutlineArrowRightOnRectangle size={20} />
                        </span>
                        <div>
                          <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                            Checkout & Discharge Confirmation
                          </h2>
                          <p className="text-xs text-[#7D726B] dark:text-[#A8988D]">
                            {isLastDay
                              ? "Today is the last day of the patient's admission period."
                              : `Expected discharge date: ${source.expected_discharge_date || "Scheduled at end of stay"}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isLastDay && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                            Discharge Due Today
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3EC] dark:bg-[#1A3326] text-[#2E7D32] dark:text-[#81C784]">
                          Admitted · {formData.room_number || "Room Assigned"}
                        </span>
                      </div>
                    </div>

                    {/* Question: Is the patient checking out today? */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-[#4B2E2A] dark:text-[#EDE3DA]">
                          Is the patient checking out today?
                        </label>
                        <span className="text-xs text-[#8A4F32] font-semibold">*</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsCheckingOutToday(true)}
                          className={`flex-1 px-5 py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                            isCheckingOutToday
                              ? "border-[#6E3C27] bg-[#6E3C27] text-white shadow-xs"
                              : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] text-[#7D726B] hover:bg-[#FAF6F2]"
                          }`}
                        >
                          <span className="text-sm font-bold">✓</span>
                          <span>Yes, patient is checking out today</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsCheckingOutToday(false)}
                          className={`flex-1 px-5 py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                            !isCheckingOutToday
                              ? "border-[#4B2E2A] dark:border-[#D5A794] bg-[#F5ECE5] dark:bg-[#2E241E] text-[#4B2E2A] dark:text-[#EDE3DA]"
                              : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] text-[#7D726B] hover:bg-[#FAF6F2]"
                          }`}
                        >
                          <span>✕</span>
                          <span>No, continue stay</span>
                        </button>
                      </div>

                      {isCheckingOutToday && (
                        <div className="space-y-3 pt-3 border-t border-[#E7DBD3]/60 dark:border-[#382D25]/60">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA]">
                              Checkout Comments
                            </label>
                            <input
                              type="text"
                              value={checkoutComments}
                              onChange={(e) => setCheckoutComments(e.target.value)}
                              placeholder="Patient discharged in good health"
                              className="w-full h-11 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                            <p className="text-[11px] text-[#7D726B] dark:text-[#A8988D]">
                              Triggering checkout captures checkout time, releases room {formData.room_number || ""} back to free, and updates status to discharged.
                            </p>
                            <button
                              type="button"
                              onClick={handleConfirmCheckout}
                              disabled={actionLoading}
                              className="rounded-xl bg-[#8A4F32] hover:bg-[#6E3C27] text-white px-6 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                            >
                              {actionLoading ? (
                                <span>Processing Checkout...</span>
                              ) : (
                                <>
                                  <HiOutlineArrowRightOnRectangle size={15} />
                                  <span>Confirm Checkout (checkout = true)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-[#E7DBD3] dark:border-[#382D25]">
                <button
                  type="button"
                  onClick={() => navigate("/nurse/ipd-patients?tab=" + (isCheckedIn ? "admitted" : "upcoming"))}
                  className="rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-7 py-3 text-xs font-bold text-[#4B2E2A] dark:text-[#EDE3DA] hover:bg-[#FAF6F2] transition cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  {isFirstTimeAdmission ? (
                    // Scenario A: First time filling the form -> Check-in button
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="rounded-xl bg-[#6E3C27] hover:bg-[#582F1E] text-white px-8 py-3 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {actionLoading ? (
                        <span>Checking in Patient...</span>
                      ) : (
                        <>
                          <span>Check-in Patient</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  ) : isCheckedIn && !isDischarged ? (
                    isCheckingOutToday ? (
                      <button
                        type="button"
                        onClick={handleConfirmCheckout}
                        disabled={actionLoading}
                        className="rounded-xl bg-[#8A4F32] hover:bg-[#6E3C27] text-white px-8 py-3 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        {actionLoading ? (
                          <span>Processing Checkout...</span>
                        ) : (
                          <>
                            <HiOutlineArrowRightOnRectangle size={15} />
                            <span>Confirm Checkout & Release Room</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="rounded-xl bg-[#6E3C27] hover:bg-[#582F1E] text-white px-8 py-3 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        {actionLoading ? (
                          <span>Updating...</span>
                        ) : (
                          <>
                            <span>Update Admission Details</span>
                            <span>→</span>
                          </>
                        )}
                      </button>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-neutral-800 text-xs font-bold text-gray-600 dark:text-gray-300">
                      Patient Discharged
                    </span>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NurseAdmitPatientDetails;
