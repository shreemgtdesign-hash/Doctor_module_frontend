import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    fetchTherapistDashboard,
    fetchTherapiesPerformedDashboard,
    fetchTherapistAilmentsDashboard,
    fetchTherapistPatientsDashboard,
    fetchTherapistSalesDashboard,
} from "../../services/therapistDashboardService";
import { fetchTherapistAppointments } from "../../services/therapistAppointmentsService";


// ==========================================
// FULL DASHBOARD
// ==========================================

export const getTherapistDashboard =
    createAsyncThunk(

        "therapistDashboard/getTherapistDashboard",

        async (_, { rejectWithValue }) => {

            try {

                return await fetchTherapistDashboard();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }

    );


// ==========================================
// THERAPIES
// ==========================================

export const loadTherapiesPerformed =
    createAsyncThunk(

        "therapistDashboard/loadTherapiesPerformed",

        async (_, { rejectWithValue }) => {

            try {

                return await fetchTherapiesPerformedDashboard();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }

    );


// ==========================================
// AILMENTS
// ==========================================

export const loadTherapistAilments =
    createAsyncThunk(

        "therapistDashboard/loadAilments",

        async (_, { rejectWithValue }) => {

            try {

                return await fetchTherapistAilmentsDashboard();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }

    );


// ==========================================
// PATIENTS
// ==========================================

export const loadTherapistPatients =
    createAsyncThunk(

        "therapistDashboard/loadPatients",

        async (_, { rejectWithValue }) => {

            try {

                return await fetchTherapistPatientsDashboard();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }

    );


// ==========================================
// SALES
// ==========================================

export const loadTherapistSales =
    createAsyncThunk(

        "therapistDashboard/loadSales",

        async (_, { rejectWithValue }) => {

            try {

                return await fetchTherapistSalesDashboard();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }

    );

    export const loadTherapistAppointments =
    createAsyncThunk(
        "therapist/loadAppointments",

        async (_, { rejectWithValue }) => {

            try {

                const response =
                    await fetchTherapistAppointments();

                console.log(
                    "THERAPIST APPOINTMENTS RESPONSE:",
                    response
                );

                return response;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }
    );

    