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
// PENDING MEDICINES API
// GET /nurse/pending-actions/medicines
// ==========================================
export const getPendingMedicines = (params = {}) => {
  return api.get("/nurse/pending-actions/medicines", {
    params,
  });
};
