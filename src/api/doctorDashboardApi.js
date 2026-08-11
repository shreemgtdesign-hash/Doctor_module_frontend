import api from "./axios";

// Schedule Overview
export const getScheduleOverview = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/schedule-overview?id=${doctorId}&period=${period}`
  );

// Today's Schedule
export const getTodaySchedule = (doctorId) =>
  api.get(
    `/doctor-dashboard/todays-schedule?id=${doctorId}`
  );

// Consultation History
export const getConsultationHistory = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/consultations-history?id=${doctorId}&period=${period}`
  );

// Ailments
export const getAilments = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/ailments-addressed?id=${doctorId}&period=${period}`
  );

// Therapies
export const getTherapies = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/therapies-prescribed?id=${doctorId}&period=${period}`
  );

// Medicines
export const getMedicines = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/medicines-prescribed?id=${doctorId}&period=${period}`
  );

  export const getWellnessSummary = (
  doctorId,
  period
) =>
  api.get(
    `/doctor-dashboard/wellness-summary?id=${doctorId}&period=${period}`
  );

// ==========================
// Beauty
// ==========================

export const getBeautySummary = (
  doctorId,
  period
) =>
  api.get(
    `/doctor-dashboard/beauty-summary?id=${doctorId}&period=${period}`
  );

  export const getTherapyAppointments = () =>
    api.get("/therapist/appointments");