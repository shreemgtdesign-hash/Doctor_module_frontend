import { createSlice } from "@reduxjs/toolkit";
import {
  loadNurseDashboard,
  loadNursePatients,
  loadNurseAdmissionDetail,
  admitPatientAndAssignRoom,
  loadPatientDailyLog,
  updatePatientDailyLog,
  loadPendingMedicines,
} from "./nurseThunk";

const initialState = {
  // Dashboard
  dashboard: null,
  dashboardLoading: false,
  dashboardError: null,
  period: "today",

  // IPD Patients List
  patientsList: {
    tab: "upcoming",
    counts: { upcoming: 0, admitted: 0, discharged: 0 },
    count: 0,
    data: [],
  },
  patientsLoading: false,
  patientsError: null,
  activeTab: "upcoming",

  // Admission details & Room assignment
  selectedAdmission: null,
  admissionLoading: false,
  admissionError: null,
  admitActionLoading: false,
  admitActionSuccess: false,
  admitActionError: null,

  // Patient Daily Log
  dailyLog: null,
  dailyLogLoading: false,
  dailyLogError: null,
  dailyLogSaving: false,

  // Pending Medicines
  pendingMedicines: [],
  medicinesLoading: false,
  medicinesError: null,
};

const nurseSlice = createSlice({
  name: "nurse",
  initialState,
  reducers: {
    setNursePeriod: (state, action) => {
      state.period = action.payload;
    },
    setActivePatientsTab: (state, action) => {
      state.activeTab = action.payload;
    },
    resetAdmitActionState: (state) => {
      state.admitActionLoading = false;
      state.admitActionSuccess = false;
      state.admitActionError = null;
    },
    clearNurseError: (state) => {
      state.dashboardError = null;
      state.patientsError = null;
      state.admissionError = null;
      state.admitActionError = null;
      state.dailyLogError = null;
      state.medicinesError = null;
    },
  },
  extraReducers: (builder) => {
    // ----------------------------------------------------
    // Nurse Dashboard
    // ----------------------------------------------------
    builder
      .addCase(loadNurseDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(loadNurseDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
        state.dashboardError = null;
      })
      .addCase(loadNurseDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload || "Failed to load nurse dashboard.";
      });

    // ----------------------------------------------------
    // Nurse Patients List
    // ----------------------------------------------------
    builder
      .addCase(loadNursePatients.pending, (state) => {
        state.patientsLoading = true;
        state.patientsError = null;
      })
      .addCase(loadNursePatients.fulfilled, (state, action) => {
        state.patientsLoading = false;
        state.patientsList = action.payload;
        if (action.payload?.tab) {
          state.activeTab = action.payload.tab;
        }
        state.patientsError = null;
      })
      .addCase(loadNursePatients.rejected, (state, action) => {
        state.patientsLoading = false;
        state.patientsError = action.payload || "Failed to load IPD patients.";
      });

    // ----------------------------------------------------
    // Admission Detail
    // ----------------------------------------------------
    builder
      .addCase(loadNurseAdmissionDetail.pending, (state) => {
        state.admissionLoading = true;
        state.admissionError = null;
        state.selectedAdmission = null;
      })
      .addCase(loadNurseAdmissionDetail.fulfilled, (state, action) => {
        state.admissionLoading = false;
        state.selectedAdmission = action.payload;
        state.admissionError = null;
      })
      .addCase(loadNurseAdmissionDetail.rejected, (state, action) => {
        state.admissionLoading = false;
        state.admissionError = action.payload || "Failed to load admission details.";
      });

    // ----------------------------------------------------
    // Assign Room & Admit Patient
    // ----------------------------------------------------
    builder
      .addCase(admitPatientAndAssignRoom.pending, (state) => {
        state.admitActionLoading = true;
        state.admitActionSuccess = false;
        state.admitActionError = null;
      })
      .addCase(admitPatientAndAssignRoom.fulfilled, (state) => {
        state.admitActionLoading = false;
        state.admitActionSuccess = true;
        state.admitActionError = null;
      })
      .addCase(admitPatientAndAssignRoom.rejected, (state, action) => {
        state.admitActionLoading = false;
        state.admitActionSuccess = false;
        state.admitActionError = action.payload || "Failed to assign room.";
      });

    // ----------------------------------------------------
    // Patient Daily Log
    // ----------------------------------------------------
    builder
      .addCase(loadPatientDailyLog.pending, (state) => {
        state.dailyLogLoading = true;
        state.dailyLogError = null;
      })
      .addCase(loadPatientDailyLog.fulfilled, (state, action) => {
        state.dailyLogLoading = false;
        state.dailyLog = action.payload;
        state.dailyLogError = null;
      })
      .addCase(loadPatientDailyLog.rejected, (state, action) => {
        state.dailyLogLoading = false;
        state.dailyLogError = action.payload || "Failed to load daily log.";
      })
      .addCase(updatePatientDailyLog.pending, (state) => {
        state.dailyLogSaving = true;
      })
      .addCase(updatePatientDailyLog.fulfilled, (state, action) => {
        state.dailyLogSaving = false;
        if (action.payload) {
          state.dailyLog = { ...state.dailyLog, ...action.payload };
        }
      })
      .addCase(updatePatientDailyLog.rejected, (state) => {
        state.dailyLogSaving = false;
      });

    // ----------------------------------------------------
    // Pending Medicines
    // ----------------------------------------------------
    builder
      .addCase(loadPendingMedicines.pending, (state) => {
        state.medicinesLoading = true;
        state.medicinesError = null;
      })
      .addCase(loadPendingMedicines.fulfilled, (state, action) => {
        state.medicinesLoading = false;
        state.pendingMedicines = action.payload || [];
        state.medicinesError = null;
      })
      .addCase(loadPendingMedicines.rejected, (state, action) => {
        state.medicinesLoading = false;
        state.medicinesError = action.payload || "Failed to load medicines.";
      });
  },
});

export const {
  setNursePeriod,
  setActivePatientsTab,
  resetAdmitActionState,
  clearNurseError,
} = nurseSlice.actions;

export const selectNurseDashboard = (state) => state.nurse?.dashboard;
export const selectNurseDashboardLoading = (state) => state.nurse?.dashboardLoading || false;
export const selectNurseDashboardError = (state) => state.nurse?.dashboardError;
export const selectNursePeriod = (state) => state.nurse?.period || "today";

export const selectNursePatientsList = (state) => state.nurse?.patientsList;
export const selectNursePatientsLoading = (state) => state.nurse?.patientsLoading || false;
export const selectNursePatientsError = (state) => state.nurse?.patientsError;
export const selectNurseActiveTab = (state) => state.nurse?.activeTab || "upcoming";

export const selectNurseSelectedAdmission = (state) => state.nurse?.selectedAdmission;
export const selectNurseAdmissionLoading = (state) => state.nurse?.admissionLoading || false;
export const selectNurseAdmissionError = (state) => state.nurse?.admissionError;
export const selectAdmitActionLoading = (state) => state.nurse?.admitActionLoading || false;
export const selectAdmitActionSuccess = (state) => state.nurse?.admitActionSuccess || false;
export const selectAdmitActionError = (state) => state.nurse?.admitActionError;

export const selectNurseDailyLog = (state) => state.nurse?.dailyLog;
export const selectNurseDailyLogLoading = (state) => state.nurse?.dailyLogLoading || false;
export const selectNurseDailyLogSaving = (state) => state.nurse?.dailyLogSaving || false;

export const selectNursePendingMedicines = (state) => state.nurse?.pendingMedicines;
export const selectNurseMedicinesLoading = (state) => state.nurse?.medicinesLoading || false;

export default nurseSlice.reducer;
