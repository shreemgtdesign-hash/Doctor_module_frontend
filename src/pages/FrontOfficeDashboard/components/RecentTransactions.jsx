import {
    useState,
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
    loadFrontOfficeRecentTransactions,
} from "../../../redux/frontOffice/frontOfficeDashboardThunk";


const RecentTransactions = () => {

    const dispatch =
        useDispatch();


    // ==========================================
    // TRANSACTIONS
    // ==========================================

    const transactions =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .transactions
        );


    // ==========================================
    // PERIOD
    // ==========================================

    const [period, setPeriod] =
        useState("today");


    // ==========================================
    // PERIOD OPTIONS
    // ==========================================

    const periodOptions = [
        {
            label: "Today",
            value: "today",
        },
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
    ];


    // ==========================================
    // PERIOD CHANGE
    // ==========================================

    const handlePeriodChange = (
        newPeriod
    ) => {

        console.log(
            "📅 Recent Transactions Period:",
            newPeriod
        );

        setPeriod(
            newPeriod
        );

        dispatch(
            loadFrontOfficeRecentTransactions(
                newPeriod
            )
        );
    };


    return (

        <DashboardCard
            className="
                px-5
                pt-5
                pb-4
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
                    Recent Transactions
                </h2>


                {/* ================================= */}
                {/* PERIOD DROPDOWN */}
                {/* ================================= */}

                <div
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                    className="
                        shrink-0
                    "
                >

                    <DashboardDropdown
                        value={
                            period
                        }
                        options={
                            periodOptions
                        }
                        onChange={
                            handlePeriodChange
                        }
                    />

                </div>

            </div>


            {/* ================================= */}
            {/* TRANSACTIONS */}
            {/* ================================= */}

            <div className="mt-4">

                {!transactions ||
                transactions.length === 0 ? (

                    <div
                        className="
                            py-8
                            text-center
                            text-sm
                            text-[#8A756B]
                        "
                    >
                        No recent transactions
                    </div>

                ) : (

                    transactions.map(
                        (
                            transaction,
                            index
                        ) => (

                            <div
                                key={`${transaction.patient_code}-${index}`}
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-[#EFE4DC]
                                    py-4
                                    last:border-b-0
                                "
                            >

                                {/* Patient */}

                                <div
                                    className="
                                        min-w-0
                                        flex-1
                                    "
                                >

                                    <p
                                        className="
                                            text-[14px]
                                            font-semibold
                                            text-[#4B2E2A]
                                        "
                                    >
                                        {
                                            transaction.patient_name
                                        }

                                        <span
                                            className="
                                                ml-1
                                                text-[11px]
                                                font-normal
                                                text-[#8A756B]
                                            "
                                        >
                                            (
                                            {
                                                transaction.patient_code
                                            }
                                            )
                                        </span>

                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[11px]
                                            text-[#8A756B]
                                        "
                                    >
                                        {
                                            transaction.description
                                        }
                                    </p>

                                </div>


                                {/* Amount */}

                                <div
                                    className="
                                        w-24
                                        text-right
                                    "
                                >

                                    <p
                                        className="
                                            text-[14px]
                                            font-semibold
                                            text-[#4B2E2A]
                                        "
                                    >
                                        {
                                            transaction.formatted_amount
                                        }
                                    </p>

                                </div>


                                {/* Payment */}

                                <div
                                    className="
                                        w-20
                                        text-center
                                    "
                                >

                                    <span
                                        className={`
                                            rounded-md
                                            px-3
                                            py-1
                                            text-[10px]
                                            font-medium

                                            ${
                                                transaction.payment_mode ===
                                                "Cash"
                                                    ? "bg-[#EAFBEF] text-green-700"
                                                    : transaction.payment_mode ===
                                                      "UPI"
                                                    ? "bg-[#FCEBFF] text-purple-700"
                                                    : "bg-[#FFF1E6] text-[#8A4F32]"
                                            }
                                        `}
                                    >
                                        {
                                            transaction.payment_mode
                                        }
                                    </span>

                                </div>


                                {/* Time */}

                                <p
                                    className="
                                        w-20
                                        text-right
                                        text-[12px]
                                        text-[#7D726B]
                                    "
                                >
                                    {
                                        transaction.time
                                    }
                                </p>

                            </div>

                        )
                    )

                )}

            </div>

        </DashboardCard>

    );

};


export default RecentTransactions;