import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlinePlus,
  HiOutlineArrowUpTray,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineNoSymbol,
  HiOutlineTrash,
} from "react-icons/hi2";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";

import {
  loadFrontOfficeDoctors,
  toggleFrontOfficeDoctorStatus,
  deleteFrontOfficeDoctor,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import DoctorForm from "./DoctorForm";
import DoctorProfileView from "./DoctorProfileView";

const SAMPLE_FALLBACK_DOCTORS = [
  {
    id: "D_7198",
    name: "Dr. Preeti Nagarajan",
    doctor_code: "DOC12345",
    email: "p.nagarajan@shreeayurveda.com",
    phone: "+91 9833400397",
    mobile: "+91 9833400397",
    dob: "1984-12-04",
    gender: "Female",
    qualification: "MD (Ayurveda)",
    specialization: "Panchakarma Specialist",
    experience_years: 12,
    experience: "12 Years",
    registration_no: "AYU/KAR/12345",
    department: "Panchakarma",
    employment_type: "Full Time",
    languages: "English, Tamil, Kannada",
    about: "Specialized in detox therapies, pain management and chronic lifestyle disorders.",
    bio: "Specialized in detox therapies, pain management and chronic lifestyle disorders.",
    fee_in_person: 800,
    fee_video_call: 600,
    fee_home_visit: 1200,
    shift_timings: "9:00 AM - 6:00 PM",
    working_days: ["Mon", "Tue", "Thu", "Fri", "Sat"],
    consultation_type: "In-person, Video call, Home visit",
    is_active: 1,
    profile_image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: "D_1",
    name: "Dr. Jayashree D",
    doctor_code: "DOC001",
    email: "j.d@shreeayurveda.com",
    phone: "+91 9840123456",
    mobile: "+91 9840123456",
    qualification: "BAMS, MD",
    specialization: "Special Children, Autoimmune Disorders, Cancer, Kidney Disorders",
    experience_years: 15,
    experience: "15 Years",
    registration_no: "AYU-2026-8941",
    department: "Kayachikitsa & General Medicine",
    employment_type: "Full Time",
    languages: "English, Hindi, Sanskrit",
    about: "Senior Ayurvedic Physician with 10+ years experience in Panchakarma.",
    bio: "Senior Ayurvedic Physician with 10+ years experience in Panchakarma.",
    fee_in_person: 600,
    fee_video_call: 600,
    fee_home_visit: 1200,
    shift_timings: "9:00 AM - 6:00 PM",
    working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    consultation_type: "In-person, Video call",
    is_active: 1,
    profile_image:
      "https://res.cloudinary.com/hj1d367n/image/upload/v1784635406/sadop/doctors/Dr-D-Jayashree.jpg",
  },
];

const DoctorMaster = ({ initialMode = "list" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: urlDoctorId } = useParams();

  // ==========================================
  // REDUX
  // ==========================================
  const {
    doctors = [],
    loadingDoctors = false,
    togglingDoctor = false,
    deletingDoctor = false,
    error = null,
  } = useSelector((state) => state.frontOfficeAppointment || {});

  // ==========================================
  // LOCAL STATE
  // ==========================================
  const [viewMode, setViewMode] = useState(initialMode); // "list" | "add" | "edit" | "view"
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [search, setSearch] = useState("");

  // ==========================================
  // LOAD DOCTORS
  // ==========================================
  useEffect(() => {
    dispatch(loadFrontOfficeDoctors());
  }, [dispatch]);

  // Sync with URL param if navigated with doctor ID
  useEffect(() => {
    if (urlDoctorId) {
      const allDocs = doctors && doctors.length > 0 ? doctors : SAMPLE_FALLBACK_DOCTORS;
      const match = allDocs.find((d) => String(d.id) === String(urlDoctorId));
      if (match) {
        setSelectedDoctor(match);
      }
    }
  }, [urlDoctorId, doctors]);

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = () => {
      setOpenMenuId(null);
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const activeDoctors = doctors && doctors.length > 0 ? doctors : SAMPLE_FALLBACK_DOCTORS;

  // ==========================================
  // SEARCH FILTER
  // ==========================================
  const filteredDoctors = activeDoctors.filter((doctor) => {
    const value = search.trim().toLowerCase();
    if (!value) return true;

    const languagesStr = Array.isArray(doctor.languages)
      ? doctor.languages.join(" ")
      : typeof doctor.languages === "string"
      ? doctor.languages
      : "";

    return (
      doctor.name?.toLowerCase().includes(value) ||
      doctor.specialization?.toLowerCase().includes(value) ||
      doctor.qualification?.toLowerCase().includes(value) ||
      languagesStr.toLowerCase().includes(value) ||
      doctor.contact?.phone?.toLowerCase().includes(value) ||
      doctor.phone?.toLowerCase().includes(value) ||
      doctor.contact?.email?.toLowerCase().includes(value) ||
      doctor.email?.toLowerCase().includes(value)
    );
  });

  // ==========================================
  // NAVIGATION HANDLERS
  // ==========================================
  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setViewMode("add");
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenMenuId(null);
    setViewMode("edit");
  };

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenMenuId(null);
    setViewMode("view");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  // ==========================================
  // TOGGLE STATUS
  // ==========================================
  const handleToggleStatus = async (doctor) => {
    setOpenMenuId(null);
    await dispatch(toggleFrontOfficeDoctorStatus(doctor.id));
    dispatch(loadFrontOfficeDoctors());
  };

  // ==========================================
  // DELETE DOCTOR
  // ==========================================
  const handleDeleteDoctor = async (doctor) => {
    setOpenMenuId(null);
    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctor.name}?`
    );
    if (!confirmed) return;

    await dispatch(deleteFrontOfficeDoctor(doctor.id));
    dispatch(loadFrontOfficeDoctors());
  };

  return (
    <DashboardLayout role="frontoffice">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6">
        {/* ADD DOCTOR VIEW */}
        {viewMode === "add" && (
          <DoctorForm
            mode="add"
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList();
              dispatch(loadFrontOfficeDoctors());
            }}
          />
        )}

        {/* EDIT DOCTOR VIEW */}
        {viewMode === "edit" && (
          <DoctorForm
            mode="edit"
            doctor={selectedDoctor}
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList();
              dispatch(loadFrontOfficeDoctors());
            }}
          />
        )}

        {/* VIEW DOCTOR PROFILE */}
        {viewMode === "view" && (
          <DoctorProfileView
            doctor={selectedDoctor}
            onBack={handleBackToList}
            onEdit={() => setViewMode("edit")}
          />
        )}

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <div>
            {/* ==========================================
                HEADER
            ========================================== */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/frontoffice/dashboard")}
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#251E1A] text-[#4B2E2A] dark:text-[#EDE3DA] transition hover:bg-[#F9F5F1] dark:hover:bg-[#2E241F]"
                >
                  <HiOutlineArrowLeft size={17} />
                </button>

                <div>
                  <h1 className="text-[24px] font-semibold text-[#292929] dark:text-[#EDE3DA]">
                    Doctor Master
                  </h1>
                  <div className="mt-2 flex items-center gap-2 text-[14px] text-[#4D2E23] dark:text-[#C5B4A8]">
                    <span className="h-2 w-2 rounded-full bg-[#4D2E23] dark:bg-[#C5B4A8]" />
                    {activeDoctors.length} Doctors
                  </div>
                </div>
              </div>

              {/* HEADER BUTTONS */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="flex h-11 items-center gap-2 rounded-xl border border-[#E7D8CC] dark:border-[#382D25] bg-white dark:bg-[#251E1A] px-7 text-[14px] font-semibold text-[#4D2E23] dark:text-[#EDE3DA] transition hover:bg-[#FFF8F3] dark:hover:bg-[#2E241F]"
                >
                  <HiOutlineArrowUpTray size={18} />
                  Import Doctor
                </button>

                <button
                  type="button"
                  onClick={handleAddDoctor}
                  className="flex h-11 items-center gap-2 rounded-xl bg-[#8A5035] px-7 text-[14px] font-semibold text-white transition hover:bg-[#70402B] shadow-xs cursor-pointer"
                >
                  <HiOutlinePlus size={19} />
                  Add Doctor
                </button>
              </div>
            </div>

            {/* ==========================================
                SEARCH
            ========================================== */}
            <div className="mb-4 flex justify-end">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor..."
                className="h-10 w-[280px] rounded-xl border border-[#E7D8CC] dark:border-[#382D25] bg-white dark:bg-[#251E1A] px-4 text-sm text-[#4D2E23] dark:text-[#EDE3DA] outline-none focus:border-[#8A5035] placeholder:text-[#8B7A70]/60"
              />
            </div>

            {/* ==========================================
                ERROR
            ========================================== */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {typeof error === "string"
                  ? error
                  : error?.message || "Failed to load doctors."}
              </div>
            )}

            {/* ==========================================
                TABLE
            ========================================== */}
            <div className="overflow-visible rounded-2xl border border-[#E8D9CD] dark:border-[#382D25] bg-white dark:bg-[#241E1B] shadow-xs">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-[2.2fr_1.4fr_1fr_1.55fr_2fr_68px] border-b border-[#E8D9CD] dark:border-[#382D25] bg-[#FFF9F4] dark:bg-[#2D231E]">
                {[
                  "Doctor Details",
                  "Specialization",
                  "Experience",
                  "Consultation Type",
                  "Contact",
                  "Actions",
                ].map((heading) => (
                  <div
                    key={heading}
                    className="border-r border-[#E8D9CD] dark:border-[#382D25] px-4 py-4 text-[13px] font-semibold text-[#4D2E23] dark:text-[#EDE3DA] last:border-r-0"
                  >
                    {heading}
                  </div>
                ))}
              </div>

              {/* TABLE BODY */}
              {loadingDoctors ? (
                <div className="px-6 py-16 text-center text-[14px] text-[#8B7A70] dark:text-[#A8988E]">
                  Loading doctors...
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="px-6 py-16 text-center text-[14px] text-[#8B7A70] dark:text-[#A8988E]">
                  No doctors found.
                </div>
              ) : (
                filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="relative grid min-h-[86px] grid-cols-[2.2fr_1.4fr_1fr_1.55fr_2fr_68px] border-b border-[#EFE4DC] dark:border-[#382D25] hover:bg-[#FFFDFB] dark:hover:bg-[#2A221E] transition last:border-b-0 cursor-pointer"
                    onClick={() => handleViewProfile(doctor)}
                  >
                    {/* DOCTOR DETAILS */}
                    <div className="flex items-center gap-3 border-r border-[#EFE4DC] dark:border-[#382D25] px-4 py-3">
                      {doctor.profile_image ? (
                        <img
                          src={doctor.profile_image}
                          alt={doctor.name}
                          className="h-10 w-10 shrink-0 rounded-full object-cover border border-[#E8D9CD]"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0EBE7] dark:bg-[#382D25] text-[14px] font-semibold text-[#8A5035] dark:text-[#D5A794]">
                          {doctor.name?.charAt(0)?.toUpperCase() || "D"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-[#4D2E23] dark:text-[#EDE3DA]">
                          {doctor.name || "N/A"}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-[#8B7A70] dark:text-[#A8988E]">
                          {doctor.qualification || "Ayurvedic Physician"}
                          {doctor.doctor_code ? ` • ${doctor.doctor_code}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* SPECIALIZATION */}
                    <div className="flex items-center border-r border-[#EFE4DC] dark:border-[#382D25] px-4 py-3">
                      <span className="text-[14px] font-medium text-[#4D2E23] dark:text-[#EDE3DA] truncate">
                        {doctor.specialization || "N/A"}
                      </span>
                    </div>

                    {/* EXPERIENCE */}
                    <div className="flex items-center border-r border-[#EFE4DC] dark:border-[#382D25] px-4 py-3">
                      <span className="text-[14px] font-medium text-[#4D2E23] dark:text-[#EDE3DA]">
                        {doctor.experience ||
                          (doctor.experience_years
                            ? `${doctor.experience_years} Years`
                            : "N/A")}
                      </span>
                    </div>

                    {/* CONSULTATION TYPE */}
                    <div className="flex items-center border-r border-[#EFE4DC] dark:border-[#382D25] px-4 py-3">
                      <span className="text-[14px] font-medium leading-5 text-[#4D2E23] dark:text-[#EDE3DA] line-clamp-2">
                        {doctor.consultation_type ||
                          "In-person, Video call, Home visit"}
                      </span>
                    </div>

                    {/* CONTACT */}
                    <div className="flex min-w-0 flex-col justify-center border-r border-[#EFE4DC] dark:border-[#382D25] px-4 py-3">
                      <span className="truncate text-[14px] font-medium text-[#4D2E23] dark:text-[#EDE3DA]">
                        {doctor.contact?.phone || doctor.phone || doctor.mobile || "N/A"}
                      </span>
                      <span className="mt-0.5 truncate text-[12px] text-[#8B7A70] dark:text-[#A8988E]">
                        {doctor.contact?.email || doctor.email || "N/A"}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div
                      className="relative flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === doctor.id ? null : doctor.id);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[20px] font-bold text-[#4D2E23] dark:text-[#EDE3DA] hover:bg-[#FFF4EC] dark:hover:bg-[#342923] transition cursor-pointer"
                      >
                        ⋮
                      </button>

                      {/* ACTION MENU */}
                      {openMenuId === doctor.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-3 top-[52px] z-50 w-[210px] overflow-hidden rounded-2xl border border-[#E7D8CC] dark:border-[#3D322B] bg-white dark:bg-[#261E1A] shadow-xl animate-fadeIn"
                        >
                          {/* VIEW PROFILE */}
                          <button
                            type="button"
                            onClick={() => handleViewProfile(doctor)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:bg-[#FFF8F3] dark:hover:bg-[#342923] transition cursor-pointer"
                          >
                            <HiOutlineEye size={18} />
                            View Profile
                          </button>

                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() => handleEditDoctor(doctor)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:bg-[#FFF8F3] dark:hover:bg-[#342923] transition cursor-pointer"
                          >
                            <HiOutlinePencilSquare size={18} />
                            Edit Details
                          </button>

                          {/* TOGGLE STATUS */}
                          <button
                            type="button"
                            disabled={togglingDoctor}
                            onClick={() => handleToggleStatus(doctor)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:bg-[#FFF8F3] dark:hover:bg-[#342923] transition disabled:opacity-50 cursor-pointer"
                          >
                            <HiOutlineNoSymbol size={18} />
                            {doctor.is_active === 0
                              ? "Activate Doctor"
                              : "Deactivate Doctor"}
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            disabled={deletingDoctor}
                            onClick={() => handleDeleteDoctor(doctor)}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50 cursor-pointer"
                          >
                            <HiOutlineTrash size={18} />
                            Delete Doctor
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorMaster;
