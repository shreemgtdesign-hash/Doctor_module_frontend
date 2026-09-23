import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";
import ConsultationTimer
    from "../../DoctorAppointment/components/ConsultationTimer";
import {
    HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";


import PatientHeader
    from "../../DoctorAppointment/components/PatientHeader";

import ChiefComplaints
    from "../../DoctorAppointment/sections/ChiefComplaints";

import PatientHistory
    from "../../DoctorAppointment/sections/PatientHistory";

import Reports
    from "../../DoctorAppointment/sections/Reports";

import Diagnosis
    from "../../DoctorAppointment/sections/Diagnosis";

import JuniorConsultationGrid
    from "./JuniorConsultationGrid";

import JuniorVitals
    from "./JuniorVitals";

import {
    showErrorToast,
    showSuccessToast,
} from "../../../../utils/showToast";
import { finishJuniorDoctorConsultation, loadJuniorDoctorAppointments } from "../../../redux/juniorDoctor/JuniorDoctorAppointmentThunk";

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
    const {
        finishConsultationLoading,
    } = useSelector(
        (state) =>
            state.juniorDoctorAppointment
    );
    const dispatch = useDispatch();

    const sectionTopRef =
        useRef(null);
    // =====================================================
    // CONSULTATION TIMER
    // =====================================================

    const CONSULTATION_DURATION =
        15 * 60;

    const [
        consultationTimeLeft,
        setConsultationTimeLeft,
    ] = useState(
        CONSULTATION_DURATION
    );

    const [
        consultationTimerStarted,
        setConsultationTimerStarted,
    ] = useState(false);

    const consultationTimerRef =
        useRef(null);
    // =====================================================
    // START CONSULTATION TIMER
    // JUNIOR DOCTOR → CHIEF COMPLAINTS
    // =====================================================

    useEffect(() => {

        if (
            activeSection !== "complaints"
        ) {
            return;
        }

        if (
            consultationTimerStarted
        ) {
            return;
        }

        console.log(
            "⏱️ Junior Doctor consultation timer started from Chief Complaints"
        );

        setConsultationTimerStarted(
            true
        );

    }, [
        activeSection,
        consultationTimerStarted,
    ]);
    // =====================================================
    // CONSULTATION TIMER COUNTDOWN
    // =====================================================

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

    // =====================================================
    // RESET TIMER FOR NEW PATIENT
    // =====================================================

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
    // =====================================================
    // SCROLL WHEN SECTION CHANGES
    // =====================================================
    const handleFinishConsultation = async () => {

        const appointmentId =
            selectedPatient?.id ||
            selectedPatient?.appointment_id;


        if (!appointmentId) {

            showErrorToast(
                "Unable to finish consultation",
                "Appointment ID is missing."
            );

            return;

        }


        try {

            const response =
                await dispatch(
                    finishJuniorDoctorConsultation(
                        appointmentId
                    )
                ).unwrap();


            showSuccessToast(
                response?.message ||
                "Consultation completed successfully."
            );


            // =========================================
            // RELOAD TODAY'S APPOINTMENTS
            // =========================================

            dispatch(
                loadJuniorDoctorAppointments(
                    "today"
                )
            );


            // =========================================
            // RETURN TO OVERVIEW
            // =========================================

            setActiveSection(
                "overview"
            );


        } catch (error) {

            console.error(
                "Finish consultation failed:",
                error
            );


            const message =
                error?.message ||
                error?.detail ||
                error?.error ||
                "Chief Complaints and Diagnosis must be completed before finishing the consultation.";


            showErrorToast(
                "Unable to finish consultation",
                message
            );

        }

    };
    useEffect(() => {

        if (!activeSection) {
            return;
        }

        requestAnimationFrame(() => {

            sectionTopRef.current?.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        });

    }, [
        activeSection,
    ]);


    // =====================================================
    // GO TO SECTION
    // =====================================================

    const goToSection = (
        section
    ) => {

        setActiveSection(
            section
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        patientLoading &&
        !selectedPatient
    ) {

        return (
            <div
                className="
                    h-[720px]
                    min-h-0
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


    // =====================================================
    // NO PATIENT
    // =====================================================

    if (!selectedPatient) {

        return (
            <div
                className="
                    h-[720px]
                    min-h-0
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
            className="
                h-[720px]
                min-h-0
                min-w-0
                overflow-hidden
                rounded-[30px]
                border
                border-[#E7DBD3]
                bg-white
                flex
                flex-col
            "
        >

            {/* ================================================= */}
            {/* PATIENT PROFILE CONTENT */}
            {/* ================================================= */}

            <div
                ref={sectionTopRef}
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-6
                    pt-6
                    pb-6
                    hide-scrollbar
                "
            >

                {/* ============================================= */}
                {/* PATIENT HEADER */}
                {/* ============================================= */}

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


                {/* ============================================= */}
                {/* OVERVIEW */}
                {/* ============================================= */}

                {activeSection === "overview" && (

                    <div className="mt-5">

                        {/* ===================================== */}
                        {/* VITALS */}
                        {/* ===================================== */}

                        <JuniorVitals
                            patientId={
                                selectedPatient?.patient_id ||
                                patientProfile?.id ||
                                selectedPatient?.id
                            }
                        />


                        {/* ===================================== */}
                        {/* CONSULTATION SECTION CARDS */}
                        {/* ===================================== */}

                        <div className="mt-5">

                            <JuniorConsultationGrid
                                activeSection={
                                    activeSection
                                }

                                setActiveSection={
                                    setActiveSection
                                }
                            />

                        </div>

                    </div>

                )}


                {/* ============================================= */}
                {/* CHIEF COMPLAINTS */}
                {/* ============================================= */}

                {activeSection === "complaints" && (

                    <div className="mt-5">

                        <ChiefComplaints
                            appointmentId={
                                selectedPatient?.id
                            }

                            consultationTimerStarted={
                                consultationTimerStarted
                            }

                            consultationTimeLeft={
                                consultationTimeLeft
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

                    </div>

                )}


                {/* ============================================= */}
                {/* PATIENT HISTORY */}
                {/* ============================================= */}

                {activeSection === "history" && (

                    <div className="mt-5">

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

                            onContinue={() =>
                                goToSection(
                                    "reports"
                                )
                            }
                        />

                    </div>

                )}


                {/* ============================================= */}
                {/* REPORTS */}
                {/* ============================================= */}

                {activeSection === "reports" && (

                    <div className="mt-5">

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
                                    "history"
                                )
                            }

                            onContinue={() =>
                                goToSection(
                                    "diagnosis"
                                )
                            }
                        />

                    </div>

                )}


                {/* ============================================= */}
                {/* DIAGNOSIS */}
                {/* ============================================= */}

                {activeSection === "diagnosis" && (

                    <div className="mt-5">

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
                                    "reports"
                                )
                            }

                            onContinue={() =>
                                goToSection(
                                    "overview"
                                )
                            }
                        />

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* FINISH CONSULTATION FOOTER */}
            {/* ================================================= */}

            <div
                className="
                    shrink-0
                    border-t
                    border-[#EFE5DE]
                    bg-white
                    px-6
                    py-4
                "
            >



                <button
                    type="button"
                    disabled={finishConsultationLoading}
                    onClick={handleFinishConsultation}
                    className="
        flex
        h-[50px]
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-[#8B5037]
        text-[15px]
        font-semibold
        text-white
        transition
        hover:bg-[#79432F]
        active:scale-[0.99]
        disabled:cursor-not-allowed
        disabled:opacity-60
    "
                >

                    <HiOutlineArrowRightOnRectangle
                        size={20}
                    />

                    <span>
                        {finishConsultationLoading
                            ? "Finishing Consultation..."
                            : "Finish Consultation"
                        }
                    </span>

                </button>



            </div>

        </div>
    );
};


export default JuniorPatientProfile;