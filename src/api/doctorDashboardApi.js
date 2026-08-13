import api from "./axios";

// Schedule Overview
export const getScheduleOverview = (period) =>
  api.get(
    `/doctor-dashboard/schedule-overview?period=${period}`
  );
// Today's Schedule
export const getTodaySchedule = (period) =>
  api.get(
    `/doctor-dashboard/todays-schedule?period=${period}`
  );
// Consultation History
export const getConsultationHistory = (period) =>
  api.get(
    `/doctor-dashboard/consultations-history?period=${period}`
  );

// Ailments
export const getAilments = (period) =>
  api.get(
    `/doctor-dashboard/ailments-addressed?period=${period}`
  );

  export const getAilmentsList = (period) =>
  api.get(
    `/doctor-dashboard/ailments-addressed/list?period=${period}`
  );
// Therapies
export const getTherapies = (period) =>
  api.get(
    `/doctor-dashboard/therapies-prescribed?period=${period}`
  );

// Medicines
export const getMedicines = (period) =>
  api.get(
    `/doctor-dashboard/medicines-prescribed?period=${period}`
  );

export const getWellnessSummary = (

  period
) =>
  api.get(
    `/doctor-dashboard/wellness-summary?period=${period}`
  );

// ==========================
// Beauty
// ==========================

export const getBeautySummary = (

  period
) =>
  api.get(
    `/doctor-dashboard/beauty-summary?period=${period}`
  );

export const getTherapyAppointments = () =>
  api.get("/therapist/appointments");