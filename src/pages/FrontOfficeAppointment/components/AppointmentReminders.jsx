import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from "react-icons/hi2";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
    loadAppointmentReminders,
    sendPendingActionReminder,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import {
    showSuccessToast,
    showErrorToast,
} from "../../../../utils/showToast";

const ITEMS_PER_PAGE = 10;

const AppointmentReminders = () => {

    const dispatch = useDispatch();

    const {
        appointmentReminders = [],
        appointmentRemindersLoading,
        appointmentRemindersError,

        sendingReminder,
        sendingReminderId,
        sendingReminderType,
    } = useSelector(
        (state) => state.frontOfficeAppointment
    );

    const [currentPage, setCurrentPage] = useState(1);


    // ==========================================
    // LOAD APPOINTMENT REMINDERS
    // ==========================================

    useEffect(() => {

        dispatch(
            loadAppointmentReminders()
        );

    }, [dispatch]);


    // ==========================================
    // PAGINATION
    // ==========================================

    const totalItems =
        appointmentReminders.length;

    const totalPages =
        Math.ceil(
            totalItems / ITEMS_PER_PAGE
        );

    const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

    const currentItems =
        appointmentReminders.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );


    // ==========================================
    // SEND REMINDER
    // ==========================================

    const handleSendReminder = async (
        reminder
    ) => {

        try {

            const response =
                await dispatch(
                    sendPendingActionReminder({
                        id: reminder.id,
                        type: "appointment",
                    })
                ).unwrap();


            showSuccessToast(
                "Reminder Sent",
                response?.message ||
                    "Appointment reminder sent successfully!"
            );

        } catch (error) {

            console.error(
                "Appointment reminder error:",
                error
            );

            showErrorToast(
                "Reminder Failed",
                error?.message ||
                    error?.detail ||
                    "Failed to send appointment reminder."
            );
        }
    };


    // ==========================================
    // PAGE CHANGE
    // ==========================================

    const handlePrevious = () => {

        setCurrentPage(
            (page) => Math.max(1, page - 1)
        );

    };


    const handleNext = () => {

        setCurrentPage(
            (page) =>
                Math.min(
                    totalPages,
                    page + 1
                )
        );

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const getDate = (item) => {

        return (
            item?.date_and_time?.date ||
            item?.appointment_date ||
            "—"
        );

    };


    const getTime = (item) => {

        return (
            item?.date_and_time?.time ||
            item?.appointment_time ||
            "—"
        );

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <DashboardLayout role="frontoffice">

            <div
                className="
                    min-h-screen
                    bg-[#F7F7F7]
                    px-6
                    py-5
                "
            >

                {/* ================================= */}
                {/* BREADCRUMB */}
                {/* ================================= */}

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        gap-2
                        text-[14px]
                    "
                >

                    <span
                        className="
                            font-medium
                            text-[#8A7A72]
                        "
                    >
                        Pending Actions
                    </span>

                    <span
                        className="
                            text-[#B5A9A3]
                        "
                    >
                        /
                    </span>

                    <span
                        className="
                            font-semibold
                            text-[#4B2E2A]
                        "
                    >
                        Appointment Reminders
                    </span>

                </div>


                {/* ================================= */}
                {/* MAIN CARD */}
                {/* ================================= */}

                <div
                    className="
                        rounded-[24px]
                        border
                        border-[#E7DBD3]
                        bg-white
                        p-6
                    "
                >

                    {/* ================================= */}
                    {/* HEADER */}
                    {/* ================================= */}

                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <h1
                                className="
                                    text-[18px]
                                    font-semibold
                                    text-[#3F302C]
                                "
                            >
                                Appointment Reminders
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-[12px]
                                    text-[#958781]
                                "
                            >
                                Send reminders for pending appointments
                            </p>

                        </div>


                        {/* ================================= */}
                        {/* PAGINATION */}
                        {/* ================================= */}

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <span
                                className="
                                    text-[11px]
                                    text-[#7F716B]
                                "
                            >
                                Showing{" "}

                                {totalItems === 0
                                    ? 0
                                    : startIndex + 1}

                                {" - "}

                                {Math.min(
                                    startIndex +
                                        ITEMS_PER_PAGE,
                                    totalItems
                                )}

                                {" "}of{" "}
                                {totalItems}
                            </span>


                            <button
                                type="button"
                                onClick={
                                    handlePrevious
                                }
                                disabled={
                                    currentPage === 1
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#E7DBD3]
                                    text-[#6E625D]
                                    transition
                                    hover:bg-[#FFF8F4]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                <HiOutlineChevronLeft
                                    size={16}
                                />
                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleNext
                                }
                                disabled={
                                    currentPage >=
                                    totalPages ||
                                    totalPages === 0
                                }
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#E7DBD3]
                                    text-[#6E625D]
                                    transition
                                    hover:bg-[#FFF8F4]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                <HiOutlineChevronRight
                                    size={16}
                                />
                            </button>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* TABLE */}
                    {/* ================================= */}

                    <div
                        className="
                            overflow-hidden
                            rounded-[18px]
                            border
                            border-[#E8DED7]
                        "
                    >

                        {/* TABLE HEADER */}

                        <div
                            className="
                                grid
                                grid-cols-[1.35fr_1.15fr_1.15fr_1fr_0.8fr_0.8fr]
                                border-b
                                border-[#E8DED7]
                                bg-[#FFF9F5]
                            "
                        >

                            <TableHeader>
                                Patient
                            </TableHeader>

                            <TableHeader>
                                Date
                            </TableHeader>

                            <TableHeader>
                                Time
                            </TableHeader>

                            <TableHeader>
                                Doctor
                            </TableHeader>

                            <TableHeader>
                                Status
                            </TableHeader>

                            <TableHeader>
                                Action
                            </TableHeader>

                        </div>


                        {/* ================================= */}
                        {/* LOADING */}
                        {/* ================================= */}

                        {appointmentRemindersLoading && (

                            <div
                                className="
                                    flex
                                    h-[300px]
                                    items-center
                                    justify-center
                                    text-[13px]
                                    text-[#8A7A72]
                                "
                            >
                                Loading appointment reminders...
                            </div>

                        )}


                        {/* ================================= */}
                        {/* ERROR */}
                        {/* ================================= */}

                        {!appointmentRemindersLoading &&
                            appointmentRemindersError && (

                            <div
                                className="
                                    flex
                                    h-[300px]
                                    items-center
                                    justify-center
                                    text-[13px]
                                    text-red-500
                                "
                            >
                                Failed to load appointment reminders.
                            </div>

                        )}


                        {/* ================================= */}
                        {/* EMPTY */}
                        {/* ================================= */}

                        {!appointmentRemindersLoading &&
                            !appointmentRemindersError &&
                            currentItems.length === 0 && (

                            <div
                                className="
                                    flex
                                    h-[300px]
                                    items-center
                                    justify-center
                                    text-[13px]
                                    text-[#8A7A72]
                                "
                            >
                                No appointment reminders found.
                            </div>

                        )}


                        {/* ================================= */}
                        {/* ROWS */}
                        {/* ================================= */}

                        {!appointmentRemindersLoading &&
                            !appointmentRemindersError &&
                            currentItems.map(
                                (item) => {

                                    const isCompleted =
                                        String(
                                            item?.status
                                        ).toLowerCase() ===
                                        "completed";

                                    const isSending =
                                        sendingReminder &&
                                        sendingReminderType ===
                                            "appointment" &&
                                        String(
                                            sendingReminderId
                                        ) ===
                                            String(item.id);


                                    return (

                                        <div
                                            key={item.id}
                                            className="
                                                grid
                                                min-h-[72px]
                                                grid-cols-[1.35fr_1.15fr_1.15fr_1fr_0.8fr_0.8fr]
                                                border-b
                                                border-[#EEE6E1]
                                                last:border-b-0
                                                hover:bg-[#FFFCFA]
                                            "
                                        >

                                            {/* PATIENT */}

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    justify-center
                                                    px-4
                                                "
                                            >

                                                <p
                                                    className="
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#4B2E2A]
                                                    "
                                                >
                                                    {item?.patient_name ||
                                                        "—"}
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-[10px]
                                                        text-[#9B8E87]
                                                    "
                                                >
                                                    {item?.patient_id ||
                                                        "—"}
                                                </p>

                                            </div>


                                            {/* DATE */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    px-4
                                                    text-[11px]
                                                    font-medium
                                                    text-[#4B2E2A]
                                                "
                                            >
                                                {getDate(item)}
                                            </div>


                                            {/* TIME */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    px-4
                                                    text-[11px]
                                                    font-medium
                                                    text-[#4B2E2A]
                                                "
                                            >
                                                {getTime(item)}
                                            </div>


                                            {/* DOCTOR */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    px-4
                                                    text-[11px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                "
                                            >
                                                {item?.doctor_name ||
                                                    "—"}
                                            </div>


                                            {/* STATUS */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    px-4
                                                "
                                            >

                                                <StatusBadge
                                                    completed={
                                                        isCompleted
                                                    }
                                                />

                                            </div>


                                            {/* ACTION */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    px-4
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    disabled={
                                                        isCompleted ||
                                                        isSending
                                                    }
                                                    onClick={() =>
                                                        handleSendReminder(
                                                            item
                                                        )
                                                    }
                                                    className="
                                                        min-w-[70px]
                                                        rounded-full
                                                        border
                                                        border-[#DCCDC5]
                                                        bg-white
                                                        px-3
                                                        py-1.5
                                                        text-[10px]
                                                        font-medium
                                                        text-[#4B2E2A]
                                                        transition
                                                        hover:bg-[#FFF7F2]
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                    "
                                                >
                                                    {isSending
                                                        ? "Sending..."
                                                        : isCompleted
                                                        ? "Sent"
                                                        : "Send"}
                                                </button>

                                            </div>

                                        </div>

                                    );
                                }
                            )}

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};


// ==========================================
// TABLE HEADER
// ==========================================

const TableHeader = ({
    children,
}) => (

    <div
        className="
            px-4
            py-3.5
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.02em]
            text-[#695B55]
        "
    >
        {children}
    </div>

);


// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({
    completed,
}) => (

    <span
        className={`
            rounded-full
            px-3
            py-1
            text-[10px]
            font-medium
            ${
                completed
                    ? "bg-[#E8F7EC] text-[#28723D]"
                    : "bg-[#FFF1E5] text-[#94613E]"
            }
        `}
    >
        {completed
            ? "Completed"
            : "Pending"}
    </span>

);


export default AppointmentReminders;