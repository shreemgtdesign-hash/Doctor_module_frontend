import {
  getPatientProfileApi,
  getTreatmentsApi,
  getTreatmentByIdApi,
  getAvailableSlotsApi,
  bookTreatmentApi,
  getDoctorsApi,
  getDoctorByIdApi,
  getDoctorAvailableSlotsApi,
  bookAppointmentApi,
  getHomeVisitDoctorsApi,
  getHomeServiceAvailableSlotsApi,
  bookHomeServiceApi,
  updateProfileAddressApi,
} from "../api/patientApi";

// Clean default states without hardcoded sample data
export const DEFAULT_PATIENT_PROFILE = null;
export const DEFAULT_TREATMENTS = [];
export const DEFAULT_SLOTS = [];
export const DEFAULT_DOCTORS = [];
export const DEFAULT_DOCTOR_SLOTS = [];
export const DEFAULT_HOME_VISIT_DOCTORS = [];
export const DEFAULT_HOME_SERVICE_SLOTS = [];
export const DEFAULT_PATIENT_ADDRESS = null;

// ==========================================
// PATIENT PROFILE SERVICE
// ==========================================
export const fetchPatientProfile = async () => {
  const res = await getPatientProfileApi();
  return res.data?.data || res.data;
};

// ==========================================
// TREATMENTS SERVICE
// ==========================================
export const fetchTreatments = async (params = {}) => {
  const res = await getTreatmentsApi(params);
  const data = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
};

export const fetchTreatmentById = async (id) => {
  const res = await getTreatmentByIdApi(id);
  return res.data?.data || res.data;
};

export const fetchAvailableSlots = async (treatmentId, date) => {
  const res = await getAvailableSlotsApi(treatmentId, date);
  const data = res.data?.data || res.data;
  const slots = Array.isArray(data) ? data : (data?.slots || []);
  return slots;
};

export const createTreatmentBooking = async (payload) => {
  const res = await bookTreatmentApi(payload);
  return res.data;
};

export const createTherapyBooking = createTreatmentBooking;

// ==========================================
// DOCTORS SERVICE
// ==========================================
export const fetchDoctors = async (params = {}) => {
  const res = await getDoctorsApi(params);
  const data = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
};

export const fetchDoctorById = async (id) => {
  try {
    const res = await getDoctorByIdApi(id);
    return res.data?.data || res.data;
  } catch (err) {
    const res = await getDoctorsApi({ id });
    const data = res.data?.data || res.data;
    if (Array.isArray(data)) {
      return data.find((d) => d.id === id || d.doctor_code === id) || null;
    }
    return null;
  }
};

export const fetchDoctorSlots = async (paramsOrDoctorId, date, branch) => {
  const params =
    typeof paramsOrDoctorId === "object" && paramsOrDoctorId !== null
      ? paramsOrDoctorId
      : { doctor_id: paramsOrDoctorId, date, branch };
  const res = await getDoctorAvailableSlotsApi(params);
  const data = res.data?.data || res.data;
  const slots = Array.isArray(data) ? data : (data?.slots || []);
  return slots;
};

export const createAppointmentBooking = async (payload) => {
  const res = await bookAppointmentApi(payload);
  return res.data;
};

// ==========================================
// HOME VISIT SERVICE
// ==========================================
export const fetchHomeVisitDoctors = async (params = {}) => {
  const res = await getHomeVisitDoctorsApi(params);
  const data = res.data?.data || res.data;
  return Array.isArray(data) ? data : [];
};

export const fetchHomeServiceAvailableSlots = async (paramsOrDoctorId, date) => {
  const params =
    typeof paramsOrDoctorId === "object" && paramsOrDoctorId !== null
      ? paramsOrDoctorId
      : { doctor_id: paramsOrDoctorId, date };
  const res = await getHomeServiceAvailableSlotsApi(params);
  const data = res.data?.data || res.data;
  const slots = Array.isArray(data) ? data : (data?.slots || []);
  return slots;
};

export const createHomeServiceBooking = async (payload) => {
  const res = await bookHomeServiceApi(payload);
  return res.data;
};

export const updatePatientAddress = async (payload) => {
  const res = await updateProfileAddressApi(payload);
  return res.data;
};
