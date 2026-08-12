import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/Layout/DashboardLayout";

import ScheduleOverview from "./components/ScheduleOverview";
import ConsultationHistory from "./components/ConsultationHistory";
import AilmentsAddressed from "./components/AilmentsAddressed";
import MedicinesPrescribed from "./components/medicinesPrescribed";
import BillingDetails from "./components/BillingDetails";
import TherapiesPrescribed from "./components/therapiesPrescribed";
import Beauty from "./components/Beauty";
import Wellness from "./components/Wellness";

import { getDashboard } from "../../redux/dashboard/dashboardThunk";

const DoctorDashboard = () => {
    const dispatch = useDispatch();

    const reduxDoctor = useSelector(
        (state) => state.auth.user
    );

    const [period, setPeriod] = useState("today");

    /*
     * Redux user after login.
     *
     * If page is refreshed, Redux may initially be empty,
     * so get the persisted user from localStorage.
     */
    const storedDoctor = (() => {
        try {
            const user = localStorage.getItem("user");

            return user
                ? JSON.parse(user)
                : null;

        } catch {
            return null;
        }
    })();

    const doctor = reduxDoctor || storedDoctor;

    useEffect(() => {
        if (!doctor?.id) {
            console.log(
                "Doctor ID not available yet"
            );

            return;
        }

        console.log(
            "Loading dashboard for doctor:",
            doctor.id
        );

        dispatch(
            getDashboard({
                doctorId: doctor.id,
                period,
            })
        );

    }, [
        dispatch,
        doctor?.id,
        period,
    ]);

    return (
        <DashboardLayout role="doctor">

            <div className="space-y-6">

                <div className="m-5 grid grid-cols-2 gap-5">

                    <ScheduleOverview />

                    <ConsultationHistory />

                    <Wellness />

                    <Beauty />

                    <AilmentsAddressed />

                    <div className="space-y-4">

                        <TherapiesPrescribed />

                        <MedicinesPrescribed />

                    </div>

                </div>

                <BillingDetails />

            </div>

        </DashboardLayout>
    );
};

export default DoctorDashboard;