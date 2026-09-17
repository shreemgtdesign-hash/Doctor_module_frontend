import {
    useEffect,
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
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    Package,
    Truck,
} from "lucide-react";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";

import {
    loadOnlineMedicineOrderDetails,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const OnlineMedicineOrderDetails = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        orderId,
    } = useParams();


    const {
        onlineMedicineOrderDetails = null,
        onlineMedicineOrderDetailsLoading = false,
        onlineMedicineOrderDetailsError = null,
    } = useSelector(
        (state) =>
            state.frontOfficeAppointment
    );


    // ==========================================
    // LOAD DETAILS
    // ==========================================

    useEffect(() => {

        if (!orderId) {
            return;
        }

        dispatch(
            loadOnlineMedicineOrderDetails(
                orderId
            )
        );

    }, [
        dispatch,
        orderId,
    ]);


    // ==========================================
    // LOADING
    // ==========================================

    if (
        onlineMedicineOrderDetailsLoading
    ) {

        return (
            <DashboardLayout
                role="frontoffice"
            >
                <div className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-white
                ">
                    <p className="
                        text-[13px]
                        text-[#756D69]
                    ">
                        Loading medicine order...
                    </p>
                </div>
            </DashboardLayout>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (
        onlineMedicineOrderDetailsError
    ) {

        return (
            <DashboardLayout
                role="frontoffice"
            >
                <div className="
                    min-h-screen
                    bg-white
                    px-6
                    py-5
                ">

                    <div className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-[12px]
                        text-red-600
                    ">
                        {typeof onlineMedicineOrderDetailsError ===
                        "string"
                            ? onlineMedicineOrderDetailsError
                            : "Failed to load medicine order details."}
                    </div>

                </div>
            </DashboardLayout>
        );

    }


    if (
        !onlineMedicineOrderDetails
    ) {

        return (
            <DashboardLayout
                role="frontoffice"
            >
                <div className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-white
                ">
                    <p className="
                        text-[13px]
                        text-[#756D69]
                    ">
                        Medicine order not found.
                    </p>
                </div>
            </DashboardLayout>
        );

    }


    const order =
        onlineMedicineOrderDetails;

    const patient =
        order.patient || {};

    const medicines =
        Array.isArray(order.medicines)
            ? order.medicines
            : [];


    const profileImage =
        patient.profile_image ||
        "";


    const patientInitial =
        (
            patient.name ||
            patient.patient_name ||
            "P"
        )
            .charAt(0)
            .toUpperCase();


    return (

        <DashboardLayout
            role="frontoffice"
        >

            <div className="
                min-h-screen
                bg-white
                px-6
                py-5
                text-[#4B2E2A]
            ">


                {/* ====================================== */}
                {/* BREADCRUMB */}
                {/* ====================================== */}

                <div className="
                    mb-5
                    flex
                    items-center
                    gap-2
                    text-[14px]
                ">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/frontoffice/pending-actions/online-orders"
                            )
                        }
                        className="
                            font-medium
                            text-[#2F2926]
                            hover:text-[#8A4F32]
                        "
                    >
                        Medicine Orders
                    </button>

                    <span className="
                        text-[#8A817B]
                    ">
                        ›
                    </span>

                    <span className="
                        font-medium
                        text-[#2F2926]
                    ">
                        {patient.name ||
                            patient.patient_name ||
                            "Patient"}
                    </span>

                </div>


                {/* ====================================== */}
                {/* PATIENT CARD */}
                {/* ====================================== */}

                <div className="
                    flex
                    min-h-[118px]
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-[#E8DDD6]
                    bg-white
                    px-5
                    py-4
                ">


                    {/* PATIENT INFO */}

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                    ">

                        {profileImage ? (

                            <img
                                src={profileImage}
                                alt={
                                    patient.name ||
                                    "Patient"
                                }
                                className="
                                    h-[66px]
                                    w-[66px]
                                    rounded-full
                                    border
                                    border-[#E8DDD6]
                                    object-cover
                                "
                            />

                        ) : (

                            <div className="
                                flex
                                h-[66px]
                                w-[66px]
                                items-center
                                justify-center
                                rounded-full
                                bg-[#F4E8DE]
                                text-[20px]
                                font-semibold
                                text-[#8A553B]
                            ">
                                {patientInitial}
                            </div>

                        )}


                        <div>

                            <p className="
                                text-[15px]
                                font-semibold
                                text-[#3E2923]
                            ">
                                {patient.name ||
                                    patient.patient_name ||
                                    "--"}
                            </p>

                            <p className="
                                mt-1
                                text-[11px]
                                text-[#81756E]
                            ">
                                {patient.display_id ||
                                    `Patient ID: ${
                                        patient.patient_code ||
                                        patient.patient_id ||
                                        "--"
                                    }`}
                            </p>

                        </div>

                    </div>


                    {/* PATIENT CONTACT */}

                    <div className="
                        flex
                        items-center
                        gap-8
                        text-[11px]
                    ">

                        <div className="
                            max-w-[320px]
                        ">

                            <div className="
                                flex
                                gap-2
                            ">

                                <MapPin
                                    size={14}
                                    className="
                                        mt-0.5
                                        flex-shrink-0
                                        text-[#8A553B]
                                    "
                                />

                                <p className="
                                    leading-5
                                    text-[#81756E]
                                ">
                                    {
                                        patient.address ||
                                        "--"
                                    }
                                </p>

                            </div>

                        </div>


                        <div className="
                            flex
                            flex-col
                            gap-2
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <Phone
                                    size={13}
                                    className="text-[#8A553B]"
                                />

                                <span className="
                                    text-[#4B2E2A]
                                ">
                                    {
                                        patient.mobile ||
                                        "--"
                                    }
                                </span>

                            </div>


                            {patient.email && (

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <Mail
                                        size={13}
                                        className="text-[#8A553B]"
                                    />

                                    <span className="
                                        max-w-[210px]
                                        truncate
                                        text-[#4B2E2A]
                                    ">
                                        {patient.email}
                                    </span>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <span className="
                            rounded-full
                            bg-[#FFF4E6]
                            px-4
                            py-2
                            text-[11px]
                            font-medium
                            text-[#8A553B]
                        ">
                            {order.status_badge ||
                                order.status ||
                                "Order Placed"}
                        </span>

                    </div>

                </div>


                {/* ====================================== */}
                {/* ORDER META */}
                {/* ====================================== */}

                <div className="
                    mt-4
                    flex
                    items-center
                    justify-between
                ">

                    <div className="
                        flex
                        items-center
                        gap-6
                    ">

                        <div className="
                            flex
                            items-center
                            gap-2
                            text-[11px]
                            text-[#81756E]
                        ">
                            <Package
                                size={15}
                                className="text-[#8A553B]"
                            />

                            Order No:
                            <span className="
                                font-semibold
                                text-[#4B2E2A]
                            ">
                                {order.order_no ||
                                    "--"}
                            </span>
                        </div>


                        <div className="
                            flex
                            items-center
                            gap-2
                            text-[11px]
                            text-[#81756E]
                        ">
                            <Truck
                                size={15}
                                className="text-[#8A553B]"
                            />

                            Delivery:
                            <span className="
                                font-semibold
                                capitalize
                                text-[#4B2E2A]
                            ">
                                {
                                    (
                                        order.delivery_type ||
                                        ""
                                    ).replaceAll(
                                        "_",
                                        " "
                                    ) || "--"
                                }
                            </span>
                        </div>

                    </div>


                    <div className="
                        text-[11px]
                        text-[#81756E]
                    ">
                        Payment:

                        <span className="
                            ml-2
                            font-semibold
                            capitalize
                            text-[#4B2E2A]
                        ">
                            {order.payment_mode ||
                                "--"}
                        </span>

                    </div>

                </div>


                {/* ====================================== */}
                {/* MEDICINE TABLE */}
                {/* ====================================== */}

                <div className="
                    mt-5
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-[#E8DDD6]
                ">

                    {/* HEADER */}

                    <div className="
                        grid
                        grid-cols-[2fr_1fr_0.8fr_1fr_1.1fr]
                        border-b
                        border-[#E8DDD6]
                        bg-[#FFF9F4]
                    ">

                        <div className="
                            px-4
                            py-3
                            text-[11px]
                            font-medium
                        ">
                            Medicines
                        </div>

                        <div className="
                            border-l
                            border-[#E8DDD6]
                            px-3
                            py-3
                            text-center
                            text-[11px]
                            font-medium
                        ">
                            Price(₹)
                        </div>

                        <div className="
                            border-l
                            border-[#E8DDD6]
                            px-3
                            py-3
                            text-center
                            text-[11px]
                            font-medium
                        ">
                            Qty.
                        </div>

                        <div className="
                            border-l
                            border-[#E8DDD6]
                            px-3
                            py-3
                            text-center
                            text-[11px]
                            font-medium
                        ">
                            Discount(%)
                        </div>

                        <div className="
                            border-l
                            border-[#E8DDD6]
                            px-3
                            py-3
                            text-center
                            text-[11px]
                            font-medium
                        ">
                            Total Amount(₹)
                        </div>

                    </div>


                    {/* MEDICINES */}

                    {medicines.map(
                        (medicine) => (

                            <div
                                key={medicine.id}
                                className="
                                    grid
                                    min-h-[82px]
                                    grid-cols-[2fr_1fr_0.8fr_1fr_1.1fr]
                                    border-b
                                    border-[#EEE4DD]
                                    last:border-b-0
                                "
                            >

                                {/* MEDICINE */}

                                <div className="
                                    flex
                                    flex-col
                                    justify-center
                                    px-4
                                    py-4
                                ">

                                    <p className="
                                        text-[13px]
                                        font-semibold
                                        text-[#4B2E2A]
                                    ">
                                        {medicine.name ||
                                            medicine.medicine_name ||
                                            "--"}
                                    </p>

                                    <p className="
                                        mt-1
                                        text-[10px]
                                        text-[#81756E]
                                    ">
                                        {medicine.category ||
                                            "--"}
                                    </p>

                                </div>


                                {/* PRICE */}

                                <div className="
                                    flex
                                    items-center
                                    justify-center
                                    border-l
                                    border-[#EEE4DD]
                                    px-3
                                    text-[12px]
                                    font-semibold
                                    text-[#4B2E2A]
                                ">
                                    {medicine.formatted_price ||
                                        `₹${medicine.price || 0}`}
                                </div>


                                {/* QTY */}

                                <div className="
                                    flex
                                    items-center
                                    justify-center
                                    border-l
                                    border-[#EEE4DD]
                                    px-3
                                    text-[12px]
                                    font-semibold
                                    text-[#4B2E2A]
                                ">
                                    {
                                        medicine.quantity ??
                                        medicine.qty ??
                                        0
                                    }
                                </div>


                                {/* DISCOUNT */}

                                <div className="
                                    flex
                                    items-center
                                    justify-center
                                    border-l
                                    border-[#EEE4DD]
                                    px-3
                                ">

                                    <span className="
                                        inline-flex
                                        min-w-[68px]
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-[#E7DBD3]
                                        px-3
                                        py-2
                                        text-[10px]
                                        text-[#756D69]
                                    ">
                                        {
                                            medicine.discount_display ||
                                            `${medicine.discount_percent || 0}%`
                                        }
                                    </span>

                                </div>


                                {/* TOTAL */}

                                <div className="
                                    flex
                                    items-center
                                    justify-center
                                    border-l
                                    border-[#EEE4DD]
                                    px-3
                                    text-[12px]
                                    font-semibold
                                    text-[#4B2E2A]
                                ">
                                    {
                                        medicine.formatted_total_amount ||
                                        `₹${medicine.total_amount || 0}`
                                    }
                                </div>

                            </div>

                        )
                    )}


                    {/* TOTAL ROW */}

                    <div className="
                        grid
                        grid-cols-[1fr_1.1fr]
                        border-t
                        border-[#EEE4DD]
                        bg-[#FFF9F4]
                    ">

                        <div className="
                            px-4
                            py-4
                            text-[13px]
                            font-semibold
                            text-[#4B2E2A]
                        ">
                            Total Amount
                        </div>

                        <div className="
                            flex
                            items-center
                            justify-end
                            border-l
                            border-[#EEE4DD]
                            px-6
                            py-4
                            text-[13px]
                            font-semibold
                            text-[#4B2E2A]
                        ">
                            {
                                order.formatted_total_amount ||
                                `₹${order.total_amount || 0}`
                            }
                        </div>

                    </div>

                </div>


                {/* ====================================== */}
                {/* BACK */}
                {/* ====================================== */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/frontoffice/pending-actions/online-orders"
                        )
                    }
                    className="
                        mt-5
                        flex
                        items-center
                        gap-2
                        text-[12px]
                        font-medium
                        text-[#8A553B]
                        hover:text-[#6E422F]
                    "
                >
                    <ArrowLeft size={15} />
                    Back to Medicine Orders
                </button>

            </div>

        </DashboardLayout>
    );
};


export default OnlineMedicineOrderDetails;