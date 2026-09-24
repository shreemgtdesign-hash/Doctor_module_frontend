import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchCorporateDashboard,
  fetchCorporateEvents,
} from "../../services/corporateDashboardService";


// ==========================================
// LOAD CORPORATE DASHBOARD
// ==========================================

export const loadCorporateDashboard =
  createAsyncThunk(
    "corporateDashboard/loadDashboard",

    async (_, { rejectWithValue }) => {
      try {
        return await fetchCorporateDashboard();

      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
            error.message ||
            "Failed to load corporate dashboard."
        );
      }
    }
  );


// ==========================================
// LOAD CORPORATE EVENTS
// ==========================================

export const loadCorporateEvents =
  createAsyncThunk(
    "corporateDashboard/loadEvents",

    async (
      month,
      { rejectWithValue }
    ) => {
      try {
        return await fetchCorporateEvents(
          month
        );

      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
            error.message ||
            "Failed to load corporate events."
        );
      }
    }
  );