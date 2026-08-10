import { useSelector } from "react-redux";

import DashboardCard
    from "../../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../../components/Dashboard/DashboardDropdown";


const AilmentsAddressed = () => {

    const ailments =
        useSelector(
            (state) =>
                state.pharmacist.ailments
        );


    const categories =
        ailments?.categories || {};


    const items = [
        ["Diabetes", "diabetes"],
        ["Orthopedics", "orthopedics"],
        ["Cardiac", "cardiac"],
        ["Neurological", "neurological"],
        ["Skin", "skin"],
        ["Respiratory", "respiratory"],
        ["Digestive", "digestive"],
        ["Pediatric", "pediatric"],
        ["Other", "other"],
    ];


    return (

        <DashboardCard className="p-5">

            <div className="flex items-center justify-between">

                <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
                    Ailments Addressed
                </h2>


                <DashboardDropdown
                    value={
                        ailments?.period ||
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


            <div className="mt-5 grid grid-cols-3 gap-3">

                {items.map(
                    ([label, key]) => (

                        <div
                            key={key}
                            className="rounded-2xl border border-[#EFE4DC] p-4"
                        >

                            <p className="text-sm text-[#5B4035]">
                                {label}
                            </p>

                            <p className="mt-3 text-2xl font-bold text-[#4D2E23]">
                                {categories[key] || 0}
                            </p>

                        </div>

                    )
                )}

            </div>

        </DashboardCard>
    );
};


export default AilmentsAddressed;