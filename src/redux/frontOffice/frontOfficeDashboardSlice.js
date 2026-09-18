import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  loadFrontOfficeDashboard,
  loadFrontOfficeAppointments,
  loadFrontOfficeSalesDetails,
} from "./frontOfficeDashboardThunk";


const initialState = {

  appointments: null,

  insurance: null,

  packages: null,

  medicalCamp: null,

  referrals: null,

  billing: null,

  transactions: [],

  pendingActions: null,
  salesDetails: null,
  salesDetailsLoading: false,
  salesDetailsError: null,

  period: "week",

  loading: false,

  error: null,

};


const frontOfficeDashboardSlice =
  createSlice({

    name: "frontOfficeDashboard",

    initialState,

    reducers: {

      setFrontOfficePeriod: (
        state,
        action
      ) => {

        state.period =
          action.payload;

      },

      clearFrontOfficeDashboard: (
        state
      ) => {

        state.appointments = null;

        state.insurance = null;

        state.packages = null;

        state.medicalCamp = null;

        state.referrals = null;

        state.billing = null;

        state.transactions = [];

        state.pendingActions = null;

        state.error = null;

      },

    },

    extraReducers: (builder) => {

      // ======================================
      // COMPLETE DASHBOARD
      // ======================================

      builder

        .addCase(
          loadFrontOfficeDashboard.pending,
          (state) => {

            state.loading = true;
            state.error = null;

          }
        )



        .addCase(
          loadFrontOfficeDashboard.fulfilled,
          (state, action) => {

            state.loading = false;

            const data =
              action.payload || {};

            console.log(
              "🔥 DASHBOARD REDUX PAYLOAD:",
              data
            );

            state.appointments =
              data.appointments;

            state.insurance =
              data.insurance;

            state.packages =
              data.packages;

            state.medicalCamp =
              data.medicalCamp;

            state.referrals =
              data.referrals;

            state.billing =
              data.billing;

            state.transactions =
              data.transactions?.data ||
              [];

            state.pendingActions =
              data.pendingActions;
          }
        )


        // ======================================
        // UPCOMING APPOINTMENTS PERIOD CHANGE
        // ======================================
        // ==========================================
        // SALES DETAILS
        // ==========================================

        .addCase(
          loadFrontOfficeSalesDetails.pending,
          (state) => {

            state.salesDetailsLoading = true;
            state.salesDetailsError = null;

          }
        )

        .addCase(
          loadFrontOfficeSalesDetails.fulfilled,
          (
            state,
            action
          ) => {

            state.salesDetailsLoading = false;

            state.salesDetails =
              action.payload || null;

          }
        )

        .addCase(
          loadFrontOfficeSalesDetails.rejected,
          (
            state,
            action
          ) => {

            state.salesDetailsLoading = false;

            state.salesDetailsError =
              action.payload ||
              "Failed to load sales details.";

          }
        )
      builder

        .addCase(
          loadFrontOfficeAppointments.pending,
          (state) => {

            state.loading = true;
            state.error = null;

          }
        )

        .addCase(
          loadFrontOfficeAppointments.fulfilled,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.appointments =
              action.payload;

          }
        )

        .addCase(
          loadFrontOfficeAppointments.rejected,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload ||
              "Failed to load upcoming appointments.";

          }
        );

    },

  });


export const {
  setFrontOfficePeriod,
  clearFrontOfficeDashboard,
} =
  frontOfficeDashboardSlice.actions;


export default frontOfficeDashboardSlice.reducer;