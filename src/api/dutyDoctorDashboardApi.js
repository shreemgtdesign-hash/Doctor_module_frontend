import api from "./axios";

/**
 * ==========================================
 * DASHBOARD APIs
 * ==========================================
 */

// Pain assessments completed
export const getPainAssessmentsCompleted = (period = "week") => {
    return api.get(
        `/duty-doctor/dashboard/pain-assessments-completed?period=${period}`
    );
};


// Schedule overview
export const getScheduleOverview = (period = "week") => {
    return api.get(
        `/duty-doctor/dashboard/schedule-overview?period=${period}`
    );
};


// Patients tended to
export const getPatientsTended = (period = "week") => {
    return api.get(
        `/duty-doctor/dashboard/patients-tended?period=${period}`
    );
};


/**
 * ==========================================
 * PATIENT QUEUE
 * ==========================================
 */

export const getDutyDoctorPatientQueue = () => {
    return api.get(
        "/duty-doctor/patient-queue"
    );
};


/**
 * ==========================================
 * PATIENT ASSESSMENT DETAILS
 * ==========================================
 */

export const getPatientAssessmentDetails = (
    bookingId
) => {

    return api.get(
        `/duty-doctor/patient-assessment/${bookingId}`
    );

};


/**
 * ==========================================
 * SUBMIT PAIN ASSESSMENT
 *
 * Same API for:
 *
 * PRE  -> assessment_type: "pre"
 * POST -> assessment_type: "post"
 * ==========================================
 */

export const submitPainAssessment = (
    payload
) => {

    return api.post(
        "/duty-doctor/pain-assessment",
        payload
    );

};