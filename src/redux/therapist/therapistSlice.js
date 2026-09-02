import { createSlice } from "@reduxjs/toolkit";

import {
    getTherapistDashboard,
    loadTherapiesPerformed,
    loadTherapistAilments,
    loadTherapistPatients,
    loadTherapistAppointments,
    completeTherapistAppointments,
    loadTherapistScheduleOverview,
} from "./therapistThunk";


const initialState = {

    // =================================
    // SCHEDULE OVERVIEW
    // =================================

    scheduleOverview: {

        period: "today",

        total_patients: 0,

        men: 0,

        women: 0,

        children: 0,

    },


    loading: false,

    scheduleOverviewLoading: false,


    therapies: {
        total: 0,
        growth_percentage: "0%",
        comparison_label: "Compared to last week",
        breakdown: {},
        categories: [],
    },


    ailments: [],


    patients: {

        total_patients: 0,

        men: 0,

        women: 0,

        children: 0,

    },


    sales: {

        total_business_done: "₹0",

        total_amount: 0,

        trend: [],

    },


    // =================================
    // APPOINTMENTS
    // =================================

    appointments: [],

    completingAppointments: false,

    count: 0,


    error: null,

    scheduleOverviewError: null,

};


const therapistDashboardSlice =
    createSlice({

        name: "therapist",

        initialState,

        reducers: {},


        extraReducers: (builder) => {

            builder


                // =================================
                // FULL DASHBOARD
                // =================================

                .addCase(
                    getTherapistDashboard.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;

                    }
                )

                .addCase(
                    getTherapistDashboard.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.therapies =
                            action.payload.therapies;

                        state.ailments =
                            action.payload.ailments;

                        state.patients =
                            action.payload.patients;

                        state.sales =
                            action.payload.sales;

                    }
                )

                .addCase(
                    getTherapistDashboard.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.error =
                            action.payload;

                    }
                )


                // =================================
                // SCHEDULE OVERVIEW
                // =================================

                .addCase(
                    loadTherapistScheduleOverview.pending,
                    (state) => {

                        state.scheduleOverviewLoading =
                            true;

                        state.scheduleOverviewError =
                            null;

                    }
                )

                .addCase(
                    loadTherapistScheduleOverview.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.scheduleOverviewLoading =
                            false;

                        state.scheduleOverview =
                            action.payload;

                    }
                )

                .addCase(
                    loadTherapistScheduleOverview.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.scheduleOverviewLoading =
                            false;

                        state.scheduleOverviewError =
                            action.payload;

                    }
                )


                // =================================
                // THERAPIES
                // =================================

                .addCase(
                    loadTherapiesPerformed.pending,
                    (state) => {

                        state.loading = true;
                        state.error = null;

                    }
                )

                .addCase(
                    loadTherapiesPerformed.fulfilled,
                    (state, action) => {

                        state.loading = false;

                        state.therapies =
                            action.payload || {
                                total: 0,
                                growth_percentage: "0%",
                                comparison_label: "",
                                breakdown: {},
                                categories: [],
                            };

                    }
                )

                .addCase(
                    loadTherapiesPerformed.rejected,
                    (state, action) => {

                        state.loading = false;

                        state.error =
                            action.payload;

                    }
                )


                // =================================
                // AILMENTS
                // =================================

                .addCase(
                    loadTherapistAilments.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.ailments =
                            action.payload;

                    }
                )


                // =================================
                // PATIENTS
                // =================================

                .addCase(
                    loadTherapistPatients.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.patients =
                            action.payload;

                    }
                )


                // =================================
                // APPOINTMENTS - LOADING
                // =================================

                .addCase(
                    loadTherapistAppointments.pending,
                    (state) => {

                        state.loading = true;

                        state.error = null;

                    }
                )


                // =================================
                // APPOINTMENTS - SUCCESS
                // =================================

                .addCase(
                    loadTherapistAppointments.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        console.log(
                            "APPOINTMENTS PAYLOAD:",
                            action.payload
                        );

                        state.appointments =
                            action.payload?.data ||
                            [];

                        state.count =
                            action.payload?.count ||
                            action.payload?.data?.length ||
                            0;

                    }
                )


                // =================================
                // APPOINTMENTS - ERROR
                // =================================

                .addCase(
                    loadTherapistAppointments.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.loading = false;

                        state.error =
                            action.payload;

                        state.appointments = [];

                        state.count = 0;

                    }
                )


                // =================================
                // COMPLETE APPOINTMENT - LOADING
                // =================================

                .addCase(
                    completeTherapistAppointments.pending,
                    (state) => {

                        state.completingAppointments =
                            true;

                    }
                )


                // =================================
                // COMPLETE APPOINTMENT - SUCCESS
                // =================================

                .addCase(
                    completeTherapistAppointments.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.completingAppointments =
                            false;

                        const updatedAppointment =
                            action.payload?.data?.[0];

                        if (
                            !updatedAppointment?.id
                        ) {

                            return;

                        }


                        const index =
                            state.appointments.findIndex(
                                (appointment) =>
                                    (
                                        appointment.booking_id ||
                                        appointment.id
                                    ) ===
                                    updatedAppointment.id
                            );


                        if (index !== -1) {

                            state.appointments[index] = {

                                ...state.appointments[index],

                                ...updatedAppointment,

                                status:
                                    updatedAppointment.status,

                            };

                        }

                    }
                )


                // =================================
                // COMPLETE APPOINTMENT - ERROR
                // =================================

                .addCase(
                    completeTherapistAppointments.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.completingAppointments =
                            false;

                        state.error =
                            action.payload;

                    }
                );

        },

    });


export default therapistDashboardSlice.reducer;