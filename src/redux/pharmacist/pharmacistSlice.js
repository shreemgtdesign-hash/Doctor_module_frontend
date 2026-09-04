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
} from "./pharmacistThunk";


const initialState = {

    loading: false,

    error: null,

    pharmacist: null,
        // Walk-in medicine purchases
    walkInMedicines: {},

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
        total_business: 0,
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

        builder

            .addCase(
                loadPharmacistSales.fulfilled,
                (state, action) => {

                    state.sales =
                        action.payload || {
                            total_business: 0,
                            trend: [],
                        };

                }
            );


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