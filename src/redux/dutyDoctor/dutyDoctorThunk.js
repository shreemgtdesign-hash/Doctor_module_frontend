import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    fetchPainAssessmentsCompleted,
    fetchScheduleOverview,
    fetchPatientsTended,
    fetchDutyDoctorPatientQueue,
    fetchPatientAssessmentDetails,
    savePainAssessment,
} from "../../services/dutyDoctorDashboardService";


// ==========================================
// PAIN ASSESSMENTS COMPLETED
// ==========================================

export const loadPainAssessmentsCompleted =
    createAsyncThunk(

        "dutyDoctor/loadPainAssessmentsCompleted",

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                return await fetchPainAssessmentsCompleted(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }
    );


// ==========================================
// SCHEDULE OVERVIEW
// ==========================================

export const loadScheduleOverview =
    createAsyncThunk(

        "dutyDoctor/loadScheduleOverview",

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                return await fetchScheduleOverview(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }
    );


// ==========================================
// PATIENTS TENDED TO
// ==========================================

export const loadPatientsTended =
    createAsyncThunk(

        "dutyDoctor/loadPatientsTended",

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                return await fetchPatientsTended(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }
    );


// ==========================================
// PATIENT QUEUE
// ==========================================

export const loadDutyDoctorPatientQueue =
    createAsyncThunk(

        "dutyDoctor/loadPatientQueue",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                return await fetchDutyDoctorPatientQueue();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }
    );

    export const loadDutyDoctorDashboard =
    createAsyncThunk(

        "dutyDoctor/loadDashboard",

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                const [
                    painAssessments,
                    scheduleOverview,
                    patientsTended,
                ] = await Promise.all([

                    fetchPainAssessmentsCompleted(
                        period
                    ),

                    fetchScheduleOverview(
                        period
                    ),

                    fetchPatientsTended(
                        period
                    ),

                ]);


                return {

                    painAssessments:
                        painAssessments.data,

                    scheduleOverview:
                        scheduleOverview.data,

                    patientsTended:
                        patientsTended.data,

                };

            } catch (error) {

                return rejectWithValue(

                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load dashboard"

                );

            }

        }

    );


/**
 * ==========================================
 * LOAD PATIENT QUEUE
 * ==========================================
 */




/**
 * ==========================================
 * LOAD PATIENT ASSESSMENT
 * ==========================================
 */

export const loadPatientAssessment =
    createAsyncThunk(

        "dutyDoctor/loadPatientAssessment",

        async (
            bookingId,
            { rejectWithValue }
        ) => {

            try {

                return await
                    fetchPatientAssessmentDetails(
                        bookingId
                    );

            } catch (error) {

                return rejectWithValue(

                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load patient assessment"

                );

            }

        }

    );


/**
 * ==========================================
 * SUBMIT PAIN ASSESSMENT
 * ==========================================
 */

export const submitDutyDoctorPainAssessment =
    createAsyncThunk(

        "dutyDoctor/submitPainAssessment",

        async (
            payload,
            { rejectWithValue }
        ) => {

            try {

                return await
                    savePainAssessment(
                        payload
                    );

            } catch (error) {

                return rejectWithValue(

                    error.response?.data?.message ||
                    error.message ||
                    "Failed to submit pain assessment"

                );

            }

        }
    );