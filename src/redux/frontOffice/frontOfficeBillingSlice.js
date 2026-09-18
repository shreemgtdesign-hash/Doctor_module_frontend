import {
    createSlice,
} from "@reduxjs/toolkit";

import {
    loadPendingPayments,
    loadPendingPaymentInvoiceDetails,
    applyPendingPaymentDiscountThunk,
} from "./frontOfficeBillingThunk";


const initialState = {

    // ======================================
    // PENDING PAYMENTS LIST
    // ======================================

    pendingPayments: [],

    pendingPaymentsLoading: false,

    pendingPaymentsError: null,

    pendingPaymentsPagination: null,

    totalPendingPayments: 0,
    visitingDoctorPayouts: [],
    visitingDoctorPayoutsLoading: false,
    visitingDoctorPayoutsError: null,
    visitingDoctorPayoutsPagination: null,
    visitingDoctorPayoutsTotal: 0,

    visitingDoctorPayoutDetails: null,
    visitingDoctorPayoutDetailsLoading: false,
    visitingDoctorPayoutDetailsError: null,

    associateDoctorPayouts: [],
    associateDoctorPayoutsLoading: false,
    associateDoctorPayoutsError: null,
    associateDoctorPayoutsPagination: null,
    associateDoctorPayoutsTotal: 0,

    associateDoctorPayoutDetails: null,
    associateDoctorPayoutDetailsLoading: false,
    associateDoctorPayoutDetailsError: null,

    applyingPendingPaymentDiscount: false,
pendingPaymentDiscountSuccess: false,
pendingPaymentDiscountMessage: "",
pendingPaymentDiscountError: null,
    // ======================================
    // INVOICE DETAILS
    // ======================================

    invoiceDetails: null,

    invoiceDetailsLoading: false,

    invoiceDetailsError: null,

};


const frontOfficeBillingSlice =
    createSlice({

        name: "frontOfficeBilling",

        initialState,

        reducers: {

            clearInvoiceDetails: (
                state
            ) => {

                state.invoiceDetails =
                    null;

                state.invoiceDetailsError =
                    null;

            },

        },


        extraReducers: (builder) => {

            // ======================================
            // PENDING PAYMENTS
            // ======================================

            builder

                .addCase(
                    loadPendingPayments.pending,
                    (state) => {

                        state.pendingPaymentsLoading =
                            true;

                        state.pendingPaymentsError =
                            null;

                    }
                )


                .addCase(
                    loadPendingPayments.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.pendingPaymentsLoading =
                            false;

                        const data =
                            action.payload || {};

                        state.pendingPayments =
                            data.data || [];

                        state.totalPendingPayments =
                            data.total_pending_payments ||
                            0;

                        state.pendingPaymentsPagination =
                            data.pagination ||
                            null;

                    }
                )


                .addCase(
                    loadPendingPayments.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.pendingPaymentsLoading =
                            false;

                        state.pendingPaymentsError =
                            action.payload ||
                            "Failed to load pending payments.";

                    }
                );


            // ======================================
            // INVOICE DETAILS
            // ======================================

            builder

                .addCase(
                    loadPendingPaymentInvoiceDetails.pending,
                    (state) => {

                        state.invoiceDetailsLoading =
                            true;

                        state.invoiceDetailsError =
                            null;

                        state.invoiceDetails =
                            null;

                    }
                )


                .addCase(
                    loadPendingPaymentInvoiceDetails.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.invoiceDetailsLoading =
                            false;

                        state.invoiceDetails =
                            action.payload?.data ||
                            null;

                    }
                )
                .addCase(
    applyPendingPaymentDiscountThunk.pending,
    (state) => {

        state.applyingPendingPaymentDiscount =
            true;

        state.pendingPaymentDiscountSuccess =
            false;

        state.pendingPaymentDiscountMessage =
            "";

        state.pendingPaymentDiscountError =
            null;
    }
)

.addCase(
    applyPendingPaymentDiscountThunk.fulfilled,
    (state, action) => {

        state.applyingPendingPaymentDiscount =
            false;

        state.pendingPaymentDiscountSuccess =
            true;

        state.pendingPaymentDiscountMessage =
            action.payload?.message ||
            "Discount and remarks updated successfully.";

        state.pendingPaymentDiscountError =
            null;
    }
)

.addCase(
    applyPendingPaymentDiscountThunk.rejected,
    (state, action) => {

        state.applyingPendingPaymentDiscount =
            false;

        state.pendingPaymentDiscountSuccess =
            false;

        state.pendingPaymentDiscountError =
            action.payload ||
            "Failed to apply discount and remarks.";
    }
)


                .addCase(
                    loadPendingPaymentInvoiceDetails.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.invoiceDetailsLoading =
                            false;

                        state.invoiceDetailsError =
                            action.payload ||
                            "Failed to load invoice details.";

                    }
                );

        },

    });


export const {
    clearInvoiceDetails,
} =
    frontOfficeBillingSlice.actions;


export default frontOfficeBillingSlice.reducer;