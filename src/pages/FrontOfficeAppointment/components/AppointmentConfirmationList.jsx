import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    HiOutlineArrowRight,
    HiOutlineClock,
} from "react-icons/hi2";


import {
    loadAppointmentConfirmationList,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import {
    selectAppointmentConfirmationList,
    selectAppointmentConfirmationListLoading,
    selectAppointmentConfirmationListError,
} from "../../../redux/frontOffice/frontOfficeAppointmentSlice";
import DashboardLayout from "../../../components/Layout/DashboardLayout";


const AppointmentConfirmationList = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const doctors =
        useSelector(
            selectAppointmentConfirmationList
        );

    const loading =
        useSelector(
            selectAppointmentConfirmationListLoading
        );

    const error =
        useSelector(
            selectAppointmentConfirmationListError
        );


    useEffect(() => {

        dispatch(
            loadAppointmentConfirmationList()
        );

    }, [dispatch]);




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
                {/* HEADER */}
                {/* ========================================= */}

                <div
                    className="
                        mb-5
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
                                Appointment Confirmation
                            </h2>

                        </div>

                    </div>

                </div>


                {/* ========================================= */}
                {/* ERROR */}
                {/* ========================================= */}

                {error && (

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
                        {typeof error === "string"
                            ? error
                            : "Failed to load appointment confirmations."}
                    </div>

                )}


                {/* ========================================= */}
                {/* LIST */}
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

                    {loading ? (

                        <div
                            className="
                                flex
                                min-h-[500px]
                                items-center
                                justify-center
                                text-sm
                                text-[#7D726B]
                            "
                        >
                            Loading appointment requests...
                        </div>

                    ) : doctors.length === 0 ? (

                        <div
                            className="
                                flex
                                min-h-[400px]
                                items-center
                                justify-center
                                text-sm
                                text-[#7D726B]
                            "
                        >
                            No appointment confirmation requests found.
                        </div>

                    ) : (

                        <div>

                            {doctors.map(
                                (doctor) => (

                                    <div
                                        key={
                                            doctor.doctor_id
                                        }
                                        className="
                                            grid
                                            grid-cols-[1.15fr_1.35fr_170px_195px]
                                            items-center
                                            border-b
                                            border-[#EEE4DD]
                                            px-4
                                            py-4
                                            last:border-b-0
                                        "
                                    >

                                        {/* ================================= */}
                                        {/* DOCTOR */}
                                        {/* ================================= */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                pr-5
                                            "
                                        >

                                            <div
                                                className="
                                                    h-[58px]
                                                    w-[58px]
                                                    shrink-0
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
                                                            doctor.doctor_name
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
                                                        {doctor.doctor_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || "D"}
                                                    </div>

                                                )}

                                            </div>


                                            <div
                                                className="
                                                    min-w-0
                                                "
                                            >

                                                <p
                                                    className="
                                                        truncate
                                                        text-[15px]
                                                        font-semibold
                                                        text-[#2F2926]
                                                    "
                                                >
                                                    {
                                                        doctor.doctor_name
                                                    }
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        line-clamp-1
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


                                        {/* ================================= */}
                                        {/* CONSULTATION TYPE */}
                                        {/* ================================= */}

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
                                                    doctor.consultation_type
                                                }
                                            </p>

                                        </div>


                                        {/* ================================= */}
                                        {/* REQUEST COUNT */}
                                        {/* ================================= */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-center
                                                border-l
                                                border-[#E8DDD6]
                                                px-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-[#F0DDC8]
                                                    bg-[#FFF7EC]
                                                    px-5
                                                    py-2.5
                                                "
                                            >

                                                <HiOutlineClock
                                                    size={15}
                                                    className="
                                                        text-[#8A4F32]
                                                    "
                                                />

                                                <span
                                                    className="
                                                        whitespace-nowrap
                                                        text-[12px]
                                                        font-medium
                                                        text-[#684331]
                                                    "
                                                >
                                                    {
                                                        doctor.requests_text
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        {/* ================================= */}
                                        {/* REVIEW */}
                                        {/* ================================= */}

                                        <div
                                            className="
                                                flex
                                                justify-end
                                                border-l
                                                border-[#E8DDD6]
                                                pl-5
                                            "
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/frontoffice/appointment-confirmation/${doctor.doctor_id}`
                                                    )
                                                }
                                                className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        border
                                                        border-[#E7D7C8]
                                                        bg-[#FFFCF9]
                                                        px-6
                                                        py-3
                                                        text-sm
                                                        font-medium
                                                         text-[#4B2E2A]
                                                        transition
                                                        hover:bg-[#FFF4EA]
                                                    "
                                            >
                                                Review Requests

                                                <HiOutlineArrowRight
                                                    size={18}
                                                />
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>

    );

};


export default AppointmentConfirmationList;