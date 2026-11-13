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
} from "../../../redux/juniorDoctor/JuniorDoctorAppointmentThunk";

import {
    clearSelectedPatient,
} from "../../../redux/consultation/consultationSlice";

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
    {
        label: "IPD",
        value: "ipd",
    },
];


const JuniorDoctorAppointmentList = ({
    period = "today",
    onSelectPatient,
}) => {

    const dispatch = useDispatch();

    const [
    selectedPatientId,
    setSelectedPatientId,
] = useState(null);
    const {
        appointments,
        appointmentsLoading,
    } = useSelector(
        (state) =>
            state.juniorDoctorAppointment
    );

    const {
        selectedPatient,
    } = useSelector(
        (state) =>
            state.consultation
    );


    const [activeTab, setActiveTab] =
        useState("all");


    const [search, setSearch] =
        useState("");


    // ==========================================
    // LOAD APPOINTMENTS
    // ==========================================

    useEffect(() => {

        dispatch(
            loadJuniorDoctorAppointments({
                period,
                status: activeTab === "all" ? "" : activeTab,
            })
        );

    }, [
        dispatch,
        period,
        activeTab,
    ]);


    // ==========================================
    // CURRENT API DATA
    // ==========================================

    const appointmentData =
        appointments?.[period];


    const appointmentList =
        appointmentData?.data || [];


    // ==========================================
    // SYNC SELECTION WITH APPOINTMENT LIST
    // ==========================================

    useEffect(() => {
        setSelectedPatientId(selectedPatient?.id || null);
    }, [selectedPatient?.id]);

    useEffect(() => {
        if (appointmentsLoading) {
            return;
        }

        // When there are no appointments for the current period, clear stale selection
        if (appointmentList.length === 0) {
            if (selectedPatient) {
                dispatch(clearSelectedPatient());
            }
            setSelectedPatientId(null);
            return;
        }

        // When appointments exist, ensure the selected patient belongs to this list
        if (selectedPatient) {
            const patientExists = appointmentList.some(
                (apt) =>
                    apt.id === selectedPatient?.id ||
                    (selectedPatient?.admission_id && apt.admission_id === selectedPatient.admission_id) ||
                    (selectedPatient?.appointment_no && apt.appointment_no === selectedPatient.appointment_no)
            );
            if (!patientExists) {
                dispatch(clearSelectedPatient());
                setSelectedPatientId(null);
            }
        }
    }, [
        appointmentsLoading,
        appointmentList,
        selectedPatient,
        dispatch,
    ]);


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

                            if (activeTab === "ipd") {
                                return isIpdPatient(appointment);
                            }

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
    // TIME FORMATTER (SAFE & RESILIENT)
    // ==========================================

    const formatTime = (time) => {
        if (!time || typeof time !== "string") {
            return "--";
        }

        const clean = time.trim();
        if (
            !clean ||
            clean === "null" ||
            clean === "undefined" ||
            clean === "Invalid Date"
        ) {
            return "--";
        }

        // If already formatted like "10:30 AM" or "09:15 PM"
        if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(clean)) {
            return clean.toUpperCase();
        }

        // Standard time string "HH:mm" or "HH:mm:ss"
        if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(clean)) {
            const [hoursStr, minutesStr] = clean.split(":");
            const hours = Number(hoursStr);
            const minutes = Number(minutesStr);
            if (
                !isNaN(hours) &&
                !isNaN(minutes) &&
                hours >= 0 &&
                hours < 24 &&
                minutes >= 0 &&
                minutes < 60
            ) {
                const h = hours % 12 || 12;
                const ampm = hours >= 12 ? "PM" : "AM";
                const m = String(minutes).padStart(2, "0");
                return `${h}:${m} ${ampm}`;
            }
        }

        // ISO or parseable Date string with time
        try {
            // Ignore date-only strings like "2026-11-12"
            if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
                return "--";
            }
            const date = new Date(clean);
            if (!isNaN(date.getTime())) {
                return date.toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                });
            }
        } catch {
            // fallback
        }

        return "--";
    };

    // ==========================================
    // CHECK IF PATIENT IS IPD
    // ==========================================

    const isIpdPatient = (appointment) => {
        if (!appointment) return false;
        const status = appointment.status?.toLowerCase() || "";
        const patientType = (
            appointment.patient_type ||
            appointment.type ||
            appointment.appointment_type ||
            ""
        ).toLowerCase();

        return (
            Boolean(appointment.is_ipd) ||
            patientType === "ipd" ||
            patientType === "inpatient" ||
            Boolean(appointment.admission_id) ||
            Boolean(appointment.admission_no) ||
            Boolean(appointment.room_number) ||
            Boolean(appointment.room_no) ||
            Boolean(appointment.ward) ||
            status === "admitted" ||
            status === "admission" ||
            status === "inpatient"
        );
    };

    // ==========================================
    // APPOINTMENT TIME / IPD DISPLAY
    // ==========================================

    const getAppointmentTimeDisplay = (appointment) => {
        if (!appointment) return "--";

        if (isIpdPatient(appointment)) {
            const room = appointment.room_number || appointment.room_no;
            if (room) {
                return String(room).toLowerCase().startsWith("rm")
                    ? String(room)
                    : `Rm ${room}`;
            }
            return "IPD";
        }

        const slot =
            appointment.slot_time ||
            appointment.appointment_time ||
            appointment.time;

        return formatTime(slot);
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


            case "admitted":
            case "admission":
            case "ipd":
            case "inpatient":

                return "bg-[#FFF0E6] text-[#8B5037] border border-[#F0D5C3]";


            default:

                return "bg-[#F5F1ED] text-[#6F625A]";
        }

    };


    const getPeriodLabel = () => {
        switch (period) {
            case "week":
                return "Weekly Appointments";
            case "month":
                return "Monthly Appointments";
            case "all":
                return "All Appointments";
            case "today":
            default:
                return "Today's Appointments";
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
                            {getPeriodLabel()}
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
                                    onClick={() => {

    setSelectedPatientId(
        appointment.id
    );

    onSelectPatient?.(
        appointment
    );

}}
                                    className={`
    w-full
    rounded-2xl
    border
    p-5
    text-left
    transition-all
    duration-200

    ${
        selectedPatientId === appointment.id
            ? `
                border-[#8B5037]
                bg-[#FFF0E4]
                shadow-[0_4px_14px_rgba(139,80,55,0.12)]
            `
            : `
                border-[#E8DDD4]
                bg-white
                hover:border-[#6A3F2D]
                hover:bg-[#FFF8F2]
            `
    }
`}
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
                                                bg-[#FFF4ED]
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
                                                appointment.token ??
                                                appointment.admission_no?.slice(-3) ??
                                                appointment.appointment_no?.slice(
                                                    -2
                                                ) ??
                                                appointment.patient_code ??
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
                                                getAppointmentTimeDisplay(
                                                    appointment
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