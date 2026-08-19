import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    fetchDashboard,
    fetchOverview,
    fetchConsultation,
    fetchAilments,
    fetchTherapiesDashboard,
    fetchMedicines,
    fetchWellness,
    fetchBeauty,
    fetchTherapyAppointments,
    fetchAilmentsList,
    fetchWellnessSummaryList,
    fetchBeautySummaryList,

} from "../../services/doctorDashboardService"; import { fetchConsultationHistoryList, fetchMedicinesPrescribedList } from "../../services/doctorAppointmentService";

export const getDashboard =
    createAsyncThunk(

        "dashboard/getDashboard",

        async (
            {
                doctorId,
                period,
            },
            { rejectWithValue }
        ) => {

            try {

                return await fetchDashboard(
                    doctorId,
                    period
                );

            } catch (err) {

                return rejectWithValue(
                    err.response?.data ||
                    err.message
                );

            }

        }
    );

export const loadConsultationHistoryList =
    createAsyncThunk(
        "dashboard/loadConsultationHistoryList",
        async (
            { doctorId, period },
            { rejectWithValue }
        ) => {
            try {
                return await fetchConsultationHistoryList(
                    doctorId,
                    period
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data || error.message
                );
            }
        }
    );

export const loadMedicinesPrescribedList =
  createAsyncThunk(
    "dashboard/loadMedicinesPrescribedList",

    async (
      period = "today",
      { rejectWithValue }
    ) => {
      try {
        return await fetchMedicinesPrescribedList(
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

export const loadConsultation = createAsyncThunk(
    "dashboard/loadConsultation",

    async ({ period }, thunkAPI) => {
        try {
            return await fetchConsultation(period);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const loadMedicines = createAsyncThunk(
    "dashboard/loadMedicines",

    async ({ period }, thunkAPI) => {
        try {
            return await fetchMedicines(

                period
            );
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const loadTherapiesDashboard = createAsyncThunk(
    "dashboard/loadTherapiesDashboard",

    async ({ period }, thunkAPI) => {
        try {
            return await fetchTherapiesDashboard(

                period
            );
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const loadAilments = createAsyncThunk(
    "dashboard/loadAilments",

    async ({ period }, thunkAPI) => {
        try {
            return await fetchAilments(

                period
            );
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const loadOverview = createAsyncThunk(
    "dashboard/loadOverview",

    async (
        { period },
        thunkAPI
    ) => {

        try {

            return await fetchOverview(
                period
            );

        } catch (err) {

            return thunkAPI.rejectWithValue(
                err.response?.data ||
                err.message
            );

        }

    }
);

export const loadWellness =
    createAsyncThunk(
        "dashboard/loadWellness",
        async (
            { period },
            { rejectWithValue }
        ) => {
            try {
                return await fetchWellness(

                    period
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data || error.message
                );
            }
        }
    );

export const loadBeauty =
    createAsyncThunk(
        "dashboard/loadBeauty",
        async (
            { period },
            { rejectWithValue }
        ) => {
            try {
                return await fetchBeauty(

                    period
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data || error.message
                );
            }
        }
    );


// ==========================
// Therapy Appointments Table
// ==========================

export const loadTherapyAppointments =
    createAsyncThunk(

        "dashboard/loadTherapyAppointments",

        async (_, { rejectWithValue }) => {

            try {

                return await fetchTherapyAppointments();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }

    );

export const loadAilmentsList = createAsyncThunk(
    "dashboard/loadAilmentsList",

    async ({ period }, { rejectWithValue }) => {
        try {
            return await fetchAilmentsList(period);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ==========================================
// WELLNESS SUMMARY LIST
// ==========================================

export const loadWellnessSummaryList =
  createAsyncThunk(
    "dashboard/loadWellnessSummaryList",

    async (
      period = "today",
      { rejectWithValue }
    ) => {

      try {

        return await fetchWellnessSummaryList(
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
// BEAUTY SUMMARY LIST
// ==========================================

export const loadBeautySummaryList =
  createAsyncThunk(
    "dashboard/loadBeautySummaryList",

    async (
      period = "today",
      { rejectWithValue }
    ) => {

      try {

        return await fetchBeautySummaryList(
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