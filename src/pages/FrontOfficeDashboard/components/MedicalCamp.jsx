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
    loadFrontOfficeMedicalCamp,
} from "../../../redux/frontOffice/frontOfficeDashboardThunk";

import {
    useNavigate,
} from "react-router-dom";


const MedicalCamp = () => {

    const navigate =
        useNavigate();

    const dispatch =
        useDispatch();


    // ==========================================
    // MEDICAL CAMP DATA
    // ==========================================

    const medicalCamp =
        useSelector(
            (state) =>
                state.frontOfficeDashboard
                    .medicalCamp
        );


    // ==========================================
    // PERIOD
    // ==========================================

    const [period, setPeriod] =
        useState("week");


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

        console.log(
            "📅 Medical Camp Period:",
            newPeriod
        );

        setPeriod(
            newPeriod
        );

        dispatch(
            loadFrontOfficeMedicalCamp(
                newPeriod
            )
        );
    };


    return (

        <DashboardCard
            className="
                px-5
                pt-5
                pb-5
            "
            onClick={() =>
                navigate(
                    "/frontoffice/medcamp-calender"
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
                    Medical Camp
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
            {/* TOTAL REGISTRATIONS */}
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
                        medicalCamp?.total_registrations ??
                        0
                    }
                </h1>

                <p
                    className="
                        text-[12px]
                        text-[#7D726B]
                    "
                >
                    Total Registrations
                </p>

            </div>

        </DashboardCard>

    );

};


export default MedicalCamp;