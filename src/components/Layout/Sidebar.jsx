import { AnimatePresence, motion } from "framer-motion";

import {
    HiHome,
    HiOutlineCalendar,
    HiOutlineCog,
    HiOutlineSupport,
    HiChevronLeft,
} from "react-icons/hi";

import { NavLink } from "react-router-dom";

import {
    FaChartBar,
    FaUserFriends,
    FaBed,
    FaHospital,
    FaAmbulance,
    FaExclamationTriangle,
    FaNotesMedical,
} from "react-icons/fa";


// ==========================================
// PHARMACIST MENU
// ==========================================

const pharmacistMenu = [
    {
        name: "Dashboard",
        icon: HiHome,
        path: "/pharmacist/dashboard",
    },
    {
        name: "Appointments",
        icon: HiOutlineCalendar,
        path: "/pharmacist/appointments",
    },
];


// ==========================================
// DOCTOR MENU
// ==========================================

const doctorMenu = [
    {
        name: "Dashboard",
        icon: HiHome,
        path: "/doctordashboard",
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


// ==========================================
// SIDEBAR
// ==========================================

const Sidebar = ({
    isOpen,
    setIsOpen,
    role = "doctor",
}) => {

    // Choose menu based on role
    const currentMenu =
        role === "pharmacist"
            ? pharmacistMenu
            : doctorMenu;


    return (

        <AnimatePresence>

            {isOpen && (

                <>

                    {/* ================================= */}
                    {/* Overlay */}
                    {/* ================================= */}

                    <motion.div
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.45 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="
                            fixed
                            inset-0
                            z-40
                            bg-black/30
                        "
                    />


                    {/* ================================= */}
                    {/* Sidebar */}
                    {/* ================================= */}

                    <motion.aside
                        initial={{ x: -420 }}
                        animate={{ x: 0 }}
                        exit={{ x: -420 }}
                        transition={{
                            duration: 0.35,
                            ease: "easeOut",
                        }}
                        className="
                            fixed
                            left-0
                            top-0
                            z-50
                            flex
                            h-screen
                            w-[360px]
                            flex-col
                            overflow-hidden
                            rounded-tr-[34px]
                            rounded-br-[34px]
                            bg-white
                            shadow-[0_10px_35px_rgba(0,0,0,0.12)]
                        "
                    >

                        {/* ================================= */}
                        {/* Logo */}
                        {/* ================================= */}

                        <div className="relative flex h-[105px] items-center px-8">

                            <div className="h-16 w-16 rounded-lg" />

                            <div>

                                <h2 className="text-[22px] font-bold text-[#7A4A33]">
                                    Shree
                                </h2>

                                <p className="text-[20px] font-semibold text-[#7A4A33]">
                                    Ayurvedic
                                </p>

                            </div>


                            {/* Close */}
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="
                                    absolute
                                    right-0
                                    top-0
                                    flex
                                    h-[72px]
                                    w-[72px]
                                    items-center
                                    justify-center
                                    rounded-bl-[30px]
                                    bg-[#FFF6F1]
                                "
                            >
                                <HiChevronLeft
                                    size={24}
                                    className="text-[#6A3F2D]"
                                />
                            </button>

                        </div>


                        {/* ================================= */}
                        {/* Menu */}
                        {/* ================================= */}

                        <div className="flex-1 overflow-y-auto px-7 pt-6 pb-8">

                            <nav className="flex flex-col">

                                {currentMenu.map((item) => {

                                    const Icon = item.icon;

                                    return (

                                        <NavLink
                                            key={item.name}
                                            to={item.path}
                                            onClick={() =>
                                                setIsOpen(false)
                                            }
                                        >

                                            {({ isActive }) => (

                                                <div
                                                    className={`
                                                        mb-4
                                                        flex
                                                        h-14
                                                        w-full
                                                        items-center
                                                        rounded-[20px]
                                                        px-5
                                                        transition-all
                                                        duration-200

                                                        ${
                                                            isActive
                                                                ? "border border-[#6A3F2D] bg-[#FFF9F5]"
                                                                : "hover:bg-[#FAF7F4]"
                                                        }
                                                    `}
                                                >

                                                    <Icon
                                                        size={24}
                                                        className="text-[#6A3F2D]"
                                                    />

                                                    <span
                                                        className="
                                                            ml-4
                                                            text-[18px]
                                                            font-medium
                                                            text-[#4D2E23]
                                                        "
                                                    >
                                                        {item.name}
                                                    </span>

                                                </div>

                                            )}

                                        </NavLink>

                                    );

                                })}

                            </nav>

                        </div>

                    </motion.aside>

                </>

            )}

        </AnimatePresence>

    );
};

export default Sidebar;