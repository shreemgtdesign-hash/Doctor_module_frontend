import { AnimatePresence, motion } from "framer-motion";

import {
    HiHome,
    HiOutlineCalendar,
    HiOutlineCog,
    HiOutlineSupport,
    HiChevronLeft,
    HiOutlineLogout,
} from "react-icons/hi";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
    FaChartBar,
    FaUserFriends,
    FaBed,
    FaHospital,
    FaAmbulance,
    FaExclamationTriangle,
    FaNotesMedical,
} from "react-icons/fa";

import { logout } from "../../redux/auth/authSlice";


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
// THERAPIST MENU
// ==========================================

const therapistMenu = [
    {
        name: "Dashboard",
        icon: HiHome,
        path: "/therapist/dashboard",
    },
    {
        name: "Appointments",
        icon: HiOutlineCalendar,
        path: "/therapist/appointments",
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

const hospitalLogo = "https://res.cloudinary.com/hj1d367n/image/upload/v1787122082/sadop/logo/eupc9h2ibkpwzozw77tu.jpg";
// ==========================================
// SIDEBAR
// ==========================================

const Sidebar = ({
    isOpen,
    setIsOpen,
    role = "doctor",
}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // ==========================================
    // SELECT MENU BASED ON ROLE
    // ==========================================

    let currentMenu = doctorMenu;

    if (role === "pharmacist") {
        currentMenu = pharmacistMenu;
    }

    if (role === "therapist") {
        currentMenu = therapistMenu;
    }


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        // Clear Redux authentication state
        dispatch(logout());

        // Remove EVERYTHING from browser storage
        localStorage.clear();
        sessionStorage.clear();

        // Close sidebar
        setIsOpen(false);

        // Redirect to login
        navigate("/login", {
            replace: true,
        });
    };


    return (

        <AnimatePresence>

            {isOpen && (

                <>

                    {/* ================================= */}
                    {/* OVERLAY */}
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
                    {/* SIDEBAR */}
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
                        {/* LOGO */}
                        {/* ================================= */}

                        {/* ================================= */}
                        {/* LOGO */}
                        {/* ================================= */}

                        <div
                            className="
                              relative
                              flex
                              h-[105px]
                              shrink-0
                              items-center
                              px-2
                         "
                        >

                            {/* Hospital Logo */}

                            <div
                                className="
                                  flex
                                  h-30
                                  w-[230px]
                                  shrink-0
                                  items-center
                                  justify-center
                                  overflow-hidden
                                  rounded-lg
                                  bg-white
                              "
                            >

                                <img
                                    src={hospitalLogo}
                                    alt="Shree Ayurveda Hospital"
                                    className="
                                      h-full
                                      w-full
                                      object-contain
                                  "
                                />

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setIsOpen(false)
                                }
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
                        {/* MENU */}
                        {/* ================================= */}

                        <div className="
                            flex-1
                            overflow-y-auto
                            px-7
                            pt-6
                            pb-4
                        ">

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

                                                        ${isActive
                                                            ? "border border-[#6A3F2D] bg-[#FFF9F5]"
                                                            : "hover:bg-[#FAF7F4]"
                                                        }
                                                    `}
                                                >

                                                    <Icon
                                                        size={24}
                                                        className="
                                                            text-[#6A3F2D]
                                                        "
                                                    />

                                                    <span className="
                                                        ml-4
                                                        text-[18px]
                                                        font-medium
                                                        text-[#4D2E23]
                                                    ">
                                                        {item.name}
                                                    </span>

                                                </div>

                                            )}

                                        </NavLink>

                                    );

                                })}

                            </nav>

                        </div>


                        {/* ================================= */}
                        {/* LOGOUT */}
                        {/* ================================= */}

                        <div className="
                            shrink-0
                            border-t
                            border-[#EFE4DC]
                            bg-white
                            px-7
                            py-5
                        ">

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                    flex
                                    h-14
                                    w-full
                                    items-center
                                    rounded-[20px]
                                    px-5
                                    text-[#B42318]
                                    transition-all
                                    duration-200
                                    hover:bg-[#FFF1F0]
                                "
                            >

                                <HiOutlineLogout
                                    size={24}
                                    className="
                                        text-[#B42318]
                                    "
                                />

                                <span className="
                                    ml-4
                                    text-[18px]
                                    font-medium
                                ">
                                    Logout
                                </span>

                            </button>

                        </div>

                    </motion.aside>

                </>

            )}

        </AnimatePresence>

    );
};

export default Sidebar;