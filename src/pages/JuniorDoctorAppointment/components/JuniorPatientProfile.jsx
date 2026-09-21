import {
  useEffect,
  useRef,

} from "react";

import {
  useSelector,
} from "react-redux";




import PatientHeader from "../../DoctorAppointment/components/PatientHeader";
import ChiefComplaints from "../../DoctorAppointment/sections/ChiefComplaints";
import PatientHistory from "../../DoctorAppointment/sections/PatientHistory";
import Reports from "../../DoctorAppointment/sections/Reports";
import Diagnosis from "../../DoctorAppointment/sections/Diagnosis";
import JuniorConsultationGrid from "./JuniorConsultationGrid";
import JuniorVitals from "./JuniorVitals";


const JuniorPatientProfile = ({
  activeSection,
  setActiveSection,
}) => {

  const {
    selectedPatient,
    patientProfile,
    patientWellness,
    patientLoading,
  } = useSelector(
    (state) =>
      state.consultation
  );


  const profileRef =
    useRef(null);


  // ==========================================
  // SCROLL
  // ==========================================

  const sectionTopRef =
    useRef(null);


  useEffect(() => {

    if (!activeSection) {
      return;
    }

    requestAnimationFrame(() => {

      sectionTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    });

  }, [
    activeSection,
  ]);


  // ==========================================
  // SECTION NAVIGATION
  // ==========================================

  const goToSection = (
    section
  ) => {

    setActiveSection(
      section
    );

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (
    patientLoading &&
    !selectedPatient
  ) {

    return (

      <div
        className="
          h-[720px]
          rounded-[30px]
          border
          border-[#E7DBD3]
          bg-white
          flex
          items-center
          justify-center
        "
      >

        <p
          className="
            text-[14px]
            text-[#8B7A70]
          "
        >
          Loading patient...
        </p>

      </div>

    );

  }


  // ==========================================
  // NO PATIENT
  // ==========================================

  if (!selectedPatient) {

    return (

      <div
        className="
          h-[720px]
          rounded-[30px]
          border
          border-[#E7DBD3]
          bg-white
          flex
          items-center
          justify-center
        "
      >

        <p
          className="
            text-[15px]
            text-[#8B7A70]
          "
        >
          Select a patient to begin
        </p>

      </div>

    );

  }


  return (

    <div
      ref={profileRef}
      className="
        h-[720px]
        min-h-0
        min-w-0
        overflow-y-auto
        rounded-[30px]
        border
        border-[#E7DBD3]
        bg-white
        p-7
        hide-scrollbar
      "
    >

      {/* ================================= */}
      {/* PATIENT HEADER */}
      {/* ================================= */}

      <PatientHeader
        patient={
          patientProfile
        }
        wellness={
          patientWellness
        }
        appointment={
          selectedPatient
        }
      />


      {/* ================================= */}
      {/* SECTION */}
      {/* ================================= */}

      <div
        ref={sectionTopRef}
        className="mt-2"
      >

        {/* ================================= */}
        {/* OVERVIEW */}
        {/* ================================= */}

        {activeSection ===
          "overview" && (

          <>

            <JuniorVitals
              patientId={
                selectedPatient?.patient_id ||
                patientProfile?.id ||
                selectedPatient?.id
              }
            />

            <JuniorConsultationGrid
              activeSection={
                activeSection
              }
              setActiveSection={
                setActiveSection
              }
            />

          </>

        )}


        {/* ================================= */}
        {/* CHIEF COMPLAINTS */}
        {/* ================================= */}

        {activeSection ===
          "complaints" && (

          <ChiefComplaints
            appointmentId={
              selectedPatient?.id
            }

            setActiveSection={
              setActiveSection
            }

            onBack={() =>
              goToSection(
                "overview"
              )
            }

            onContinue={() =>
              goToSection(
                "history"
              )
            }
          />

        )}


        {/* ================================= */}
        {/* PATIENT HISTORY */}
        {/* ================================= */}

        {activeSection ===
          "history" && (

          <PatientHistory
            patient={
              patientProfile
            }

            appointment={
              selectedPatient
            }

            onViewReport={
              (consultationId) => {
                console.log(
                  "View consultation:",
                  consultationId
                );
              }
            }

            onBack={() =>
              goToSection(
                "complaints"
              )
            }
          />

        )}


        {/* ================================= */}
        {/* REPORTS */}
        {/* ================================= */}

        {activeSection ===
          "reports" && (

          <Reports
            patient={
              patientProfile
            }

            appointment={
              selectedPatient
            }

            onBack={() =>
              goToSection(
                "history"
              )
            }

            onContinue={() =>
              goToSection(
                "diagnosis"
              )
            }
          />

        )}


        {/* ================================= */}
        {/* DIAGNOSIS */}
        {/* ================================= */}

        {activeSection ===
          "diagnosis" && (

          <Diagnosis
            patient={
              patientProfile
            }

            appointmentId={
              selectedPatient?.id
            }

            onBack={() =>
              goToSection(
                "reports"
              )
            }

            onContinue={() =>
              goToSection(
                "overview"
              )
            }
          />

        )}

      </div>

    </div>

  );

};


export default JuniorPatientProfile;