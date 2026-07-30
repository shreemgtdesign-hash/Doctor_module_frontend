import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import { setActiveFilter } from "../../redux/consultation/consultationSlice";
import ScheduleOverview from "./components/ScheduleOverview";
import AppointmentList from "./components/AppointmentList";
import PatientProfile from "./components/PatientProfile";

import { getDashboard } from "../../redux/dashboard/dashboardThunk";
import { loadAppointments } from "../../redux/consultation/consultationThunk";
import {

    useLayoutEffect,
    useRef,

} from "react";
const DoctorAppointment = () => {
    const dispatch = useDispatch();
    const profileRef = useRef(null);
    const [profileHeight, setProfileHeight] = useState(0);



    useLayoutEffect(() => {
        if (!profileRef.current) return;

        const observer = new ResizeObserver(() => {
            setProfileHeight(profileRef.current.offsetHeight);
        });

        observer.observe(profileRef.current);

        return () => observer.disconnect();
    }, []);
    const [activeSection, setActiveSection] =
        useState("overview");
    const doctor = useSelector((state) => state.auth.user);

    const { overview } = useSelector(
        (state) => state.dashboard
    );

    const [period, setPeriod] = useState("today");
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);

        // Reset status filter to "All"
        dispatch(setActiveFilter(""));
    };
    useEffect(() => {
        if (doctor?.id) {
            dispatch(
                getDashboard({
                    doctorId: doctor.id,
                    period,
                })
            );

            dispatch(
                loadAppointments({
                    doctorId: doctor.id,
                    date: new Date().toISOString().split("T")[0],
                    status: "",
                })
            );
        }
    }, [dispatch, doctor, period]);


    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#F7F7F7] p-8">
                <ScheduleOverview
                    overview={overview}
                    period={period}
                    setPeriod={handlePeriodChange}
                />

                <div className="mt-6 grid grid-cols-[430px_1fr] gap-5">

                    <AppointmentList
                        height={profileHeight}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />

                    <div ref={profileRef}>
                        <PatientProfile
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                        />
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default DoctorAppointment;