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

