import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    fetchTherapistDashboard,
    fetchTherapiesPerformedDashboard,
    fetchTherapistAilmentsDashboard,
    fetchTherapistPatientsDashboard,
    fetchTherapistScheduleOverview,
   
} from "../../services/therapistDashboardService";
import { fetchTherapistAppointments, markTherapistAppointmentsComplete } from "../../services/therapistAppointmentsService";


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

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await fetchTherapiesPerformedDashboard(
                        period
                    );

                console.log(
                    "THERAPIES PERFORMED PAYLOAD:",
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
// ==========================================
// SCHEDULE OVERVIEW
// ==========================================

export const loadTherapistScheduleOverview =
    createAsyncThunk(

        "therapist/loadScheduleOverview",

        async (
            period = "today",
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await fetchTherapistScheduleOverview(
                        period
                    );

                console.log(
                    "THERAPIST SCHEDULE OVERVIEW:",
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
export const completeTherapistAppointments =
    createAsyncThunk(

        "therapist/completeAppointments",

        async (
            {
                bookingIds,
                notes,
                status = "completed",
            },
            { rejectWithValue }
        ) => {

            try {

                return await markTherapistAppointmentsComplete({
                    bookingIds,
                    notes,
                    status,
                });

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }

    );