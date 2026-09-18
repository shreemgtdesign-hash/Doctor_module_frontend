import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import {
    loadFrontOfficeSalesDetails,
} from "../../../redux/frontOffice/frontOfficeDashboardThunk";

import {
    HiOutlineBanknotes,
} from "react-icons/hi2";

import {
    FaLeaf,
    FaCapsules,
    FaStethoscope,
} from "react-icons/fa";


const SalesDetails = () => {

    const dispatch = useDispatch();


    const salesDetails =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .salesDetails
        );


    const loading =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .salesDetailsLoading
        );


    // ==========================================
    // LOAD DEFAULT SALES
    // ==========================================

    useEffect(() => {

        dispatch(
            loadFrontOfficeSalesDetails(
                "week"
            )
        );

    }, [dispatch]);


    // ==========================================
    // PERIOD
    // ==========================================

    const period =
        salesDetails?.period ||
        "week";


    // ==========================================
    // REVENUE BREAKUP
    // ==========================================

    const revenueBreakup =
        salesDetails?.revenue_breakup || {};


    const therapies =
        revenueBreakup.therapies || {};


    const medicines =
        revenueBreakup.medicines || {};


    const consultations =
        revenueBreakup.consultations || {};


    // ==========================================
    // PERIOD CHANGE
    // ==========================================

    const handlePeriodChange = (
        newPeriod
    ) => {

        dispatch(
            loadFrontOfficeSalesDetails(
                newPeriod
            )
        );

    };


    return (

        <DashboardCard
            className="
                p-5
            "
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <h2
                    className="
                        text-[17px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    Sales Details
                </h2>


                <div
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    <DashboardDropdown
                        value={period}
                        onChange={
                            handlePeriodChange
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

            </div>


            {/* ================================= */}
            {/* CONTENT */}
            {/* ================================= */}

            <div
                className="
                    mt-5
                    grid
                    grid-cols-1
                    gap-4
                    xl:grid-cols-[255px_minmax(0,1fr)]
                "
            >

                {/* ================================= */}
                {/* TOTAL BUSINESS */}
                {/* ================================= */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-[#EFE4DC]
                        bg-white
                        p-4
                    "
                >

                    <p
                        className="
                            text-[13px]
                            font-medium
                            text-[#5B4035]
                        "
                    >
                        Total Business Done
                    </p>


                    <h1
                        className="
                            mt-3
                            text-[27px]
                            font-bold
                            leading-none
                            text-[#4D2E23]
                        "
                    >

                        {loading
                            ? "—"
                            : salesDetails
                                ?.formatted_total ||
                              "₹0"
                        }

                    </h1>


                    <div
                        className="
                            mt-3
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                rounded-full
                                bg-[#E8F8ED]
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                text-green-600
                            "
                        >
                            {
                                salesDetails
                                    ?.growth_vs_previous ||
                                "0%"
                            }
                        </span>


                        <span
                            className="
                                text-[11px]
                                text-[#8B7A70]
                            "
                        >
                            Compared to previous
                        </span>

                    </div>


                    {/* Small visual line */}

                    <div
                        className="
                            mt-6
                            flex
                            h-[45px]
                            items-end
                            gap-1
                        "
                    >

                        {[25, 40, 34, 52, 48, 70, 100]
                            .map(
                                (
                                    height,
                                    index
                                ) => (

                                    <div
                                        key={index}
                                        className="
                                            flex-1
                                            rounded-t-md
                                            bg-[#D7F5DF]
                                        "
                                        style={{
                                            height:
                                                `${height}%`,
                                        }}
                                    />

                                )
                            )}

                    </div>

                </div>


                {/* ================================= */}
                {/* REVENUE BREAKUP */}
                {/* ================================= */}

                <div
                    className="
                        min-w-0
                    "
                >

                    <p
                        className="
                            mb-3
                            text-[14px]
                            font-medium
                            text-[#4B2E2A]
                        "
                    >
                        Revenue Breakup
                    </p>


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            md:grid-cols-3
                        "
                    >

                        {/* THERAPIES */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#EFE4DC]
                                bg-white
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#FFF0E3]
                                    "
                                >

                                    <FaLeaf
                                        size={16}
                                        className="
                                            text-[#4D2E23]
                                        "
                                    />

                                </div>


                                <span
                                    className="
                                        text-[13px]
                                        font-medium
                                        text-[#4B2E2A]
                                    "
                                >
                                    Therapies
                                </span>

                            </div>


                            <h3
                                className="
                                    mt-4
                                    text-[23px]
                                    font-bold
                                    text-[#4D2E23]
                                "
                            >
                                {
                                    therapies.formatted ||
                                    "₹0"
                                }
                            </h3>


                            <div
                                className="
                                    mt-3
                                    flex
                                    justify-end
                                "
                            >

                                <span
                                    className={`
                                        rounded-full
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        font-medium
                                        ${
                                            String(
                                                therapies.growth ||
                                                ""
                                            ).startsWith("-")
                                                ? "bg-[#FFF1E8] text-[#A45B35]"
                                                : "bg-[#E8F8ED] text-green-600"
                                        }
                                    `}
                                >
                                    {
                                        therapies.growth ||
                                        "0%"
                                    }
                                </span>

                            </div>

                        </div>


                        {/* MEDICINES */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#EFE4DC]
                                bg-white
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#FFF0E3]
                                    "
                                >

                                    <FaCapsules
                                        size={16}
                                        className="
                                            text-[#4D2E23]
                                        "
                                    />

                                </div>


                                <span
                                    className="
                                        text-[13px]
                                        font-medium
                                        text-[#4B2E2A]
                                    "
                                >
                                    Medicines
                                </span>

                            </div>


                            <h3
                                className="
                                    mt-4
                                    text-[23px]
                                    font-bold
                                    text-[#4D2E23]
                                "
                            >
                                {
                                    medicines.formatted ||
                                    "₹0"
                                }
                            </h3>


                            <div
                                className="
                                    mt-3
                                    flex
                                    justify-end
                                "
                            >

                                <span
                                    className={`
                                        rounded-full
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        font-medium
                                        ${
                                            String(
                                                medicines.growth ||
                                                ""
                                            ).startsWith("-")
                                                ? "bg-[#FFF1E8] text-[#A45B35]"
                                                : "bg-[#E8F8ED] text-green-600"
                                        }
                                    `}
                                >
                                    {
                                        medicines.growth ||
                                        "0%"
                                    }
                                </span>

                            </div>

                        </div>


                        {/* CONSULTATIONS */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#EFE4DC]
                                bg-white
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#FFF0E3]
                                    "
                                >

                                    <FaStethoscope
                                        size={16}
                                        className="
                                            text-[#4D2E23]
                                        "
                                    />

                                </div>


                                <span
                                    className="
                                        text-[13px]
                                        font-medium
                                        text-[#4B2E2A]
                                    "
                                >
                                    Consultations
                                </span>

                            </div>


                            <h3
                                className="
                                    mt-4
                                    text-[23px]
                                    font-bold
                                    text-[#4D2E23]
                                "
                            >
                                {
                                    consultations.formatted ||
                                    "₹0"
                                }
                            </h3>


                            <div
                                className="
                                    mt-3
                                    flex
                                    justify-end
                                "
                            >

                                <span
                                    className={`
                                        rounded-full
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        font-medium
                                        ${
                                            String(
                                                consultations.growth ||
                                                ""
                                            ).startsWith("-")
                                                ? "bg-[#FFF1E8] text-[#A45B35]"
                                                : "bg-[#E8F8ED] text-green-600"
                                        }
                                    `}
                                >
                                    {
                                        consultations.growth ||
                                        "0%"
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardCard>
    );
};


export default SalesDetails;