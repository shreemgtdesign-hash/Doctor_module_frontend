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
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from "react-icons/hi2";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";

import {
    loadOnlineMedicineOrders,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const OnlineMedicineOrders = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const {
        onlineMedicineOrders = [],
        onlineMedicineOrdersLoading = false,
        onlineMedicineOrdersError = null,
        onlineMedicineOrdersPagination = null,
        onlineMedicineOrdersTotal = 0,
    } = useSelector(
        (state) =>
            state.frontOfficeAppointment
    );


    const currentPage =
        onlineMedicineOrdersPagination
            ?.current_page || 1;

    const totalPages =
        onlineMedicineOrdersPagination
            ?.total_pages || 1;


    useEffect(() => {

        dispatch(
            loadOnlineMedicineOrders({
                page: currentPage,
                limit: 8,
            })
        );

    }, [
        dispatch,
        currentPage,
    ]);


    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        dispatch(
            loadOnlineMedicineOrders({
                page,
                limit: 8,
            })
        );

    };


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
                {/* HEADER */}
                {/* ====================================== */}

                <div className="mb-5">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <h1 className="
                            text-[20px]
                            font-semibold
                            text-[#2F2F2F]
                        ">
                            Pending Actions
                        </h1>

                        <span className="
                            text-[20px]
                            text-[#8A817B]
                        ">
                            ›
                        </span>

                        <h2 className="
                            text-[20px]
                            font-semibold
                            text-[#2F2F2F]
                        ">
                            Medicine Orders
                        </h2>

                    </div>


                    <p className="
                        mt-2
                        text-[13px]
                        text-[#756D69]
                    ">
                        {onlineMedicineOrdersTotal}
                        {" "}
                        Total Medicine Orders
                    </p>

                </div>


                {/* ====================================== */}
                {/* PAGINATION */}
                {/* ====================================== */}

                <div className="
                    mb-3
                    flex
                    items-center
                    justify-end
                    gap-5
                ">

                    <span className="
                        text-[12px]
                        text-[#7D726B]
                    ">

                        Showing Orders{" "}

                        {
                            onlineMedicineOrdersPagination
                                ?.start_index ||
                            (
                                (
                                    currentPage -
                                    1
                                ) * 8
                            ) + 1
                        }

                        {" - "}

                        {
                            onlineMedicineOrdersPagination
                                ?.end_index ||
                            Math.min(
                                currentPage * 8,
                                onlineMedicineOrdersTotal
                            )
                        }

                        {" of "}

                        {onlineMedicineOrdersTotal}

                    </span>


                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <button
                            type="button"
                            disabled={
                                currentPage === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage - 1
                                )
                            }
                            className="
                                text-[#BFAFA7]
                                disabled:opacity-30
                            "
                        >
                            <HiOutlineChevronLeft
                                size={17}
                            />
                        </button>


                        <button
                            type="button"
                            disabled={
                                currentPage >=
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage + 1
                                )
                            }
                            className="
                                text-[#BFAFA7]
                                disabled:opacity-30
                            "
                        >
                            <HiOutlineChevronRight
                                size={17}
                            />
                        </button>

                    </div>

                </div>


                {/* ====================================== */}
                {/* TABLE */}
                {/* ====================================== */}

                <div className="
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-[#E8DDD6]
                ">

                    {/* HEADER */}

                    <div className="
                        grid
                        grid-cols-[1.4fr_1.2fr_1.6fr_0.8fr_1fr_1fr_1fr]
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
                            Patient
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
                            Order No.
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
                            Medicine
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
                            Amount
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
                            Payment
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
                            Actions
                        </div>

                    </div>


                    {/* LOADING */}

                    {onlineMedicineOrdersLoading && (

                        <div className="
                            py-12
                            text-center
                            text-[12px]
                            text-[#81756E]
                        ">
                            Loading medicine orders...
                        </div>

                    )}


                    {/* ERROR */}

                    {!onlineMedicineOrdersLoading &&
                        onlineMedicineOrdersError && (

                            <div className="
                                py-12
                                text-center
                                text-[12px]
                                text-red-600
                            ">
                                Failed to load medicine orders.
                            </div>

                        )}


                    {/* EMPTY */}

                    {!onlineMedicineOrdersLoading &&
                        !onlineMedicineOrdersError &&
                        onlineMedicineOrders.length === 0 && (

                            <div className="
                                py-12
                                text-center
                                text-[12px]
                                text-[#81756E]
                            ">
                                No medicine orders found.
                            </div>

                        )}


                    {/* ROWS */}

                    {!onlineMedicineOrdersLoading &&
                        onlineMedicineOrders.map(
                            (item) => (

                                <div
                                    key={item.id}
                                    className="
                                        grid
                                        min-h-[84px]
                                        grid-cols-[1.4fr_1.2fr_1.6fr_0.8fr_1fr_1fr_1fr]
                                        border-b
                                        border-[#EEE4DD]
                                        last:border-b-0
                                    "
                                >

                                    {/* PATIENT */}

                                    <div className="
                                        px-4
                                        py-4
                                    ">

                                        <p className="
                                            text-[12px]
                                            font-semibold
                                            text-[#4B2E2A]
                                        ">
                                            {item.patient_name ||
                                                "--"}
                                        </p>

                                        <p className="
                                            mt-1
                                            text-[10px]
                                            text-[#81756E]
                                        ">
                                            Patient ID:{" "}
                                            {item.patient_code ||
                                                "--"}
                                        </p>

                                    </div>


                                    {/* ORDER */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        border-l
                                        border-[#EEE4DD]
                                        px-3
                                        text-[11px]
                                    ">
                                        {item.order_no ||
                                            "--"}
                                    </div>


                                    {/* MEDICINE */}

                                    <div className="
                                        flex
                                        items-center
                                        border-l
                                        border-[#EEE4DD]
                                        px-3
                                    ">

                                        <div>

                                            <p className="
                                                text-[12px]
                                                font-semibold
                                                text-[#4B2E2A]
                                            ">
                                                {item.product_name ||
                                                    "--"}
                                            </p>

                                            <p className="
                                                mt-1
                                                text-[10px]
                                                text-[#81756E]
                                            ">
                                                {
                                                    item.delivery_type
                                                }
                                            </p>

                                        </div>

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
                                    ">
                                        {item.quantity ??
                                            0}
                                    </div>


                                    {/* AMOUNT */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        border-l
                                        border-[#EEE4DD]
                                        px-3
                                        text-[12px]
                                        font-semibold
                                    ">
                                        {item.formatted_amount ||
                                            `₹${item.total_amount || 0}`}
                                    </div>


                                    {/* PAYMENT */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        border-l
                                        border-[#EEE4DD]
                                        px-3
                                    ">

                                        <span className="
                                            rounded-full
                                            bg-[#FFF3E6]
                                            px-3
                                            py-1.5
                                            text-[10px]
                                            font-medium
                                            capitalize
                                            text-[#8A553B]
                                        ">
                                            {item.payment_status ||
                                                "pending"}
                                        </span>

                                    </div>


                                    {/* ACTION */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        border-l
                                        border-[#EEE4DD]
                                        px-3
                                    ">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/frontoffice/pending-actions/online-orders/${item.id}`
                                                )
                                            }
                                            className="
                                                rounded-full
                                                border
                                                border-[#E6D5C5]
                                                bg-[#FFFDF9]
                                                px-4
                                                py-2
                                                text-[11px]
                                                font-semibold
                                                text-[#4B2E2A]
                                                hover:bg-[#FFF8F0]
                                            "
                                        >
                                            View Details
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                </div>

            </div>

        </DashboardLayout>
    );
};


export default OnlineMedicineOrders;