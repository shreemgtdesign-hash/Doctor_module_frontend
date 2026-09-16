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
import { loadPendingPaymentInvoiceDetails } from "../../../redux/frontOffice/frontOfficeBillingThunk";


const PendingPaymentDetails = () => {

    const {
        appointmentId,
    } = useParams();

    const dispatch =
        useDispatch();


    const {
        invoiceDetails,
        invoiceDetailsLoading,
        invoiceDetailsError,
    } =
        useSelector(
            (state) =>
                state.frontOfficeBilling
        );


    const [
        paymentMode,
        setPaymentMode,
    ] = useState("");


    useEffect(() => {

        if (appointmentId) {

            dispatch(
                loadPendingPaymentInvoiceDetails(
                    appointmentId
                )
            );

        }

    }, [
        dispatch,
        appointmentId,
    ]);


    if (invoiceDetailsLoading) {

        return (
            <div className="p-8 text-[#4B2E2A]">
                Loading invoice details...
            </div>
        );

    }


    if (invoiceDetailsError) {

        return (
            <div className="p-8 text-red-600">
                {String(invoiceDetailsError)}
            </div>
        );

    }


    if (!invoiceDetails) {

        return (
            <div className="p-8 text-[#4B2E2A]">
                Invoice details not found.
            </div>
        );

    }


    const patient =
        invoiceDetails.patient_details || {};

    const doctor =
        invoiceDetails.doctor_details || {};

    const breakdown =
        invoiceDetails.billing_breakdown || [];


    return (

        <div className="px-6 py-5">

            {/* ================================= */}
            {/* BREADCRUMB */}
            {/* ================================= */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <h1
                    className="
                        text-[20px]
                        font-semibold
                        text-[#2F2F2F]
                    "
                >
                    Billing Details
                </h1>

                <span>›</span>

                <h1
                    className="
                        text-[20px]
                        font-semibold
                        text-[#2F2F2F]
                    "
                >
                    Pending payments
                </h1>

                <span>›</span>

                <h1
                    className="
                        text-[20px]
                        font-semibold
                        text-[#2F2F2F]
                    "
                >
                    {patient.name}
                </h1>

            </div>


            <p
                className="
                    mt-2
                    text-[13px]
                    text-[#756D69]
                "
            >
                Pending Payment
            </p>


            {/* ================================= */}
            {/* PATIENT + PAYMENT */}
            {/* ================================= */}

            <div
                className="
                    mt-5
                    flex
                    gap-5
                "
            >

                <div
                    className="
                        flex-1
                        rounded-2xl
                        border
                        border-[#EFE4DC]
                        p-4
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

                            <p className="text-[13px] font-semibold text-[#4B2E2A]">
                                {patient.name}
                            </p>

                            <p className="mt-1 text-[11px] text-[#777]">
                                Patient ID: {patient.patient_id}
                            </p>

                        </div>


                        <div>

                            <p className="text-[12px] text-[#4B2E2A]">
                                {patient.mobile}
                            </p>

                        </div>


                        <select
                            value={paymentMode}
                            onChange={(e) =>
                                setPaymentMode(
                                    e.target.value
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-[#E7DBD3]
                                bg-white
                                px-3
                                py-2
                                text-[12px]
                                text-[#4B2E2A]
                                outline-none
                            "
                        >

                            <option value="">
                                Select Payment mode
                            </option>

                            {(
                                invoiceDetails
                                    .available_payment_modes ||
                                []
                            ).map(
                                (mode) => (

                                    <option
                                        key={mode}
                                        value={mode}
                                    >
                                        {mode}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>


                {/* TOTAL */}

                <div
                    className="
                        w-[190px]
                        rounded-2xl
                        border
                        border-[#EFE4DC]
                        p-4
                    "
                >

                    <div
                        className="
                            flex
                            justify-between
                            text-[12px]
                        "
                    >

                        <span>
                            Total
                        </span>

                        <strong>
                            {
                                invoiceDetails
                                    .formatted_total
                            }
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
                            px-4
                            py-3
                            text-[12px]
                            font-semibold
                            text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Process Payment
                    </button>

                </div>

            </div>


            {/* ================================= */}
            {/* BILLING BREAKDOWN */}
            {/* ================================= */}

            <BillingSection
                title="Billing Breakdown"
                items={breakdown}
                invoice={invoiceDetails}
            />


            {/* ================================= */}
            {/* DOCTOR */}
            {/* ================================= */}

            <div
                className="
                    mt-5
                    rounded-2xl
                    border
                    border-[#EFE4DC]
                    p-4
                "
            >

                <h2
                    className="
                        mb-3
                        text-[16px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    Doctor Details
                </h2>

                <p className="text-[13px] font-semibold">
                    {doctor.name}
                </p>

                <p className="mt-1 text-[12px] text-[#777]">
                    {doctor.specialization}
                </p>

            </div>

        </div>

    );
};


const BillingSection = ({
    title,
    items,
    invoice,
}) => {

    return (

        <div className="mt-5">

            {/* SECTION TITLE */}

            <h2
                className="
                    mb-3
                    text-[15px]
                    font-semibold
                    text-[#4B2E2A]
                "
            >
                {title}
            </h2>


            {/* BILLING TABLE */}

            <div
                className="
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-[#EFE4DC]
                "
            >

                <table
                    className="
                        w-full
                        border-collapse
                    "
                >

                    <thead>

                        <tr
                            className="
                                bg-[#FFF9F4]
                            "
                        >

                            <th
                                className="
                                    border-r
                                    border-[#EFE4DC]
                                    px-3
                                    py-2.5
                                    text-left
                                    text-[11px]
                                    font-medium
                                    text-[#4B2E2A]
                                "
                            >
                                Item
                            </th>


                            <th
                                className="
                                    border-r
                                    border-[#EFE4DC]
                                    px-3
                                    py-2.5
                                    text-left
                                    text-[11px]
                                    font-medium
                                    text-[#4B2E2A]
                                "
                            >
                                Category
                            </th>


                            <th
                                className="
                                    px-3
                                    py-2.5
                                    text-right
                                    text-[11px]
                                    font-medium
                                    text-[#4B2E2A]
                                "
                            >
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {items.map(
                            (item, index) => (

                                <tr
                                    key={index}
                                    className="
                                        border-t
                                        border-[#EFE4DC]
                                    "
                                >

                                    {/* ITEM */}

                                    <td
                                        className="
                                            border-r
                                            border-[#EFE4DC]
                                            px-3
                                            py-3
                                            text-[12px]
                                            font-medium
                                            text-[#4B2E2A]
                                        "
                                    >
                                        {item?.item || "—"}
                                    </td>


                                    {/* CATEGORY */}

                                    <td
                                        className="
                                            border-r
                                            border-[#EFE4DC]
                                            px-3
                                            py-3
                                            text-[11px]
                                            text-[#756D69]
                                        "
                                    >
                                        {item?.category || "—"}
                                    </td>


                                    {/* AMOUNT */}

                                    <td
                                        className="
                                            px-3
                                            py-3
                                            text-right
                                            text-[12px]
                                            font-semibold
                                            text-[#4B2E2A]
                                        "
                                    >
                                        {
                                            item?.formatted ||
                                            `₹${item?.amount ?? 0}`
                                        }
                                    </td>

                                </tr>

                            )
                        )}


                        {/* TOTAL */}

                        <tr
                            className="
                                border-t
                                border-[#EFE4DC]
                                bg-[#FFF9F4]
                            "
                        >

                            <td
                                colSpan="2"
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
                                    text-right
                                    text-[12px]
                                    font-semibold
                                    text-[#4B2E2A]
                                "
                            >
                                {
                                    invoice?.formatted_total ||
                                    "₹0"
                                }
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );
};


export default PendingPaymentDetails;