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

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";

import {
    loadFrontOfficeAppointments,
} from "../../../redux/frontOffice/frontOfficeDashboardThunk";


const UpcomingAppointments = ({
    period = "week",
    onPeriodChange,
}) => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // ==========================================
    // REDUX DATA
    // ==========================================

    const appointments =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .appointments
        );


    const loading =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .loading
        );


    // ==========================================
    // LOCAL PERIOD
    // ==========================================

    const [selectedPeriod, setSelectedPeriod] =
        useState(
            period ||
            "week"
        );


    // ==========================================
    // KEEP LOCAL PERIOD IN SYNC WITH PARENT
    // ==========================================

    useEffect(() => {

        if (period) {

            setSelectedPeriod(
                period
            );

        }

    }, [
        period,
    ]);


    // ==========================================
    // LOAD UPCOMING APPOINTMENTS
    // ==========================================

    useEffect(() => {

        dispatch(
            loadFrontOfficeAppointments({
                period:
                    selectedPeriod,
            })
        );

    }, [
        dispatch,
        selectedPeriod,
    ]);


    // ==========================================
    // NORMALIZE API RESPONSE
    // ==========================================

    const data =
        appointments?.data ||
        appointments ||
        {};


    // ==========================================
    // TOTAL
    // ==========================================

    const total =
        data?.total ??
        data?.total_appointments ??
        0;


    // ==========================================
    // GROWTH
    // ==========================================

    const growth =
        data?.growth_percentage ||
        "+0.0%";


    // ==========================================
    // COMPARISON TEXT
    // ==========================================

    const comparisonText =
        data?.comparison_text ||
        "Compared to last week";


    // ==========================================
    // BREAKUP
    // ==========================================

    const breakup =
        data?.breakup ||
        {};


    // ==========================================
    // PERIOD OPTIONS
    // ==========================================

    const periodOptions = [
        {
            value: "today",
            label: "Today",
        },
        {
            value: "week",
            label: "This Week",
        },
        {
            value: "month",
            label: "This Month",
        },
    ];


    // ==========================================
    // CHANGE PERIOD
    // ==========================================

    const handlePeriodChange = (
        nextPeriod
    ) => {

        setSelectedPeriod(
            nextPeriod
        );


        /*
         * If parent is also maintaining
         * the period, notify it.
         */

        if (onPeriodChange) {

            onPeriodChange(
                nextPeriod
            );

        }

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <DashboardCard
            className="
                px-5
                pt-5
                pb-4
            "
            onClick={() =>
                navigate(
                    "/frontoffice/upcoming-appointments"
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

                {/* ======================================= */}
                {/* LEFT SIDE */}
                {/* ======================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >

                    {/* TOTAL */}

                    <h2
                        className="
                            shrink-0
                            text-[26px]
                            font-semibold
                            text-[#4B2E2A]
                        "
                    >
                        {
                            Number(
                                total
                            ).toLocaleString()
                        }
                    </h2>


                    {/* TITLE */}

                    <span
                        className="
                            shrink-0
                            text-[16px]
                            font-semibold
                            text-[#4B2E2A]
                        "
                    >
                        Appointments
                    </span>


                    {/* GROWTH */}

                    <span
                        className="
                            shrink-0
                            rounded-md
                            bg-[#EAFBEF]
                            px-2
                            py-1
                            text-[11px]
                            font-semibold
                            text-green-600
                        "
                    >
                        {growth}
                    </span>


                    {/* COMPARISON */}

                    <span
                        className="
                            truncate
                            text-[11px]
                            text-[#8A756B]
                        "
                    >
                        {comparisonText}
                    </span>

                </div>


                {/* ======================================= */}
                {/* PERIOD DROPDOWN */}
                {/* ======================================= */}

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
                            selectedPeriod
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
            {/* DIVIDER */}
            {/* ========================================= */}

            <div
                className="
                    my-4
                    border-t
                    border-[#EFE4DC]
                "
            />


            {/* ========================================= */}
            {/* BREAKUP */}
            {/* ========================================= */}

            <div
                className="
                    grid
                    grid-cols-6
                "
            >

                <Breakup
                    title="In-Person"
                    value={
                        breakup?.in_person ??
                        0
                    }
                />


                <Breakup
                    title="Video Appt."
                    value={
                        breakup?.video_appt ??
                        0
                    }
                />


                <Breakup
                    title="Home Visit"
                    value={
                        breakup?.home_visit ??
                        0
                    }
                />


                <Breakup
                    title="Follow-Up"
                    value={
                        breakup?.follow_up ??
                        0
                    }
                />


                <Breakup
                    title="Direct Walk-in"
                    value={
                        breakup?.direct_walk_in ??
                        0
                    }
                />


                <Breakup
                    title="Therapy"
                    value={
                        breakup?.therapy ??
                        0
                    }
                    last
                />

            </div>


            {/* ========================================= */}
            {/* LOADING */}
            {/* ========================================= */}

            {loading && (

                <div
                    className="
                        mt-3
                        text-right
                        text-[10px]
                        text-[#8A756B]
                    "
                >
                    Loading...
                </div>

            )}

        </DashboardCard>

    );

};


// ==========================================
// BREAKUP ITEM
// ==========================================

const Breakup = ({
    title,
    value,
    last,
}) => {

    return (

        <div
            className={`
                px-2
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
                    text-[16px]
                    font-medium
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

};


export default UpcomingAppointments;