import {
    HiOutlineCalendarDays,
    HiOutlineChevronRight,
} from "react-icons/hi2";

import {
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";


const PendingActions = () => {

    const navigate = useNavigate();


    const pending =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .pendingActions
        );


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


                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-[#E7DBD3]
                        px-3
                        py-2
                        text-[12px]
                        text-[#4B2E2A]
                    "
                >

                    <HiOutlineCalendarDays
                        size={14}
                    />

                    Today

                    <span>⌄</span>

                </button>

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