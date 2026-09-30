import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";
import StatsCard from "../../../components/Dashboard/StatsCard";

import {
    loadTherapiesDashboard,
} from "../../../redux/dashboard/dashboardThunk";


const TherapiesPrescribed = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // ================================
    // Doctor
    // ================================

    const doctor = useSelector(
        (state) => state.auth.user
    );


    // ================================
    // Therapies
    // ================================

    const therapies = useSelector(
        (state) => state.dashboard.therapies
    );


    const breakdown =
        therapies?.breakdown ?? [];


    // ================================
    // Period
    // ================================

    const [period, setPeriod] =
        useState("today");


    // ================================
    // Load Therapies
    // ================================

    useEffect(() => {

        if (!doctor?.id) return;

        dispatch(
            loadTherapiesDashboard({
                doctorId: doctor.id,
                period,
            })
        );

    }, [
        dispatch,
        doctor?.id,
        period,
    ]);


    // ================================
    // Navigate to Therapy Table
    // ================================

    const handleCardClick = () => {

        navigate(
            "/doctor/therapies-prescribed"
        );

    };


    return (

        <DashboardCard
            onClick={handleCardClick}
            className="
                cursor-pointer
                p-5
                sm:p-6
                transition-all
                duration-200
                hover:shadow-md
            "
        >

            {/* ================================ */}
            {/* Header */}
            {/* ================================ */}

            <div className="flex items-center justify-between">

                <h2 className="text-[17px] sm:text-[18px] font-semibold text-[#4B2E2A] tracking-tight">
                    Therapies Prescribed
                </h2>


                {/* 
                    Stop the dropdown click from
                    navigating to the table
                */}

                <div
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >

                    <DashboardDropdown
                        value={period}
                        options={[
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
                        ]}
                        onChange={setPeriod}
                    />

                </div>

            </div>


            {/* ================================ */}
            {/* Main */}
            {/* ================================ */}

            <div className="mt-4 flex items-center justify-between">

                <div>

                    <h1 className="text-[28px] sm:text-[32px] font-bold leading-none text-[#4B2E2A]">
                        {therapies?.total ?? 0}
                    </h1>


                    <p className="mt-1.5 text-[12px] sm:text-[13px] font-medium text-[#7D726B]">
                        Total Therapies
                    </p>

                </div>


                <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-[#FFF4EB] border border-[#FFE8D6] text-[#D48A43] shrink-0">

                    <FaLeaf
                        size={24}
                        className="text-[#D48A43]"
                    />

                </div>

            </div>


            {/* ================================ */}
            {/* Divider */}
            {/* ================================ */}

            <div className="my-3 sm:my-3.5 border-t border-[#EFE4DC]" />


            {/* ================================ */}
            {/* Stats */}
            {/* ================================ */}

            <div
                className={`
                    grid
                    gap-y-3
                    sm:gap-y-0
                    ${breakdown.length <= 4
                        ? "grid-cols-2 sm:grid-cols-4"
                        : "grid-cols-2"
                    }
                `}
            >

                {breakdown.map(
                    (item, index) => (

                        <div
                            key={`${item.therapy_name}-${index}`}
                            className={`
                                ${index % 2 === 0 ? "border-r border-[#EFE4DC]" : "sm:border-r border-[#EFE4DC]"}
                                ${index === breakdown.length - 1 ? "border-r-0 sm:border-r-0" : ""}
                            `}
                        >
                            <StatsCard
                                title={item.therapy_name}
                                value={item.count}
                                border={false}
                            />
                        </div>

                    )
                )}

            </div>

        </DashboardCard>

    );

};


export default TherapiesPrescribed;