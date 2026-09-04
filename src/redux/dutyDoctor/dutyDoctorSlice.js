import {
    createSlice,
} from "@reduxjs/toolkit";

import {
    loadDutyDoctorDashboard,
    loadScheduleOverview,
    loadPatientsTended,
    loadDutyDoctorPatientQueue,
    loadPatientAssessment,
    submitDutyDoctorPainAssessment,
} from "./dutyDoctorThunk";


const initialState = {

    // ==========================================
    // DASHBOARD
    // ==========================================

    painAssessments: {
        total_completed: 0,
        growth_percentage: "+0.0%",
        comparison_label:
            "Compared to last week",
        breakdown_by_category: {},
        category_list: [],
        treatment_list: [],
    },

    scheduleOverview: {
        total_appointments: 0,
        label: "0 Total Appointments",
    },

    patientsTended: {
        total_patients: 0,
        label: "0 Total Patients",
    },


    // ==========================================
    // PATIENT QUEUE
    // ==========================================

    patientQueue: [],
    patientQueueCount: 0,


    // ==========================================
    // CURRENT ASSESSMENT
    // ==========================================

    assessment: null,


    // ==========================================
    // LOADING
    // ==========================================

    loadingDashboard: false,
    loadingQueue: false,
    loadingAssessment: false,
    submittingAssessment: false,


    // ==========================================
    // ERROR
    // ==========================================

    error: null,
    assessmentError: null,
    submitError: null,


    // ==========================================
    // SUCCESS
    // ==========================================

    submitSuccess: false,
};


const dutyDoctorSlice = createSlice({

    name: "dutyDoctor",

    initialState,

    reducers: {

        clearDutyDoctorError: (
            state
        ) => {

            state.error = null;

        },


        clearAssessmentError: (
            state
        ) => {

            state.assessmentError = null;

        },


        clearSubmitSuccess: (
            state
        ) => {

            state.submitSuccess = false;

        },


        clearAssessment: (
            state
        ) => {

            state.assessment = null;

        },

    },


    extraReducers: (builder) => {

        builder


            // ==================================
            // DASHBOARD
            // ==================================

            .addCase(
                loadDutyDoctorDashboard.pending,
                (state) => {

                    state.loadingDashboard =
                        true;

                    state.error = null;

                }
            )


            .addCase(
                loadDutyDoctorDashboard.fulfilled,
                (
                    state,
                    action
                ) => {

                    state.loadingDashboard =
                        false;

                    state.painAssessments =
                        action.payload
                            .painAssessments;

                    state.scheduleOverview =
                        action.payload
                            .scheduleOverview;

                    state.patientsTended =
                        action.payload
                            .patientsTended;

                }
            )


            .addCase(
                loadDutyDoctorDashboard.rejected,
                (
                    state,
                    action
                ) => {

                    state.loadingDashboard =
                        false;

                    state.error =
                        action.payload ||
                        "Failed to load dashboard";

                }
            )


            // ==================================
            // PATIENT QUEUE
            // ==================================

            .addCase(
                loadDutyDoctorPatientQueue.pending,
                (state) => {

                    state.loadingQueue =
                        true;

                }
            )


            .addCase(
                loadDutyDoctorPatientQueue.fulfilled,
                (
                    state,
                    action
                ) => {

                    state.loadingQueue =
                        false;

                    state.patientQueue =
                        action.payload.data ||
                        [];

                    state.patientQueueCount =
                        action.payload.count ||
                        action.payload.total_patients ||
                        0;

                }
            )


            .addCase(
                loadDutyDoctorPatientQueue.rejected,
                (
                    state,
                    action
                ) => {

                    state.loadingQueue =
                        false;

                    state.error =
                        action.payload ||
                        "Failed to load patient queue";

                }
            )


            // ==================================
            // PATIENT ASSESSMENT
            // ==================================

            .addCase(
                loadPatientAssessment.pending,
                (state) => {

                    state.loadingAssessment =
                        true;

                    state.assessmentError =
                        null;

                }
            )


            .addCase(
                loadPatientAssessment.fulfilled,
                (
                    state,
                    action
                ) => {

                    state.loadingAssessment =
                        false;

                    state.assessment =
                        action.payload.data;

                }
            )


            .addCase(
                loadPatientAssessment.rejected,
                (
                    state,
                    action
                ) => {

                    state.loadingAssessment =
                        false;

                    state.assessmentError =
                        action.payload ||
                        "Failed to load assessment";

                }
            )


            // ==================================
            // SUBMIT ASSESSMENT
            // ==================================

            .addCase(
                submitDutyDoctorPainAssessment.pending,
                (state) => {

                    state.submittingAssessment =
                        true;

                    state.submitError =
                        null;

                    state.submitSuccess =
                        false;

                }
            )


            .addCase(
                submitDutyDoctorPainAssessment.fulfilled,
                (
                    state
                ) => {

                    state.submittingAssessment =
                        false;

                    state.submitSuccess =
                        true;

                }
            )


            .addCase(
                submitDutyDoctorPainAssessment.rejected,
                (
                    state,
                    action
                ) => {

                    state.submittingAssessment =
                        false;

                    state.submitError =
                        action.payload ||
                        "Failed to submit assessment";

                    state.submitSuccess =
                        false;

                }
            )

            // ==================================
            // SCHEDULE OVERVIEW
            // ==================================

            .addCase(
                loadScheduleOverview.pending,
                (state) => {

                    state.error = null;

                }
            )

            .addCase(
                loadScheduleOverview.fulfilled,
                (
                    state,
                    action
                ) => {

                    state.scheduleOverview =
                        action.payload.data ||
                        action.payload;

                }
            )

            .addCase(
                loadScheduleOverview.rejected,
                (
                    state,
                    action
                ) => {

                    state.error =
                        action.payload ||
                        "Failed to load schedule overview";

                }
            )


            // ==================================
            // PATIENTS TENDED TO
            // ==================================

            .addCase(
                loadPatientsTended.pending,
                (state) => {

                    state.error = null;

                }
            )

            .addCase(
                loadPatientsTended.fulfilled,
                (
                    state,
                    action
                ) => {

                    state.patientsTended =
                        action.payload.data ||
                        action.payload;

                }
            )

            .addCase(
                loadPatientsTended.rejected,
                (
                    state,
                    action
                ) => {

                    state.error =
                        action.payload ||
                        "Failed to load patients tended";

                }
            )

    },

});


export const {
    clearDutyDoctorError,
    clearAssessmentError,
    clearSubmitSuccess,
    clearAssessment,
} = dutyDoctorSlice.actions;


export default dutyDoctorSlice.reducer;