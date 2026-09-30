
import {
    HiHome,
    HiOutlineCalendar,
    HiOutlineCog,
    HiOutlineSupport,
    HiChevronLeft,
    HiOutlineLogout,
    HiOutlineUserCircle,
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
    FaUserMd,
    FaClipboardCheck,
    FaFileMedical,
    FaBoxes,
    FaMedkit,
} from "react-icons/fa";

import {
    FaHandHoldingMedical,
    FaPeopleArrows,
} from "react-icons/fa6";

import { logout } from "../../redux/auth/authSlice";


// ==========================================
// HOSPITAL LOGO
// ==========================================

const hospitalLogo =
    "https://res.cloudinary.com/hj1d367n/image/upload/v1787122082/sadop/logo/eupc9h2ibkpwzozw77tu.jpg";


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
const juniorDoctor = [
    {
        name: "Dashboard",
        icon: HiHome,
        path: "/junior-doctor/dashboard",
    },
    {
        name: "Appointments",
        icon: HiOutlineCalendar,
        path: "/junior-doctor/appointments",
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


// ==========================================
// FRONT OFFICE MENU
// ==========================================

const frontOfficeMenu = [
    {
        name: "Dashboard",
        icon: HiHome,
        path: "/frontoffice/dashboard",
    },
    {
        name: "Appointments",
        icon: HiOutlineCalendar,
        path: "/frontoffice/appointments",
    },
    {
        name: "Patients",
        icon: FaUserFriends,
        path: "/frontoffice/patients-table",
    },
    {
        name: "Doctor Master",
        icon: FaUserMd,
        path: "/frontoffice/doctors",
    },
    {
        name: "Pending Actions",
        icon: FaClipboardCheck,
        path: "/frontoffice/pending-actions-screen",
    },
    {
        name: "Therapies",
        icon: FaHandHoldingMedical,
        path: "/frontoffice/therapies",
    },
    {
        name: "Referrals",
        icon: FaPeopleArrows,
        path: "/frontoffice/referral-list",
    },
    {
        name: "Insurance",
        icon: FaFileMedical,
        path: "/frontoffice/insurance-list",
    },
    {
        name: "Packages",
        icon: FaBoxes,
        path: "/frontoffice/packages-list",
    },
    {
        name: "Medical Camps",
        icon: FaHospital,
        path: "/frontoffice/medcamp-calender",
    },
    {
        name: "Medicines",
        icon: FaMedkit,
        path: "/frontoffice/medicines",
    },
    {
        name: "Support",
        icon: HiOutlineSupport,
        path: "/frontoffice/support",
    },
    {
        name: "Profile",
        icon: HiOutlineUserCircle,
        path: "/frontoffice/profile",
    },
    {
        name: "Settings",
        icon: HiOutlineCog,
        path: "/frontoffice/settings",
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

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // ==========================================
    // SELECT MENU BASED ON ROLE
    // ==========================================

    let currentMenu = doctorMenu;

    if (role === "frontoffice") {
        currentMenu = frontOfficeMenu;
    }

    if (role === "pharmacist") {
        currentMenu = pharmacistMenu;
    }

    if (role === "therapist") {
        currentMenu = therapistMenu;
    }
    if (role === "junior-doctor") {
        currentMenu = juniorDoctor;
    }


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        dispatch(logout());

        localStorage.clear();
        sessionStorage.clear();

        setIsOpen(false);

        navigate("/login", {
            replace: true,
        });
    };


    return (
        <>
            {/* ================================= */}
            {/* OVERLAY (Mobile/Tablet only) */}
            {/* ================================= */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/40
                        backdrop-blur-[2px]
                        transition-opacity
                        duration-300
                        lg:hidden
                    "
                />
            )}

            {/* ================================= */}
            {/* FIXED SIDEBAR */}
            {/* ================================= */}
            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    bottom-0
                    z-50
                    flex
                    h-screen
                    w-[280px]
                    flex-col
                    bg-white
                    border-r
                    border-[#EFE4DC]
                    shadow-[4px_0_24px_rgba(70,40,25,0.06)]
                    transition-transform
                    duration-300
                    ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >

                {/* ================================= */}
                {/* LOGO + CLOSE BUTTON */}
                {/* ================================= */}
                <div
                    className="
                        relative
                        flex
                        h-[88px]
                        shrink-0
                        items-center
                        justify-between
                        px-4
                        border-b
                        border-[#EFE4DC]
                    "
                >

                    <div
                        className="
                            flex
                            h-[60px]
                            w-[180px]
                            shrink-0
                            items-center
                            overflow-hidden
                        "
                    >
                        <img
                            src={hospitalLogo}
                            alt="Shree Ayurvedic Hospital"
                            className="
                                h-full
                                w-full
                                object-contain
                            "
                        />
                    </div>

                    {/* CLOSE BUTTON */}
                    {/* <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close Sidebar"
                        title="Close Sidebar"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#FFF6F1]
                            text-[#6A3F2D]
                            hover:bg-[#FFEADA]
                            transition-colors
                        "
                    >
                        <HiChevronLeft size={20} />
                    </button> */}

                </div>


                {/* ================================= */}
                {/* MENU */}
                {/* ================================= */}
                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-3
                        py-4
                        hide-scrollbar
                    "
                >

                    <nav
                        className="
                            flex
                            flex-col
                            gap-1.5
                        "
                    >

                        {currentMenu.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => {
                                        if (
                                            typeof window !== "undefined" &&
                                            window.innerWidth < 1024
                                        ) {
                                            setIsOpen(false);
                                        }
                                    }}
                                >
                                    {({ isActive }) => (
                                        <div
                                            className={`
                                                flex
                                                h-11
                                                w-full
                                                items-center
                                                rounded-xl
                                                px-3.5
                                                transition-all
                                                duration-200
                                                ${
                                                    isActive
                                                        ? "border border-[#7A4933] bg-[#FFF5ED] text-[#7A4933] font-semibold shadow-xs"
                                                        : "text-[#5B3428] hover:bg-[#FAF4EF] font-medium"
                                                }
                                            `}
                                        >
                                            <Icon
                                                size={20}
                                                className={`
                                                    shrink-0
                                                    ${
                                                        isActive
                                                            ? "text-[#7A4933]"
                                                            : "text-[#7D6B63]"
                                                    }
                                                `}
                                            />

                                            <span
                                                className="
                                                    ml-3
                                                    text-[14px]
                                                    truncate
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


                {/* ================================= */}
                {/* LOGOUT */}
                {/* ================================= */}
                <div
                    className="
                        shrink-0
                        border-t
                        border-[#EFE4DC]
                        bg-white
                        px-3
                        py-3.5
                    "
                >

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            flex
                            h-11
                            w-full
                            items-center
                            rounded-xl
                            px-3.5
                            text-[#B42318]
                            transition-all
                            duration-200
                            hover:bg-[#FFF1F0]
                            font-medium
                        "
                    >
                        <HiOutlineLogout
                            size={20}
                            className="shrink-0 text-[#B42318]"
                        />

                        <span
                            className="
                                ml-3
                                text-[14px]
                            "
                        >
                            Logout
                        </span>
                    </button>

                </div>

            </aside>
        </>
    );
};


export default Sidebar;