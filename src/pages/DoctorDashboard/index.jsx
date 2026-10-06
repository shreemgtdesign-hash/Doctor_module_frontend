import { useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";

import ScheduleOverview from "./components/ScheduleOverview";
import ConsultationHistory from "./components/ConsultationHistory";
import AilmentsAddressed from "./components/AilmentsAddressed";
import MedicinesPrescribed from "./components/MedicinesPrescribed";
import BillingDetails from "./components/BillingDetails";
import TherapiesPrescribed from "./components/TherapiesPrescribed";
import Beauty from "./components/Beauty";
import Wellness from "./components/Wellness";

const DoctorDashboard = () => {

    return (
        <DashboardLayout role="doctor">

            <div className="w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-[1680px] mx-auto">

                {/* ================================= */}
                {/* TOP CARDS: SCHEDULE, CONSULTATION, WELLNESS, BEAUTY */}
                {/* ================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">

                    <ScheduleOverview />

                    <ConsultationHistory />

                    <Wellness />

                    <Beauty />

                </div>

                {/* ================================= */}
                {/* AILMENTS & THERAPIES/MEDICINES */}
                {/* ================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-stretch">

                    <AilmentsAddressed />

                    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 justify-between">

                        <TherapiesPrescribed />

                        <MedicinesPrescribed />

                    </div>

                </div>

                {/* ================================= */}
                {/* BILLING DETAILS */}
                {/* ================================= */}
                <div className="w-full">
                    <BillingDetails />
                </div>

            </div>

        </DashboardLayout>
    );
};

export default DoctorDashboard;