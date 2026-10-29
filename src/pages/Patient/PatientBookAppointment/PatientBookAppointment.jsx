import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiX,
} from "react-icons/hi";
import { SlidersHorizontal, Mic, Star } from "lucide-react";
import { loadDoctors } from "../../../redux/patient/patientThunk";
import { setSelectedDoctor } from "../../../redux/patient/patientSlice";

const BRANCH_OPTIONS = ["All", "West Mambalam", "Women's Speciality Center"];
const DOCTOR_TYPES = ["All", "Consultation", "Both", "Visiting"];

const PatientBookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { doctors, doctorsLoading } = useSelector((state) => state.patient);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [activeFilterChips, setActiveFilterChips] = useState([
    "₹600 - ₹1000/h",
    "Available now",
  ]);
  const [profileDoctorModal, setProfileDoctorModal] = useState(null);

  useEffect(() => {
    dispatch(loadDoctors());
  }, [dispatch]);

  const handleRemoveChip = (chipToRemove) => {
    setActiveFilterChips((prev) => prev.filter((c) => c !== chipToRemove));
  };

  // Filter doctors locally
  const filteredDoctors = (doctors || []).filter((doc) => {
    // Search query: name, specialization, qualification, branch
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = (doc.name || "").toLowerCase().includes(q);
      const matchSpec = (doc.specialization || "").toLowerCase().includes(q);
      const matchQual = (doc.qualification || "").toLowerCase().includes(q);
      const matchBranch = (doc.branches || "").toLowerCase().includes(q);
      const matchDept = (doc.department || "").toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchQual && !matchBranch && !matchDept) {
        return false;
      }
    }

    // Branch filter
    if (selectedBranch !== "All") {
      const branchStr = (doc.branches || "").toLowerCase();
      if (!branchStr.includes(selectedBranch.toLowerCase())) {
        return false;
      }
    }

    // Doctor Type filter
    if (selectedType !== "All") {
      const typeStr = (doc.doctor_type || "").toLowerCase();
      if (selectedType.toLowerCase() === "both") {
        if (typeStr !== "both") return false;
      } else if (!typeStr.includes(selectedType.toLowerCase()) && typeStr !== "both") {
        return false;
      }
    }

    return true;
  });

  const handleSelectDoctor = (doctor) => {
    dispatch(setSelectedDoctor(doctor));
    navigate(`/patient/book-appointment/${doctor.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] text-[#2C1810] dark:text-[#EDE3DA] font-sans pb-16">
      {/* Top Header / Back Bar */}
      <div className="sticky top-0 z-40 w-full border-b border-[#EFE5DC] dark:border-[#382E28] bg-[#FFFDFB] dark:bg-[#1E1714] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button
              type="button"
              onClick={() => navigate("/patient/dashboard")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:text-[#2C1810] transition cursor-pointer"
            >
              <HiOutlineArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6 animate-fadeIn">
        {/* Title & Available Specialists Count */}
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
            Ayurvedic Practitioners
          </h1>
          <p className="text-xs sm:text-[13px] text-[#7F726A] dark:text-[#A8988D] mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#257A42] inline-block" />
            <span>{filteredDoctors.length} available specialists</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <HiOutlineSearch
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7D75] dark:text-[#A8988D]"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, specialization, or branch"
            className="w-full rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] pl-11 pr-12 py-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] placeholder-[#A8988D] outline-none shadow-xs transition focus:border-[#6F4432] dark:focus:border-[#C59B82]"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7D75] hover:text-[#4D2E23] transition cursor-pointer"
            title="Voice search"
          >
            <Mic size={18} />
          </button>
        </div>

        {/* Filter Chips & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filters Icon Button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] px-4 py-2 text-xs font-semibold text-[#4D2E23] dark:text-[#EDE3DA] shadow-2xs hover:bg-[#FAF4ED] dark:hover:bg-[#2C231F] transition cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* Removable Active Chips */}
          {activeFilterChips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#EADBD0] dark:border-[#382E28] bg-[#FAF3EC] dark:bg-[#2C231F] px-3.5 py-2 text-xs font-medium text-[#4D2E23] dark:text-[#EDE3DA]"
            >
              <span>{chip}</span>
              <button
                type="button"
                onClick={() => handleRemoveChip(chip)}
                className="hover:text-red-600 transition cursor-pointer"
              >
                <HiX size={13} />
              </button>
            </span>
          ))}

          {/* Branch Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto ml-auto">
            {BRANCH_OPTIONS.map((branch) => (
              <button
                key={branch}
                type="button"
                onClick={() => setSelectedBranch(branch)}
                className={`rounded-2xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedBranch === branch
                    ? "bg-[#6F4432] text-white shadow-xs"
                    : "border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] text-[#7F726A] dark:text-[#A8988D] hover:bg-[#FAF4ED]"
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Card Grid (Web Layout: 2 Columns Matching Therapy Design) */}
        {doctorsLoading ? (
          <div className="py-20 text-center text-[#8A7D75]">
            Loading Ayurvedic specialists...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="py-16 text-center text-[#8A7D75]">
            No doctors found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {filteredDoctors.map((doc) => {
              const fee = doc.consultation_fee
                ? `₹${parseInt(doc.consultation_fee, 10).toLocaleString()}`
                : doc.fee_in_person
                ? `₹${parseInt(doc.fee_in_person, 10).toLocaleString()}`
                : "₹600";
              const rating = doc.rating || 4.7;
              const exp = doc.experience_years ? `${doc.experience_years}y exp.` : "Experienced";
              const nextSlot = doc.next_slot || "Available Today, 3:30 PM";

              return (
                <div
                  key={doc.id}
                  className="rounded-[24px] border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs hover:shadow-md hover:border-[#6F4432] dark:hover:border-[#C59B82] transition duration-200"
                >
                  {/* Left: Square Image with Price & Rating Tag */}
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-2xl overflow-hidden bg-[#FAF4EF] dark:bg-[#1E1714] flex items-center justify-center">
                    {doc.profile_image ? (
                      <img
                        src={doc.profile_image}
                        alt={doc.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: doc.profile_image ? "none" : "flex" }}
                      className="h-full w-full items-center justify-center bg-[#EFE5DC] dark:bg-[#382E28] text-2xl font-bold text-[#6F4432] dark:text-[#EDE3DA]"
                    >
                      {doc.name.replace("Dr. ", "").charAt(0)}
                    </div>

                    {/* Price Pill at bottom */}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 rounded-lg bg-white/95 dark:bg-[#1A1412]/95 py-1 text-center shadow-xs">
                      <span className="text-[12px] font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
                        {fee}/h
                      </span>
                    </div>

                    {/* Rating Pill at top right */}
                    <div className="absolute top-1.5 right-1.5 rounded-md bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/60 px-1.5 py-0.5 flex items-center gap-1 shadow-2xs">
                      <Star size={11} className="text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200">
                        {rating}
                      </span>
                    </div>
                  </div>

                  {/* Center: Doctor Information */}
                  <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left w-full">
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <h3 className="text-base sm:text-[17px] font-bold text-[#2C1810] dark:text-[#EDE3DA] truncate">
                        {doc.name}
                      </h3>
                    </div>

                    <p className="text-xs font-semibold text-[#8A5035] dark:text-[#D5A794] line-clamp-1">
                      {doc.specialization}
                    </p>

                    <p className="text-[11px] text-[#7F726A] dark:text-[#A8988D]">
                      🎓 {doc.qualification || "BAMS"} • {exp}
                    </p>

                    {/* Next slot badge */}
                    <div className="pt-1 flex items-center justify-center sm:justify-start gap-1 text-[11px] font-medium text-[#257A42] dark:text-[#52B775]">
                      <HiOutlineClock size={13} />
                      <span className="truncate">{nextSlot}</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setProfileDoctorModal(doc)}
                      className="flex-1 sm:flex-none w-full sm:w-[130px] rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#1E1714] py-2.5 px-3 text-xs font-bold text-[#4D2E23] dark:text-[#EDE3DA] shadow-2xs hover:bg-[#FAF4ED] dark:hover:bg-[#2C231F] transition text-center cursor-pointer"
                    >
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectDoctor(doc)}
                      className="flex-1 sm:flex-none w-full sm:w-[130px] rounded-xl bg-[#6F4432] hover:bg-[#5C3829] text-white py-2.5 px-3 text-xs font-bold shadow-xs transition text-center cursor-pointer"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Doctor Profile Quick Preview Modal */}
      {profileDoctorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setProfileDoctorModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#241E1B] p-6 shadow-2xl border border-[#EFE5DC] dark:border-[#382E28] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-[#FAF4EF] dark:bg-[#1E1714] flex items-center justify-center text-xl font-bold text-[#6F4432]">
                  {profileDoctorModal.profile_image ? (
                    <img
                      src={profileDoctorModal.profile_image}
                      alt={profileDoctorModal.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profileDoctorModal.name.replace("Dr. ", "").charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                    {profileDoctorModal.name}
                  </h3>
                  <p className="text-xs text-[#8A5035] dark:text-[#D5A794] font-semibold">
                    {profileDoctorModal.specialization}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileDoctorModal(null)}
                className="text-[#8A7D75] hover:text-[#4D2E23] p-1 cursor-pointer"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3 bg-[#FAF8F5] dark:bg-[#1E1714]">
                <span className="text-[#8A7D75]">Qualification</span>
                <p className="font-bold text-[#2C1810] dark:text-[#EDE3DA] mt-0.5">
                  {profileDoctorModal.qualification || "BAMS, MD"}
                </p>
              </div>
              <div className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3 bg-[#FAF8F5] dark:bg-[#1E1714]">
                <span className="text-[#8A7D75]">Experience</span>
                <p className="font-bold text-[#2C1810] dark:text-[#EDE3DA] mt-0.5">
                  {profileDoctorModal.experience_years ? `${profileDoctorModal.experience_years} Years` : "Senior Specialist"}
                </p>
              </div>
              <div className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3 bg-[#FAF8F5] dark:bg-[#1E1714]">
                <span className="text-[#8A7D75]">Consultation Fee</span>
                <p className="font-bold text-[#257A42] dark:text-[#52B775] mt-0.5">
                  ₹{parseInt(profileDoctorModal.consultation_fee || "600", 10).toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3 bg-[#FAF8F5] dark:bg-[#1E1714]">
                <span className="text-[#8A7D75]">Languages</span>
                <p className="font-bold text-[#2C1810] dark:text-[#EDE3DA] mt-0.5">
                  {profileDoctorModal.languages || "English, Tamil"}
                </p>
              </div>
            </div>

            {profileDoctorModal.bio && (
              <div className="text-xs text-[#7F726A] dark:text-[#A8988D] bg-[#FAF8F5] dark:bg-[#1E1714] p-3 rounded-xl border border-[#EFE5DC] dark:border-[#382E28]">
                <span className="font-semibold text-[#4D2E23] dark:text-[#EDE3DA] block mb-1">
                  About Physician
                </span>
                {profileDoctorModal.bio}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setProfileDoctorModal(null)}
                className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] px-4 py-2 text-xs font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:bg-[#FAF4ED] transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const doc = profileDoctorModal;
                  setProfileDoctorModal(null);
                  handleSelectDoctor(doc);
                }}
                className="rounded-xl bg-[#6F4432] text-white px-5 py-2 text-xs font-bold hover:bg-[#5C3829] transition shadow-xs cursor-pointer"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientBookAppointment;

