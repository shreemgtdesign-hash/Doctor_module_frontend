import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchDashboard,
  fetchOverview,
  fetchConsultation,
  fetchAilments,
  fetchTherapiesDashboard,
  fetchMedicines,
} from "../../services/doctorDashboardService";import { fetchConsultationHistoryList, fetchMedicinesPrescribedList } from "../../services/doctorAppointmentService";
import { getAilments, getConsultationHistory, getMedicines, getScheduleOverview } from "../../api/doctorDashboardApi";
import { getTherapies } from "../../api/doctorAppointmentApi";

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
            { doctorId, period },
            { rejectWithValue }
        ) => {
            try {
                return await fetchMedicinesPrescribedList(
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

export const loadConsultation = createAsyncThunk(
    "dashboard/loadConsultation",

    async ({ doctorId, period }, thunkAPI) => {
        try {
            return await fetchConsultation(
                doctorId,
                period
            );
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const loadMedicines = createAsyncThunk(
    "dashboard/loadMedicines",

    async ({ doctorId, period }, thunkAPI) => {
        try {
            return await fetchMedicines(
                doctorId,
                period
            );
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const loadTherapiesDashboard = createAsyncThunk(
    "dashboard/loadTherapiesDashboard",

    async ({ doctorId, period }, thunkAPI) => {
        try {
            return await fetchTherapiesDashboard(
                doctorId,
                period
            );
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const loadAilments = createAsyncThunk(
    "dashboard/loadAilments",

    async ({ doctorId, period }, thunkAPI) => {
        try {
            return await fetchAilments(
                doctorId,
                period
            );
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const loadOverview = createAsyncThunk(
    "dashboard/loadOverview",

    async ({ doctorId, period }, thunkAPI) => {
        try {
            return await fetchOverview(
                doctorId,
                period
            );
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);