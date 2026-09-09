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
    loadFrontOfficeDoctorTimeSlots,
    createFrontOfficeDirectWalkInPatient,
    createFrontOfficeDirectWalkInMedicinePurchase,
    createFrontOfficeDirectWalkInTherapyBooking,
    loadFrontOfficeTherapies,
    loadAppointmentConfirmationList,
    loadFrontOfficeAppointmentConfirmation,
    loadFrontOfficeUpcomingAppointments,
} from "./frontOfficeAppointmentThunk";

const initialState = {
    // ==========================================
    // APPOINTMENT
    // ==========================================

    confirmingAppointment: false,
    appointmentSuccess: false,
    appointmentMessage: "",
    appointmentError: null,
    walkInCreating: false,
    walkInSuccess: false,
    walkInMessage: "",
    walkInData: null,
    walkInError: null,


    // ==========================================
    // UPCOMING APPOINTMENTS
    // ==========================================

    upcomingAppointments: [],
    upcomingAppointmentsLoading: false,
    upcomingAppointmentsError: null,

    upcomingAppointmentsPeriod: "week",
    upcomingAppointmentsPage: 1,
    upcomingAppointmentsLimit: 12,
    upcomingAppointmentsTotal: 0,
    upcomingAppointmentsTotalConsultations: 0,
    upcomingAppointmentsTotalPages: 0,
    upcomingAppointmentsShowing: "",
    // ==========================================
    // APPOINTMENT CONFIRMATION LIST
    // ==========================================

    appointmentConfirmationList: [],
    appointmentConfirmationListLoading: false,
    appointmentConfirmationListError: null,

    // ==========================================
    // APPOINTMENT CONFIRMATION DETAILS
    // ==========================================

    confirmation: null,
    confirmationLoading: false,
    confirmationError: null,
    doctorSlots: [],
    doctorSlotsLoading: false,
    doctorSlotsError: null,
    selectedDoctorSlot: null,
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
    // MEDICINE PURCHASE
    // ==========================================

    medicinePurchaseCreating: false,
    medicinePurchaseSuccess: false,
    medicinePurchaseMessage: "",
    medicinePurchaseData: null,
    medicinePurchaseError: null,

    // ==========================================
    // THERAPY BOOKING
    // ==========================================

    therapyBookingCreating: false,
    therapyBookingSuccess: false,
    therapyBookingMessage: "",
    therapyBookingData: null,
    therapyBookingError: null,

    // ==========================================
    // THERAPIES
    // ==========================================

    therapies: [],
    therapiesLoading: false,
    therapiesError: null,

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

        // ==========================================
        // CONFIRM / LOAD APPOINTMENT CONFIRMATION
        // ==========================================

        builder

            .addCase(
                confirmFrontOfficeAppointment.pending,
                (state, action) => {

                    const isConfirming =
                        Boolean(
                            action.meta?.arg?.appointment_id
                        );

                    if (isConfirming) {

                        state.confirmingAppointment = true;
                        state.appointmentSuccess = false;
                        state.appointmentMessage = "";
                        state.appointmentError = null;

                    } else {

                        state.confirmationLoading = true;
                        state.confirmationError = null;

                    }

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                confirmFrontOfficeAppointment.fulfilled,
                (state, action) => {

                    const isConfirming =
                        Boolean(
                            action.meta?.arg?.appointment_id
                        );

                    state.loading = false;

                    // ======================================
                    // LOAD CONFIRMATION DETAILS
                    // ======================================

                    if (!isConfirming) {

                        state.confirmationLoading = false;

                        state.confirmation =
                            action.payload?.data ||
                            action.payload ||
                            null;

                        state.confirmationError = null;

                        return;
                    }

                    // ======================================
                    // ACTUAL APPOINTMENT CONFIRMATION
                    // ======================================

                    state.confirmingAppointment = false;

                    state.appointmentSuccess = true;

                    state.appointmentMessage =
                        action.payload?.message ||
                        "Appointment confirmed successfully.";

                    state.appointmentError = null;

                    state.message =
                        state.appointmentMessage;
                }
            )

            .addCase(
                confirmFrontOfficeAppointment.rejected,
                (state, action) => {

                    const isConfirming =
                        Boolean(
                            action.meta?.arg?.appointment_id
                        );

                    state.loading = false;

                    if (isConfirming) {

                        state.confirmingAppointment = false;

                        state.appointmentSuccess = false;

                        state.appointmentError =
                            action.payload ||
                            "Failed to confirm appointment.";

                        state.error =
                            state.appointmentError;

                    } else {

                        state.confirmationLoading = false;

                        state.confirmationError =
                            action.payload ||
                            "Failed to load appointment confirmation.";

                        state.error =
                            state.confirmationError;
                    }
                }
            );

        // ==========================================
        // APPOINTMENT CONFIRMATION LIST
        // ==========================================

        builder

            .addCase(
                loadAppointmentConfirmationList.pending,
                (state) => {

                    state.appointmentConfirmationListLoading =
                        true;

                    state.appointmentConfirmationListError =
                        null;
                }
            )

            .addCase(
                loadAppointmentConfirmationList.fulfilled,
                (state, action) => {

                    state.appointmentConfirmationListLoading =
                        false;

                    state.appointmentConfirmationList =
                        action.payload?.data ||
                        [];

                    state.appointmentConfirmationListError =
                        null;
                }
            )

            .addCase(
                loadAppointmentConfirmationList.rejected,
                (state, action) => {

                    state.appointmentConfirmationListLoading =
                        false;

                    state.appointmentConfirmationListError =
                        action.payload ||
                        "Failed to load appointment confirmations.";

                    state.appointmentConfirmationList =
                        [];
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
        // =====================================================
        // CREATE DIRECT WALK-IN PATIENT
        // =====================================================

        builder
            .addCase(
                createFrontOfficeDirectWalkInPatient.pending,
                (state) => {
                    state.walkInCreating = true;
                    state.walkInSuccess = false;
                    state.walkInMessage = "";
                    state.walkInData = null;
                    state.walkInError = null;
                }
            )
            .addCase(
                createFrontOfficeDirectWalkInPatient.fulfilled,
                (state, action) => {
                    state.walkInCreating = false;
                    state.walkInSuccess = true;

                    state.walkInMessage =
                        action.payload?.message ||
                        "Direct walk-in patient appointment created successfully!";

                    state.walkInData =
                        action.payload?.data || null;
                }
            )
            .addCase(
                createFrontOfficeDirectWalkInPatient.rejected,
                (state, action) => {
                    state.walkInCreating = false;
                    state.walkInSuccess = false;

                    state.walkInError =
                        action.payload || "Failed to create walk-in appointment.";
                }
            )


        // =====================================================
        // DOCTOR TIME SLOTS
        // =====================================================

        builder
            .addCase(
                loadFrontOfficeDoctorTimeSlots.pending,
                (state) => {
                    state.doctorSlotsLoading = true;
                    state.doctorSlotsError = null;
                    state.doctorSlots = [];
                    state.selectedDoctorSlot = null;
                }
            )
            .addCase(
                loadFrontOfficeDoctorTimeSlots.fulfilled,
                (state, action) => {
                    state.doctorSlotsLoading = false;

                    state.doctorSlots =
                        action.payload?.slots ||
                        action.payload?.data?.slots ||
                        [];
                }
            )
            .addCase(
                loadFrontOfficeDoctorTimeSlots.rejected,
                (state, action) => {
                    state.doctorSlotsLoading = false;

                    state.doctorSlotsError =
                        action.payload || "Failed to load doctor slots.";

                    state.doctorSlots = [];
                }
            );
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

        // ==========================================
        // LOAD APPOINTMENT CONFIRMATION
        // ==========================================

        builder

            .addCase(
                loadFrontOfficeAppointmentConfirmation.pending,
                (state) => {

                    state.confirmationLoading = true;
                    state.confirmationError = null;
                    state.confirmation = null;

                }
            )

            .addCase(
                loadFrontOfficeAppointmentConfirmation.fulfilled,
                (state, action) => {

                    state.confirmationLoading = false;
                    state.confirmationError = null;

                    state.confirmation =
                        action.payload?.data ||
                        null;

                }
            )

            .addCase(
                loadFrontOfficeAppointmentConfirmation.rejected,
                (state, action) => {

                    state.confirmationLoading = false;

                    state.confirmationError =
                        action.payload?.message ||
                        action.payload ||
                        "Failed to load appointment confirmation.";

                }
            );
        // =====================================================
        // CREATE DIRECT WALK-IN MEDICINE PURCHASE
        // =====================================================

        builder
            .addCase(
                createFrontOfficeDirectWalkInMedicinePurchase.pending,
                (state) => {
                    state.medicinePurchaseCreating = true;
                    state.medicinePurchaseSuccess = false;
                    state.medicinePurchaseMessage = "";
                    state.medicinePurchaseData = null;
                    state.medicinePurchaseError = null;
                }
            )

            .addCase(
                createFrontOfficeDirectWalkInMedicinePurchase.fulfilled,
                (state, action) => {
                    state.medicinePurchaseCreating = false;
                    state.medicinePurchaseSuccess = true;

                    state.medicinePurchaseMessage =
                        action.payload?.message ||
                        "Medicine purchase created successfully!";

                    state.medicinePurchaseData =
                        action.payload?.data || null;
                }
            )

            .addCase(
                createFrontOfficeDirectWalkInMedicinePurchase.rejected,
                (state, action) => {
                    state.medicinePurchaseCreating = false;
                    state.medicinePurchaseSuccess = false;

                    state.medicinePurchaseError =
                        action.payload ||
                        "Failed to create medicine purchase.";
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
            )
        // =====================================================
        // CREATE DIRECT WALK-IN THERAPY BOOKING
        // =====================================================
        // ==========================================
// UPCOMING APPOINTMENTS LIST
// ==========================================

builder

    .addCase(
        loadFrontOfficeUpcomingAppointments.pending,
        (state) => {

            state.upcomingAppointmentsLoading =
                true;

            state.upcomingAppointmentsError =
                null;

        }
    )


    .addCase(
        loadFrontOfficeUpcomingAppointments.fulfilled,
        (
            state,
            action
        ) => {

            state.upcomingAppointmentsLoading =
                false;

            state.upcomingAppointmentsError =
                null;


            const response =
                action.payload || {};


            state.upcomingAppointments =
                response.data || [];


            state.upcomingAppointmentsPeriod =
                response.period ||
                "week";


            state.upcomingAppointmentsPage =
                response.page ||
                1;


            state.upcomingAppointmentsLimit =
                response.limit ||
                12;


            state.upcomingAppointmentsTotal =
                response.total ||
                0;


            state.upcomingAppointmentsTotalConsultations =
                response.total_consultations ||
                0;


            state.upcomingAppointmentsTotalPages =
                response.total_pages ||
                0;


            state.upcomingAppointmentsShowing =
                response.showing ||
                "";

        }
    )


    .addCase(
        loadFrontOfficeUpcomingAppointments.rejected,
        (
            state,
            action
        ) => {

            state.upcomingAppointmentsLoading =
                false;

            state.upcomingAppointmentsError =
                action.payload ||
                "Failed to load upcoming appointments.";

            state.upcomingAppointments =
                [];

        }
    )
        builder
            .addCase(
                createFrontOfficeDirectWalkInTherapyBooking.pending,
                (state) => {
                    state.therapyBookingCreating = true;
                    state.therapyBookingSuccess = false;
                    state.therapyBookingMessage = "";
                    state.therapyBookingData = null;
                    state.therapyBookingError = null;
                }
            )

            .addCase(
                createFrontOfficeDirectWalkInTherapyBooking.fulfilled,
                (state, action) => {
                    state.therapyBookingCreating = false;
                    state.therapyBookingSuccess = true;

                    state.therapyBookingMessage =
                        action.payload?.message ||
                        "Therapy booking created successfully!";

                    state.therapyBookingData =
                        action.payload?.data || null;
                }
            )

            .addCase(
                createFrontOfficeDirectWalkInTherapyBooking.rejected,
                (state, action) => {
                    state.therapyBookingCreating = false;
                    state.therapyBookingSuccess = false;

                    state.therapyBookingError =
                        action.payload ||
                        "Failed to create therapy booking.";
                }
            )
        // =====================================================
        // LOAD THERAPIES
        // =====================================================

        builder
            .addCase(
                loadFrontOfficeTherapies.pending,
                (state) => {
                    state.therapiesLoading = true;
                    state.therapiesError = null;
                }
            )

            .addCase(
                loadFrontOfficeTherapies.fulfilled,
                (state, action) => {
                    state.therapiesLoading = false;

                    state.therapies =
                        action.payload?.data || [];
                }
            )

            .addCase(
                loadFrontOfficeTherapies.rejected,
                (state, action) => {
                    state.therapiesLoading = false;

                    state.therapiesError =
                        action.payload ||
                        "Failed to load therapies.";

                    state.therapies = [];
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
export const selectWalkInCreating =
    (state) =>
        state.frontOfficeAppointment?.walkInCreating || false;

export const selectWalkInSuccess =
    (state) =>
        state.frontOfficeAppointment?.walkInSuccess || false;

export const selectWalkInMessage =
    (state) =>
        state.frontOfficeAppointment?.walkInMessage || "";

export const selectWalkInData =
    (state) =>
        state.frontOfficeAppointment?.walkInData || null;

export const selectWalkInError =
    (state) =>
        state.frontOfficeAppointment?.walkInError || null;

export const selectDoctorTimeSlots =
    (state) =>
        state.frontOfficeAppointment?.doctorSlots || [];

export const selectDoctorSlotsLoading =
    (state) =>
        state.frontOfficeAppointment?.doctorSlotsLoading || false;

export const selectDoctorSlotsError =
    (state) =>
        state.frontOfficeAppointment?.doctorSlotsError || null;
// ==========================================
// REDUCER
// ==========================================
// ==========================================
// MEDICINE PURCHASE SELECTORS
// ==========================================

export const selectMedicinePurchaseCreating =
    (state) =>
        state.frontOfficeAppointment?.medicinePurchaseCreating || false;

export const selectMedicinePurchaseSuccess =
    (state) =>
        state.frontOfficeAppointment?.medicinePurchaseSuccess || false;

export const selectMedicinePurchaseMessage =
    (state) =>
        state.frontOfficeAppointment?.medicinePurchaseMessage || "";

export const selectMedicinePurchaseData =
    (state) =>
        state.frontOfficeAppointment?.medicinePurchaseData || null;

export const selectMedicinePurchaseError =
    (state) =>
        state.frontOfficeAppointment?.medicinePurchaseError || null;


// ==========================================
// THERAPY BOOKING SELECTORS
// ==========================================

export const selectTherapyBookingCreating =
    (state) =>
        state.frontOfficeAppointment?.therapyBookingCreating || false;

export const selectTherapyBookingSuccess =
    (state) =>
        state.frontOfficeAppointment?.therapyBookingSuccess || false;

export const selectTherapyBookingMessage =
    (state) =>
        state.frontOfficeAppointment?.therapyBookingMessage || "";

export const selectTherapyBookingData =
    (state) =>
        state.frontOfficeAppointment?.therapyBookingData || null;

export const selectTherapyBookingError =
    (state) =>
        state.frontOfficeAppointment?.therapyBookingError || null;


// ==========================================
// THERAPY LIST SELECTORS
// ==========================================

export const selectFrontOfficeTherapies =
    (state) =>
        state.frontOfficeAppointment?.therapies || [];

export const selectFrontOfficeTherapiesLoading =
    (state) =>
        state.frontOfficeAppointment?.therapiesLoading || false;

export const selectFrontOfficeTherapiesError =
    (state) =>
        state.frontOfficeAppointment?.therapiesError || null;


export const selectAppointmentConfirmationList =
    (state) =>
        state.frontOfficeAppointment
            ?.appointmentConfirmationList || [];

export const selectAppointmentConfirmationListLoading =
    (state) =>
        state.frontOfficeAppointment
            ?.appointmentConfirmationListLoading || false;

export const selectAppointmentConfirmationListError =
    (state) =>
        state.frontOfficeAppointment
            ?.appointmentConfirmationListError || null;

export const selectAppointmentConfirmation =
    (state) =>
        state.frontOfficeAppointment
            ?.confirmation || null;

export const selectAppointmentConfirmationLoading =
    (state) =>
        state.frontOfficeAppointment
            ?.confirmationLoading || false;

export const selectAppointmentConfirmationError =
    (state) =>
        state.frontOfficeAppointment
            ?.confirmationError || null;

// ==========================================
// APPOINTMENT CONFIRMATION SELECTORS
// ==========================================

export const selectFrontOfficeAppointmentConfirmation =
    (state) =>
        state.frontOfficeAppointment
            ?.confirmation || null;

export const selectFrontOfficeAppointmentConfirmationLoading =
    (state) =>
        state.frontOfficeAppointment
            ?.confirmationLoading || false;

export const selectFrontOfficeAppointmentConfirmationError =
    (state) =>
        state.frontOfficeAppointment
            ?.confirmationError || null;

// ==========================================
// UPCOMING APPOINTMENTS SELECTORS
// ==========================================

export const selectFrontOfficeUpcomingAppointments =
    (state) =>
        state.frontOfficeAppointment
            ?.upcomingAppointments || [];


export const selectFrontOfficeUpcomingAppointmentsLoading =
    (state) =>
        state.frontOfficeAppointment
            ?.upcomingAppointmentsLoading || false;


export const selectFrontOfficeUpcomingAppointmentsError =
    (state) =>
        state.frontOfficeAppointment
            ?.upcomingAppointmentsError || null;


export const selectFrontOfficeUpcomingAppointmentsPeriod =
    (state) =>
        state.frontOfficeAppointment
            ?.upcomingAppointmentsPeriod || "week";


export const selectFrontOfficeUpcomingAppointmentsPage =
    (state) =>
        state.frontOfficeAppointment
            ?.upcomingAppointmentsPage || 1;


export const selectFrontOfficeUpcomingAppointmentsTotal =
    (state) =>
        state.frontOfficeAppointment
            ?.upcomingAppointmentsTotal || 0;


export const selectFrontOfficeUpcomingAppointmentsTotalPages =
    (state) =>
        state.frontOfficeAppointment
            ?.upcomingAppointmentsTotalPages || 0;


export const selectFrontOfficeUpcomingAppointmentsShowing =
    (state) =>
        state.frontOfficeAppointment
            ?.upcomingAppointmentsShowing || "";
export default frontOfficeAppointmentSlice.reducer;