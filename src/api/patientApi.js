import api from "./axios";

// ==========================================
// 1. GET FULL PATIENT PROFILE
// GET /onboarding/profile
// ==========================================
export const getPatientProfileApi = () => {
  return api.get("/onboarding/profile");
};

// ==========================================
// 2. GET TREATMENTS / THERAPIES
// GET /treatments?search=...&category=...
// ==========================================
export const getTreatmentsApi = (params = {}) => {
  return api.get("/treatments", { params });
};

// ==========================================
// 3. GET SINGLE TREATMENT BY ID
// GET /treatments/:id
// ==========================================
export const getTreatmentByIdApi = (id) => {
  return api.get(`/treatments/${id}`);
};

// ==========================================
// 4. GET AVAILABLE THERAPY SLOTS
// GET /treatment-bookings/available-slots?date=YYYY-MM-DD
// ==========================================
export const getAvailableSlotsApi = (date) => {
  return api.get("/treatment-bookings/available-slots", {
    params: { date },
  });
};

// ==========================================
// 5. BOOK THERAPY
// POST /treatment-bookings
// ==========================================
export const bookTreatmentApi = (payload) => {
  return api.post("/treatment-bookings", payload);
};

// ==========================================
// 6. GET DOCTORS / PRACTITIONERS
// GET /doctors?search=...&branch=...&doctor_type=...
// ==========================================
export const getDoctorsApi = (params = {}) => {
  return api.get("/doctors", { params });
};

// ==========================================
// 7. GET DOCTOR AVAILABLE SLOTS
// GET /appointments/available-slots?doctor_id=...&date=...&branch=...
// ==========================================
export const getDoctorAvailableSlotsApi = (params = {}) => {
  return api.get("/appointments/available-slots", { params });
};

// ==========================================
// 8. BOOK DOCTOR APPOINTMENT
// POST /appointments
// ==========================================
export const bookAppointmentApi = (payload) => {
  return api.post("/appointments", payload);
};

// ==========================================
// 9. GET SEARCH HOME VISIT DOCTORS
// GET /doctors?doctor_type=home_visit&search=...&branch=...
// ==========================================
export const getHomeVisitDoctorsApi = (params = {}) => {
  return api.get("/doctors", {
    params: {
      doctor_type: "home_visit",
      ...params,
    },
  });
};

// ==========================================
// 10. GET AVAILABLE SLOTS HOME SERVICE
// GET /home-services/available-slots?doctor_id=...&date=...
// ==========================================
export const getHomeServiceAvailableSlotsApi = (params = {}) => {
  return api.get("/home-services/available-slots", { params });
};

// ==========================================
// 11. POST BOOK HOME SERVICE
// POST /home-services
// ==========================================
export const bookHomeServiceApi = (payload) => {
  return api.post("/home-services", payload);
};

// ==========================================
// 12. POST CHANGE HOME ADDRESS
// POST /onboarding/profile/address
// ==========================================
export const updateProfileAddressApi = (payload) => {
  return api.post("/onboarding/profile/address", payload);
};



