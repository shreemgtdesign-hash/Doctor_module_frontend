import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    fetchConfirmAppointmentSlot,
    fetchCreateDoctor,
    fetchUpdateDoctor,
    fetchToggleDoctorStatus,
    fetchDeleteDoctor,
    fetchAddDoctorSchedule,
    fetchDeleteDoctorSchedule,
    fetchInsuranceList,
    fetchReferralList,
    fetchPackages,
    fetchDoctorList,
    fetchMedicalCampList,
    fetchMedicalCampDetails,
    fetchRegisterMedicalCampPatient,
    fetchDoctorTimeSlots,
    fetchCreateDirectWalkInPatient,
    fetchCreateDirectWalkInMedicinePurchase,
    fetchCreateDirectWalkInTherapyBooking,
    fetchFrontOfficeTherapies,
    fetchAppointmentConfirmation,
} from "../../services/frontOfficeAppointmentService";
import { fetchAppointmentConfirmationList } from "../../services/therapistAppointmentsService";


// ==========================================
// CONFIRM APPOINTMENT SLOT
// ==========================================

export const confirmFrontOfficeAppointment =
    createAsyncThunk(

        "frontOfficeAppointment/confirmAppointment",

        async (
            appointmentData,
            { rejectWithValue }
        ) => {

            try {

                return await fetchConfirmAppointmentSlot(
                    appointmentData
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
// CREATE DOCTOR
// ==========================================

export const createFrontOfficeDoctor =
    createAsyncThunk(

        "frontOfficeAppointment/createDoctor",

        async (
            doctorData,
            { rejectWithValue }
        ) => {

            try {

                return await fetchCreateDoctor(
                    doctorData
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
// UPDATE DOCTOR
// ==========================================

export const updateFrontOfficeDoctor =
    createAsyncThunk(

        "frontOfficeAppointment/updateDoctor",

        async (
            {
                doctorId,
                data,
            },
            { rejectWithValue }
        ) => {

            try {

                return await fetchUpdateDoctor(
                    doctorId,
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
// TOGGLE DOCTOR STATUS
// ==========================================

export const toggleFrontOfficeDoctorStatus =
    createAsyncThunk(

        "frontOfficeAppointment/toggleDoctorStatus",

        async (
            doctorId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchToggleDoctorStatus(
                    doctorId
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
// DELETE DOCTOR
// ==========================================

export const deleteFrontOfficeDoctor =
    createAsyncThunk(

        "frontOfficeAppointment/deleteDoctor",

        async (
            doctorId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchDeleteDoctor(
                    doctorId
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
// ADD DOCTOR SCHEDULE
// ==========================================

export const addFrontOfficeDoctorSchedule =
    createAsyncThunk(

        "frontOfficeAppointment/addDoctorSchedule",

        async (
            scheduleData,
            { rejectWithValue }
        ) => {

            try {

                return await fetchAddDoctorSchedule(
                    scheduleData
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
// DELETE DOCTOR SCHEDULE
// ==========================================

export const deleteFrontOfficeDoctorSchedule =
    createAsyncThunk(

        "frontOfficeAppointment/deleteDoctorSchedule",

        async (
            scheduleId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchDeleteDoctorSchedule(
                    scheduleId
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
// GET INSURANCE LIST
// ==========================================

// ==========================================
// GET INSURANCE LIST
// ==========================================

export const loadInsuranceList =
    createAsyncThunk(

        "frontOfficeAppointment/loadInsuranceList",

        async (
            type = "",
            { rejectWithValue }
        ) => {

            try {

                return await fetchInsuranceList(
                    type
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
// GET REFERRAL LIST
// ==========================================

export const loadReferralList =
    createAsyncThunk(

        "frontOfficeAppointment/loadReferralList",

        async (
            params = {},
            { rejectWithValue }
        ) => {

            try {

                return await fetchReferralList(
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


export const loadPackages =
    createAsyncThunk(
        "frontOfficeAppointment/loadPackages",

        async (
            params = {},
            { rejectWithValue }
        ) => {
            try {
                return await fetchPackages(params);
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );
            }
        }
    );

export const loadFrontOfficeDoctors =
    createAsyncThunk(

        "frontOfficeAppointment/loadDoctors",

        async (
            params = {},
            { rejectWithValue }
        ) => {

            try {

                return await fetchDoctorList(
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

export const loadMedicalCampList =
    createAsyncThunk(
        "frontOfficeAppointment/loadMedicalCampList",

        async (
            params = {},
            { rejectWithValue }
        ) => {
            try {
                return await fetchMedicalCampList(
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

export const loadMedicalCampDetails =
    createAsyncThunk(
        "frontOfficeAppointment/loadMedicalCampDetails",

        async (
            campId,
            { rejectWithValue }
        ) => {
            try {
                return await fetchMedicalCampDetails(
                    campId
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
// REGISTER MEDICAL CAMP PATIENT
// ==========================================

export const registerFrontOfficeMedicalCampPatient =
    createAsyncThunk(

        "frontOfficeAppointment/registerMedicalCampPatient",

        async (
            patientData,
            { rejectWithValue }
        ) => {

            try {

                return await fetchRegisterMedicalCampPatient(
                    patientData
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }

    );

export const createFrontOfficeDirectWalkInPatient = createAsyncThunk(
    "frontOffice/createDirectWalkInPatient",
    async (patientData, { rejectWithValue }) => {
        try {
            return await fetchCreateDirectWalkInPatient(patientData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const loadFrontOfficeDoctorTimeSlots = createAsyncThunk(
    "frontOffice/loadDoctorTimeSlots",
    async ({ doctorId, date }, { rejectWithValue }) => {
        try {
            return await fetchDoctorTimeSlots(doctorId, date);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const createFrontOfficeDirectWalkInMedicinePurchase =
    createAsyncThunk(
        "frontOffice/createDirectWalkInMedicinePurchase",

        async (
            purchaseData,
            { rejectWithValue }
        ) => {
            try {
                return await fetchCreateDirectWalkInMedicinePurchase(
                    purchaseData
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );
            }
        }
    );

export const createFrontOfficeDirectWalkInTherapyBooking =
    createAsyncThunk(
        "frontOffice/createDirectWalkInTherapyBooking",

        async (
            therapyData,
            { rejectWithValue }
        ) => {
            try {
                return await fetchCreateDirectWalkInTherapyBooking(
                    therapyData
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );
            }
        }
    );

    export const loadFrontOfficeTherapies =
    createAsyncThunk(
        "frontOffice/loadTherapies",

        async (_, { rejectWithValue }) => {
            try {
                return await fetchFrontOfficeTherapies();
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );
            }
        }


    );

    // ==========================================
// APPOINTMENT CONFIRMATION LIST
// ==========================================

export const loadAppointmentConfirmationList =
    createAsyncThunk(
        "frontOfficeAppointment/loadAppointmentConfirmationList",
        async (_, { rejectWithValue }) => {

            try {

                return await fetchAppointmentConfirmationList();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }
    );


// ==========================================
// LOAD APPOINTMENT CONFIRMATION
// ==========================================

export const loadFrontOfficeAppointmentConfirmation =
    createAsyncThunk(
        "frontOfficeAppointment/loadAppointmentConfirmation",

        async (
            doctorId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchAppointmentConfirmation(
                    doctorId
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }
    );