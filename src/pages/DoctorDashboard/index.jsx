import { useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";

import ScheduleOverview from "./components/ScheduleOverview";
import ConsultationHistory from "./components/ConsultationHistory";
import AilmentsAddressed from "./components/AilmentsAddressed";
import MedicinesPrescribed from "./components/medicinesPrescribed";
import BillingDetails from "./components/BillingDetails";
import TherapiesPrescribed from "./components/therapiesPrescribed";
import Beauty from "./components/Beauty";
import Wellness from "./components/Wellness";

const DoctorDashboard = () => {

    const [period, setPeriod] = useState("today");

    return (
        <DashboardLayout role="doctor">

            <div className="space-y-6">

                <div className="m-5 grid grid-cols-2 gap-5">

                    <ScheduleOverview
                        period={period}
                        setPeriod={setPeriod}
                    />

                    <ConsultationHistory
                        period={period}
                    />

                    <Wellness
                        period={period}
                    />

                    <Beauty
                        period={period}
                    />

                    <AilmentsAddressed
                        period={period}
                    />

                    <div className="space-y-4">

                        <TherapiesPrescribed
                            period={period}
                        />

                        <MedicinesPrescribed
                            period={period}
                        />

                    </div>

                </div>

                <BillingDetails />

            </div>

        </DashboardLayout>
    );
};

export default DoctorDashboard;