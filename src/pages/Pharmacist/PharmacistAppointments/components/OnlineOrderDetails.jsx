import {
    useEffect,
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
    HiOutlineArrowLeft,
    HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";



import { loadOnlineOrderDetails, processOnlineOrder } from "../../../../redux/pharmacist/pharmacistThunk";
import DashboardLayout from "../../../../components/Layout/DashboardLayout";
import { showErrorToast, showSuccessToast } from "../../../../../utils/showToast";


const OnlineOrderDetails = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        orderId,
    } = useParams();


    const {
        onlineOrderDetails,
        onlineOrderDetailsLoading,
        processingOnlineOrder,
    } = useSelector(
        (state) =>
            state.pharmacist
    );


    const [
        selectedItems,
        setSelectedItems,
    ] = useState([]);


    // ==========================================
    // LOAD ORDER DETAILS
    // ==========================================

    useEffect(() => {

        if (!orderId) {
            return;
        }

        dispatch(
            loadOnlineOrderDetails(
                orderId
            )
        );

    }, [
        orderId,
        dispatch,
    ]);


    // ==========================================
    // SET SELECTED ITEMS FROM API
    // ==========================================

    useEffect(() => {

        if (
            !onlineOrderDetails?.items
        ) {
            return;
        }

        const selected =
            onlineOrderDetails.items
                .filter(
                    (item) =>
                        item.is_selected
                )
                .map(
                    (item) =>
                        item.id
                );

        setSelectedItems(
            selected
        );

    }, [
        onlineOrderDetails,
    ]);


    // ==========================================
    // CHECKBOX
    // ==========================================

    const handleItemToggle = (
        itemId
    ) => {

        setSelectedItems(
            (previous) => {

                if (
                    previous.includes(
                        itemId
                    )
                ) {

                    return previous.filter(
                        (id) =>
                            id !== itemId
                    );

                }

                return [
                    ...previous,
                    itemId,
                ];

            }
        );

    };


    // ==========================================
    // PROCESS DELIVERY
    // ==========================================

    const handleProcessDelivery =
        async () => {

            if (!orderId) {
                return;
            }

            try {

                const result =
                    await dispatch(
                        processOnlineOrder(
                            orderId
                        )
                    ).unwrap();


                showSuccessToast(
                    "Delivery Processed",
                    result?.message ||
                    "Order delivery processed successfully"
                );


                navigate(
                    "/pharmacist/online-purchases"
                );

            } catch (error) {

                showErrorToast(
                    "Processing Failed",
                    error?.message ||
                    "Failed to process delivery"
                );

            }

        };


    if (
        onlineOrderDetailsLoading
    ) {

        return (

            <DashboardLayout
                role="pharmacist"
            >

                <div className="
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                    text-[14px]
                    text-[#77706C]
                ">
                    Loading order details...
                </div>

            </DashboardLayout>

        );

    }


    if (
        !onlineOrderDetails
    ) {

        return (

            <DashboardLayout
                role="pharmacist"
            >

                <div className="
                    p-6
                    text-center
                    text-[14px]
                    text-[#77706C]
                ">
                    Order details not found.
                </div>

            </DashboardLayout>

        );

    }


    const {
        patient_name,
        patient_id,
        address,
        items = [],
        total_amount,
        formatted_total,
    } = onlineOrderDetails;


    return (

        <DashboardLayout
            role="pharmacist"
        >

            <div className="
                w-full
                px-6
                py-5
            ">


                {/* ========================================= */}
                {/* MAIN CARD */}
                {/* ========================================= */}

                <div className="
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#E8DCD2]
                    bg-white
                    shadow-sm
                ">


                    {/* ===================================== */}
                    {/* PATIENT */}
                    {/* ===================================== */}

                    <div className="
                        p-7
                    ">

                        <div className="
                            flex
                            items-center
                            rounded-[18px]
                            border
                            border-[#E8DCD2]
                            px-5
                            py-5
                        ">

                            {/* PROFILE */}

                            <div className="
                                flex
                                h-14
                                w-14
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#E8F1F5]
                                text-[20px]
                                font-semibold
                                text-[#55717D]
                            ">
                                {
                                    patient_name
                                        ?.charAt(0)
                                        ?.toUpperCase()
                                }
                            </div>


                            {/* NAME */}

                            <div className="
                                ml-5
                                min-w-[350px]
                            ">

                                <p className="
                                    text-[19px]
                                    font-semibold
                                    text-[#4B2E2A]
                                ">
                                    {
                                        patient_name
                                    }
                                </p>


                                <p className="
                                    mt-1
                                    text-[14px]
                                    text-[#77706C]
                                ">
                                    Patient ID: {
                                        patient_id
                                    }
                                </p>

                            </div>


                            {/* DIVIDER */}

                            <div className="
                                mx-8
                                h-14
                                w-px
                                bg-[#E8DCD2]
                            " />


                            {/* ADDRESS */}

                            <p className="
                                max-w-[600px]
                                text-[15px]
                                leading-6
                                text-[#77706C]
                            ">
                                {
                                    address ||
                                    "-"
                                }
                            </p>

                        </div>


                        {/* ================================= */}
                        {/* MEDICINES TABLE */}
                        {/* ================================= */}

                        <div className="
                            mt-6
                            overflow-hidden
                            rounded-[18px]
                            border
                            border-[#E8DCD2]
                        ">

                            <table className="
                                w-full
                                border-collapse
                            ">

                                <thead>

                                    <tr className="
                                        bg-[#FFF9F4]
                                    ">

                                        <th className="
                                            border-b
                                            border-r
                                            border-[#E8DCD2]
                                            px-6
                                            py-5
                                            text-left
                                            text-[15px]
                                            font-medium
                                            text-[#4B2E2A]
                                        ">
                                            Medicines
                                        </th>


                                        <th className="
                                            border-b
                                            border-r
                                            border-[#E8DCD2]
                                            px-6
                                            py-5
                                            text-center
                                            text-[15px]
                                            font-medium
                                            text-[#4B2E2A]
                                        ">
                                            Price(₹)
                                        </th>


                                        <th className="
                                            border-b
                                            border-r
                                            border-[#E8DCD2]
                                            px-6
                                            py-5
                                            text-center
                                            text-[15px]
                                            font-medium
                                            text-[#4B2E2A]
                                        ">
                                            Qty.
                                        </th>


                                        <th className="
                                            border-b
                                            border-r
                                            border-[#E8DCD2]
                                            px-6
                                            py-5
                                            text-center
                                            text-[15px]
                                            font-medium
                                            text-[#4B2E2A]
                                        ">
                                            Discount(%)
                                        </th>


                                        <th className="
                                            border-b
                                            border-[#E8DCD2]
                                            px-6
                                            py-5
                                            text-left
                                            text-[15px]
                                            font-medium
                                            text-[#4B2E2A]
                                        ">
                                            Total Amount(₹)
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {items.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                {/* MEDICINE */}

                                                <td className="
                                                    border-b
                                                    border-r
                                                    border-[#E8DCD2]
                                                    px-6
                                                    py-5
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-5
                                                    ">

                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selectedItems.includes(
                                                                    item.id
                                                                )
                                                            }
                                                            onChange={() =>
                                                                handleItemToggle(
                                                                    item.id
                                                                )
                                                            }
                                                            className="
                                                                h-5
                                                                w-5
                                                                accent-[#5B2B25]
                                                            "
                                                        />


                                                        <div>

                                                            <p className="
                                                                text-[17px]
                                                                font-semibold
                                                                text-[#4B2E2A]
                                                            ">
                                                                {
                                                                    item.medicine_name
                                                                }
                                                            </p>


                                                            <p className="
                                                                mt-1
                                                                text-[14px]
                                                                text-[#77706C]
                                                            ">
                                                                {
                                                                    item.category
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* PRICE */}

                                                <td className="
                                                    border-b
                                                    border-r
                                                    border-[#E8DCD2]
                                                    px-6
                                                    py-5
                                                    text-center
                                                    text-[16px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">
                                                    {
                                                        item.price
                                                    }
                                                </td>


                                                {/* QTY */}

                                                <td className="
                                                    border-b
                                                    border-r
                                                    border-[#E8DCD2]
                                                    px-6
                                                    py-5
                                                    text-center
                                                    text-[16px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">
                                                    {
                                                        item.quantity
                                                    }
                                                </td>


                                                {/* DISCOUNT */}

                                                <td className="
                                                    border-b
                                                    border-r
                                                    border-[#E8DCD2]
                                                    px-6
                                                    py-5
                                                    text-center
                                                ">

                                                    <span className="
                                                        inline-flex
                                                        min-w-[110px]
                                                        justify-center
                                                        rounded-[18px]
                                                        border
                                                        border-[#E5D7CB]
                                                        px-5
                                                        py-3
                                                        text-[14px]
                                                        text-[#77706C]
                                                    ">
                                                        {
                                                            item.discount_percent
                                                        }%
                                                    </span>

                                                </td>


                                                {/* TOTAL */}

                                                <td className="
                                                    border-b
                                                    border-[#E8DCD2]
                                                    px-6
                                                    py-5
                                                    text-[16px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                ">
                                                    ₹{
                                                        item.total_amount
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}


                                    {/* TOTAL */}

                                    <tr className="
                                        bg-[#FFF9F4]
                                    ">

                                        <td
                                            colSpan={4}
                                            className="
                                                px-6
                                                py-5
                                                text-[18px]
                                                font-semibold
                                                text-[#4B2E2A]
                                            "
                                        >
                                            Total Amount
                                        </td>


                                        <td className="
                                            px-6
                                            py-5
                                            text-[18px]
                                            font-semibold
                                            text-[#4B2E2A]
                                        ">
                                            {
                                                formatted_total ||
                                                `₹${total_amount || 0}`
                                            }
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* ===================================== */}
                    {/* FOOTER */}
                    {/* ===================================== */}

                    <div className="
                        flex
                        gap-5
                        border-t
                        border-[#E8DCD2]
                        p-6
                    ">


                        {/* BACK */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/pharmacist/online-purchases"
                                )
                            }
                            className="
                                flex
                                h-[60px]
                                flex-1
                                items-center
                                justify-center
                                gap-3
                                rounded-[16px]
                                border
                                border-[#E5D7CB]
                                bg-white
                                text-[16px]
                                font-semibold
                                text-[#4B2E2A]
                            "
                        >

                            <HiOutlineArrowLeft
                                size={22}
                            />

                            Back

                        </button>


                        {/* PROCESS */}

                        <button
                            type="button"
                            disabled={
                                processingOnlineOrder
                            }
                            onClick={
                                handleProcessDelivery
                            }
                            className="
                                flex
                                h-[60px]
                                flex-1
                                items-center
                                justify-center
                                gap-3
                                rounded-[16px]
                                bg-[#8B533A]
                                text-[16px]
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#77432F]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            <HiOutlineArrowRightOnRectangle
                                size={22}
                            />

                            {
                                processingOnlineOrder
                                    ? "Processing..."
                                    : "Process Delivery"
                            }

                        </button>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

};


export default OnlineOrderDetails;