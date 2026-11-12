import { createSlice } from "@reduxjs/toolkit";
import {
  loadNurseDashboard,
  loadNursePatients,
  loadNurseAdmissionDetail,
  admitPatientAndAssignRoom,
  loadPatientDailyLog,
  updatePatientDailyLog,
  loadPendingMedicines,
  loadPendingMeals,
  loadActivitiesIncomplete,
  loadPhotoUploadsDue,
  loadWardSummary,
  loadNurseNotifications,
  readNurseNotification,
  readAllNurseNotifications,
  loadPendingPatientLogs,
  loadMealsMenu,
  loadStayFeedback,
  saveStayFeedback,
  extendDischargePeriod,
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

  // Meals Menu Dropdown
  mealsMenu: null,
  mealsMenuLoading: false,
  mealsMenuError: null,

  // Pending Medicines
  pendingMedicines: [],
  medicinesLoading: false,
  medicinesError: null,

  // Pending Meals
  pendingMeals: {
    data: [],
    summary: { open: 0, breakfast: 0, lunch: 0, dinner: 0 },
    header: {},
    count: 0,
    loading: false,
    error: null,
  },

  // Activities Incomplete
  activitiesIncomplete: {
    data: [],
    summary: { open: 0, morning: 0, therapy: 0, evening: 0 },
    header: {},
    count: 0,
    loading: false,
    error: null,
  },

  // Photo Uploads Due
  photoUploads: {
    data: [],
    summary: { due: 0, later_today: 0, therapy: 0, meals: 0 },
    header: {},
    count: 0,
    loading: false,
    error: null,
  },

  // Ward Summary (detail page)
  wardSummaryDetails: {
    data: [],
    filters: {
      selected_type: "ac",
      selected_status: "all",
      types: [],
      statuses: [],
    },
    counts: {
      total_rooms: 0,
      occupied: 0,
      available: 0,
      maintenance: 0,
      ac_rooms: 0,
      non_ac_rooms: 0,
      garden_rooms: 0,
    },
    summary: { engaged: 0, free: 0, maintenance: 0, total_rooms: 0 },
    header: {},
    count: 0,
    loading: false,
    error: null,
  },

  // Nurse Notifications
  notifications: {
    data: [],
    tabs: ["All", "Admissions", "Meals", "Activities", "Medicines", "Discharges"],
    active_tab: "All",
    unread_count: 0,
    loading: false,
    error: null,
  },

  // Pending Patient Logs
  pendingPatientLogs: {
    data: [],
    header: {},
    count: 0,
    loading: false,
    error: null,
  },

  // Stay Feedback
  stayFeedback: null,
  stayFeedbackLoading: false,
  stayFeedbackError: null,
  stayFeedbackSaving: false,
  stayFeedbackSuccess: false,

  // Extend Discharge
  extendDischargeLoading: false,
  extendDischargeSuccess: false,
  extendDischargeError: null,
  extendDischargeData: null,
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
    clearSelectedAdmission: (state) => {
      state.selectedAdmission = null;
      state.admissionError = null;
      state.admissionLoading = false;
    },
    clearStayFeedback: (state) => {
      state.stayFeedback = null;
      state.stayFeedbackLoading = false;
      state.stayFeedbackError = null;
      state.stayFeedbackSaving = false;
      state.stayFeedbackSuccess = false;
    },
    resetStayFeedbackSuccess: (state) => {
      state.stayFeedbackSuccess = false;
    },
    resetExtendDischargeState: (state) => {
      state.extendDischargeLoading = false;
      state.extendDischargeSuccess = false;
      state.extendDischargeError = null;
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
      })
      .addCase(loadMealsMenu.pending, (state) => {
        state.mealsMenuLoading = true;
        state.mealsMenuError = null;
      })
      .addCase(loadMealsMenu.fulfilled, (state, action) => {
        state.mealsMenuLoading = false;
        state.mealsMenu = action.payload || null;
      })
      .addCase(loadMealsMenu.rejected, (state, action) => {
        state.mealsMenuLoading = false;
        state.mealsMenuError = action.payload || "Failed to load meals menu.";
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

    // ----------------------------------------------------
    // Pending Meals
    // ----------------------------------------------------
    builder
      .addCase(loadPendingMeals.pending, (state) => {
        state.pendingMeals.loading = true;
        state.pendingMeals.error = null;
      })
      .addCase(loadPendingMeals.fulfilled, (state, action) => {
        state.pendingMeals.loading = false;
        const res = action.payload || {};
        state.pendingMeals.data = Array.isArray(res.data) ? res.data : [];
        state.pendingMeals.summary = res.summary || { open: 0, breakfast: 0, lunch: 0, dinner: 0 };
        state.pendingMeals.header = res.header || {};
        state.pendingMeals.count = res.count ?? state.pendingMeals.data.length;
        state.pendingMeals.error = null;
      })
      .addCase(loadPendingMeals.rejected, (state, action) => {
        state.pendingMeals.loading = false;
        state.pendingMeals.error = action.payload || "Failed to load pending meals.";
      });

    // ----------------------------------------------------
    // Activities Incomplete
    // ----------------------------------------------------
    builder
      .addCase(loadActivitiesIncomplete.pending, (state) => {
        state.activitiesIncomplete.loading = true;
        state.activitiesIncomplete.error = null;
      })
      .addCase(loadActivitiesIncomplete.fulfilled, (state, action) => {
        state.activitiesIncomplete.loading = false;
        const res = action.payload || {};
        state.activitiesIncomplete.data = Array.isArray(res.data) ? res.data : [];
        state.activitiesIncomplete.summary = res.summary || { open: 0, morning: 0, therapy: 0, evening: 0 };
        state.activitiesIncomplete.header = res.header || {};
        state.activitiesIncomplete.count = res.count ?? state.activitiesIncomplete.data.length;
        state.activitiesIncomplete.error = null;
      })
      .addCase(loadActivitiesIncomplete.rejected, (state, action) => {
        state.activitiesIncomplete.loading = false;
        state.activitiesIncomplete.error = action.payload || "Failed to load incomplete activities.";
      });

    // ----------------------------------------------------
    // Photo Uploads Due
    // ----------------------------------------------------
    builder
      .addCase(loadPhotoUploadsDue.pending, (state) => {
        state.photoUploads.loading = true;
        state.photoUploads.error = null;
      })
      .addCase(loadPhotoUploadsDue.fulfilled, (state, action) => {
        state.photoUploads.loading = false;
        const res = action.payload || {};
        state.photoUploads.data = Array.isArray(res.data) ? res.data : [];
        state.photoUploads.summary = res.summary || { due: 0, later_today: 0, therapy: 0, meals: 0 };
        state.photoUploads.header = res.header || {};
        state.photoUploads.count = res.count ?? state.photoUploads.data.length;
        state.photoUploads.error = null;
      })
      .addCase(loadPhotoUploadsDue.rejected, (state, action) => {
        state.photoUploads.loading = false;
        state.photoUploads.error = action.payload || "Failed to load photo uploads due.";
      });

    // ----------------------------------------------------
    // Ward Summary Details
    // ----------------------------------------------------
    builder
      .addCase(loadWardSummary.pending, (state) => {
        state.wardSummaryDetails.loading = true;
        state.wardSummaryDetails.error = null;
      })
      .addCase(loadWardSummary.fulfilled, (state, action) => {
        state.wardSummaryDetails.loading = false;
        const res = action.payload || {};
        const roomsList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.rooms)
          ? res.data.rooms
          : Array.isArray(res.rooms)
          ? res.rooms
          : [];
        state.wardSummaryDetails.data = roomsList;
        state.wardSummaryDetails.filters = res.filters || {
          selected_type: "ac",
          selected_status: "all",
          types: [],
          statuses: [],
        };
        state.wardSummaryDetails.counts = res.counts || res.summary || {};
        state.wardSummaryDetails.summary = res.summary || res.counts || { engaged: 0, free: 0, maintenance: 0, total_rooms: 0 };
        state.wardSummaryDetails.header = res.header || {};
        state.wardSummaryDetails.count = res.count || roomsList.length;
        state.wardSummaryDetails.error = null;
      })
      .addCase(loadWardSummary.rejected, (state, action) => {
        state.wardSummaryDetails.loading = false;
        state.wardSummaryDetails.error = action.payload || "Failed to load ward summary.";
      });

    // ----------------------------------------------------
    // Nurse Notifications
    // ----------------------------------------------------
    builder
      .addCase(loadNurseNotifications.pending, (state) => {
        state.notifications.loading = true;
        state.notifications.error = null;
      })
      .addCase(loadNurseNotifications.fulfilled, (state, action) => {
        state.notifications.loading = false;
        const res = action.payload || {};
        state.notifications.data = Array.isArray(res.data) ? res.data : [];
        state.notifications.tabs = Array.isArray(res.tabs) && res.tabs.length > 0 ? res.tabs : state.notifications.tabs;
        state.notifications.active_tab = res.active_tab || state.notifications.active_tab;
        state.notifications.unread_count = res.unread_count ?? 0;
        state.notifications.error = null;
      })
      .addCase(loadNurseNotifications.rejected, (state, action) => {
        state.notifications.loading = false;
        state.notifications.error = action.payload || "Failed to load notifications.";
      })
      .addCase(readNurseNotification.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.notifications.data = state.notifications.data.map((item) =>
          item.id === id ? { ...item, is_read: true } : item
        );
        state.notifications.unread_count = Math.max(0, state.notifications.unread_count - 1);
      })
      .addCase(readAllNurseNotifications.fulfilled, (state) => {
        state.notifications.data = state.notifications.data.map((item) => ({ ...item, is_read: true }));
        state.notifications.unread_count = 0;
      });

    // ----------------------------------------------------
    // Pending Patient Logs
    // ----------------------------------------------------
    builder
      .addCase(loadPendingPatientLogs.pending, (state) => {
        state.pendingPatientLogs.loading = true;
        state.pendingPatientLogs.error = null;
      })
      .addCase(loadPendingPatientLogs.fulfilled, (state, action) => {
        state.pendingPatientLogs.loading = false;
        const res = action.payload || {};
        state.pendingPatientLogs.data = Array.isArray(res.data) ? res.data : [];
        state.pendingPatientLogs.header = res.header || {};
        state.pendingPatientLogs.count = res.count ?? state.pendingPatientLogs.data.length;
        state.pendingPatientLogs.error = null;
      })
      .addCase(loadPendingPatientLogs.rejected, (state, action) => {
        state.pendingPatientLogs.loading = false;
        state.pendingPatientLogs.error = action.payload || "Failed to load pending patient logs.";
      });

    // ----------------------------------------------------
    // Stay Feedback
    // ----------------------------------------------------
    builder
      .addCase(loadStayFeedback.pending, (state) => {
        state.stayFeedbackLoading = true;
        state.stayFeedbackError = null;
      })
      .addCase(loadStayFeedback.fulfilled, (state, action) => {
        state.stayFeedbackLoading = false;
        state.stayFeedback = action.payload;
        state.stayFeedbackError = null;
      })
      .addCase(loadStayFeedback.rejected, (state, action) => {
        state.stayFeedbackLoading = false;
        state.stayFeedbackError = action.payload || "Failed to load stay feedback.";
      })
      .addCase(saveStayFeedback.pending, (state) => {
        state.stayFeedbackSaving = true;
        state.stayFeedbackSuccess = false;
        state.stayFeedbackError = null;
      })
      .addCase(saveStayFeedback.fulfilled, (state, action) => {
        state.stayFeedbackSaving = false;
        state.stayFeedbackSuccess = true;
        state.stayFeedback = action.payload;
        state.stayFeedbackError = null;
      })
      .addCase(saveStayFeedback.rejected, (state, action) => {
        state.stayFeedbackSaving = false;
        state.stayFeedbackSuccess = false;
        state.stayFeedbackError = action.payload || "Failed to submit stay feedback.";
      })
      // Extend Expected Discharge Date
      .addCase(extendDischargePeriod.pending, (state) => {
        state.extendDischargeLoading = true;
        state.extendDischargeSuccess = false;
        state.extendDischargeError = null;
      })
      .addCase(extendDischargePeriod.fulfilled, (state, action) => {
        state.extendDischargeLoading = false;
        state.extendDischargeSuccess = true;
        state.extendDischargeError = null;
        state.extendDischargeData = action.payload;

        // If selected admission is loaded, update its fields directly
        if (state.selectedAdmission) {
          const adm = state.selectedAdmission.data || state.selectedAdmission;
          if (adm) {
            adm.no_of_days = action.payload?.updated_no_of_days ?? adm.no_of_days;
            adm.expected_discharge_date = action.payload?.expected_discharge_date ?? adm.expected_discharge_date;
            adm.is_checkout_today = action.payload?.is_checkout_today ?? false;
            if (action.payload?.extension_history) {
              adm.extension_history = action.payload.extension_history;
            }
          }
          if (state.selectedAdmission.admission) {
            state.selectedAdmission.admission.no_of_days = action.payload?.updated_no_of_days ?? state.selectedAdmission.admission.no_of_days;
            state.selectedAdmission.admission.expected_discharge_date = action.payload?.expected_discharge_date ?? state.selectedAdmission.admission.expected_discharge_date;
            state.selectedAdmission.admission.is_checkout_today = action.payload?.is_checkout_today ?? false;
          }
        }
      })
      .addCase(extendDischargePeriod.rejected, (state, action) => {
        state.extendDischargeLoading = false;
        state.extendDischargeSuccess = false;
        state.extendDischargeError = action.payload || "Failed to extend expected discharge date.";
      });
  },
});

export const {
  setNursePeriod,
  setActivePatientsTab,
  resetAdmitActionState,
  clearSelectedAdmission,
  clearStayFeedback,
  resetStayFeedbackSuccess,
  resetExtendDischargeState,
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
export const selectNurseMealsMenu = (state) => state.nurse?.mealsMenu;
export const selectNurseMealsMenuLoading = (state) => state.nurse?.mealsMenuLoading || false;

export const selectNursePendingMedicines = (state) => state.nurse?.pendingMedicines;
export const selectNurseMedicinesLoading = (state) => state.nurse?.medicinesLoading || false;

// Pending Meals Selectors
export const selectNursePendingMeals = (state) => state.nurse?.pendingMeals?.data || [];
export const selectNursePendingMealsSummary = (state) => state.nurse?.pendingMeals?.summary || {};
export const selectNursePendingMealsHeader = (state) => state.nurse?.pendingMeals?.header || {};
export const selectNursePendingMealsLoading = (state) => state.nurse?.pendingMeals?.loading || false;
export const selectNursePendingMealsError = (state) => state.nurse?.pendingMeals?.error;

// Activities Incomplete Selectors
export const selectNurseActivitiesIncomplete = (state) => state.nurse?.activitiesIncomplete?.data || [];
export const selectNurseActivitiesSummary = (state) => state.nurse?.activitiesIncomplete?.summary || {};
export const selectNurseActivitiesHeader = (state) => state.nurse?.activitiesIncomplete?.header || {};
export const selectNurseActivitiesLoading = (state) => state.nurse?.activitiesIncomplete?.loading || false;
export const selectNurseActivitiesError = (state) => state.nurse?.activitiesIncomplete?.error;

// Photo Uploads Due Selectors
export const selectNursePhotoUploads = (state) => state.nurse?.photoUploads?.data || [];
export const selectNursePhotoUploadsSummary = (state) => state.nurse?.photoUploads?.summary || {};
export const selectNursePhotoUploadsHeader = (state) => state.nurse?.photoUploads?.header || {};
export const selectNursePhotoUploadsLoading = (state) => state.nurse?.photoUploads?.loading || false;
export const selectNursePhotoUploadsError = (state) => state.nurse?.photoUploads?.error;

// Ward Summary Selectors
export const selectNurseWardSummaryRooms = (state) => state.nurse?.wardSummaryDetails?.data || [];
export const selectNurseWardSummaryFilters = (state) => state.nurse?.wardSummaryDetails?.filters || {};
export const selectNurseWardSummaryCounts = (state) => state.nurse?.wardSummaryDetails?.counts || {};
export const selectNurseWardSummaryHeader = (state) => state.nurse?.wardSummaryDetails?.header || {};
export const selectNurseWardSummaryLoading = (state) => state.nurse?.wardSummaryDetails?.loading || false;
export const selectNurseWardSummaryError = (state) => state.nurse?.wardSummaryDetails?.error;
export const selectNurseWardSummaryDetails = (state) => state.nurse?.wardSummaryDetails?.data || [];
export const selectNurseWardSummaryOverview = (state) => state.nurse?.wardSummaryDetails?.counts || state.nurse?.wardSummaryDetails?.summary || {};

// Notifications Selectors
export const selectNurseNotifications = (state) => state.nurse?.notifications?.data || [];
export const selectNurseNotificationTabs = (state) => state.nurse?.notifications?.tabs || [];
export const selectNurseNotificationActiveTab = (state) => state.nurse?.notifications?.active_tab || "All";
export const selectNurseUnreadCount = (state) => state.nurse?.notifications?.unread_count || 0;
export const selectNurseNotificationsLoading = (state) => state.nurse?.notifications?.loading || false;
export const selectNurseNotificationsError = (state) => state.nurse?.notifications?.error;

// Pending Patient Logs Selectors
export const selectNursePendingPatientLogs = (state) => state.nurse?.pendingPatientLogs?.data || [];
export const selectNursePendingPatientLogsHeader = (state) => state.nurse?.pendingPatientLogs?.header || {};
export const selectNursePendingPatientLogsLoading = (state) => state.nurse?.pendingPatientLogs?.loading || false;
export const selectNursePendingPatientLogsError = (state) => state.nurse?.pendingPatientLogs?.error;

// Stay Feedback Selectors
export const selectNurseStayFeedback = (state) => state.nurse?.stayFeedback;
export const selectNurseStayFeedbackData = (state) => state.nurse?.stayFeedback?.data || state.nurse?.stayFeedback;
export const selectNurseStayFeedbackLoading = (state) => state.nurse?.stayFeedbackLoading || false;
export const selectNurseStayFeedbackSaving = (state) => state.nurse?.stayFeedbackSaving || false;
export const selectNurseStayFeedbackSuccess = (state) => state.nurse?.stayFeedbackSuccess || false;
export const selectNurseStayFeedbackError = (state) => state.nurse?.stayFeedbackError;

// Extend Discharge Selectors
export const selectExtendDischargeLoading = (state) => state.nurse?.extendDischargeLoading || false;
export const selectExtendDischargeSuccess = (state) => state.nurse?.extendDischargeSuccess || false;
export const selectExtendDischargeError = (state) => state.nurse?.extendDischargeError;
export const selectExtendDischargeData = (state) => state.nurse?.extendDischargeData;

export default nurseSlice.reducer;
