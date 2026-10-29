import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HiArrowRight,
  HiOutlineHeart,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineVideoCamera,
} from "react-icons/hi";
import {
  FaCalendarPlus,
  FaSpa,
  FaHome,
  FaFileAlt,
  FaVideo,
  FaPills,
  FaVial,
  FaUserCheck,
} from "react-icons/fa";
import { GiDroplets, GiMoon, GiLotus, GiHeartBeats } from "react-icons/gi";
import toast from "react-hot-toast";
import PatientHeader from "../components/PatientHeader";
import { loadPatientProfile } from "../../../redux/patient/patientThunk";

const PatientHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profile, profileLoading } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(loadPatientProfile());
  }, [dispatch]);

  const vitals = profile?.vitals || {};
  const wellnessScore = profile?.wellness_score || 82;

  const quickActions = [
    {
      id: "book_appt",
      label: "Book Appt.",
      icon: FaCalendarPlus,
      action: () => navigate("/patient/book-appointment"),
      highlight: true,
    },
    {
      id: "book_therapy",
      label: "Book Therapy",
      icon: GiLotus,
      action: () => navigate("/patient/book-therapy"),
      highlight: true,
    },
    {
      id: "book_home",
      label: "Book Home Svc",
      icon: FaHome,
      action: () => toast("Home Care services available in your area."),
    },
    {
      id: "reports",
      label: "Reports",
      icon: FaFileAlt,
      action: () => toast("Viewing recent laboratory and wellness reports."),
    },
    {
      id: "video_call",
      label: "Video Call",
      icon: FaVideo,
      action: () => toast("Connecting to Ayurvedic Doctor Video Consultation..."),
    },
    {
      id: "medicines",
      label: "Medicines",
      icon: FaPills,
      action: () => toast("Ayurvedic pharmacy and active prescriptions."),
    },
    {
      id: "toxicity_test",
      label: "Toxicity Test",
      icon: FaVial,
      action: () => toast("Ama / Body Toxicity Self-Assessment."),
    },
    {
      id: "body_type_test",
      label: "Body Type Test",
      icon: FaUserCheck,
      action: () => toast("Prakriti (Vata, Pitta, Kapha) dosha analysis."),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] text-[#2C1810] dark:text-[#EDE3DA] font-sans pb-16">
      {/* Top Patient Header */}
      <PatientHeader profile={profile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7 animate-fadeIn">
        {/* ========================================================= */}
        {/* ROW 1: WELLNESS SCORE & QUICK ACTIONS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: WELLNESS SCORE CARD */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#4E2F26] via-[#43271F] to-[#341C15] p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
            {/* Top header & gauge */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[22px] sm:text-[24px] font-bold tracking-tight">
                  Wellness Score
                </h2>
                <p className="text-xs text-white/70 mt-1">
                  Based on recent vitals
                </p>
              </div>

              {/* Gauge Indicator */}
              <div className="relative flex h-16 w-20 flex-col items-center justify-center">
                <div className="text-[22px] font-extrabold tracking-tight">
                  {wellnessScore}%
                </div>
                {/* Arc representation */}
                <div className="absolute inset-0 rounded-t-full border-4 border-t-white/80 border-r-white/80 border-l-white/40 border-b-transparent" />
              </div>
            </div>

            {/* Middle: 5 Vital Stat Badges */}
            <div className="grid grid-cols-5 gap-2 my-5">
              {/* BP */}
              <div className="rounded-2xl bg-white/10 p-2.5 text-center flex flex-col items-center justify-center backdrop-blur-xs">
                <HiOutlineHeart size={16} className="text-[#E5B5A1] mb-1" />
                <span className="text-[10px] uppercase font-bold text-white/70">BP</span>
                <span className="text-xs font-bold mt-0.5">{vitals.bp || "120/80"}</span>
              </div>

              {/* SUGAR */}
              <div className="rounded-2xl bg-white/10 p-2.5 text-center flex flex-col items-center justify-center backdrop-blur-xs">
                <GiDroplets size={16} className="text-[#9BD6F2] mb-1" />
                <span className="text-[10px] uppercase font-bold text-white/70">Sugar</span>
                <span className="text-xs font-bold mt-0.5">{vitals.sugar || "95"}</span>
              </div>

              {/* PULSE */}
              <div className="rounded-2xl bg-white/10 p-2.5 text-center flex flex-col items-center justify-center backdrop-blur-xs">
                <GiMoon size={16} className="text-[#D8B4FE] mb-1" />
                <span className="text-[10px] uppercase font-bold text-white/70">Pulse</span>
                <span className="text-xs font-bold mt-0.5">{vitals.pulse || "74"}</span>
              </div>

              {/* SPO2 */}
              <div className="rounded-2xl bg-white/10 p-2.5 text-center flex flex-col items-center justify-center backdrop-blur-xs">
                <FaSpa size={14} className="text-[#86EFAC] mb-1" />
                <span className="text-[10px] uppercase font-bold text-white/70">SpO2</span>
                <span className="text-xs font-bold mt-0.5">{vitals.spo2 || "98"}</span>
              </div>

              {/* TEMP */}
              <div className="rounded-2xl bg-white/10 p-2.5 text-center flex flex-col items-center justify-center backdrop-blur-xs">
                <GiHeartBeats size={16} className="text-[#FCA5A5] mb-1" />
                <span className="text-[10px] uppercase font-bold text-white/70">Temp.</span>
                <span className="text-xs font-bold mt-0.5">{vitals.temperature || "98.6"}</span>
              </div>
            </div>

            {/* 2 Lower Badges: Body Toxicity & Body Type */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center flex flex-col items-center justify-center backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-white/75">
                  <GiDroplets size={14} className="text-[#9BD6F2]" />
                  <span>Body Toxicity</span>
                </div>
                <span className="text-sm font-bold mt-1">{vitals.body_toxicity || "Mod"}</span>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center flex flex-col items-center justify-center backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-white/75">
                  <GiMoon size={14} className="text-[#D8B4FE]" />
                  <span>Body Type</span>
                </div>
                <span className="text-sm font-bold mt-1">
                  {vitals.ayurvedic_body_type || "Pitta"}
                </span>
              </div>
            </div>

            {/* Bottom Button */}
            <button
              type="button"
              onClick={() => toast("Detailed Vitals & Ayurvedic Insights loaded.")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#4D2E23] py-3 text-[14px] font-bold shadow-sm hover:bg-[#F8EFE8] transition cursor-pointer"
            >
              <span>View Full Wellness Insights</span>
              <HiArrowRight size={16} />
            </button>
          </div>

          {/* RIGHT: QUICK ACTIONS */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <h2 className="text-[19px] sm:text-[20px] font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-3.5">
              Quick Actions
            </h2>

            <div className="grid grid-cols-3 gap-3.5 sm:gap-4 flex-1">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={action.action}
                    className={`rounded-[22px] border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-4 flex flex-col items-center justify-center gap-2.5 transition cursor-pointer shadow-2xs hover:shadow-md hover:border-[#6F4432] dark:hover:border-[#C59B82] group ${
                      action.highlight ? "ring-1 ring-[#6F4432]/15" : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4A2D23] text-white shadow-xs group-hover:scale-105 transition-transform">
                      <IconComponent size={18} />
                    </div>
                    <span className="text-[12px] sm:text-[12.5px] font-bold text-[#3C241B] dark:text-[#EDE3DA] leading-tight text-center">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 2: FULL-WIDTH NEW OFFERING BANNER */}
        {/* ========================================================= */}
        <div className="rounded-[28px] bg-gradient-to-r from-[#533026] via-[#6B4336] to-[#C9A88F] text-white p-7 sm:p-9 shadow-md relative overflow-hidden">
          {/* Decorative motif overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-block rounded-full bg-white/20 backdrop-blur-xs px-3.5 py-1 text-xs font-semibold tracking-wide">
              New Offering
            </span>

            <h3 className="text-[22px] sm:text-[28px] font-bold tracking-tight leading-tight">
              Holistic Healing at Your Fingertips
            </h3>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Explore authentic Ayurvedic therapies, customized consultation packages, and natural healing routines recommended by expert Vaidyas.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate("/patient/book-therapy")}
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#4D2E23] px-6 py-2.5 text-[14px] font-bold shadow-sm hover:bg-[#F8EFE8] transition cursor-pointer"
              >
                <span>Get Started</span>
                <HiArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientHome;

