import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuCalendarDays } from "react-icons/lu";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";

import {
    loadJuniorDoctorScheduleOverview,
} from "../../../redux/juniorDoctor/juniorDoctorDashboardThunk";


const JuniorDoctorScheduleOverview = () => {

    const dispatch = useDispatch();

    const [period, setPeriod] = useState("today");

    const {
        scheduleOverview,
        scheduleOverviewLoading,
    } = useSelector(
        (state) => state.juniorDoctorDashboard
    );


    // =====================================================
    // PERIOD OPTIONS
    // =====================================================

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


    // =====================================================
    // LOAD DATA FOR SELECTED PERIOD
    // =====================================================

    useEffect(() => {

        if (!scheduleOverview?.[period]) {

            dispatch(
                loadJuniorDoctorScheduleOverview(period)
            );

        }

    }, [
        dispatch,
        period,
        scheduleOverview,
    ]);


    // =====================================================
    // GET DATA FOR CURRENT PERIOD
    // =====================================================

    const data =
        scheduleOverview?.[period] || {};


    return (
        <DashboardCard className="px-5 pt-5 pb-5">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <h2 className="text-[21px] font-semibold text-[#4B2E2A]">
                    Schedule Overview
                </h2>

                <DashboardDropdown
                    value={period}
                    options={periodOptions}
                    onChange={setPeriod}
                />

            </div>


            {/* MAIN STAT */}
            <div className="mt-4 flex items-center justify-between">

                <div>

                    <h1 className="text-[32px] font-bold leading-none text-[#4B2E2A]">
                        {scheduleOverviewLoading
                            ? "—"
                            : data.total_appointments ?? 0}
                    </h1>

                    <p className="mt-2 text-[14px] text-[#6F625A]">
                        Total Appointments
                    </p>

                </div>


                <div className="mr-7 flex h-[70px] w-[70px] items-center justify-center text-[#E8BD83]">

                    <LuCalendarDays
                        size={60}
                        strokeWidth={1}
                    />

                </div>

            </div>


            {/* DIVIDER */}
            <div className="mt-4 border-t border-[#EEE3DA]" />


            {/* BOTTOM STATS */}
            <div className="mt-4 grid grid-cols-4">

                {/* IN-PERSON */}
                <div className="text-center">

                    <p className="text-[16px] font-medium text-[#4B2E2A]">
                        In-Person
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4B2E2A]">
                        {scheduleOverviewLoading
                            ? "—"
                            : data.in_person ?? 0}
                    </p>

                </div>


                {/* VIDEO */}
                <div className="border-l border-[#EEE3DA] text-center">

                    <p className="text-[16px] font-medium text-[#4B2E2A]">
                        Video Appts.
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4B2E2A]">
                        {scheduleOverviewLoading
                            ? "—"
                            : data.video_appts ?? 0}
                    </p>

                </div>


                {/* HOME VISITS */}
                <div className="border-l border-[#EEE3DA] text-center">

                    <p className="text-[16px] font-medium text-[#4B2E2A]">
                        Home Visits
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4B2E2A]">
                        {scheduleOverviewLoading
                            ? "—"
                            : data.home_visits ?? 0}
                    </p>

                </div>


                {/* FOLLOW UPS */}
                <div className="border-l border-[#EEE3DA] text-center">

                    <p className="text-[16px] font-medium text-[#4B2E2A]">
                        Follow-Ups
                    </p>

                    <p className="mt-1 text-[20px] font-bold text-[#4B2E2A]">
                        {scheduleOverviewLoading
                            ? "—"
                            : data.follow_ups ?? 0}
                    </p>

                </div>

            </div>

        </DashboardCard>
    );
};


export default JuniorDoctorScheduleOverview;