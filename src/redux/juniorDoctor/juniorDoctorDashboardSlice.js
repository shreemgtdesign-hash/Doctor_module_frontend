import { createSlice } from "@reduxjs/toolkit";

import {
    loadJuniorDoctorScheduleOverview,
    loadJuniorDoctorConsultationsHistory,
    loadJuniorDoctorWellness,
    loadJuniorDoctorBeauty,
    loadJuniorDoctorAilments,
} from "./juniorDoctorDashboardThunk";


const initialState = {

    // =====================================================
    // SCHEDULE OVERVIEW
    // =====================================================
    scheduleOverview: {
        today: null,
        thisweek: null,
        thismonth: null,
    },

    scheduleOverviewLoading: false,
    scheduleOverviewError: null,


    // =====================================================
    // CONSULTATIONS HISTORY
    // =====================================================
    consultationsHistory: {
        today: null,
        thisweek: null,
        thismonth: null,
    },

    consultationsHistoryLoading: false,
    consultationsHistoryError: null,


    // =====================================================
    // WELLNESS
    // =====================================================
    wellness: {
        today: null,
        thisweek: null,
        thismonth: null,
    },

    wellnessLoading: false,
    wellnessError: null,


    // =====================================================
    // BEAUTY
    // =====================================================
    beauty: {
        today: null,
        thisweek: null,
        thismonth: null,
    },

    beautyLoading: false,
    beautyError: null,


    // =====================================================
    // AILMENTS
    // =====================================================
    ailments: {
        today: null,
        thisweek: null,
        thismonth: null,
    },

    ailmentsLoading: false,
    ailmentsError: null,
};


const juniorDoctorDashboardSlice = createSlice({

    name: "juniorDoctorDashboard",

    initialState,

    reducers: {

        // -------------------------------------------------
        // CLEAR ALL DASHBOARD DATA
        // -------------------------------------------------
        clearJuniorDoctorDashboard: (state) => {

            state.scheduleOverview = {
                today: null,
                thisweek: null,
                thismonth: null,
            };

            state.consultationsHistory = {
                today: null,
                thisweek: null,
                thismonth: null,
            };

            state.wellness = {
                today: null,
                thisweek: null,
                thismonth: null,
            };

            state.beauty = {
                today: null,
                thisweek: null,
                thismonth: null,
            };

            state.ailments = {
                today: null,
                thisweek: null,
                thismonth: null,
            };

            state.scheduleOverviewError = null;
            state.consultationsHistoryError = null;
            state.wellnessError = null;
            state.beautyError = null;
            state.ailmentsError = null;
        },

    },


    extraReducers: (builder) => {

        // =================================================
        // SCHEDULE OVERVIEW
        // =================================================

        builder

            .addCase(
                loadJuniorDoctorScheduleOverview.pending,
                (state) => {

                    state.scheduleOverviewLoading = true;
                    state.scheduleOverviewError = null;
                }
            )

            .addCase(
                loadJuniorDoctorScheduleOverview.fulfilled,
                (state, action) => {

                    state.scheduleOverviewLoading = false;

                    const period =
                        action.meta.arg || "today";

                    state.scheduleOverview[period] =
                        action.payload?.data || null;
                }
            )

            .addCase(
                loadJuniorDoctorScheduleOverview.rejected,
                (state, action) => {

                    state.scheduleOverviewLoading = false;

                    state.scheduleOverviewError =
                        action.payload ||
                        action.error?.message ||
                        "Failed to load schedule overview.";
                }
            );


        // =================================================
        // CONSULTATIONS HISTORY
        // =================================================

        builder

            .addCase(
                loadJuniorDoctorConsultationsHistory.pending,
                (state) => {

                    state.consultationsHistoryLoading = true;
                    state.consultationsHistoryError = null;
                }
            )

            .addCase(
                loadJuniorDoctorConsultationsHistory.fulfilled,
                (state, action) => {

                    state.consultationsHistoryLoading = false;

                    const period =
                        action.meta.arg || "today";

                    state.consultationsHistory[period] =
                        action.payload?.data || null;
                }
            )

            .addCase(
                loadJuniorDoctorConsultationsHistory.rejected,
                (state, action) => {

                    state.consultationsHistoryLoading = false;

                    state.consultationsHistoryError =
                        action.payload ||
                        action.error?.message ||
                        "Failed to load consultations history.";
                }
            );


        // =================================================
        // WELLNESS
        // =================================================

        builder

            .addCase(
                loadJuniorDoctorWellness.pending,
                (state) => {

                    state.wellnessLoading = true;
                    state.wellnessError = null;
                }
            )

            .addCase(
                loadJuniorDoctorWellness.fulfilled,
                (state, action) => {

                    state.wellnessLoading = false;

                    const period =
                        action.meta.arg || "today";

                    state.wellness[period] =
                        action.payload?.data || null;
                }
            )

            .addCase(
                loadJuniorDoctorWellness.rejected,
                (state, action) => {

                    state.wellnessLoading = false;

                    state.wellnessError =
                        action.payload ||
                        action.error?.message ||
                        "Failed to load wellness summary.";
                }
            );


        // =================================================
        // BEAUTY
        // =================================================

        builder

            .addCase(
                loadJuniorDoctorBeauty.pending,
                (state) => {

                    state.beautyLoading = true;
                    state.beautyError = null;
                }
            )

            .addCase(
                loadJuniorDoctorBeauty.fulfilled,
                (state, action) => {

                    state.beautyLoading = false;

                    const period =
                        action.meta.arg || "today";

                    state.beauty[period] =
                        action.payload?.data || null;
                }
            )

            .addCase(
                loadJuniorDoctorBeauty.rejected,
                (state, action) => {

                    state.beautyLoading = false;

                    state.beautyError =
                        action.payload ||
                        action.error?.message ||
                        "Failed to load beauty summary.";
                }
            );


        // =================================================
        // AILMENTS
        // =================================================

        builder

            .addCase(
                loadJuniorDoctorAilments.pending,
                (state) => {

                    state.ailmentsLoading = true;
                    state.ailmentsError = null;
                }
            )

            .addCase(
                loadJuniorDoctorAilments.fulfilled,
                (state, action) => {

                    state.ailmentsLoading = false;

                    const period =
                        action.meta.arg || "today";

                    state.ailments[period] =
                        action.payload?.data || null;
                }
            )

            .addCase(
                loadJuniorDoctorAilments.rejected,
                (state, action) => {

                    state.ailmentsLoading = false;

                    state.ailmentsError =
                        action.payload ||
                        action.error?.message ||
                        "Failed to load ailments addressed.";
                }
            );
    },
});


export const {
    clearJuniorDoctorDashboard,
} = juniorDoctorDashboardSlice.actions;


export default juniorDoctorDashboardSlice.reducer;