import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    pharmacistLogin,
    getMedicinesDispensed,
    getPharmacistAilments,
    getPatientsTended,
    getPharmacistSales,
    getPharmacistPatients,
    getPrescriptionItems,
    dispensePrescriptionItem,
    dispensePrescriptionBulk,
} from "../../api/pharmacistApi";


// ==========================================
// Login
// ==========================================

export const loginPharmacist = createAsyncThunk(
    "pharmacist/login",
    async (payload, { rejectWithValue }) => {

        try {

            const response =
                await pharmacistLogin(payload);

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data ||
                "Pharmacist login failed"
            );

        }
    }
);


// ==========================================
// Dashboard
// ==========================================

export const loadMedicinesDispensed =
    createAsyncThunk(
        "pharmacist/loadMedicinesDispensed",
        async (_, { rejectWithValue }) => {

            try {

                const response =
                    await getMedicinesDispensed();

                return response.data.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load medicines dispensed"
                );

            }

        }
    );


export const loadPharmacistAilments =
    createAsyncThunk(
        "pharmacist/loadAilments",
        async (_, { rejectWithValue }) => {

            try {

                const response =
                    await getPharmacistAilments();

                return response.data.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load ailments"
                );

            }

        }
    );


export const loadPatientsTended =
    createAsyncThunk(
        "pharmacist/loadPatientsTended",
        async (_, { rejectWithValue }) => {

            try {

                const response =
                    await getPatientsTended();

                return response.data.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load patients tended"
                );

            }

        }
    );


export const loadPharmacistSales =
    createAsyncThunk(
        "pharmacist/loadSales",
        async (_, { rejectWithValue }) => {

            try {

                const response =
                    await getPharmacistSales();

                return response.data.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load sales"
                );

            }

        }
    );


// ==========================================
// Patients
// ==========================================

export const loadPharmacistPatients =
    createAsyncThunk(
        "pharmacist/loadPatients",
        async (_, { rejectWithValue }) => {

            try {

                const response =
                    await getPharmacistPatients();

                return response.data.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load pharmacist patients"
                );

            }

        }
    );


// ==========================================
// Prescription
// ==========================================

export const loadPrescriptionItems =
    createAsyncThunk(
        "pharmacist/loadPrescriptionItems",
        async (consultationId, { rejectWithValue }) => {

            try {

                const response =
                    await getPrescriptionItems(
                        consultationId
                    );

                return response.data.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load prescription"
                );

            }

        }
    );


// ==========================================
// Single Dispense
// ==========================================

export const dispenseSingleItem =
    createAsyncThunk(
        "pharmacist/dispenseSingleItem",
        async (
            {
                consultationId,
                quantity_dispensed,
            },
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await dispensePrescriptionItem(
                        consultationId,
                        {
                            quantity_dispensed,
                        }
                    );

                return response.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to dispense medicine"
                );

            }

        }
    );


// ==========================================
// Bulk Dispense
// ==========================================

export const dispenseBulk =
    createAsyncThunk(
        "pharmacist/dispenseBulk",
        async (payload, { rejectWithValue }) => {

            try {

                const response =
                    await dispensePrescriptionBulk(
                        payload
                    );

                return response.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to dispense medicines"
                );

            }

        }
    );