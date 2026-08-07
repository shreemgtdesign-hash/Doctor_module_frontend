import api from "./axios";

/* Dashboard APIs */

export const getMonthlySummary = (doctorId) =>
  api.get(`/doctor-dashboard/monthly-summary?doctor_id=${doctorId}`);

export const getScheduleOverview = (doctorId, period) =>
  api.get(
    `/doctor-dashboard/schedule-overview?doctor_id=${doctorId}&period=${period}`
  );

export const getTodaySchedule = (doctorId) =>
  api.get(`/doctor-dashboard/todays-schedule?doctor_id=${doctorId}`);

// Search Medicines
export const searchPrescriptionProducts = (search) =>
  api.get(`/treatments/products?search=${search}`);

// Get Prescription
export const getPrescription = (consultationId) =>
  api.get(`/prescriptions/${consultationId}`);

// Create Prescription
export const createPrescription = (payload) =>
  api.post(`/prescriptions`, payload);

// Update Full Prescription
export const updatePrescription = (
  consultationId,
  payload
) =>
  api.put(
    `/prescriptions/${consultationId}`,
    payload
  );

export const updatePrescriptionItem = (
  itemId,
  payload
) =>
  api.put(
    `/prescriptions/item/${itemId}`,
    payload
  );
export const updatePrescriptionNotes = (
  consultationId,
  payload
) =>
  api.put(
    `/doctor-dashboard/prescription-notes/${consultationId}`,
    payload
  );


export const updatePatientAllergies = (
  patientId,
  payload
) =>
  api.put(
    `/prescriptions/allergies/${patientId}`,
    payload
  );
/* Appointment APIs */

// Today's appointments
export const getAppointments = (doctorId, date, status = "") => {
  console.log("doctorId", doctorId);
  let url = `/appointments?id=${doctorId}&date=${date}`;
   
  if (status) {
    url += `&status=${status}`;
  }

  return api.get(url);
};

export const getChiefComplaints = (appointmentId) => {
  return api.get(
    `/visits/${appointmentId}/chief-complaints`
  );
};

export const updateChiefComplaints = (
  appointmentId,
  data
) => {
  return api.put(
    `/visits/${appointmentId}/chief-complaints`,
    data
  );
};
// Patient Profile
export const getPatientProfile = (patientId) =>
  api.get(`/onboarding/profile/${patientId}`);

// Patient Wellness
export const getPatientWellness = (patientId) =>
  api.get(`/wellness/patient/${patientId}`);

// Diagnosis

export const getDiagnosis = (appointmentId) => {
  return api.get(
    `/visits/${appointmentId}/diagnosis`
  );
};

export const updateDiagnosis = (
  appointmentId,
  data
) => {
  return api.put(
    `/visits/${appointmentId}/diagnosis`,
    data
  );
};

// Associate Doctors

export const getAssociateDoctors = (
  appointmentId
) => {
  return api.get(
    `/visits/${appointmentId}/associate-doctors`
  );
};

export const addAssociateDoctor = (
  appointmentId,
  data
) => {
  return api.post(
    `/visits/${appointmentId}/associate-doctors`,
    data
  );
};

// ============================
// Prescription
// ============================

// ============================
// Therapy APIs
// ============================

// Search Therapies
export const searchTherapies = (search) =>
  api.get(`/treatments?search=${search}`);

// Get Therapies
export const getTherapies = (appointmentId) =>
  api.get(`/visits/${appointmentId}/therapies`);

// Add Therapy
export const addTherapy = (appointmentId, payload) =>
  api.post(
    `/visits/${appointmentId}/therapies`,
    payload
  );

// Update Therapy
export const updateTherapy = (therapyId, payload) =>
  api.put(
    `/visits/therapies/${therapyId}`,
    payload
  );

  // ============================
// Consultation History List
// ============================

export const getConsultationHistoryList = (
  doctorId,
  period = "today"
) =>
  api.get(
    `/doctor-dashboard/consultations-history/list?period=${period}&id=${doctorId}`
  );

// ============================
// Medicines Prescribed List
// ============================

export const getMedicinesPrescribedList = (
  doctorId,
  period = "today"
) =>
  api.get(
    `/doctor-dashboard/medicines-prescribed/list?period=${period}&id=${doctorId}`
  );


export const getDiagnosisCategories = () =>
  api.get("/visits/diagnosis-categories");


