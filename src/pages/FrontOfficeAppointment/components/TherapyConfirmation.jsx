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
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    HiOutlineExclamationCircle,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineChevronUp,
    HiOutlineChevronDown,
    
} from "react-icons/hi2";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";

import {
    confirmFrontOfficeAppointmentRoom,
    
    loadFrontOfficeTherapyAppointmentConfirmation,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const TherapyConfirmation = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();




    // ==========================================
    // REDUX
    // ==========================================

    const {
        therapyConfirmation,
        therapyConfirmationLoading,
        therapyConfirmationError,

        confirmingRoomAppointment,
        roomAppointmentSuccess,
        roomAppointmentMessage,
        roomAppointmentError,
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


    const [
        selectedRooms,
        setSelectedRooms,
    ] = useState({});


    // ==========================================
    // LOAD THERAPY CONFIRMATION
    // ==========================================

    useEffect(() => {

        dispatch(
            loadFrontOfficeTherapyAppointmentConfirmation()
        );

    }, [
        dispatch,
    ]);


    // ==========================================
    // API DATA
    // ==========================================

    const doctor =
    therapyConfirmation?.doctor || {};

const schedule =
    therapyConfirmation
        ?.schedule_overview
        ?.schedule_slots || [];

const history =
    therapyConfirmation
        ?.patient_history_with_doctor || [];
    // ==========================================
    // PATIENT COUNT
    // ==========================================

    const pendingPatientCount =
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

                    return total;

                },
                0
            );

        }, [schedule]);


    // ==========================================
    // TOGGLE SLOT
    // ==========================================

    const handleToggleSlot = (
        slot,
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
    // ROOM CHANGE
    // ==========================================

    const handleRoomChange = async (
        slot,
        request,
        roomNo
    ) => {

        if (!roomNo) {
            return;
        }


        if (
            !request?.appointment_id
        ) {
            console.error(
                "Appointment ID not found:",
                request
            );

            return;
        }


        if (
            !request?.patient_id
        ) {
            console.error(
                "Patient ID not found:",
                request
            );

            return;
        }


        // ==========================================
        // STORE SELECTED ROOM
        // ==========================================

        setSelectedRooms(
            (previous) => ({
                ...previous,

                [request.appointment_id]:
                    roomNo,
            })
        );


        // ==========================================
        // CONFIRM ROOM
        // ==========================================

        try {

            await dispatch(
                confirmFrontOfficeAppointmentRoom(
                    {
                        slot_time:
                            slot.time,

                        patient_id:
                            request.patient_id,

                        appointment_id:
                            request.appointment_id,

                        room_no:
                            roomNo,
                    }
                )
            ).unwrap();


            // ==========================================
            // RELOAD SCREEN
            // ==========================================

            dispatch(
                loadFrontOfficeTherapyAppointmentConfirmation()
            );

        } catch (error) {

            console.error(
                "Room confirmation failed:",
                error
            );

        }

    };


    // ==========================================
    // GET ROOM
    // ==========================================

    const getRoomValue = (
        slot,
        request
    ) => {

        return (
            selectedRooms[
            request?.appointment_id
            ] ||
            request?.room_no ||
            slot?.room_no ||
            ""
        );

    };


    // ==========================================
    // RENDER ROOM SELECT
    // ==========================================

    const RoomSelect = ({
        slot,
        request,
    }) => {

        const roomValue =
            getRoomValue(
                slot,
                request
            );


        const isConfirming =
            Boolean(
                confirmingRoomAppointment
            );


        return (
            <select
                value={roomValue}
                disabled={
                    isConfirming
                }
                onChange={(event) =>
                    handleRoomChange(
                        slot,
                        request,
                        event.target.value
                    )
                }
                className="
                    h-9
                    min-w-[118px]
                    cursor-pointer
                    appearance-none
                    rounded-[10px]
                    border
                    border-[#E7D5C4]
                    bg-white
                    px-3
                    pr-8
                    text-[11px]
                    font-medium
                    text-[#4D2E23]
                    outline-none
                    transition
                    focus:border-[#8A5035]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >

                <option value="">
                    Select room no.
                </option>

                <option value="Room 1">
                    Room 1
                </option>

                <option value="Room 2">
                    Room 2
                </option>

                <option value="Room 3">
                    Room 3
                </option>

                <option value="Room 4">
                    Room 4
                </option>

                <option value="Room 5">
                    Room 5
                </option>

            </select>
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (
        therapyConfirmationLoading &&
        !therapyConfirmation
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
                        Loading therapy confirmation...
                    </p>

                </div>

            </DashboardLayout>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (
        therapyConfirmationError &&
        !therapyConfirmation
    ) {

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

                    <div
                        className="
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-600
                        "
                    >
                        {typeof therapyConfirmationError ===
                            "string"
                            ? therapyConfirmationError
                            : "Failed to load therapy confirmation."}
                    </div>

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

                {roomAppointmentSuccess &&
                    roomAppointmentMessage && (

                        <div
                            className="
                                mb-4
                                rounded-xl
                                border
                                border-green-200
                                bg-green-50
                                px-4
                                py-3
                                text-sm
                                text-green-700
                            "
                        >
                            {
                                roomAppointmentMessage
                            }
                        </div>

                    )}


                {/* ========================================= */}
                {/* ERROR */}
                {/* ========================================= */}

                {roomAppointmentError && (

                    <div
                        className="
                            mb-4
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-600
                        "
                    >
                        {typeof roomAppointmentError ===
                            "string"
                            ? roomAppointmentError
                            : "Failed to confirm appointment room."}
                    </div>

                )}


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
                                Therapy Confirmation
                            </h2>

                            {doctor?.name && (
                                <>
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
                                            doctor.name
                                        }
                                    </h2>
                                </>
                            )}

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

                            {pendingPatientCount}{" "}
                            Patients

                        </div>

                    </div>

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

                    {/* TABLE HEADER */}

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


                    {/* SLOTS */}

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
                            No therapy appointments found.
                        </div>

                    ) : (

                        schedule.map(
                            (slot, index) => {

                                const isConflict =
                                    slot.status ===
                                    "conflict";


                                const requests =
                                    slot.requests ||
                                    [];


                                const selectedRequest =
                                    selectedRequests[
                                    slot.time
                                    ] ||
                                    requests[0] ||
                                    (
                                        slot.appointment_id
                                            ? slot
                                            : null
                                    );


                                const roomValue =
                                    selectedRequest
                                        ? getRoomValue(
                                            slot,
                                            selectedRequest
                                        )
                                        : "";


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
                                            {/* EMPTY / AVAILABLE */}
                                            {/* ========================= */}

                                            {!isConflict &&
                                                !slot.patient_name &&
                                                !slot.appointment_id &&
                                                requests.length ===
                                                0 && (

                                                    <div
                                                        className="
                                                            min-h-[54px]
                                                        "
                                                    />

                                                )}


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
                                                                    slot,
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
                                                                    ) => {

                                                                        const selected =
                                                                            selectedRequest
                                                                                ?.appointment_id ===
                                                                            request.appointment_id;


                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    request.appointment_id ||
                                                                                    requestIndex
                                                                                }
                                                                                className={`
                                                                                rounded-xl
                                                                                border
                                                                                px-3
                                                                                py-3
                                                                                ${selected
                                                                                        ? "border-[#8A5035] bg-[#FFF6EF]"
                                                                                        : "border-[#E8DDD6] bg-white"
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


                                                                                    <RoomSelect
                                                                                        slot={
                                                                                            slot
                                                                                        }
                                                                                        request={
                                                                                            request
                                                                                        }

                                                                                    />

                                                                                </div>

                                                                            </div>
                                                                        );

                                                                    }
                                                                )}

                                                            </div>

                                                        )}

                                                </div>

                                            )}


                                            {/* ========================= */}
                                            {/* NORMAL BOOKED/PENDING */}
                                            {/* ========================= */}

                                            {!isConflict &&
                                                (
                                                    slot.patient_name ||
                                                    slot.appointment_id
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
                                                                    className={`
                                                                        mt-1
                                                                        text-[13px]
                                                                        ${isConfirmed
                                                                            ? "text-[#315C39]"
                                                                            : "text-[#6A3F2D]"
                                                                        }
                                                                    `}
                                                                >
                                                                    {
                                                                        slot.patient_name ||
                                                                        selectedRequest?.patient_name ||
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

                                                                {selectedRequest &&
                                                                     (

                                                                        <RoomSelect
                                                                            slot={
                                                                                slot
                                                                            }
                                                                            request={
                                                                                selectedRequest
                                                                            }
                                                                        />

                                                                    )}


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


                {/* ========================================= */}
                {/* HISTORY */}
                {/* ========================================= */}

                <div
                    className="
                        mt-4
                        rounded-2xl
                        border
                        border-[#E8D9CD]
                        bg-white
                        p-4
                    "
                >

                    <h2
                        className="
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Appointment History with Doctor
                    </h2>


                    <div
                        className="
                            mt-3
                            border-t
                            border-[#EFE4DC]
                        "
                    />


                    {history.length === 0 ? (

                        <p
                            className="
                                py-8
                                text-center
                                text-[12px]
                                text-[#8B7A70]
                            "
                        >
                            No appointment history.
                        </p>

                    ) : (

                        history
                            .slice(0, 5)
                            .map(
                                (
                                    item,
                                    index
                                ) => (

                                    <div
                                        key={
                                            item.id ||
                                            item.appointment_id ||
                                            index
                                        }
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            border-b
                                            border-[#EFE4DC]
                                            py-4
                                        "
                                    >

                                        <div>

                                            <p
                                                className="
                                                    text-[12px]
                                                    font-medium
                                                    text-[#4D2E23]
                                                "
                                            >
                                                {
                                                    item.patient_name
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
                                                    item.patient_code
                                                }
                                            </p>

                                        </div>


                                        <div
                                            className="
                                                text-right
                                            "
                                        >

                                            <p
                                                className="
                                                    text-[10px]
                                                    text-[#77716D]
                                                "
                                            >
                                                {
                                                    item.date
                                                }
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-[10px]
                                                    text-[#77716D]
                                                "
                                            >
                                                {
                                                    item.time
                                                }
                                            </p>

                                        </div>

                                    </div>

                                )
                            )

                    )}

                </div>


            </div>

        </DashboardLayout>
    );
};


export default TherapyConfirmation;