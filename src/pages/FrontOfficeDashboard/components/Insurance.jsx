import {
    useState,
} from "react";

import {
    useSelector,
} from "react-redux";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import {
    useNavigate,
} from "react-router-dom";


const Insurance = () => {

    const navigate =
        useNavigate();


    const insurance =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .insurance
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
    ];


    // ==========================================
    // CHANGE PERIOD
    // ==========================================

    const handlePeriodChange = (
        newPeriod
    ) => {

        setPeriod(
            newPeriod
        );

        // Add your insurance API dispatch
        // here when the period API is available.

    };


    return (

        <DashboardCard
            className="
                px-5
                pt-5
                pb-4
            "
            onClick={() =>
                navigate(
                    "/frontoffice/insurance-list"
                )
            }
        >

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

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
                    Insurance
                </h2>


                {/* PERIOD */}

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


            {/* ========================================= */}
            {/* TOTAL */}
            {/* ========================================= */}

            <div className="mt-4">

                <h1
                    className="
                        text-[26px]
                        font-bold
                        text-[#4B2E2A]
                    "
                >
                    {
                        insurance?.total_policies ??
                        0
                    }
                </h1>

                <p
                    className="
                        text-[12px]
                        text-[#7D726B]
                    "
                >
                    Total Policies
                </p>

            </div>


            {/* ========================================= */}
            {/* STATS */}
            {/* ========================================= */}

            <div
                className="
                    mt-4
                    border-t
                    border-[#EFE4DC]
                    pt-3
                "
            >

                <div
                    className="
                        grid
                        grid-cols-3
                    "
                >

                    <Stat
                        title="Active Policies"
                        value={
                            insurance?.active_policies ??
                            0
                        }
                    />


                    <Stat
                        title="Claims Pending"
                        value={
                            insurance?.claims_pending ??
                            0
                        }
                    />


                    <Stat
                        title="Claims Approved"
                        value={
                            insurance?.claims_approved ??
                            0
                        }
                        last
                    />

                </div>

            </div>

        </DashboardCard>

    );

};


// ==========================================
// STAT
// ==========================================

const Stat = ({
    title,
    value,
    last,
}) => (

    <div
        className={`
            text-center
            ${
                !last
                    ? "border-r border-[#EFE4DC]"
                    : ""
            }
        `}
    >

        <p
            className="
                text-[12px]
                text-[#4B2E2A]
            "
        >
            {title}
        </p>

        <p
            className="
                mt-1
                text-[16px]
                font-bold
                text-[#4B2E2A]
            "
        >
            {value}
        </p>

    </div>

);


export default Insurance;