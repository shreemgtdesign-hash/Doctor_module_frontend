import { useSelector } from "react-redux";

import {
    FaTint,
    FaBone,
    FaHeart,
    FaBrain,
    FaAllergies,
    FaLungs,
     FaAppleAlt,
    FaBaby,
    FaEllipsisH,
} from "react-icons/fa";

import DashboardCard
    from "../../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../../components/Dashboard/DashboardDropdown";


const AilmentsAddressed = () => {

    const ailments = useSelector(
        (state) =>
            state.pharmacist.ailments
    );


    const categories =
        ailments?.categories || {};


    // ==========================================
    // AILMENT DATA + ICONS
    // ==========================================

    const items = [
        {
            label: "Diabetes",
            key: "diabetes",
            icon: FaTint,
        },
        {
            label: "Orthopedics",
            key: "orthopedics",
            icon: FaBone,
        },
        {
            label: "Cardiac",
            key: "cardiac",
            icon: FaHeart,
        },
        {
            label: "Neurological",
            key: "neurological",
            icon: FaBrain,
        },
        {
            label: "Skin",
            key: "skin",
            icon: FaAllergies,
        },
        {
            label: "Respiratory",
            key: "respiratory",
            icon: FaLungs,
        },
        {
            label: "Digestive",
            key: "digestive",
            icon: FaAppleAlt,
        },
        {
            label: "Pediatric",
            key: "pediatric",
            icon: FaBaby,
        },
        {
            label: "Other",
            key: "other",
            icon: FaEllipsisH,
        },
    ];


    return (

        <DashboardCard className="p-5">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="flex items-center justify-between">

                <h2
                    className="
                        text-[18px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
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


            {/* ================================= */}
            {/* AILMENT CARDS */}
            {/* ================================= */}

            <div
                className="
                    mt-5
                    grid
                    grid-cols-3
                    gap-3
                "
            >

                {items.map(
                    ({
                        label,
                        key,
                        icon: Icon,
                    }) => (

                        <div
                            key={key}
                            className="
                                h-[120px]
                                rounded-2xl
                                border
                                border-[#EFE4DC]
                                bg-white
                                p-4
                            "
                        >

                            {/* TOP */}

                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-[15px]
                                            font-medium
                                            text-[#5B4035]
                                        "
                                    >
                                        {label}
                                    </p>


                                    <p
                                        className="
                                            mt-3
                                            text-[26px]
                                            font-bold
                                            leading-none
                                            text-[#4D2E23]
                                        "
                                    >
                                        {categories[key] || 0}
                                    </p>

                                </div>


                                {/* ICON */}

                                <div
                                    className="
                                        mt-6
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-[#FFF0E3]
                                    "
                                >

                                    <Icon
                                        size={21}
                                        strokeWidth={1.5}
                                        className="text-[#4D2E23]"
                                    />

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