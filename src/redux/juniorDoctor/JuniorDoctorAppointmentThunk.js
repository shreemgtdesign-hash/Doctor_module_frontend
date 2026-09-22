import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    fetchJuniorDoctorAppointments,
    finishJuniorDoctorConsultationService,
} from "../../services/juniorDoctorAppointmentService";


// ==========================================
// LOAD JUNIOR DOCTOR APPOINTMENTS
// ==========================================

export const loadJuniorDoctorAppointments =
    createAsyncThunk(

        "juniorDoctorAppointment/loadAppointments",

        async (
            period = "today",
            { rejectWithValue }
        ) => {

            try {

                return await fetchJuniorDoctorAppointments(
                    period
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load appointments."
                );

            }

        }

    );


// ==========================================
// FINISH CONSULTATION
// ==========================================

export const finishJuniorDoctorConsultation =
    createAsyncThunk(

        "juniorDoctorAppointment/finishConsultation",

        async (
            appointmentId,
            { rejectWithValue }
        ) => {

            try {

                if (!appointmentId) {

                    return rejectWithValue(
                        "Appointment ID is required."
                    );

                }

                return await finishJuniorDoctorConsultationService(
                    appointmentId
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to finish consultation."
                );

            }

        }

    );