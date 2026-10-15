import api from "./axios";

// ==========================================
// 1. CORPORATE DASHBOARD OVERVIEW
// GET /corporate/dashboard
// ==========================================
export const getCorporateDashboard = () => {
  return api.get("/corporate/dashboard");
};

// ==========================================
// 2. REQUEST AN EVENT - PACKAGES CATALOG
// GET /corporate/packages?category=...&duration=...&page=...&limit=...
// ==========================================
export const getCorporatePackages = (params = {}) => {
  return api.get("/corporate/packages", { params });
};

// ==========================================
// 3. SINGLE PACKAGE DETAILS
// GET /corporate/packages/:id
// ==========================================
export const getCorporatePackageDetails = (id) => {
  return api.get(`/corporate/packages/${id}`);
};

// ==========================================
// 4. CUSTOMIZE EVENT - OPTIONS & CHOOSE EVENT LIST
// GET /corporate/customize-options?category=...
// ==========================================
export const getCorporateCustomizeOptions = (category) => {
  return api.get("/corporate/customize-options", {
    params: category && category !== "All" ? { category } : {}
  });
};

// ==========================================
// 5. CONFIRM DETAILS (SUBMIT CUSTOMIZED EVENT)
// POST /corporate/customize-event
// ==========================================
export const createCorporateCustomizeEvent = (payload) => {
  return api.post("/corporate/customize-event", payload);
};

// ==========================================
// 6. CORPORATE EVENTS (LIST VIEW)
// GET /corporate/events?month=...
// ==========================================
export const getCorporateEvents = (month) => {
  return api.get("/corporate/events", {
    params: month ? { month } : {}
  });
};

// ==========================================
// 7. CORPORATE EVENTS (CALENDAR VIEW)
// GET /corporate/events/calendar?month=...
// ==========================================
export const getCorporateEventsCalendar = (month) => {
  return api.get("/corporate/events/calendar", {
    params: month ? { month } : {}
  });
};

// ==========================================
// 8. MY EVENTS
// GET /corporate/my-events
// ==========================================
export const getCorporateMyEvents = (params = {}) => {
  const queryParams = { ...params };
  if (!queryParams.id && queryParams.corporate_id) {
    queryParams.id = queryParams.corporate_id;
  }
  return api.get("/corporate/my-events", { params: queryParams });
};

// ==========================================
// 9. COMPANY DETAILS FORM OPTIONS
// GET /corporate/company-details/options
// ==========================================
export const getCorporateCompanyDetailsOptions = () => {
  return api.get("/corporate/company-details/options");
};

// ==========================================
// 10. SUBMIT COMPANY REGISTRATION
// POST /corporate/company-details
// ==========================================
export const submitCorporateCompanyRegistration = (payload) => {
  return api.post("/corporate/company-details", payload);
};