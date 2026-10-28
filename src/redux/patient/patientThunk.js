import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPatientProfile,
  fetchTreatments,
  fetchAvailableSlots,
  createTreatmentBooking,
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

