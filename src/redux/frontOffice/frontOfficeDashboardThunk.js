import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchFrontOfficeDashboard,
  
  fetchFrontOfficeSalesDetails,
  
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

  // ==========================================
// SALES DETAILS
// ==========================================

export const loadFrontOfficeSalesDetails =
    createAsyncThunk(
        "frontOfficeDashboard/loadSalesDetails",

        async (
            period = "week",
            {
                rejectWithValue,
            }
        ) => {

            try {

                return await fetchFrontOfficeSalesDetails(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load sales details."
                );

            }

        }
    );