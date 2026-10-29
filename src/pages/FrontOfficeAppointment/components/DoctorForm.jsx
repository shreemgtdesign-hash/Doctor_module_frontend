import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineCamera } from "react-icons/hi";
import toast from "react-hot-toast";
import {
  createFrontOfficeDoctor,
  updateFrontOfficeDoctor,
  loadFrontOfficeDoctors,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SHIFT_TIMING_OPTIONS = [
  "9:00 AM - 6:00 PM",
  "10:00 AM - 7:00 PM",
  "8:00 AM - 5:00 PM",
  "9:00 AM - 2:00 PM",
  "2:00 PM - 8:00 PM",
];

const GENDER_OPTIONS = ["Female", "Male", "Other"];
const EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Visiting", "Consultant"];

const DoctorForm = ({ mode = "add", doctor = null, onBack, onSuccess }) => {
  const dispatch = useDispatch();
  const { creatingDoctor, updatingDoctor } = useSelector(
    (state) => state.frontOfficeAppointment || {}
  );
  const isSaving = creatingDoctor || updatingDoctor;

  const [formData, setFormData] = useState({
    name: "",
    doctor_code: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Female",
    qualification: "",
    specialization: "",
    experience_years: "",
    registration_no: "",
    department: "Panchakarma",
    employment_type: "Full Time",
    languages: "English, Tamil, Kannada",
    about: "",
    consultation_types: {
      in_person: true,
      video_call: true,
      home_visit: true,
    },
    fee_in_person: 800,
    fee_video_call: 600,
    fee_home_visit: 1200,
    working_days: ["Mon", "Tue", "Thu", "Fri", "Sat"],
    shift_timings: "9:00 AM - 6:00 PM",
    profile_image: null,
  });

  // Prefill in edit mode
  useEffect(() => {
    if (doctor) {
      // Parse working_days
      let wDays = ["Mon", "Tue", "Thu", "Fri", "Sat"];
      if (Array.isArray(doctor.working_days)) {
        wDays = doctor.working_days;
      } else if (typeof doctor.working_days === "string") {
        try {
          const parsed = JSON.parse(doctor.working_days);
          if (Array.isArray(parsed)) wDays = parsed;
        } catch {
          wDays = doctor.working_days.split(",").map((d) => d.trim());
        }
      }

      // Parse languages
      let langs = doctor.languages || "";
      if (Array.isArray(langs)) {
        langs = langs.join(", ");
      }

      // Parse consultation types
      const consultTypes = {
        in_person: true,
        video_call: true,
        home_visit: true,
      };
      if (doctor.consultation_type) {
        const ct = String(doctor.consultation_type).toLowerCase();
        consultTypes.in_person = ct.includes("in-person") || ct.includes("in person");
        consultTypes.video_call = ct.includes("video");
        consultTypes.home_visit = ct.includes("home");
      }

      setFormData({
        name: doctor.name || "",
        doctor_code: doctor.doctor_code || doctor.code || "",
        email: doctor.email || doctor.contact?.email || "",
        phone: doctor.phone || doctor.contact?.phone || doctor.mobile || "",
        dob: doctor.dob ? doctor.dob.split("T")[0] : "",
        gender: doctor.gender || "Female",
        qualification: doctor.qualification || "",
        specialization: doctor.specialization || "",
        experience_years:
          doctor.experience_years !== undefined && doctor.experience_years !== null
            ? doctor.experience_years
            : doctor.experience
            ? parseInt(doctor.experience, 10) || ""
            : "",
        registration_no: doctor.registration_no || "",
        department: doctor.department || "Panchakarma",
        employment_type: doctor.employment_type || "Full Time",
        languages: langs || "English, Tamil, Kannada",
        about: doctor.about || doctor.bio || "",
        consultation_types: consultTypes,
        fee_in_person:
          doctor.fee_in_person !== undefined
            ? Number(doctor.fee_in_person)
            : doctor.consultation_fee
            ? Number(doctor.consultation_fee)
            : 800,
        fee_video_call:
          doctor.fee_video_call !== undefined ? Number(doctor.fee_video_call) : 600,
        fee_home_visit:
          doctor.fee_home_visit !== undefined ? Number(doctor.fee_home_visit) : 1200,
        working_days: wDays,
        shift_timings: doctor.shift_timings || "9:00 AM - 6:00 PM",
        profile_image: doctor.profile_image || null,
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkingDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.working_days.includes(day);
      const nextDays = exists
        ? prev.working_days.filter((d) => d !== day)
        : [...prev.working_days, day];
      return { ...prev, working_days: nextDays };
    });
  };

  const handleConsultationTypeToggle = (typeKey) => {
    setFormData((prev) => ({
      ...prev,
      consultation_types: {
        ...prev.consultation_types,
        [typeKey]: !prev.consultation_types[typeKey],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter doctor name");
      return;
    }

    // Build API payload exactly matching user request
    const payload = {
      name: formData.name.trim(),
      doctor_code: formData.doctor_code.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      dob: formData.dob || undefined,
      gender: formData.gender || undefined,
      qualification: formData.qualification.trim() || undefined,
      specialization: formData.specialization.trim() || undefined,
      experience_years: formData.experience_years ? Number(formData.experience_years) : 0,
      registration_no: formData.registration_no.trim() || undefined,
      department: formData.department.trim() || undefined,
      employment_type: formData.employment_type || undefined,
      languages: formData.languages.trim() || undefined,
      about: formData.about.trim() || undefined,
      fee_in_person: formData.fee_in_person ? Number(formData.fee_in_person) : 800,
      fee_video_call: formData.fee_video_call ? Number(formData.fee_video_call) : 600,
      fee_home_visit: formData.fee_home_visit ? Number(formData.fee_home_visit) : 1200,
      consultation_fee: formData.fee_in_person ? Number(formData.fee_in_person) : 800,
      shift_timings: formData.shift_timings || "9:00 AM - 6:00 PM",
      working_days: formData.working_days,
    };

    // Clean undefined keys
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    if (mode === "edit" && doctor) {
      const doctorId = doctor.id || doctor._id || doctor.doctor_id;
      const result = await dispatch(
        updateFrontOfficeDoctor({
          doctorId,
          data: payload,
        })
      );

      if (!result.error) {
        toast.success("Doctor details updated successfully!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.payload?.message || "Failed to update doctor details.");
      }
    } else {
      const result = await dispatch(createFrontOfficeDoctor(payload));

      if (!result.error) {
        toast.success("Doctor created successfully!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.payload?.message || "Failed to create new doctor.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:text-[#2C1810] transition cursor-pointer"
        >
          <HiOutlineArrowLeft size={18} />
          <span>Go Back</span>
        </button>

        <h2 className="text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
          {mode === "edit" ? "Edit Doctor Details" : "Add New Doctor"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================================================= */}
        {/* SECTION 1: PERSONAL INFORMATION */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 shadow-xs">
          <h3 className="text-[17px] font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-6">
            Personal Information
          </h3>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar Photo Preview */}
            <div className="relative shrink-0">
              <div className="h-28 w-28 rounded-2xl overflow-hidden bg-[#FAF4EF] dark:bg-[#1E1714] border border-[#EFE5DC] dark:border-[#382E28] flex items-center justify-center">
                {formData.profile_image ? (
                  <img
                    src={formData.profile_image}
                    alt={formData.name || "Doctor"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-[#6F4432] dark:text-[#EDE3DA]">
                    {formData.name ? formData.name.replace("Dr. ", "").charAt(0) : "D"}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#8A5035] text-white flex items-center justify-center shadow-md hover:bg-[#70402B] transition cursor-pointer"
                title="Upload Photo"
              >
                <HiOutlineCamera size={16} />
              </button>
            </div>

            {/* Fields Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Dr. Preeti Nagarajan"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
                />
              </div>

              {/* Doctor ID */}
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Doctor ID
                </label>
                <input
                  type="text"
                  name="doctor_code"
                  value={formData.doctor_code}
                  onChange={handleChange}
                  placeholder="e.g. DOC12345"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
                />
              </div>

              {/* Email ID */}
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. p.nagarajan@shreeayurveda.com"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9833400397"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: PROFESSIONAL INFORMATION */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 shadow-xs">
          <h3 className="text-[17px] font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-6">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Qualification */}
            <div>
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. MD (Ayurveda)"
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Panchakarma Specialist"
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
              />
            </div>

            {/* Experience (Years) */}
            <div>
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="e.g. 12"
                min="0"
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
              />
            </div>

            {/* Registration ID */}
            <div>
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Registration ID
              </label>
              <input
                type="text"
                name="registration_no"
                value={formData.registration_no}
                onChange={handleChange}
                placeholder="e.g. AYU/KAR/12345"
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Panchakarma"
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
              />
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Employment Type
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Languages */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Languages Spoken
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g. English, Tamil, Kannada, Sanskrit"
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
              />
            </div>

            {/* About / Bio */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                About / Bio
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={3}
                placeholder="Specialized in detox therapies, pain management and chronic lifestyle disorders."
                className="w-full rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] p-3 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: CONSULTATION INFORMATION */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 shadow-xs">
          <h3 className="text-[17px] font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-6">
            Consultation Information
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Consultation Types Checkboxes */}
            <div className="lg:col-span-5 space-y-3">
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-2">
                Consultation Type
              </label>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consultation_types.in_person}
                    onChange={() => handleConsultationTypeToggle("in_person")}
                    className="h-4 w-4 rounded accent-[#8A5035] cursor-pointer"
                  />
                  <span>In-person</span>
                </label>

                <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consultation_types.video_call}
                    onChange={() => handleConsultationTypeToggle("video_call")}
                    className="h-4 w-4 rounded accent-[#8A5035] cursor-pointer"
                  />
                  <span>Video Call</span>
                </label>

                <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consultation_types.home_visit}
                    onChange={() => handleConsultationTypeToggle("home_visit")}
                    className="h-4 w-4 rounded accent-[#8A5035] cursor-pointer"
                  />
                  <span>Home Visit</span>
                </label>
              </div>
            </div>

            {/* Fee Inputs */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  In-person (₹)
                </label>
                <input
                  type="number"
                  name="fee_in_person"
                  value={formData.fee_in_person}
                  onChange={handleChange}
                  placeholder="800"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Video Call (₹)
                </label>
                <input
                  type="number"
                  name="fee_video_call"
                  value={formData.fee_video_call}
                  onChange={handleChange}
                  placeholder="600"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                  Home Visit (₹)
                </label>
                <input
                  type="number"
                  name="fee_home_visit"
                  value={formData.fee_home_visit}
                  onChange={handleChange}
                  placeholder="1200"
                  className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: SHIFT INFORMATION */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 shadow-xs">
          <h3 className="text-[17px] font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-6">
            Shift Information
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Working Days Checkboxes */}
            <div className="lg:col-span-7 space-y-3">
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-2">
                Working Days
              </label>
              <div className="flex flex-wrap gap-4 sm:gap-5">
                {DAYS_OF_WEEK.map((day) => {
                  const isChecked = formData.working_days.includes(day);
                  return (
                    <label
                      key={day}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleWorkingDayToggle(day)}
                        className="h-4 w-4 rounded accent-[#8A5035] cursor-pointer"
                      />
                      <span>{day}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Shift Timings Dropdown */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-semibold text-[#6C584C] dark:text-[#C5B4A8] mb-1.5">
                Shift Timings
              </label>
              <select
                name="shift_timings"
                value={formData.shift_timings}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-[#EFE5DC] dark:border-[#3D322B] bg-white dark:bg-[#1A1412] px-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035]"
              >
                {SHIFT_TIMING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM ACTION BUTTONS */}
        {/* ========================================================= */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-[#E1D5CD] dark:border-[#3D322B] px-8 py-3 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:bg-[#FAF4ED] dark:hover:bg-[#2C231F] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-[#8A5035] hover:bg-[#70402B] text-white px-8 py-3 text-sm font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Create Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;

