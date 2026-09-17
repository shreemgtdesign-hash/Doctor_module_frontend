import {
    useEffect,
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
    ChevronDown,
} from "lucide-react";

import {
    loadPendingPaymentInvoiceDetails,
} from "../../../redux/frontOffice/frontOfficeBillingThunk";


const PendingPaymentDetails = () => {

    const {
        appointmentId,
    } = useParams();

    const dispatch = useDispatch();

    const {
        invoiceDetails,
        invoiceDetailsLoading,
        invoiceDetailsError,
    } = useSelector(
        (state) =>
            state.frontOfficeBilling
    );


    // ==========================================
    // PAYMENT MODE
    // ==========================================

    const [
        paymentMode,
        setPaymentMode,
    ] = useState("");

    const [
        showPaymentDropdown,
        setShowPaymentDropdown,
    ] = useState(false);


    // ==========================================
    // LOAD INVOICE
    // ==========================================

    useEffect(() => {

        if (!appointmentId) {
            return;
        }

        dispatch(
            loadPendingPaymentInvoiceDetails(
                appointmentId
            )
        );

    }, [
        dispatch,
        appointmentId,
    ]);


    // ==========================================
    // CLOSE DROPDOWN OUTSIDE
    // ==========================================

    useEffect(() => {

        const handleClickOutside = (
            event
        ) => {

            if (
                !event.target.closest(
                    "[data-payment-dropdown]"
                )
            ) {
                setShowPaymentDropdown(false);
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


    // ==========================================
    // LOADING
    // ==========================================

    if (invoiceDetailsLoading) {

        return (
            <div className="flex min-h-[400px] items-center justify-center text-[13px] text-[#6F625B]">
                Loading invoice details...
            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (invoiceDetailsError) {

        return (
            <div className="p-6 text-[13px] text-red-600">
                {String(invoiceDetailsError)}
            </div>
        );

    }


    // ==========================================
    // EMPTY
    // ==========================================

    if (!invoiceDetails) {

        return (
            <div className="p-6 text-[13px] text-[#4B2E2A]">
                Invoice details not found.
            </div>
        );

    }


    // ==========================================
    // DATA
    // ==========================================

    const patient =
        invoiceDetails.patient_details || {};

    const doctor =
        invoiceDetails.doctor_details || {};

    const consultations =
        invoiceDetails.consultation?.length
            ? invoiceDetails.consultation
            : invoiceDetails.consultations || [];

    const therapies =
        invoiceDetails.therapy?.length
            ? invoiceDetails.therapy
            : invoiceDetails.therapies || [];

    const prescriptions =
        invoiceDetails.prescription?.length
            ? invoiceDetails.prescription
            : invoiceDetails.prescriptions || [];

    const paymentModes =
        invoiceDetails.available_payment_modes || [];

    const qrCode =
        invoiceDetails.qr_code_url ||
        invoiceDetails.qr_code ||
        "";


    return (

        <div className="px-6 py-5">

            {/* ================================================= */}
            {/* BREADCRUMB */}
            {/* ================================================= */}

            <div className="flex items-center gap-2">

                <h1 className="text-[20px] font-semibold text-[#2F2F2F]">
                    Billing Details
                </h1>

                <span className="text-[24px] text-[#8A817B]">
                    ›
                </span>

                <h1 className="text-[20px] font-semibold text-[#2F2F2F]">
                    Pending payments
                </h1>

                <span className="text-[24px] text-[#8A817B]">
                    ›
                </span>

                <h1 className="max-w-[180px] truncate text-[20px] font-semibold text-[#2F2F2F]">
                    {patient.name ||
                        patient.patient_name ||
                        "Patient"}
                </h1>

            </div>


            <p className="mt-1 text-[12px] text-[#756D69]">
                {invoiceDetails.total_pending_text ||
                    `${invoiceDetails.total_pending_payments || 0} Total Pending payments`}
            </p>


            {/* ================================================= */}
            {/* PATIENT + PAYMENT + TOTAL + QR */}
            {/* ================================================= */}

            <div className="mt-5 flex gap-5">

                {/* PATIENT CARD */}

                <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-[#EFE4DC] bg-white px-4 py-4">

                    <div className="min-w-[150px]">

                        <p className="text-[13px] font-semibold text-[#4B2E2A]">
                            {patient.name ||
                                patient.patient_name ||
                                "—"}
                        </p>

                        <p className="mt-1 text-[10px] text-[#88807B]">
                            Patient ID:{" "}
                            {patient.patient_id ||
                                patient.patient_code ||
                                "—"}
                        </p>

                    </div>


                    <div className="mx-4 h-10 w-px bg-[#EFE4DC]" />


                    {/* MOBILE */}

                    <div className="min-w-[130px]">

                        <p className="text-[12px] font-medium text-[#4B2E2A]">
                            {patient.mobile || "—"}
                        </p>

                    </div>


                    <div className="mx-4 h-10 w-px bg-[#EFE4DC]" />


                    {/* EMAIL */}

                    <div className="min-w-0 flex-1">

                        <p className="truncate text-[12px] font-medium text-[#4B2E2A]">
                            {patient.email || "—"}
                        </p>

                    </div>


                    {/* PAYMENT MODE */}

                    <div
                        className="relative ml-4 w-[175px]"
                        data-payment-dropdown
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setShowPaymentDropdown(
                                    (previous) =>
                                        !previous
                                )
                            }
                            className="
                                flex
                                h-[38px]
                                w-full
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-[#E7DBD3]
                                bg-white
                                px-3
                                text-left
                                text-[11px]
                                font-medium
                                text-[#4B2E2A]
                                transition
                                hover:border-[#CDB5A6]
                            "
                        >

                            <span className="truncate">
                                {paymentMode ||
                                    invoiceDetails.select_payment_mode ||
                                    "Select Payment mode"}
                            </span>

                            <ChevronDown
                                size={14}
                                className={`
                                    ml-2
                                    flex-shrink-0
                                    text-[#633A2B]
                                    transition-transform
                                    ${
                                        showPaymentDropdown
                                            ? "rotate-180"
                                            : ""
                                    }
                                `}
                            />

                        </button>


                        {showPaymentDropdown && (

                            <div
                                className="
                                    absolute
                                    right-0
                                    top-[44px]
                                    z-[100]
                                    w-full
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-[#E7DBD3]
                                    bg-white
                                    shadow-xl
                                "
                            >

                                {paymentModes.map(
                                    (mode) => {

                                        const selected =
                                            paymentMode ===
                                            mode;

                                        return (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => {
                                                    setPaymentMode(
                                                        mode
                                                    );

                                                    setShowPaymentDropdown(
                                                        false
                                                    );
                                                }}
                                                className={`
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    border-b
                                                    border-[#F0E5DE]
                                                    px-3
                                                    py-2.5
                                                    text-left
                                                    text-[11px]
                                                    last:border-b-0
                                                    transition
                                                    hover:bg-[#FFF8F2]
                                                    ${
                                                        selected
                                                            ? "bg-[#FFF8F2] font-semibold text-[#4B2E2A]"
                                                            : "text-[#6F625B]"
                                                    }
                                                `}
                                            >

                                                <span>
                                                    {mode}
                                                </span>

                                                {selected && (
                                                    <span className="text-[#8A5038]">
                                                        ✓
                                                    </span>
                                                )}

                                            </button>
                                        );

                                    }
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* TOTAL */}

                <div className="w-[190px] rounded-2xl border border-[#EFE4DC] bg-white p-4">

                    <div className="flex items-center justify-between">

                        <span className="text-[12px] font-semibold text-[#4B2E2A]">
                            Total
                        </span>

                        <strong className="text-[13px] font-semibold text-[#4B2E2A]">
                            {invoiceDetails.formatted_total ||
                                "₹0"}
                        </strong>

                    </div>


                    <button
                        type="button"
                        disabled={!paymentMode}
                        className="
                            mt-3
                            w-full
                            rounded-xl
                            bg-[#8A553B]
                            px-3
                            py-2.5
                            text-[11px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#77452F]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Process Payment
                    </button>

                </div>


                {/* QR CODE */}

                <div className="
                    flex
                    h-[102px]
                    w-[102px]
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[#EFE4DC]
                    bg-white
                    p-2
                ">

                    {qrCode ? (

                        <img
                            src={qrCode}
                            alt="Payment QR Code"
                            className="h-full w-full object-contain"
                        />

                    ) : (

                        <span className="text-center text-[9px] text-[#999]">
                            QR unavailable
                        </span>

                    )}

                </div>

            </div>


            {/* ================================================= */}
            {/* CONSULTATION */}
            {/* ================================================= */}

            <InvoiceTable
                title="Consultation"
                type="consultation"
                items={consultations}
                total={
                    invoiceDetails.formatted_consultation_total
                }
            />


            {/* ================================================= */}
            {/* THERAPY */}
            {/* ================================================= */}

            <InvoiceTable
                title="Therapy"
                type="therapy"
                items={therapies}
                total={
                    invoiceDetails.formatted_therapy_total
                }
            />


            {/* ================================================= */}
            {/* PRESCRIPTION */}
            {/* ================================================= */}

            <InvoiceTable
                title="Prescription"
                type="prescription"
                items={prescriptions}
                total={
                    invoiceDetails.formatted_prescription_total
                }
            />

        </div>
    );
};


// =====================================================
// INVOICE TABLE
// =====================================================

const InvoiceTable = ({
    title,
    type,
    items = [],
    total,
}) => {

    const getDoctorName = (item) =>
        item?.doctor_details?.name ||
        item?.doctor_name ||
        "—";

    const getDoctorType = (item) =>
        item?.doctor_details?.type ||
        item?.doctor_type ||
        "";

    const getDate = (item) =>
        item?.date_and_time?.date ||
        item?.date ||
        "—";

    const getTime = (item) =>
        item?.date_and_time?.time ||
        item?.time ||
        "—";


    return (

        <div className="mt-6">

            <h2 className="mb-3 text-[17px] font-semibold text-[#2F2F2F]">
                {title}
            </h2>


            <div className="overflow-hidden rounded-2xl border border-[#EFE4DC] bg-white">

                {/* ================================================= */}
                {/* CONSULTATION */}
                {/* ================================================= */}

                {type === "consultation" && (

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="bg-[#FFF9F4]">

                                <HeaderCell>
                                    Doctor Details
                                </HeaderCell>

                                <HeaderCell>
                                    Date and Time
                                </HeaderCell>

                                <HeaderCell>
                                    Consultation Type
                                </HeaderCell>

                                <HeaderCell center>
                                    Consultation
                                    <br />
                                    fees(₹)
                                </HeaderCell>

                                <HeaderCell center>
                                    Discount(%)
                                </HeaderCell>

                                <HeaderCell>
                                    Remarks
                                </HeaderCell>

                                <HeaderCell center last>
                                    Total
                                    <br />
                                    Amount(₹)
                                </HeaderCell>

                            </tr>

                        </thead>


                        <tbody>

                            {items.length > 0 ? (

                                items.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item.id ||
                                                index
                                            }
                                            className="border-t border-[#EFE4DC]"
                                        >

                                            {/* DOCTOR */}

                                            <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                <p className="text-[12px] font-semibold text-[#4B2E2A]">
                                                    {getDoctorName(
                                                        item
                                                    )}
                                                </p>

                                                <p className="mt-1 text-[10px] text-[#8A817B]">
                                                    {getDoctorType(
                                                        item
                                                    )}
                                                </p>

                                            </td>


                                            {/* DATE */}

                                            <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                <p className="text-[12px] font-semibold text-[#4B2E2A]">
                                                    {getDate(
                                                        item
                                                    )}
                                                </p>

                                                <p className="mt-1 text-[10px] text-[#88807B]">
                                                    {getTime(
                                                        item
                                                    )}
                                                </p>

                                            </td>


                                            {/* TYPE */}

                                            <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                <p className="text-[12px] font-semibold text-[#4B2E2A]">
                                                    {item.consultation_type ||
                                                        "—"}
                                                </p>

                                            </td>


                                            {/* FEES */}

                                            <td className="border-r border-[#EFE4DC] px-3 py-3 text-center align-top text-[12px] font-semibold text-[#4B2E2A]">

                                                {item.formatted_fees ??
                                                    item.consultation_fees ??
                                                    0}

                                            </td>


                                            {/* DISCOUNT */}

                                            <td className="border-r border-[#EFE4DC] px-3 py-3 text-center align-top">

                                                <div className="
                                                    inline-flex
                                                    min-w-[65px]
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
                                                    {item.discount ||
                                                        `${item.discount_percentage || 0}%`}
                                                </div>

                                            </td>


                                            {/* REMARKS */}

                                            <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                <div className="
                                                    rounded-full
                                                    border
                                                    border-[#E7DBD3]
                                                    px-3
                                                    py-2
                                                    text-[10px]
                                                    text-[#756D69]
                                                ">
                                                    {item.remarks &&
                                                    item.remarks !==
                                                        "-"
                                                        ? item.remarks
                                                        : "Add remarks"}
                                                </div>

                                            </td>


                                            {/* TOTAL */}

                                            <td className="px-3 py-3 text-center align-top text-[12px] font-semibold text-[#4B2E2A]">

                                                {item.formatted_total ??
                                                    item.total_amount ??
                                                    0}

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-[11px] text-[#8B7A70]"
                                    >
                                        No consultation details
                                        available.
                                    </td>

                                </tr>

                            )}


                            {/* TOTAL */}

                            <InvoiceTotalRow
                                colSpan={6}
                                total={total}
                            />

                        </tbody>

                    </table>
                )}


                {/* ================================================= */}
                {/* THERAPY */}
                {/* ================================================= */}

                {type === "therapy" && (

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="bg-[#FFF9F4]">

                                <HeaderCell>
                                    Doctor Details
                                </HeaderCell>

                                <HeaderCell>
                                    Date and Time
                                </HeaderCell>

                                <HeaderCell>
                                    Therapy
                                </HeaderCell>

                                <HeaderCell center>
                                    Therapy Cost
                                    <br />
                                    (₹)
                                </HeaderCell>

                                <HeaderCell center>
                                    Discount(%)
                                </HeaderCell>

                                <HeaderCell>
                                    Remarks
                                </HeaderCell>

                                <HeaderCell center last>
                                    Total
                                    <br />
                                    Amount(₹)
                                </HeaderCell>

                            </tr>

                        </thead>


                        <tbody>

                            {items.length > 0 ? (

                                items.map(
                                    (item, index) => {

                                        const therapyName =
                                            item.therapy ||
                                            item.therapy_name ||
                                            item.treatment_name ||
                                            item.name ||
                                            "—";

                                        const cost =
                                            item.formatted_cost ??
                                            item.therapy_cost ??
                                            item.amount ??
                                            0;

                                        const totalAmount =
                                            item.formatted_total ??
                                            item.total_amount ??
                                            item.amount ??
                                            0;

                                        return (

                                            <tr
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                                className="border-t border-[#EFE4DC]"
                                            >

                                                <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                    <p className="text-[12px] font-semibold text-[#4B2E2A]">
                                                        {getDoctorName(
                                                            item
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-[#8A817B]">
                                                        {getDoctorType(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                    <p className="text-[12px] font-semibold text-[#4B2E2A]">
                                                        {getDate(
                                                            item
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-[#88807B]">
                                                        {getTime(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 align-top text-[12px] font-semibold text-[#4B2E2A]">

                                                    {therapyName}

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 text-center align-top text-[12px] font-semibold text-[#4B2E2A]">

                                                    {cost}

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 text-center align-top">

                                                    <div className="
                                                        inline-flex
                                                        min-w-[65px]
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
                                                        {item.discount ||
                                                            `${item.discount_percentage || 0}%`}
                                                    </div>

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                    <div className="
                                                        rounded-full
                                                        border
                                                        border-[#E7DBD3]
                                                        px-3
                                                        py-2
                                                        text-[10px]
                                                        text-[#756D69]
                                                    ">
                                                        {item.remarks &&
                                                        item.remarks !==
                                                            "-"
                                                            ? item.remarks
                                                            : "Add remarks"}
                                                    </div>

                                                </td>


                                                <td className="px-3 py-3 text-center align-top text-[12px] font-semibold text-[#4B2E2A]">

                                                    {totalAmount}

                                                </td>

                                            </tr>
                                        );
                                    }
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-[11px] text-[#8B7A70]"
                                    >
                                        No therapy details
                                        available.
                                    </td>

                                </tr>

                            )}


                            <InvoiceTotalRow
                                colSpan={6}
                                total={total}
                            />

                        </tbody>

                    </table>
                )}


                {/* ================================================= */}
                {/* PRESCRIPTION */}
                {/* ================================================= */}

                {type === "prescription" && (

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="bg-[#FFF9F4]">

                                <HeaderCell>
                                    Doctor Details
                                </HeaderCell>

                                <HeaderCell>
                                    Date and Time
                                </HeaderCell>

                                <HeaderCell>
                                    Medicines
                                </HeaderCell>

                                <HeaderCell center>
                                    Price(₹)
                                </HeaderCell>

                                <HeaderCell center>
                                    Qty.
                                </HeaderCell>

                                <HeaderCell center>
                                    Discount(%)
                                </HeaderCell>

                                <HeaderCell>
                                    Remarks
                                </HeaderCell>

                                <HeaderCell center last>
                                    Total
                                    <br />
                                    Amount(₹)
                                </HeaderCell>

                            </tr>

                        </thead>


                        <tbody>

                            {items.length > 0 ? (

                                items.map(
                                    (item, index) => {

                                        const medicineName =
                                            item.medicine_name ||
                                            item.medicine ||
                                            item.product_name ||
                                            item.name ||
                                            "—";

                                        const price =
                                            item.formatted_price ??
                                            item.price ??
                                            0;

                                        const quantity =
                                            item.quantity ??
                                            item.qty ??
                                            1;

                                        const totalAmount =
                                            item.formatted_total ??
                                            item.total_amount ??
                                            (
                                                Number(
                                                    item.price || 0
                                                ) *
                                                Number(
                                                    quantity
                                                )
                                            );

                                        return (

                                            <tr
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                                className="border-t border-[#EFE4DC]"
                                            >

                                                <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                    <p className="text-[12px] font-semibold text-[#4B2E2A]">
                                                        {getDoctorName(
                                                            item
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-[#8A817B]">
                                                        {getDoctorType(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                    <p className="text-[12px] font-semibold text-[#4B2E2A]">
                                                        {getDate(
                                                            item
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-[#88807B]">
                                                        {getTime(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 align-top text-[12px] font-semibold text-[#4B2E2A]">

                                                    {medicineName}

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 text-center align-top text-[12px] font-semibold text-[#4B2E2A]">

                                                    {price}

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 text-center align-top text-[12px] font-semibold text-[#4B2E2A]">

                                                    {quantity}

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 text-center align-top">

                                                    <div className="
                                                        inline-flex
                                                        min-w-[65px]
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
                                                        {item.discount ||
                                                            `${item.discount_percentage || 0}%`}
                                                    </div>

                                                </td>


                                                <td className="border-r border-[#EFE4DC] px-3 py-3 align-top">

                                                    <div className="
                                                        rounded-full
                                                        border
                                                        border-[#E7DBD3]
                                                        px-3
                                                        py-2
                                                        text-[10px]
                                                        text-[#756D69]
                                                    ">
                                                        {item.remarks &&
                                                        item.remarks !==
                                                            "-"
                                                            ? item.remarks
                                                            : "Add remarks"}
                                                    </div>

                                                </td>


                                                <td className="px-3 py-3 text-center align-top text-[12px] font-semibold text-[#4B2E2A]">

                                                    {totalAmount}

                                                </td>

                                            </tr>

                                        );
                                    }
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="px-4 py-8 text-center text-[11px] text-[#8B7A70]"
                                    >
                                        No prescription details
                                        available.
                                    </td>

                                </tr>

                            )}


                            <InvoiceTotalRow
                                colSpan={7}
                                total={total}
                            />

                        </tbody>

                    </table>
                )}

            </div>

        </div>
    );
};


// =====================================================
// TABLE HEADER CELL
// =====================================================

const HeaderCell = ({
    children,
    center = false,
    last = false,
}) => {

    return (
        <th
            className={`
                px-3
                py-2.5
                text-[10px]
                font-medium
                text-[#4B2E2A]
                ${
                    !last
                        ? "border-r border-[#EFE4DC]"
                        : ""
                }
                ${
                    center
                        ? "text-center"
                        : "text-left"
                }
            `}
        >
            {children}
        </th>
    );
};


// =====================================================
// TOTAL ROW
// =====================================================

const InvoiceTotalRow = ({
    colSpan,
    total,
}) => {

    return (

        <tr className="border-t border-[#EFE4DC] bg-[#FFF9F4]">

            <td
                colSpan={colSpan}
                className="
                    px-3
                    py-3
                    text-[12px]
                    font-semibold
                    text-[#4B2E2A]
                "
            >
                Total Amount
            </td>

            <td
                className="
                    px-3
                    py-3
                    text-center
                    text-[12px]
                    font-semibold
                    text-[#4B2E2A]
                "
            >
                {total || "₹0"}
            </td>

        </tr>
    );
};


export default PendingPaymentDetails;