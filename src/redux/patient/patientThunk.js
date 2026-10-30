import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPatientProfile,
  fetchTreatments,
  fetchAvailableSlots,
  createTreatmentBooking,
  fetchDoctors,
  fetchDoctorById,
  fetchDoctorSlots,
  createAppointmentBooking,
  fetchHomeVisitDoctors,
  fetchHomeServiceAvailableSlots,
  createHomeServiceBooking,
  updatePatientAddress as updatePatientAddressService,
} from "../../services/patientService";

// ==========================================
// 1. LOAD PATIENT PROFILE & VITALS
// ==========================================
export const loadPatientProfile = createAsyncThunk(
  "patient/loadProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPatientProfile();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load patient profile."
      );
    }
  }
);

// ==========================================
// 2. LOAD TREATMENTS / THERAPIES
// ==========================================
export const loadTreatments = createAsyncThunk(
  "patient/loadTreatments",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchTreatments(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load treatments."
      );
    }
  }
);

// ==========================================
// 3. LOAD AVAILABLE SLOTS
// ==========================================
export const loadAvailableSlots = createAsyncThunk(
  "patient/loadAvailableSlots",
  async (date, { rejectWithValue }) => {
    try {
      return await fetchAvailableSlots(date);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load available slots."
      );
    }
  }
);

// ==========================================
// 4. BOOK THERAPY SESSION
// ==========================================
export const bookTherapySession = createAsyncThunk(
  "patient/bookTherapySession",
  async (payload, { rejectWithValue }) => {
    try {
      return await createTreatmentBooking(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to book therapy."
      );
    }
  }
);

// ==========================================
// 5. LOAD DOCTORS / PRACTITIONERS
// ==========================================
export const loadDoctors = createAsyncThunk(
  "patient/loadDoctors",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchDoctors(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load doctors."
      );
    }
  }
);

// ==========================================
// 6. LOAD DOCTOR BY ID
// ==========================================
export const loadDoctorById = createAsyncThunk(
  "patient/loadDoctorById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchDoctorById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load doctor."
      );
    }
  }
);

// ==========================================
// 7. LOAD DOCTOR AVAILABLE SLOTS
// ==========================================
export const loadDoctorAvailableSlots = createAsyncThunk(
  "patient/loadDoctorAvailableSlots",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchDoctorSlots(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load doctor slots."
      );
    }
  }
);

// ==========================================
// 8. BOOK DOCTOR APPOINTMENT
// ==========================================
export const bookDoctorAppointment = createAsyncThunk(
  "patient/bookDoctorAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      return await createAppointmentBooking(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to book appointment."
      );
    }
  }
);

// ==========================================
// 9. LOAD HOME VISIT DOCTORS
// ==========================================
export const loadHomeVisitDoctors = createAsyncThunk(
  "patient/loadHomeVisitDoctors",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchHomeVisitDoctors(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load home visit doctors."
      );
    }
  }
);

// ==========================================
// 10. LOAD HOME SERVICE AVAILABLE SLOTS
// ==========================================
export const loadHomeServiceAvailableSlots = createAsyncThunk(
  "patient/loadHomeServiceAvailableSlots",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchHomeServiceAvailableSlots(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load home service slots."
      );
    }
  }
);

// ==========================================
// 11. BOOK HOME SERVICE
// ==========================================
export const bookHomeService = createAsyncThunk(
  "patient/bookHomeService",
  async (payload, { rejectWithValue }) => {
    try {
      return await createHomeServiceBooking(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to book home visit."
      );
    }
  }
);

// ==========================================
// 12. UPDATE PATIENT ADDRESS
// ==========================================
export const updatePatientAddress = createAsyncThunk(
  "patient/updatePatientAddress",
  async (payload, { rejectWithValue }) => {
    try {
      return await updatePatientAddressService(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update address."
      );
    }
  }
);



