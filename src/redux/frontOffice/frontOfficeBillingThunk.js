import {
    createAsyncThunk,
} from "@reduxjs/toolkit";

import {
    fetchPendingPayments,
    fetchPendingPaymentInvoiceDetails,
    fetchAssociateDoctorPayoutDetails,
    fetchAssociateDoctorPayouts,
    fetchVisitingDoctorPayoutDetails,
    fetchVisitingDoctorPayouts,
} from "../../services/frontOfficeBillingService";


// ==========================================
// LOAD PENDING PAYMENTS
// ==========================================

export const loadPendingPayments =
    createAsyncThunk(

        "frontOfficeBilling/loadPendingPayments",

        async (
            {
                page = 1,
                limit = 8,
            } = {},
            {
                rejectWithValue,
            }
        ) => {

            try {

                return await fetchPendingPayments(
                    page,
                    limit
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load pending payments."
                );

            }

        }

    );


// ==========================================
// LOAD INVOICE DETAILS
// ==========================================

export const loadPendingPaymentInvoiceDetails =
    createAsyncThunk(

        "frontOfficeBilling/loadInvoiceDetails",

        async (
            appointmentId,
            {
                rejectWithValue,
            }
        ) => {

            try {

                return await fetchPendingPaymentInvoiceDetails(
                    appointmentId
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load invoice details."
                );

            }

        }

    );

export const loadVisitingDoctorPayouts = createAsyncThunk(
    "frontOfficeBilling/loadVisitingDoctorPayouts",
    async (
        { page = 1, limit = 8 } = {},
        { rejectWithValue }
    ) => {
        try {
            return await fetchVisitingDoctorPayouts(
                page,
                limit
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message ||
                "Failed to load visiting doctor payouts."
            );
        }
    }
);


export const loadVisitingDoctorPayoutDetails =
    createAsyncThunk(
        "frontOfficeBilling/loadVisitingDoctorPayoutDetails",
        async (doctorId, { rejectWithValue }) => {
            try {
                return await fetchVisitingDoctorPayoutDetails(
                    doctorId
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load visiting doctor payout details."
                );
            }
        }
    );


/* =========================================================
   ASSOCIATE DOCTOR PAYOUTS
========================================================= */

export const loadAssociateDoctorPayouts = createAsyncThunk(
    "frontOfficeBilling/loadAssociateDoctorPayouts",
    async (
        { page = 1, limit = 8 } = {},
        { rejectWithValue }
    ) => {
        try {
            return await fetchAssociateDoctorPayouts(
                page,
                limit
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message ||
                "Failed to load associate doctor payouts."
            );
        }
    }
);


export const loadAssociateDoctorPayoutDetails =
    createAsyncThunk(
        "frontOfficeBilling/loadAssociateDoctorPayoutDetails",
        async (doctorId, { rejectWithValue }) => {
            try {
                return await fetchAssociateDoctorPayoutDetails(
                    doctorId
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load associate doctor payout details."
                );
            }
        }
    );