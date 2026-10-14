import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineCalendarDays,
    HiOutlineClock,
} from "react-icons/hi2";

import {
    loadTherapyAppointments,
} from "../../../redux/dashboard/dashboardThunk";

import DashboardLayout from "../../../components/Layout/DashboardLayout";


// ======================================================
// DATE FORMATTER
// ======================================================

const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};


// ======================================================
// TIME FORMATTER
// ======================================================

const formatTime = (value) => {

    if (!value) {
        return "-";
    }

    // If API already gives something like "10:00 AM"
    if (
        typeof value === "string" &&
        /am|pm/i.test(value)
    ) {
        return value;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};


// ======================================================
// COMPONENT
// ======================================================

const TherapiesPrescribedTable = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();


    // ==================================================
    // REDUX
    // ==================================================

    const {
        therapyAppointments = [],
        therapyAppointmentsCount = 0,
        therapyAppointmentsLoading = false,
        therapyAppointmentsError = null,
    } = useSelector(
        (state) => state.dashboard
    );


    // ==================================================
    // LOAD THERAPY APPOINTMENTS
    // ==================================================

    useEffect(() => {

        dispatch(
            loadTherapyAppointments()
        );

    }, [dispatch]);


    // ==================================================
    // BACK TO DASHBOARD
    // ==================================================

    const handleBack = () => {

        navigate(
            "/doctordashboard"
        );

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <DashboardLayout role="doctor">

            <div className="min-h-screen bg-[#F8F6F3] px-8 py-6">

                {/* ================================================= */}
                {/* BACK TO DASHBOARD */}
                {/* ================================================= */}

                <button
                    type="button"
                    onClick={handleBack}
                    className="
                        flex
                        items-center
                        gap-2
                        text-[16px]
                        font-semibold
                        text-[#4D2E23]
                        transition
                        hover:text-[#7A4A35]
                    "
                >

                    <HiOutlineArrowLeft
                        size={22}
                    />

                    <span>
                        Back to Dashboard
                    </span>

                </button>


                {/* ================================================= */}
                {/* TITLE */}
                {/* ================================================= */}

                <div className="mt-8 mb-6">

                    <h1
                        className="
                            text-[28px]
                            font-bold
                            text-[#2F2F2F]
                        "
                    >
                        Therapies Prescribed
                    </h1>


                    <p
                        className="
                            mt-2
                            text-[15px]
                            font-medium
                            text-[#777777]
                        "
                    >
                        {therapyAppointmentsCount} Total Therapies
                    </p>

                </div>


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {therapyAppointmentsError && (

                    <div
                        className="
                            mb-4
                            rounded-2xl
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-sm
                            text-red-600
                        "
                    >

                        {typeof therapyAppointmentsError === "string"
                            ? therapyAppointmentsError
                            : "Failed to load therapies."
                        }

                    </div>

                )}


                {/* ================================================= */}
                {/* TABLE */}
                {/* ================================================= */}

                <div
                    className="
                        overflow-hidden
                        rounded-[22px]
                        border
                        border-[#E9DED6]
                        bg-white
                    "
                >

                    <div className="overflow-x-auto">

                        <table
                            className="
                                w-full
                                min-w-[1050px]
                                border-collapse
                            "
                        >

                            {/* ================================================= */}
                            {/* TABLE HEADER */}
                            {/* ================================================= */}

                            <thead>

                                <tr
                                    className="
                                        bg-[#FFF9F5]
                                        text-left
                                    "
                                >

                                    {/* Patient */}

                                    <th
                                        className="
                                            border-b
                                            border-r
                                            border-[#E9DED6]
                                            px-6
                                            py-5
                                            text-[16px]
                                            font-semibold
                                            text-[#4D2E23]
                                        "
                                    >
                                        Patient Details
                                    </th>


                                    {/* Therapy */}

                                    <th
                                        className="
                                            border-b
                                            border-r
                                            border-[#E9DED6]
                                            px-6
                                            py-5
                                            text-[16px]
                                            font-semibold
                                            text-[#4D2E23]
                                        "
                                    >
                                        Therapy
                                    </th>


                                    {/* Date */}

                                    <th
                                        className="
                                            border-b
                                            border-r
                                            border-[#E9DED6]
                                            px-6
                                            py-5
                                            text-center
                                            text-[16px]
                                            font-semibold
                                            text-[#4D2E23]
                                        "
                                    >
                                        Date
                                    </th>


                                    {/* Time */}

                                    <th
                                        className="
                                            border-b
                                            border-r
                                            border-[#E9DED6]
                                            px-6
                                            py-5
                                            text-center
                                            text-[16px]
                                            font-semibold
                                            text-[#4D2E23]
                                        "
                                    >
                                        Time
                                    </th>


                                    {/* Therapist */}

                                    <th
                                        className="
                                            border-b
                                            border-r
                                            border-[#E9DED6]
                                            px-6
                                            py-5
                                            text-center
                                            text-[16px]
                                            font-semibold
                                            text-[#4D2E23]
                                        "
                                    >
                                        Therapist Name
                                    </th>


                                    {/* Price */}

                                    <th
                                        className="
                                            border-b
                                            border-[#E9DED6]
                                            px-6
                                            py-5
                                            text-center
                                            text-[16px]
                                            font-semibold
                                            text-[#4D2E23]
                                        "
                                    >
                                        Price
                                    </th>

                                </tr>

                            </thead>


                            {/* ================================================= */}
                            {/* TABLE BODY */}
                            {/* ================================================= */}

                            <tbody>

                                {/* ================================ */}
                                {/* LOADING */}
                                {/* ================================ */}

                                {therapyAppointmentsLoading ? (

                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="
                                                px-6
                                                py-16
                                                text-center
                                                text-[#8B7A70]
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        h-5
                                                        w-5
                                                        animate-spin
                                                        rounded-full
                                                        border-2
                                                        border-[#E8D5C8]
                                                        border-t-[#6A3F2D]
                                                    "
                                                />

                                                <span>
                                                    Loading therapies...
                                                </span>

                                            </div>

                                        </td>

                                    </tr>

                                ) : therapyAppointments.length === 0 ? (

                                    /* ================================ */
                                    /* EMPTY */
                                    /* ================================ */

                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="
                                                px-6
                                                py-16
                                                text-center
                                                text-[#8B7A70]
                                            "
                                        >
                                            No therapies found.
                                        </td>

                                    </tr>

                                ) : (

                                    /* ================================ */
                                    /* DATA */
                                    /* ================================ */

                                    therapyAppointments.map(
                                        (item, index) => {

                                            const patientName =
                                                item.patient_name ||
                                                item.patientName ||
                                                item.patient?.name ||
                                                "Patient not assigned";


                                            const patientCode =
                                                item.patient_code ||
                                                item.patientCode ||
                                                item.patient_id ||
                                                item.patient?.code ||
                                                "-";


                                            const therapyName =
                                                item.therapy_name ||
                                                item.therapyName ||
                                                item.therapy?.name ||
                                                "Therapy not assigned";


                                            const duration =
                                                item.duration ||
                                                item.duration_minutes
                                                    ? `${item.duration || item.duration_minutes} mins`
                                                    : "-";


                                            const therapistName =
                                                item.therapist_name ||
                                                item.therapistName ||
                                                item.therapist?.name ||
                                                "-";


                                            const dateValue =
                                                item.date ||
                                                item.therapy_date ||
                                                item.appointment_date ||
                                                item.scheduled_at ||
                                                item.start_time;


                                            const timeValue =
                                                item.time ||
                                                item.slot_time ||
                                                item.appointment_time ||
                                                item.scheduled_at ||
                                                item.start_time;


                                            const price =
                                                Number(
                                                    item.price ||
                                                    item.amount ||
                                                    item.therapy_price ||
                                                    0
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        item.id ||
                                                        item.therapy_id ||
                                                        index
                                                    }
                                                    className="
                                                        border-b
                                                        border-[#F0E7E1]
                                                        last:border-b-0
                                                        hover:bg-[#FFFCFA]
                                                    "
                                                >

                                                    {/* ================================= */}
                                                    {/* PATIENT */}
                                                    {/* ================================= */}

                                                    <td
                                                        className="
                                                            border-r
                                                            border-[#E9DED6]
                                                            px-6
                                                            py-5
                                                            align-top
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[16px]
                                                                font-semibold
                                                                text-[#4D2E23]
                                                            "
                                                        >
                                                            {patientName}
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[13px]
                                                                text-[#7A6E67]
                                                            "
                                                        >
                                                            Patient ID:{" "}
                                                            {patientCode}
                                                        </p>

                                                    </td>


                                                    {/* ================================= */}
                                                    {/* THERAPY */}
                                                    {/* ================================= */}

                                                    <td
                                                        className="
                                                            border-r
                                                            border-[#E9DED6]
                                                            px-6
                                                            py-5
                                                            align-top
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[16px]
                                                                font-semibold
                                                                text-[#4D2E23]
                                                            "
                                                        >
                                                            {therapyName}
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[13px]
                                                                text-[#7A6E67]
                                                            "
                                                        >
                                                            {duration}
                                                        </p>

                                                    </td>


                                                    {/* ================================= */}
                                                    {/* DATE */}
                                                    {/* ================================= */}

                                                    <td
                                                        className="
                                                            border-r
                                                            border-[#E9DED6]
                                                            px-6
                                                            py-5
                                                            align-middle
                                                            text-center
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                justify-center
                                                                gap-2
                                                                text-[15px]
                                                                font-semibold
                                                                text-[#4D2E23]
                                                            "
                                                        >

                                                            <HiOutlineCalendarDays
                                                                size={18}
                                                                className="text-[#8B573D]"
                                                            />

                                                            <span>
                                                                {formatDate(
                                                                    dateValue
                                                                )}
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* ================================= */}
                                                    {/* TIME */}
                                                    {/* ================================= */}

                                                    <td
                                                        className="
                                                            border-r
                                                            border-[#E9DED6]
                                                            px-6
                                                            py-5
                                                            align-middle
                                                            text-center
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                justify-center
                                                                gap-2
                                                                text-[15px]
                                                                font-semibold
                                                                text-[#4D2E23]
                                                            "
                                                        >

                                                            <HiOutlineClock
                                                                size={18}
                                                                className="text-[#8B573D]"
                                                            />

                                                            <span>
                                                                {formatTime(
                                                                    timeValue
                                                                )}
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* ================================= */}
                                                    {/* THERAPIST */}
                                                    {/* ================================= */}

                                                    <td
                                                        className="
                                                            border-r
                                                            border-[#E9DED6]
                                                            px-6
                                                            py-5
                                                            text-center
                                                            align-middle
                                                            text-[15px]
                                                            font-semibold
                                                            text-[#4D2E23]
                                                        "
                                                    >

                                                        {therapistName}

                                                    </td>


                                                    {/* ================================= */}
                                                    {/* PRICE */}
                                                    {/* ================================= */}

                                                    <td
                                                        className="
                                                            px-6
                                                            py-5
                                                            text-center
                                                            align-middle
                                                            text-[16px]
                                                            font-semibold
                                                            text-[#4D2E23]
                                                        "
                                                    >

                                                        ₹
                                                        {price.toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
};


export default TherapiesPrescribedTable;