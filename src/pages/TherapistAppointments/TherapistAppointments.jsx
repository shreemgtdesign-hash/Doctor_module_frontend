import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    HiOutlineArrowLeft,
    HiOutlineCalendar,
} from "react-icons/hi2";

import { loadTherapistAppointments } from "../../redux/therapist/therapistThunk";


const TherapistAppointments = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // ==========================================
    // REDUX
    // ==========================================

    const {
        appointments = [],
        count = 0,
        loading,
        error,
    } = useSelector(
        (state) => state.therapist
    );


    // ==========================================
    // LOAD APPOINTMENTS
    // ==========================================

    useEffect(() => {

        dispatch(
            loadTherapistAppointments()
        );

    }, [dispatch]);


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {

        if (
            price === null ||
            price === undefined ||
            price === ""
        ) {
            return "₹0";
        }

        return `₹${Number(price).toLocaleString("en-IN")}`;

    };


    // ==========================================
    // STATUS CHECK
    // ==========================================

    const isCompleted = (appointment) => {

        return (
            appointment.is_completed === true ||
            appointment.status?.toLowerCase() ===
                "completed"
        );

    };


    return (

        <div className="min-h-screen bg-[#F8F6F3] px-8 py-6">

            {/* ================================= */}
            {/* BACK BUTTON */}
            {/* ================================= */}

            <button
                onClick={() =>
                    navigate("/therapist/dashboard")
                }
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

                Back to Dashboard

            </button>


            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div
                className="
                    mt-8
                    flex
                    items-start
                    justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-[30px]
                            font-bold
                            text-[#2F2F2F]
                        "
                    >
                        Today's Appointments
                    </h1>


                    <p
                        className="
                            mt-2
                            text-[17px]
                            text-[#5B3A32]
                        "
                    >
                        <span className="mr-2">
                            •
                        </span>

                        {count} Patient
                        {count !== 1 ? "s" : ""}
                    </p>

                </div>


                {/* ================================= */}
                {/* APPOINTMENTS BADGE */}
                {/* ================================= */}

                <div
                    className="
                        flex
                        h-12
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-[#E7DBD3]
                        bg-white
                        px-5
                        text-[15px]
                        font-medium
                        text-[#4D2E23]
                    "
                >

                    <HiOutlineCalendar
                        size={19}
                    />

                    Appointments

                </div>

            </div>


            {/* ================================= */}
            {/* ERROR */}
            {/* ================================= */}

            {error && (

                <div
                    className="
                        mt-6
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-5
                        py-4
                        text-sm
                        text-red-600
                    "
                >

                    {typeof error === "string"
                        ? error
                        : "Failed to load appointments"}

                </div>

            )}


            {/* ================================= */}
            {/* TABLE */}
            {/* ================================= */}

            <div
                className="
                    mt-6
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-[#E7DBD3]
                    bg-white
                "
            >

                {/* ================================= */}
                {/* TABLE HEADER */}
                {/* ================================= */}

                <div
                    className="
                        grid
                        min-w-[1100px]
                        grid-cols-[1.5fr_1.25fr_0.9fr_1.2fr_1.2fr_0.55fr_0.8fr_0.7fr]
                        border-b
                        border-[#EFE2D7]
                        bg-[#FFF9F3]
                    "
                >

                    {/* PATIENT DETAILS */}

                    <div
                        className="
                            border-r
                            border-[#EFE2D7]
                            px-5
                            py-5
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Patient Details
                    </div>


                    {/* THERAPY */}

                    <div
                        className="
                            border-r
                            border-[#EFE2D7]
                            px-5
                            py-5
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Therapy
                    </div>


                    {/* TIME */}

                    <div
                        className="
                            border-r
                            border-[#EFE2D7]
                            px-5
                            py-5
                            text-center
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Time
                    </div>


                    {/* DOCTOR */}

                    <div
                        className="
                            border-r
                            border-[#EFE2D7]
                            px-5
                            py-5
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Doctor
                    </div>


                    {/* THERAPIST */}

                    <div
                        className="
                            border-r
                            border-[#EFE2D7]
                            px-5
                            py-5
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Therapist
                    </div>


                    {/* ROOM */}

                    <div
                        className="
                            border-r
                            border-[#EFE2D7]
                            px-4
                            py-5
                            text-center
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Room
                    </div>


                    {/* PRICE */}

                    <div
                        className="
                            border-r
                            border-[#EFE2D7]
                            px-4
                            py-5
                            text-center
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Price
                    </div>


                    {/* STATUS */}

                    <div
                        className="
                            px-4
                            py-5
                            text-center
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Status
                    </div>

                </div>


                {/* ================================= */}
                {/* LOADING */}
                {/* ================================= */}

                {loading ? (

                    <div
                        className="
                            flex
                            h-40
                            items-center
                            justify-center
                            text-[#8A756B]
                        "
                    >
                        Loading appointments...
                    </div>

                ) : appointments.length === 0 ? (

                    /* ================================= */
                    /* EMPTY */
                    /* ================================= */

                    <div
                        className="
                            flex
                            h-40
                            items-center
                            justify-center
                            text-[#8A756B]
                        "
                    >
                        No appointments found
                    </div>

                ) : (

                    /* ================================= */
                    /* APPOINTMENT ROWS */
                    /* ================================= */

                    <div className="min-w-[1100px]">

                        {appointments.map(
                            (appointment, index) => (

                                <div
                                    key={
                                        appointment.id ||
                                        `${appointment.patient_id}-${appointment.slot_time}-${index}`
                                    }
                                    className="
                                        grid
                                        grid-cols-[1.5fr_1.25fr_0.9fr_1.2fr_1.2fr_0.55fr_0.8fr_0.7fr]
                                        border-b
                                        border-[#EFE2D7]
                                        last:border-b-0
                                        transition
                                        hover:bg-[#FFFCF9]
                                    "
                                >

                                    {/* ================================= */}
                                    {/* PATIENT DETAILS */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            border-r
                                            border-[#EFE2D7]
                                            px-5
                                            py-5
                                        "
                                    >

                                        <h3
                                            className="
                                                text-[16px]
                                                font-semibold
                                                text-[#4D2E23]
                                            "
                                        >
                                            {appointment.patient_name ||
                                                "Unknown Patient"}
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                text-[13px]
                                                text-[#858585]
                                            "
                                        >
                                            Patient ID:{" "}

                                            {appointment.patient_id ||
                                                appointment.patient_code ||
                                                "-"}
                                        </p>

                                    </div>


                                    {/* ================================= */}
                                    {/* THERAPY */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            border-r
                                            border-[#EFE2D7]
                                            px-5
                                            py-5
                                        "
                                    >

                                        <h3
                                            className="
                                                text-[16px]
                                                font-semibold
                                                text-[#4D2E23]
                                            "
                                        >
                                            {appointment.therapy_name ||
                                                "Therapy"}
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                text-[13px]
                                                text-[#858585]
                                            "
                                        >
                                            {appointment.duration ||
                                                "-"}
                                        </p>

                                    </div>


                                    {/* ================================= */}
                                    {/* TIME */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            border-r
                                            border-[#EFE2D7]
                                            px-4
                                            py-5
                                            text-center
                                        "
                                    >

                                        <span
                                            className="
                                                text-[16px]
                                                font-semibold
                                                text-[#4D2E23]
                                            "
                                        >
                                            {appointment.time ||
                                                appointment.slot_time ||
                                                "-"}
                                        </span>

                                    </div>


                                    {/* ================================= */}
                                    {/* DOCTOR */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            border-r
                                            border-[#EFE2D7]
                                            px-5
                                            py-5
                                        "
                                    >

                                        <span
                                            className="
                                                text-[16px]
                                                font-semibold
                                                text-[#4D2E23]
                                            "
                                        >
                                            {appointment.doctor_name ||
                                                "-"}
                                        </span>

                                    </div>


                                    {/* ================================= */}
                                    {/* THERAPIST */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            border-r
                                            border-[#EFE2D7]
                                            px-5
                                            py-5
                                        "
                                    >

                                        <span
                                            className="
                                                text-[16px]
                                                font-semibold
                                                text-[#4D2E23]
                                            "
                                        >
                                            {appointment.therapist_name ||
                                                "-"}
                                        </span>

                                    </div>


                                    {/* ================================= */}
                                    {/* ROOM */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            border-r
                                            border-[#EFE2D7]
                                            px-4
                                            py-5
                                            text-center
                                        "
                                    >

                                        <span
                                            className="
                                                text-[16px]
                                                font-semibold
                                                text-[#4D2E23]
                                            "
                                        >
                                            {appointment.room ||
                                                "-"}
                                        </span>

                                    </div>


                                    {/* ================================= */}
                                    {/* PRICE */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            border-r
                                            border-[#EFE2D7]
                                            px-4
                                            py-5
                                            text-center
                                        "
                                    >

                                        <span
                                            className="
                                                text-[16px]
                                                font-semibold
                                                text-[#4D2E23]
                                            "
                                        >
                                            {formatPrice(
                                                appointment.price
                                            )}
                                        </span>

                                    </div>


                                    {/* ================================= */}
                                    {/* STATUS */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            px-4
                                            py-5
                                        "
                                    >

                                        <input
                                            type="checkbox"
                                            checked={isCompleted(
                                                appointment
                                            )}
                                            readOnly
                                            className="
                                                h-5
                                                w-5
                                                cursor-default
                                                accent-[#4D2E23]
                                            "
                                        />

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );
};


export default TherapistAppointments;