import {
    createAsyncThunk,
} from "@reduxjs/toolkit";

import {
    fetchPatientList,
    fetchPatientProfile,
    fetchUpdatePatient,
    fetchDeletePatient,
} from "../../services/frontOfficePatientService";


// ==========================================
// LOAD PATIENT LIST
// ==========================================

export const loadFrontOfficePatients =
    createAsyncThunk(

        "frontOfficePatient/loadPatients",

        async (
            params = {},
            { rejectWithValue }
        ) => {

            try {

                return await fetchPatientList(
                    params
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
// LOAD PATIENT PROFILE
// ==========================================

export const loadFrontOfficePatientProfile =
    createAsyncThunk(

        "frontOfficePatient/loadPatientProfile",

        async (
            patientId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchPatientProfile(
                    patientId
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
// UPDATE PATIENT
// ==========================================

export const updateFrontOfficePatient =
    createAsyncThunk(

        "frontOfficePatient/updatePatient",

        async (
            {
                patientId,
                data,
            },
            { rejectWithValue }
        ) => {

            try {

                return await fetchUpdatePatient(
                    patientId,
                    data
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
// DELETE PATIENT
// ==========================================

export const deleteFrontOfficePatient =
    createAsyncThunk(

        "frontOfficePatient/deletePatient",

        async (
            patientId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchDeletePatient(
                    patientId
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }

    );