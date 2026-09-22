import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    loadJuniorDoctorScheduleOverview,
} from "../../../redux/juniorDoctor/juniorDoctorDashboardThunk";

import DashboardDropdown
    from "../../../components/Dashboard/DashboardDropdown";


const JuniorAppointmentScheduleOverview = ({
    period,
    setPeriod,
}) => {

    const dispatch =
        useDispatch();


    const {
        scheduleOverview,
        scheduleOverviewLoading,
    } = useSelector(
        (state) =>
            state.juniorDoctorDashboard
    );


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


    useEffect(() => {

        if (!scheduleOverview?.[period]) {

            dispatch(
                loadJuniorDoctorScheduleOverview(
                    period
                )
            );

        }

    }, [
        dispatch,
        period,
        scheduleOverview,
    ]);


    const data =
        scheduleOverview?.[period] || {};


    return (

        <div>

            {/* HEADER */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <h2
                    className="
                        text-[20px]
                        font-semibold
                        text-[#4B2E2A]
                    "
                >
                    Schedule Overview
                </h2>


                <DashboardDropdown
                    value={period}
                    options={periodOptions}
                    onChange={setPeriod}
                />

            </div>


            {/* STATS */}

            <div
                className="
                    mt-5
                    grid
                    grid-cols-[210px_1fr]
                    gap-5
                "
            >

                {/* TOTAL */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-[#E7DBD3]
                        bg-[#FFF9F4]
                        p-5
                        text-center
                    "
                >

                    <p
                        className="
                            text-[30px]
                            font-bold
                            text-[#4B2E2A]
                        "
                    >
                        {scheduleOverviewLoading
                            ? "—"
                            : data.total_appointments ??
                              0}
                    </p>

                    <p
                        className="
                            mt-2
                            text-[15px]
                            text-[#4B2E2A]
                        "
                    >
                        Total Appointments
                    </p>

                </div>


                {/* BREAKDOWN */}

                <div
                    className="
                        grid
                        grid-cols-4
                        rounded-2xl
                        border
                        border-[#E7DBD3]
                        bg-white
                        overflow-hidden
                    "
                >

                    <Stat
                        label="In-Person"
                        value={
                            data.in_person
                        }
                        loading={
                            scheduleOverviewLoading
                        }
                    />

                    <Stat
                        label="Video Appts."
                        value={
                            data.video_appts
                        }
                        loading={
                            scheduleOverviewLoading
                        }
                    />

                    <Stat
                        label="Home Visits"
                        value={
                            data.home_visits
                        }
                        loading={
                            scheduleOverviewLoading
                        }
                    />

                    <Stat
                        label="Follow-Ups"
                        value={
                            data.follow_ups
                        }
                        loading={
                            scheduleOverviewLoading
                        }
                    />

                </div>

            </div>

        </div>

    );

};


const Stat = ({
    label,
    value,
    loading,
}) => {

    return (

        <div
            className="
                border-l
                first:border-l-0
                border-[#EEE3DA]
                p-4
                text-center
            "
        >

            <p
                className="
                    text-[28px]
                    font-bold
                    text-[#4B2E2A]
                "
            >
                {loading
                    ? "—"
                    : value ?? 0}
            </p>

            <p
                className="
                    mt-1
                    text-[14px]
                    text-[#4B2E2A]
                "
            >
                {label}
            </p>

        </div>

    );

};


export default JuniorAppointmentScheduleOverview;