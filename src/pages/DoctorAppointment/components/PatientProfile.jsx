import {
  forwardRef,
  useEffect,
  useRef,
} from "react";

import { useSelector } from "react-redux";

import PatientHeader from "./PatientHeader";

import PatientOverview from "../sections/PatientOverview";
import ChiefComplaints from "../sections/ChiefComplaints";
import Diagnosis from "../sections/Diagnosis";
import Prescription from "../sections/Prescription";
import Therapy from "../sections/Therapy";
import Reports from "../sections/Reports";
import PatientHistory from "../sections/PatientHistory";

const PatientProfile = forwardRef(
  (
    {
      activeSection,
      setActiveSection,
    },
    ref
  ) => {

    const {
      selectedPatient,
      patientProfile,
      patientWellness,
      patientLoading,
    } = useSelector(
      (state) => state.consultation
    );


    // ==========================================
    // SCROLL REFS
    // ==========================================

    const profileTopRef = useRef(null);

    const sectionTopRef = useRef(null);

    /*
      "profile" = scroll to patient name/header
      "section" = scroll to current section
    */
    const scrollModeRef = useRef("section");


    // ==========================================
    // FIND THE ACTUAL SCROLLABLE CONTAINER
    // ==========================================

    const getScrollContainer = (element) => {

      if (!element) {
        return null;
      }

      let parent = element.parentElement;

      while (parent) {

        const style =
          window.getComputedStyle(parent);

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

      // Fallback to document
      return document.scrollingElement;
    };


    // ==========================================
    // SCROLL TO TARGET
    // ==========================================

    const scrollToTarget = (target) => {

      if (!target) {
        return;
      }

      const scrollContainer =
        getScrollContainer(target);

      if (!scrollContainer) {
        return;
      }


      // ========================================
      // DOCUMENT / WINDOW SCROLL
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
      // NESTED SCROLL CONTAINER
      // ========================================

      const targetRect =
        target.getBoundingClientRect();

      const containerRect =
        scrollContainer.getBoundingClientRect();


      /*
        Calculate target position
        relative to the scrollable
        patient-profile container.
      */

      const targetPosition =
        targetRect.top -
        containerRect.top +
        scrollContainer.scrollTop;


      /*
        Keep approximately 60px space
        above the target.

        Change 60 to:
        40 = less space
        80 = more space
      */

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
    // SCROLL AFTER SECTION CHANGE
    // ==========================================

    useEffect(() => {

      if (!activeSection) {
        return;
      }


      /*
        Wait until React has finished rendering
        the new section.
      */

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


          scrollToTarget(target);

        });


      return () => {
        cancelAnimationFrame(frameId);
      };

    }, [activeSection]);


    // ==========================================
    // GO TO SECTION
    // ==========================================

    const goToSection = (
      section,
      scrollTo = "section"
    ) => {

      scrollModeRef.current =
        scrollTo;

      setActiveSection(section);

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
          h-full
          min-h-[720px]
          min-w-0
          rounded-[30px]
          border
          border-[#E7DBD3]
          bg-white
          p-8
        "
      >

        {/* ================================= */}
        {/* PATIENT HEADER */}
        {/* ================================= */}

        <div
          ref={profileTopRef}
        >

          <PatientHeader
            patient={patientProfile}
            wellness={patientWellness}
            appointment={selectedPatient}
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

          {activeSection === "overview" && (

            <PatientOverview
              setActiveSection={
                setActiveSection
              }

              activeSection={
                activeSection
              }
            />

          )}


          {/* ================================= */}
          {/* CHIEF COMPLAINTS */}
          {/* ================================= */}

          {activeSection === "complaints" && (

            <ChiefComplaints
              appointmentId={
                selectedPatient?.id
              }

              setActiveSection={
                setActiveSection
              }

              onBack={() =>
                goToSection(
                  "overview",
                  "profile"
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
          {/* DIAGNOSIS */}
          {/* ================================= */}

          {activeSection === "diagnosis" && (

            <Diagnosis
              patient={
                patientProfile
              }

              appointmentId={
                selectedPatient?.id
              }

              onBack={() =>
                goToSection(
                  "overview",
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

          {activeSection === "prescription" && (

            <Prescription
              key={
                selectedPatient
                  ?.consultation_id ||
                selectedPatient?.id
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

          {activeSection === "therapy" && (

            <Therapy
              patient={
                patientProfile
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
                  "reports",
                  "section"
                )
              }
            />

          )}


          {/* ================================= */}
          {/* REPORTS */}
          {/* ================================= */}

          {activeSection === "reports" && (

            <Reports
              patient={
                patientProfile
              }

              appointment={
                selectedPatient
              }
            />

          )}


          {/* ================================= */}
          {/* HISTORY */}
          {/* ================================= */}

          {activeSection === "history" && (

            <PatientHistory
              patient={
                patientProfile
              }

              appointment={
                selectedPatient
              }
            />

          )}

        </div>

      </div>
    );

  }
);

export default PatientProfile;