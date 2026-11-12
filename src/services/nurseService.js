import {
  getNurseDashboard,
  getNursePatients,
  getNurseAdmissionDetail,
  assignRoomAndAdmitPatient,
  getPatientDailyLog,
  savePatientDailyLog,
  getMealsMenu,
  getPendingMedicines,
  getPendingMeals,
  getActivitiesIncomplete,
  getPhotoUploadsDue,
  getWardSummary,
  getNurseNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getPendingPatientLogs,
  getNurseStayFeedback,
  submitNurseStayFeedback,
} from "../api/nurseApi";

export const fetchNurseDashboard = async (params = {}) => {
  try {
    const response = await getNurseDashboard(params);
    const data = response.data?.data || response.data;
    if (data && typeof data === "object") {
      return {
        patients_admitted: data.patients_admitted ?? 0,
        growth_comparison: data.growth_comparison ?? "+0.0%",
        comparison_label: data.comparison_label ?? "Compared to last week",
        filter_applied: data.filter_applied ?? "Today",
        room_breakdown: data.room_breakdown || {
          engaged: 0,
          free: 0,
          maintenance: 0,
          ac_rooms: 0,
          non_ac_rooms: 0,
          garden_rooms: 0,
        },
        admit_patient_action: data.admit_patient_action || {
          title: "Admit Patient",
          description: "Quickly admit a new IPD patient and assign a room.",
          pending_count: 0,
          badge_label: "View (0)",
        },
        ward_summary: data.ward_summary || {
          ac_occupancy: { engaged: 0, total: 0, label: "0 Engaged AC Rooms" },
          non_ac_occupancy: { engaged: 0, total: 0, label: "0 Engaged Non-AC Rooms" },
          garden_occupancy: { engaged: 0, total: 0, label: "0 Engaged Garden Rooms" },
        },
        recent_admissions: Array.isArray(data.recent_admissions)
          ? data.recent_admissions
          : [],
        nurse_actions: data.nurse_actions || {
          patient_logs: 0,
          activities_incomplete: 0,
          photo_uploads_due: 0,
          pending_medicines: 0,
          pending_therapies: 0,
          pending_meals: 0,
        },
      };
    }
    return null;
  } catch (error) {
    console.warn("fetchNurseDashboard error:", error);
    throw error;
  }
};

export const fetchNursePatients = async (params = { tab: "upcoming" }) => {
  try {
    const response = await getNursePatients(params);
    const resData = response.data || {};
    return {
      tab: resData.tab || params.tab || "upcoming",
      counts: resData.counts || {
        upcoming: 0,
        admitted: 0,
        discharged: 0,
      },
      count: resData.count ?? (Array.isArray(resData.data) ? resData.data.length : 0),
      data: Array.isArray(resData.data) ? resData.data : [],
    };
  } catch (error) {
    console.warn("fetchNursePatients error:", error);
    throw error;
  }
};

export const fetchNurseAdmissionDetail = async (admissionId) => {
  try {
    const response = await getNurseAdmissionDetail(admissionId);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn("fetchNurseAdmissionDetail error:", error);
    throw error;
  }
};

export const submitAssignRoomAndAdmit = async (admissionId, payload) => {
  try {
    const response = await assignRoomAndAdmitPatient(admissionId, payload);
    return response.data;
  } catch (error) {
    console.warn("submitAssignRoomAndAdmit error:", error);
    throw error;
  }
};

export const fetchPatientDailyLog = async (patientId, params = {}) => {
  try {
    const response = await getPatientDailyLog(patientId, params);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn("fetchPatientDailyLog error:", error);
    throw error;
  }
};

export const submitPatientDailyLog = async (patientId, payload) => {
  try {
    const response = await savePatientDailyLog(patientId, payload);
    return response.data;
  } catch (error) {
    console.warn("submitPatientDailyLog error:", error);
    throw error;
  }
};

export const fetchMealsMenu = async () => {
  try {
    const response = await getMealsMenu();
    return response.data?.data || response.data;
  } catch (error) {
    console.warn("fetchMealsMenu error:", error);
    throw error;
  }
};

export const fetchPendingMedicines = async (params = {}) => {
  try {
    const response = await getPendingMedicines(params);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn("fetchPendingMedicines error:", error);
    throw error;
  }
};

export const fetchPendingMeals = async (params = {}) => {
  try {
    const response = await getPendingMeals(params);
    return response.data;
  } catch (error) {
    console.warn("fetchPendingMeals error:", error);
    throw error;
  }
};

export const fetchActivitiesIncomplete = async (params = {}) => {
  try {
    const response = await getActivitiesIncomplete(params);
    return response.data;
  } catch (error) {
    console.warn("fetchActivitiesIncomplete error:", error);
    throw error;
  }
};

export const fetchPhotoUploadsDue = async (params = {}) => {
  try {
    const response = await getPhotoUploadsDue(params);
    return response.data;
  } catch (error) {
    console.warn("fetchPhotoUploadsDue error:", error);
    throw error;
  }
};

export const fetchWardSummary = async (params = {}) => {
  try {
    const response = await getWardSummary(params);
    return response.data;
  } catch (error) {
    console.warn("fetchWardSummary error:", error);
    throw error;
  }
};

export const fetchNurseNotifications = async (params = {}) => {
  try {
    const response = await getNurseNotifications(params);
    return response.data;
  } catch (error) {
    console.warn("fetchNurseNotifications error:", error);
    throw error;
  }
};

export const markNurseNotificationRead = async (id) => {
  try {
    const response = await markNotificationRead(id);
    return response.data;
  } catch (error) {
    console.warn("markNurseNotificationRead error:", error);
    throw error;
  }
};

export const markAllNurseNotificationsRead = async () => {
  try {
    const response = await markAllNotificationsRead();
    return response.data;
  } catch (error) {
    console.warn("markAllNurseNotificationsRead error:", error);
    throw error;
  }
};

export const fetchPendingPatientLogs = async (params = {}) => {
  try {
    const response = await getPendingPatientLogs(params);
    return response.data;
  } catch (error) {
    console.warn("fetchPendingPatientLogs error:", error);
    throw error;
  }
};

export const fetchStayFeedback = async (admissionId) => {
  try {
    const response = await getNurseStayFeedback(admissionId);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn("fetchStayFeedback error:", error);
    throw error;
  }
};

export const postStayFeedback = async (admissionId, payload) => {
  try {
    const response = await submitNurseStayFeedback(admissionId, payload);
    return response.data?.data || response.data;
  } catch (error) {
    console.warn("postStayFeedback error:", error);
    throw error;
  }
};

