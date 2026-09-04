import {
    createSlice,
} from "@reduxjs/toolkit";

import {
    loadFrontOfficePatients,
    loadFrontOfficePatientProfile,
    updateFrontOfficePatient,
    deleteFrontOfficePatient,
} from "./frontOfficePatientThunk";


// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {

    // ==========================================
    // PATIENT LIST
    // ==========================================

    patients: [],

    totalPatients: 0,

    count: 0,

    page: 1,

    limit: 10,

    totalPages: 0,

    showingText: "",

    patientsLoading: false,

    patientsError: null,


    // ==========================================
    // SELECTED PATIENT / PROFILE
    // ==========================================

    selectedPatient: null,

    patientProfileLoading: false,

    patientProfileError: null,


    // ==========================================
    // UPDATE PATIENT
    // ==========================================

    updatingPatient: false,

    updatePatientSuccess: false,

    updatePatientMessage: "",

    updatePatientError: null,


    // ==========================================
    // DELETE PATIENT
    // ==========================================

    deletingPatient: false,

    deletePatientSuccess: false,

    deletePatientMessage: "",

    deletePatientError: null,


    // ==========================================
    // COMMON
    // ==========================================

    loading: false,

    error: null,

    success: false,

    message: "",
};


// ==========================================
// SLICE
// ==========================================

const frontOfficePatientSlice =
    createSlice({

        name:
            "frontOfficePatient",

        initialState,

        reducers: {

            // ==========================================
            // CLEAR PATIENT PROFILE
            // ==========================================

            clearFrontOfficePatientProfile:
                (state) => {

                    state.selectedPatient =
                        null;

                    state.patientProfileError =
                        null;
                },


            // ==========================================
            // CLEAR MESSAGES
            // ==========================================

            clearFrontOfficePatientMessage:
                (state) => {

                    state.updatePatientSuccess =
                        false;

                    state.updatePatientMessage =
                        "";

                    state.updatePatientError =
                        null;

                    state.deletePatientSuccess =
                        false;

                    state.deletePatientMessage =
                        "";

                    state.deletePatientError =
                        null;

                    state.success =
                        false;

                    state.message =
                        "";

                    state.error =
                        null;
                },


            // ==========================================
            // CLEAR STATE
            // ==========================================

            clearFrontOfficePatientState:
                (state) => {

                    Object.assign(
                        state,
                        initialState
                    );

                },

        },


        // ==========================================
        // EXTRA REDUCERS
        // ==========================================

        extraReducers: (builder) => {


            // =====================================================
            // LOAD PATIENT LIST
            // =====================================================

            builder

                .addCase(
                    loadFrontOfficePatients.pending,
                    (state) => {

                        state.patientsLoading =
                            true;

                        state.patientsError =
                            null;

                    }
                )

                .addCase(
                    loadFrontOfficePatients.fulfilled,
                    (state, action) => {

                        state.patientsLoading =
                            false;

                        state.patientsError =
                            null;


                        state.patients =
                            action.payload?.data ||
                            [];


                        state.totalPatients =
                            action.payload?.total_patients ||
                            0;


                        state.count =
                            action.payload?.count ||
                            0;


                        state.page =
                            action.payload?.page ||
                            1;


                        state.limit =
                            action.payload?.limit ||
                            10;


                        state.totalPages =
                            action.payload?.total_pages ||
                            0;


                        state.showingText =
                            action.payload?.showing_text ||
                            "";

                    }
                )

                .addCase(
                    loadFrontOfficePatients.rejected,
                    (state, action) => {

                        state.patientsLoading =
                            false;

                        state.patientsError =
                            action.payload ||
                            "Failed to load patients.";

                        state.patients =
                            [];

                    }
                );


            // =====================================================
            // LOAD PATIENT PROFILE
            // =====================================================

            builder

                .addCase(
                    loadFrontOfficePatientProfile.pending,
                    (state) => {

                        state.patientProfileLoading =
                            true;

                        state.patientProfileError =
                            null;

                    }
                )

                .addCase(
                    loadFrontOfficePatientProfile.fulfilled,
                    (state, action) => {

                        state.patientProfileLoading =
                            false;

                        state.patientProfileError =
                            null;


                        /*
                         * API:
                         *
                         * {
                         *   success: true,
                         *   data: {
                         *      profile: {},
                         *      visit_history: []
                         *   }
                         * }
                         */

                        state.selectedPatient =
                            action.payload?.data ||
                            null;

                    }
                )

                .addCase(
                    loadFrontOfficePatientProfile.rejected,
                    (state, action) => {

                        state.patientProfileLoading =
                            false;

                        state.patientProfileError =
                            action.payload ||
                            "Failed to load patient profile.";

                        state.selectedPatient =
                            null;

                    }
                );


            // =====================================================
            // UPDATE PATIENT
            // =====================================================

            builder

                .addCase(
                    updateFrontOfficePatient.pending,
                    (state) => {

                        state.updatingPatient =
                            true;

                        state.updatePatientSuccess =
                            false;

                        state.updatePatientMessage =
                            "";

                        state.updatePatientError =
                            null;

                    }
                )

                .addCase(
                    updateFrontOfficePatient.fulfilled,
                    (state, action) => {

                        state.updatingPatient =
                            false;

                        state.updatePatientSuccess =
                            true;

                        state.updatePatientMessage =
                            action.payload?.message ||
                            "Patient details updated successfully.";

                        state.updatePatientError =
                            null;


                        /*
                         * UPDATE API returns:
                         *
                         * data: {
                         *   id,
                         *   patient_code,
                         *   name,
                         *   mobile,
                         *   email,
                         *   dob,
                         *   gender,
                         *   package_name,
                         *   insurance
                         * }
                         */

                        const updatedPatient =
                            action.payload?.data;


                        if (
                            updatedPatient &&
                            state.selectedPatient
                        ) {

                            state.selectedPatient =
                                {
                                    ...state.selectedPatient,

                                    profile:
                                        {
                                            ...state.selectedPatient.profile,

                                            ...updatedPatient,

                                            full_name:
                                                updatedPatient.name ||
                                                state.selectedPatient.profile?.full_name,

                                            name:
                                                updatedPatient.name ||
                                                state.selectedPatient.profile?.name,

                                            mobile:
                                                updatedPatient.mobile ||
                                                state.selectedPatient.profile?.mobile,

                                            phone:
                                                updatedPatient.mobile ||
                                                state.selectedPatient.profile?.phone,

                                            email:
                                                updatedPatient.email ||
                                                state.selectedPatient.profile?.email,

                                            dob:
                                                updatedPatient.dob ||
                                                state.selectedPatient.profile?.dob,

                                            gender:
                                                updatedPatient.gender ||
                                                state.selectedPatient.profile?.gender,

                                            package_name:
                                                updatedPatient.package_name ||
                                                state.selectedPatient.profile?.package_name,

                                            insurance:
                                                updatedPatient.insurance ||
                                                state.selectedPatient.profile?.insurance,
                                        },
                                };

                        }


                        state.success =
                            true;

                        state.message =
                            state.updatePatientMessage;

                    }
                )

                .addCase(
                    updateFrontOfficePatient.rejected,
                    (state, action) => {

                        state.updatingPatient =
                            false;

                        state.updatePatientSuccess =
                            false;

                        state.updatePatientError =
                            action.payload ||
                            "Failed to update patient.";

                        state.error =
                            state.updatePatientError;

                    }
                );


            // =====================================================
            // DELETE PATIENT
            // =====================================================

            builder

                .addCase(
                    deleteFrontOfficePatient.pending,
                    (state) => {

                        state.deletingPatient =
                            true;

                        state.deletePatientSuccess =
                            false;

                        state.deletePatientMessage =
                            "";

                        state.deletePatientError =
                            null;

                    }
                )

                .addCase(
                    deleteFrontOfficePatient.fulfilled,
                    (state, action) => {

                        state.deletingPatient =
                            false;

                        state.deletePatientSuccess =
                            true;

                        state.deletePatientMessage =
                            action.payload?.message ||
                            "Patient deleted successfully.";

                        state.deletePatientError =
                            null;


                        state.success =
                            true;

                        state.message =
                            state.deletePatientMessage;


                        /*
                         * Remove patient immediately
                         * from current table.
                         */

                        const deletedId =
                            action.meta?.arg;


                        if (deletedId) {

                            state.patients =
                                state.patients.filter(
                                    (patient) =>
                                        patient.id !==
                                        deletedId
                                );

                        }

                    }
                )

                .addCase(
                    deleteFrontOfficePatient.rejected,
                    (state, action) => {

                        state.deletingPatient =
                            false;

                        state.deletePatientSuccess =
                            false;

                        state.deletePatientError =
                            action.payload ||
                            "Failed to delete patient.";

                        state.error =
                            state.deletePatientError;

                    }
                );

        },

    });


// ==========================================
// ACTIONS
// ==========================================

export const {
    clearFrontOfficePatientProfile,
    clearFrontOfficePatientMessage,
    clearFrontOfficePatientState,
} =
    frontOfficePatientSlice.actions;


// ==========================================
// SELECTORS
// ==========================================

export const selectFrontOfficePatients =
    (state) =>
        state.frontOfficePatient?.patients ||
        [];

export const selectFrontOfficePatientCount =
    (state) =>
        state.frontOfficePatient?.totalPatients ||
        0;

export const selectFrontOfficePatientProfile =
    (state) =>
        state.frontOfficePatient?.selectedPatient ||
        null;

export const selectFrontOfficePatientLoading =
    (state) =>
        state.frontOfficePatient?.patientsLoading ||
        false;

export const selectFrontOfficePatientProfileLoading =
    (state) =>
        state.frontOfficePatient?.patientProfileLoading ||
        false;

export const selectFrontOfficePatientUpdating =
    (state) =>
        state.frontOfficePatient?.updatingPatient ||
        false;

export const selectFrontOfficePatientDeleting =
    (state) =>
        state.frontOfficePatient?.deletingPatient ||
        false;


// ==========================================
// REDUCER
// ==========================================

export default frontOfficePatientSlice.reducer;