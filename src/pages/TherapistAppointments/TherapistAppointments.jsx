import {
    useEffect,
    useRef,
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
    HiOutlineCalendar,
    HiOutlinePencil,
} from "react-icons/hi2";

import {
    loadTherapistAppointments,
    completeTherapistAppointments,
    updateTherapistAppointmentStatusThunk,
} from "../../redux/therapist/therapistThunk";


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
        completingAppointments,
        updatingAppointmentStatus,
    } = useSelector(
        (state) => state.therapist
    );


    // ==========================================
    // CHECKBOX STATE
    // ==========================================


    // ==========================================
    // NOTES STATE
    // ==========================================

    const [
        appointmentNotes,
        setAppointmentNotes,
    ] = useState({});

useEffect(() => {
    const notesMap = {};

    appointments.forEach((appointment) => {
        const bookingId =
            appointment.booking_id ||
            appointment.id;

        if (!bookingId) {
            return;
        }

        notesMap[bookingId] =
            appointment.therapy_notes ||
            appointment.notes ||
            "";
    });

    setAppointmentNotes(notesMap);
}, [appointments]);


    // ==========================================
    // EDITING NOTE STATE
    // ==========================================

    const [
        editingNote,
        setEditingNote,
    ] = useState(null);


    // ==========================================
    // NOTE INPUT REFERENCES
    // ==========================================

    const noteInputRefs =
        useRef({});


    // ==========================================
    // LOAD APPOINTMENTS
    // ==========================================

    useEffect(() => {

        dispatch(
            loadTherapistAppointments()
        );

    }, [dispatch]);


    // ==========================================
    // CHECK COMPLETED
    // ==========================================

    const isCompleted = (
        appointment
    ) => {

        return (
            appointment.is_completed === true ||
            appointment.status?.toLowerCase() ===
            "completed"
        );

    };


    // ==========================================
    // GET BOOKING ID
    // ==========================================

    const getBookingId = (
        appointment
    ) => {

        return (
            appointment.booking_id ||
            appointment.id
        );

    };


    // ==========================================
    // HANDLE NOTE CHANGE
    // ==========================================

    const handleNoteChange = (
        appointment,
        value
    ) => {

        const bookingId =
            getBookingId(
                appointment
            );


        if (!bookingId) {
            return;
        }


        setAppointmentNotes(
            (prev) => ({

                ...prev,

                [bookingId]:
                    value,

            })
        );

    };


    // ==========================================
    // START EDIT NOTE
    // ==========================================

    const handleEditNote = (
        appointment
    ) => {

        const bookingId =
            getBookingId(
                appointment
            );


        if (!bookingId) {
            return;
        }


        setEditingNote(
            bookingId
        );


        setTimeout(() => {

            noteInputRefs.current[
                bookingId
            ]?.focus();

        }, 50);

    };


    // ==========================================
    // CANCEL EDIT NOTE
    // ==========================================

    const handleCancelNote = (
        appointment
    ) => {

        const bookingId =
            getBookingId(
                appointment
            );


        if (!bookingId) {
            return;
        }


        // Restore original note

        setAppointmentNotes(
            (prev) => ({

                ...prev,

                [bookingId]:
                    appointment.therapy_notes || "",

            })
        );


        setEditingNote(
            null
        );

    };


    // ==========================================
    // SAVE NOTE
    // ==========================================
    // Uses the SAME PUT API.
    //
    // Sends:
    // booking_ids
    // notes
    // status
    // ==========================================

    const handleSaveNote = async (
        appointment
    ) => {

        const bookingId =
            getBookingId(
                appointment
            );


        if (!bookingId) {
            return;
        }


        const notes =
            appointmentNotes[
                bookingId
            ] || "";


        try {

            await dispatch(
                completeTherapistAppointments({

                    bookingIds: [
                        bookingId,
                    ],

                    notes,

                })
            ).unwrap();


            setEditingNote(
                null
            );


            // Reload latest API data

            dispatch(
                loadTherapistAppointments()
            );


        } catch (error) {

            console.error(
                "Failed to update note:",
                error
            );

        }

    };


    // ==========================================
    // HANDLE STATUS CHANGE
    // ==========================================


    // ==========================================
    // HANDLE STATUS CHANGE
    // ==========================================


    // ==========================================
    // MARK APPOINTMENT AS COMPLETED
    // ==========================================

    const handleCompleteAppointment = async (
        appointment
    ) => {

        const bookingId =
            getBookingId(
                appointment
            );


        if (!bookingId) {

            console.error(
                "Booking ID not found:",
                appointment
            );

            return;
        }


        // Already completed

        if (isCompleted(appointment)) {
            return;
        }


        try {

            await dispatch(
                updateTherapistAppointmentStatusThunk({

                    bookingIds: [
                        bookingId,
                    ],

                    status: "completed",

                })
            ).unwrap();


            console.log(
                "Appointment marked as completed:",
                bookingId
            );


            // Reload latest appointment data

            await dispatch(
                loadTherapistAppointments()
            ).unwrap();


        } catch (error) {

            console.error(
                "Failed to complete appointment:",
                error
            );

        }

    };


    // ==========================================
    // FORMAT PRICE
    // ==========================================


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div
            className="
                min-h-screen
                bg-[#F8F6F3]
                px-8
                py-6
            "
        >

            {/* ================================= */}
            {/* BACK BUTTON */}
            {/* ================================= */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/therapist/dashboard"
                    )
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

                        <span
                            className="
                                mr-2
                                text-[#4D2E23]
                            "
                        >
                            •
                        </span>

                        {count} Patient
                        {count !== 1
                            ? "s"
                            : ""}

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
                        : error?.message ||
                        "Failed to load appointments"}

                </div>

            )}


            {/* ================================= */}
            {/* TABLE OUTER */}
            {/* ================================= */}

            <div
                className="
                    mt-6
                    overflow-x-auto
                    rounded-[24px]
                    border
                    border-[#E7DBD3]
                    bg-white
                "
            >

                {/* ================================= */}
                {/* FIXED TABLE WIDTH */}
                {/* ================================= */}

                <div
                    className="
                        min-w-[1410px]
                    "
                >

                    {/* ================================= */}
                    {/* TABLE HEADER */}
                    {/* ================================= */}

                    <div
                        className="
                            grid
                            grid-cols-[210px_160px_125px_160px_160px_70px_205px_245px_110px]
                            border-b
                            border-[#EFE2D7]
                            bg-[#FFF9F3]
                        "
                    >

                        {/* PATIENT */}

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
                                px-3
                                py-5
                                text-center
                                text-[15px]
                                font-semibold
                                text-[#4D2E23]
                            "
                        >
                            Room
                        </div>


                        {/* DOCTOR NOTES */}

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
                            Doctor Notes
                        </div>


                        {/* THERAPIST NOTES */}

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
                            Therapist Notes
                        </div>


                        {/* STATUS */}

                        <div
                            className="
                                px-3
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
                        /* ROWS */
                        /* ================================= */

                        <div>

                            {appointments.map(
                                (
                                    appointment,
                                    index
                                ) => {

                                    const bookingId =
                                        getBookingId(
                                            appointment
                                        );


                                    const note =
                                        appointmentNotes[
                                            bookingId
                                        ] || "";


                                    const isEditing =
                                        editingNote ===
                                        bookingId;


                                    return (

                                        <div
                                            key={
                                                bookingId ||
                                                `${appointment.patient_id}-${appointment.slot_time}-${index}`
                                            }
                                            className={`
                                                grid
                                                grid-cols-[210px_160px_125px_160px_160px_70px_205px_245px_110px]
                                                border-b
                                                border-[#EFE2D7]
                                                last:border-b-0
                                                transition
                                                hover:bg-[#FFFCF9]
                                                ${
                                                    isEditing
                                                        ? "bg-[#FFF5EA]"
                                                        : ""
                                                }
                                            `}
                                        >

                                            {/* ================================= */}
                                            {/* PATIENT DETAILS */}
                                            {/* ================================= */}

                                            <div
                                                className="
                                                    min-w-0
                                                    border-r
                                                    border-[#EFE2D7]
                                                    px-5
                                                    py-5
                                                "
                                            >

                                                <h3
                                                    className="
                                                        truncate
                                                        text-[16px]
                                                        font-semibold
                                                        text-[#4D2E23]
                                                    "
                                                    title={
                                                        appointment.patient_name
                                                    }
                                                >
                                                    {appointment.patient_name ||
                                                        "Unknown Patient"}
                                                </h3>


                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
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
                                                    min-w-0
                                                    border-r
                                                    border-[#EFE2D7]
                                                    px-5
                                                    py-5
                                                "
                                            >

                                                <h3
                                                    className="
                                                        truncate
                                                        text-[16px]
                                                        font-semibold
                                                        text-[#4D2E23]
                                                    "
                                                    title={
                                                        appointment.therapy_name
                                                    }
                                                >
                                                    {appointment.therapy_name ||
                                                        "Therapy"}
                                                </h3>


                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
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
                                                        whitespace-nowrap
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
                                                    min-w-0
                                                    items-center
                                                    border-r
                                                    border-[#EFE2D7]
                                                    px-5
                                                    py-5
                                                "
                                            >

                                                <span
                                                    className="
                                                        truncate
                                                        text-[16px]
                                                        font-semibold
                                                        text-[#4D2E23]
                                                    "
                                                    title={
                                                        appointment.doctor_name ||
                                                        ""
                                                    }
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
                                                    min-w-0
                                                    items-center
                                                    border-r
                                                    border-[#EFE2D7]
                                                    px-5
                                                    py-5
                                                "
                                            >

                                                <span
                                                    className="
                                                        truncate
                                                        text-[16px]
                                                        font-semibold
                                                        text-[#4D2E23]
                                                    "
                                                    title={
                                                        appointment.therapist_name ||
                                                        ""
                                                    }
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
                                                    px-3
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
                                                    {appointment.room ||
                                                        "-"}
                                                </span>

                                            </div>


                                            {/* ================================= */}
                                            {/* DOCTOR NOTES */}
                                            {/* ================================= */}

                                            <div
                                                className="
                                                    flex
                                                    min-w-0
                                                    items-center
                                                    border-r
                                                    border-[#EFE2D7]
                                                    px-3
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        min-h-[50px]
                                                        w-full
                                                        min-w-0
                                                        items-center
                                                        rounded-full
                                                        border
                                                        border-[#E7D6C5]
                                                        bg-white
                                                        px-4
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            min-w-0
                                                            flex-1
                                                            text-[14px]
                                                            text-[#3F332E]
                                                            line-clamp-2
                                                        "
                                                        title={
                                                            appointment.doctor_prescription_therpay_notes ||
                                                            ""
                                                        }
                                                    >
                                                        {appointment.doctor_prescription_therpay_notes ||
                                                            "No notes."}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* ================================= */}
                                            {/* THERAPIST NOTES */}
                                            {/* ================================= */}

                                            <div
                                                className="
                                                    flex
                                                    min-w-0
                                                    items-center
                                                    border-r
                                                    border-[#EFE2D7]
                                                    px-3
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        h-[50px]
                                                        w-full
                                                        min-w-0
                                                        items-center
                                                        rounded-full
                                                        border
                                                        border-[#E7D6C5]
                                                        bg-white
                                                        px-4
                                                    "
                                                >

                                                    {/* NOTE INPUT */}

                                                    <input
                                                        ref={(element) => {

                                                            noteInputRefs.current[
                                                                bookingId
                                                            ] = element;

                                                        }}
                                                        type="text"
                                                        value={note}
                                                        onChange={(event) =>
                                                            handleNoteChange(
                                                                appointment,
                                                                event.target.value
                                                            )
                                                        }
                                                        onKeyDown={(
                                                            event
                                                        ) => {

                                                            if (
                                                                event.key ===
                                                                "Enter"
                                                            ) {

                                                                event.preventDefault();

                                                                handleSaveNote(
                                                                    appointment
                                                                );

                                                            }


                                                            if (
                                                                event.key ===
                                                                "Escape"
                                                            ) {

                                                                handleCancelNote(
                                                                    appointment
                                                                );

                                                            }

                                                        }}
                                                        disabled={
                                                            !isEditing
                                                        }
                                                        placeholder="Add note..."
                                                        maxLength={500}
                                                        className="
                                                            min-w-0
                                                            flex-1
                                                            bg-transparent
                                                            text-[14px]
                                                            text-[#3F332E]
                                                            outline-none
                                                            placeholder:text-[#858585]
                                                            disabled:cursor-default
                                                        "
                                                    />


                                                    {/* NOTE ACTION */}

                                                    {isEditing ? (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSaveNote(
                                                                    appointment
                                                                )
                                                            }
                                                            disabled={
                                                                updatingAppointmentStatus
                                                            }
                                                            className="
                                                                ml-2
                                                                flex
                                                                h-8
                                                                w-8
                                                                flex-shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                text-[#4D2E23]
                                                                transition
                                                                hover:bg-[#F7EDE5]
                                                                disabled:opacity-50
                                                            "
                                                            title="Save note"
                                                        >

                                                            <HiOutlineCalendar
                                                                size={18}
                                                                className="
                                                                    rotate-45
                                                                "
                                                            />

                                                        </button>

                                                    ) : (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditNote(
                                                                    appointment
                                                                )
                                                            }
                                                            className="
                                                                ml-2
                                                                flex
                                                                h-8
                                                                w-8
                                                                flex-shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                text-[#4D2E23]
                                                                transition
                                                                hover:bg-[#F7EDE5]
                                                            "
                                                            title="Edit note"
                                                        >

                                                            <HiOutlinePencil
                                                                size={19}
                                                            />

                                                        </button>

                                                    )}

                                                </div>

                                            </div>


                                            {/* ================================= */}
                                            {/* STATUS */}
                                            {/* ================================= */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    px-3
                                                    py-5
                                                "
                                            >

                                                {isCompleted(
                                                    appointment
                                                ) ? (

                                                    <button
                                                        type="button"
                                                        disabled
                                                        className="
                                                            rounded-full
                                                            border
                                                            border-[#E7DBD3]
                                                            bg-[#FFF9F3]
                                                            px-6
                                                            py-3
                                                            text-[15px]
                                                            font-semibold
                                                            text-[#4D2E23]
                                                            opacity-70
                                                            cursor-default
                                                        "
                                                    >
                                                        Done
                                                    </button>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            updatingAppointmentStatus
                                                        }
                                                        onClick={() =>
                                                            handleCompleteAppointment(
                                                                appointment
                                                            )
                                                        }
                                                        className="
                                                            rounded-full
                                                            border
                                                            border-[#E7DBD3]
                                                            bg-white
                                                            px-6
                                                            py-3
                                                            text-[15px]
                                                            font-semibold
                                                            text-[#4D2E23]
                                                            transition
                                                            hover:bg-[#FFF9F3]
                                                            hover:border-[#DCC8B8]
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                        "
                                                    >
                                                        {updatingAppointmentStatus
                                                            ? "..."
                                                            : "Done"}
                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};


export default TherapistAppointments;