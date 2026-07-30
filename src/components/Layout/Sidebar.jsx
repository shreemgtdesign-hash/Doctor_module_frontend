import { AnimatePresence, motion } from "framer-motion";
import { HiHome, HiOutlineCalendar, HiOutlineCog, HiOutlineSupport, HiChevronLeft, } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { FaChartBar, FaUserFriends, FaBed, FaHospital, FaAmbulance, FaExclamationTriangle, FaNotesMedical, } from "react-icons/fa";



const menu = [
  {
    name: "Dashboard",
    icon: HiHome,
    path: "/",
    active: true,
  },
  {
    name: "MIS",
    icon: FaChartBar,
    path: "/doctor/mis",
  },
  {
    name: "Appointment",
    icon: HiOutlineCalendar,
    path: "/doctor/appointments",
  },
  {
    name: "OP",
    icon: FaUserFriends,
    path: "/doctor/op",
  },
  {
    name: "IP",
    icon: FaBed,
    path: "/doctor/ip",
  },
  {
    name: "My IP",
    icon: FaHospital,
    path: "/doctor/my-ip",
  },
  {
    name: "Emergency",
    icon: FaAmbulance,
    path: "/doctor/emergency",
  },
  {
    name: "My Emergency",
    icon: FaExclamationTriangle,
    path: "/doctor/my-emergency",
  },
  {
    name: "Discharge",
    icon: FaNotesMedical,
    path: "/doctor/discharge",
  },
  {
    name: "Support",
    icon: HiOutlineSupport,
    path: "/doctor/support",
  },
  {
    name: "Settings",
    icon: HiOutlineCog,
    path: "/doctor/settings",
  },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}

                    <motion.div
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.45 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-40 bg-black/30"
                    />

                    {/* Sidebar */}

                    <motion.aside
                        initial={{ x: -420 }}
                        animate={{ x: 0 }}
                        exit={{ x: -420 }}
                        transition={{
                            duration: 0.35,
                            ease: "easeOut",
                        }}
                        className="fixed left-0 top-0 z-50  h-screen w-[360px] bg-white rounded-tr-[34px] rounded-br-[34px] shadow-[0_10px_35px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col"                    >
                        {/* Logo */}

                        <div className="relative h-[105px] flex items-center px-8">

                            <div className="w-16 h-16 rounded-lg " />

                            <div className="">
                                <h2 className="text-[22px] font-bold text-[#7A4A33]">
                                    Shree
                                </h2>

                                <p className="text-[20px] font-semibold text-[#7A4A33]">
                                    Ayurvedic
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-0 top-0 h-[72px] w-[72px] rounded-bl-[30px] bg-[#FFF6F1] flex items-center justify-center"
                            >
                                <HiChevronLeft
                                    size={24}
                                    className="text-[#6A3F2D]"
                                />
                            </button>


                        </div>


                        <div className="flex-1 overflow-y-auto px-7 pt-6 pb-8">
                            <nav className="flex flex-col">
  {menu.map((item) => (
    <NavLink key={item.name} to={item.path}>
      {({ isActive }) => (
        <button
          className={`
            w-full
            flex items-center
            h-14
            rounded-[20px]
            px-5
            mb-4
            transition-all duration-200
            ${
              isActive
                ? "border border-[#6A3F2D] bg-[#FFF9F5]"
                : "hover:bg-[#FAF7F4]"
            }
          `}
        >
          <div className="mr-4 flex w-10 justify-center">
            <item.icon size={24} className="text-[#6A3F2D]" />
          </div>

          <span className="text-[18px] font-medium text-[#4D2E23]">
            {item.name}
          </span>
        </button>
      )}
    </NavLink>
  ))}
</nav>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;