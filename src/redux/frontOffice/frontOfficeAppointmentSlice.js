import { createSlice } from "@reduxjs/toolkit";

import {
    confirmFrontOfficeAppointment,
    createFrontOfficeDoctor,
    updateFrontOfficeDoctor,
    toggleFrontOfficeDoctorStatus,
    addFrontOfficeDoctorSchedule,
    deleteFrontOfficeDoctorSchedule,
    deleteFrontOfficeDoctor,
    loadInsuranceList,
    loadReferralList,
    loadPackages,
    loadFrontOfficeDoctors,
    loadMedicalCampList,
    loadMedicalCampDetails,
    registerFrontOfficeMedicalCampPatient,
} from "./frontOfficeAppointmentThunk";

const initialState = {
    // ==========================================
    // APPOINTMENT
    // ==========================================

    confirmingAppointment: false,
    appointmentSuccess: false,
    appointmentMessage: "",
    appointmentError: null,

    // ==========================================
    // DOCTORS
    // ==========================================

    doctors: [],
    selectedDoctor: null,

    loadingDoctors: false,
    creatingDoctor: false,
    updatingDoctor: false,
    togglingDoctor: false,
    insuranceList: [],
    insuranceLoading: false,
    insuranceError: null,
    referralList: [],
    referralLoading: false,
    referralError: null,
    packages: [],
    packagesLoading: false,
    packagesError: null,
    packagesCount: 0,
    medicalCampList: [],
    medicalCampLoading: false,
    medicalCampError: null,
    medicalCampTotal: 0,
    medicalCampDetails: null,
    medicalCampDetailsLoading: false,
    medicalCampDetailsError: null,
    medicalCampRegistering: false,
    medicalCampRegisterSuccess: false,
    medicalCampRegisterMessage: "",
    medicalCampRegisterError: null,
    // ==========================================
    // SCHEDULE
    // ==========================================

    addingSchedule: false,
    deletingSchedule: false,

    // ==========================================
    // DELETE
    // ==========================================

    deletingDoctor: false,

    // ==========================================
    // COMMON
    // ==========================================

    loading: false,
    error: null,
    success: false,
    message: "",
};

const frontOfficeAppointmentSlice = createSlice({
    name: "frontOfficeAppointment",

    initialState,

    reducers: {
        // ==========================================
        // CLEAR MESSAGE
        // ==========================================

        clearFrontOfficeAppointmentMessage: (state) => {
            state.appointmentSuccess = false;
            state.appointmentMessage = "";
            state.appointmentError = null;

            state.success = false;
            state.message = "";
            state.error = null;
        },

        // ==========================================
        // CLEAR ALL
        // ==========================================

        clearFrontOfficeAppointmentState: (state) => {
            Object.assign(state, initialState);
        },

        // ==========================================
        // SELECT DOCTOR
        // ==========================================

        setSelectedFrontOfficeDoctor: (state, action) => {
            state.selectedDoctor = action.payload;
        },

        // ==========================================
        // SET DOCTORS
        // ==========================================

        setFrontOfficeDoctors: (state, action) => {
            state.doctors = action.payload || [];
        },
    },

    extraReducers: (builder) => {
        // ==========================================
        // CONFIRM APPOINTMENT
        // ==========================================

        builder

            .addCase(
                confirmFrontOfficeAppointment.pending,
                (state) => {
                    state.confirmingAppointment = true;
                    state.appointmentSuccess = false;
                    state.appointmentMessage = "";
                    state.appointmentError = null;

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                confirmFrontOfficeAppointment.fulfilled,
                (state, action) => {
                    state.confirmingAppointment = false;
                    state.loading = false;

                    state.appointmentSuccess = true;

                    state.appointmentMessage =
                        action.payload?.message ||
                        "Appointment confirmed successfully.";

                    state.message =
                        state.appointmentMessage;
                }
            )

            .addCase(
                confirmFrontOfficeAppointment.rejected,
                (state, action) => {
                    state.confirmingAppointment = false;
                    state.loading = false;

                    state.appointmentSuccess = false;

                    state.appointmentError =
                        action.payload ||
                        "Failed to confirm appointment.";

                    state.error =
                        state.appointmentError;
                }
            );

        // ==========================================
        // CREATE DOCTOR
        // ==========================================

        builder

            .addCase(
                createFrontOfficeDoctor.pending,
                (state) => {
                    state.creatingDoctor = true;
                    state.loading = true;
                    state.error = null;
                    state.message = "";
                }
            )

            .addCase(
                createFrontOfficeDoctor.fulfilled,
                (state, action) => {
                    state.creatingDoctor = false;
                    state.loading = false;

                    const doctor =
                        action.payload?.data;

                    if (doctor) {
                        state.doctors.push(doctor);
                    }

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Doctor created successfully.";
                }
            )

            .addCase(
                createFrontOfficeDoctor.rejected,
                (state, action) => {
                    state.creatingDoctor = false;
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to create doctor.";
                }
            );

        // ==========================================
        // UPDATE DOCTOR
        // ==========================================

        builder

            .addCase(
                updateFrontOfficeDoctor.pending,
                (state) => {
                    state.updatingDoctor = true;
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                updateFrontOfficeDoctor.fulfilled,
                (state, action) => {
                    state.updatingDoctor = false;
                    state.loading = false;

                    const updatedDoctor =
                        action.payload?.data;

                    if (updatedDoctor) {
                        state.doctors =
                            state.doctors.map(
                                (doctor) =>
                                    doctor.id === updatedDoctor.id
                                        ? updatedDoctor
                                        : doctor
                            );

                        if (
                            state.selectedDoctor?.id ===
                            updatedDoctor.id
                        ) {
                            state.selectedDoctor =
                                updatedDoctor;
                        }
                    }

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Doctor updated successfully.";
                }
            )

            .addCase(
                updateFrontOfficeDoctor.rejected,
                (state, action) => {
                    state.updatingDoctor = false;
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to update doctor.";
                }
            );

        // ==========================================
        // TOGGLE DOCTOR STATUS
        // ==========================================

        builder

            .addCase(
                toggleFrontOfficeDoctorStatus.pending,
                (state) => {
                    state.togglingDoctor = true;
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                toggleFrontOfficeDoctorStatus.fulfilled,
                (state, action) => {
                    state.togglingDoctor = false;
                    state.loading = false;

                    const updatedDoctor =
                        action.payload?.data;

                    if (updatedDoctor) {
                        state.doctors =
                            state.doctors.map(
                                (doctor) =>
                                    doctor.id === updatedDoctor.id
                                        ? {
                                            ...doctor,
                                            is_active:
                                                updatedDoctor.is_active,
                                        }
                                        : doctor
                            );

                        if (
                            state.selectedDoctor?.id ===
                            updatedDoctor.id
                        ) {
                            state.selectedDoctor = {
                                ...state.selectedDoctor,
                                is_active:
                                    updatedDoctor.is_active,
                            };
                        }
                    }

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Doctor status updated successfully.";
                }
            )

            .addCase(
                toggleFrontOfficeDoctorStatus.rejected,
                (state, action) => {
                    state.togglingDoctor = false;
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to update doctor status.";
                }
            );

        // ==========================================
        // ADD DOCTOR SCHEDULE
        // ==========================================

        builder

            .addCase(
                addFrontOfficeDoctorSchedule.pending,
                (state) => {
                    state.addingSchedule = true;
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                addFrontOfficeDoctorSchedule.fulfilled,
                (state, action) => {
                    state.addingSchedule = false;
                    state.loading = false;

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Doctor schedule added successfully.";
                }
            )

            .addCase(
                addFrontOfficeDoctorSchedule.rejected,
                (state, action) => {
                    state.addingSchedule = false;
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to add doctor schedule.";
                }
            );

        // ==========================================
        // DELETE DOCTOR SCHEDULE
        // ==========================================

        builder

            .addCase(
                deleteFrontOfficeDoctorSchedule.pending,
                (state) => {
                    state.deletingSchedule = true;
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                deleteFrontOfficeDoctorSchedule.fulfilled,
                (state, action) => {
                    state.deletingSchedule = false;
                    state.loading = false;

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Schedule deleted successfully.";
                }
            )

            .addCase(
                deleteFrontOfficeDoctorSchedule.rejected,
                (state, action) => {
                    state.deletingSchedule = false;
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to delete schedule.";
                }
            );

        // ==========================================
        // DELETE DOCTOR
        // ==========================================

        builder

            .addCase(
                deleteFrontOfficeDoctor.pending,
                (state) => {
                    state.deletingDoctor = true;
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                deleteFrontOfficeDoctor.fulfilled,
                (state, action) => {
                    state.deletingDoctor = false;
                    state.loading = false;

                    const deletedId =
                        action.meta?.arg;

                    if (deletedId) {
                        state.doctors =
                            state.doctors.filter(
                                (doctor) =>
                                    doctor.id !== deletedId
                            );

                        if (
                            state.selectedDoctor?.id ===
                            deletedId
                        ) {
                            state.selectedDoctor = null;
                        }
                    }

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Doctor deleted successfully.";
                }
            )
        builder

            .addCase(
                loadInsuranceList.pending,
                (state) => {

                    state.insuranceLoading = true;
                    state.insuranceError = null;

                }
            )

            .addCase(
                loadInsuranceList.fulfilled,
                (state, action) => {

                    state.insuranceLoading = false;

                    state.insuranceList =
                        action.payload?.data || [];

                }
            )

            .addCase(
                loadInsuranceList.rejected,
                (state, action) => {

                    state.insuranceLoading = false;

                    state.insuranceError =
                        action.payload ||
                        "Failed to load insurance list";

                }
            )

            .addCase(
                loadPackages.pending,
                (state) => {
                    state.packagesLoading = true;
                    state.packagesError = null;
                }
            )

            .addCase(
                loadPackages.fulfilled,
                (state, action) => {
                    state.packagesLoading = false;

                    state.packages =
                        action.payload?.data || [];

                    state.packagesCount =
                        action.payload?.count ||
                        action.payload?.total_records ||
                        0;
                }
            )

            .addCase(
                loadPackages.rejected,
                (state, action) => {
                    state.packagesLoading = false;

                    state.packagesError =
                        action.payload ||
                        "Failed to load packages";
                }
            )
        builder

            // ==========================================
            // REFERRAL LIST
            // ==========================================

            .addCase(
                loadReferralList.pending,
                (state) => {

                    state.referralLoading = true;
                    state.referralError = null;

                }
            )

            .addCase(
                loadReferralList.fulfilled,
                (state, action) => {

                    state.referralLoading = false;

                    state.referralList =
                        action.payload?.data || [];

                }
            )

            .addCase(
                loadReferralList.rejected,
                (state, action) => {

                    state.referralLoading = false;

                    state.referralError =
                        action.payload ||
                        "Failed to load referral list";

                }
            )

        // ==========================================
        // GET DOCTOR LIST
        // ==========================================

        builder

            .addCase(
                loadFrontOfficeDoctors.pending,
                (state) => {

                    state.loadingDoctors = true;
                    state.error = null;

                }
            )

            .addCase(
                loadFrontOfficeDoctors.fulfilled,
                (state, action) => {

                    state.loadingDoctors = false;

                    state.doctors =
                        action.payload?.data || [];

                }
            )

            .addCase(
                loadFrontOfficeDoctors.rejected,
                (state, action) => {

                    state.loadingDoctors = false;

                    state.error =
                        action.payload ||
                        "Failed to load doctors.";

                }
            )
        builder

            .addCase(
                loadMedicalCampList.pending,
                (state) => {
                    state.medicalCampLoading = true;
                    state.medicalCampError = null;
                }
            )

            .addCase(
                loadMedicalCampList.fulfilled,
                (state, action) => {
                    state.medicalCampLoading = false;

                    state.medicalCampList =
                        action.payload?.data || [];

                    state.medicalCampTotal =
                        action.payload?.total_records ||
                        action.payload?.count ||
                        0;

                    state.medicalCampError = null;
                }
            )

            .addCase(
                loadMedicalCampList.rejected,
                (state, action) => {
                    state.medicalCampLoading = false;

                    state.medicalCampError =
                        action.payload ||
                        "Failed to load medical camps";

                    state.medicalCampList = [];
                }
            )

            // ==========================================
            // MEDICAL CAMP LIST
            // ==========================================



            // ==========================================
            // MEDICAL CAMP DETAILS
            // ==========================================

            .addCase(
                loadMedicalCampDetails.pending,
                (state) => {
                    state.medicalCampDetailsLoading = true;
                    state.medicalCampDetailsError = null;
                }
            )

            .addCase(
                loadMedicalCampDetails.fulfilled,
                (state, action) => {
                    state.medicalCampDetailsLoading = false;

                    state.medicalCampDetails =
                        action.payload?.data || null;
                }
            )

            .addCase(
                loadMedicalCampDetails.rejected,
                (state, action) => {
                    state.medicalCampDetailsLoading = false;

                    state.medicalCampDetailsError =
                        action.payload ||
                        "Failed to load medical camp details";
                }
            )

            // ==========================================
// REGISTER MEDICAL CAMP PATIENT
// ==========================================

builder

    .addCase(
        registerFrontOfficeMedicalCampPatient.pending,
        (state) => {

            state.medicalCampRegistering = true;

            state.medicalCampRegisterSuccess = false;

            state.medicalCampRegisterMessage = "";

            state.medicalCampRegisterError = null;

            state.loading = true;

            state.error = null;
        }
    )

    .addCase(
        registerFrontOfficeMedicalCampPatient.fulfilled,
        (state, action) => {

            state.medicalCampRegistering = false;

            state.loading = false;

            state.medicalCampRegisterSuccess = true;

            state.medicalCampRegisterMessage =
                action.payload?.message ||
                "Patient registered for medical camp successfully.";

            state.medicalCampRegisterError = null;

            state.success = true;

            state.message =
                state.medicalCampRegisterMessage;
        }
    )

    .addCase(
        registerFrontOfficeMedicalCampPatient.rejected,
        (state, action) => {

            state.medicalCampRegistering = false;

            state.loading = false;

            state.medicalCampRegisterSuccess = false;

            state.medicalCampRegisterError =
                action.payload ||
                "Failed to register patient for medical camp.";

            state.error =
                state.medicalCampRegisterError;
        }
    )


            .addCase(
                deleteFrontOfficeDoctor.rejected,
                (state, action) => {
                    state.deletingDoctor = false;
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to delete doctor.";
                }
            );
    },
});

// ==========================================
// ACTIONS
// ==========================================

export const {
    clearFrontOfficeAppointmentMessage,
    clearFrontOfficeAppointmentState,
    setSelectedFrontOfficeDoctor,
    setFrontOfficeDoctors,
} = frontOfficeAppointmentSlice.actions;

// ==========================================
// SELECTORS
// ==========================================

export const selectFrontOfficeAppointment =
    (state) =>
        state.frontOfficeAppointment;

export const selectFrontOfficeDoctors =
    (state) =>
        state.frontOfficeAppointment?.doctors || [];

export const selectSelectedFrontOfficeDoctor =
    (state) =>
        state.frontOfficeAppointment?.selectedDoctor ||
        null;

export const selectMedicalCampList =
    (state) =>
        state.frontOfficeAppointment?.medicalCampList || [];


export const selectMedicalCampDetails =
    (state) =>
        state.frontOfficeAppointment?.medicalCampDetails || null;


export const selectMedicalCampRegistering =
    (state) =>
        state.frontOfficeAppointment?.medicalCampRegistering || false;


export const selectMedicalCampRegisterSuccess =
    (state) =>
        state.frontOfficeAppointment?.medicalCampRegisterSuccess || false;


export const selectMedicalCampRegisterMessage =
    (state) =>
        state.frontOfficeAppointment?.medicalCampRegisterMessage || "";


export const selectMedicalCampRegisterError =
    (state) =>
        state.frontOfficeAppointment?.medicalCampRegisterError || null;

// ==========================================
// REDUCER
// ==========================================

export default frontOfficeAppointmentSlice.reducer;