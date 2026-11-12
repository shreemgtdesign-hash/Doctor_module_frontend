import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNurseDashboard,
  fetchNursePatients,
  fetchNurseAdmissionDetail,
  submitAssignRoomAndAdmit,
  fetchPatientDailyLog,
  submitPatientDailyLog,
  fetchMealsMenu,
  fetchPendingMedicines,
  fetchPendingMeals,
  fetchActivitiesIncomplete,
  fetchPhotoUploadsDue,
  fetchWardSummary,
  fetchNurseNotifications,
  markNurseNotificationRead,
  markAllNurseNotificationsRead,
  fetchPendingPatientLogs,
  fetchStayFeedback,
  postStayFeedback,
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

export const loadMealsMenu = createAsyncThunk(
  "nurse/loadMealsMenu",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMealsMenu();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load meals menu."
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

export const loadPendingMeals = createAsyncThunk(
  "nurse/loadPendingMeals",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchPendingMeals(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load pending meals."
      );
    }
  }
);

export const loadActivitiesIncomplete = createAsyncThunk(
  "nurse/loadActivitiesIncomplete",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchActivitiesIncomplete(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load incomplete activities."
      );
    }
  }
);

export const loadPhotoUploadsDue = createAsyncThunk(
  "nurse/loadPhotoUploadsDue",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchPhotoUploadsDue(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load photo uploads due."
      );
    }
  }
);

export const loadWardSummary = createAsyncThunk(
  "nurse/loadWardSummary",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchWardSummary(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load ward summary."
      );
    }
  }
);

export const loadNurseNotifications = createAsyncThunk(
  "nurse/loadNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchNurseNotifications(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load nurse notifications."
      );
    }
  }
);

export const readNurseNotification = createAsyncThunk(
  "nurse/readNotification",
  async (id, { rejectWithValue }) => {
    try {
      return await markNurseNotificationRead(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to mark notification as read."
      );
    }
  }
);

export const readAllNurseNotifications = createAsyncThunk(
  "nurse/readAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await markAllNurseNotificationsRead();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to mark all notifications as read."
      );
    }
  }
);

export const loadPendingPatientLogs = createAsyncThunk(
  "nurse/loadPendingPatientLogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchPendingPatientLogs(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load pending patient logs."
      );
    }
  }
);

export const loadStayFeedback = createAsyncThunk(
  "nurse/loadStayFeedback",
  async (admissionId, { rejectWithValue }) => {
    try {
      return await fetchStayFeedback(admissionId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load stay feedback."
      );
    }
  }
);

export const saveStayFeedback = createAsyncThunk(
  "nurse/saveStayFeedback",
  async ({ admissionId, payload }, { rejectWithValue }) => {
    try {
      return await postStayFeedback(admissionId, payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit stay feedback."
      );
    }
  }
);

