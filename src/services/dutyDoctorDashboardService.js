
import { submitPainAssessment,
    getPainAssessmentsCompleted,
    getScheduleOverview,
    getPatientsTended,
    getDutyDoctorPatientQueue,
    getPatientAssessmentDetails,
 } from "../api/dutyDoctorDashboardApi";


/**
 * ==========================================
 * DASHBOARD
 * ==========================================
 */

export const fetchPainAssessmentsCompleted =
    async (period = "week") => {

        const response =
            await getPainAssessmentsCompleted(
                period
            );

        return response.data;

    };


export const fetchScheduleOverview =
    async (period = "week") => {

        const response =
            await getScheduleOverview(
                period
            );

        return response.data;

    };


export const fetchPatientsTended =
    async (period = "week") => {

        const response =
            await getPatientsTended(
                period
            );

        return response.data;

    };


/**
 * ==========================================
 * PATIENT QUEUE
 * ==========================================
 */

export const fetchDutyDoctorPatientQueue =
    async () => {

        const response =
            await getDutyDoctorPatientQueue();

        return response.data;

    };


/**
 * ==========================================
 * PATIENT ASSESSMENT
 * ==========================================
 */

export const fetchPatientAssessmentDetails =
    async (bookingId) => {

        const response =
            await getPatientAssessmentDetails(
                bookingId
            );

        return response.data;

    };


/**
 * ==========================================
 * SUBMIT ASSESSMENT
 * ==========================================
 */

export const savePainAssessment =
    async (payload) => {

        const response =
            await submitPainAssessment(
                payload
            );

        return response.data;

    };