import api from "./axios";

// ==========================================
// NURSE DASHBOARD API
// GET /nurse/dashboard
// ==========================================
export const getNurseDashboard = (params = {}) => {
  return api.get("/nurse/dashboard", {
    params,
  });
};

// ==========================================
// IPD PATIENTS LIST API
// GET /nurse/patients?tab=upcoming|admitted|discharged
// ==========================================
export const getNursePatients = (params = {}) => {
  return api.get("/nurse/patients", {
    params,
  });
};

// ==========================================
// ADMISSION DETAIL API
// GET /nurse/admissions/:admission_id
// ==========================================
export const getNurseAdmissionDetail = (admissionId) => {
  return api.get(`/nurse/admissions/${admissionId}`);
};

// ==========================================
// ASSIGN ROOM & ADMIT PATIENT API
// POST /nurse/admissions/:admission_id/assign-room
// ==========================================
export const assignRoomAndAdmitPatient = (admissionId, data) => {
  return api.post(`/nurse/admissions/${admissionId}/assign-room`, data);
};

// ==========================================
// PATIENT DAILY LOG API
// GET /nurse/patients/:patient_id/daily-log?date=YYYY-MM-DD
// POST /nurse/patients/:patient_id/daily-log
// ==========================================
export const getPatientDailyLog = (patientId, params = {}) => {
  return api.get(`/nurse/patients/${patientId}/daily-log`, {
    params,
  });
};

export const savePatientDailyLog = (patientId, data) => {
  return api.post(`/nurse/patients/${patientId}/daily-log`, data);
};

// ==========================================
// MEALS MENU API
// GET /nurse/meals-menu
// ==========================================
export const getMealsMenu = () => {
  return api.get("/nurse/meals-menu");
};

// ==========================================
// PENDING MEDICINES API
// GET /nurse/pending-actions/medicines
// ==========================================
export const getPendingMedicines = (params = {}) => {
  return api.get("/nurse/pending-actions/medicines", {
    params,
  });
};

// ==========================================
// PENDING MEAL LOGS API
// GET /nurse/pending-meals?date=YYYY-MM-DD&meal_type=all|breakfast|lunch|dinner
// ==========================================
export const getPendingMeals = (params = {}) => {
  return api.get("/nurse/pending-meals", {
    params,
  });
};

// ==========================================
// ACTIVITIES INCOMPLETE API
// GET /nurse/activities-incomplete?date=YYYY-MM-DD&category=all|morning|therapy|evening
// ==========================================
export const getActivitiesIncomplete = (params = {}) => {
  return api.get("/nurse/activities-incomplete", {
    params,
  });
};

// ==========================================
// PHOTO UPLOADS DUE API
// GET /nurse/upload-photos?date=YYYY-MM-DD
// ==========================================
export const getPhotoUploadsDue = (params = {}) => {
  return api.get("/nurse/upload-photos", {
    params,
  });
};

// ==========================================
// WARD SUMMARY API
// GET /nurse/ward-summary
// ==========================================
export const getWardSummary = (params = {}) => {
  return api.get("/nurse/ward-summary", {
    params,
  });
};

// ==========================================
// NOTIFICATIONS API
// GET /nurse/notifications?tab=all|admissions|meals|activities|medicines|discharges
// PUT /nurse/notifications/:id/read
// PUT /nurse/notifications/read-all
// ==========================================
export const getNurseNotifications = (params = {}) => {
  return api.get("/nurse/notifications", {
    params,
  });
};

export const markNotificationRead = (id) => {
  return api.put(`/nurse/notifications/${id}/read`);
};

export const markAllNotificationsRead = () => {
  return api.put("/nurse/notifications/read-all");
};

// ==========================================
// PENDING ACTIONS > PATIENT LOGS API
// GET /nurse/pending-actions/patient-logs?date=YYYY-MM-DD
// ==========================================
export const getPendingPatientLogs = (params = {}) => {
  return api.get("/nurse/pending-actions/patient-logs", {
    params,
  });
};

// ==========================================
// STAY FEEDBACK API
// GET /nurse/admissions/:admission_id/feedback
// POST /nurse/admissions/:admission_id/feedback
// ==========================================
export const getNurseStayFeedback = (admissionId) => {
  return api.get(`/nurse/admissions/${admissionId}/feedback`);
};

export const submitNurseStayFeedback = (admissionId, data) => {
  return api.post(`/nurse/admissions/${admissionId}/feedback`, data);
};

// ==========================================
// EXTEND EXPECTED DISCHARGE DATE API
// PUT /nurse/admissions/:admission_id/extend-discharge
// ==========================================
export const extendNurseDischargeDate = (admissionId, data) => {
  return api.put(`/nurse/admissions/${admissionId}/extend-discharge`, data);
};


