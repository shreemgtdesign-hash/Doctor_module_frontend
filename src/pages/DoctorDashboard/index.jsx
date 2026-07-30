import { useEffect, useState } from "react"; import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/Layout/DashboardLayout";

import ScheduleOverview from "./components/ScheduleOverview";
import ConsultationHistory from "./components/ConsultationHistory";
import AilmentsAddressed from "./components/AilmentsAddressed";
import MedicinesPrescribed from "./components/medicinesPrescribed";
import BillingDetails from "./components/BillingDetails";

import { getDashboard } from "../../redux/dashboard/dashboardThunk";
import TherapiesPrescribed from "./components/therapiesPrescribed";

const DoctorDashboard = () => {
    const dispatch = useDispatch();

    const doctor = useSelector(
        (state) => state.auth.user
    );

    
    const [period, setPeriod] = useState("today");

    useEffect(() => {
        if (!doctor?.id) return;

        dispatch(
            getDashboard({
                doctorId: doctor.id,
                period, // initial load
            })
        );
    }, [dispatch, doctor?.id, period]);
   

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="m-5 grid grid-cols-2 gap-5">
                    <ScheduleOverview
                        period={period}
                        setPeriod={setPeriod} />

                    <ConsultationHistory
                        period={period}
                        setPeriod={setPeriod} />

                    <AilmentsAddressed
                        period={period}
                        setPeriod={setPeriod} />

                    <div className="space-y-4">
                        <TherapiesPrescribed
                            period={period}
                            setPeriod={setPeriod} />

                        <MedicinesPrescribed
                            period={period}
                            setPeriod={setPeriod} />
                    </div>
                </div>

                <BillingDetails />
            </div>
        </DashboardLayout>
    );
};

export default DoctorDashboard;