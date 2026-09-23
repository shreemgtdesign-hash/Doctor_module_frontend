import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchFrontOfficeDashboard,
  fetchFrontOfficeSalesDetails,
  fetchFrontOfficeUpcomingAppointments,
  fetchFrontOfficeMedicalCamp,
  fetchFrontOfficeReferrals,
  fetchFrontOfficePendingActions,
  fetchFrontOfficeRecentTransactions,
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
// LOAD MEDICAL CAMP BY PERIOD
// ==========================================

export const loadFrontOfficeMedicalCamp =
  createAsyncThunk(
    "frontOffice/loadMedicalCamp",

    async (
      period = "week",
      { rejectWithValue }
    ) => {
      try {

        return await fetchFrontOfficeMedicalCamp(
          period
        );

      } catch (error) {

        return rejectWithValue(
          error.response?.data ||
          error.message ||
          "Failed to load medical camp."
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
      { rejectWithValue }
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


// ==========================================
// LOAD REFERRALS BY PERIOD
// ==========================================

export const loadFrontOfficeReferrals =
  createAsyncThunk(
    "frontOffice/loadReferrals",

    async (
      period = "till_date",
      { rejectWithValue }
    ) => {

      try {

        return await fetchFrontOfficeReferrals(
          period
        );

      } catch (error) {

        return rejectWithValue(
          error.response?.data ||
          error.message ||
          "Failed to load referrals."
        );

      }

    }
  ); export const loadFrontOfficePendingActions =
    createAsyncThunk(
      "frontOffice/loadPendingActions",

      async (
        period = "today",
        { rejectWithValue }
      ) => {

        try {

          return await fetchFrontOfficePendingActions(
            period
          );

        } catch (error) {

          return rejectWithValue(
            error.response?.data ||
            error.message ||
            "Failed to load pending actions."
          );

        }
      }
    );



// ==========================================
// LOAD RECENT TRANSACTIONS BY PERIOD
// ==========================================

export const loadFrontOfficeRecentTransactions =
  createAsyncThunk(
    "frontOffice/loadRecentTransactions",

    async (
      period = "today",
      { rejectWithValue }
    ) => {

      try {

        return await fetchFrontOfficeRecentTransactions(
          period
        );

      } catch (error) {

        return rejectWithValue(
          error.response?.data ||
          error.message ||
          "Failed to load recent transactions."
        );

      }
    }
  );