import { createSlice } from "@reduxjs/toolkit";

import {
  loadCorporateDashboard,
  loadCorporateEvents,
} from "./corporateDashboardThunk";


const initialState = {
  // Dashboard overview
  upcomingEvents: [],

  // Month events
  events: [],
  eventsCount: 0,
  currentMonth: "",

  loading: false,
  eventsLoading: false,

  error: null,
  eventsError: null,
};


const corporateDashboardSlice =
  createSlice({
    name: "corporateDashboard",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

      // =====================================
      // DASHBOARD
      // =====================================

      builder

        .addCase(
          loadCorporateDashboard.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          loadCorporateDashboard.fulfilled,
          (state, action) => {
            state.loading = false;

            state.upcomingEvents =
              action.payload?.upcoming_events ||
              [];
          }
        )

        .addCase(
          loadCorporateDashboard.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to load corporate dashboard.";
          }
        );


      // =====================================
      // EVENTS
      // =====================================

      builder

        .addCase(
          loadCorporateEvents.pending,
          (state) => {
            state.eventsLoading = true;
            state.eventsError = null;
          }
        )

        .addCase(
          loadCorporateEvents.fulfilled,
          (state, action) => {
            state.eventsLoading = false;

            state.events =
              action.payload?.data || [];

            state.eventsCount =
              action.payload?.count || 0;

            state.currentMonth =
              action.payload?.currentMonth || "";
          }
        )

        .addCase(
          loadCorporateEvents.rejected,
          (state, action) => {
            state.eventsLoading = false;

            state.eventsError =
              action.payload ||
              "Failed to load corporate events.";
          }
        );
    },
  });


export default corporateDashboardSlice.reducer;