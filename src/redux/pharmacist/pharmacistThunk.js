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
    getMedicinesDispensedTable,
    searchPharmacistMedicines,

    getPharmacistEmployees,
    createEmployeePurchase,
    getEmployeePurchases,
    getOnlineDeliveryOrders,
    getOnlineOrderDetails,
    processOnlineOrderDelivery,
} from "../../api/pharmacistApi";


// ==========================================
// Login
// ==========================================

export const loginPharmacist =
    createAsyncThunk(
        "pharmacist/login",

        async (
            payload,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await pharmacistLogin(
                        payload
                    );

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

// ==========================================
// Medicines Dispensed
// ==========================================

export const loadMedicinesDispensed =
    createAsyncThunk(
        "pharmacist/loadMedicinesDispensed",

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await getMedicinesDispensed(
                        period
                    );

                return response.data.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load medicines dispensed"
                );

            }

        }
    );


// ==========================================
// Ailments Addressed
// ==========================================

export const loadPharmacistAilments =
    createAsyncThunk(
        "pharmacist/loadAilments",

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await getPharmacistAilments(
                        period
                    );

                return response.data.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load ailments"
                );

            }

        }
    );


// ==========================================
// Patients Tended
// ==========================================

export const loadPatientsTended =
    createAsyncThunk(
        "pharmacist/loadPatientsTended",

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await getPatientsTended(
                        period
                    );

                return response.data.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load patients tended"
                );

            }

        }
    );


// ==========================================
// SALES
// ==========================================

export const loadPharmacistSales =
    createAsyncThunk(
        "pharmacist/loadSales",

        async (
            period = "week",
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await getPharmacistSales(
                        period
                    );

                return {
                    ...(response.data.data || {}),
                    period:
                        response.data.period ||
                        period,
                };

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

        async (
            _,
            { rejectWithValue }
        ) => {

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

        async (
            consultationId,
            { rejectWithValue }
        ) => {

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

        async (
            payload,
            { rejectWithValue }
        ) => {

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


// ==========================================
// Medicines Dispensed Table
// ==========================================

export const loadMedicinesDispensedTable =
    createAsyncThunk(
        "pharmacist/loadMedicinesDispensedTable",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await getMedicinesDispensedTable();

                return {
                    data:
                        response.data?.data || [],

                    count:
                        response.data?.count || 0,

                    total_records:
                        response.data?.total_records ||
                        0,
                };

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load medicines dispensed"
                );

            }

        }
    );


// ==========================================
// Medicine Search
// ==========================================

export const searchMedicines =
    createAsyncThunk(
        "pharmacist/searchMedicines",

        async (
            search,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await searchPharmacistMedicines(
                        search
                    );

                return (
                    response.data?.data ||
                    []
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to search medicines"
                );

            }

        }
    );


// ==========================================
// EMPLOYEE LIST
// ==========================================

export const loadPharmacistEmployees =
    createAsyncThunk(
        "pharmacist/loadEmployees",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await getPharmacistEmployees();

                return (
                    response.data?.data ||
                    response.data ||
                    []
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load employees"
                );

            }

        }
    );


// ==========================================
// CREATE EMPLOYEE PURCHASE
// ==========================================

export const createPharmacistEmployeePurchase =
    createAsyncThunk(
        "pharmacist/createEmployeePurchase",

        async (
            payload,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await createEmployeePurchase(
                        payload
                    );

                return response.data;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to create employee purchase"
                );

            }

        }
    );


// ==========================================
// LIST EMPLOYEE PURCHASES
// ==========================================

export const loadEmployeePurchases =
    createAsyncThunk(
        "pharmacist/loadEmployeePurchases",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await getEmployeePurchases();

                return (
                    response.data?.data ||
                    []
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load employee purchases"
                );

            }

        }
    );


// ==========================================
// ONLINE DELIVERY ORDERS
// ==========================================

export const loadOnlineDeliveryOrders =
    createAsyncThunk(

        "pharmacist/loadOnlineDeliveryOrders",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await getOnlineDeliveryOrders();

                return {
                    data:
                        response.data?.data ||
                        [],

                    count:
                        response.data?.count ||
                        0,

                    badge_count:
                        response.data?.badge_count ||
                        0,
                };

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load online delivery orders"
                );

            }

        }
    );

    // ==========================================
// PROCESS ONLINE ORDER DELIVERY
// ==========================================

export const processOnlineOrder =
    createAsyncThunk(

        "pharmacist/processOnlineOrder",

        async (
            orderId,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await processOnlineOrderDelivery(
                        orderId
                    );

                return (
                    response.data ||
                    null
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to process delivery"
                );

            }

        }
    );


    // ==========================================
// ONLINE ORDER DETAILS
// ==========================================

export const loadOnlineOrderDetails =
    createAsyncThunk(

        "pharmacist/loadOnlineOrderDetails",

        async (
            orderId,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await getOnlineOrderDetails(
                        orderId
                    );

                return (
                    response.data?.data ||
                    null
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    "Failed to load order details"
                );

            }

        }
    );