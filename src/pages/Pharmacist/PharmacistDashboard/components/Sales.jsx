import { useSelector } from "react-redux";

import DashboardCard
    from "../../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../../components/Dashboard/DashboardDropdown";


const Sales = () => {

    const sales =
        useSelector(
            (state) =>
                state.pharmacist.sales
        );


    const trend =
        sales?.trend || [];


    return (

        <DashboardCard className="p-5">

            <div className="flex items-center justify-between">

                <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
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
                />

            </div>


            <div className="mt-5">

                <p className="text-sm text-[#8B7A70]">
                    Total Business Done
                </p>

                <h1 className="mt-2 text-[28px] font-bold text-[#4D2E23]">
                    ₹
                    {Number(
                        sales?.total_amount || 0
                    ).toLocaleString("en-IN")}
                </h1>


                {/* Trend */}

                <div className="mt-6 flex h-28 items-end gap-2">

                    {trend.map((item) => (

                        <div
                            key={item.day}
                            className="flex flex-1 flex-col items-center gap-2"
                        >

                            <div
                                className="w-full rounded-t-lg bg-[#B7EFC5]"
                                style={{
                                    height: `${Math.max(
                                        10,
                                        Math.min(
                                            100,
                                            (
                                                Number(
                                                    item.amount
                                                ) /
                                                Math.max(
                                                    ...trend.map(
                                                        (x) =>
                                                            Number(
                                                                x.amount
                                                            )
                                                    )
                                                )
                                            ) * 100
                                        )
                                    )}%`,
                                }}
                            />

                        </div>

                    ))}

                </div>

            </div>

        </DashboardCard>
    );
};


export default Sales;