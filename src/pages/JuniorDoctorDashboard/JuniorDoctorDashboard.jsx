import DashboardLayout
  from "../../components/Layout/DashboardLayout";

import ScheduleOverview
  from "../DoctorDashboard/components/ScheduleOverview";

import ConsultationHistory
  from "../DoctorDashboard/components/ConsultationHistory";

import Wellness
  from "../DoctorDashboard/components/Wellness";

import Beauty
  from "../DoctorDashboard/components/Beauty";

import AilmentsAddressed
  from "../DoctorDashboard/components/AilmentsAddressed";


const JuniorDoctorDashboard = () => {

  return (

    <DashboardLayout
      role="doctor"
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

          <ScheduleOverview />

          <ConsultationHistory />

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

          <Wellness />

          <Beauty />

        </div>


        {/* ================================= */}
        {/* AILMENTS */}
        {/* ================================= */}

        <div className="mt-5">

          <AilmentsAddressed />

        </div>

      </div>

    </DashboardLayout>

  );

};


export default JuniorDoctorDashboard;