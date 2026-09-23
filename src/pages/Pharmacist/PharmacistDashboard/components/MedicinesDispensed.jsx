import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    loadMedicinesDispensed,
} from "../../../../redux/pharmacist/pharmacistThunk";

import DashboardCard
    from "../../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../../components/Dashboard/DashboardDropdown";


const MedicinesDispensed = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // ==========================================
    // REDUX DATA
    // ==========================================

    const medicinesDispensed =
        useSelector(
            (state) =>
                state.pharmacist.medicinesDispensed
        );


    const breakdown =
        medicinesDispensed?.breakdown || [];


    // ==========================================
    // PERIOD
    // ==========================================

    const [period, setPeriod] =
        useState(
            medicinesDispensed?.period ||
            "week"
        );


    // ==========================================
    // KEEP LOCAL PERIOD IN SYNC
    // ==========================================

    useEffect(() => {

        if (
            medicinesDispensed?.period
        ) {

            setPeriod(
                medicinesDispensed.period
            );

        }

    }, [
        medicinesDispensed?.period,
    ]);


    // ==========================================
    // PERIOD OPTIONS
    // ==========================================

    const periodOptions = [
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

        // Immediately update UI
        setPeriod(newPeriod);


        // Load corresponding API data
        dispatch(
            loadMedicinesDispensed(
                newPeriod
            )
        );

    };


    return (

        <DashboardCard
            className="
                h-full
                p-4
            "
            onClick={() =>
                navigate(
                    "/pharmacist/medicine-dispensed"
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

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                    "
                >

                    <h2
                        className="
                            whitespace-nowrap
                            text-[16px]
                            font-semibold
                            text-[#4B2E2A]
                        "
                    >

                        <span
                            className="
                                text-[28px]
                                font-bold
                            "
                        >
                            {
                                medicinesDispensed?.total ||
                                0
                            }
                        </span>

                        <span className="ml-2">
                            Medicines Dispensed
                        </span>

                    </h2>


                    <span
                        className="
                            flex-shrink-0
                            rounded-full
                            bg-[#E8F8ED]
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            text-green-600
                        "
                    >
                        +24.8%
                    </span>


                    <span
                        className="
                            whitespace-nowrap
                            text-[12px]
                            text-[#8B7A70]
                        "
                    >
                        Compared to last week
                    </span>

                </div>


                {/* =========================================
                    DROPDOWN
                ========================================= */}

                <div
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                    className="flex-shrink-0"
                >

                    <DashboardDropdown
                        value={period}
                        options={
                            periodOptions
                        }
                        onChange={
                            handlePeriodChange
                        }
                    />

                </div>

            </div>


            {/* =========================================
                DIVIDER
            ========================================= */}

            <div
                className="
                    my-4
                    h-px
                    w-full
                    bg-[#EFE4DC]
                "
            />


            {/* =========================================
                BREAKDOWN
            ========================================= */}

            <div
                className="
                    grid
                    grid-cols-8
                    divide-x
                    divide-[#EFE4DC]
                "
            >

                {breakdown
                    .slice(0, 8)
                    .map(
                        (item) => (

                            <div
                                key={
                                    item.category
                                }
                                className="
                                    flex
                                    min-w-0
                                    flex-col
                                    items-center
                                    justify-center
                                    px-1.5
                                "
                            >

                                <p
                                    className="
                                        w-full
                                        truncate
                                        text-center
                                        text-[12px]
                                        font-medium
                                        text-[#5B4035]
                                    "
                                >
                                    {
                                        item.category
                                    }
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[19px]
                                        font-bold
                                        leading-none
                                        text-[#4D2E23]
                                    "
                                >
                                    {
                                        item.count
                                    }
                                </p>

                            </div>

                        )
                    )}

            </div>

        </DashboardCard>

    );

};


export default MedicinesDispensed;