import api from "./axios";

// Schedule Overview
export const getScheduleOverview = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/schedule-overview?doctor_id=${doctorId}&period=${period}`
  );

// Today's Schedule
export const getTodaySchedule = (doctorId) =>
  api.get(
    `/doctor-dashboard/todays-schedule?doctor_id=${doctorId}`
  );

// Consultation History
export const getConsultationHistory = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/consultations-history?doctor_id=${doctorId}&period=${period}`
  );

// Ailments
export const getAilments = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/ailments-addressed?doctor_id=${doctorId}&period=${period}`
  );

// Therapies
export const getTherapies = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/therapies-prescribed?doctor_id=${doctorId}&period=${period}`
  );

// Medicines
export const getMedicines = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/medicines-prescribed?doctor_id=${doctorId}&period=${period}`
  );