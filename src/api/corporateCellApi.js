import api from "./axios";

// ==========================================
// 1. CORPORATE CELL DASHBOARD
// GET /corporatecell/dashboard
// ==========================================
export const getCorporateCellDashboard = () => {
  return api.get("/corporatecell/dashboard");
};

// ==========================================
// 2. UPCOMING EVENTS LIST (Confirmed only)
// GET /corporatecell/upcoming-events
// ==========================================
export const getCorporateCellUpcomingEvents = (params = {}) => {
  return api.get("/corporatecell/upcoming-events", { params });
};

// ==========================================
// 3. UPCOMING EVENT BY ID (DETAILS)
// GET /corporatecell/upcoming-events/:id
// ==========================================
export const getCorporateCellEventDetails = (id) => {
  return api.get(`/corporatecell/upcoming-events/${id}`);
};

// ==========================================
// 4. PENDING EVENTS LIST
// GET /corporatecell/pending-events
// ==========================================
export const getCorporateCellPendingEvents = (params = {}) => {
  return api.get("/corporatecell/pending-events", { params });
};

// ==========================================
// 5. PENDING EVENT BY ID (DETAILS)
// GET /corporatecell/pending-events/:id
// ==========================================
export const getCorporateCellPendingEventDetails = (id) => {
  return api.get(`/corporatecell/pending-events/${id}`);
};

// ==========================================
// 6. GET EVENT RESOURCES
// GET /corporatecell/pending-events/:id/resources
// Fallback to /corporatecell/upcoming-events/:id/resources
// ==========================================
export const getCorporateCellEventResources = async (id) => {
  try {
    return await api.get(`/corporatecell/pending-events/${id}/resources`);
  } catch (err) {
    // Fallback for confirmed/upcoming events
    return await api.get(`/corporatecell/upcoming-events/${id}/resources`);
  }
};

// ==========================================
// 7. UPDATE EVENT RESOURCES
// PUT /corporatecell/pending-events/:id/resources
// Fallback to /corporatecell/upcoming-events/:id/resources
// ==========================================
export const updateCorporateCellEventResources = async (id, payload) => {
  try {
    return await api.put(`/corporatecell/pending-events/${id}/resources`, payload);
  } catch (err) {
    return await api.put(`/corporatecell/upcoming-events/${id}/resources`, payload);
  }
};

// ==========================================
// 8. GET TEAM OPTIONS
// GET /corporatecell/team-options
// ==========================================
export const getCorporateCellTeamOptions = () => {
  return api.get("/corporatecell/team-options");
};

// ==========================================
// 9. GET EVENT ASSIGNED TEAM
// GET /corporatecell/pending-events/:id/team
// Fallback to /corporatecell/events/:id/team
// ==========================================
export const getCorporateCellEventTeam = async (id) => {
  try {
    return await api.get(`/corporatecell/pending-events/${id}/team`);
  } catch (err) {
    return await api.get(`/corporatecell/events/${id}/team`);
  }
};

// ==========================================
// 10. UPDATE EVENT ASSIGNED TEAM
// PUT /corporatecell/pending-events/:id/team
// Fallback to /corporatecell/events/:id/team
// ==========================================
export const updateCorporateCellEventTeam = async (id, payload) => {
  try {
    return await api.put(`/corporatecell/pending-events/${id}/team`, payload);
  } catch (err) {
    return await api.put(`/corporatecell/events/${id}/team`, payload);
  }
};

// ==========================================
// 11. CONFIRM EVENT
// Changes pending event status to confirmed
// ==========================================
export const confirmCorporateCellEvent = async (id, payload = {}) => {
  try {
    return await api.put(`/corporatecell/pending-events/${id}/confirm`, payload);
  } catch (err) {
    try {
      return await api.post(`/corporatecell/pending-events/${id}/confirm`, payload);
    } catch (err2) {
      // Fallback: update status to confirmed via general update
      return await api.put(`/corporatecell/pending-events/${id}`, {
        status: "confirmed",
        ...payload,
      });
    }
  }
};

// ==========================================
// 12. GET DASHBOARD CMS (EDIT DASHBOARD)
// GET /corporatecell/dashboard-cms
// ==========================================
export const getCorporateCellDashboardCms = () => {
  return api.get("/corporatecell/dashboard-cms");
};

// ==========================================
// 13. UPDATE DASHBOARD CMS
// PUT /corporatecell/dashboard-cms
// ==========================================
export const updateCorporateCellDashboardCms = (payload) => {
  return api.put("/corporatecell/dashboard-cms", payload);
};

// ==========================================
// 14. UPDATE DASHBOARD GALLERY
// PUT /corporatecell/dashboard-cms/gallery
// ==========================================
export const updateCorporateCellDashboardGallery = (payload) => {
  return api.put("/corporatecell/dashboard-cms/gallery", payload);
};
