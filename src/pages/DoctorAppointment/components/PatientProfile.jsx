import {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useSelector,
} from "react-redux";

import PatientHeader from "./PatientHeader";

import PatientOverview from "../sections/PatientOverview";
import ChiefComplaints from "../sections/ChiefComplaints";
import Diagnosis from "../sections/Diagnosis";
import Prescription from "../sections/Prescription";
import Therapy from "../sections/Therapy";
import Reports from "../sections/Reports";
import PatientHistory from "../sections/PatientHistory";
import ViewReport from "../sections/ViewReport";

// ==========================================
// CONSULTATION TIMER
// ==========================================


const PatientProfile = forwardRef(
  (
    {
      activeSection,
      setActiveSection,
    },
    ref
  ) => {

    // ==========================================
    // CONSULTATION STATE
    // ==========================================

    const {
      selectedPatient,
      patientProfile,
      patientWellness,
      patientLoading,
    } = useSelector(
      (state) => state.consultation
    );

    // ==========================================
    // CONSULTATION TIMER STATE
    // ==========================================

    const CONSULTATION_DURATION = 15 * 60;

    const [
      consultationTimeLeft,
      setConsultationTimeLeft,
    ] = useState(CONSULTATION_DURATION);

    const [
      consultationTimerStarted,
      setConsultationTimerStarted,
    ] = useState(false);

    const consultationTimerRef =
      useRef(null);

    // ==========================================
    // VIEW REPORT STATE
    // ==========================================

    const [
      selectedConsultationId,
      setSelectedConsultationId,
    ] = useState(null);


    // ==========================================
    // START CONSULTATION TIMER
    // ==========================================

    useEffect(() => {

      if (
        activeSection !== "prescription"
      ) {
        return;
      }

      if (
        consultationTimerStarted
      ) {
        return;
      }

      setConsultationTimerStarted(
        true
      );

    }, [
      activeSection,
      consultationTimerStarted,
    ]);

    // ==========================================
    // CONSULTATION TIMER COUNTDOWN
    // ==========================================

    useEffect(() => {

      if (
        !consultationTimerStarted
      ) {
        return;
      }

      if (
        consultationTimeLeft <= 0
      ) {
        return;
      }

      consultationTimerRef.current =
        setInterval(() => {

          setConsultationTimeLeft(
            (previousTime) => {

              if (
                previousTime <= 1
              ) {

                clearInterval(
                  consultationTimerRef.current
                );

                return 0;
              }

              return previousTime - 1;

            }
          );

        }, 1000);


      return () => {

        if (
          consultationTimerRef.current
        ) {

          clearInterval(
            consultationTimerRef.current
          );

        }

      };

    }, [
      consultationTimerStarted,
      consultationTimeLeft,
    ]);

    // ==========================================
    // RESET TIMER FOR NEW PATIENT
    // ==========================================

    const previousPatientIdRef =
      useRef(null);

    useEffect(() => {

      const currentPatientId =
        selectedPatient?.id;

      if (!currentPatientId) {
        return;
      }

      if (
        previousPatientIdRef.current ===
        currentPatientId
      ) {
        return;
      }

      previousPatientIdRef.current =
        currentPatientId;

      if (
        consultationTimerRef.current
      ) {

        clearInterval(
          consultationTimerRef.current
        );

      }

      setConsultationTimerStarted(
        false
      );

      setConsultationTimeLeft(
        CONSULTATION_DURATION
      );

    }, [
      selectedPatient?.id,
    ]);
    // ==========================================
    // SCROLL REFS
    // ==========================================

    const profileTopRef =
      useRef(null);

    const sectionTopRef =
      useRef(null);

    const scrollModeRef =
      useRef("section");


    // ==========================================
    // FIND SCROLL CONTAINER
    // ==========================================

    const getScrollContainer = (
      element
    ) => {

      if (!element) {
        return null;
      }

      let parent =
        element.parentElement;

      while (parent) {

        const style =
          window.getComputedStyle(
            parent
          );

        const isScrollable =
          /(auto|scroll)/.test(
            style.overflowY
          ) &&
          parent.scrollHeight >
          parent.clientHeight;

        if (isScrollable) {
          return parent;
        }

        parent =
          parent.parentElement;
      }

      return document.scrollingElement;
    };


    // ==========================================
    // SCROLL TARGET
    // ==========================================

    const scrollToTarget = (
      target
    ) => {

      if (!target) {
        return;
      }

      const scrollContainer =
        getScrollContainer(
          target
        );

      if (!scrollContainer) {
        return;
      }


      // ========================================
      // DOCUMENT SCROLL
      // ========================================

      if (
        scrollContainer ===
        document.scrollingElement
      ) {

        const targetTop =
          target.getBoundingClientRect()
            .top +
          window.scrollY;

        window.scrollTo({
          top: Math.max(
            0,
            targetTop - 80
          ),
          behavior: "smooth",
        });

        return;
      }


      // ========================================
      // NESTED SCROLL
      // ========================================

      const targetRect =
        target.getBoundingClientRect();

      const containerRect =
        scrollContainer.getBoundingClientRect();

      const targetPosition =
        targetRect.top -
        containerRect.top +
        scrollContainer.scrollTop;

      const finalPosition =
        Math.max(
          0,
          targetPosition - 60
        );

      scrollContainer.scrollTo({
        top: finalPosition,
        behavior: "smooth",
      });

    };


    // ==========================================
    // SCROLL WHEN SECTION CHANGES
    // ==========================================

    useEffect(() => {

      if (!activeSection) {
        return;
      }

      const frameId =
        requestAnimationFrame(() => {

          const isProfile =
            scrollModeRef.current ===
            "profile";

          const target =
            isProfile
              ? profileTopRef.current
              : sectionTopRef.current;

          if (!target) {
            return;
          }

          scrollToTarget(
            target
          );

        });

      return () => {
        cancelAnimationFrame(
          frameId
        );
      };

    }, [
      activeSection,
    ]);


    // ==========================================
    // GO TO SECTION
    // ==========================================

    const goToSection = (
      section,
      scrollTo = "section"
    ) => {

      scrollModeRef.current =
        scrollTo;

      setActiveSection(
        section
      );

    };


    // ==========================================
    // OPEN VIEW REPORT
    // ==========================================

    const handleViewReport = (
      consultationId
    ) => {

      if (!consultationId) {
        console.error(
          "Consultation ID is missing"
        );

        return;
      }

      console.log(
        "Selected consultation:",
        consultationId
      );


      // Save consultation ID

      setSelectedConsultationId(
        consultationId
      );


      // Scroll to section

      scrollModeRef.current =
        "section";


      // Change active section

      setActiveSection(
        "viewReport"
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
          ref={ref}
          className="
            h-full
            min-h-[720px]
            rounded-[30px]
            border
            border-[#E7DBD3]
            bg-white
            flex
            items-center
            justify-center
          "
        >
          Loading...
        </div>
      );

    }


    // ==========================================
    // NO PATIENT
    // ==========================================

    if (!selectedPatient) {

      return (
        <div
          ref={ref}
          className="
            h-full
            min-h-[720px]
            rounded-[30px]
            border
            border-[#E7DBD3]
            bg-white
            flex
            items-center
            justify-center
          "
        >

          <p className="text-lg text-[#8B7A70]">
            Select a patient to begin
            consultation
          </p>

        </div>
      );

    }



    // ==========================================
    // MAIN
    // ==========================================

    return (

      <div
        ref={ref}
        className="
    h-[720px]
    min-h-0
    min-w-0
    overflow-y-auto
    rounded-[30px]
    border
    border-[#E7DBD3]
    bg-white
    p-8
    hide-scrollbar
  "
      >

        {/* ================================= */}
        {/* PATIENT HEADER */}
        {/* ================================= */}

        <div
          ref={profileTopRef}
        >

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

        </div>


        {/* ================================= */}
        {/* SECTION TOP */}
        {/* ================================= */}

        <div
          ref={sectionTopRef}
        >

          {/* ================================= */}
          {/* OVERVIEW */}
          {/* ================================= */}

          {activeSection ===
            "overview" && (

              <PatientOverview
                activeSection={
                  activeSection
                }
                setActiveSection={
                  setActiveSection
                }
              />

            )}


          {/* ================================= */}
          {/* CHIEF COMPLAINTS */}
          {/* ================================= */}

          {activeSection ===
            "complaints" && (

              <ChiefComplaints
                appointmentId={selectedPatient?.id}
                consultationTimeLeft={consultationTimeLeft}
                consultationTimerStarted={consultationTimerStarted}
                setActiveSection={setActiveSection}

                onBack={() =>
                  goToSection(
                    "overview",
                    "profile"
                  )
                }

                onContinue={() =>
                  goToSection(
                    "history",
                    "section"
                  )
                }
              />

            )}

          {activeSection ===
            "history" && (

              <PatientHistory
                patient={
                  patientProfile
                }
                consultationTimeLeft={
                  consultationTimeLeft
                }

                consultationTimerStarted={
                  consultationTimerStarted
                }

                appointment={
                  selectedPatient
                }

                onViewReport={
                  handleViewReport
                }

                onBack={() =>
                  goToSection(
                    "complaints",
                    "section"
                  )
                }
                onContinue={() =>
                  goToSection(
                    "reports",
                    "section"
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
                consultationTimeLeft={
                  consultationTimeLeft
                }

                consultationTimerStarted={
                  consultationTimerStarted
                }

                appointmentId={
                  selectedPatient?.id
                }

                onBack={() =>
                  goToSection(
                    "reports",
                    "profile"
                  )
                }

                onContinue={() =>
                  goToSection(
                    "prescription",
                    "section"
                  )
                }
              />

            )}


          {/* ================================= */}
          {/* PRESCRIPTION */}
          {/* ================================= */}

          {activeSection ===
            "prescription" && (

              <Prescription
                key={
                  selectedPatient
                    ?.consultation_id ||
                  selectedPatient?.id
                }
                consultationTimeLeft={
                  consultationTimeLeft
                }

                consultationTimerStarted={
                  consultationTimerStarted
                }

                patient={
                  patientProfile
                }

                appointment={
                  selectedPatient?.id
                }

                consultationId={
                  selectedPatient
                    ?.consultation_id
                }

                patientId={
                  selectedPatient
                    ?.patient_id
                }

                onBack={() =>
                  goToSection(
                    "diagnosis",
                    "section"
                  )
                }

                onContinue={() =>
                  goToSection(
                    "therapy",
                    "section"
                  )
                }
              />

            )}


          {/* ================================= */}
          {/* THERAPY */}
          {/* ================================= */}

          {activeSection ===
            "therapy" && (

              <Therapy
                patient={
                  patientProfile
                }
                consultationTimeLeft={
                  consultationTimeLeft
                }

                consultationTimerStarted={
                  consultationTimerStarted
                }

                appointmentId={
                  selectedPatient?.id
                }

                consultationId={
                  selectedPatient
                    ?.consultation_id
                }

                onBack={() =>
                  goToSection(
                    "prescription",
                    "section"
                  )
                }

                onContinue={() =>
                  goToSection(
                    "overview",
                    "section"
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
                consultationTimeLeft={
                  consultationTimeLeft
                }

                consultationTimerStarted={
                  consultationTimerStarted
                }
                appointment={
                  selectedPatient
                }
                onBack={() =>
                  goToSection(
                    "history",
                    "section"
                  )
                }

                onContinue={() =>
                  goToSection(
                    "diagnosis",
                    "section"
                  )
                }
              />

            )}





          {/* ================================= */}
          {/* VIEW REPORT */}
          {/* ================================= */}

          {activeSection ===
            "viewReport" && (

              <ViewReport
                consultationId={
                  selectedConsultationId
                }
                consultationTimeLeft={
                  consultationTimeLeft
                }

                consultationTimerStarted={
                  consultationTimerStarted
                }

                onBack={() =>
                  goToSection(
                    "history",
                    "section"
                  )
                }
              />

            )}

        </div>

      </div>

    );

  }
);


export default PatientProfile;