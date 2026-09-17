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
    saveFrontOfficeUpcomingAppointmentDetails,
    fetchFrontOfficeUpcomingAppointmentDetails,
    fetchFrontOfficeUpcomingAppointments,
    fetchUploadPatientReportFile,
    fetchCreatePatientReport,
    fetchConfirmAppointmentRoom,
    fetchHomevisitAppointmentConfirmation,
    fetchTherapyAppointmentConfirmation,
    fetchHomevisitConfirmationList,
    fetchTherapistList,
    fetchSelectTherapist,
    fetchAppointmentReminders,
    fetchTherapyReminders,
    fetchSendPendingActionReminder,
    fetchCreateMedicalCamp,
    fetchOnlineMedicineOrderDetails,
    fetchOnlineMedicineOrders,
} from "../../services/frontOfficeAppointmentService";
import { fetchAppointmentConfirmationList } from "../../services/therapistAppointmentsService";
import { fetchPatientReports } from "../../services/doctorAppointmentService";


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


export const loadFrontOfficeUpcomingAppointmentDetails =
    createAsyncThunk(

        "frontOfficeUpcomingAppointment/loadDetails",

        async (
            appointmentId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchFrontOfficeUpcomingAppointmentDetails(
                    appointmentId
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
// SAVE APPOINTMENT DETAILS
// ==========================================

export const saveFrontOfficeUpcomingAppointmentDetailsThunk =
    createAsyncThunk(

        "frontOfficeUpcomingAppointment/saveDetails",

        async (
            {
                appointmentId,
                payload,
            },
            { rejectWithValue }
        ) => {

            try {

                return await saveFrontOfficeUpcomingAppointmentDetails(
                    appointmentId,
                    payload
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
// LOAD UPCOMING APPOINTMENTS LIST
// ==========================================

export const loadFrontOfficeUpcomingAppointments =
    createAsyncThunk(

        "frontOfficeAppointment/loadUpcomingAppointments",

        async (
            {
                period = "week",
                page = 1,
                limit = 12,
            } = {},
            { rejectWithValue }
        ) => {

            try {

                return await fetchFrontOfficeUpcomingAppointments(
                    period,
                    page,
                    limit
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
// UPLOAD PATIENT REPORT FILE
// ==========================================

export const uploadFrontOfficePatientReportFile =
    createAsyncThunk(
        "frontOfficeAppointment/uploadPatientReportFile",

        async (
            formData,
            { rejectWithValue }
        ) => {

            try {

                return await fetchUploadPatientReportFile(
                    formData
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
// CREATE PATIENT REPORT RECORD
// ==========================================



// ==========================================
// GET PATIENT REPORTS
// ==========================================

export const loadFrontOfficePatientReports =
    createAsyncThunk(
        "frontOfficeAppointment/loadPatientReports",

        async (
            patientId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchPatientReports(
                    patientId
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );

            }

        }
    );

    export const createFrontOfficePatientReport =
    createAsyncThunk(
        "frontOfficeAppointment/createPatientReport",
        async (
            reportData,
            { rejectWithValue }
        ) => {
            try {
                return await fetchCreatePatientReport(
                    reportData
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
// CONFIRM APPOINTMENT WITH ROOM
// ==========================================

export const confirmFrontOfficeAppointmentRoom =
    createAsyncThunk(
        "frontOfficeAppointment/confirmAppointmentRoom",

        async (
            appointmentData,
            { rejectWithValue }
        ) => {

            try {

                return await fetchConfirmAppointmentRoom(
                    appointmentData
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to confirm appointment with room."
                );

            }

        }
    );


    // ==========================================
// LOAD THERAPY CONFIRMATION
// ==========================================

export const loadFrontOfficeTherapyAppointmentConfirmation =
    createAsyncThunk(

        "frontOfficeAppointment/loadTherapyAppointmentConfirmation",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                return await fetchTherapyAppointmentConfirmation();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load therapy confirmation."
                );

            }

        }
    );

    // ==========================================
// LOAD HOME VISIT CONFIRMATION
// ==========================================

export const loadFrontOfficeHomevisitAppointmentConfirmation =
    createAsyncThunk(

        "frontOfficeAppointment/loadHomevisitAppointmentConfirmation",

        async (
            doctorId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchHomevisitAppointmentConfirmation(
                    doctorId
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load home visit confirmation."
                );

            }

        }
    );

// ==========================================
// LOAD HOME VISIT CONFIRMATION LIST
// ==========================================

export const loadHomevisitConfirmationList =
    createAsyncThunk(

        "frontOfficeAppointment/loadHomevisitConfirmationList",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                return await fetchHomevisitConfirmationList();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load home visit confirmation list."
                );

            }

        }

    );

// ==========================================
// LOAD THERAPIST LIST
// ==========================================

export const loadTherapistList =
    createAsyncThunk(

        "frontOfficeAppointment/loadTherapistList",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                return await fetchTherapistList();

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load therapists."
                );

            }

        }

    );

    // ==========================================
// SELECT THERAPIST
// ==========================================

export const selectFrontOfficeTherapist =
    createAsyncThunk(

        "frontOfficeAppointment/selectTherapist",

        async (
            data,
            { rejectWithValue }
        ) => {

            try {

                return await fetchSelectTherapist(
                    data
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to select therapist."
                );

            }

        }

    );

// ==========================================
// LOAD APPOINTMENT REMINDERS
// ==========================================

export const loadAppointmentReminders =
    createAsyncThunk(

        "frontOfficeAppointment/loadAppointmentReminders",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await fetchAppointmentReminders();

                return response;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load appointment reminders."
                );

            }

        }
    );

// ==========================================
// LOAD THERAPY REMINDERS
// ==========================================

export const loadTherapyReminders =
    createAsyncThunk(

        "frontOfficeAppointment/loadTherapyReminders",

        async (
            _,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await fetchTherapyReminders();

                return response;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load therapy reminders."
                );

            }

        }
    );

    // ==========================================
// SEND PENDING ACTION REMINDER
// ==========================================

export const sendPendingActionReminder =
    createAsyncThunk(

        "frontOfficeAppointment/sendPendingActionReminder",

        async (
            data,
            { rejectWithValue }
        ) => {

            try {

                const response =
                    await fetchSendPendingActionReminder(
                        data
                    );

                return response;

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to send reminder."
                );

            }

        }
    );

    // ==========================================
// CREATE MEDICAL CAMP
// ==========================================

export const createFrontOfficeMedicalCamp =
    createAsyncThunk(

        "frontOfficeAppointment/createMedicalCamp",

        async (
            campData,
            { rejectWithValue }
        ) => {

            try {

                return await fetchCreateMedicalCamp(
                    campData
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to create medical camp."
                );

            }

        }

    );

    // ==========================================
// ONLINE MEDICINE ORDERS
// ==========================================

export const loadOnlineMedicineOrders =
    createAsyncThunk(

        "frontOfficeAppointment/loadOnlineMedicineOrders",

        async (
            {
                page = 1,
                limit = 8,
            } = {},
            { rejectWithValue }
        ) => {

            try {

                return await fetchOnlineMedicineOrders(
                    page,
                    limit
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load online medicine orders."
                );

            }

        }
    );


// ==========================================
// ONLINE MEDICINE ORDER DETAILS
// ==========================================

export const loadOnlineMedicineOrderDetails =
    createAsyncThunk(

        "frontOfficeAppointment/loadOnlineMedicineOrderDetails",

        async (
            orderId,
            { rejectWithValue }
        ) => {

            try {

                return await fetchOnlineMedicineOrderDetails(
                    orderId
                );

            } catch (error) {

                return rejectWithValue(
                    error.response?.data ||
                    error.message ||
                    "Failed to load medicine order details."
                );

            }

        }
    );