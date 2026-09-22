import DashboardLayout from "../../components/Layout/DashboardLayout";
import JuniorDoctorAilmentsAddressed from "./components/JuniorDoctorAilmentsAddressed";
import JuniorDoctorBeauty from "./components/JuniorDoctorBeauty";
import JuniorDoctorConsultationHistory from "./components/JuniorDoctorConsultationHistory";
import JuniorDoctorScheduleOverview from "./components/JuniorDoctorScheduleOverview";
import JuniorDoctorWellness from "./components/JuniorDoctorWellness";


const JuniorDoctorDashboard = () => {

    return (

        <DashboardLayout
            role="junior-doctor"
        >

            <div
                className="
                    min-h-screen
                    bg-[#F8F6F3]
                    p-6
                "
            >

                {/* ================================= */}
                {/* TOP TWO CARDS */}
                {/* ================================= */}

                <div
                    className="
                        grid
                        grid-cols-2
                        gap-5
                    "
                >

                    <JuniorDoctorScheduleOverview />

                    <JuniorDoctorConsultationHistory />

                </div>


                {/* ================================= */}
                {/* WELLNESS + BEAUTY */}
                {/* ================================= */}

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-5
                    "
                >

                    <JuniorDoctorWellness />

                    <JuniorDoctorBeauty />

                </div>


                {/* ================================= */}
                {/* AILMENTS */}
                {/* ================================= */}

                <div className="mt-5">

                    <JuniorDoctorAilmentsAddressed />

                </div>

            </div>

        </DashboardLayout>

    );

};


export default JuniorDoctorDashboard;