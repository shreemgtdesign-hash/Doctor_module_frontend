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
    HiOutlineChevronDown,
    HiOutlineCalendarDays,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";


import {
    loadPainAssessmentsCompleted,
    loadScheduleOverview,
    loadPatientsTended,
    loadDutyDoctorPatientQueue,
} from "../../redux/dutyDoctor/dutyDoctorThunk";
import DashboardLayout from "../../components/Layout/DashboardLayout";


const DutyDoctorDashboard = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // ==========================================
    // REDUX
    // ==========================================

    const {
        painAssessments,
        scheduleOverview,
        patientsTended,
        patientQueue,
        patientQueueCount,

        patientQueueLoading,
        error,
    } = useSelector(
        (state) =>
            state.dutyDoctor
    );
// ==========================================
// PAIN ASSESSMENT DATA
// ==========================================

const painAssessmentData = painAssessments || {};


    // ==========================================
    // PERIOD
    // ==========================================

    const [
        painPeriod,
        setPainPeriod,
    ] = useState("week");

    const [
        schedulePeriod,
        setSchedulePeriod,
    ] = useState("week");

    const [
        patientsPeriod,
        setPatientsPeriod,
    ] = useState("week");


    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    useEffect(() => {

        dispatch(
            loadPainAssessmentsCompleted(
                painPeriod
            )
        );

    }, [
        dispatch,
        painPeriod,
    ]);


    useEffect(() => {

        dispatch(
            loadScheduleOverview(
                schedulePeriod
            )
        );

    }, [
        dispatch,
        schedulePeriod,
    ]);


    useEffect(() => {

        dispatch(
            loadPatientsTended(
                patientsPeriod
            )
        );

    }, [
        dispatch,
        patientsPeriod,
    ]);


    useEffect(() => {

        dispatch(
            loadDutyDoctorPatientQueue()
        );

    }, [dispatch]);


    // ==========================================
    // CATEGORY DATA
    // ==========================================

    const categories = useMemo(() => {

    if (
        painAssessmentData?.category_list &&
        painAssessmentData.category_list.length
    ) {

        return painAssessmentData.category_list.slice(0, 5);

    }

    return [];

}, [
    painAssessmentData,
]);


    // ==========================================
    // FORMAT PERIOD
    // ==========================================

    const periodLabel = (period) => {

        switch (period) {

            case "today":
            case "day":
                return "Today";

            case "month":
                return "This Month";

            case "week":
            default:
                return "This Week";

        }

    };


    // ==========================================
    // STATUS BUTTON
    // ==========================================

    const getQueueButtonLabel = (
        appointment
    ) => {

        if (
            appointment.status ===
            "Start Pre"
        ) {

            return "Start Pre";

        }

        if (
            appointment.status ===
            "Start Post"
        ) {

            return "Start Post";

        }

        return appointment.status ||
            "Start";
    };


    // ==========================================
    // ERROR MESSAGE
    // ==========================================

    const getErrorMessage = () => {

        if (!error) {
            return null;
        }

        if (typeof error === "string") {
            return error;
        }

        return (
            error?.message ||
            "Failed to load dashboard"
        );

    };

    // ==========================================
    // START PAIN ASSESSMENT
    // ==========================================

    const handleStartAssessment = (patient) => {

        const bookingId =
            patient.booking_id ||
            patient.id;

        if (!bookingId) {

            console.error(
                "Booking ID not found:",
                patient
            );

            return;
        }

        const assessmentType =
            patient.status === "Start Post"
                ? "post"
                : "pre";

        navigate(
            `/duty-doctor/assessment/${bookingId}?type=${assessmentType}`,
            {
                state: {
                    bookingId,
                    assessmentType,
                },
            }
        );
    };
    return (
        <DashboardLayout role={'duty_doctor'}>

            <div className="
            min-h-screen
            bg-[#F8F6F3]
            px-7
            py-6
        ">


                {/* ===================================== */}
                {/* DASHBOARD CONTENT */}
                {/* ===================================== */}

                <div className="
                mx-auto
                max-w-[1500px]
            ">


                    {/* ===================================== */}
                    {/* ERROR */}
                    {/* ===================================== */}

                    {getErrorMessage() && (

                        <div className="
                        mb-5
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-5
                        py-4
                        text-sm
                        text-red-600
                    ">

                            {getErrorMessage()}

                        </div>

                    )}


                    {/* ===================================== */}
                    {/* PAIN ASSESSMENTS CARD */}
                    {/* ===================================== */}

                    <section className="
                    rounded-[20px]
                    border
                    border-[#E8D9CB]
                    bg-white
                    px-5
                    py-5
                ">


                        {/* TOP ROW */}

                        <div className="
                        flex
                        flex-col
                        gap-4
                        border-b
                        border-[#EFE2D7]
                        pb-5
                        md:flex-row
                        md:items-center
                        md:justify-between
                    ">


                            <div className="
                            flex
                            items-center
                            gap-3
                        ">

                                <span className="
                                text-[28px]
                                font-bold
                                text-[#4D2E23]
                            ">

                                    {
                                        painAssessmentData
                                            ?.total_completed ??
                                        0
                                    }

                                </span>


                                <span className="
                                text-[18px]
                                font-semibold
                                text-[#4D2E23]
                            ">

                                    Pain assessments
                                    completed

                                </span>


                                <span className="
                                rounded-full
                                bg-[#E9F9EE]
                                px-3
                                py-1
                                text-[13px]
                                font-semibold
                                text-[#199447]
                            ">

                                    {
                                        painAssessments
                                            ?.growth_percentage ||
                                        "+0.0%"
                                    }

                                </span>


                                <span className="
                                hidden
                                text-[14px]
                                text-[#777]
                                sm:block
                            ">

                                    {
                                        painAssessments
                                            ?.comparison_label ||
                                        "Compared to last week"
                                    }

                                </span>

                            </div>


                            {/* PERIOD DROPDOWN */}

                            <PeriodDropdown
                                value={painPeriod}
                                onChange={
                                    setPainPeriod
                                }
                                label={
                                    periodLabel(
                                        painPeriod
                                    )
                                }
                            />

                        </div>


                        {/* CATEGORY BREAKDOWN */}

                        <div className="
                        mt-4
                        grid
                        grid-cols-2
                        divide-x
                        divide-[#EFE2D7]
                        md:grid-cols-5
                    ">

                            {categories.map(
                                (
                                    category,
                                    index
                                ) => (

                                    <div
                                        key={
                                            category.name ||
                                            index
                                        }
                                        className="
                                        px-4
                                        py-1
                                        text-center
                                    "
                                    >

                                        <p className="
                                        text-[15px]
                                        font-medium
                                        text-[#5B3A32]
                                    ">

                                            {
                                                category.name ||
                                                "-"
                                            }

                                        </p>


                                        <p className="
                                        mt-1
                                        text-[18px]
                                        font-bold
                                        text-[#4D2E23]
                                    ">

                                            {
                                                category.completed_count ??
                                                0
                                            }

                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </section>


                    {/* ===================================== */}
                    {/* TWO SUMMARY CARDS */}
                    {/* ===================================== */}

                    <div className="
                    mt-7
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                ">


                        {/* SCHEDULE OVERVIEW */}

                        <section className="
                        relative
                        min-h-[150px]
                        overflow-hidden
                        rounded-[20px]
                        border
                        border-[#E8D9CB]
                        bg-white
                        p-5
                    ">

                            <div className="
                            flex
                            items-start
                            justify-between
                        ">

                                <h2 className="
                                text-[18px]
                                font-semibold
                                text-[#4D2E23]
                            ">
                                    Schedule Overview
                                </h2>


                                <PeriodDropdown
                                    value={
                                        schedulePeriod
                                    }
                                    onChange={
                                        setSchedulePeriod
                                    }
                                    label={
                                        periodLabel(
                                            schedulePeriod
                                        )
                                    }
                                />

                            </div>


                            <div className="
                            mt-3
                        ">

                                <p className="
                                text-[28px]
                                font-bold
                                text-[#4D2E23]
                            ">

                                    {
                                        scheduleOverview
                                            ?.total_appointments ??
                                        0
                                    }

                                </p>


                                <p className="
                                mt-1
                                text-[14px]
                                text-[#777]
                            ">

                                    Total Appointments

                                </p>

                            </div>


                            {/* DECORATION */}

                            <div className="
                            pointer-events-none
                            absolute
                            bottom-3
                            right-7
                            text-[55px]
                            opacity-20
                        ">

                                ▦

                            </div>

                        </section>


                        {/* PATIENTS TENDED */}

                        <section className="
                        relative
                        min-h-[150px]
                        overflow-hidden
                        rounded-[20px]
                        border
                        border-[#E8D9CB]
                        bg-white
                        p-5
                    ">

                            <div className="
                            flex
                            items-start
                            justify-between
                        ">

                                <h2 className="
                                text-[18px]
                                font-semibold
                                text-[#4D2E23]
                            ">
                                    Patients Tended To
                                </h2>


                                <PeriodDropdown
                                    value={
                                        patientsPeriod
                                    }
                                    onChange={
                                        setPatientsPeriod
                                    }
                                    label={
                                        periodLabel(
                                            patientsPeriod
                                        )
                                    }
                                />

                            </div>


                            <div className="
                            mt-3
                        ">

                                <p className="
                                text-[28px]
                                font-bold
                                text-[#4D2E23]
                            ">

                                    {
                                        patientsTended
                                            ?.total_patients ??
                                        0
                                    }

                                </p>


                                <p className="
                                mt-1
                                text-[14px]
                                text-[#777]
                            ">

                                    Total Patients

                                </p>

                            </div>


                            {/* DECORATION */}

                            <div className="
                            pointer-events-none
                            absolute
                            bottom-2
                            right-7
                            text-[55px]
                            opacity-20
                        ">

                                〰

                            </div>

                        </section>

                    </div>


                    {/* ===================================== */}
                    {/* PATIENT QUEUE */}
                    {/* ===================================== */}

                    <section className="
                    mt-7
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#E8D9CB]
                    bg-white
                    px-5
                    pt-5
                    pb-3
                ">


                        {/* QUEUE HEADER */}

                        <div className="
                        border-b
                        border-[#EFE2D7]
                        pb-5
                    ">

                            <h2 className="
                            text-[22px]
                            font-bold
                            text-[#292929]
                        ">
                                Patient Queue
                            </h2>


                            <p className="
                            mt-3
                            text-[17px]
                            text-[#5B3A32]
                        ">

                                <span className="
                                mr-2
                            ">
                                    •
                                </span>

                                {
                                    patientQueueCount
                                } Patient
                                {
                                    patientQueueCount !== 1
                                        ? "s"
                                        : ""
                                }

                            </p>

                        </div>


                        {/* QUEUE TABLE */}

                        <div className="
                        mt-2
                        overflow-x-auto
                    ">

                            <div className="
                            min-w-[950px]
                        ">


                                {/* TABLE HEADER */}

                                <div className="
                                grid
                                grid-cols-[1.6fr_1.25fr_1.25fr_1.25fr_0.55fr_0.8fr_1fr]
                                border-b
                                border-[#EFE2D7]
                                py-3
                            ">

                                    <TableHeader>
                                        Patient Details
                                    </TableHeader>

                                    <TableHeader>
                                        Therapy
                                    </TableHeader>

                                    <TableHeader>
                                        Doctor
                                    </TableHeader>

                                    <TableHeader>
                                        Therapist
                                    </TableHeader>

                                    <TableHeader center>
                                        Room
                                    </TableHeader>

                                    <TableHeader center>
                                        Time
                                    </TableHeader>

                                    <TableHeader center>
                                        Status
                                    </TableHeader>

                                </div>


                                {/* LOADING */}

                                {patientQueueLoading ? (

                                    <div className="
                                    flex
                                    h-40
                                    items-center
                                    justify-center
                                    text-[#8A756B]
                                ">

                                        Loading patient
                                        queue...

                                    </div>

                                ) : patientQueue.length === 0 ? (

                                    <div className="
                                    flex
                                    h-40
                                    items-center
                                    justify-center
                                    text-[#8A756B]
                                ">

                                        No patients in queue

                                    </div>

                                ) : (

                                    patientQueue.map(
                                        (
                                            patient,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    patient.booking_id ||
                                                    patient.id ||
                                                    index
                                                }
                                                className="
                                                grid
                                                grid-cols-[1.6fr_1.25fr_1.25fr_1.25fr_0.55fr_0.8fr_1fr]
                                                items-center
                                                border-b
                                                border-[#F0E7DF]
                                                py-4
                                                last:border-b-0
                                                hover:bg-[#FFFCF9]
                                            "
                                            >


                                                {/* PATIENT */}

                                                <div className="
                                                px-4
                                            ">

                                                    <p className="
                                                    text-[15px]
                                                    font-semibold
                                                    text-[#4D2E23]
                                                ">

                                                        {
                                                            patient.patient_name ||
                                                            "Unknown Patient"
                                                        }

                                                    </p>


                                                    <p className="
                                                    mt-1
                                                    text-[13px]
                                                    text-[#777]
                                                ">

                                                        Patient ID:{" "}

                                                        {
                                                            patient.patient_id ||
                                                            "-"
                                                        }

                                                    </p>

                                                </div>


                                                {/* THERAPY */}

                                                <div className="
                                                px-4
                                            ">

                                                    <p className="
                                                    text-[15px]
                                                    font-semibold
                                                    text-[#4D2E23]
                                                ">

                                                        {
                                                            patient.therapy_name ||
                                                            "Therapy"
                                                        }

                                                    </p>


                                                    <p className="
                                                    mt-1
                                                    text-[13px]
                                                    text-[#777]
                                                ">

                                                        {
                                                            patient.duration ||
                                                            "-"
                                                        }

                                                    </p>

                                                </div>


                                                {/* DOCTOR */}

                                                <div className="
                                                px-4
                                            ">

                                                    <p className="
                                                    text-[15px]
                                                    font-semibold
                                                    text-[#4D2E23]
                                                ">

                                                        {
                                                            patient.doctor_name ||
                                                            patient.doctor ||
                                                            "-"
                                                        }

                                                    </p>

                                                </div>


                                                {/* THERAPIST */}

                                                <div className="
                                                px-4
                                            ">

                                                    <p className="
                                                    text-[15px]
                                                    font-semibold
                                                    text-[#4D2E23]
                                                ">

                                                        {
                                                            patient.therapist_name ||
                                                            patient.therapist ||
                                                            "-"
                                                        }

                                                    </p>

                                                </div>


                                                {/* ROOM */}

                                                <div className="
                                                px-4
                                                text-center
                                            ">

                                                    <span className="
                                                    text-[15px]
                                                    font-semibold
                                                    text-[#4D2E23]
                                                ">

                                                        {
                                                            patient.room ||
                                                            "-"
                                                        }

                                                    </span>

                                                </div>


                                                {/* TIME */}

                                                <div className="
                                                px-4
                                                text-center
                                            ">

                                                    <span className="
                                                    whitespace-nowrap
                                                    text-[15px]
                                                    font-semibold
                                                    text-[#4D2E23]
                                                ">

                                                        {
                                                            patient.time ||
                                                            patient.slot_time ||
                                                            "-"
                                                        }

                                                    </span>

                                                </div>


                                                {/* STATUS */}

                                                <div className="
                                                flex
                                                justify-center
                                                px-3
                                            ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStartAssessment(patient)
                                                        }
                                                        className="
                                                                    min-w-[125px]
                                                                    rounded-full
                                                                    border
                                                                    border-[#E7D5C4]
                                                                    bg-[#FFFDFB]
                                                                    px-4
                                                                    py-2.5
                                                                    text-[14px]
                                                                    font-semibold
                                                                    text-[#4D2E23]
                                                                    shadow-[0_1px_3px_rgba(80,50,35,0.08)]
                                                                    transition
                                                                    hover:bg-[#FFF6ED]
                                                                    active:scale-[0.98]
                                                                "
                                                    >
                                                        {
                                                            getQueueButtonLabel(
                                                                patient
                                                            )
                                                        }
                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                        </div>

                    </section>

                </div>

            </div>
        </DashboardLayout>

    );

};


// ==========================================
// PERIOD DROPDOWN
// ==========================================

const PeriodDropdown = ({
    value,
    onChange,
    
}) => {

    return (

        <div className="
            relative
            inline-flex
        ">

            <HiOutlineCalendarDays
                size={17}
                className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[#6B4A3E]
                "
            />


            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="
                    h-10
                    cursor-pointer
                    appearance-none
                    rounded-xl
                    border
                    border-[#E7D8CB]
                    bg-[#FFFDFB]
                    pl-9
                    pr-9
                    text-[14px]
                    font-medium
                    text-[#4D2E23]
                    outline-none
                    transition
                    focus:border-[#BFA18C]
                "
            >

                <option value="week">
                    This Week
                </option>

                <option value="today">
                    Today
                </option>

                <option value="month">
                    This Month
                </option>

            </select>


            <HiOutlineChevronDown
                size={16}
                className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#6B4A3E]
                "
            />

        </div>

    );

};


// ==========================================
// TABLE HEADER
// ==========================================

const TableHeader = ({
    children,
    center = false,
}) => {

    return (

        <div
            className={`
                px-4
                text-[14px]
                font-medium
                text-[#4D2E23]
                ${center ? "text-center" : ""}
            `}
        >

            {children}

        </div>

    );

};


export default DutyDoctorDashboard;