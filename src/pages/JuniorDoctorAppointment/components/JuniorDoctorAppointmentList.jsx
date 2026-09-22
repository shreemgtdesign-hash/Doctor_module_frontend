import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    HiOutlineMagnifyingGlass,
    HiOutlineMicrophone,
} from "react-icons/hi2";

import {
    loadJuniorDoctorAppointments,
} from "../../../redux/juniorDoctor/juniorDoctorAppointmentThunk";


const tabs = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Waiting",
        value: "waiting",
    },
    {
        label: "Checked in",
        value: "checked_in",
    },
    {
        label: "Completed",
        value: "completed",
    },
];


const JuniorDoctorAppointmentList = ({
    period = "today",
    onSelectPatient,
}) => {

    const dispatch = useDispatch();


    const {
        appointments,
        appointmentsLoading,
    } = useSelector(
        (state) =>
            state.juniorDoctorAppointment
    );


    const [activeTab, setActiveTab] =
        useState("all");


    const [search, setSearch] =
        useState("");


    // ==========================================
    // LOAD APPOINTMENTS
    // ==========================================

    useEffect(() => {

        if (!appointments?.[period]) {

            dispatch(
                loadJuniorDoctorAppointments(
                    period
                )
            );

        }

    }, [
        dispatch,
        period,
        appointments,
    ]);


    // ==========================================
    // CURRENT API DATA
    // ==========================================

    const appointmentData =
        appointments?.[period];


    const appointmentList =
        appointmentData?.data || [];


    // ==========================================
    // FILTER
    // ==========================================

    const filteredAppointments =
        useMemo(() => {

            let result =
                [...appointmentList];


            // ----------------------------------
            // TAB FILTER
            // ----------------------------------

            if (
                activeTab !== "all"
            ) {

                result =
                    result.filter(
                        (appointment) => {

                            const status =
                                appointment?.status
                                    ?.toLowerCase()
                                    ?.replace(
                                        /\s+/g,
                                        "_"
                                    );

                            return (
                                status ===
                                activeTab
                            );

                        }
                    );

            }


            // ----------------------------------
            // SEARCH
            // ----------------------------------

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            if (searchValue) {

                result =
                    result.filter(
                        (appointment) => {

                            return (

                                appointment?.patient_name
                                    ?.toLowerCase()
                                    .includes(
                                        searchValue
                                    )

                                ||

                                appointment?.patient_code
                                    ?.toLowerCase()
                                    .includes(
                                        searchValue
                                    )

                            );

                        }
                    );

            }


            return result;

        }, [
            appointmentList,
            activeTab,
            search,
        ]);


    // ==========================================
    // TIME
    // ==========================================

    const formatTime = (
        time
    ) => {

        if (!time) {
            return "--";
        }

        const [
            hours,
            minutes,
        ] =
            time.split(":");


        const date =
            new Date();

        date.setHours(
            Number(hours),
            Number(minutes)
        );


        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }
        );

    };


    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (
        status
    ) => {

        switch (
            status?.toLowerCase()
        ) {

            case "waiting":

                return "bg-[#FFF4E5] text-[#8A5A24]";


            case "checked in":
            case "checked_in":

                return "bg-[#EEF9F0] text-[#3E7545]";


            case "completed":

                return "bg-[#F0F0F0] text-[#666666]";


            default:

                return "bg-[#F5F1ED] text-[#6F625A]";
        }

    };


    return (

        <div
            className="
                h-[720px]
                min-h-0
                overflow-hidden
                rounded-[30px]
                border
                border-[#E7DBD3]
                bg-white
            "
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="p-7 pb-4">

                <div className="flex items-start justify-between">

                    <div>

                        <h2
                            className="
                                text-[22px]
                                font-semibold
                                text-[#4B2E2A]
                            "
                        >
                            Today's Appointments
                        </h2>

                        <p
                            className="
                                mt-2
                                text-[14px]
                                text-[#6F625A]
                            "
                        >
                            <span
                                className="
                                    mr-2
                                    inline-block
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-[#4B2E2A]
                                "
                            />

                            {appointmentData?.total ??
                                appointmentList.length}{" "}
                            Patients

                        </p>

                    </div>

                </div>


                {/* SEARCH */}

                <div
                    className="
                        mt-5
                        flex
                        h-[56px]
                        items-center
                        rounded-2xl
                        border
                        border-[#E8DDD4]
                        px-4
                    "
                >

                    <HiOutlineMagnifyingGlass
                        size={21}
                        className="text-[#4D2E23]"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search by patient name or ID"
                        className="
                            ml-3
                            flex-1
                            bg-transparent
                            text-[14px]
                            text-[#4D2E23]
                            outline-none
                        "
                    />

                    <HiOutlineMicrophone
                        size={20}
                        className="text-[#4D2E23]"
                    />

                </div>


                {/* TABS */}

                <div
                    className="
                        mt-4
                        flex
                        gap-2
                        overflow-x-auto
                        hide-scrollbar
                    "
                >

                    {tabs.map(
                        (tab) => (

                            <button
                                key={
                                    tab.value
                                }
                                type="button"
                                onClick={() =>
                                    setActiveTab(
                                        tab.value
                                    )
                                }
                                className={`
                                    whitespace-nowrap
                                    rounded-xl
                                    border
                                    px-5
                                    py-2
                                    text-[13px]
                                    font-medium
                                    transition

                                    ${
                                        activeTab ===
                                        tab.value
                                            ? `
                                                border-[#4B2E2A]
                                                bg-[#FFF8F2]
                                                text-[#4B2E2A]
                                            `
                                            : `
                                                border-[#E8DDD4]
                                                bg-white
                                                text-[#4B2E2A]
                                            `
                                    }
                                `}
                            >
                                {tab.label}
                            </button>

                        )
                    )}

                </div>

            </div>


            {/* ================================= */}
            {/* APPOINTMENT LIST */}
            {/* ================================= */}

            <div
                className="
                    h-[calc(720px-220px)]
                    overflow-y-auto
                    px-7
                    pb-7
                    hide-scrollbar
                "
            >

                {appointmentsLoading && (
                    <div
                        className="
                            flex
                            h-40
                            items-center
                            justify-center
                            text-[14px]
                            text-[#8B7A70]
                        "
                    >
                        Loading appointments...
                    </div>
                )}


                {!appointmentsLoading &&
                    filteredAppointments.length ===
                        0 && (

                    <div
                        className="
                            flex
                            h-40
                            items-center
                            justify-center
                            text-[14px]
                            text-[#8B7A70]
                        "
                    >
                        No appointments found.
                    </div>

                )}


                <div className="space-y-4">

                    {!appointmentsLoading &&
                        filteredAppointments.map(
                            (appointment) => (

                                <button
                                    key={
                                        appointment.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        onSelectPatient?.(
                                            appointment
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-[#E8DDD4]
                                        bg-white
                                        p-5
                                        text-left
                                        transition
                                        hover:border-[#6A3F2D]
                                        hover:bg-[#FFF8F2]
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                        "
                                    >

                                        <div>

                                            <h3
                                                className="
                                                    text-[18px]
                                                    font-semibold
                                                    text-[#2F2521]
                                                "
                                            >
                                                {
                                                    appointment.patient_name
                                                }
                                            </h3>

                                            <p
                                                className="
                                                    mt-2
                                                    text-[14px]
                                                    text-[#5D4940]
                                                "
                                            >
                                                {
                                                    appointment.patient_age ??
                                                    "--"
                                                }{" "}
                                                Years
                                                {" • "}
                                                {
                                                    appointment.patient_gender ??
                                                    "--"
                                                }
                                            </p>

                                        </div>


                                        <span
                                            className="
                                                rounded-lg
                                                bg-[#FFF5EE]
                                                px-3
                                                py-1.5
                                                text-[13px]
                                                font-semibold
                                                text-[#4B2E2A]
                                            "
                                        >
                                            #
                                            {
                                                appointment.token_no ??
                                                appointment.appointment_no?.slice(
                                                    -2
                                                ) ??
                                                "--"
                                            }
                                        </span>

                                    </div>


                                    <p
                                        className="
                                            mt-3
                                            truncate
                                            text-[12px]
                                            text-[#8B7A70]
                                        "
                                    >
                                        {appointment.reason ||
                                            "General consultation"}
                                    </p>


                                    <div
                                        className="
                                            mt-4
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <span
                                            className={`
                                                rounded-full
                                                px-3
                                                py-1.5
                                                text-[12px]
                                                font-medium
                                                ${getStatusStyle(
                                                    appointment.status
                                                )}
                                            `}
                                        >
                                            {
                                                appointment.status
                                            }
                                        </span>


                                        <span
                                            className="
                                                text-[14px]
                                                font-semibold
                                                text-[#2F2521]
                                            "
                                        >
                                            {
                                                formatTime(
                                                    appointment.slot_time
                                                )
                                            }
                                        </span>

                                    </div>


                                    {/* DOCTOR */}

                                    <p
                                        className="
                                            mt-3
                                            text-[11px]
                                            text-[#8B7A70]
                                        "
                                    >
                                        {
                                            appointment.doctor_name
                                        }
                                    </p>

                                </button>

                            )
                        )}

                </div>

            </div>

        </div>

    );

};


export default JuniorDoctorAppointmentList;