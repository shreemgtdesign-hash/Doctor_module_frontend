import api from "./axios";

// ==========================================
// 1. CORPORATE CELL DASHBOARD
// GET /corporatecell/dashboard
// ==========================================
export const getCorporateCellDashboard = () => {
  return api.get("/corporatecell/dashboard");
};

// ==========================================
// 2. UPCOMING EVENTS LIST
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
// 4. GET EVENT RESOURCES
// GET /corporatecell/upcoming-events/:id/resources
// ==========================================
export const getCorporateCellEventResources = (id) => {
  return api.get(`/corporatecell/upcoming-events/${id}/resources`);
};

// ==========================================
// 5. UPDATE EVENT RESOURCES
// PUT /corporatecell/upcoming-events/:id/resources
// ==========================================
export const updateCorporateCellEventResources = (id, payload) => {
  return api.put(`/corporatecell/upcoming-events/${id}/resources`, payload);
};

// ==========================================
// 6. GET TEAM OPTIONS
// GET /corporatecell/team-options
// ==========================================
export const getCorporateCellTeamOptions = () => {
  return api.get("/corporatecell/team-options");
};

// ==========================================
// 7. GET EVENT ASSIGNED TEAM
// GET /corporatecell/events/:id/team
// ==========================================
export const getCorporateCellEventTeam = (id) => {
  return api.get(`/corporatecell/events/${id}/team`);
};

// ==========================================
// 8. UPDATE EVENT ASSIGNED TEAM
// PUT /corporatecell/events/:id/team
// ==========================================
export const updateCorporateCellEventTeam = (id, payload) => {
  return api.put(`/corporatecell/events/${id}/team`, payload);
};

// ==========================================
// 9. GET DASHBOARD CMS (EDIT DASHBOARD)
// GET /corporatecell/dashboard-cms
// ==========================================
export const getCorporateCellDashboardCms = () => {
  return api.get("/corporatecell/dashboard-cms");
};

// ==========================================
// 10. UPDATE DASHBOARD CMS
// PUT /corporatecell/dashboard-cms
// ==========================================
export const updateCorporateCellDashboardCms = (payload) => {
  return api.put("/corporatecell/dashboard-cms", payload);
};

// ==========================================
// 11. UPDATE DASHBOARD GALLERY
// PUT /corporatecell/dashboard-cms/gallery
// ==========================================
export const updateCorporateCellDashboardGallery = (payload) => {
  return api.put("/corporatecell/dashboard-cms/gallery", payload);
};

