import {
    useEffect,
    useMemo,
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
    HiOutlineCheckCircle,
    HiOutlineClock,
} from "react-icons/hi2";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";

import {
    loadFrontOfficeHomevisitAppointmentConfirmation,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const HomeVisitConfirmation = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        doctorId,
    } = useParams();


    const {
        homevisitConfirmation,
        homevisitConfirmationLoading,
        homevisitConfirmationError,
    } = useSelector(
        (state) =>
            state.frontOfficeAppointment
    );


    useEffect(() => {

        if (!doctorId) return;

        dispatch(
            loadFrontOfficeHomevisitAppointmentConfirmation(
                doctorId
            )
        );

    }, [
        dispatch,
        doctorId,
    ]);


    const doctor =
        homevisitConfirmation?.doctor;


    const schedule = useMemo(() => {

        const slots =
            homevisitConfirmation
                ?.schedule_overview
                ?.schedule_slots || [];


        return slots.filter(
            (slot) =>
                slot.status?.toLowerCase() !==
                "conflict"
        );

    }, [
        homevisitConfirmation,
    ]);


    const patientCount =
        homevisitConfirmation
            ?.schedule_overview
            ?.total_patients_today ??
        schedule.filter(
            (slot) =>
                slot.appointment_id
        ).length;


    const getPatientName = (slot) => {

        return (
            slot.patient_name ||
            slot.patient?.name ||
            "Available"
        );

    };


    const getPatientCode = (slot) => {

        return (
            slot.patient_code ||
            slot.patient?.patient_code ||
            ""
        );

    };


    const getSlotRange = (slot) => {

        return (
            slot.slot_range ||
            slot.time_range ||
            slot.formatted_time ||
            slot.time ||
            "--"
        );

    };


    const getStatus = (slot) => {

        const status =
            slot?.status?.toLowerCase();


        if (
            status === "booked" ||
            status === "confirmed"
        ) {
            return "confirmed";
        }


        if (
            status === "waiting" ||
            status === "pending" ||
            status === "pending_approval"
        ) {
            return "pending";
        }


        return (
            status ||
            "available"
        );

    };


    return (

        <DashboardLayout
            role="frontoffice"
        >

            <div
                className="
                    min-h-screen
                    bg-white
                    px-6
                    py-5
                    text-[#4B2E2A]
                "
            >

                {/* ========================================= */}
                {/* BREADCRUMB */}
                {/* ========================================= */}

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        gap-2
                        text-[14px]
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/frontoffice/pending-actions/home-visit-confirmations"
                            )
                        }
                        className="
                            font-medium
                            text-[#2F2926]
                            hover:text-[#8A4F32]
                        "
                    >
                        Pending Actions
                    </button>


                    <span
                        className="
                            text-[#8A817B]
                        "
                    >
                        ›
                    </span>


                    <span
                        className="
                            font-medium
                            text-[#2F2926]
                        "
                    >
                        Home Visit Confirmation
                    </span>


                    {doctor?.doctor_name && (

                        <>

                            <span
                                className="
                                    text-[#8A817B]
                                "
                            >
                                ›
                            </span>


                            <span
                                className="
                                    font-medium
                                    text-[#2F2926]
                                "
                            >
                                {
                                    doctor.doctor_name
                                }
                            </span>

                        </>

                    )}

                </div>


                {/* ========================================= */}
                {/* PAGE TITLE */}
                {/* ========================================= */}

                <div
                    className="
                        border-b
                        border-[#E8DDD6]
                        pb-4
                    "
                >

                    <h1
                        className="
                            text-[21px]
                            font-semibold
                            text-[#2F2926]
                        "
                    >
                        Home Visit Confirmation
                    </h1>


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


                {/* ========================================= */}
                {/* ERROR */}
                {/* ========================================= */}

                {homevisitConfirmationError && (

                    <div
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-[11px]
                            text-red-600
                        "
                    >
                        {typeof homevisitConfirmationError === "string"
                            ? homevisitConfirmationError
                            : "Failed to load home visit confirmation."
                        }
                    </div>

                )}


                {/* ========================================= */}
                {/* DOCTOR INFORMATION */}
                {/* ========================================= */}

                {doctor && (

                    <div
                        className="
                            flex
                            items-center
                            border-b
                            border-[#E8DDD6]
                            py-4
                        "
                    >

                        {/* DOCTOR */}

                        <div
                            className="
                                flex
                                min-w-[280px]
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    h-[58px]
                                    w-[58px]
                                    overflow-hidden
                                    rounded-full
                                    border
                                    border-[#E8DDD6]
                                    bg-[#FFF7F1]
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
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />

                                ) : (

                                    <div
                                        className="
                                            flex
                                            h-full
                                            w-full
                                            items-center
                                            justify-center
                                            text-lg
                                            font-semibold
                                            text-[#8A4F32]
                                        "
                                    >
                                        {
                                            doctor.doctor_name
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                            "D"
                                        }
                                    </div>

                                )}

                            </div>


                            <div>

                                <h2
                                    className="
                                        text-[15px]
                                        font-semibold
                                        text-[#2F2926]
                                    "
                                >
                                    {
                                        doctor.doctor_name
                                    }
                                </h2>


                                <p
                                    className="
                                        text-[12px]
                                        text-[#159A9C]
                                    "
                                >
                                    {
                                        doctor.specialization
                                    }
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[11px]
                                        text-[#8A817B]
                                    "
                                >
                                    🎓{" "}
                                    {
                                        doctor.qualification
                                    }
                                </p>

                            </div>

                        </div>


                        {/* CONSULTATION TYPE */}

                        <div
                            className="
                                min-w-[220px]
                                border-l
                                border-[#E8DDD6]
                                px-5
                            "
                        >

                            <p
                                className="
                                    text-[11px]
                                    text-[#7D726B]
                                "
                            >
                                Consultation Type
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[14px]
                                    font-semibold
                                    text-[#4B2E2A]
                                "
                            >
                                {
                                    doctor.consultation_type ||
                                    "--"
                                }
                            </p>

                        </div>


                        {/* FEES */}

                        <div
                            className="
                                min-w-[165px]
                                border-l
                                border-[#E8DDD6]
                                px-5
                            "
                        >

                            <p
                                className="
                                    text-[11px]
                                    text-[#7D726B]
                                "
                            >
                                Consultation Fees
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[14px]
                                    font-semibold
                                    text-[#4B2E2A]
                                "
                            >
                                {
                                    doctor.formatted_fees ||
                                    (
                                        doctor.consultation_fees != null
                                            ? `₹${doctor.consultation_fees}`
                                            : "--"
                                    )
                                }
                            </p>

                        </div>


                        {/* AVAILABLE SLOTS */}

                        <div
                            className="
                                min-w-[145px]
                                border-l
                                border-[#E8DDD6]
                                px-5
                            "
                        >

                            <p
                                className="
                                    text-[11px]
                                    text-[#7D726B]
                                "
                            >
                                Available Slots
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[14px]
                                    font-semibold
                                    text-[#4B2E2A]
                                "
                            >
                                {String(
                                    doctor.available_slots ??
                                    schedule.length
                                ).padStart(2, "0")}
                            </p>

                        </div>


                        {/* WORKING HOURS */}

                        <div
                            className="
                                border-l
                                border-[#E8DDD6]
                                px-5
                            "
                        >

                            <p
                                className="
                                    text-[11px]
                                    text-[#7D726B]
                                "
                            >
                                Working Hours
                            </p>


                            <p
                                className="
                                    mt-1
                                    whitespace-nowrap
                                    text-[14px]
                                    font-semibold
                                    text-[#4B2E2A]
                                "
                            >
                                {
                                    doctor.working_hours ||
                                    "--"
                                }
                            </p>

                        </div>

                    </div>

                )}


                {/* ========================================= */}
                {/* SCHEDULE */}
                {/* ========================================= */}

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

                    {/* HEADER */}

                    <div
                        className="
                            grid
                            grid-cols-[120px_1fr]
                            border-b
                            border-[#E8DDD6]
                            bg-[#FFF9F4]
                            text-[11px]
                            font-medium
                            text-[#4B2E2A]
                        "
                    >

                        <div
                            className="
                                px-5
                                py-3
                                text-center
                            "
                        >
                            Time
                        </div>


                        <div
                            className="
                                border-l
                                border-[#E8DDD6]
                                px-5
                                py-3
                            "
                        >
                            Schedule
                        </div>

                    </div>


                    {/* LOADING */}

                    {homevisitConfirmationLoading ? (

                        <div
                            className="
                                px-5
                                py-12
                                text-center
                                text-[12px]
                                text-[#8A817B]
                            "
                        >
                            Loading schedule...
                        </div>

                    ) : schedule.length === 0 ? (

                        <div
                            className="
                                px-5
                                py-12
                                text-center
                                text-[12px]
                                text-[#8A817B]
                            "
                        >
                            No appointments available.
                        </div>

                    ) : (

                        schedule.map(
                            (slot, index) => {

                                const status =
                                    getStatus(slot);

                                const confirmed =
                                    status === "confirmed";

                                const pending =
                                    status === "pending" &&
                                    Boolean(
                                        slot.appointment_id
                                    );


                                return (

                                    <div
                                        key={
                                            slot.appointment_id ||
                                            `${slot.time}-${index}`
                                        }
                                        className="
                                            grid
                                            min-h-[92px]
                                            grid-cols-[120px_1fr]
                                            border-b
                                            border-[#EEE4DD]
                                            last:border-b-0
                                        "
                                    >

                                        {/* TIME */}

                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-center
                                                px-3
                                                py-7
                                                text-[12px]
                                                font-medium
                                                text-[#4B2E2A]
                                            "
                                        >
                                            {
                                                slot.time ||
                                                "--"
                                            }
                                        </div>


                                        {/* SCHEDULE */}

                                        <div
                                            className="
                                                border-l
                                                border-[#EEE4DD]
                                                p-3
                                            "
                                        >

                                            <div
                                                className={`
                                                    flex
                                                    min-h-[66px]
                                                    items-center
                                                    justify-between
                                                    rounded-xl
                                                    border
                                                    px-3
                                                    py-2.5

                                                    ${
                                                        confirmed
                                                            ? "border-green-200 bg-[#EEFFF1]"
                                                            : pending
                                                                ? "border-[#EBD5C4] bg-[#FFF8ED]"
                                                                : "border-[#E8DDD6] bg-white"
                                                    }
                                                `}
                                            >

                                                <div>

                                                    <p
                                                        className={`
                                                            text-[12px]
                                                            font-medium

                                                            ${
                                                                confirmed
                                                                    ? "text-[#1B5D2B]"
                                                                    : pending
                                                                        ? "text-[#8A4F32]"
                                                                        : "text-[#4B2E2A]"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            getSlotRange(
                                                                slot
                                                            )
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[11px]
                                                            text-[#4B2E2A]
                                                        "
                                                    >

                                                        {
                                                            getPatientName(
                                                                slot
                                                            )
                                                        }


                                                        {slot.type && (

                                                            <>
                                                                {" "}
                                                                (
                                                                {
                                                                    slot.type
                                                                }
                                                                )
                                                            </>

                                                        )}

                                                    </p>


                                                    {getPatientCode(
                                                        slot
                                                    ) && (

                                                        <p
                                                            className="
                                                                mt-0.5
                                                                text-[10px]
                                                                text-[#81756E]
                                                            "
                                                        >
                                                            Patient ID:{" "}
                                                            {
                                                                getPatientCode(
                                                                    slot
                                                                )
                                                            }
                                                        </p>

                                                    )}

                                                </div>


                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >

                                                    {confirmed ? (

                                                        <>

                                                            <span
                                                                className="
                                                                    text-[10px]
                                                                    text-[#1B5D2B]
                                                                "
                                                            >
                                                                Confirmed
                                                            </span>


                                                            <HiOutlineCheckCircle
                                                                size={16}
                                                                className="
                                                                    text-green-700
                                                                "
                                                            />

                                                        </>

                                                    ) : pending ? (

                                                        <>

                                                            <span
                                                                className="
                                                                    text-[10px]
                                                                    text-[#8A4F32]
                                                                "
                                                            >
                                                                Pending
                                                            </span>


                                                            <HiOutlineClock
                                                                size={16}
                                                                className="
                                                                    text-[#8A4F32]
                                                                "
                                                            />

                                                        </>

                                                    ) : (

                                                        <>

                                                            <span
                                                                className="
                                                                    text-[10px]
                                                                    text-[#8A4F32]
                                                                "
                                                            >
                                                                Available
                                                            </span>


                                                            <HiOutlineClock
                                                                size={16}
                                                                className="
                                                                    text-[#8A4F32]
                                                                "
                                                            />

                                                        </>

                                                    )}

                                                </div>

                                            </div>

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


export default HomeVisitConfirmation;