import { createSlice } from "@reduxjs/toolkit";

import {
    loginPharmacist,
    loadMedicinesDispensed,
    loadPharmacistAilments,
    loadPatientsTended,
    loadPharmacistSales,
    loadPharmacistPatients,
    loadPrescriptionItems,
    dispenseSingleItem,
    dispenseBulk,
    loadMedicinesDispensedTable,
    searchMedicines,
    loadEmployeePurchases,
    createPharmacistEmployeePurchase,
    loadPharmacistEmployees,
    processOnlineOrder,
    loadOnlineOrderDetails,
    loadOnlineDeliveryOrders,
} from "./pharmacistThunk";


const initialState = {

    loading: false,

    error: null,

    pharmacist: null,
    // Walk-in medicine purchases
    walkInMedicines: {},
    // ==========================================
    // ONLINE DELIVERY ORDERS
    // ==========================================

    onlineDeliveryOrders: [],

    onlineDeliveryOrdersLoading: false,

    onlineDeliveryOrdersError: null,

    onlineDeliveryOrdersCount: 0,

    onlineDeliveryBadgeCount: 0,


    // ==========================================
    // ONLINE ORDER DETAILS
    // ==========================================

    onlineOrderDetails: null,

    onlineOrderDetailsLoading: false,

    onlineOrderDetailsError: null,


    // ==========================================
    // PROCESS DELIVERY
    // ==========================================

    processingOnlineOrder: false,

    processOnlineOrderSuccess: false,

    processOnlineOrderMessage: "",

    processOnlineOrderData: null,

    processOnlineOrderError: null,
    // ==========================================
    // Dashboard
    // ==========================================

    medicinesDispensed: {
        total: 0,
        breakdown: [],
        period: "",
    },

    medicineSearch: {
        data: [],
        loading: false,
        error: null,
    },

    medicinesDispensedTable: {
        data: [],
        count: 0,
        total_records: 0,
    },

    ailments: {
        period: "",
        total_consultations: 0,
        categories: {},
    },

    patientsTended: {
        total: 0,
        men: 0,
        women: 0,
        children: 0,
        period: "",
    },

    sales: {
        period: "",

        in_store_purchases: {
            label: "",
            amount: 0,
            formatted_amount: "₹0",
            growth_percentage: "",
            comparison_label: "",
        },

        online_purchases: {
            label: "",
            badge_count: 0,
            count: 0,
            amount: 0,
            formatted_amount: "₹0",
            growth_percentage: "",
            comparison_label: "",
        },

        total_sales: {
            label: "",
            amount: 0,
            formatted_amount: "₹0",
        },

        total_business_done: "₹0",
        total_amount: 0,

        trend: [],
    },


    // ==========================================
    // Patients
    // ==========================================

    patients: [],

    selectedPatient: null,


    // ==========================================
    // Prescription
    // ==========================================

    prescription: {
        items: [],
    },

    prescriptionLoading: false,

    // ==========================================
    // EMPLOYEE PURCHASES
    // ==========================================

    employees: [],
    employeesLoading: false,
    employeesError: null,

    employeePurchases: [],
    employeePurchasesLoading: false,
    employeePurchasesError: null,

    employeePurchaseCreating: false,
    employeePurchaseSuccess: false,
    employeePurchaseMessage: "",
    employeePurchaseData: null,
    employeePurchaseError: null,
    // ==========================================
    // Dispensing
    // ==========================================

    dispensing: false,

};


const pharmacistSlice = createSlice({

    name: "pharmacist",

    initialState,

    reducers: {



        setWalkInMedicines: (
            state,
            action
        ) => {

            const {
                orderId,
                medicines,
            } = action.payload;

            if (!orderId) {
                return;
            }

            state.walkInMedicines[orderId] =
                medicines || [];
        },


        clearWalkInMedicines: (
            state,
            action
        ) => {

            const orderId =
                action.payload;

            if (!orderId) {
                return;
            }

            delete state.walkInMedicines[
                orderId
            ];
        },
        setSelectedPharmacistPatient: (
            state,
            action
        ) => {

            state.selectedPatient =
                action.payload;

            state.prescription = {
                items: [],
            };

        },


        clearSelectedPharmacistPatient: (
            state
        ) => {

            state.selectedPatient = null;

            state.prescription = {
                items: [],
            };

        },


        clearPharmacistError: (
            state
        ) => {

            state.error = null;

        },

    },


    extraReducers: (builder) => {

        // =====================================
        // LOGIN
        // =====================================

        builder

            .addCase(
                loginPharmacist.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                loginPharmacist.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.pharmacist =
                        action.payload?.data ||
                        null;

                }
            )

            .addCase(
                loginPharmacist.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload;

                }
            );


        // =====================================
        // MEDICINES DISPENSED
        // =====================================
        // ==========================================
        // ONLINE DELIVERY ORDERS
        // ==========================================

        builder

            .addCase(
                loadOnlineDeliveryOrders.pending,
                (state) => {

                    state.onlineDeliveryOrdersLoading =
                        true;

                    state.onlineDeliveryOrdersError =
                        null;

                }
            )

            .addCase(
                loadOnlineDeliveryOrders.fulfilled,
                (state, action) => {

                    state.onlineDeliveryOrdersLoading =
                        false;

                    state.onlineDeliveryOrders =
                        action.payload?.data ||
                        [];

                    state.onlineDeliveryOrdersCount =
                        action.payload?.count ||
                        0;

                    state.onlineDeliveryBadgeCount =
                        action.payload?.badge_count ||
                        0;

                }
            )

            .addCase(
                loadOnlineDeliveryOrders.rejected,
                (state, action) => {

                    state.onlineDeliveryOrdersLoading =
                        false;

                    state.onlineDeliveryOrdersError =
                        action.payload ||
                        "Failed to load online delivery orders";

                    state.onlineDeliveryOrders =
                        [];

                }
            );


        // ==========================================
        // ONLINE ORDER DETAILS
        // ==========================================

        builder

            .addCase(
                loadOnlineOrderDetails.pending,
                (state) => {

                    state.onlineOrderDetailsLoading =
                        true;

                    state.onlineOrderDetailsError =
                        null;

                    state.onlineOrderDetails =
                        null;

                }
            )

            .addCase(
                loadOnlineOrderDetails.fulfilled,
                (state, action) => {

                    state.onlineOrderDetailsLoading =
                        false;

                    state.onlineOrderDetails =
                        action.payload ||
                        null;

                }
            )

            .addCase(
                loadOnlineOrderDetails.rejected,
                (state, action) => {

                    state.onlineOrderDetailsLoading =
                        false;

                    state.onlineOrderDetailsError =
                        action.payload ||
                        "Failed to load order details";

                    state.onlineOrderDetails =
                        null;

                }
            );


        // ==========================================
        // PROCESS DELIVERY
        // ==========================================

        builder

            .addCase(
                processOnlineOrder.pending,
                (state) => {

                    state.processingOnlineOrder =
                        true;

                    state.processOnlineOrderSuccess =
                        false;

                    state.processOnlineOrderMessage =
                        "";

                    state.processOnlineOrderError =
                        null;

                }
            )

            .addCase(
                processOnlineOrder.fulfilled,
                (state, action) => {

                    state.processingOnlineOrder =
                        false;

                    state.processOnlineOrderSuccess =
                        true;

                    state.processOnlineOrderMessage =
                        action.payload?.message ||
                        "Order delivery processed successfully";

                    state.processOnlineOrderData =
                        action.payload?.data ||
                        null;

                }
            )

            .addCase(
                processOnlineOrder.rejected,
                (state, action) => {

                    state.processingOnlineOrder =
                        false;

                    state.processOnlineOrderSuccess =
                        false;

                    state.processOnlineOrderError =
                        action.payload ||
                        "Failed to process delivery";

                }
            );
        builder

            .addCase(
                loadMedicinesDispensed.pending,
                (state) => {

                    state.loading = true;

                }
            )

            .addCase(
                loadMedicinesDispensed.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.medicinesDispensed =
                        action.payload || {
                            total: 0,
                            breakdown: [],
                        };

                }
            )

            .addCase(
                loadMedicinesDispensed.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload;

                }
            );


        // =====================================
        // AILMENTS
        // =====================================

        builder

            .addCase(
                loadPharmacistAilments.fulfilled,
                (state, action) => {

                    state.ailments =
                        action.payload || {
                            total_consultations: 0,
                            categories: {},
                        };

                }
            );


        // =====================================
        // PATIENTS TENDED
        // =====================================

        builder

            .addCase(
                loadPatientsTended.fulfilled,
                (state, action) => {

                    state.patientsTended =
                        action.payload || {
                            total: 0,
                            men: 0,
                            women: 0,
                            children: 0,
                        };

                }
            );


        // =====================================
        // SALES
        // =====================================
        // ==========================================
        // EMPLOYEE LIST
        // ==========================================

        builder

            .addCase(
                loadPharmacistEmployees.pending,
                (state) => {

                    state.employeesLoading =
                        true;

                    state.employeesError =
                        null;

                }
            )

            .addCase(
                loadPharmacistEmployees.fulfilled,
                (state, action) => {

                    state.employeesLoading =
                        false;

                    state.employees =
                        action.payload || [];

                    state.employeesError =
                        null;

                }
            )

            .addCase(
                loadPharmacistEmployees.rejected,
                (state, action) => {

                    state.employeesLoading =
                        false;

                    state.employeesError =
                        action.payload ||
                        "Failed to load employees";

                    state.employees = [];

                }
            );


        // ==========================================
        // CREATE EMPLOYEE PURCHASE
        // ==========================================

        builder

            .addCase(
                createPharmacistEmployeePurchase.pending,
                (state) => {

                    state.employeePurchaseCreating =
                        true;

                    state.employeePurchaseSuccess =
                        false;

                    state.employeePurchaseMessage =
                        "";

                    state.employeePurchaseData =
                        null;

                    state.employeePurchaseError =
                        null;

                }
            )

            .addCase(
                createPharmacistEmployeePurchase.fulfilled,
                (state, action) => {

                    state.employeePurchaseCreating =
                        false;

                    state.employeePurchaseSuccess =
                        true;

                    state.employeePurchaseMessage =
                        action.payload?.message ||
                        "Employee purchase processed successfully";

                    state.employeePurchaseData =
                        action.payload?.data ||
                        null;

                    state.employeePurchaseError =
                        null;

                }
            )

            .addCase(
                createPharmacistEmployeePurchase.rejected,
                (state, action) => {

                    state.employeePurchaseCreating =
                        false;

                    state.employeePurchaseSuccess =
                        false;

                    state.employeePurchaseError =
                        action.payload ||
                        "Failed to create employee purchase";

                }
            );


        // ==========================================
        // EMPLOYEE PURCHASE LIST
        // ==========================================

        builder

            .addCase(
                loadEmployeePurchases.pending,
                (state) => {

                    state.employeePurchasesLoading =
                        true;

                    state.employeePurchasesError =
                        null;

                }
            )

            .addCase(
                loadEmployeePurchases.fulfilled,
                (state, action) => {

                    state.employeePurchasesLoading =
                        false;

                    state.employeePurchases =
                        action.payload || [];

                    state.employeePurchasesError =
                        null;

                }
            )

            .addCase(
                loadEmployeePurchases.rejected,
                (state, action) => {

                    state.employeePurchasesLoading =
                        false;

                    state.employeePurchasesError =
                        action.payload ||
                        "Failed to load employee purchases";

                    state.employeePurchases = [];

                }
            );
        builder

            .addCase(
                loadPharmacistSales.fulfilled,
                (state, action) => {

                    state.sales =
                        action.payload || {
                            period: "",
                            in_store_purchases: {},
                            online_purchases: {},
                            total_sales: {},
                            total_business_done: "₹0",
                            total_amount: 0,
                            trend: [],
                        };

                }
            )


        // =====================================
        // PATIENTS
        // =====================================

        builder

            .addCase(
                loadPharmacistPatients.pending,
                (state) => {

                    state.loading = true;

                }
            )

            .addCase(
                loadPharmacistPatients.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.patients =
                        action.payload || [];

                }
            )

            .addCase(
                loadPharmacistPatients.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload;

                }
            );


        // =====================================
        // PRESCRIPTION
        // =====================================

        builder

            .addCase(
                loadPrescriptionItems.pending,
                (state) => {

                    state.prescriptionLoading =
                        true;

                    state.prescription = {
                        items: [],
                    };

                }
            )

            .addCase(
                loadPrescriptionItems.fulfilled,
                (state, action) => {

                    state.prescriptionLoading =
                        false;

                    state.prescription = {
                        items:
                            action.payload || [],
                    };

                }
            )

            .addCase(
                loadPrescriptionItems.rejected,
                (state, action) => {

                    state.prescriptionLoading =
                        false;

                    state.prescription = {
                        items: [],
                    };

                    state.error =
                        action.payload;

                }
            );


        // =====================================
        // MEDICINE SEARCH
        // =====================================

        builder

            .addCase(
                searchMedicines.pending,
                (state) => {

                    state.medicineSearch.loading =
                        true;

                    state.medicineSearch.error =
                        null;

                }
            )

            .addCase(
                searchMedicines.fulfilled,
                (state, action) => {

                    state.medicineSearch.loading =
                        false;

                    state.medicineSearch.data =
                        action.payload || [];

                }
            )

            .addCase(
                searchMedicines.rejected,
                (state, action) => {

                    state.medicineSearch.loading =
                        false;

                    state.medicineSearch.error =
                        action.payload;

                }
            );


        // =====================================
        // SINGLE DISPENSE
        // =====================================

        builder

            .addCase(
                dispenseSingleItem.pending,
                (state) => {

                    state.dispensing = true;

                }
            )

            .addCase(
                dispenseSingleItem.fulfilled,
                (state) => {

                    state.dispensing = false;

                }
            )

            .addCase(
                dispenseSingleItem.rejected,
                (state, action) => {

                    state.dispensing = false;

                    state.error =
                        action.payload;

                }
            );


        // =====================================
        // MEDICINES DISPENSED TABLE
        // =====================================

        builder

            .addCase(
                loadMedicinesDispensedTable.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                loadMedicinesDispensedTable.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.medicinesDispensedTable =
                        action.payload || {
                            data: [],
                            count: 0,
                            total_records: 0,
                        };

                }
            )

            .addCase(
                loadMedicinesDispensedTable.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload;

                }
            );


        // =====================================
        // BULK DISPENSE
        // =====================================

        builder

            .addCase(
                dispenseBulk.pending,
                (state) => {

                    state.dispensing = true;

                }
            )

            .addCase(
                dispenseBulk.fulfilled,
                (state) => {

                    state.dispensing = false;

                }
            )

            .addCase(
                dispenseBulk.rejected,
                (state, action) => {

                    state.dispensing = false;

                    state.error =
                        action.payload;

                }
            );

    },

});


export const {
    setSelectedPharmacistPatient,
    clearSelectedPharmacistPatient,
    clearPharmacistError,
    setWalkInMedicines,
    clearWalkInMedicines,
} = pharmacistSlice.actions;


export default pharmacistSlice.reducer;