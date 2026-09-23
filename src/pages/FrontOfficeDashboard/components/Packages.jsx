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


const Packages = () => {

    const navigate =
        useNavigate();


    const packages =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .packages
        );


    // ==========================================
    // PERIOD
    // ==========================================

    const [period, setPeriod] =
        useState("till_date");


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
    // CHANGE PERIOD
    // ==========================================

    const handlePeriodChange = (
        newPeriod
    ) => {

        setPeriod(
            newPeriod
        );

        // Connect the packages period API
        // here when the API/thunk is available.

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
                    "/frontoffice/packages-list"
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
                    Packages
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
                        packages?.total_packages ??
                        0
                    }
                </h1>

                <p
                    className="
                        text-[12px]
                        text-[#7D726B]
                    "
                >
                    Total Packages
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
                        grid-cols-2
                    "
                >

                    <Stat
                        title="Active Packages"
                        value={
                            packages?.active_packages ??
                            0
                        }
                        border
                    />


                    <Stat
                        title="Expiring this month"
                        value={
                            packages?.expiring_this_month ??
                            0
                        }
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
    border,
}) => (

    <div
        className={`
            text-center
            ${
                border
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


export default Packages;