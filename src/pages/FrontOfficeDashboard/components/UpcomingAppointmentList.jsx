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
    HiOutlineCheck,
    HiOutlineArrowPath,
    HiArrowLeft,
} from "react-icons/hi2";

import {
    loadFrontOfficeUpcomingAppointments,
    checkInFrontOfficeAppointment,
    checkOutFrontOfficeAppointment,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import {
    selectFrontOfficeUpcomingAppointments,
    selectFrontOfficeUpcomingAppointmentsLoading,
    selectFrontOfficeUpcomingAppointmentsError,
    selectFrontOfficeUpcomingAppointmentsPage,
    selectFrontOfficeUpcomingAppointmentsTotal,
    selectFrontOfficeUpcomingAppointmentsTotalPages,
    selectFrontOfficeUpcomingAppointmentsShowing,

    // CHECK-IN / CHECK-OUT
    selectCheckingInAppointment,
    selectCheckingOutAppointment,
    selectCheckInAppointmentId,
    selectCheckOutAppointmentId,
} from "../../../redux/frontOffice/frontOfficeAppointmentSlice";

import DashboardLayout from "../../../components/Layout/DashboardLayout";


// ======================================================
// MAIN COMPONENT
// ======================================================

const UpcomingAppointmentsList = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // ==================================================
    // REDUX DATA
    // ==================================================

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


    // ==================================================
    // CHECK-IN / CHECK-OUT REDUX STATE
    // ==================================================

    const checkingInAppointment =
        useSelector(
            selectCheckingInAppointment
        );

    const checkingOutAppointment =
        useSelector(
            selectCheckingOutAppointment
        );

    const checkInAppointmentId =
        useSelector(
            selectCheckInAppointmentId
        );

    const checkOutAppointmentId =
        useSelector(
            selectCheckOutAppointmentId
        );


    // ==================================================
    // PERIOD
    // ==================================================

    const [
        selectedPeriod,
        setSelectedPeriod,
    ] = useState("today");


    const [
        showPeriodMenu,
        setShowPeriodMenu,
    ] = useState(false);


    // ==================================================
    // LOAD APPOINTMENTS
    // ==================================================

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


    // ==================================================
    // PERIOD LABEL
    // ==================================================

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


    // ==================================================
    // PERIOD CHANGE
    // ==================================================

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


    // ==================================================
    // PREVIOUS PAGE
    // ==================================================

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


    // ==================================================
    // NEXT PAGE
    // ==================================================

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


    // ==================================================
    // ADD VITALS
    // ==================================================

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


    // ==================================================
    // CHECK IN
    // ==================================================

    const handleCheckIn = async (
        appointment
    ) => {

        const appointmentId =
            appointment?.appointment_id ||
            appointment?.id;

        if (!appointmentId) {
            return;
        }


        // Already checked in
        if (
            appointment?.checkin === true
        ) {
            return;
        }


        // Another check-in request is running
        if (
            checkingInAppointment
        ) {
            return;
        }


        try {

            await dispatch(
                checkInFrontOfficeAppointment(
                    appointmentId
                )
            ).unwrap();


            // Refresh appointment list
            await dispatch(
                loadFrontOfficeUpcomingAppointments({
                    period: selectedPeriod,
                    page,
                    limit: 12,
                })
            );

        } catch (error) {

            console.error(
                "Check-in failed:",
                error
            );

        }

    };


    // ==================================================
    // CHECK OUT
    // ==================================================

    const handleCheckOut = async (
        appointment
    ) => {

        const appointmentId =
            appointment?.appointment_id ||
            appointment?.id;

        if (!appointmentId) {
            return;
        }


        // Already checked out
        if (
            appointment?.checkout === true
        ) {
            return;
        }


        // Another checkout request is running
        if (
            checkingOutAppointment
        ) {
            return;
        }


        try {

            await dispatch(
                checkOutFrontOfficeAppointment(
                    appointmentId
                )
            ).unwrap();


            // Refresh appointment list
            await dispatch(
                loadFrontOfficeUpcomingAppointments({
                    period: selectedPeriod,
                    page,
                    limit: 12,
                })
            );

        } catch (error) {

            console.error(
                "Check-out failed:",
                error
            );

        }

    };


    // ==================================================
    // SHOWING TEXT
    // ==================================================

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


        return `Showing Appointments ${start} - ${end} of ${total}`;
    };


    // ==================================================
    // UI
    // ==================================================

    return (

        <DashboardLayout role="frontoffice">

            <div
                className="
                    min-h-screen
                    bg-[#FFFCF9]
                    px-6
                    py-5
                "
            >

                {/* ==========================================
                    HEADER
                ========================================== */}

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

                            {/* BACK BUTTON */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(-1)
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-[#4B2E2A]
                                    transition
                                    hover:bg-[#FFF0E5]
                                "
                                title="Go back"
                            >

                                <HiArrowLeft
                                    size={20}
                                />

                            </button>


                            <h1
                                className="
                                    text-[24px]
                                    font-semibold
                                    text-[#3F2923]
                                "
                            >
                                Appointments
                            </h1>

                        </div>


                        <p
                            className="
                                mt-2
                                text-[15px]
                                text-[#7D716B]
                            "
                        >
                            {total} Total Consultations
                        </p>

                    </div>


                    {/* ======================================
                        PERIOD DROPDOWN
                    ====================================== */}

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
                                transition
                                hover:bg-[#FFF9F4]
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


                        {/* PERIOD MENU */}

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


                {/* ==========================================
                    ERROR
                ========================================== */}

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
                              "Failed to load appointments."
                        }

                    </div>

                )}


                {/* ==========================================
                    PAGINATION
                ========================================== */}

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


                    {/* PREVIOUS */}

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
                            transition
                            hover:text-[#8A4F32]
                            disabled:cursor-not-allowed
                            disabled:opacity-30
                        "
                    >

                        <HiChevronLeft
                            size={18}
                        />

                    </button>


                    {/* NEXT */}

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
                            transition
                            hover:text-[#8A4F32]
                            disabled:cursor-not-allowed
                            disabled:opacity-30
                        "
                    >

                        <HiChevronRight
                            size={18}
                        />

                    </button>

                </div>


                {/* ==========================================
                    TABLE
                ========================================== */}

                <div
                    className="
                        mt-5
                        w-full
                        overflow-hidden
                        rounded-[15px]
                        border
                        border-[#E8DDD6]
                        bg-white
                    "
                >

                    {/* ======================================
                        TABLE HEADER
                    ====================================== */}

                    <div
                        className="
                            grid
                            grid-cols-[1.45fr_1.25fr_1.3fr_1.1fr_.65fr_.6fr_.95fr_.6fr]
                            border-b
                            border-[#E8DDD6]
                            bg-[#FFF9F4]
                        "
                    >

                        <TableHeader>
                            Patient Details
                        </TableHeader>

                        <TableHeader>
                            Doctor
                        </TableHeader>

                        <TableHeader>
                            Date and Time
                        </TableHeader>

                        <TableHeader>
                            Appointment Type
                        </TableHeader>

                        <TableHeader>
                            Price
                        </TableHeader>

                        <TableHeader center>
                            Checked
                            <br />
                            in
                        </TableHeader>

                        <TableHeader center>
                            Actions
                        </TableHeader>

                        <TableHeader
                            center
                            last
                        >
                            Checked
                            <br />
                            out
                        </TableHeader>

                    </div>


                    {/* ======================================
                        LOADING
                    ====================================== */}

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
                            No appointments found.
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

                                    onCheckIn={
                                        handleCheckIn
                                    }

                                    onCheckOut={
                                        handleCheckOut
                                    }

                                    checkInLoading={
                                        checkingInAppointment &&
                                        checkInAppointmentId ===
                                            (
                                                appointment?.appointment_id ||
                                                appointment?.id
                                            )
                                    }

                                    checkOutLoading={
                                        checkingOutAppointment &&
                                        checkOutAppointmentId ===
                                            (
                                                appointment?.appointment_id ||
                                                appointment?.id
                                            )
                                    }
                                />

                            )
                        )

                    )}

                </div>

            </div>

        </DashboardLayout>

    );

};



// ======================================================
// TABLE HEADER
// ======================================================

const TableHeader = ({
    children,
    last = false,
    center = false,
}) => {

    return (

        <div
            className={`
                flex
                min-h-[62px]
                items-center
                px-4
                py-3
                text-[11px]
                font-medium
                leading-4
                text-[#4B2E2A]

                ${
                    center
                        ? "justify-center text-center"
                        : ""
                }

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



// ======================================================
// APPOINTMENT ROW
// ======================================================

const AppointmentRow = ({
    appointment,
    onAddVitals,
    onCheckIn,
    onCheckOut,
    checkInLoading,
    checkOutLoading,
}) => {


    // ==================================================
    // APPOINTMENT ID
    // ==================================================

    const appointmentId =
        appointment?.appointment_id ||
        appointment?.id;


    // ==================================================
    // PATIENT
    // ==================================================

    const patientName =
        appointment?.patient_name ||
        appointment?.personal_information?.full_name ||
        "-";


    const patientId =
        appointment?.patient_id ||
        appointment?.patient_code ||
        appointment?.personal_information?.patient_id ||
        "-";


    // ==================================================
    // DOCTOR
    // ==================================================

    const doctorName =
        appointment?.doctor_name ||
        appointment?.doctor?.name ||
        "-";


    // ==================================================
    // DATE
    // ==================================================

    const appointmentDate =
        appointment?.formatted_date ||
        appointment?.date ||
        "-";


    // ==================================================
    // TIME
    // ==================================================

    const appointmentTime =
        appointment?.time ||
        appointment?.slot_time ||
        "-";


    // ==================================================
    // TYPE
    // ==================================================

    const appointmentType =
        appointment?.appointment_type ||
        appointment?.type ||
        appointment?.medium ||
        "-";


    // ==================================================
    // CATEGORY
    // ==================================================

    const appointmentCategory =
        appointment?.category ||
        appointment?.booking_category ||
        appointment?.appointment_category ||
        "";


    // ==================================================
    // PRICE
    // ==================================================

    const rawPrice =
        appointment?.price ??
        appointment?.fee ??
        appointment?.amount;


    const price =
        appointment?.price_display ||
        (
            rawPrice !== undefined &&
            rawPrice !== null &&
            rawPrice !== ""
                ? `₹${rawPrice}`
                : "-"
        );


    // ==================================================
    // CHECK-IN
    // ==================================================

    const isCheckedIn =
        appointment?.checkin === true ||
        appointment?.checked_in === true ||
        appointment?.check_in === true;


    // ==================================================
    // CHECK-OUT
    // ==================================================

    const isCheckedOut =
        appointment?.checkout === true ||
        appointment?.checked_out === true ||
        appointment?.check_out === true;


    // ==================================================
    // VITALS
    // ==================================================

    const isVitalsAdded =
        appointment?.has_vitals === true ||
        appointment?.vitals_status === "completed";


    const actionLabel =
        isVitalsAdded
            ? "Added Vitals"
            : appointment?.action_label ||
              "+ Add Vitals";


    return (

        <div
            className="
                grid
                grid-cols-[1.45fr_1.25fr_1.3fr_1.1fr_.65fr_.6fr_.95fr_.6fr]
                border-b
                border-[#EEE4DD]
                last:border-b-0
            "
        >

            {/* ==========================================
                PATIENT DETAILS
            ========================================== */}

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
                        text-[12px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    {patientName}
                </p>

                <p
                    className="
                        mt-1
                        text-[10px]
                        text-[#81756E]
                    "
                >
                    Patient ID: {patientId}
                </p>

            </div>


            {/* ==========================================
                DOCTOR
            ========================================== */}

            <div
                className="
                    flex
                    items-center
                    border-r
                    border-[#EEE4DD]
                    px-4
                    py-4
                "
            >

                <span
                    className="
                        text-[12px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    {doctorName}
                </span>

            </div>


            {/* ==========================================
                DATE AND TIME
            ========================================== */}

            <div
                className="
                    flex
                    flex-col
                    justify-center
                    border-r
                    border-[#EEE4DD]
                    px-4
                    py-4
                "
            >

                <p
                    className="
                        text-[12px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    {appointmentDate}
                </p>

                <p
                    className="
                        mt-1
                        text-[10px]
                        text-[#81756E]
                    "
                >
                    {appointmentTime}
                </p>

            </div>


            {/* ==========================================
                APPOINTMENT TYPE
            ========================================== */}

            <div
                className="
                    flex
                    flex-col
                    justify-center
                    border-r
                    border-[#EEE4DD]
                    px-4
                    py-4
                "
            >

                <p
                    className="
                        text-[12px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    {appointmentType}
                </p>

                {appointmentCategory && (

                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-[#81756E]
                        "
                    >
                        {appointmentCategory}
                    </p>

                )}

            </div>


            {/* ==========================================
                PRICE
            ========================================== */}

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

                {price}

            </div>


            {/* ==========================================
                CHECKED IN
            ========================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-center
                    border-r
                    border-[#EEE4DD]
                    px-2
                    py-4
                "
            >

                <CheckButton
                    checked={
                        isCheckedIn
                    }

                    loading={
                        checkInLoading
                    }

                    onClick={() =>
                        onCheckIn(
                            appointment
                        )
                    }

                    label={
                        isCheckedIn
                            ? "Checked in"
                            : "Check in"
                    }
                />

            </div>


            {/* ==========================================
                ACTIONS
            ========================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-center
                    border-r
                    border-[#EEE4DD]
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
                    className={`
                        flex
                        items-center
                        justify-center
                        gap-1.5
                        whitespace-nowrap
                        rounded-full
                        border
                        px-3
                        py-2
                        text-[10px]
                        font-medium
                        transition

                        ${
                            isVitalsAdded
                                ? `
                                    border-[#EEE4DD]
                                    bg-white
                                    text-[#B7AAA3]
                                `
                                : `
                                    border-[#E7DBD3]
                                    bg-white
                                    text-[#4B2E2A]
                                    hover:bg-[#FFF5ED]
                                `
                        }
                    `}
                >

                    {isVitalsAdded && (

                        <HiOutlineCheck
                            size={13}
                        />

                    )}

                    {actionLabel}

                </button>

            </div>


            {/* ==========================================
                CHECKED OUT
            ========================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-center
                    px-2
                    py-4
                "
            >

                <CheckButton
                    checked={
                        isCheckedOut
                    }

                    loading={
                        checkOutLoading
                    }

                    onClick={() =>
                        onCheckOut(
                            appointment
                        )
                    }

                    label={
                        isCheckedOut
                            ? "Checked out"
                            : "Check out"
                    }
                />

            </div>

        </div>

    );

};



// ======================================================
// CHECK BUTTON
// ======================================================

const CheckButton = ({
    checked,
    loading,
    onClick,
    label,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            disabled={
                checked ||
                loading
            }
            title={label}
            aria-label={label}
            className={`
                flex
                h-[22px]
                w-[22px]
                items-center
                justify-center
                rounded-[3px]
                border
                transition

                ${
                    checked
                        ? `
                            border-[#542C23]
                            bg-[#542C23]
                            text-white
                        `
                        : `
                            border-[#542C23]
                            bg-white
                            text-transparent
                            hover:bg-[#FFF5ED]
                        `
                }

                ${
                    loading
                        ? "cursor-wait opacity-60"
                        : ""
                }

                ${
                    checked
                        ? "cursor-default"
                        : ""
                }
            `}
        >

            {loading ? (

                <HiOutlineArrowPath
                    size={13}
                    className="animate-spin"
                />

            ) : checked ? (

                <HiOutlineCheck
                    size={14}
                    strokeWidth={3}
                />

            ) : null}

        </button>

    );

};



// ======================================================
// PERIOD BUTTON
// ======================================================

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