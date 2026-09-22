import {
    useState,
} from "react";

import {
    useDispatch,
} from "react-redux";

import DashboardLayout
    from "../../components/Layout/DashboardLayout";

import {
    setActiveFilter,
    setSelectedPatient,
} from "../../redux/consultation/consultationSlice";

import {
    loadPatientDetails,
} from "../../redux/consultation/consultationThunk";

import JuniorAppointmentScheduleOverview
    from "./components/JuniorAppointmentScheduleOverview";

import JuniorDoctorAppointmentList
    from "./components/JuniorDoctorAppointmentList";

import JuniorPatientProfile
    from "./components/JuniorPatientProfile";


const JuniorDoctorAppointment = () => {

    const dispatch =
        useDispatch();


    const [
        activeSection,
        setActiveSection,
    ] = useState("overview");


    const [
        period,
        setPeriod,
    ] = useState("today");


    const handlePeriodChange = (
        newPeriod
    ) => {

        setPeriod(
            newPeriod
        );

        dispatch(
            setActiveFilter("")
        );

        setActiveSection(
            "overview"
        );

    };


    // =====================================================
    // SELECT PATIENT
    // =====================================================

    const handleSelectPatient = (
        appointment
    ) => {

        if (!appointment) {
            return;
        }


        // ================================================
        // STORE SELECTED APPOINTMENT
        // ================================================

        dispatch(
            setSelectedPatient(
                appointment
            )
        );


        // ================================================
        // LOAD PATIENT PROFILE + WELLNESS
        // ================================================

        if (
            appointment.patient_id
        ) {

            dispatch(
                loadPatientDetails(
                    appointment.patient_id
                )
            );

        }


        // ================================================
        // OPEN OVERVIEW
        // ================================================

        setActiveSection(
            "overview"
        );

    };


    return (

        <DashboardLayout
            role="junior-doctor"
        >

            <div
                className="
                    min-h-screen
                    bg-[#F7F7F7]
                    p-8
                "
            >

                {/* ================================= */}
                {/* SCHEDULE OVERVIEW */}
                {/* ================================= */}

                <JuniorAppointmentScheduleOverview
                    period={
                        period
                    }

                    setPeriod={
                        handlePeriodChange
                    }
                />


                {/* ================================= */}
                {/* APPOINTMENTS + PATIENT PROFILE */}
                {/* ================================= */}

                <div
                    className="
                        mt-6
                        grid
                        grid-cols-[430px_1fr]
                        gap-5
                    "
                >

                    {/* ================================= */}
                    {/* LEFT */}
                    {/* ================================= */}

                    <JuniorDoctorAppointmentList
                        period={
                            period
                        }

                        onSelectPatient={
                            handleSelectPatient
                        }
                    />


                    {/* ================================= */}
                    {/* RIGHT */}
                    {/* ================================= */}

                    <JuniorPatientProfile
                        activeSection={
                            activeSection
                        }

                        setActiveSection={
                            setActiveSection
                        }
                    />

                </div>

            </div>

        </DashboardLayout>

    );

};


export default JuniorDoctorAppointment;