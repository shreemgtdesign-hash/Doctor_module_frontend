import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchFrontOfficeDashboard,
  
  fetchFrontOfficeUpcomingAppointments,
} from "../../services/frontOfficeDashboardService";


// ==========================================
// LOAD COMPLETE DASHBOARD
// ==========================================

export const loadFrontOfficeDashboard =
  createAsyncThunk(

    "frontOffice/loadDashboard",

    async (
      { period = "week" } = {},
      { rejectWithValue }
    ) => {

      try {

        return await fetchFrontOfficeDashboard(
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
// LOAD APPOINTMENTS BY PERIOD
// ==========================================



  export const loadFrontOfficeAppointments =
  createAsyncThunk(

    "frontOffice/loadAppointments",

    async (
      { period = "week" } = {},
      { rejectWithValue }
    ) => {

      try {

        return await fetchFrontOfficeUpcomingAppointments(
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