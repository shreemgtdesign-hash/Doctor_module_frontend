import {
    useSelector,
} from "react-redux";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";


const Sales = ({
    period = "week",
    setPeriod,
}) => {

    const sales = useSelector(
        (state) =>
            state.therapist.sales
    );


    const trend =
        sales?.trend || [];


    const maxAmount =
        Math.max(
            ...trend.map(
                (item) => item.amount
            ),
            1
        );


    return (

        <DashboardCard className="px-5 pt-5 pb-5">

            {/* Header */}

            <div className="flex items-center justify-between">

                <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
                    Sales
                </h2>


                <DashboardDropdown
                    value={period}
                    options={[
                        {
                            label: "This Week",
                            value: "week",
                        },
                    ]}
                    onChange={setPeriod}
                />

            </div>


            {/* Amount */}

            <div className="mt-5">

                <p className="text-[14px] font-medium text-[#4D2E23]">
                    Total Business Done
                </p>

                <h1 className="mt-2 text-[30px] font-bold text-[#4D2E23]">
                    {sales?.total_business_done ||
                        "₹0"}
                </h1>

            </div>


            {/* Graph */}

            <div className="mt-5 h-[130px]">

                <div className="flex h-full items-end gap-3">

                    {trend.map(
                        (item, index) => {

                            const height =
                                (item.amount /
                                    maxAmount) *
                                100;

                            return (

                                <div
                                    key={`${item.day}-${index}`}
                                    className="flex h-full flex-1 flex-col items-center justify-end"
                                >

                                    <div
                                        className="
                                            w-full
                                            rounded-t-md
                                            bg-[#CDEFD9]
                                        "
                                        style={{
                                            height: `${height}%`,
                                        }}
                                    />

                                    <span className="
                                        mt-2
                                        text-[11px]
                                        text-[#7D726B]
                                    ">
                                        {item.day}
                                    </span>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>

        </DashboardCard>

    );
};


export default Sales;