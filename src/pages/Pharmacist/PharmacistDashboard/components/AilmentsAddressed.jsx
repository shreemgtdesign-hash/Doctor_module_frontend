import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    loadPharmacistAilments,
} from "../../../../redux/pharmacist/pharmacistThunk";

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

    const dispatch = useDispatch();


    const ailments =
        useSelector(
            (state) =>
                state.pharmacist.ailments
        );


    const categories =
        ailments?.categories || {};


    // ==========================================
    // CHANGE PERIOD
    // ==========================================

    const handlePeriodChange = (
        period
    ) => {

        dispatch(
            loadPharmacistAilments(
                period
            )
        );

    };


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

        <DashboardCard
            className="
                h-full
                p-4
            "
        >

            {/* HEADER */}

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

                    onChange={
                        handlePeriodChange
                    }

                />

            </div>


            {/* AILMENT CARDS */}

            <div className="
                mt-4
                grid
                grid-cols-3
                gap-2.5
            ">

                {items.map(
                    ({
                        label,
                        key,
                        icon: Icon,
                    }) => (

                        <div
                            key={key}
                            className="
                                h-[94px]
                                rounded-2xl
                                border
                                border-[#EFE4DC]
                                bg-white
                                p-3
                            "
                        >

                            <div className="
                                flex
                                h-full
                                items-start
                                justify-between
                            ">

                                <div className="
                                    min-w-0
                                ">

                                    <p className="
                                        truncate
                                        text-[14px]
                                        font-medium
                                        text-[#5B4035]
                                    ">
                                        {label}
                                    </p>


                                    <p className="
                                        mt-2
                                        text-[25px]
                                        font-bold
                                        leading-none
                                        text-[#4D2E23]
                                    ">
                                        {
                                            categories[key] ||
                                            0
                                        }
                                    </p>

                                </div>


                                <div className="
                                    mt-auto
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-[#FFF0E3]
                                ">

                                    <Icon
                                        size={19}
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