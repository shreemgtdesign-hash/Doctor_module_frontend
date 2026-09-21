import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import DashboardLayout
  from "../../components/Layout/DashboardLayout";

import {
  setActiveFilter,
} from "../../redux/consultation/consultationSlice";

import {
  loadOverview,
} from "../../redux/dashboard/dashboardThunk";


import JuniorPatientProfile
  from "./components/JuniorPatientProfile";
import ScheduleOverview from "../DoctorAppointment/components/ScheduleOverview";
import AppointmentList from "../DoctorAppointment/components/AppointmentList";


const JuniorDoctorAppointment = () => {

  const dispatch = useDispatch();


  // ==========================================
  // STATE
  // ==========================================

  const [
    activeSection,
    setActiveSection,
  ] = useState("overview");


  const [
    period,
    setPeriod,
  ] = useState("today");


  // ==========================================
  // AUTH USER
  // ==========================================

  const doctor = useSelector(
    (state) =>
      state.auth.user
  );


  // ==========================================
  // DASHBOARD OVERVIEW
  // ==========================================

  const {
    overview,
  } = useSelector(
    (state) =>
      state.dashboard
  );


  // ==========================================
  // PERIOD CHANGE
  // ==========================================

  const handlePeriodChange = (
    newPeriod
  ) => {

    setPeriod(newPeriod);

    dispatch(
      setActiveFilter("")
    );

    setActiveSection(
      "overview"
    );

  };


  // ==========================================
  // LOAD OVERVIEW
  // ==========================================

  useEffect(() => {

    const doctorId =
      doctor?.doctor_id ||
      doctor?.id;

    if (!doctorId) {
      return;
    }

    dispatch(
      loadOverview({
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

    <DashboardLayout
      role="doctor"
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

        <ScheduleOverview
          overview={
            overview
          }
          period={
            period
          }
          setPeriod={
            handlePeriodChange
          }
        />


        {/* ================================= */}
        {/* APPOINTMENTS + PATIENT */}
        {/* ================================= */}

        <div
          className="
            mt-6
            grid
            grid-cols-[430px_1fr]
            gap-5
          "
        >

          {/* LEFT */}

          <AppointmentList
            period={
              period
            }
          />


          {/* RIGHT */}

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