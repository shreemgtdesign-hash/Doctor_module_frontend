import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineBell, HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useTheme } from "../../../context/ThemeContext";

const PatientHeader = ({ profile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const patientName =
    profile?.name ||
    profile?.patient_name ||
    JSON.parse(localStorage.getItem("user") || "{}")?.name ||
    "Kriti";

  const navItems = [
    { label: "Home", path: "/patient/dashboard" },
    { label: "Appointments", path: "/patient/appointments" },
    { label: "Wellness", path: "/patient/wellness" },
    { label: "Services", path: "/patient/services" },
    { label: "Profile", path: "/patient/profile" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EFE5DC] dark:border-[#382E28] bg-[#FFFDFB] dark:bg-[#1E1714] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Left: Avatar & Hospital Branding / Greeting */}
          <div
            onClick={() => navigate("/patient/dashboard")}
            className="flex items-center gap-3.5 cursor-pointer select-none"
          >
            {/* User Avatar Circle */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE3D8] dark:bg-[#34241C] text-[#6A3F2D] dark:text-[#EDE3DA] overflow-hidden shadow-xs">
              {profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={patientName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-base font-bold">
                  {patientName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Greeting Header */}
            <div>
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[2px] text-[#8C7D73] dark:text-[#A8988D]">
                Shree Ayurveda Hospital
              </p>
              <h1
                className="text-[17px] sm:text-[20px] font-normal italic text-[#4D2E23] dark:text-[#EDE3DA] leading-tight"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Namaste {patientName}
              </h1>
            </div>
          </div>

          {/* Center Navigation Links (Matching Image 1) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/patient/dashboard" && location.pathname === "/patient/home") ||
                (item.label === "Appointments" &&
                  (location.pathname.startsWith("/patient/book-appointment") ||
                    location.pathname.startsWith("/patient/doctor") ||
                    location.pathname.startsWith("/patient/appointments")));

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`text-[14.5px] font-medium transition cursor-pointer relative py-1.5 ${
                    isActive
                      ? "text-[#4D2E23] dark:text-[#EDE3DA] font-bold"
                      : "text-[#7F726A] dark:text-[#A8988D] hover:text-[#4D2E23] dark:hover:text-[#EDE3DA]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4D2E23] dark:bg-[#C59B82] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Theme Toggle & Notification Bell Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] text-[#6F4432] dark:text-[#EDE3DA] hover:bg-[#FAF4ED] dark:hover:bg-[#2C231F] transition shadow-2xs cursor-pointer"
              title="Toggle theme"
            >
              {isDarkMode ? <HiOutlineSun size={19} /> : <HiOutlineMoon size={19} />}
            </button>

            {/* Notification Bell Circle */}
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#EFE5DC] dark:border-[#382E28] bg-[#F7EFE9] dark:bg-[#2C231F] text-[#4D2E23] dark:text-[#EDE3DA] hover:bg-[#EFE3D8] transition shadow-2xs cursor-pointer"
              title="Notifications"
            >
              <HiOutlineBell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D32F2F] ring-2 ring-[#F7EFE9]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PatientHeader;

