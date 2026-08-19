import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect, useRef } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";

import { setActiveFilter } from "../../redux/consultation/consultationSlice";

import ScheduleOverview from "./components/ScheduleOverview";
import AppointmentList from "./components/AppointmentList";
import PatientProfile from "./components/PatientProfile";

import { getDashboard } from "../../redux/dashboard/dashboardThunk";

const DoctorAppointment = () => {

    const dispatch = useDispatch();

    const profileRef = useRef(null);

    const [profileHeight, setProfileHeight] = useState(720);

    const [activeSection, setActiveSection] =
        useState("overview");

    const [period, setPeriod] =
        useState("today");


    // ==========================================
    // DOCTOR
    // ==========================================

    const doctor = useSelector(
        (state) => state.auth.user
    );


    // ==========================================
    // DASHBOARD OVERVIEW
    // ==========================================

    const { overview } =
        useSelector(
            (state) => state.dashboard
        );


    // ==========================================
    // PROFILE HEIGHT
    // ==========================================

    useLayoutEffect(() => {

        if (!profileRef.current) {
            return;
        }

        const observer =
            new ResizeObserver(() => {

                setProfileHeight(
                    profileRef.current
                        .offsetHeight
                );

            });

        observer.observe(
            profileRef.current
        );

        return () =>
            observer.disconnect();

    }, []);


    useLayoutEffect(() => {

        requestAnimationFrame(() => {

            if (profileRef.current) {

                setProfileHeight(
                    profileRef.current
                        .offsetHeight
                );

            }

        });

    }, [activeSection]);


    // ==========================================
    // PERIOD CHANGE
    // ==========================================

    const handlePeriodChange = (
        newPeriod
    ) => {

        setPeriod(newPeriod);

        // Reset appointment filter
        dispatch(
            setActiveFilter("")
        );

        // Optional:
        // reset active section
        setActiveSection(
            "overview"
        );

    };


    // ==========================================
    // LOAD SCHEDULE OVERVIEW
    // ==========================================

    useEffect(() => {

        const doctorId =
            doctor?.doctor_id ||
            doctor?.id;

        if (!doctorId) {
            return;
        }

        dispatch(
            getDashboard({
                 doctorId,
                period,
            })
        );

    }, [
        dispatch,
        doctor?.doctor_id,
        doctor?.id,
        period,
    ]);


    return (

        <DashboardLayout role="doctor">

            <div className="
                min-h-screen
                bg-[#F7F7F7]
                p-8
            ">

                {/* ================================= */}
                {/* SCHEDULE OVERVIEW */}
                {/* ================================= */}

                <ScheduleOverview
                    overview={overview}
                    period={period}
                    setPeriod={
                        handlePeriodChange
                    }
                />


                {/* ================================= */}
                {/* PATIENT + PROFILE */}
                {/* ================================= */}

                <div className="
                    mt-6
                    grid
                    grid-cols-[430px_1fr]
                    gap-5
                ">

                    {/* LEFT */}

                    <AppointmentList
                        
                        period={period}
                    />


                    {/* RIGHT */}

                    <div
                        ref={profileRef}
                    >

                        <PatientProfile
                            activeSection={
                                activeSection
                            }
                            setActiveSection={
                                setActiveSection
                            }
                        />

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
};

export default DoctorAppointment;