import { HiOutlineArrowLeft, HiOutlinePencilSquare } from "react-icons/hi2";

const FULL_DAYS_MAP = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const ALL_WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorProfileView = ({ doctor, onBack, onEdit }) => {
  if (!doctor) return null;

  // Normalize working days
  let workingDaysList = ["Mon", "Tue", "Thu", "Fri", "Sat"];
  if (Array.isArray(doctor.working_days)) {
    workingDaysList = doctor.working_days;
  } else if (typeof doctor.working_days === "string") {
    try {
      const parsed = JSON.parse(doctor.working_days);
      if (Array.isArray(parsed)) workingDaysList = parsed;
    } catch {
      workingDaysList = doctor.working_days.split(",").map((d) => d.trim());
    }
  }

  // Active days in full name
  const activeFullDays = workingDaysList.map((d) => FULL_DAYS_MAP[d] || d);

  // Normalize languages
  const languagesDisplay = Array.isArray(doctor.languages)
    ? doctor.languages.join(", ")
    : doctor.languages || "English, Tamil, Kannada";

  // Normalize consultation types
  let consultationTypeDisplay = "In-person, Video call, Home visit";
  if (doctor.consultation_type) {
    consultationTypeDisplay = doctor.consultation_type;
  }

  const shiftTime = doctor.shift_timings || "9:00 AM - 6:00 PM";
  const experienceDisplay =
    doctor.experience ||
    (doctor.experience_years ? `${doctor.experience_years} Years` : "12 Years");

  const feeInPerson =
    doctor.fee_in_person !== undefined
      ? doctor.fee_in_person
      : doctor.consultation_fee !== undefined
      ? doctor.consultation_fee
      : 800;

  const feeVideoCall = doctor.fee_video_call !== undefined ? doctor.fee_video_call : 600;
  const feeHomeVisit = doctor.fee_home_visit !== undefined ? doctor.fee_home_visit : 1200;

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

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8A5035] hover:bg-[#70402B] text-white px-5 py-2 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <HiOutlinePencilSquare size={16} />
            <span>Edit Doctor Details</span>
          </button>
        )}
      </div>

      {/* 2-Column Layout Matching Reference Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: MAIN PROFILE DETAILS (lg:col-span-7 or 8) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 shadow-xs space-y-6">
          {/* Header Banner: Photo + Name + Spec */}
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-[#FAF4EF] dark:bg-[#1E1714] border border-[#EFE5DC] dark:border-[#382E28] flex items-center justify-center shrink-0 shadow-2xs">
              {doctor.profile_image ? (
                <img
                  src={doctor.profile_image}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-[#6F4432] dark:text-[#EDE3DA]">
                  {doctor.name ? doctor.name.replace("Dr. ", "").charAt(0) : "D"}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                {doctor.name}
              </h1>
              <p className="text-xs font-medium text-[#7F726A] dark:text-[#A8988D]">
                {doctor.qualification || "MD (Ayurveda)"}
              </p>
              <div className="pt-0.5">
                <span className="inline-block text-xs font-semibold text-[#0E7090] dark:text-[#38BDF8]">
                  {doctor.specialization || "Panchakarma Specialist"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F2EAE3] dark:border-[#332A24]" />

          {/* Key-Value Details List */}
          <div className="divide-y divide-[#F6EFEA] dark:divide-[#2E241F] text-xs sm:text-[13px]">
            {/* Doctor ID */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">Doctor ID</span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                {doctor.doctor_code || doctor.code || "DOC12345"}
              </span>
            </div>

            {/* Date of Joining */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">Date of Joining</span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                {doctor.date_of_joining ? doctor.date_of_joining.split("T")[0] : "10 Jan, 2020"}
              </span>
            </div>

            {/* Experience */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">Experience</span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                {experienceDisplay}
              </span>
            </div>

            {/* Consultation Type */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">
                Consultation Type
              </span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                {consultationTypeDisplay}
              </span>
            </div>

            {/* Email */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">Email</span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA] break-all">
                {doctor.email || doctor.contact?.email || "p.nagarajan@shreeayurveda.com"}
              </span>
            </div>

            {/* Phone */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">Phone</span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                {doctor.phone || doctor.contact?.phone || doctor.mobile || "+91 9833400397"}
              </span>
            </div>

            {/* Qualification */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">Qualification</span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                {doctor.qualification || "MD (Ayurveda)"}
              </span>
            </div>

            {/* Registration No. */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">
                Registration No.
              </span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                {doctor.registration_no || "AYU/KAR/12345"}
              </span>
            </div>

            {/* Languages Known */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">
                Languages Known
              </span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                {languagesDisplay}
              </span>
            </div>

            {/* Specialization */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">
                Specialization
              </span>
              <span className="sm:col-span-2 font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                {doctor.specialization || "Panchakarma"}
              </span>
            </div>

            {/* About */}
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-medium text-[#8A7D75] dark:text-[#A8988D]">About</span>
              <span className="sm:col-span-2 font-normal text-[#4D2E23] dark:text-[#EDE3DA] leading-relaxed">
                {doctor.about ||
                  doctor.bio ||
                  "Specialized in detox therapies, pain management and chronic lifestyle disorders."}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 3 STACKED CARDS (lg:col-span-5 or 4) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* CARD 1: Work Details */}
          <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">Work Details</h3>

            <div className="space-y-3 text-xs sm:text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#8A7D75] dark:text-[#A8988D]">Employment Type</span>
                <span className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {doctor.employment_type || "Full Time"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#8A7D75] dark:text-[#A8988D]">Department</span>
                <span className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  {doctor.department || "Panchakarma"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#8A7D75] dark:text-[#A8988D]">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] dark:bg-[#1A3324] text-[#1E7E34] dark:text-[#52B775]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E7E34]" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* CARD 2: Shift Timings */}
          <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Shift Timings
            </h3>

            <div className="space-y-2.5 text-xs">
              {ALL_WEEK_DAYS.map((dayName) => {
                const isWorking = activeFullDays.includes(dayName);
                const timing = isWorking
                  ? dayName === "Saturday"
                    ? "9:00 AM - 2:00 PM"
                    : shiftTime
                  : "Weekly Off";

                return (
                  <div key={dayName} className="flex items-center justify-between">
                    <span className="text-[#8A7D75] dark:text-[#A8988D] font-medium">{dayName}</span>
                    <span
                      className={`font-semibold ${
                        isWorking
                          ? "text-[#2C1810] dark:text-[#EDE3DA]"
                          : "text-[#B8ACA3] dark:text-[#7A6D63]"
                      }`}
                    >
                      {timing}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CARD 3: Consultation Fees */}
          <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Consultation Fees
            </h3>

            <div className="space-y-3 text-xs sm:text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#8A7D75] dark:text-[#A8988D]">In-person</span>
                <span className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  ₹{parseInt(feeInPerson, 10).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#8A7D75] dark:text-[#A8988D]">Video Call</span>
                <span className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  ₹{parseInt(feeVideoCall, 10).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#8A7D75] dark:text-[#A8988D]">Home Visit</span>
                <span className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  ₹{parseInt(feeHomeVisit, 10).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileView;

