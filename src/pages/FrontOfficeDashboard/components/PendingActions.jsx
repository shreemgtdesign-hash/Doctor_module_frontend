import {
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    HiOutlineChevronRight,
} from "react-icons/hi2";

import {
    useNavigate,
} from "react-router-dom";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import {
    loadFrontOfficePendingActions,
} from "../../../redux/frontOffice/frontOfficeDashboardThunk";


const PendingActions = () => {

    const navigate =
        useNavigate();

    const dispatch =
        useDispatch();


    // ==========================================
    // PENDING ACTIONS
    // ==========================================

    const pending =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .pendingActions
        );


    // ==========================================
    // PERIOD
    // ==========================================

    const [period, setPeriod] =
        useState("today");


    // ==========================================
    // PERIOD OPTIONS
    // ==========================================

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
    // PERIOD CHANGE
    // ==========================================

    const handlePeriodChange = (
        newPeriod
    ) => {

        console.log(
            "📅 Pending Actions Period:",
            newPeriod
        );

        setPeriod(
            newPeriod
        );

        dispatch(
            loadFrontOfficePendingActions(
                newPeriod
            )
        );
    };


    // ==========================================
    // ACTIONS
    // ==========================================

    const actions = [

        {
            label: "Appointment Confirmation",

            value:
                pending?.appointment_confirmation ??
                0,

            onClick: () => {
                navigate(
                    "/frontoffice/pending-actions/appointment-confirmations"
                );
            },
        },


        {
            label: "Appointment Reminders",

            value:
                pending?.appointment_reminders ??
                0,

            onClick: () => {
                navigate(
                    "/frontoffice/appointments/reminders"
                );
            },
        },


        {
            label: "Prescriptions",

            value:
                pending?.prescriptions ??
                0,

            onClick: () => {
                navigate(
                    "/frontoffice/prescriptions"
                );
            },
        },


        {
            label: "Home Service Confirmation",

            value:
                pending?.home_service_confirmation ??
                0,

            onClick: () => {
                navigate(
                    "/frontoffice/pending-actions/home-visit-confirmations"
                );
            },
        },


        {
            label: "Therapy Confirmation",

            value:
                pending?.therapy_confirmation ??
                0,

            onClick: () => {
                navigate(
                    "/frontoffice/pending-action/therapy-confirmations"
                );
            },
        },


        {
            label: "Therapy Reminders",

            value:
                pending?.therapy_reminders ??
                0,

            onClick: () => {
                navigate(
                    "/frontoffice/therapies/reminders"
                );
            },
        },


        {
            label: "Online Orders",

            value:
                pending?.online_orders ??
                0,

            onClick: () => {
                navigate(
                    "/frontoffice/pending-actions/online-orders"
                );
            },
        },

    ];


    return (

        <DashboardCard
            className="
                px-5
                pt-5
                pb-4
            "
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <h2
                    className="
                        text-[17px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    Pending Actions
                </h2>


                {/* ================================= */}
                {/* PERIOD DROPDOWN */}
                {/* ================================= */}

                <div
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                    className="
                        shrink-0
                    "
                >

                    <DashboardDropdown
                        value={
                            period
                        }
                        options={
                            periodOptions
                        }
                        onChange={
                            handlePeriodChange
                        }
                    />

                </div>

            </div>


            {/* ================================= */}
            {/* ACTION LIST */}
            {/* ================================= */}

            <div className="mt-4">

                {actions.map(
                    (action) => (

                        <button
                            key={action.label}
                            type="button"
                            onClick={(event) => {

                                event.stopPropagation();

                                action.onClick();

                            }}
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                border-b
                                border-[#EFE4DC]
                                py-4
                                text-left
                                last:border-b-0
                            "
                        >

                            <span
                                className="
                                    flex-1
                                    text-[13px]
                                    font-medium
                                    text-[#4B2E2A]
                                "
                            >
                                {action.label}
                            </span>


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
                                "
                            >
                                {action.value}
                            </span>


                            <HiOutlineChevronRight
                                size={17}
                                className="
                                    text-[#4B2E2A]
                                "
                            />

                        </button>

                    )
                )}

            </div>

        </DashboardCard>

    );

};


export default PendingActions;