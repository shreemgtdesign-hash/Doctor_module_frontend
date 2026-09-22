import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    FaHeartbeat,
    FaLungs,
    FaBrain,
    FaBone,
    FaLeaf,
    FaChild,
    FaEllipsisH,
} from "react-icons/fa";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";

import {
    loadJuniorDoctorAilments,
} from "../../../redux/juniorDoctor/juniorDoctorDashboardThunk";


const JuniorDoctorAilmentsAddressed = () => {

    const dispatch = useDispatch();

    const [period, setPeriod] = useState("today");

    const {
        ailments,
        ailmentsLoading,
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

        if (!ailments?.[period]) {

            dispatch(
                loadJuniorDoctorAilments(period)
            );

        }

    }, [
        dispatch,
        period,
        ailments,
    ]);


    // =====================================================
    // GET DATA FOR CURRENT PERIOD
    // =====================================================

    const data =
        ailments?.[period] || {};


    const categories =
        data.categories || {};


    // =====================================================
    // CATEGORY ITEMS
    // =====================================================

    const items = [
        {
            label: "Diabetes",
            value: categories.diabetes,
            icon: FaHeartbeat,
        },
        {
            label: "Orthopedics",
            value: categories.orthopedics,
            icon: FaBone,
        },
        {
            label: "Cardiac",
            value: categories.cardiac,
            icon: FaHeartbeat,
        },
        {
            label: "Neurological",
            value: categories.neurological,
            icon: FaBrain,
        },
        {
            label: "Skin",
            value: categories.skin,
            icon: FaLeaf,
        },
        {
            label: "Respiratory",
            value: categories.respiratory,
            icon: FaLungs,
        },
        {
            label: "Pediatric",
            value: categories.pediatric,
            icon: FaChild,
        },
        {
            label: "Other",
            value: categories.other,
            icon: FaEllipsisH,
        },
    ];


    return (
        <DashboardCard className="px-5 pt-5 pb-5">

            {/* HEADER */}
            <div className="flex items-center justify-between">

                <h2 className="text-[21px] font-semibold text-[#4B2E2A]">
                    Ailments Addressed
                </h2>

                <DashboardDropdown
                    value={period}
                    options={periodOptions}
                    onChange={setPeriod}
                />

            </div>


            {/* CARDS */}
            <div className="mt-5 grid grid-cols-4 gap-4">

                {items.map((item) => {

                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="
                                relative
                                min-h-[130px]
                                rounded-2xl
                                border
                                border-[#EEE3DA]
                                bg-white
                                p-4
                            "
                        >

                            {/* LABEL */}
                            <p className="text-[16px] font-medium text-[#4B2E2A]">
                                {item.label}
                            </p>


                            {/* VALUE */}
                            <p className="mt-4 text-[30px] font-bold leading-none text-[#4B2E2A]">
                                {ailmentsLoading
                                    ? "—"
                                    : item.value ?? 0}
                            </p>


                            {/* ICON */}
                            <div
                                className="
                                    absolute
                                    bottom-3
                                    right-3
                                    flex
                                    h-[52px]
                                    w-[52px]
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-[#FFF0E5]
                                    text-[#4B2E2A]
                                "
                            >

                                <Icon
                                    size={28}
                                />

                            </div>

                        </div>
                    );

                })}

            </div>

        </DashboardCard>
    );
};


export default JuniorDoctorAilmentsAddressed;