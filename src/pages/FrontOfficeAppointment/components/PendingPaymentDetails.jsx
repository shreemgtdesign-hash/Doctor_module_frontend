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
    applyPendingPaymentDiscountThunk,
} from "../../../redux/frontOffice/frontOfficeBillingThunk";


const PendingPaymentDetails = () => {

    const {
        appointmentId,
    } = useParams();

    const dispatch = useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

    const {
        invoiceDetails,
        invoiceDetailsLoading,
        invoiceDetailsError,

        applyingPendingPaymentDiscount = false,
        pendingPaymentDiscountError = null,
    } = useSelector(
        (state) =>
            state.frontOfficeBilling || {}
    );


    // =====================================================
    // PAYMENT MODE
    // =====================================================

    const [
        paymentMode,
        setPaymentMode,
    ] = useState("");

    const [
        showPaymentDropdown,
        setShowPaymentDropdown,
    ] = useState(false);


    // =====================================================
    // LINE EDITS
    // =====================================================

    const [
        lineEdits,
        setLineEdits,
    ] = useState({});


    const [
        savingLineKey,
        setSavingLineKey,
    ] = useState(null);


    // =====================================================
    // LOAD INVOICE
    // =====================================================

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


    // =====================================================
    // CLOSE PAYMENT DROPDOWN OUTSIDE
    // =====================================================

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


    // =====================================================
    // DATA
    // =====================================================

    const patient =
        invoiceDetails?.patient_details ||
        {};

    const doctor =
        invoiceDetails?.doctor_details ||
        {};


    const consultations =
        invoiceDetails?.consultation?.length
            ? invoiceDetails.consultation
            : invoiceDetails?.consultations ||
              [];


    const therapies =
        invoiceDetails?.therapy?.length
            ? invoiceDetails.therapy
            : invoiceDetails?.therapies ||
              [];


    const prescriptions =
        invoiceDetails?.prescription?.length
            ? invoiceDetails.prescription
            : invoiceDetails?.prescriptions ||
              [];


    const paymentModes =
        invoiceDetails?.available_payment_modes ||
        [];


    const qrCode =
        invoiceDetails?.qr_code_url ||
        invoiceDetails?.qr_code ||
        "";


    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatCurrency = (
        amount
    ) => {

        const numericAmount =
            Number(amount) || 0;

        return (
            "₹" +
            numericAmount.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 2,
                }
            )
        );

    };


    // =====================================================
    // GET BASE AMOUNT
    // =====================================================

    const getBaseAmount = (
        item,
        category
    ) => {

        if (
            category ===
            "consultation"
        ) {

            return Number(
                item?.consultation_fees ??
                item?.amount ??
                item?.total_amount ??
                0
            );

        }


        if (
            category ===
            "therapy"
        ) {

            return Number(
                item?.therapy_cost ??
                item?.cost ??
                item?.amount ??
                item?.total_amount ??
                0
            );

        }


        if (
            category ===
            "prescription"
        ) {

            const price =
                Number(
                    item?.price || 0
                );

            const quantity =
                Number(
                    item?.quantity ??
                    item?.qty ??
                    1
                );

            return (
                price *
                quantity
            );

        }


        return Number(
            item?.amount ??
            item?.total_amount ??
            0
        );

    };


    // =====================================================
    // GET INITIAL DISCOUNT
    // =====================================================

    const getInitialDiscount = (
        item
    ) => {

        if (
            item?.discount_percentage !==
                undefined &&
            item?.discount_percentage !==
                null
        ) {

            return Number(
                item.discount_percentage
            );

        }


        const discountValue =
            String(
                item?.discount ??
                "0"
            )
                .replace(
                    "%",
                    ""
                )
                .trim();


        const numericValue =
            Number(
                discountValue
            );


        return Number.isFinite(
            numericValue
        )
            ? numericValue
            : 0;

    };


    // =====================================================
    // GET INITIAL REMARKS
    // =====================================================

    const getInitialRemarks = (
        item
    ) => {

        if (
            item?.remarks &&
            item.remarks !== "-"
        ) {

            return item.remarks;

        }

        return "";

    };


    // =====================================================
    // LINE KEY
    // =====================================================

    const getLineKey = (
        item,
        category,
        index
    ) => {

        return (
            `${category}-${item?.id || index}`
        );

    };


    // =====================================================
    // LINE EDIT VALUE
    // =====================================================

    const getLineEdit = (
        item,
        category,
        index
    ) => {

        const key =
            getLineKey(
                item,
                category,
                index
            );


        return (
            lineEdits[key] || {
                discount_percentage:
                    getInitialDiscount(
                        item
                    ),

                remarks:
                    getInitialRemarks(
                        item
                    ),
            }
        );

    };


    // =====================================================
    // UPDATE LINE EDIT
    // =====================================================

    const updateLineEdit = (
        item,
        category,
        index,
        field,
        value
    ) => {

        const key =
            getLineKey(
                item,
                category,
                index
            );


        setLineEdits(
            (previous) => {

                const oldValue =
                    previous[key] || {
                        discount_percentage:
                            getInitialDiscount(
                                item
                            ),

                        remarks:
                            getInitialRemarks(
                                item
                            ),
                    };


                return {
                    ...previous,

                    [key]: {
                        ...oldValue,
                        [field]: value,
                    },
                };

            }
        );

    };


    // =====================================================
    // CALCULATE LINE TOTAL
    // =====================================================

    const calculateLineTotal = (
        item,
        category,
        index
    ) => {

        const edit =
            getLineEdit(
                item,
                category,
                index
            );


        const baseAmount =
            getBaseAmount(
                item,
                category
            );


        let discount =
            Number(
                edit.discount_percentage
            );


        if (
            !Number.isFinite(
                discount
            )
        ) {

            discount = 0;

        }


        discount =
            Math.min(
                100,
                Math.max(
                    0,
                    discount
                )
            );


        const discountAmount =
            (
                baseAmount *
                discount
            ) /
            100;


        return (
            baseAmount -
            discountAmount
        );

    };


    // =====================================================
    // APPLY DISCOUNT & REMARKS
    // =====================================================

    const handleApplyLineEdit = async (
        item,
        category,
        index
    ) => {

        if (
            !appointmentId ||
            !item?.id
        ) {
            return;
        }


        const key =
            getLineKey(
                item,
                category,
                index
            );


        const edit =
            getLineEdit(
                item,
                category,
                index
            );


        let discount =
            Number(
                edit.discount_percentage
            );


        if (
            !Number.isFinite(
                discount
            )
        ) {

            discount = 0;

        }


        discount =
            Math.min(
                100,
                Math.max(
                    0,
                    discount
                )
            );


        setSavingLineKey(
            key
        );


        try {

            await dispatch(
                applyPendingPaymentDiscountThunk({
                    appointmentId,

                    itemId:
                        item.id,

                    category,

                    discountPercentage:
                        discount,

                    remarks:
                        edit.remarks ||
                        "",
                })
            ).unwrap();

        } catch (error) {

            console.error(
                "Failed to apply discount & remarks:",
                error
            );

        } finally {

            setSavingLineKey(
                null
            );

        }

    };


    // =====================================================
    // SECTION TOTAL
    // =====================================================

    const calculateSectionTotal = (
        items,
        category
    ) => {

        return (
            items || []
        ).reduce(
            (
                total,
                item,
                index
            ) => {

                return (
                    total +
                    calculateLineTotal(
                        item,
                        category,
                        index
                    )
                );

            },
            0
        );

    };


    // =====================================================
    // TOTALS
    // =====================================================

    const consultationTotal =
        calculateSectionTotal(
            consultations,
            "consultation"
        );


    const therapyTotal =
        calculateSectionTotal(
            therapies,
            "therapy"
        );


    const prescriptionTotal =
        calculateSectionTotal(
            prescriptions,
            "prescription"
        );


    const calculatedGrandTotal =
        consultationTotal +
        therapyTotal +
        prescriptionTotal;


    const hasInvoiceLineItems =
        consultations.length > 0 ||
        therapies.length > 0 ||
        prescriptions.length > 0;


    const displayGrandTotal =
        hasInvoiceLineItems
            ? calculatedGrandTotal
            : Number(
                invoiceDetails?.total_amount ||
                invoiceDetails?.total ||
                0
            );


    // =====================================================
    // LOADING
    // =====================================================

    if (
        invoiceDetailsLoading &&
        !invoiceDetails
    ) {

        return (

            <div className="
                flex
                min-h-[400px]
                items-center
                justify-center
                text-[13px]
                text-[#6F625B]
            ">
                Loading invoice details...
            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        invoiceDetailsError
    ) {

        return (

            <div className="
                p-6
                text-[13px]
                text-red-600
            ">
                {String(
                    invoiceDetailsError
                )}
            </div>

        );

    }


    // =====================================================
    // EMPTY
    // =====================================================

    if (
        !invoiceDetails
    ) {

        return (

            <div className="
                p-6
                text-[13px]
                text-[#4B2E2A]
            ">
                Invoice details not found.
            </div>

        );

    }


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="px-6 py-5">


            {/* ================================================= */}
            {/* BREADCRUMB */}
            {/* ================================================= */}

            <div className="
                flex
                items-center
                gap-2
            ">

                <h1 className="
                    text-[20px]
                    font-semibold
                    text-[#2F2F2F]
                ">
                    Billing Details
                </h1>


                <span className="
                    text-[24px]
                    text-[#8A817B]
                ">
                    ›
                </span>


                <h1 className="
                    text-[20px]
                    font-semibold
                    text-[#2F2F2F]
                ">
                    Pending payments
                </h1>


                <span className="
                    text-[24px]
                    text-[#8A817B]
                ">
                    ›
                </span>


                <h1 className="
                    max-w-[180px]
                    truncate
                    text-[20px]
                    font-semibold
                    text-[#2F2F2F]
                ">
                    {patient.name ||
                        patient.patient_name ||
                        "Patient"}
                </h1>

            </div>


            <p className="
                mt-1
                text-[12px]
                text-[#756D69]
            ">
                {invoiceDetails.total_pending_text ||
                    `${invoiceDetails.total_pending_payments || 0} Total Pending payments`}
            </p>


            {/* ================================================= */}
            {/* PATIENT + PAYMENT + TOTAL + QR */}
            {/* ================================================= */}

            <div className="
                mt-5
                flex
                gap-5
            ">


                {/* ================================================= */}
                {/* PATIENT CARD */}
                {/* ================================================= */}

                <div className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    rounded-2xl
                    border
                    border-[#EFE4DC]
                    bg-white
                    px-4
                    py-4
                ">


                    {/* PATIENT */}

                    <div className="
                        min-w-[150px]
                    ">

                        <p className="
                            text-[13px]
                            font-semibold
                            text-[#4B2E2A]
                        ">
                            {patient.name ||
                                patient.patient_name ||
                                "—"}
                        </p>


                        <p className="
                            mt-1
                            text-[10px]
                            text-[#88807B]
                        ">
                            Patient ID:{" "}
                            {patient.patient_id ||
                                patient.patient_code ||
                                "—"}
                        </p>

                    </div>


                    <div className="
                        mx-4
                        h-10
                        w-px
                        bg-[#EFE4DC]
                    " />


                    {/* MOBILE */}

                    <div className="
                        min-w-[130px]
                    ">

                        <p className="
                            text-[12px]
                            font-medium
                            text-[#4B2E2A]
                        ">
                            {patient.mobile ||
                                "—"}
                        </p>

                    </div>


                    <div className="
                        mx-4
                        h-10
                        w-px
                        bg-[#EFE4DC]
                    " />


                    {/* EMAIL */}

                    <div className="
                        min-w-0
                        flex-1
                    ">

                        <p className="
                            truncate
                            text-[12px]
                            font-medium
                            text-[#4B2E2A]
                        ">
                            {patient.email ||
                                "—"}
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* PAYMENT DROPDOWN */}
                    {/* ================================================= */}

                    <div
                        className="
                            relative
                            ml-4
                            w-[175px]
                        "
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

                            <span className="
                                truncate
                            ">
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

                            <div className="
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
                            ">

                                {paymentModes.map(
                                    (
                                        mode
                                    ) => {

                                        const selected =
                                            paymentMode ===
                                            mode;


                                        return (

                                            <button
                                                key={
                                                    mode
                                                }
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
                                                    {
                                                        mode
                                                    }
                                                </span>


                                                {selected && (

                                                    <span className="
                                                        text-[#8A5038]
                                                    ">
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


                {/* ================================================= */}
                {/* TOTAL */}
                {/* ================================================= */}

                <div className="
                    w-[190px]
                    rounded-2xl
                    border
                    border-[#EFE4DC]
                    bg-white
                    p-4
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <span className="
                            text-[12px]
                            font-semibold
                            text-[#4B2E2A]
                        ">
                            Total
                        </span>


                        <strong className="
                            text-[13px]
                            font-semibold
                            text-[#4B2E2A]
                        ">
                            {formatCurrency(
                                displayGrandTotal
                            )}
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


                {/* ================================================= */}
                {/* QR CODE */}
                {/* ================================================= */}

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
                            className="
                                h-full
                                w-full
                                object-contain
                            "
                        />

                    ) : (

                        <span className="
                            text-center
                            text-[9px]
                            text-[#999]
                        ">
                            QR unavailable
                        </span>

                    )}

                </div>

            </div>


            {/* ================================================= */}
            {/* API ERROR FOR DISCOUNT */}
            {/* ================================================= */}

            {pendingPaymentDiscountError && (

                <div className="
                    mt-4
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-[11px]
                    text-red-600
                ">
                    {typeof pendingPaymentDiscountError ===
                    "string"
                        ? pendingPaymentDiscountError
                        : "Failed to update discount and remarks."}
                </div>

            )}


            {/* ================================================= */}
            {/* CONSULTATION */}
            {/* ================================================= */}

            <InvoiceTable
                title="Consultation"
                type="consultation"
                items={consultations}
                total={consultationTotal}
                getLineEdit={getLineEdit}
                updateLineEdit={updateLineEdit}
                calculateLineTotal={calculateLineTotal}
                handleApplyLineEdit={
                    handleApplyLineEdit
                }
                savingLineKey={
                    savingLineKey
                }
                applyingPendingPaymentDiscount={
                    applyingPendingPaymentDiscount
                }
                formatCurrency={
                    formatCurrency
                }
            />


            {/* ================================================= */}
            {/* THERAPY */}
            {/* ================================================= */}

            <InvoiceTable
                title="Therapy"
                type="therapy"
                items={therapies}
                total={therapyTotal}
                getLineEdit={getLineEdit}
                updateLineEdit={updateLineEdit}
                calculateLineTotal={calculateLineTotal}
                handleApplyLineEdit={
                    handleApplyLineEdit
                }
                savingLineKey={
                    savingLineKey
                }
                applyingPendingPaymentDiscount={
                    applyingPendingPaymentDiscount
                }
                formatCurrency={
                    formatCurrency
                }
            />


            {/* ================================================= */}
            {/* PRESCRIPTION */}
            {/* ================================================= */}

            <InvoiceTable
                title="Prescription"
                type="prescription"
                items={prescriptions}
                total={prescriptionTotal}
                getLineEdit={getLineEdit}
                updateLineEdit={updateLineEdit}
                calculateLineTotal={calculateLineTotal}
                handleApplyLineEdit={
                    handleApplyLineEdit
                }
                savingLineKey={
                    savingLineKey
                }
                applyingPendingPaymentDiscount={
                    applyingPendingPaymentDiscount
                }
                formatCurrency={
                    formatCurrency
                }
            />

        </div>

    );
};


// =====================================================
// STABLE REMARKS INPUT
// =====================================================
// IMPORTANT:
// This component is outside InvoiceTable.
// Therefore React keeps the same input mounted
// while typing and the cursor/focus is preserved.
// =====================================================

const RemarksInput = ({
    item,
    type,
    index,
    getLineEdit,
    updateLineEdit,
    handleApplyLineEdit,
    savingLineKey,
    applyingPendingPaymentDiscount,
}) => {

    const edit =
        getLineEdit(
            item,
            type,
            index
        );


    const lineKey =
        `${type}-${item?.id || index}`;


    const handleKeyDown = (
        event
    ) => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            handleApplyLineEdit(
                item,
                type,
                index
            );

            event.currentTarget.blur();

        }

    };


    return (

        <div className="
            relative
        ">

            <input
                type="text"

                value={
                    edit.remarks || ""
                }

                onChange={(event) =>
                    updateLineEdit(
                        item,
                        type,
                        index,
                        "remarks",
                        event.target.value
                    )
                }

                onKeyDown={
                    handleKeyDown
                }

                disabled={
                    applyingPendingPaymentDiscount &&
                    savingLineKey === lineKey
                }

                placeholder="Add remarks"

                className="
                    w-full
                    rounded-full
                    border
                    border-[#E7DBD3]
                    bg-white
                    px-3
                    py-2
                    text-[10px]
                    text-[#756D69]
                    outline-none
                    placeholder:text-[#A49A94]
                    focus:border-[#BDA18F]
                    disabled:opacity-60
                "
            />

        </div>

    );

};


// =====================================================
// STABLE DISCOUNT INPUT
// =====================================================
// IMPORTANT:
// This component is outside InvoiceTable.
// This prevents React from remounting the input
// after every character.
// =====================================================

const DiscountInput = ({
    item,
    type,
    index,
    getLineEdit,
    updateLineEdit,
    handleApplyLineEdit,
    savingLineKey,
    applyingPendingPaymentDiscount,
}) => {

    const edit =
        getLineEdit(
            item,
            type,
            index
        );


    const lineKey =
        `${type}-${item?.id || index}`;


    const handleKeyDown = (
        event
    ) => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            handleApplyLineEdit(
                item,
                type,
                index
            );

            event.currentTarget.blur();

        }

    };


    const handleChange = (
        event
    ) => {

        const value =
            event.target.value;


        // Allow empty value while typing.
        // This is important for normal editing.

        if (
            value === ""
        ) {

            updateLineEdit(
                item,
                type,
                index,
                "discount_percentage",
                ""
            );

            return;

        }


        const numericValue =
            Number(value);


        // Allow only 0 - 100.

        if (
            !Number.isFinite(
                numericValue
            ) ||
            numericValue < 0 ||
            numericValue > 100
        ) {

            return;

        }


        updateLineEdit(
            item,
            type,
            index,
            "discount_percentage",
            value
        );

    };


    return (

        <div className="
            flex
            items-center
            justify-center
        ">

            <input
                type="number"

                min="0"

                max="100"

                step="1"

                value={
                    edit.discount_percentage ??
                    ""
                }

                onChange={
                    handleChange
                }

                onKeyDown={
                    handleKeyDown
                }

                disabled={
                    applyingPendingPaymentDiscount &&
                    savingLineKey === lineKey
                }

                className="
                    inline-flex
                    w-[65px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#E7DBD3]
                    bg-white
                    px-3
                    py-2
                    text-center
                    text-[10px]
                    text-[#756D69]
                    outline-none
                    focus:border-[#BDA18F]
                    disabled:opacity-60
                "
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

    getLineEdit,
    updateLineEdit,
    calculateLineTotal,
    handleApplyLineEdit,

    savingLineKey,
    applyingPendingPaymentDiscount,

    formatCurrency,
}) => {


    // =====================================================
    // DOCTOR NAME
    // =====================================================

    const getDoctorName = (
        item
    ) => {

        return (
            item?.doctor_details?.name ||
            item?.doctor_name ||
            "—"
        );

    };


    // =====================================================
    // DOCTOR TYPE
    // =====================================================

    const getDoctorType = (
        item
    ) => {

        return (
            item?.doctor_details?.type ||
            item?.doctor_type ||
            ""
        );

    };


    // =====================================================
    // DATE
    // =====================================================

    const getDate = (
        item
    ) => {

        return (
            item?.date_and_time?.date ||
            item?.date_time?.date ||
            item?.date ||
            "—"
        );

    };


    // =====================================================
    // TIME
    // =====================================================

    const getTime = (
        item
    ) => {

        return (
            item?.date_and_time?.time ||
            item?.date_time?.time ||
            item?.time ||
            "—"
        );

    };


    // =====================================================
    // CONSULTATION
    // =====================================================

    if (
        type ===
        "consultation"
    ) {

        return (

            <div className="
                mt-6
            ">

                <h2 className="
                    mb-3
                    text-[17px]
                    font-semibold
                    text-[#2F2F2F]
                ">
                    {title}
                </h2>


                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#EFE4DC]
                    bg-white
                ">

                    <table className="
                        w-full
                        border-collapse
                    ">

                        <thead>

                            <tr className="
                                bg-[#FFF9F4]
                            ">

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


                                <HeaderCell
                                    center
                                    last
                                >
                                    Total
                                    <br />
                                    Amount(₹)
                                </HeaderCell>

                            </tr>

                        </thead>


                        <tbody>

                            {items.length > 0 ? (

                                items.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const lineTotal =
                                            calculateLineTotal(
                                                item,
                                                type,
                                                index
                                            );


                                        return (

                                            <tr
                                                key={
                                                    item?.id ||
                                                    index
                                                }
                                                className="
                                                    border-t
                                                    border-[#EFE4DC]
                                                "
                                            >

                                                {/* DOCTOR */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <p className="
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#4B2E2A]
                                                    ">
                                                        {getDoctorName(
                                                            item
                                                        )}
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-[10px]
                                                        text-[#8A817B]
                                                    ">
                                                        {getDoctorType(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                {/* DATE */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <p className="
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#4B2E2A]
                                                    ">
                                                        {getDate(
                                                            item
                                                        )}
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-[10px]
                                                        text-[#88807B]
                                                    ">
                                                        {getTime(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                {/* TYPE */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <p className="
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#4B2E2A]
                                                    ">
                                                        {
                                                            item?.consultation_type ||
                                                            "—"
                                                        }
                                                    </p>

                                                </td>


                                                {/* FEES */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                    text-[12px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">

                                                    {
                                                        item?.formatted_fees ??
                                                        item?.consultation_fees ??
                                                        0
                                                    }

                                                </td>


                                                {/* DISCOUNT */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                ">

                                                    <DiscountInput
                                                        item={
                                                            item
                                                        }

                                                        type={
                                                            type
                                                        }

                                                        index={
                                                            index
                                                        }

                                                        getLineEdit={
                                                            getLineEdit
                                                        }

                                                        updateLineEdit={
                                                            updateLineEdit
                                                        }

                                                        handleApplyLineEdit={
                                                            handleApplyLineEdit
                                                        }

                                                        savingLineKey={
                                                            savingLineKey
                                                        }

                                                        applyingPendingPaymentDiscount={
                                                            applyingPendingPaymentDiscount
                                                        }
                                                    />

                                                </td>


                                                {/* REMARKS */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <RemarksInput
                                                        item={
                                                            item
                                                        }

                                                        type={
                                                            type
                                                        }

                                                        index={
                                                            index
                                                        }

                                                        getLineEdit={
                                                            getLineEdit
                                                        }

                                                        updateLineEdit={
                                                            updateLineEdit
                                                        }

                                                        handleApplyLineEdit={
                                                            handleApplyLineEdit
                                                        }

                                                        savingLineKey={
                                                            savingLineKey
                                                        }

                                                        applyingPendingPaymentDiscount={
                                                            applyingPendingPaymentDiscount
                                                        }
                                                    />

                                                </td>


                                                {/* TOTAL */}

                                                <td className="
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                    text-[12px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">

                                                    {
                                                        formatCurrency(
                                                            lineTotal
                                                        )
                                                    }

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={
                                            7
                                        }
                                        className="
                                            px-4
                                            py-8
                                            text-center
                                            text-[11px]
                                            text-[#8B7A70]
                                        "
                                    >
                                        No consultation details
                                        available.
                                    </td>

                                </tr>

                            )}


                            <InvoiceTotalRow
                                colSpan={
                                    6
                                }
                                total={
                                    total
                                }
                                formatCurrency={
                                    formatCurrency
                                }
                            />

                        </tbody>

                    </table>

                </div>

            </div>

        );

    }


    // =====================================================
    // THERAPY
    // =====================================================

    if (
        type ===
        "therapy"
    ) {

        return (

            <div className="
                mt-6
            ">

                <h2 className="
                    mb-3
                    text-[17px]
                    font-semibold
                    text-[#2F2F2F]
                ">
                    {title}
                </h2>


                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#EFE4DC]
                    bg-white
                ">

                    <table className="
                        w-full
                        border-collapse
                    ">

                        <thead>

                            <tr className="
                                bg-[#FFF9F4]
                            ">

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


                                <HeaderCell
                                    center
                                    last
                                >
                                    Total
                                    <br />
                                    Amount(₹)
                                </HeaderCell>

                            </tr>

                        </thead>


                        <tbody>

                            {items.length > 0 ? (

                                items.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const therapyName =
                                            item?.therapy ||
                                            item?.therapy_name ||
                                            item?.treatment_name ||
                                            item?.name ||
                                            "—";


                                        const cost =
                                            item?.formatted_cost ??
                                            item?.therapy_cost ??
                                            item?.cost ??
                                            item?.amount ??
                                            0;


                                        const lineTotal =
                                            calculateLineTotal(
                                                item,
                                                type,
                                                index
                                            );


                                        return (

                                            <tr
                                                key={
                                                    item?.id ||
                                                    index
                                                }
                                                className="
                                                    border-t
                                                    border-[#EFE4DC]
                                                "
                                            >

                                                {/* DOCTOR */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <p className="
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#4B2E2A]
                                                    ">
                                                        {getDoctorName(
                                                            item
                                                        )}
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-[10px]
                                                        text-[#8A817B]
                                                    ">
                                                        {getDoctorType(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                {/* DATE */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <p className="
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#4B2E2A]
                                                    ">
                                                        {getDate(
                                                            item
                                                        )}
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-[10px]
                                                        text-[#88807B]
                                                    ">
                                                        {getTime(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                {/* THERAPY */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                    text-[12px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">

                                                    {
                                                        therapyName
                                                    }

                                                </td>


                                                {/* COST */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                    text-[12px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">

                                                    {cost}

                                                </td>


                                                {/* DISCOUNT */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                ">

                                                    <DiscountInput
                                                        item={
                                                            item
                                                        }

                                                        type={
                                                            type
                                                        }

                                                        index={
                                                            index
                                                        }

                                                        getLineEdit={
                                                            getLineEdit
                                                        }

                                                        updateLineEdit={
                                                            updateLineEdit
                                                        }

                                                        handleApplyLineEdit={
                                                            handleApplyLineEdit
                                                        }

                                                        savingLineKey={
                                                            savingLineKey
                                                        }

                                                        applyingPendingPaymentDiscount={
                                                            applyingPendingPaymentDiscount
                                                        }
                                                    />

                                                </td>


                                                {/* REMARKS */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <RemarksInput
                                                        item={
                                                            item
                                                        }

                                                        type={
                                                            type
                                                        }

                                                        index={
                                                            index
                                                        }

                                                        getLineEdit={
                                                            getLineEdit
                                                        }

                                                        updateLineEdit={
                                                            updateLineEdit
                                                        }

                                                        handleApplyLineEdit={
                                                            handleApplyLineEdit
                                                        }

                                                        savingLineKey={
                                                            savingLineKey
                                                        }

                                                        applyingPendingPaymentDiscount={
                                                            applyingPendingPaymentDiscount
                                                        }
                                                    />

                                                </td>


                                                {/* TOTAL */}

                                                <td className="
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                    text-[12px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">

                                                    {
                                                        formatCurrency(
                                                            lineTotal
                                                        )
                                                    }

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={
                                            7
                                        }
                                        className="
                                            px-4
                                            py-8
                                            text-center
                                            text-[11px]
                                            text-[#8B7A70]
                                        "
                                    >
                                        No therapy details
                                        available.
                                    </td>

                                </tr>

                            )}


                            <InvoiceTotalRow
                                colSpan={
                                    6
                                }
                                total={
                                    total
                                }
                                formatCurrency={
                                    formatCurrency
                                }
                            />

                        </tbody>

                    </table>

                </div>

            </div>

        );

    }


    // =====================================================
    // PRESCRIPTION
    // =====================================================

    if (
        type ===
        "prescription"
    ) {

        return (

            <div className="
                mt-6
            ">

                <h2 className="
                    mb-3
                    text-[17px]
                    font-semibold
                    text-[#2F2F2F]
                ">
                    {title}
                </h2>


                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#EFE4DC]
                    bg-white
                ">

                    <table className="
                        w-full
                        border-collapse
                    ">

                        <thead>

                            <tr className="
                                bg-[#FFF9F4]
                            ">

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


                                <HeaderCell
                                    center
                                    last
                                >
                                    Total
                                    <br />
                                    Amount(₹)
                                </HeaderCell>

                            </tr>

                        </thead>


                        <tbody>

                            {items.length > 0 ? (

                                items.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const medicineName =
                                            item?.medicine_name ||
                                            item?.medicine ||
                                            item?.product_name ||
                                            item?.name ||
                                            "—";


                                        const price =
                                            item?.formatted_price ??
                                            item?.price ??
                                            0;


                                        const quantity =
                                            item?.quantity ??
                                            item?.qty ??
                                            1;


                                        const lineTotal =
                                            calculateLineTotal(
                                                item,
                                                type,
                                                index
                                            );


                                        return (

                                            <tr
                                                key={
                                                    item?.id ||
                                                    index
                                                }
                                                className="
                                                    border-t
                                                    border-[#EFE4DC]
                                                "
                                            >

                                                {/* DOCTOR */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <p className="
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#4B2E2A]
                                                    ">
                                                        {getDoctorName(
                                                            item
                                                        )}
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-[10px]
                                                        text-[#8A817B]
                                                    ">
                                                        {getDoctorType(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                {/* DATE */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <p className="
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#4B2E2A]
                                                    ">
                                                        {getDate(
                                                            item
                                                        )}
                                                    </p>


                                                    <p className="
                                                        mt-1
                                                        text-[10px]
                                                        text-[#88807B]
                                                    ">
                                                        {getTime(
                                                            item
                                                        )}
                                                    </p>

                                                </td>


                                                {/* MEDICINE */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                    text-[12px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">

                                                    {
                                                        medicineName
                                                    }

                                                </td>


                                                {/* PRICE */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                    text-[12px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">

                                                    {price}

                                                </td>


                                                {/* QUANTITY */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                    text-[12px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">

                                                    {quantity}

                                                </td>


                                                {/* DISCOUNT */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                ">

                                                    <DiscountInput
                                                        item={
                                                            item
                                                        }

                                                        type={
                                                            type
                                                        }

                                                        index={
                                                            index
                                                        }

                                                        getLineEdit={
                                                            getLineEdit
                                                        }

                                                        updateLineEdit={
                                                            updateLineEdit
                                                        }

                                                        handleApplyLineEdit={
                                                            handleApplyLineEdit
                                                        }

                                                        savingLineKey={
                                                            savingLineKey
                                                        }

                                                        applyingPendingPaymentDiscount={
                                                            applyingPendingPaymentDiscount
                                                        }
                                                    />

                                                </td>


                                                {/* REMARKS */}

                                                <td className="
                                                    border-r
                                                    border-[#EFE4DC]
                                                    px-3
                                                    py-3
                                                    align-top
                                                ">

                                                    <RemarksInput
                                                        item={
                                                            item
                                                        }

                                                        type={
                                                            type
                                                        }

                                                        index={
                                                            index
                                                        }

                                                        getLineEdit={
                                                            getLineEdit
                                                        }

                                                        updateLineEdit={
                                                            updateLineEdit
                                                        }

                                                        handleApplyLineEdit={
                                                            handleApplyLineEdit
                                                        }

                                                        savingLineKey={
                                                            savingLineKey
                                                        }

                                                        applyingPendingPaymentDiscount={
                                                            applyingPendingPaymentDiscount
                                                        }
                                                    />

                                                </td>


                                                {/* TOTAL */}

                                                <td className="
                                                    px-3
                                                    py-3
                                                    text-center
                                                    align-top
                                                    text-[12px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">

                                                    {
                                                        formatCurrency(
                                                            lineTotal
                                                        )
                                                    }

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={
                                            8
                                        }
                                        className="
                                            px-4
                                            py-8
                                            text-center
                                            text-[11px]
                                            text-[#8B7A70]
                                        "
                                    >
                                        No prescription details
                                        available.
                                    </td>

                                </tr>

                            )}


                            <InvoiceTotalRow
                                colSpan={
                                    7
                                }
                                total={
                                    total
                                }
                                formatCurrency={
                                    formatCurrency
                                }

                            />

                        </tbody>

                    </table>

                </div>

            </div>

        );

    }


    return null;
};


// =====================================================
// TABLE HEADER
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
    formatCurrency,
}) => {

    return (

        <tr className="
            border-t
            border-[#EFE4DC]
            bg-[#FFF9F4]
        ">

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


            <td className="
                px-3
                py-3
                text-center
                text-[12px]
                font-semibold
                text-[#4B2E2A]
            ">

                {formatCurrency(
                    total
                )}

            </td>

        </tr>

    );

};


export default PendingPaymentDetails;