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
    HiOutlineCalendarDays,
    HiChevronDown,
    HiChevronLeft,
    HiChevronRight,
    HiOutlinePlus,
} from "react-icons/hi2";


import {
    loadFrontOfficeUpcomingAppointments,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import {
    selectFrontOfficeUpcomingAppointments,
    selectFrontOfficeUpcomingAppointmentsLoading,
    selectFrontOfficeUpcomingAppointmentsError,
    selectFrontOfficeUpcomingAppointmentsPage,
    selectFrontOfficeUpcomingAppointmentsTotal,
    selectFrontOfficeUpcomingAppointmentsTotalPages,
    selectFrontOfficeUpcomingAppointmentsShowing,
} from "../../../redux/frontOffice/frontOfficeAppointmentSlice";


const UpcomingAppointmentsList = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // ==========================================
    // REDUX DATA
    // ==========================================

    const appointments =
        useSelector(
            selectFrontOfficeUpcomingAppointments
        );

    const loading =
        useSelector(
            selectFrontOfficeUpcomingAppointmentsLoading
        );

    const error =
        useSelector(
            selectFrontOfficeUpcomingAppointmentsError
        );

    const page =
        useSelector(
            selectFrontOfficeUpcomingAppointmentsPage
        );

    const total =
        useSelector(
            selectFrontOfficeUpcomingAppointmentsTotal
        );

    const totalPages =
        useSelector(
            selectFrontOfficeUpcomingAppointmentsTotalPages
        );

    const showing =
        useSelector(
            selectFrontOfficeUpcomingAppointmentsShowing
        );


    // ==========================================
    // PERIOD
    // ==========================================

    const [
        selectedPeriod,
        setSelectedPeriod,
    ] = useState("today");


    const [
        showPeriodMenu,
        setShowPeriodMenu,
    ] = useState(false);


    // ==========================================
    // LOAD APPOINTMENTS
    // ==========================================

    useEffect(() => {

        dispatch(
            loadFrontOfficeUpcomingAppointments({
                period: selectedPeriod,
                page: 1,
                limit: 12,
            })
        );

    }, [
        dispatch,
        selectedPeriod,
    ]);


    // ==========================================
    // PERIOD LABEL
    // ==========================================

    const getPeriodLabel = () => {

        if (
            selectedPeriod === "today"
        ) {
            return "Today";
        }

        if (
            selectedPeriod === "month"
        ) {
            return "This Month";
        }

        return "This Week";
    };


    // ==========================================
    // PERIOD CHANGE
    // ==========================================

    const handlePeriodChange = (
        period
    ) => {

        setSelectedPeriod(
            period
        );

        setShowPeriodMenu(
            false
        );
    };


    // ==========================================
    // PREVIOUS PAGE
    // ==========================================

    const handlePreviousPage = () => {

        if (
            loading ||
            page <= 1
        ) {
            return;
        }


        dispatch(
            loadFrontOfficeUpcomingAppointments({
                period: selectedPeriod,
                page: page - 1,
                limit: 12,
            })
        );
    };


    // ==========================================
    // NEXT PAGE
    // ==========================================

    const handleNextPage = () => {

        if (
            loading ||
            page >= totalPages
        ) {
            return;
        }


        dispatch(
            loadFrontOfficeUpcomingAppointments({
                period: selectedPeriod,
                page: page + 1,
                limit: 12,
            })
        );
    };


    // ==========================================
    // ADD VITALS
    // ==========================================

    const handleAddVitals = (
        appointment
    ) => {

        const appointmentId =
            appointment?.appointment_id ||
            appointment?.id;


        if (!appointmentId) {
            return;
        }


        navigate(
            `/frontoffice/upcoming-appointments/${appointmentId}`
        );
    };


    // ==========================================
    // SHOWING TEXT
    // ==========================================

    const getShowingText = () => {

        if (showing) {
            return showing;
        }


        if (!appointments?.length) {
            return `Showing 0 of ${total}`;
        }


        const start =
            ((page - 1) * 12) + 1;


        const end =
            Math.min(
                page * 12,
                total
            );


        return `Showing ${start} - ${end} of ${total}`;
    };


    return (

        <div
            className="
                min-h-screen
                bg-[#FFFCF9]
                px-6
                py-5
            "
        >

            {/* ====================================== */}
            {/* HEADER */}
            {/* ====================================== */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                "
            >

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            className="
                                text-[24px]
                                leading-none
                                text-[#4B2E2A]
                            "
                        >
                            ←
                        </button>


                        <h1
                            className="
                                text-[22px]
                                font-semibold
                                text-[#2F2926]
                            "
                        >
                            Upcoming Appointments
                        </h1>

                    </div>


                    <p
                        className="
                            mt-2
                            ml-9
                            text-[13px]
                            text-[#81756E]
                        "
                    >
                        {Number(
                            total
                        ).toLocaleString()}{" "}
                        Total Consultations
                    </p>

                </div>


                {/* ================================= */}
                {/* PERIOD DROPDOWN */}
                {/* ================================= */}

                <div
                    className="
                        relative
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            setShowPeriodMenu(
                                (previous) =>
                                    !previous
                            )
                        }
                        className="
                            flex
                            h-9
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-[#E7DBD3]
                            bg-white
                            px-3
                            text-[12px]
                            font-medium
                            text-[#4B2E2A]
                        "
                    >

                        <HiOutlineCalendarDays
                            size={15}
                        />

                        {getPeriodLabel()}

                        <HiChevronDown
                            size={15}
                        />

                    </button>


                    {showPeriodMenu && (

                        <div
                            className="
                                absolute
                                right-0
                                top-11
                                z-50
                                w-[140px]
                                overflow-hidden
                                rounded-xl
                                border
                                border-[#E7DBD3]
                                bg-white
                                py-1
                                shadow-lg
                            "
                        >

                            <PeriodButton
                                label="Today"
                                value="today"
                                selected={
                                    selectedPeriod ===
                                    "today"
                                }
                                onClick={
                                    handlePeriodChange
                                }
                            />


                            <PeriodButton
                                label="This Week"
                                value="week"
                                selected={
                                    selectedPeriod ===
                                    "week"
                                }
                                onClick={
                                    handlePeriodChange
                                }
                            />


                            <PeriodButton
                                label="This Month"
                                value="month"
                                selected={
                                    selectedPeriod ===
                                    "month"
                                }
                                onClick={
                                    handlePeriodChange
                                }
                            />

                        </div>

                    )}

                </div>

            </div>


            {/* ====================================== */}
            {/* ERROR */}
            {/* ====================================== */}

            {error && (

                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-[12px]
                        text-red-600
                    "
                >
                    {typeof error === "string"
                        ? error
                        : error?.message ||
                          "Failed to load upcoming appointments."}
                </div>

            )}


            {/* ====================================== */}
            {/* TOP PAGINATION */}
            {/* ====================================== */}

            <div
                className="
                    mt-7
                    flex
                    items-center
                    justify-end
                    gap-4
                "
            >

                <span
                    className="
                        text-[12px]
                        text-[#6D625C]
                    "
                >
                    {getShowingText()}
                </span>


                <button
                    type="button"
                    disabled={
                        loading ||
                        page <= 1
                    }
                    onClick={
                        handlePreviousPage
                    }
                    className="
                        text-[#4B2E2A]
                        disabled:opacity-30
                    "
                >
                    <HiChevronLeft
                        size={18}
                    />
                </button>


                <button
                    type="button"
                    disabled={
                        loading ||
                        page >= totalPages
                    }
                    onClick={
                        handleNextPage
                    }
                    className="
                        text-[#4B2E2A]
                        disabled:opacity-30
                    "
                >
                    <HiChevronRight
                        size={18}
                    />
                </button>

            </div>


            {/* ====================================== */}
            {/* TABLE */}
            {/* ====================================== */}

            <div
                className="
                    mt-5
                    overflow-hidden
                    rounded-[15px]
                    border
                    border-[#E8DDD6]
                    bg-white
                "
            >

                {/* TABLE HEADER */}

                <div
                    className="
                        grid
                        grid-cols-[1.45fr_1.1fr_.8fr_.8fr_1.1fr_.7fr_1fr]
                        border-b
                        border-[#E8DDD6]
                        bg-[#FFF9F4]
                    "
                >

                    <TableHeader>
                        Patient Details
                    </TableHeader>

                    <TableHeader>
                        Date
                    </TableHeader>

                    <TableHeader>
                        Type
                    </TableHeader>

                    <TableHeader>
                        Time
                    </TableHeader>

                    <TableHeader>
                        Service
                    </TableHeader>

                    <TableHeader>
                        Price
                    </TableHeader>

                    <TableHeader last>
                        Actions
                    </TableHeader>

                </div>


                {/* ================================= */}
                {/* LOADING */}
                {/* ================================= */}

                {loading ? (

                    <div
                        className="
                            py-16
                            text-center
                            text-[13px]
                            text-[#81756E]
                        "
                    >
                        Loading appointments...
                    </div>

                ) : appointments?.length === 0 ? (

                    <div
                        className="
                            py-16
                            text-center
                            text-[13px]
                            text-[#81756E]
                        "
                    >
                        No upcoming appointments found.
                    </div>

                ) : (

                    appointments.map(
                        (
                            appointment,
                            index
                        ) => (

                            <AppointmentRow
                                key={
                                    appointment?.appointment_id ||
                                    appointment?.id ||
                                    index
                                }
                                appointment={
                                    appointment
                                }
                                onAddVitals={
                                    handleAddVitals
                                }
                            />

                        )
                    )

                )}

            </div>

        </div>

    );
};


// ==========================================
// TABLE HEADER
// ==========================================

const TableHeader = ({
    children,
    last = false,
}) => {

    return (

        <div
            className={`
                px-4
                py-4
                text-[12px]
                font-medium
                text-[#4B2E2A]

                ${
                    !last
                        ? "border-r border-[#E8DDD6]"
                        : ""
                }
            `}
        >
            {children}
        </div>

    );
};


// ==========================================
// APPOINTMENT ROW
// ==========================================

const AppointmentRow = ({
    appointment,
    onAddVitals,
}) => {

    const patientName =
        appointment?.patient_name ||
        appointment?.full_name ||
        appointment?.name ||
        "-";


    const patientId =
        appointment?.patient_id ||
        appointment?.patient_code ||
        "-";


    const date =
        appointment?.formatted_date ||
        appointment?.date ||
        "-";


    const time =
        appointment?.time ||
        appointment?.slot_time ||
        "-";


    const appointmentType =
        appointment?.appointment_type ||
        appointment?.type ||
        "-";


    const service =
        appointment?.service_name ||
        appointment?.therapy_name ||
        appointment?.reason_for_visit ||
        appointment?.category ||
        "-";


    const price =
        appointment?.price ??
        appointment?.fee;


    return (

        <div
            className="
                grid
                grid-cols-[1.45fr_1.1fr_.8fr_.8fr_1.1fr_.7fr_1fr]
                border-b
                border-[#EEE4DD]
                last:border-b-0
            "
        >

            {/* PATIENT */}

            <div
                className="
                    border-r
                    border-[#EEE4DD]
                    px-4
                    py-4
                "
            >

                <p
                    className="
                        text-[13px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    {patientName}
                </p>


                <p
                    className="
                        mt-1
                        text-[11px]
                        text-[#81756E]
                    "
                >
                    Patient ID: {patientId}
                </p>

            </div>


            {/* DATE */}

            <div
                className="
                    flex
                    items-center
                    border-r
                    border-[#EEE4DD]
                    px-4
                    py-4
                    text-[12px]
                    text-[#4B2E2A]
                "
            >
                {date}
            </div>


            {/* TYPE */}

            <div
                className="
                    flex
                    items-center
                    border-r
                    border-[#EEE4DD]
                    px-4
                    py-4
                    text-[12px]
                    text-[#4B2E2A]
                "
            >
                {appointmentType}
            </div>


            {/* TIME */}

            <div
                className="
                    flex
                    items-center
                    border-r
                    border-[#EEE4DD]
                    px-4
                    py-4
                    text-[12px]
                    text-[#4B2E2A]
                "
            >
                {time}
            </div>


            {/* SERVICE */}

            <div
                className="
                    flex
                    items-center
                    border-r
                    border-[#EEE4DD]
                    px-4
                    py-4
                    text-[12px]
                    text-[#4B2E2A]
                "
            >
                <span
                    className="
                        line-clamp-2
                    "
                >
                    {service}
                </span>
            </div>


            {/* PRICE */}

            <div
                className="
                    flex
                    items-center
                    border-r
                    border-[#EEE4DD]
                    px-4
                    py-4
                    text-[12px]
                    font-semibold
                    text-[#4B2E2A]
                "
            >
                {price !== undefined &&
                price !== null &&
                price !== ""
                    ? `₹${price}`
                    : "-"}
            </div>


            {/* ACTION */}

            <div
                className="
                    flex
                    items-center
                    justify-center
                    px-3
                    py-4
                "
            >

                <button
                    type="button"
                    onClick={() =>
                        onAddVitals(
                            appointment
                        )
                    }
                    className="
                        flex
                        items-center
                        gap-1.5
                        whitespace-nowrap
                        rounded-full
                        border
                        border-[#E7DBD3]
                        bg-white
                        px-3.5
                        py-2
                        text-[11px]
                        font-medium
                        text-[#4B2E2A]
                        transition
                        hover:bg-[#FFF5ED]
                    "
                >

                    <HiOutlinePlus
                        size={14}
                    />

                    {appointment?.action_label ||
                        "+ Add Vitals"}

                </button>

            </div>

        </div>

    );
};


// ==========================================
// PERIOD BUTTON
// ==========================================

const PeriodButton = ({
    label,
    value,
    selected,
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={() =>
                onClick(value)
            }
            className={`
                flex
                w-full
                px-4
                py-2.5
                text-left
                text-[12px]
                transition
                hover:bg-[#FFF5ED]

                ${
                    selected
                        ? "bg-[#FFF5ED] font-semibold text-[#8A4F32]"
                        : "text-[#4B2E2A]"
                }
            `}
        >
            {label}
        </button>

    );
};


export default UpcomingAppointmentsList;