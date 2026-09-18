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
    HiOutlineCalendarDays,
} from "react-icons/hi2";


import DashboardLayout from "../../../../components/Layout/DashboardLayout";
import DashboardDropdown from "../../../../components/Dashboard/DashboardDropdown";
import { loadOnlineDeliveryOrders } from "../../../../redux/pharmacist/pharmacistThunk";




const OnlineDeliveryOrders = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    const {
        onlineDeliveryOrders,
        onlineDeliveryOrdersLoading,
        onlineDeliveryOrdersCount,
    } = useSelector(
        (state) =>
            state.pharmacist
    );


    useEffect(() => {

        dispatch(
            loadOnlineDeliveryOrders()
        );

    }, [dispatch]);


    const formatDate = (
        dateString
    ) => {

        if (!dateString) {
            return "-";
        }

        const date =
            new Date(dateString);

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    };


    const formatTime = (
        dateString
    ) => {

        if (!dateString) {
            return "-";
        }

        return new Date(
            dateString
        ).toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
            }
        );

    };


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
                {/* HEADER */}
                {/* ========================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <h1 className="
                                text-[26px]
                                font-semibold
                                text-[#2D211E]
                            ">
                                Sales
                            </h1>

                            <span className="
                                text-[26px]
                                text-[#2D211E]
                            ">
                                ›
                            </span>

                            <h1 className="
                                text-[26px]
                                font-semibold
                                text-[#2D211E]
                            ">
                                Online Purchases
                            </h1>

                        </div>


                        <p className="
                            mt-2
                            text-[16px]
                            text-[#77706C]
                        ">
                            {onlineDeliveryOrdersCount} Total Purchases
                        </p>

                    </div>


                    <DashboardDropdown

                        value="week"

                        options={[
                            {
                                label: "This Week",
                                value: "week",
                            },
                            {
                                label: "This Month",
                                value: "month",
                            },
                            {
                                label: "Till Date",
                                value: "till_date",
                            },
                        ]}

                    />

                </div>


                {/* ========================================= */}
                {/* PAGINATION HEADER */}
                {/* ========================================= */}

                <div className="
                    mt-10
                    flex
                    items-center
                    justify-end
                    gap-6
                ">

                    <span className="
                        text-[15px]
                        text-[#706965]
                    ">
                        Showing Actions 1 - {
                            onlineDeliveryOrders.length
                        } of {
                            onlineDeliveryOrdersCount
                        }
                    </span>


                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <button
                            type="button"
                            className="
                                text-[#B8AAA2]
                            "
                        >
                            <HiOutlineChevronLeft
                                size={22}
                            />
                        </button>


                        <button
                            type="button"
                            className="
                                text-[#B8AAA2]
                            "
                        >
                            <HiOutlineChevronRight
                                size={22}
                            />
                        </button>

                    </div>

                </div>


                {/* ========================================= */}
                {/* TABLE */}
                {/* ========================================= */}

                <div className="
                    mt-7
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#E8DCD2]
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

                                <th className="
                                    border-b
                                    border-r
                                    border-[#E8DCD2]
                                    px-5
                                    py-5
                                    text-left
                                    text-[14px]
                                    font-medium
                                    text-[#4B2E2A]
                                ">
                                    Patient Name
                                </th>


                                <th className="
                                    border-b
                                    border-r
                                    border-[#E8DCD2]
                                    px-5
                                    py-5
                                    text-left
                                    text-[14px]
                                    font-medium
                                    text-[#4B2E2A]
                                ">
                                    Date and Time
                                </th>


                                <th className="
                                    border-b
                                    border-r
                                    border-[#E8DCD2]
                                    px-5
                                    py-5
                                    text-left
                                    text-[14px]
                                    font-medium
                                    text-[#4B2E2A]
                                ">
                                    Order No.
                                </th>


                                <th className="
                                    border-b
                                    border-r
                                    border-[#E8DCD2]
                                    px-5
                                    py-5
                                    text-left
                                    text-[14px]
                                    font-medium
                                    text-[#4B2E2A]
                                ">
                                    Status
                                </th>


                                <th className="
                                    border-b
                                    border-[#E8DCD2]
                                    px-5
                                    py-5
                                    text-center
                                    text-[14px]
                                    font-medium
                                    text-[#4B2E2A]
                                ">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {onlineDeliveryOrders.map(
                                (order) => (

                                    <tr
                                        key={
                                            order.id
                                        }
                                        className="
                                            hover:bg-[#FFFCF9]
                                        "
                                    >

                                        {/* PATIENT */}

                                        <td className="
                                            border-b
                                            border-r
                                            border-[#E8DCD2]
                                            px-5
                                            py-5
                                        ">

                                            <p className="
                                                text-[16px]
                                                font-semibold
                                                text-[#4B2E2A]
                                            ">
                                                {
                                                    order.patient_name
                                                }
                                            </p>


                                            <p className="
                                                mt-1
                                                text-[13px]
                                                text-[#77706C]
                                            ">
                                                Patient ID: {
                                                    order.patient_id
                                                }
                                            </p>

                                        </td>


                                        {/* DATE */}

                                        <td className="
                                            border-b
                                            border-r
                                            border-[#E8DCD2]
                                            px-5
                                            py-5
                                        ">

                                            <p className="
                                                text-[16px]
                                                font-semibold
                                                text-[#4B2E2A]
                                            ">
                                                {
                                                    formatDate(
                                                        order.created_at
                                                    )
                                                }
                                            </p>


                                            <p className="
                                                mt-1
                                                text-[13px]
                                                text-[#77706C]
                                            ">
                                                {
                                                    formatTime(
                                                        order.created_at
                                                    )
                                                }
                                            </p>

                                        </td>


                                        {/* ORDER */}

                                        <td className="
                                            border-b
                                            border-r
                                            border-[#E8DCD2]
                                            px-5
                                            py-5
                                        ">

                                            <p className="
                                                text-[15px]
                                                font-semibold
                                                text-[#4B2E2A]
                                            ">
                                                {
                                                    order.order_no
                                                }
                                            </p>


                                            <p className="
                                                mt-1
                                                text-[12px]
                                                text-[#77706C]
                                            ">
                                                {
                                                    order.total_items
                                                } item
                                                {
                                                    order.total_items !== 1
                                                        ? "s"
                                                        : ""
                                                }
                                            </p>

                                        </td>


                                        {/* STATUS */}

                                        <td className="
                                            border-b
                                            border-r
                                            border-[#E8DCD2]
                                            px-5
                                            py-5
                                        ">

                                            <span className="
                                                inline-flex
                                                rounded-[10px]
                                                bg-[#E9FAEE]
                                                px-4
                                                py-2
                                                text-[13px]
                                                font-medium
                                                text-[#207A43]
                                            ">
                                                {
                                                    order.status ===
                                                    "placed"
                                                        ? "In Transit"
                                                        : order.status
                                                }
                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td className="
                                            border-b
                                            border-[#E8DCD2]
                                            px-5
                                            py-5
                                            text-center
                                        ">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/pharmacist/online-purchases/${order.id}`
                                                    )
                                                }
                                                className="
                                                    rounded-[16px]
                                                    border
                                                    border-[#E5D7CB]
                                                    bg-[#FFFDFB]
                                                    px-5
                                                    py-3
                                                    text-[15px]
                                                    font-semibold
                                                    text-[#4B2E2A]
                                                    shadow-sm
                                                    transition
                                                    hover:bg-[#FFF6EF]
                                                "
                                            >
                                                View Details
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>


                    {onlineDeliveryOrdersLoading && (

                        <div className="
                            py-10
                            text-center
                            text-[14px]
                            text-[#77706C]
                        ">
                            Loading orders...
                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>

    );
};


export default OnlineDeliveryOrders;