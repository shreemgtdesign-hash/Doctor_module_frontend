import { useSelector } from "react-redux";

import DashboardCard
    from "../../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../../components/Dashboard/DashboardDropdown";


const MedicinesDispensed = () => {

    const medicinesDispensed =
        useSelector(
            (state) =>
                state.pharmacist.medicinesDispensed
        );


    const breakdown =
        medicinesDispensed?.breakdown || [];


    return (

        <DashboardCard className="p-5">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <h2 className="text-[18px] font-semibold text-[#4B2E2A]">

                        {medicinesDispensed?.total || 0}

                        {" "}

                        Medicines Dispensed

                    </h2>

                    <span className="rounded-full bg-[#E8F8ED] px-3 py-1 text-xs font-medium text-green-600">
                        +24.8%
                    </span>

                    <span className="text-sm text-[#8B7A70]">
                        Compared to last week
                    </span>

                </div>


                <DashboardDropdown
                    value={
                        medicinesDispensed?.period ||
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


            {/* Breakdown */}

            <div className="mt-6 grid grid-cols-8 divide-x divide-[#EFE4DC]">

                {breakdown
                    .slice(0, 8)
                    .map((item) => (

                        <div
                            key={item.category}
                            className="px-2 text-center"
                        >

                            <p className="text-sm text-[#5B4035]">
                                {item.category}
                            </p>

                            <p className="mt-2 text-xl font-bold text-[#4D2E23]">
                                {item.count}
                            </p>

                        </div>

                    ))}

            </div>

        </DashboardCard>
    );
};


export default MedicinesDispensed;