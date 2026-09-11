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
    useParams,
} from "react-router-dom";

import {
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineChevronDown,
    HiOutlineChevronUp,
    HiOutlineExclamationCircle,
} from "react-icons/hi2";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";

import {
    confirmFrontOfficeAppointmentRoom,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

// IMPORTANT:
// Keep the existing Home Visit GET thunk that is
// already present in your project here.
//
// Example:
// import {
//     loadHomeVisitConfirmation,
// } from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const HomevisitConfirmation = () => {

    const dispatch = useDispatch();

    const {
        doctorId,
    } = useParams();


    // ==========================================
    // REDUX
    // ==========================================

    const {
        homevisitConfirmation,
        homevisitConfirmationLoading,
        homevisitConfirmationError,


    } = useSelector(
        (state) =>
            state.frontOfficeAppointment
    );


    // ==========================================
    // LOCAL STATE
    // ==========================================

    const [
        expandedSlots,
        setExpandedSlots,
    ] = useState({});


    const [
        selectedRequests,
        setSelectedRequests,
    ] = useState({});



    // ==========================================
    // LOAD HOME VISIT DATA
    // ==========================================

    useEffect(() => {

        /*
         * Keep the Home Visit GET thunk
         * that already exists in your project.
         *
         * Example:
         *
         * dispatch(
         *     loadHomeVisitConfirmation(
         *         doctorId
         *     )
         * );
         */

    }, [
        dispatch,
        doctorId,
    ]);


    // ==========================================
    // API DATA
    // ==========================================
    const doctor =
        homevisitConfirmation?.doctor || {};

    const schedule =
        homevisitConfirmation
            ?.schedule_overview
            ?.schedule_slots || [];
    // ==========================================
    // PATIENT COUNT
    // ==========================================

    const patientCount =
        useMemo(() => {

            return schedule.reduce(
                (total, slot) => {

                    if (
                        slot.status ===
                        "conflict"
                    ) {

                        return (
                            total +
                            (
                                slot.requests
                                    ?.length || 0
                            )
                        );

                    }

                    if (
                        slot.patient_id ||
                        slot.patient_name
                    ) {

                        return total + 1;

                    }

                    return total;

                },
                0
            );

        }, [schedule]);


    // ==========================================
    // TOGGLE SLOT
    // ==========================================

    const handleToggleSlot = (
        index
    ) => {

        setExpandedSlots(
            (previous) => ({
                ...previous,

                [index]:
                    !previous[index],
            })
        );

    };


    // ==========================================
    // SELECT REQUEST
    // ==========================================

    const handleSelectRequest = (
        slot,
        request
    ) => {

        setSelectedRequests(
            (previous) => ({
                ...previous,

                [slot.time]:
                    request,
            })
        );

    };


    // ==========================================
    // ROOM CONFIRM
    // ==========================================

   


    // ==========================================
    // ROOM VALUE
    // ==========================================

    const getRoomValue = (
        slot,
        request
    ) => {

        const appointmentId =
            request?.appointment_id ||
            slot?.appointment_id ||
            slot?.id;


        return (
            selectedRooms[
            appointmentId
            ] ||
            request?.room_no ||
            slot?.room_no ||
            ""
        );

    };


    // ==========================================
    // ROOM SELECT
    // ==========================================




    // ==========================================
    // LOADING
    // ==========================================

    if (
    homevisitConfirmationLoading &&
    !homevisitConfirmation
) {

        return (
            <DashboardLayout
                role="frontoffice"
            >

                <div
                    className="
                        flex
                        min-h-screen
                        items-center
                        justify-center
                        bg-[#F7F7F7]
                    "
                >

                    <p
                        className="
                            text-[14px]
                            text-[#6F625C]
                        "
                    >
                        Loading home visit confirmation...
                    </p>

                </div>

            </DashboardLayout>
        );

    }


    return (
        <DashboardLayout
            role="frontoffice"
        >

            <div
                className="
                    min-h-screen
                    bg-[#F7F7F7]
                    px-6
                    py-5
                "
            >

                {/* ========================================= */}
                {/* SUCCESS */}
                {/* ========================================= */}

             


                {/* ========================================= */}
                {/* ERROR */}
                {/* ========================================= */}

               


                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

                <div
                    className="
                        mb-3
                        flex
                        items-center
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

                            <h1
                                className="
                                    text-[21px]
                                    font-semibold
                                    text-[#2F2926]
                                "
                            >
                                Pending Actions
                            </h1>

                            <span
                                className="
                                    text-[22px]
                                    text-[#8A817B]
                                "
                            >
                                ›
                            </span>

                            <h2
                                className="
                                    text-[21px]
                                    font-semibold
                                    text-[#2F2926]
                                "
                            >
                                Home Visit Confirmation
                            </h2>

                            <span
                                className="
                                    text-[22px]
                                    text-[#8A817B]
                                "
                            >
                                ›
                            </span>

                            <h2
                                className="
                                    text-[21px]
                                    font-semibold
                                    text-[#2F2926]
                                "
                            >
                                {
                                    doctor.doctor_name ||
                                    doctor.name ||
                                    "Doctor"
                                }
                            </h2>

                        </div>


                        <div
                            className="
                                mt-1
                                flex
                                items-center
                                gap-2
                                text-[13px]
                                text-[#634238]
                            "
                        >

                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-[#4B2E2A]
                                "
                            />

                            {patientCount} Patients

                        </div>

                    </div>

                </div>


                {/* ========================================= */}
                {/* DOCTOR INFORMATION */}
                {/* ========================================= */}

                <div
                    className="
                        mb-5
                        grid
                        grid-cols-[2.1fr_1.4fr_1.1fr_1fr_1.4fr]
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#E8D9CD]
                        bg-white
                    "
                >

                    {/* DOCTOR */}

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            border-r
                            border-[#EFE4DC]
                            px-5
                            py-4
                        "
                    >

                        {doctor.profile_image ? (

                            <img
                                src={
                                    doctor.profile_image
                                }
                                alt={
                                    doctor.doctor_name ||
                                    "Doctor"
                                }
                                className="
                                    h-14
                                    w-14
                                    rounded-full
                                    object-cover
                                "
                            />

                        ) : (

                            <div
                                className="
                                    h-14
                                    w-14
                                    rounded-full
                                    bg-[#EEE9E5]
                                "
                            />

                        )}


                        <div>

                            <p
                                className="
                                    text-[16px]
                                    font-semibold
                                    text-[#4D2E23]
                                "
                            >
                                {
                                    doctor.doctor_name ||
                                    doctor.name ||
                                    "Doctor"
                                }
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[12px]
                                    text-[#168276]
                                "
                            >
                                {
                                    doctor.specialization ||
                                    "Panchakarma Specialist"
                                }
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[12px]
                                    text-[#77716D]
                                "
                            >
                                🎓{" "}
                                {
                                    doctor.qualification ||
                                    "BAMS"
                                }
                            </p>

                        </div>

                    </div>


                    {/* CONSULTATION TYPE */}

                    <InfoBox
                        title="Consultation Type"
                        value={
                            doctor.consultation_type ||
                            "In-person and Video"
                        }
                    />


                    {/* FEES */}

                    <InfoBox
                        title="Consultation Fees"
                        value={
                            doctor.formatted_fees ||
                            (
                                doctor.consultation_fees
                                    ? `₹${Number(
                                        doctor.consultation_fees
                                    ).toLocaleString("en-IN")}`
                                    : "₹1,000"
                            )
                        }
                    />


                    {/* AVAILABLE SLOTS */}

                    <InfoBox
                        title="Available Slots"
                        value={
                            doctor.available_slots ??
                            schedule.length
                        }
                    />


                    {/* WORKING HOURS */}

                    <InfoBox
                        title="Working Hours"
                        value={
                            doctor.working_hours ||
                            "9:00 AM - 6:00 PM"
                        }
                        noBorder
                    />

                </div>


                {/* ========================================= */}
                {/* SCHEDULE */}
                {/* ========================================= */}

                <div
                    className="
                        overflow-hidden
                        rounded-[15px]
                        border
                        border-[#E8DDD6]
                        bg-white
                    "
                >

                    {/* HEADER */}

                    <div
                        className="
                            grid
                            grid-cols-[105px_1fr]
                            border-b
                            border-[#E8DDD6]
                            bg-[#FFF9F4]
                        "
                    >

                        <div
                            className="
                                border-r
                                border-[#E8DDD6]
                                px-5
                                py-4
                                text-[12px]
                                font-medium
                                text-[#4D2E23]
                            "
                        >
                            Time
                        </div>

                        <div
                            className="
                                px-5
                                py-4
                                text-[12px]
                                font-medium
                                text-[#4D2E23]
                            "
                        >
                            Schedule
                        </div>

                    </div>


                    {schedule.length === 0 ? (

                        <div
                            className="
                                px-6
                                py-16
                                text-center
                                text-sm
                                text-[#8B7A70]
                            "
                        >
                            No home visit appointments found.
                        </div>

                    ) : (

                        schedule.map(
                            (slot, index) => {

                                const requests =
                                    slot.requests ||
                                    [];


                                const isConflict =
                                    slot.status ===
                                    "conflict";


                                const selectedRequest =
                                    selectedRequests[
                                    slot.time
                                    ] ||
                                    requests[0] ||
                                    slot;


                                const roomValue =
                                    getRoomValue(
                                        slot,
                                        selectedRequest
                                    );


                                const isConfirmed =
                                    Boolean(
                                        roomValue
                                    ) ||
                                    slot.status ===
                                    "confirmed" ||
                                    slot.status ===
                                    "booked";


                                return (
                                    <div
                                        key={
                                            slot.id ||
                                            `${slot.time}-${index}`
                                        }
                                        className="
                                            grid
                                            grid-cols-[105px_1fr]
                                            border-b
                                            border-[#EFE4DC]
                                            last:border-b-0
                                        "
                                    >

                                        {/* TIME */}

                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-center
                                                border-r
                                                border-[#EFE4DC]
                                                px-3
                                                py-7
                                                text-[12px]
                                                font-medium
                                                text-[#4D2E23]
                                            "
                                        >
                                            {
                                                slot.time
                                            }
                                        </div>


                                        {/* SCHEDULE */}

                                        <div
                                            className="
                                                p-3
                                            "
                                        >

                                            {/* ========================= */}
                                            {/* CONFLICT */}
                                            {/* ========================= */}

                                            {isConflict && (

                                                <div
                                                    className="
                                                        rounded-xl
                                                        border
                                                        border-[#C9F0D1]
                                                        bg-[#EEFFF1]
                                                        px-3
                                                        py-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-between
                                                        "
                                                    >

                                                        <div>

                                                            <p
                                                                className="
                                                                    text-[13px]
                                                                    font-medium
                                                                    text-[#2F6B3A]
                                                                "
                                                            >
                                                                {
                                                                    slot.slot_range ||
                                                                    slot.time
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    flex
                                                                    items-center
                                                                    gap-1
                                                                    text-[11px]
                                                                    text-[#C84D4D]
                                                                "
                                                            >

                                                                <HiOutlineExclamationCircle
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                                Multiple bookings
                                                                for this slot

                                                            </p>

                                                        </div>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleToggleSlot(
                                                                    index
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-1
                                                                text-[11px]
                                                                font-medium
                                                                text-[#4D2E23]
                                                            "
                                                        >

                                                            View Requests (
                                                            {
                                                                requests.length
                                                            }
                                                            )

                                                            {expandedSlots[
                                                                index
                                                            ] ? (
                                                                <HiOutlineChevronUp
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            ) : (
                                                                <HiOutlineChevronDown
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            )}

                                                        </button>

                                                    </div>


                                                    {expandedSlots[
                                                        index
                                                    ] && (

                                                            <div
                                                                className="
                                                                mt-3
                                                                space-y-2
                                                            "
                                                            >

                                                                {requests.map(
                                                                    (
                                                                        request,
                                                                        requestIndex
                                                                    ) => (

                                                                        <div
                                                                            key={
                                                                                request.appointment_id ||
                                                                                requestIndex
                                                                            }
                                                                            className="
                                                                            rounded-xl
                                                                            border
                                                                            border-[#E8DDD6]
                                                                            bg-white
                                                                            px-3
                                                                            py-3
                                                                        "
                                                                        >

                                                                            <div
                                                                                className="
                                                                                flex
                                                                                items-center
                                                                                justify-between
                                                                                gap-3
                                                                            "
                                                                            >

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        handleSelectRequest(
                                                                                            slot,
                                                                                            request
                                                                                        )
                                                                                    }
                                                                                    className="
                                                                                    min-w-0
                                                                                    flex-1
                                                                                    text-left
                                                                                "
                                                                                >

                                                                                    <p
                                                                                        className="
                                                                                        text-[12px]
                                                                                        font-semibold
                                                                                        text-[#4D2E23]
                                                                                    "
                                                                                    >
                                                                                        {
                                                                                            request.patient_name
                                                                                        }
                                                                                    </p>

                                                                                    <p
                                                                                        className="
                                                                                        mt-1
                                                                                        text-[10px]
                                                                                        text-[#77716D]
                                                                                    "
                                                                                    >
                                                                                        Patient ID:{" "}
                                                                                        {
                                                                                            request.patient_code
                                                                                        }
                                                                                    </p>

                                                                                </button>


                                                                               

                                                                            </div>

                                                                        </div>

                                                                    )
                                                                )}

                                                            </div>

                                                        )}

                                                </div>

                                            )}


                                            {/* ========================= */}
                                            {/* NORMAL SLOT */}
                                            {/* ========================= */}

                                            {!isConflict &&
                                                (
                                                    slot.patient_id ||
                                                    slot.patient_name
                                                ) && (

                                                    <div
                                                        className={`
                                                            rounded-xl
                                                            border
                                                            px-3
                                                            py-3
                                                            ${isConfirmed
                                                                ? "border-[#C9F0D1] bg-[#EEFFF1]"
                                                                : "border-[#F1DFC4] bg-[#FFF7E9]"
                                                            }
                                                        `}
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                justify-between
                                                                gap-3
                                                            "
                                                        >

                                                            <div>

                                                                <p
                                                                    className={`
                                                                        text-[13px]
                                                                        font-medium
                                                                        ${isConfirmed
                                                                            ? "text-[#2F6B3A]"
                                                                            : "text-[#6A3F2D]"
                                                                        }
                                                                    `}
                                                                >
                                                                    {
                                                                        slot.slot_range ||
                                                                        slot.time
                                                                    }
                                                                </p>

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-[13px]
                                                                        text-[#315C39]
                                                                    "
                                                                >
                                                                    {
                                                                        slot.patient_name ||
                                                                        "-"
                                                                    }
                                                                </p>

                                                            </div>


                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                "
                                                            >

                                                               


                                                                {isConfirmed ? (

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            items-center
                                                                            gap-1
                                                                            text-[11px]
                                                                            font-medium
                                                                            text-[#315C39]
                                                                        "
                                                                    >
                                                                        Confirmed

                                                                        <HiOutlineCheckCircle
                                                                            size={
                                                                                17
                                                                            }
                                                                        />

                                                                    </div>

                                                                ) : (

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            items-center
                                                                            gap-1
                                                                            text-[11px]
                                                                            text-[#7A6658]
                                                                        "
                                                                    >
                                                                        Pending

                                                                        <HiOutlineClock
                                                                            size={
                                                                                16
                                                                            }
                                                                        />

                                                                    </div>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>

                                                )}

                                        </div>

                                    </div>
                                );

                            }
                        )

                    )}

                </div>

            </div>

        </DashboardLayout>
    );
};


// ==========================================
// INFO BOX
// ==========================================

const InfoBox = ({
    title,
    value,
    noBorder = false,
}) => (

    <div
        className={`
            flex
            flex-col
            justify-center
            px-5
            py-4
            ${!noBorder
                ? "border-r border-[#EFE4DC]"
                : ""
            }
        `}
    >

        <p
            className="
                text-[12px]
                text-[#6F625C]
            "
        >
            {title}
        </p>

        <p
            className="
                mt-1
                text-[15px]
                font-semibold
                text-[#4D2E23]
            "
        >
            {value}
        </p>

    </div>

);


export default HomevisitConfirmation;