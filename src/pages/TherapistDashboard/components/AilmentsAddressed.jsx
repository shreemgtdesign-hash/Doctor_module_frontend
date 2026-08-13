import {
    FaHeartbeat,
    FaBone,
    FaBrain,
    FaLungs,
    FaEllipsisH,
} from "react-icons/fa";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import { useSelector } from "react-redux";


const iconMap = {

    Diabetes:
        <FaHeartbeat />,

    Orthopedics:
        <FaBone />,

    Cardiac:
        <FaHeartbeat />,

    Neurological:
        <FaBrain />,

    Skin:
        <FaHeartbeat />,

    Respiratory:
        <FaLungs />,

    Digestive:
        <FaHeartbeat />,

    Pediatric:
        <FaHeartbeat />,

    Other:
        <FaEllipsisH />,

};


const AilmentsAddressed = ({
    period = "week",
    setPeriod,
}) => {

    const ailments = useSelector(
        (state) =>
            state.therapist.ailments
    );


    return (

        <DashboardCard className="px-5 pt-5 pb-5">

            {/* Header */}

            <div className="flex items-center justify-between">

                <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
                    Ailments Addressed
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


            {/* Cards */}

            <div className="mt-5 grid grid-cols-3 gap-4">

                {ailments.map(
                    (item, index) => (

                        <div
                            key={`${item.name}-${index}`}
                            className="
                                rounded-[20px]
                                border
                                border-[#EFE2D7]
                                bg-white
                                p-4
                            "
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-[14px] text-[#4D2E23]">
                                        {item.name}
                                    </p>

                                    <h3 className="mt-2 text-[26px] font-bold text-[#4D2E23]">
                                        {item.count}
                                    </h3>

                                </div>


                                <div className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-[#FFF1E5]
                                    text-[#7A4A35]
                                ">

                                    {iconMap[item.name] ||
                                        <FaEllipsisH />
                                    }

                                </div>

                            </div>

                        </div>

                    )
                )}

            </div>

        </DashboardCard>

    );
};


export default AilmentsAddressed;