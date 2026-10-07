import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineChevronRight,
} from "react-icons/hi2";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import {
    loadFrontOfficePendingActions,
} from "../../../redux/frontOffice/frontOfficeDashboardThunk";


const PendingActionScreen = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();


    const [period, setPeriod] =
        useState("today");


    const pending = useSelector(
        (state) =>
            state.frontOfficeDashboard
                ?.pendingActions
    );


    const periodOptions = [
        {
            label: "Today",
            value: "today",
        },
        {
            label: "This Week",
            value: "week",
        },
        {
            label: "This Month",
            value: "month",
        },
        {
            label: "Till Date",
            value: "till_date",
        },
    ];


    // ==========================================
    // SCROLL TO TOP
    // ==========================================

    useEffect(() => {

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });

    }, []);


    // ==========================================
    // LOAD PENDING ACTIONS
    // ==========================================

    useEffect(() => {

        dispatch(
            loadFrontOfficePendingActions(
                period
            )
        );

    }, [
        dispatch,
        period,
    ]);


    // ==========================================
    // PERIOD CHANGE
    // ==========================================

    const handlePeriodChange = (
        newPeriod
    ) => {

        setPeriod(newPeriod);

    };


    // ==========================================
    // ACTIONS
    // ==========================================

    const actions = [

        {
            label:
                "Appointment Confirmation",

            value:
                pending?.appointment_confirmation ??
                0,

            description:
                "Confirm pending doctor appointment bookings",

            onClick: () => {

                navigate(
                    "/frontoffice/pending-actions/appointment-confirmations"
                );

            },
        },


        {
            label:
                "Appointment Reminders",

            value:
                pending?.appointment_reminders ??
                0,

            description:
                "Send reminders to patients for upcoming consultations",

            onClick: () => {

                navigate(
                    "/frontoffice/appointments/reminders"
                );

            },
        },


        {
            label:
                "Prescriptions",

            value:
                pending?.prescriptions ??
                0,

            description:
                "Manage and verify prescription workflows",

            onClick: () => {

                navigate(
                    "/frontoffice/prescriptions"
                );

            },
        },


        {
            label:
                "Home Service Confirmation",

            value:
                pending?.home_service_confirmation ??
                0,

            description:
                "Review and approve home healthcare visits",

            onClick: () => {

                navigate(
                    "/frontoffice/pending-actions/home-visit-confirmations"
                );

            },
        },


        {
            label:
                "Therapy Confirmation",

            value:
                pending?.therapy_confirmation ??
                0,

            description:
                "Verify scheduled therapy session appointments",

            onClick: () => {

                navigate(
                    "/frontoffice/pending-action/therapy-confirmations"
                );

            },
        },


        {
            label:
                "Therapy Reminders",

            value:
                pending?.therapy_reminders ??
                0,

            description:
                "Notify patients about their upcoming therapy schedules",

            onClick: () => {

                navigate(
                    "/frontoffice/therapies/reminders"
                );

            },
        },


        {
            label:
                "Online Orders",

            value:
                pending?.online_orders ??
                0,

            description:
                "Track and fulfill pending online medicine orders",

            onClick: () => {

                navigate(
                    "/frontoffice/pending-actions/online-orders"
                );

            },
        },

    ];


    // ==========================================
    // TOTAL COUNT
    // ==========================================

    const totalCount =
        actions.reduce(
            (sum, action) =>
                sum +
                (Number(
                    action.value
                ) || 0),
            0
        );


    return (

        <DashboardLayout
            role="frontoffice"
        >

            <div
                className="
                    min-h-screen
                    w-full
                    bg-[#F7F7F7]
                    px-4
                    py-5
                    sm:px-6
                    sm:py-6
                    lg:px-8
                    lg:py-7
                "
            >

                {/* =================================
                    HEADER SECTION
                ================================= */}

                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-5
                        xl:flex-row
                        xl:items-start
                        xl:justify-between
                    "
                >

                    {/* LEFT SIDE */}

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        {/* BACK BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/frontoffice/dashboard")
                            }
                            aria-label="Go back"
                            className="
                                mt-0.5
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-[#E7DBD3]
                                bg-white
                                text-[#4B2E2A]
                                transition
                                hover:bg-[#F9F5F1]
                            "
                        >

                            <HiOutlineArrowLeft
                                size={17}
                            />

                        </button>


                        {/* TITLE */}

                        <div>

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2.5
                                "
                            >

                                <h1
                                    className="
                                        text-[20px]
                                        font-semibold
                                        leading-tight
                                        text-[#2F2926]
                                        sm:text-[22px]
                                    "
                                >
                                    Pending Actions
                                </h1>


                                <span
                                    className="
                                        rounded-lg
                                        bg-[#FFF0E4]
                                        px-2.5
                                        py-0.5
                                        text-[12px]
                                        font-semibold
                                        text-[#8A4F32]
                                    "
                                >
                                    {totalCount} Total
                                </span>

                            </div>


                            <p
                                className="
                                    mt-2
                                    max-w-[700px]
                                    text-[13px]
                                    leading-5
                                    text-[#8A7A72]
                                "
                            >
                                Review and process
                                pending confirmations,
                                reminders, and requests
                            </p>

                        </div>

                    </div>


                    {/* PERIOD DROPDOWN */}

                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className="
                            shrink-0
                            self-start
                        "
                    >

                        <DashboardDropdown
                            value={period}
                            options={periodOptions}
                            onChange={
                                handlePeriodChange
                            }
                        />

                    </div>

                </div>


                {/* =================================
                    ACTION LIST CARD
                ================================= */}

                <div
                    className="
                        w-full
                        rounded-[15px]
                        border
                        border-[#E8DDD6]
                        bg-white
                        p-3
                        shadow-sm
                        sm:p-5
                    "
                >

                    <div
                        className="
                            divide-y
                            divide-[#EFE4DC]
                        "
                    >

                        {actions.map(
                            (action) => (

                                <button
                                    key={
                                        action.label
                                    }
                                    type="button"
                                    onClick={(
                                        event
                                    ) => {

                                        event.stopPropagation();

                                        action.onClick();

                                    }}
                                    className="
                                        group
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        gap-4
                                        rounded-lg
                                        px-3
                                        py-4
                                        text-left
                                        transition-colors
                                        hover:bg-[#FBF7F4]
                                        sm:px-4
                                        sm:py-4.5
                                    "
                                >

                                    {/* LABEL & DESCRIPTION */}

                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >

                                        <span
                                            className="
                                                block
                                                truncate
                                                text-[14px]
                                                font-medium
                                                text-[#4B2E2A]
                                                transition-colors
                                                group-hover:text-[#8A4F32]
                                                sm:text-[15px]
                                            "
                                        >
                                            {
                                                action.label
                                            }
                                        </span>


                                        <span
                                            className="
                                                mt-1
                                                block
                                                text-[12px]
                                                leading-5
                                                text-[#8A7A72]
                                            "
                                        >
                                            {
                                                action.description
                                            }
                                        </span>

                                    </div>


                                    {/* COUNT & CHEVRON */}

                                    <div
                                        className="
                                            flex
                                            shrink-0
                                            items-center
                                            gap-2.5
                                            sm:gap-3
                                        "
                                    >

                                        <span
                                            className="
                                                min-w-[45px]
                                                rounded-lg
                                                bg-[#FFF0E4]
                                                px-3
                                                py-1
                                                text-center
                                                text-[11px]
                                                font-semibold
                                                text-[#8A4F32]
                                                sm:text-[12px]
                                            "
                                        >
                                            {
                                                action.value
                                            }
                                        </span>


                                        <HiOutlineChevronRight
                                            size={17}
                                            className="
                                                text-[#4B2E2A]
                                                transition-transform
                                                duration-150
                                                group-hover:translate-x-0.5
                                            "
                                        />

                                    </div>

                                </button>

                            )
                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

};


export default PendingActionScreen;