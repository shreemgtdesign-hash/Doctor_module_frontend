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
import { loadHomeVisitDoctors } from "../../../redux/patient/patientThunk";
import { setSelectedHomeVisitDoctor } from "../../../redux/patient/patientSlice";

const BRANCH_OPTIONS = ["All", "West Mambalam", "Women's Speciality Center"];

const PatientBookHomeService = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { homeVisitDoctors, homeVisitDoctorsLoading } = useSelector(
    (state) => state.patient
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [activeFilterChips, setActiveFilterChips] = useState([
    "₹600- ₹1000/h",
    "Available now",
  ]);
  const [profileDoctorModal, setProfileDoctorModal] = useState(null);

  useEffect(() => {
    dispatch(loadHomeVisitDoctors());
  }, [dispatch]);

  const handleRemoveChip = (chipToRemove) => {
    setActiveFilterChips((prev) => prev.filter((c) => c !== chipToRemove));
  };

  // Filter home visit doctors
  const filteredDoctors = (homeVisitDoctors || []).filter((doc) => {
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

    if (selectedBranch !== "All") {
      const branchStr = (doc.branches || "").toLowerCase();
      if (!branchStr.includes(selectedBranch.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const handleSelectDoctor = (doctor) => {
    dispatch(setSelectedHomeVisitDoctor(doctor));
    navigate(`/patient/book-home-service/${doctor.id}`);
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
            Home Visit
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

        {/* Doctors Card Grid (Web Layout: 2 Columns Matching Design) */}
        {homeVisitDoctorsLoading ? (
          <div className="py-20 text-center text-[#8A7D75]">
            Loading home visit specialists...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="py-16 text-center text-[#8A7D75]">
            No home visit doctors found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {filteredDoctors.map((doc) => {
              const feeVal = doc.fee_home_visit || doc.consultation_fee || doc.fee_in_person || 1200;
              const fee = `₹${parseInt(feeVal, 10).toLocaleString()}`;
              const rating = doc.rating || 4.6;
              const exp = doc.experience_years
                ? `${doc.experience_years}y exp.`
                : doc.experience || "10y exp.";
              const nextSlot = doc.next_slot || "Tomorrow, 11:30 AM";

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
                        {fee}
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

                    <p className="text-xs sm:text-[13px] font-semibold text-[#8A5035] dark:text-[#D5A794] truncate">
                      {doc.specialization || "Ayurvedic Specialist"}
                    </p>

                    <p className="text-xs text-[#7F726A] dark:text-[#A8988D] flex items-center justify-center sm:justify-start gap-1">
                      <span>🎓 {doc.qualification || "BAMS"}</span>
                      <span>•</span>
                      <span>{exp}</span>
                    </p>

                    <div className="pt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs font-medium text-[#4D2E23] dark:text-[#C5B4A8]">
                      <HiOutlineClock size={14} className="text-[#8A5035]" />
                      <span>{nextSlot}</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setProfileDoctorModal(doc)}
                      className="flex-1 sm:flex-initial w-full sm:w-[130px] rounded-xl border border-[#E1D5CD] dark:border-[#3D322B] bg-white dark:bg-[#1E1714] hover:bg-[#FAF4ED] dark:hover:bg-[#2C231F] py-2.5 px-3 text-xs font-bold text-[#4D2E23] dark:text-[#EDE3DA] transition cursor-pointer shadow-2xs"
                    >
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectDoctor(doc)}
                      className="flex-1 sm:flex-initial w-full sm:w-[130px] rounded-xl bg-[#6F4432] hover:bg-[#5C3829] text-white py-2.5 px-3 text-xs font-bold transition cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Book Home Visit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Doctor Quick Profile Modal */}
      {profileDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#241E1B] p-6 shadow-2xl border border-[#EFE5DC] dark:border-[#382E28] space-y-4">
            <button
              type="button"
              onClick={() => setProfileDoctorModal(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[#8A7D75] hover:bg-[#FAF4ED] transition cursor-pointer"
            >
              <HiX size={18} />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden bg-[#FAF4EF] shrink-0 border border-[#EFE5DC]">
                {profileDoctorModal.profile_image ? (
                  <img
                    src={profileDoctorModal.profile_image}
                    alt={profileDoctorModal.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-[#6F4432] text-xl">
                    {profileDoctorModal.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {profileDoctorModal.name}
                </h3>
                <p className="text-xs font-semibold text-[#8A5035]">
                  {profileDoctorModal.specialization}
                </p>
                <p className="text-xs text-[#7F726A]">
                  {profileDoctorModal.qualification} • {profileDoctorModal.experience || "10y exp."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#1E1714] p-4 text-xs text-[#6C584C] dark:text-[#C5B4A8] leading-relaxed">
              <p className="font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-1">About Doctor</p>
              {profileDoctorModal.bio ||
                "Senior Ayurvedic Physician specialized in Panchakarma therapies, holistic healing, and personalized healthcare consultations right at your doorstep."}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3">
                <span className="text-[#8A7D75] block">Home Visit Fee</span>
                <span className="font-bold text-[#4D2E23] dark:text-[#EDE3DA] text-sm">
                  ₹{parseInt(profileDoctorModal.fee_home_visit || 1200, 10).toLocaleString()}
                </span>
              </div>
              <div className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3">
                <span className="text-[#8A7D75] block">Shift Timings</span>
                <span className="font-bold text-[#4D2E23] dark:text-[#EDE3DA] text-sm">
                  {profileDoctorModal.shift_timings || "9:00 AM - 6:00 PM"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProfileDoctorModal(null)}
                className="rounded-xl border border-[#E1D5CD] dark:border-[#382E28] px-5 py-2.5 text-xs font-semibold text-[#4D2E23] hover:bg-[#FAF4ED]"
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
                className="rounded-xl bg-[#6F4432] hover:bg-[#5C3829] text-white px-6 py-2.5 text-xs font-bold shadow-xs"
              >
                Book Home Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientBookHomeService;

