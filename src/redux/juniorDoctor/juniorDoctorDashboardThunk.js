import {
    createAsyncThunk,
} from "@reduxjs/toolkit";

import {
    fetchJuniorDoctorScheduleOverview,
    fetchJuniorDoctorConsultationsHistory,
    fetchJuniorDoctorWellnessSummary,
    fetchJuniorDoctorBeautySummary,
    fetchJuniorDoctorAilmentsAddressed,
} from "../../services/juniorDoctorDashboardService";


// ======================================================
// SCHEDULE OVERVIEW
// ======================================================

export const loadJuniorDoctorScheduleOverview =
    createAsyncThunk(
        "juniorDoctorDashboard/loadScheduleOverview",

        async (
            period = "today",
            { rejectWithValue }
        ) => {

            try {

                return await fetchJuniorDoctorScheduleOverview(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load schedule overview."
                );

            }

        }
    );


// ======================================================
// CONSULTATIONS HISTORY
// ======================================================

export const loadJuniorDoctorConsultationsHistory =
    createAsyncThunk(
        "juniorDoctorDashboard/loadConsultationsHistory",

        async (
            period = "today",
            { rejectWithValue }
        ) => {

            try {

                return await fetchJuniorDoctorConsultationsHistory(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load consultations history."
                );

            }

        }
    );


// ======================================================
// WELLNESS
// ======================================================

export const loadJuniorDoctorWellness =
    createAsyncThunk(
        "juniorDoctorDashboard/loadWellness",

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                return await fetchJuniorDoctorWellnessSummary(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load wellness summary."
                );

            }

        }
    );


// ======================================================
// BEAUTY
// ======================================================

export const loadJuniorDoctorBeauty =
    createAsyncThunk(
        "juniorDoctorDashboard/loadBeauty",

        async (
            period = "today",
            { rejectWithValue }
        ) => {

            try {

                return await fetchJuniorDoctorBeautySummary(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load beauty summary."
                );

            }

        }
    );


// ======================================================
// AILMENTS ADDRESSED
// ======================================================

export const loadJuniorDoctorAilments =
    createAsyncThunk(
        "juniorDoctorDashboard/loadAilments",

        async (
            period = "today",
            { rejectWithValue }
        ) => {

            try {

                return await fetchJuniorDoctorAilmentsAddressed(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load ailments addressed."
                );

            }

        }
    );