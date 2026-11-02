import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNurseDashboard,
  fetchNursePatients,
  fetchNurseAdmissionDetail,
  submitAssignRoomAndAdmit,
  fetchPatientDailyLog,
  submitPatientDailyLog,
  fetchPendingMedicines,
} from "../../services/nurseService";

export const loadNurseDashboard = createAsyncThunk(
  "nurse/loadDashboard",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchNurseDashboard(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load nurse dashboard."
      );
    }
  }
);

export const loadNursePatients = createAsyncThunk(
  "nurse/loadPatients",
  async (params = { tab: "upcoming" }, { rejectWithValue }) => {
    try {
      return await fetchNursePatients(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load IPD patients list."
      );
    }
  }
);

export const loadNurseAdmissionDetail = createAsyncThunk(
  "nurse/loadAdmissionDetail",
  async (admissionId, { rejectWithValue }) => {
    try {
      return await fetchNurseAdmissionDetail(admissionId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load admission details."
      );
    }
  }
);

export const admitPatientAndAssignRoom = createAsyncThunk(
  "nurse/admitPatientAndAssignRoom",
  async ({ admissionId, payload }, { rejectWithValue }) => {
    try {
      return await submitAssignRoomAndAdmit(admissionId, payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to assign room and admit patient."
      );
    }
  }
);

export const loadPatientDailyLog = createAsyncThunk(
  "nurse/loadPatientDailyLog",
  async ({ patientId, params = {} }, { rejectWithValue }) => {
    try {
      return await fetchPatientDailyLog(patientId, params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load patient daily log."
      );
    }
  }
);

export const updatePatientDailyLog = createAsyncThunk(
  "nurse/updatePatientDailyLog",
  async ({ patientId, payload }, { rejectWithValue }) => {
    try {
      return await submitPatientDailyLog(patientId, payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to save patient daily log."
      );
    }
  }
);

export const loadPendingMedicines = createAsyncThunk(
  "nurse/loadPendingMedicines",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchPendingMedicines(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load pending medicines."
      );
    }
  }
);
