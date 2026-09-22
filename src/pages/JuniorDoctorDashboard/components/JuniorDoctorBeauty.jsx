import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuCalendarDays } from "react-icons/lu";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";

import {
    loadJuniorDoctorBeauty,
} from "../../../redux/juniorDoctor/juniorDoctorDashboardThunk";


const JuniorDoctorBeauty = () => {

    const dispatch = useDispatch();

    const [period, setPeriod] = useState("today");

    const {
        beauty,
        beautyLoading,
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

        if (!beauty?.[period]) {

            dispatch(
                loadJuniorDoctorBeauty(period)
            );

        }

    }, [
        dispatch,
        period,
        beauty,
    ]);


    // =====================================================
    // GET DATA FOR CURRENT PERIOD
    // =====================================================

    const data =
        beauty?.[period] || {};


    return (
        <DashboardCard className="px-5 pt-5 pb-5">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <h2 className="text-[21px] font-semibold text-[#4B2E2A]">
                    Beauty
                </h2>

                <DashboardDropdown
                    value={period}
                    options={periodOptions}
                    onChange={setPeriod}
                />

            </div>


            {/* CONTENT */}
            <div className="mt-4 flex items-center justify-between">

                <div>

                    <h1 className="text-[32px] font-bold leading-none text-[#4B2E2A]">
                        {beautyLoading
                            ? "—"
                            : data.total_consultations ?? 0}
                    </h1>

                    <p className="mt-2 text-[14px] text-[#6F625A]">
                        Total Consultations Till Date
                    </p>

                </div>


                <div className="mr-7 flex h-[70px] w-[70px] items-center justify-center text-[#E8BD83]">

                    <LuCalendarDays
                        size={60}
                        strokeWidth={1}
                    />

                </div>

            </div>

        </DashboardCard>
    );
};


export default JuniorDoctorBeauty;