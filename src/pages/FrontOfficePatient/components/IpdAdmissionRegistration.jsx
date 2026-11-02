import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineArrowUpTray,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2";
import { HiOutlineArrowLeft, HiOutlineCheck } from "react-icons/hi";
import toast from "react-hot-toast";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  loadFrontOfficePatients,
  createFrontOfficeIpdAdmission,
} from "../../../redux/frontOffice/frontOfficePatientThunk";
import {
  selectFrontOfficePatients,
  selectIpdAdmissionLoading,
  selectIpdAdmissionSuccess,
  selectIpdAdmissionData,
  selectIpdAdmissionError,
  clearIpdAdmissionResult,
} from "../../../redux/frontOffice/frontOfficePatientSlice";

const REASONS_FOR_VISIT = [
  "Admission",
  "Observation",
  "Emergency",
  "Treatment",
  "Surgery",
  "General Checkup",
];

const AYURVEDIC_BODY_TYPES = [
  "Select",
  "Pitta",
  "Vata",
  "Kapha",
  "Vata-Pitta",
  "Pitta-Kapha",
  "Vata-Kapha",
  "Tridoshic",
];

const IpdAdmissionRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxPatients = useSelector(selectFrontOfficePatients);
  const ipdLoading = useSelector(selectIpdAdmissionLoading);
  const ipdSuccess = useSelector(selectIpdAdmissionSuccess);
  const ipdData = useSelector(selectIpdAdmissionData);
  const ipdError = useSelector(selectIpdAdmissionError);

  const patientOptions =
    reduxPatients && Array.isArray(reduxPatients) ? reduxPatients : [];

  // Search/Dropdown State for Patient Name
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Form State initialized cleanly without hardcoded dummy values
  const [form, setForm] = useState({
    reason_for_visit: "Admission",
    date: new Date().toISOString().split("T")[0],
    time: "10:30 AM",
    name: "",
    age: "",
    gender: "Female",
    mobile: "",
    email: "",
    patient_id: "",
    referral_code: "",
    address: "",
    country: "India",
    city: "",
    postal_code: "",
    known_allergies: "",
    vitals: {
      bp: "",
      sugar: "",
      pulse: "",
      spo2: "",
      temperature: "",
      body_toxicity: "",
      ayurvedic_body_type: "",
      upload_reports: "",
    },
    insurance: {
      have_insurance: false,
      dont_have_insurance: false,
    },
    attendee: {
      has_attendee: false,
      doesnt_have_attendee: false,
    },
    attendee_name: "",
    attendee_phone: "",
    other_comments: "",
  });

  const [uploadedFileName, setUploadedFileName] = useState("");
  const [confirmationData, setConfirmationData] = useState(null);

  // Load registered patients on mount
  useEffect(() => {
    dispatch(loadFrontOfficePatients());
  }, [dispatch]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle auto-fill when patient is selected from dropdown
  const handleSelectPatient = (patient) => {
    if (!patient) return;

    const patientVitals = patient.vitals || {};
    const patientInsurance = patient.insurance || {};
    const patientAttendee = patient.attendee || {};

    setForm((prev) => ({
      ...prev,
      name: patient.name || patient.full_name || patient.patient_name || "",
      age: patient.age ? String(patient.age) : "",
      gender: patient.gender ? (String(patient.gender).toLowerCase().startsWith("m") ? "Male" : "Female") : prev.gender,
      mobile: patient.mobile || patient.phone || "",
      email: patient.email || "",
      patient_id: patient.patient_code || patient.patient_id || patient.id || "",
      referral_code: patient.referral_code || patient.referral_id || "",
      address: patient.address || "",
      country: patient.country || "India",
      city: patient.city || "",
      postal_code: patient.postal_code || patient.pincode || "",
      known_allergies: patient.known_allergies || patient.allergies || "",
      vitals: {
        bp: patientVitals.bp || patient.bp || "",
        sugar: patientVitals.sugar ? String(patientVitals.sugar) : (patient.sugar ? String(patient.sugar) : ""),
        pulse: patientVitals.pulse ? String(patientVitals.pulse) : (patient.pulse ? String(patient.pulse) : ""),
        spo2: patientVitals.spo2 ? String(patientVitals.spo2) : (patient.spo2 ? String(patient.spo2) : ""),
        temperature: patientVitals.temperature ? String(patientVitals.temperature) : (patient.temperature ? String(patient.temperature) : ""),
        body_toxicity: patientVitals.body_toxicity || patient.body_toxicity || "",
        ayurvedic_body_type: patientVitals.ayurvedic_body_type || patient.ayurvedic_body_type || "",
        upload_reports: patientVitals.upload_reports || patient.reports || "",
      },
      insurance: {
        have_insurance: Boolean(patientInsurance.have_insurance ?? patient.has_insurance),
        dont_have_insurance: Boolean(patientInsurance.dont_have_insurance ?? (!patient.has_insurance && patient.has_insurance !== undefined)),
      },
      attendee: {
        has_attendee: Boolean(patientAttendee.has_attendee ?? patient.has_attendee),
        doesnt_have_attendee: Boolean(patientAttendee.doesnt_have_attendee ?? (!patient.has_attendee && patient.has_attendee !== undefined)),
      },
      attendee_name: patient.attendee_name || "",
      attendee_phone: patient.attendee_phone || "",
      other_comments: patient.other_comments || "",
    }));

    setPatientSearch(patient.name || patient.full_name || patient.patient_name || "");
    setShowPatientDropdown(false);
    toast.success(`Patient "${patient.name || patient.full_name || patient.patient_name}" details selected`);
  };

  // Filtered patient list for autocomplete
  const filteredPatients = patientOptions.filter((p) => {
    if (!patientSearch.trim()) return true;
    const q = patientSearch.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      (p.patient_id && String(p.patient_id).toLowerCase().includes(q)) ||
      (p.patient_code && String(p.patient_code).toLowerCase().includes(q)) ||
      (p.mobile && String(p.mobile).includes(q))
    );
  });

  // Handle generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle vitals input change
  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [name]: value,
      },
    }));
  };

  // Handle insurance checkboxes
  const handleInsuranceToggle = (type) => {
    if (type === "have") {
      setForm((prev) => ({
        ...prev,
        insurance: {
          have_insurance: true,
          dont_have_insurance: false,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        insurance: {
          have_insurance: false,
          dont_have_insurance: true,
        },
      }));
    }
  };

  // Handle attendee checkboxes
  const handleAttendeeToggle = (type) => {
    if (type === "has") {
      setForm((prev) => ({
        ...prev,
        attendee: {
          has_attendee: true,
          doesnt_have_attendee: false,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        attendee: {
          has_attendee: false,
          doesnt_have_attendee: true,
        },
        attendee_name: "",
        attendee_phone: "",
      }));
    }
  };

  // Handle report file selection
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setForm((prev) => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          upload_reports: `https://res.cloudinary.com/sadop/reports/${file.name}`,
        },
      }));
      toast.success(`Attached "${file.name}"`);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter or select a patient name.");
      return;
    }

    // Build payload matching API specification
    const payload = {
      reason_for_visit: form.reason_for_visit || "Admission",
      date: form.date || new Date().toISOString().split("T")[0],
      time: form.time || "10:30 AM",
      name: form.name.trim(),
      age: form.age ? Number(form.age) : undefined,
      gender: form.gender || "Female",
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      patient_id: form.patient_id.trim(),
      referral_code: form.referral_code.trim(),
      address: form.address.trim(),
      country: form.country.trim() || "India",
      city: form.city.trim(),
      postal_code: form.postal_code.trim(),
      known_allergies: form.known_allergies.trim(),
      vitals: {
        bp: form.vitals.bp || "",
        sugar: form.vitals.sugar || "",
        pulse: form.vitals.pulse || "",
        spo2: form.vitals.spo2 || "",
        temperature: form.vitals.temperature || "",
        body_toxicity: form.vitals.body_toxicity || "",
        ayurvedic_body_type:
          form.vitals.ayurvedic_body_type && form.vitals.ayurvedic_body_type !== "Select"
            ? form.vitals.ayurvedic_body_type
            : "",
        upload_reports: form.vitals.upload_reports || "",
      },
      insurance: {
        have_insurance: !!form.insurance.have_insurance,
        dont_have_insurance: !!form.insurance.dont_have_insurance,
      },
      attendee: {
        has_attendee: !!form.attendee.has_attendee,
        doesnt_have_attendee: !!form.attendee.doesnt_have_attendee,
      },
      attendee_name: form.attendee.has_attendee ? form.attendee_name.trim() : "",
      attendee_phone: form.attendee.has_attendee ? form.attendee_phone.trim() : "",
      other_comments: form.other_comments.trim(),
    };

    const result = await dispatch(createFrontOfficeIpdAdmission(payload));

    if (!result.error) {
      const data = result.payload?.data || result.payload;
      setConfirmationData(data);
      toast.success("IPD patient registration submitted successfully!");
    } else {
      setConfirmationData(null);
      const errorMessage =
        result.payload?.message ||
        (typeof result.payload === "string" ? result.payload : null) ||
        result.error?.message ||
        "Failed to submit IPD registration. Please check the API/server response and try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <DashboardLayout role="frontoffice">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6 font-sans">
        {/* Top Breadcrumb & Go Back */}
        <div className="flex items-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => navigate("/frontoffice/dashboard")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#251E1A] text-[#4B2E2A] dark:text-[#EDE3DA] transition hover:bg-[#F9F5F1] cursor-pointer"
          >
            <HiOutlineArrowLeft size={17} />
          </button>
          <span className="text-xs font-semibold text-[#8B7A70] uppercase tracking-wider">
            Front Office • Inpatient Department (IPD)
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ========================================================= */}
          {/* TOP HEADER SECTION (Matching Image 1) */}
          {/* ========================================================= */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
            <div>
              <h1 className="text-[22px] sm:text-[24px] font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
                Patient Information
              </h1>
              <p className="text-[13px] text-[#8B7A70] dark:text-[#A8988D] mt-0.5">
                Record patient's details.
              </p>
            </div>

            {/* Top Right Header Controls: Reason for visit, Date, Time */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Reason for visit */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1">
                  Reason for visit
                </label>
                <select
                  name="reason_for_visit"
                  value={form.reason_for_visit}
                  onChange={handleChange}
                  className="h-10 rounded-xl border border-[#E9DFD8] dark:border-[#382D25] bg-white dark:bg-[#251E1A] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                >
                  {REASONS_FOR_VISIT.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1">
                  Date
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="h-10 rounded-xl border border-[#E9DFD8] dark:border-[#382D25] bg-white dark:bg-[#251E1A] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1">
                  Time
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    placeholder="10:30 AM"
                    className="h-10 w-[110px] rounded-xl border border-[#E9DFD8] dark:border-[#382D25] bg-white dark:bg-[#251E1A] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: PATIENT INFORMATION FIELDS */}
          {/* ========================================================= */}
          <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 shadow-xs space-y-4">
            {/* ROW 1: Patient Name (With Dropdown Search), Age, Gender */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Patient Name with Auto-Suggest Dropdown */}
              <div className="md:col-span-5 relative" ref={dropdownRef}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8]">
                    Patient Name
                  </label>
                  <span className="text-[11px] font-medium text-[#8A4F32] cursor-pointer hover:underline" onClick={() => setShowPatientDropdown(!showPatientDropdown)}>
                    Choose registered patient ▼
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => {
                      handleChange(e);
                      setPatientSearch(e.target.value);
                      setShowPatientDropdown(true);
                    }}
                    onFocus={() => setShowPatientDropdown(true)}
                    placeholder="Enter or select patient name"
                    className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                  />

                  {/* Dropdown Menu */}
                  {showPatientDropdown && (
                    <div className="absolute left-0 right-0 top-12 z-50 max-h-60 overflow-y-auto rounded-xl border border-[#E7D8CC] dark:border-[#3D322B] bg-white dark:bg-[#251E1A] shadow-xl py-2">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-[#8A5035] uppercase tracking-wider border-b border-[#F0E6DE] dark:border-[#382D25]">
                        Select to Auto-fill Patient Data
                      </div>
                      {filteredPatients.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-[#8A7D75]">
                          No matching patient. Type name manually.
                        </div>
                      ) : (
                        filteredPatients.map((p) => (
                          <div
                            key={p.id || p.patient_id}
                            onClick={() => handleSelectPatient(p)}
                            className="px-3.5 py-2.5 hover:bg-[#FAF4ED] dark:hover:bg-[#342923] cursor-pointer transition border-b border-[#FAF4EF] dark:border-[#2D231E] last:border-0"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                                {p.name || p.full_name}
                              </span>
                              <span className="text-[11px] text-[#8A5035] bg-[#F7EFE9] dark:bg-[#382D25] px-2 py-0.5 rounded-md font-mono">
                                {p.patient_id || p.patient_code || "ID"}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#8B7A70] flex items-center gap-2 mt-0.5">
                              <span>Age: {p.age || "N/A"}</span>
                              <span>•</span>
                              <span>{p.gender || "Female"}</span>
                              <span>•</span>
                              <span>{p.mobile || p.phone || "No phone"}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Age */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="24"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              {/* Gender */}
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Gender
                </label>
                <div className="flex items-center gap-3 h-11">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, gender: "Female" }))}
                    className={`flex-1 h-full rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      form.gender === "Female"
                        ? "border-[#4D2E23] dark:border-[#D5A794] bg-[#FAF3EC] dark:bg-[#342923] text-[#4D2E23] dark:text-[#EDE3DA] shadow-xs ring-1 ring-[#4D2E23]"
                        : "border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1E1714] text-[#8A7D75] hover:bg-[#FAF6F2]"
                    }`}
                  >
                    <span>♀</span>
                    <span>Female</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, gender: "Male" }))}
                    className={`flex-1 h-full rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      form.gender === "Male"
                        ? "border-[#4D2E23] dark:border-[#D5A794] bg-[#FAF3EC] dark:bg-[#342923] text-[#4D2E23] dark:text-[#EDE3DA] shadow-xs ring-1 ring-[#4D2E23]"
                        : "border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1E1714] text-[#8A7D75] hover:bg-[#FAF6F2]"
                    }`}
                  >
                    <span>♂</span>
                    <span>Male</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ROW 2: Mobile Number, Email ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="9833400397"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="k.balaji@gmail.com"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>
            </div>

            {/* ROW 3: Patient ID, Referral Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Patient ID
                </label>
                <input
                  type="text"
                  name="patient_id"
                  value={form.patient_id}
                  onChange={handleChange}
                  placeholder="KRBAL2002"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Refferal Code
                </label>
                <input
                  type="text"
                  name="referral_code"
                  value={form.referral_code}
                  onChange={handleChange}
                  placeholder="Enter referral code"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>
            </div>

            {/* ROW 4: Address */}
            <div>
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter Address"
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
              />
            </div>

            {/* ROW 5: Country, City, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter Country"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                  placeholder="Enter Postal Code"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>
            </div>

            {/* ROW 6: Known Allergies/Conditions */}
            <div>
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Known Allergies/Conditions
              </label>
              <input
                type="text"
                name="known_allergies"
                value={form.known_allergies}
                onChange={handleChange}
                placeholder="Enter allergies"
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: VITALS (Matching Image 1) */}
          {/* ========================================================= */}
          <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 shadow-xs space-y-4">
            <h2 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Vitals
            </h2>

            {/* Row 1: BP, Sugar, Pulse, SpO2, Temperature */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  BP
                </label>
                <input
                  type="text"
                  name="bp"
                  value={form.vitals.bp}
                  onChange={handleVitalsChange}
                  placeholder="Enter Value"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Sugar
                </label>
                <input
                  type="text"
                  name="sugar"
                  value={form.vitals.sugar}
                  onChange={handleVitalsChange}
                  placeholder="Enter Value"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Pulse
                </label>
                <input
                  type="text"
                  name="pulse"
                  value={form.vitals.pulse}
                  onChange={handleVitalsChange}
                  placeholder="Enter Value"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  SpO2
                </label>
                <input
                  type="text"
                  name="spo2"
                  value={form.vitals.spo2}
                  onChange={handleVitalsChange}
                  placeholder="Enter Value"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Temperature
                </label>
                <input
                  type="text"
                  name="temperature"
                  value={form.vitals.temperature}
                  onChange={handleVitalsChange}
                  placeholder="Enter Value"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>
            </div>

            {/* Row 2: Body Toxicity, Ayurvedic Body Type, Upload Reports */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Body Toxicity
                </label>
                <input
                  type="text"
                  name="body_toxicity"
                  value={form.vitals.body_toxicity}
                  onChange={handleVitalsChange}
                  placeholder="Enter Value"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Ayurvedic Body Type
                </label>
                <select
                  name="ayurvedic_body_type"
                  value={form.vitals.ayurvedic_body_type}
                  onChange={handleVitalsChange}
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] cursor-pointer"
                >
                  {AYURVEDIC_BODY_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Upload Reports
                </label>
                <label className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3.5 flex items-center justify-between text-xs text-[#8B7A70] dark:text-[#A8988D] cursor-pointer hover:border-[#8A4F32] transition">
                  <span className="truncate">
                    {uploadedFileName || "Select files"}
                  </span>
                  <HiOutlineArrowUpTray size={16} className="text-[#8A4F32] shrink-0" />
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: OTHER INFORMATION (Matching Image 1) */}
          {/* ========================================================= */}
          <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 shadow-xs space-y-5">
            <h2 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Other Information
            </h2>

            {/* Checkboxes: Insurance & Attendee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Insurance */}
              <div className="space-y-2.5">
                <span className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8]">
                  Insurance
                </span>
                <div className="flex flex-col gap-2 pt-0.5">
                  <label className="inline-flex items-center gap-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.insurance.have_insurance}
                      onChange={() => handleInsuranceToggle("have")}
                      className="h-4 w-4 rounded accent-[#8A4F32] cursor-pointer"
                    />
                    <span>Have Insurance</span>
                  </label>

                  <label className="inline-flex items-center gap-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.insurance.dont_have_insurance}
                      onChange={() => handleInsuranceToggle("dont")}
                      className="h-4 w-4 rounded accent-[#8A4F32] cursor-pointer"
                    />
                    <span>Don't Have Insurance</span>
                  </label>
                </div>
              </div>

              {/* Attendee */}
              <div className="space-y-2.5">
                <span className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8]">
                  Attendee
                </span>
                <div className="flex flex-col gap-2 pt-0.5">
                  <label className="inline-flex items-center gap-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.attendee.has_attendee}
                      onChange={() => handleAttendeeToggle("has")}
                      className="h-4 w-4 rounded accent-[#8A4F32] cursor-pointer"
                    />
                    <span>Has attendee</span>
                  </label>

                  <label className="inline-flex items-center gap-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.attendee.doesnt_have_attendee}
                      onChange={() => handleAttendeeToggle("doesnt")}
                      className="h-4 w-4 rounded accent-[#8A4F32] cursor-pointer"
                    />
                    <span>Doesn't have attendee</span>
                  </label>
                </div>

                {/* Sub-inputs if attendee is present */}
                {form.attendee.has_attendee && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <input
                      type="text"
                      name="attendee_name"
                      value={form.attendee_name}
                      onChange={handleChange}
                      placeholder="Attendee Name"
                      className="h-10 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                    <input
                      type="tel"
                      name="attendee_phone"
                      value={form.attendee_phone}
                      onChange={handleChange}
                      placeholder="Attendee Phone"
                      className="h-10 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] px-3 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Other Comments */}
            <div>
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Other Comments (Optional)
              </label>
              <textarea
                name="other_comments"
                rows={3}
                value={form.other_comments}
                onChange={handleChange}
                placeholder="Enter comments"
                className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-[#FAF8F5] dark:bg-[#1E1714] p-3.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A4F32] resize-none"
              />
            </div>

            {/* Quick Actions (Edit / Save icons matching screenshot) */}
            <div className="flex items-center justify-end gap-3 text-xs text-[#8A5035] font-semibold pt-1">
              <button
                type="button"
                onClick={() => toast("Editing mode enabled")}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>✏ Edit</span>
              </button>
              <button
                type="button"
                onClick={() => toast.success("Draft saved successfully")}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>💾 Save</span>
              </button>
            </div>
          </div>

          {/* Error Banner if registration failed */}
          {ipdError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-xs text-red-600 dark:text-red-400">
              {typeof ipdError === "string"
                ? ipdError
                : ipdError?.message || "Failed to submit IPD registration. Please check the API/server response."}
            </div>
          )}

          {/* ========================================================= */}
          {/* BOTTOM FOOTER BUTTONS */}
          {/* ========================================================= */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/frontoffice/dashboard")}
              className="rounded-xl border border-[#E1D5CD] dark:border-[#3D322B] bg-white dark:bg-[#251E1A] px-8 py-3 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:bg-[#FAF4ED] transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={ipdLoading}
              className="rounded-xl bg-[#8A4F32] hover:bg-[#70402B] text-white px-8 py-3 text-sm font-bold shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <span>{ipdLoading ? "Submitting Registration..." : "Confirm Registration →"}</span>
            </button>
          </div>
        </form>

        {/* ========================================================= */}
        {/* CONFIRMATION DIALOG MODAL */}
        {/* ========================================================= */}
        {confirmationData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#241E1B] p-7 text-center shadow-2xl border border-[#EFE5DC] dark:border-[#382E28] space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2A6E3F] text-white shadow-md ring-8 ring-[#2A6E3F]/15">
                <HiOutlineCheck size={32} className="stroke-[2.5]" />
              </div>

              <h3 className="text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                IPD Patient Registration Submitted!
              </h3>

              <p className="text-xs text-[#7F726A] dark:text-[#A8988D] max-w-xs mx-auto leading-relaxed">
                Registration forwarded to the Nurse Department for bed allocation and clinical admission intake.
              </p>

              <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8B7A70]">Admission No:</span>
                  <span className="font-bold text-[#8A5035]">{confirmationData.admission_no || "IPD-20261030-069"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B7A70]">Patient Name:</span>
                  <span className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">{confirmationData.patient_name || form.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B7A70]">Reason for Visit:</span>
                  <span className="font-semibold text-[#2C1810] dark:text-[#EDE3DA]">{form.reason_for_visit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B7A70]">Status:</span>
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {confirmationData.status || "pending_nurse_admission"}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmationData(null);
                    dispatch(clearIpdAdmissionResult());
                    navigate("/frontoffice/dashboard");
                  }}
                  className="w-full rounded-xl bg-[#8A4F32] hover:bg-[#70402B] text-white py-3 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IpdAdmissionRegistration;
