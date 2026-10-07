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
    HiOutlineArrowLeft,

} from "react-icons/hi2";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";

import {
    confirmFrontOfficeAppointmentRoom,
    loadFrontOfficeTherapyAppointmentConfirmation,
    loadTherapistList,
    selectFrontOfficeTherapist,
    rescheduleFrontOfficeTherapyAppointment,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";
import { showErrorToast, showSuccessToast } from "../../../../utils/showToast";

const TherapyConfirmation = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [openRoomDropdown, setOpenRoomDropdown] = useState(null);
    const [openTherapistDropdown, setOpenTherapistDropdown] =
        useState(null);


    // ==========================================
    // REDUX
    // ==========================================

    const {
        therapyConfirmation,
        therapyConfirmationLoading,
        therapyConfirmationError,



        therapistList,
        therapistListLoading,
        selectTherapistLoading,

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

    const [
        selectedTherapists,
        setSelectedTherapists,
    ] = useState({});

    // ==========================================
    // DRAG AND DROP STATE
    // ==========================================

    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverTime, setDragOverTime] = useState(null);
    const [isReschedulingLocal, setIsReschedulingLocal] = useState(false);

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

    useEffect(() => {

        dispatch(
            loadTherapistList()
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
    // DRAG GRIP ICON
    // ==========================================

    const DragGripIcon = () => (
        <div
            className="mr-1 flex flex-shrink-0 cursor-grab items-center px-1 text-[#A8988B] transition-colors hover:text-[#4D2E23] active:cursor-grabbing"
            title="Drag to reschedule appointment to another time"
        >
            <svg
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="currentColor"
                className="opacity-70 transition-opacity group-hover:opacity-100"
            >
                <circle cx="2" cy="2" r="1.2" />
                <circle cx="6" cy="2" r="1.2" />
                <circle cx="2" cy="7" r="1.2" />
                <circle cx="6" cy="7" r="1.2" />
                <circle cx="2" cy="12" r="1.2" />
                <circle cx="6" cy="12" r="1.2" />
            </svg>
        </div>
    );


    // ==========================================
    // DOCTOR & DATE RESOLUTION
    // ==========================================

    const fallbackDoctorId = useMemo(() => {
        return (
            doctor?.doctor_id ||
            doctor?.id ||
            therapyConfirmation?.doctor_id ||
            therapyConfirmation?.doctor?.doctor_id ||
            therapyConfirmation?.doctor?.id ||
            schedule.find((s) => s.doctor_id)?.doctor_id ||
            history.find((h) => h.doctor_id)?.doctor_id ||
            ""
        );
    }, [doctor, therapyConfirmation, schedule, history]);

    const formatBookingDate = (dateVal) => {
        if (!dateVal) {
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, "0");
            const d = String(today.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
            return dateVal;
        }
        if (typeof dateVal === "string" && dateVal.includes("T")) {
            return dateVal.split("T")[0];
        }
        const parsed = new Date(dateVal);
        if (!isNaN(parsed.getTime())) {
            const y = parsed.getFullYear();
            const m = String(parsed.getMonth() + 1).padStart(2, "0");
            const d = String(parsed.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        }
        return String(dateVal);
    };

    const defaultBookingDate = useMemo(() => {
        return formatBookingDate(
            therapyConfirmation?.booking_date ||
            therapyConfirmation?.date ||
            therapyConfirmation?.schedule_overview?.date ||
            therapyConfirmation?.schedule_overview?.booking_date
        );
    }, [therapyConfirmation]);


    // ==========================================
    // DRAG AND DROP HANDLERS
    // ==========================================

    const handleDragStartRequest = (e, request, slot) => {
        if (openRoomDropdown || openTherapistDropdown || isReschedulingLocal) {
            e.preventDefault();
            return;
        }

        const appointmentId = request?.appointment_id || request?.id;
        if (!appointmentId) {
            console.error("Missing appointment_id on request:", request);
            return;
        }

        const item = {
            appointment_id: appointmentId,
            patient_id: request.patient_id,
            patient_name: request.patient_name,
            patient_code: request.patient_code,
            source_time: slot.time,
            doctor_id:
                request.doctor_id ||
                slot.doctor_id ||
                fallbackDoctorId,
            booking_date: formatBookingDate(
                request.booking_date ||
                request.date ||
                slot.booking_date ||
                slot.date ||
                defaultBookingDate
            ),
        };

        e.dataTransfer.setData("application/json", JSON.stringify(item));
        e.dataTransfer.effectAllowed = "move";
        setDraggedItem(item);
    };

    const handleDragStartSlot = (e, slot, selectedRequest) => {
        if (openRoomDropdown || openTherapistDropdown || isReschedulingLocal) {
            e.preventDefault();
            return;
        }

        const appointmentId =
            slot?.appointment_id ||
            selectedRequest?.appointment_id ||
            slot?.id;

        if (!appointmentId) {
            console.error("Missing appointment_id on slot:", slot);
            return;
        }

        const item = {
            appointment_id: appointmentId,
            patient_id: slot.patient_id || selectedRequest?.patient_id,
            patient_name: slot.patient_name || selectedRequest?.patient_name,
            patient_code: slot.patient_code || selectedRequest?.patient_code,
            source_time: slot.time,
            doctor_id:
                slot.doctor_id ||
                selectedRequest?.doctor_id ||
                fallbackDoctorId,
            booking_date: formatBookingDate(
                slot.booking_date ||
                selectedRequest?.booking_date ||
                slot.date ||
                selectedRequest?.date ||
                defaultBookingDate
            ),
        };

        e.dataTransfer.setData("application/json", JSON.stringify(item));
        e.dataTransfer.effectAllowed = "move";
        setDraggedItem(item);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverTime(null);
    };

    const handleDragOver = (e, slot) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOverTime !== slot.time) {
            setDragOverTime(slot.time);
        }
    };

    const handleDragLeave = (e, slot) => {
        if (e.currentTarget.contains(e.relatedTarget)) {
            return;
        }
        if (dragOverTime === slot.time) {
            setDragOverTime(null);
        }
    };

    const handleDrop = async (e, targetSlot) => {
        e.preventDefault();
        setDragOverTime(null);

        let data = draggedItem;
        if (!data) {
            try {
                const text = e.dataTransfer.getData("application/json");
                if (text) {
                    data = JSON.parse(text);
                }
            } catch (err) {
                console.error("Failed to parse drag data:", err);
            }
        }
        setDraggedItem(null);

        if (!data || !data.appointment_id) {
            return;
        }

        if (data.source_time === targetSlot.time) {
            showErrorToast(
                "Same Time Slot",
                `The appointment is already scheduled at ${targetSlot.time}.`
            );
            return;
        }

        const doctorId =
            data.doctor_id ||
            targetSlot.doctor_id ||
            fallbackDoctorId;

        const bookingDate = formatBookingDate(
            data.booking_date ||
            targetSlot.booking_date ||
            defaultBookingDate
        );

        const payload = {
            doctor_id: doctorId,
            appointment_id: data.appointment_id,
            booking_date: bookingDate,
            slot_time: targetSlot.time,
        };

        console.log("🚚 Rescheduling Therapy Appointment via Drag & Drop:", payload);

        setIsReschedulingLocal(true);

        try {
            const response = await dispatch(
                rescheduleFrontOfficeTherapyAppointment(payload)
            ).unwrap();

            showSuccessToast(
                "Therapy Rescheduled",
                response?.message ||
                `Therapy appointment successfully rescheduled to ${targetSlot.time}!`
            );

            // Reload confirmation data from backend
            await dispatch(
                loadFrontOfficeTherapyAppointmentConfirmation()
            );

        } catch (error) {
            console.error("❌ Reschedule error:", error);
            showErrorToast(
                "Reschedule Failed",
                error?.message ||
                error?.detail ||
                (typeof error === "string"
                    ? error
                    : "Unable to reschedule therapy appointment.")
            );
        } finally {
            setIsReschedulingLocal(false);
        }
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

        if (!request?.appointment_id) {
            console.error(
                "Appointment ID not found:",
                request
            );

            showErrorToast(
                "Room Selection Failed",
                "Appointment ID is missing."
            );

            return;
        }

        if (!request?.patient_id) {
            console.error(
                "Patient ID not found:",
                request
            );

            showErrorToast(
                "Room Selection Failed",
                "Patient ID is missing."
            );

            return;
        }


        // ==========================================
        // STORE ROOM LOCALLY IMMEDIATELY
        // ==========================================

        setSelectedRooms(
            (previous) => ({
                ...previous,

                [request.appointment_id]:
                    roomNo,
            })
        );


        try {

            console.log(
                "🏠 Confirming room:",
                {
                    slot_time: slot?.time,
                    patient_id:
                        request.patient_id,
                    appointment_id:
                        request.appointment_id,
                    room_no: roomNo,
                }
            );


            // ==========================================
            // API
            // ==========================================

            await dispatch(
                confirmFrontOfficeAppointmentRoom({
                    slot_time:
                        slot.time,

                    patient_id:
                        request.patient_id,

                    appointment_id:
                        request.appointment_id,

                    room_no:
                        roomNo,
                })
            ).unwrap();


            // ==========================================
            // SUCCESS
            // ==========================================

            showSuccessToast(
                "Room Confirmed",
                `${roomNo} has been assigned successfully.`
            );


            // IMPORTANT:
            // Don't immediately reload here.
            //
            // The local selectedRooms state already
            // contains the selected room.


        } catch (error) {

            console.error(
                "❌ Room confirmation failed:",
                error
            );

            console.error(
                "Backend error:",
                error?.response?.data || error
            );


            // ==========================================
            // REVERT LOCAL SELECTION
            // ==========================================

            setSelectedRooms(
                (previous) => {

                    const updated = {
                        ...previous,
                    };

                    delete updated[
                        request.appointment_id
                    ];

                    return updated;
                }
            );


            showErrorToast(
                "Room Confirmation Failed",
                error?.message ||
                error?.detail ||
                "Unable to confirm the selected room."
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
    // ==========================================
    // SELECT THERAPIST
    // ==========================================

    const handleTherapistChange = async (
        slot,
        request,
        therapistId
    ) => {

        if (!therapistId) {
            return;
        }


        if (!request?.appointment_id) {

            console.error(
                "Appointment ID not found:",
                request
            );

            return;
        }


        if (!request?.patient_id) {

            console.error(
                "Patient ID not found:",
                request
            );

            return;
        }


        // ==========================================
        // STORE SELECTED THERAPIST
        // ==========================================

        setSelectedTherapists(
            (previous) => ({
                ...previous,

                [request.appointment_id]:
                    therapistId,
            })
        );


        try {

            await dispatch(
                selectFrontOfficeTherapist({

                    appointment_id:
                        request.appointment_id,

                    patient_id:
                        request.patient_id,

                    therapist_id:
                        therapistId,

                })
            ).unwrap();


            const therapist =
                therapistList.find(
                    (item) =>
                        String(
                            item.therapist_id ||
                            item.id
                        ) ===
                        String(therapistId)
                );


            showSuccessToast(
                "Therapist Selected",
                `${therapist?.therapist_name ||
                therapist?.name ||
                "Therapist"
                } has been selected successfully`
            );

        } catch (error) {

            console.error(
                "Therapist selection failed:",
                error
            );


            showErrorToast(
                "Selection Failed",
                typeof error === "string"
                    ? error
                    : "Failed to select therapist"
            );


            // Revert selection
            setSelectedTherapists(
                (previous) => {

                    const updated = {
                        ...previous,
                    };

                    delete updated[
                        request.appointment_id
                    ];

                    return updated;

                }
            );

        }

    };
    const RoomSelect = ({
        slot,
        request,
    }) => {

        const roomValue = getRoomValue(
            slot,
            request
        );

        const rooms = [
            "Room 1",
            "Room 2",
            "Room 3",
            "Room 4",
            "Room 5",
        ];

        const dropdownKey =
            request?.appointment_id;

        return (
            <div className="relative min-w-[118px]" data-custom-dropdown>

                {/* SELECTED ROOM */}
                <button
                    type="button"
                    onClick={() => {
                        setOpenRoomDropdown(
                            openRoomDropdown === dropdownKey
                                ? null
                                : dropdownKey
                        );

                        setOpenTherapistDropdown(null);
                    }}
                    className="
                    flex
                    h-9
                    w-full
                    items-center
                    justify-between
                    rounded-[10px]
                    border
                    border-[#E7D5C4]
                    bg-white
                    px-3
                    text-left
                    text-[11px]
                    font-medium
                    text-[#4D2E23]
                    shadow-sm
                    transition
                    hover:border-[#CDB5A6]
                "
                >
                    <span className="truncate">
                        {roomValue || "Select room no."}
                    </span>

                    <HiOutlineChevronDown
                        size={14}
                        className={`
                        ml-2
                        flex-shrink-0
                        text-[#7A6658]
                        transition-transform
                        ${openRoomDropdown === dropdownKey
                                ? "rotate-180"
                                : ""
                            }
                    `}
                    />
                </button>


                {/* CUSTOM ROOM DROPDOWN */}
                {openRoomDropdown === dropdownKey && (
                    <div
                        className="
                        absolute
                        right-0
                        top-[42px]
                        z-[100]
                        w-[150px]
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#E7D5C4]
                        bg-white
                        shadow-xl
                    "
                    >

                        {/* CLEAR */}
                        <button
                            type="button"
                            onClick={() => {
                                setOpenRoomDropdown(null);
                            }}
                            className="
                            flex
                            w-full
                            items-center
                            border-b
                            border-[#F0E5DE]
                            px-3
                            py-2.5
                            text-left
                            text-[11px]
                            text-[#8B7A70]
                            hover:bg-[#FFF8F2]
                        "
                        >
                            Select room no.
                        </button>


                        {rooms.map((room) => {

                            const isSelected =
                                roomValue === room;

                            return (
                                <button
                                    key={room}
                                    type="button"
                                    onClick={async () => {

                                        setOpenRoomDropdown(null);

                                        await handleRoomChange(
                                            slot,
                                            request,
                                            room
                                        );
                                    }}
                                    className={`
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    border-b
                                    border-[#F2E8E2]
                                    px-3
                                    py-2.5
                                    text-left
                                    text-[11px]
                                    last:border-b-0
                                    transition
                                    hover:bg-[#FFF8F2]
                                    ${isSelected
                                            ? "bg-[#FFF8F2] font-semibold text-[#4D2E23]"
                                            : "text-[#6F625B]"
                                        }
                                `}
                                >
                                    <span>{room}</span>

                                    {isSelected && (
                                        <span className="text-[#8A5035]">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                    </div>
                )}

            </div>
        );
    };
    // ==========================================
    // RENDER THERAPIST SELECT
    // ==========================================

    const TherapistSelect = ({
        slot,
        request,
    }) => {

        const appointmentId =
            request?.appointment_id;

        const therapistValue =
            selectedTherapists[
            appointmentId
            ] ||
            request?.therapist_id ||
            slot?.therapist_id ||
            "";

        const isSelecting =
            Boolean(selectTherapistLoading);

        const dropdownKey =
            appointmentId;

        const selectedTherapist =
            therapistList?.find(
                (therapist) =>
                    String(
                        therapist.therapist_id ||
                        therapist.id
                    ) === String(therapistValue)
            );

        const selectedTherapistName =
            selectedTherapist?.therapist_name ||
            selectedTherapist?.name ||
            "";
        useEffect(() => {
            const handleClickOutside = (event) => {
                const clickedInsideDropdown =
                    event.target.closest(
                        "[data-custom-dropdown]"
                    );

                if (!clickedInsideDropdown) {
                    setOpenRoomDropdown(null);
                    setOpenTherapistDropdown(null);
                }
            };

            document.addEventListener(
                "mousedown",
                handleClickOutside
            );

            return () => {
                document.removeEventListener(
                    "mousedown",
                    handleClickOutside
                );
            };
        }, []);
        return (
            <div className="relative min-w-[150px]" data-custom-dropdown>

                {/* SELECTED THERAPIST */}
                <button
                    type="button"
                    disabled={
                        therapistListLoading ||
                        isSelecting
                    }
                    onClick={() => {

                        setOpenTherapistDropdown(
                            openTherapistDropdown === dropdownKey
                                ? null
                                : dropdownKey
                        );

                        setOpenRoomDropdown(null);
                    }}
                    className="
                    flex
                    h-9
                    w-full
                    items-center
                    justify-between
                    rounded-[10px]
                    border
                    border-[#E7D5C4]
                    bg-white
                    px-3
                    text-left
                    text-[11px]
                    font-medium
                    text-[#4D2E23]
                    shadow-sm
                    transition
                    hover:border-[#CDB5A6]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
                >
                    <span className="truncate">
                        {therapistListLoading
                            ? "Loading..."
                            : selectedTherapistName ||
                            "Select Therapist"}
                    </span>

                    <HiOutlineChevronDown
                        size={14}
                        className={`
                        ml-2
                        flex-shrink-0
                        text-[#7A6658]
                        transition-transform
                        ${openTherapistDropdown ===
                                dropdownKey
                                ? "rotate-180"
                                : ""
                            }
                    `}
                    />
                </button>


                {/* CUSTOM THERAPIST DROPDOWN */}
                {openTherapistDropdown === dropdownKey &&
                    !therapistListLoading &&
                    !isSelecting && (
                        <div
                            className="
                            absolute
                            right-0
                            top-[42px]
                            z-[100]
                            w-[220px]
                            max-h-[250px]
                            overflow-y-auto
                            rounded-xl
                            border
                            border-[#E7D5C4]
                            bg-white
                            shadow-xl
                        "
                        >

                            {therapistList
                                ?.filter(
                                    (therapist) =>
                                        therapist.is_available !== false
                                )
                                .map((therapist) => {

                                    const therapistId =
                                        therapist.therapist_id ||
                                        therapist.id;

                                    const therapistName =
                                        therapist.therapist_name ||
                                        therapist.name ||
                                        "Therapist";

                                    const isSelected =
                                        String(
                                            therapistValue
                                        ) === String(
                                            therapistId
                                        );

                                    return (
                                        <button
                                            key={therapistId}
                                            type="button"
                                            onClick={async () => {

                                                setOpenTherapistDropdown(
                                                    null
                                                );

                                                await handleTherapistChange(
                                                    slot,
                                                    request,
                                                    therapistId
                                                );
                                            }}
                                            className={`
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            border-b
                                            border-[#F2E8E2]
                                            px-3
                                            py-3
                                            text-left
                                            text-[11px]
                                            last:border-b-0
                                            transition
                                            hover:bg-[#FFF8F2]
                                            ${isSelected
                                                    ? "bg-[#FFF8F2] font-semibold text-[#4D2E23]"
                                                    : "text-[#6F625B]"
                                                }
                                        `}
                                        >
                                            <span className="truncate">
                                                {therapistName}
                                            </span>

                                            {isSelected && (
                                                <span className="ml-2 text-[#8A5035]">
                                                    ✓
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}

                        </div>
                    )}

            </div>
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
        w-full
        bg-[#F7F7F7]
        px-4
        py-5
        sm:px-6
        sm:py-6
        lg:px-8
        lg:py-7
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




                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

                <div
                    className="
        mb-6
        flex
        flex-col
        gap-5
        xl:flex-row
        xl:items-start
        xl:justify-between
    "
                >
                    <div className="flex items-start gap-3">

                        {/* BACK BUTTON */}
                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            aria-label="Go back"
                            className="
                mt-0.5
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#E7DBD3]
                bg-white
                text-[#4B2E2A]
                transition
                hover:bg-[#F9F5F1]
            "
                        >
                            <HiOutlineArrowLeft
                                size={17}
                            />
                        </button>

                        {/* HEADER CONTENT */}
                        <div>

                            <div
                                className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    sm:gap-3
                "
                            >

                                <h1
                                    className="
                        text-[19px]
                        font-semibold
                        text-[#2F2926]
                        sm:text-[21px]
                    "
                                >
                                    Pending Actions
                                </h1>

                                <span
                                    className="
                        text-[20px]
                        text-[#8A817B]
                        sm:text-[22px]
                    "
                                >
                                    ›
                                </span>

                                <h2
                                    className="
                        text-[19px]
                        font-semibold
                        text-[#2F2926]
                        sm:text-[21px]
                    "
                                >
                                    Therapy Confirmation
                                </h2>

                                {doctor?.name && (
                                    <>
                                        <span
                                            className="
                                text-[20px]
                                text-[#8A817B]
                                sm:text-[22px]
                            "
                                        >
                                            ›
                                        </span>

                                        <h2
                                            className="
                                max-w-full
                                truncate
                                text-[19px]
                                font-semibold
                                text-[#2F2926]
                                sm:text-[21px]
                            "
                                        >
                                            {doctor.name}
                                        </h2>
                                    </>
                                )}

                            </div>

                            <div
                                className="
                    mt-2
                    flex
                    flex-wrap
                    items-center
                    gap-2.5
                    text-[13px]
                    text-[#634238]
                "
                            >

                                <div
                                    className="
                        flex
                        items-center
                        gap-2
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

                                    {pendingPatientCount} Patients
                                </div>

                                <span className="text-[#D3C3B7]">
                                    •
                                </span>

                                <div
                                    className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-[#E7D2C0]
                        bg-[#FFF8F2]
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        text-[#8A4F32]
                    "
                                >
                                    <HiOutlineClock
                                        size={13}
                                        className="text-[#8A4F32]"
                                    />

                                    <span>
                                        Drag & drop appointments to reschedule time
                                    </span>
                                </div>

                            </div>

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
                            grid-cols-[80px_1fr]
                             sm:grid-cols-[105px_1fr]
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

                                const isDragTarget =
                                    dragOverTime === slot.time &&
                                    draggedItem?.source_time !== slot.time;


                                return (
                                    <div
                                        key={
                                            slot.id ||
                                            `${slot.time}-${index}`
                                        }
                                        onDragOver={(e) =>
                                            handleDragOver(e, slot)
                                        }
                                        onDragLeave={(e) =>
                                            handleDragLeave(e, slot)
                                        }
                                        onDrop={(e) =>
                                            handleDrop(e, slot)
                                        }
                                        className={`
                                            grid
                                            grid-cols-[80px_1fr]
                                            sm:grid-cols-[105px_1fr]
                                            border-b
                                            border-[#EFE4DC]
                                            last:border-b-0
                                            transition-colors
                                            duration-150
                                            ${isDragTarget
                                                ? "bg-[#FFF6EF] ring-2 ring-inset ring-[#8A4F32]/50"
                                                : ""
                                            }
                                        `}
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

                                            {/* DROP TARGET INDICATOR ON BUSY SLOT */}
                                            {isDragTarget &&
                                                (isConflict ||
                                                    slot.patient_name ||
                                                    slot.appointment_id) && (
                                                    <div className="mb-2 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#8A4F32] bg-[#FFF8F3] py-2 text-[11px] font-semibold text-[#8A4F32] shadow-xs animate-pulse">
                                                        <HiOutlineClock size={15} className="text-[#8A4F32]" />
                                                        <span>Drop here to reschedule {draggedItem?.patient_name ? `"${draggedItem.patient_name}"` : "appointment"} to {slot.time}</span>
                                                    </div>
                                                )}

                                            {/* ========================= */}
                                            {/* EMPTY / AVAILABLE */}
                                            {/* ========================= */}

                                            {!isConflict &&
                                                !slot.patient_name &&
                                                !slot.appointment_id &&
                                                requests.length ===
                                                0 && (

                                                    <div className="flex min-h-[56px] items-center justify-center">
                                                        {isDragTarget ? (
                                                            <div className="flex w-full min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#8A4F32] bg-[#FFF8F3] px-4 py-2.5 text-[12px] font-semibold text-[#8A4F32] shadow-xs">
                                                                <HiOutlineClock size={16} className="animate-spin text-[#8A4F32]" />
                                                                <span>Drop here to reschedule {draggedItem?.patient_name ? `"${draggedItem.patient_name}"` : "appointment"} to {slot.time}</span>
                                                            </div>
                                                        ) : draggedItem && draggedItem.source_time !== slot.time ? (
                                                            <div className="flex w-full min-h-[50px] items-center justify-center rounded-xl border border-dashed border-[#DFCEBF] bg-[#FAFAF8] text-[11px] font-medium text-[#9E8B80]">
                                                                <span>Available Slot • Drop here for {slot.time}</span>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="
                                                                    min-h-[54px]
                                                                "
                                                            />
                                                        )}
                                                    </div>

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

                                                                        const isItemDragged =
                                                                            draggedItem?.appointment_id ===
                                                                            request.appointment_id;


                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    request.appointment_id ||
                                                                                    requestIndex
                                                                                }
                                                                                draggable={
                                                                                    !openRoomDropdown &&
                                                                                    !openTherapistDropdown &&
                                                                                    !isReschedulingLocal
                                                                                }
                                                                                onDragStart={(e) =>
                                                                                    handleDragStartRequest(
                                                                                        e,
                                                                                        request,
                                                                                        slot
                                                                                    )
                                                                                }
                                                                                onDragEnd={
                                                                                    handleDragEnd
                                                                                }
                                                                                className={`
                                                                                group
                                                                                relative
                                                                                rounded-xl
                                                                                border
                                                                                px-3
                                                                                py-3
                                                                                transition-all
                                                                                ${isItemDragged
                                                                                        ? "opacity-30 scale-[0.99] border-dashed border-[#8A4F32]"
                                                                                        : "cursor-grab active:cursor-grabbing hover:shadow-xs"
                                                                                    }
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

                                                                                    <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                                                                        <DragGripIcon />
                                                                                        <button
                                                                                            type="button"
                                                                                            draggable={false}
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


                                                                                    <div
                                                                                        className="
        flex
        flex-wrap
        items-center
        justify-end
        gap-2
    "
                                                                                        draggable={false}
                                                                                        onDragStart={(e) =>
                                                                                            e.stopPropagation()
                                                                                        }
                                                                                    >

                                                                                        <TherapistSelect
                                                                                            slot={slot}
                                                                                            request={request}
                                                                                        />

                                                                                        <RoomSelect
                                                                                            slot={slot}
                                                                                            request={request}
                                                                                        />

                                                                                    </div>

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
                                                        draggable={
                                                            !openRoomDropdown &&
                                                            !openTherapistDropdown &&
                                                            !isReschedulingLocal &&
                                                            Boolean(
                                                                slot.appointment_id ||
                                                                selectedRequest?.appointment_id
                                                            )
                                                        }
                                                        onDragStart={(e) =>
                                                            handleDragStartSlot(
                                                                e,
                                                                slot,
                                                                selectedRequest
                                                            )
                                                        }
                                                        onDragEnd={
                                                            handleDragEnd
                                                        }
                                                        className={`
                                                            group
                                                            relative
                                                            rounded-xl
                                                            border
                                                            px-3
                                                            py-3
                                                            transition-all
                                                            ${draggedItem?.appointment_id ===
                                                                (slot.appointment_id ||
                                                                    selectedRequest?.appointment_id)
                                                                ? "opacity-30 scale-[0.99] border-dashed border-[#8A4F32]"
                                                                : "cursor-grab active:cursor-grabbing hover:shadow-xs"
                                                            }
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

                                                            <div className="flex items-center gap-1.5">
                                                                <DragGripIcon />
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
                                                            </div>


                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                "
                                                                draggable={false}
                                                                onDragStart={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >

                                                                {selectedRequest && (

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            items-center
                                                                            gap-2
                                                                        "
                                                                    >

                                                                        <TherapistSelect
                                                                            slot={slot}
                                                                            request={selectedRequest}
                                                                        />

                                                                        <RoomSelect
                                                                            slot={slot}
                                                                            request={selectedRequest}
                                                                        />

                                                                    </div>

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

            {/* RESCHEDULING MODAL / OVERLAY */}
            {isReschedulingLocal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/25 backdrop-blur-[1px]">
                    <div className="flex items-center gap-3 rounded-2xl border border-[#E7D5C4] bg-white px-6 py-4 shadow-2xl">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#8A4F32] border-t-transparent" />
                        <p className="text-[13px] font-semibold text-[#4D2E23]">
                            Rescheduling therapy appointment...
                        </p>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};


export default TherapyConfirmation;