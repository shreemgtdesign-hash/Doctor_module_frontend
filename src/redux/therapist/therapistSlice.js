import { createSlice } from "@reduxjs/toolkit";

import {
    getTherapistDashboard,
    loadTherapiesPerformed,
    loadTherapistAilments,
    loadTherapistPatients,
    loadTherapistSales,
    loadTherapistAppointments,
    completeTherapistAppointments
} from "./therapistThunk";


const initialState = {

    loading: false,

    therapies: {
        total: 0,
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

};


const therapistDashboardSlice = createSlice({

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
                (state, action) => {

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
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload;

                }
            )


            // =================================
            // THERAPIES
            // =================================

            .addCase(
                loadTherapiesPerformed.fulfilled,
                (state, action) => {

                    state.therapies =
                        action.payload;

                }
            )


            // =================================
            // AILMENTS
            // =================================

            .addCase(
                loadTherapistAilments.fulfilled,
                (state, action) => {

                    state.ailments =
                        action.payload;

                }
            )


            // =================================
            // PATIENTS
            // =================================

            .addCase(
                loadTherapistPatients.fulfilled,
                (state, action) => {

                    state.patients =
                        action.payload;

                }
            )


            // =================================
            // SALES
            // =================================

            .addCase(
                loadTherapistSales.fulfilled,
                (state, action) => {

                    state.sales =
                        action.payload;

                }
            )


            // =================================
            // APPOINTMENTS
            // =================================

            .addCase(
                loadTherapistAppointments.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                loadTherapistAppointments.fulfilled,
                (state, action) => {

                    state.loading = false;

                    console.log(
                        "APPOINTMENTS PAYLOAD:",
                        action.payload
                    );

                    state.appointments =
                        action.payload?.data || [];

                    state.count =
                        action.payload?.count ||
                        action.payload?.data?.length ||
                        0;

                }
            )

            .addCase(
                loadTherapistAppointments.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error = action.payload;

                    state.appointments = [];
                    state.count = 0;

                }
            )
            .addCase(
                completeTherapistAppointments.pending,
                (state) => {
                    state.completingAppointments = true;
                }
            )

            .addCase(
                completeTherapistAppointments.fulfilled,
                (state) => {
                    state.completingAppointments = false;
                }
            )

            .addCase(
                completeTherapistAppointments.rejected,
                (state, action) => {
                    state.completingAppointments = false;

                    state.error = action.payload;
                }
            );

    },

});


export default therapistDashboardSlice.reducer;