import {
    FaLeaf,
} from "react-icons/fa";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import StatsCard
    from "../../../components/Dashboard/StatsCard";

import { useSelector } from "react-redux";


const TherapiesPerformed = ({
    period = "week",
    setPeriod,
}) => {

    const therapies = useSelector(
        (state) =>
            state.therapist.therapies
    );


    const categories =
        therapies?.categories || [];


    return (

        <DashboardCard className="px-5 pt-5 pb-3">

            {/* Header */}

            <div className="flex items-center justify-between">

                <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
                    Therapies Performed
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


            {/* Main */}

            <div className="mt-3 flex items-center justify-between">

                <div>

                    <h1 className="text-[28px] font-bold leading-none text-[#4B2E2A]">
                        {therapies?.total ?? 0}
                    </h1>

                    <p className="mt-1 text-[12px] text-[#7D726B]">
                        Total Therapies
                    </p>

                </div>


                <div className="flex h-14 w-14 items-center justify-center">

                    <FaLeaf
                        size={30}
                        className="text-[#E4C08D]"
                    />

                </div>

            </div>


            <div className="my-3 border-t border-[#EFE4DC]" />


            {/* Categories */}

            <div
                className={`grid gap-2 ${
                    categories.length <= 5
                        ? "grid-cols-5"
                        : "grid-cols-3"
                }`}
            >

                {categories.map(
                    (item, index) => (

                        <StatsCard
                            key={`${item.category}-${index}`}
                            title={item.category}
                            value={item.count}
                            border={
                                index !==
                                categories.length - 1
                            }
                        />

                    )
                )}

            </div>

        </DashboardCard>

    );
};


export default TherapiesPerformed;