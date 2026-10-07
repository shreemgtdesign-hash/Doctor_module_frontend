import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import JuniorDoctorConsultationTimer
    from "./JuniorDoctorConsultationTimer";

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

import {
    finishJuniorDoctorConsultation,
    loadJuniorDoctorAppointments,
} from "../../../redux/juniorDoctor/JuniorDoctorAppointmentThunk";

import ConsultationSectionNav
    from "../../DoctorAppointment/components/ConsultationSectionNav";


const JuniorPatientProfile = ({
    activeSection,
    setActiveSection,
}) => {

    const JUNIOR_DOCTOR_DURATION = 15 * 60;

    const [
        juniorDoctorTimeLeft,
        setJuniorDoctorTimeLeft,
    ] = useState(
        JUNIOR_DOCTOR_DURATION
    );

    const [
        juniorDoctorTimerStarted,
        setJuniorDoctorTimerStarted,
    ] = useState(false);

    const juniorDoctorTimerRef =
        useRef(null);


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
            juniorDoctorTimerStarted
        ) {
            return;
        }


        setJuniorDoctorTimerStarted(true);

    }, [
        activeSection,
        juniorDoctorTimerStarted,
    ]);


    // =====================================================
    // CONSULTATION TIMER COUNTDOWN
    // =====================================================

    useEffect(() => {

        if (!juniorDoctorTimerStarted) {
            return;
        }


        if (
            juniorDoctorTimeLeft <= 0
        ) {
            return;
        }


        juniorDoctorTimerRef.current =
            setInterval(() => {

                setJuniorDoctorTimeLeft(
                    (previousTime) => {

                        if (previousTime <= 1) {

                            clearInterval(
                                juniorDoctorTimerRef.current
                            );

                            return 0;
                        }


                        return previousTime - 1;
                    }
                );

            }, 1000);


        return () => {

            if (
                juniorDoctorTimerRef.current
            ) {

                clearInterval(
                    juniorDoctorTimerRef.current
                );

            }

        };

    }, [
        juniorDoctorTimerStarted,
        juniorDoctorTimeLeft,
    ]);


    // =====================================================
    // RESET TIMER FOR NEW PATIENT
    // =====================================================

    const previousJuniorPatientIdRef =
        useRef(null);


    useEffect(() => {

        const currentPatientId =
            selectedPatient?.id;


        if (!currentPatientId) {
            return;
        }


        if (
            previousJuniorPatientIdRef.current ===
            currentPatientId
        ) {
            return;
        }


        previousJuniorPatientIdRef.current =
            currentPatientId;


        if (
            juniorDoctorTimerRef.current
        ) {

            clearInterval(
                juniorDoctorTimerRef.current
            );

        }


        setJuniorDoctorTimerStarted(false);


        setJuniorDoctorTimeLeft(
            JUNIOR_DOCTOR_DURATION
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
            {/* PATIENT HEADER */}
            {/* ================================================= */}

            <div
                className="
                    relative
                   
                    shrink-0
                    bg-white
                "
            >

                <PatientHeader
                    patient={patientProfile}
                    wellness={patientWellness}
                    appointment={selectedPatient}
                    role="junior-doctor"
                    juniorDoctorTimer={
                        juniorDoctorTimerStarted ? (
                            <JuniorDoctorConsultationTimer
                                timeLeft={
                                    juniorDoctorTimeLeft
                                }
                            />
                        ) : null
                    }
                />

            </div>


            {/* ================================================= */}
            {/* PATIENT PROFILE CONTENT / SCROLL AREA */}
            {/* ================================================= */}

            <div
                ref={sectionTopRef}
                className="
                    min-h-0
                    min-w-0
                    w-full
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    px-6
                    pb-6
                    hide-scrollbar
                "
            >

                {/* ============================================= */}
                {/* STICKY CONSULTATION NAV */}
                {/* ============================================= */}

                <div
                    className="
                        sticky
                        top-0
                        bg-white
                        
                    "
                >

                    <ConsultationSectionNav
                        activeSection={
                            activeSection
                        }
                        setActiveSection={
                            setActiveSection
                        }
                        role="junior-doctor"
                    />

                </div>


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
                                juniorDoctorTimerStarted
                            }

                            consultationTimeLeft={
                                juniorDoctorTimeLeft
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

                            consultationTimerStarted={
                                juniorDoctorTimerStarted
                            }

                            consultationTimeLeft={
                                juniorDoctorTimeLeft
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

                            consultationTimerStarted={
                                juniorDoctorTimerStarted
                            }

                            consultationTimeLeft={
                                juniorDoctorTimeLeft
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

                            consultationTimerStarted={
                                juniorDoctorTimerStarted
                            }

                            consultationTimeLeft={
                                juniorDoctorTimeLeft
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
                    disabled={
                        finishConsultationLoading
                    }
                    onClick={
                        handleFinishConsultation
                    }
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
                        {
                            finishConsultationLoading
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