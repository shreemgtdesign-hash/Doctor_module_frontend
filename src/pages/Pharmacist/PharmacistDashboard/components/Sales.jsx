import {
    useDispatch,
    useSelector,
} from "react-redux";
import {
    useNavigate,
} from "react-router-dom";
import DashboardCard
    from "../../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../../components/Dashboard/DashboardDropdown";

import {
    loadPharmacistSales,
} from "../../../../redux/pharmacist/pharmacistThunk";


const Sales = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sales =
        useSelector(
            (state) =>
                state.pharmacist.sales
        );


    const trend =
        sales?.trend || [];


    const inStore =
        sales?.in_store_purchases || {};


    const online =
        sales?.online_purchases || {};


    const totalSales =
        sales?.total_sales || {};


    const maxTrend =
        Math.max(
            1,
            ...trend.map(
                (item) =>
                    Number(item.amount) || 0
            )
        );


    const handlePeriodChange = (
        period
    ) => {

        dispatch(
            loadPharmacistSales(
                period
            )
        );

    };


    return (

        <DashboardCard
            className="
                p-4
            "
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="
                flex
                items-center
                justify-between
            ">

                <h2 className="
                    text-[17px]
                    font-semibold
                    text-[#4B2E2A]
                ">
                    Sales
                </h2>


                <DashboardDropdown
                    value={
                        sales?.period ||
                        "week"
                    }

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

                    onChange={
                        handlePeriodChange
                    }
                />

            </div>


            {/* ================================= */}
            {/* SALES CARDS */}
            {/* ================================= */}

            <div className="
                mt-4
                grid
                grid-cols-2
                gap-3
            ">


                {/* ================================= */}
                {/* IN STORE */}
                {/* ================================= */}

                <div className="
                    relative
                    rounded-2xl
                    border
                    border-[#E8DDD6]
                    bg-white
                    p-4
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <div className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#FFF0E4]
                            text-[16px]
                        ">
                            ◩
                        </div>


                        <p className="
                            text-[13px]
                            font-semibold
                            text-[#4B2E2A]
                        ">
                            {
                                inStore.label ||
                                "In-store Purchases"
                            }
                        </p>

                    </div>


                    <h3 className="
                        mt-4
                        text-[25px]
                        font-bold
                        text-[#4D2E23]
                    ">
                        {
                            inStore.formatted_amount ||
                            "₹0"
                        }
                    </h3>


                    <div className="
                        mt-3
                        flex
                        justify-end
                    ">

                        <span className="
                            rounded-full
                            bg-[#E8FCEF]
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            text-[#0A9F58]
                        ">
                            {
                                inStore.growth_percentage ||
                                "0%"
                            }
                        </span>

                    </div>

                </div>


                {/* ================================= */}
                {/* ONLINE */}
                {/* ================================= */}

                <div
                onClick={() =>
        navigate(
            "/pharmacist/online-purchases"
        )
    } className="
                    relative
                    rounded-2xl
                    border
                    border-[#E8DDD6]
                    bg-white
                    p-4
                    
                ">

                    {/* BADGE */}

                    {Number(
                        online.badge_count ||
                        online.count ||
                        0
                    ) > 0 && (

                        <span className="
                            absolute
                            right-[-7px]
                            top-[-7px]
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-[#A50046]
                            text-[12px]
                            font-semibold
                            text-white
                        ">
                            {
                                online.badge_count ??
                                online.count
                            }
                        </span>

                    )}


                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <div className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#FFF0E4]
                            text-[16px]
                        ">
                            ▧
                        </div>


                        <p className="
                            text-[13px]
                            font-semibold
                            text-[#4B2E2A]
                        ">
                            {
                                online.label ||
                                "Online Purchases"
                            }
                        </p>

                    </div>


                    <h3 className="
                        mt-4
                        text-[25px]
                        font-bold
                        text-[#4D2E23]
                    ">
                        {
                            online.formatted_amount ||
                            "₹0"
                        }
                    </h3>


                    <div className="
                        mt-3
                        flex
                        justify-end
                    ">

                        <span className="
                            rounded-full
                            bg-[#E8FCEF]
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            text-[#0A9F58]
                        ">
                            {
                                online.growth_percentage ||
                                "0%"
                            }
                        </span>

                    </div>

                </div>

            </div>


            {/* ================================= */}
            {/* TOTAL SALES */}
            {/* ================================= */}

            <div className="
                mt-4
                flex
                items-center
                justify-between
                border-t
                border-[#EEE4DD]
                pt-3
            ">

                <div>

                    <p className="
                        text-[11px]
                        text-[#8B7A70]
                    ">
                        Total Sales
                    </p>


                    <h3 className="
                        mt-1
                        text-[22px]
                        font-bold
                        text-[#4D2E23]
                    ">
                        {
                            totalSales.formatted_amount ||
                            sales?.total_business_done ||
                            "₹0"
                        }
                    </h3>

                </div>


                {/* TREND */}

                {trend.length > 0 && (

                    <div className="
                        flex
                        h-14
                        w-[120px]
                        items-end
                        gap-1.5
                    ">

                        {trend.map(
                            (
                                item,
                                index
                            ) => {

                                const amount =
                                    Number(
                                        item.amount
                                    ) || 0;


                                const height =
                                    Math.max(
                                        12,
                                        (
                                            amount /
                                            maxTrend
                                        ) * 100
                                    );


                                return (

                                    <div
                                        key={
                                            item.day ||
                                            index
                                        }
                                        className="
                                            flex
                                            h-full
                                            flex-1
                                            items-end
                                        "
                                    >

                                        <div
                                            className="
                                                w-full
                                                rounded-t-md
                                                bg-[#B7EFC5]
                                            "
                                            style={{
                                                height:
                                                    `${height}%`,
                                            }}
                                        />

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </DashboardCard>

    );
};


export default Sales;