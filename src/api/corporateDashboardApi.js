import api from "./axios";

// ==========================================
// CORPORATE DASHBOARD OVERVIEW
// GET /corporate/dashboard
// ==========================================

export const getCorporateDashboard = () => {
  return api.get("/corporate/dashboard");
};


// ==========================================
// CORPORATE EVENTS
// GET /corporate/events?month=July 2026
// ==========================================

export const getCorporateEvents = (month) => {
  return api.get("/corporate/events", {
    params: {
      month,
    },
  });
};