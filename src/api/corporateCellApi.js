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
// ==========================================
export const getCorporateCellEventResources = (id) => {
  return api.get(`/corporatecell/pending-events/${id}/resources`);
};

// ==========================================
// 7. UPDATE EVENT RESOURCES
// PUT /corporatecell/pending-events/:id/resources
// ==========================================
export const updateCorporateCellEventResources = (id, payload) => {
  return api.put(`/corporatecell/pending-events/${id}/resources`, payload);
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
// ==========================================
export const getCorporateCellEventTeam = (id) => {
  return api.get(`/corporatecell/pending-events/${id}/team`);
};

// ==========================================
// 10. UPDATE EVENT ASSIGNED TEAM & CONFIRM EVENT
// PUT /corporatecell/pending-events/:id/team
// (This call assigns team and triggers status to confirmed)
// ==========================================
export const updateCorporateCellEventTeam = (id, payload) => {
  return api.put(`/corporatecell/pending-events/${id}/team`, payload);
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

// ==========================================
// 15. GET TODAY'S EVENT BY ID
// GET /corporatecell/today-event/:id
// ==========================================
export const getCorporateCellTodayEventDetails = (id) => {
  return api.get(`/corporatecell/today-event/${id}`);
};

// ==========================================
// 16. TODAY'S EVENT CHECK-IN
// POST /corporatecell/today-event/check-in
// ==========================================
export const checkInTodayEvent = (id) => {
  return api.post("/corporatecell/today-event/check-in", { id });
};

// ==========================================
// 17. TODAY'S EVENT CHECK-OUT
// POST /corporatecell/today-event/check-out
// ==========================================
export const checkOutTodayEvent = (id) => {
  return api.post("/corporatecell/today-event/check-out", { id });
};

// ==========================================
// 18. EVENT CATEGORIES FILTERED EVENTS
// GET /corporatecell/event-categories/events?category=:category
// ==========================================
export const getCorporateCellEventCategoriesEvents = (category = "all", params = {}) => {
  return api.get("/corporatecell/event-categories/events", {
    params: {
      category,
      ...params,
    },
  });
};

// ==========================================
// 19. GET COMPLETED EVENTS LIST
// GET /corporatecell/completed-events
// ==========================================
export const getCorporateCellCompletedEvents = (params = {}) => {
  return api.get("/corporatecell/completed-events", { params });
};

// ==========================================
// 20. GET COMPLETED EVENT DETAILS
// GET /corporatecell/completed-events/:id
// ==========================================
export const getCorporateCellCompletedEventDetails = (id) => {
  return api.get(`/corporatecell/completed-events/${id}`);
};

// ==========================================
// 21. GET COMPLETED EVENT GALLERY
// GET /corporatecell/completed-events/:id/gallery
// ==========================================
export const getCorporateCellCompletedEventGallery = (id) => {
  return api.get(`/corporatecell/completed-events/${id}/gallery`);
};

// ==========================================
// 22. UPDATE COMPLETED EVENT GALLERY
// PUT /corporatecell/completed-events/:id/gallery
// ==========================================
export const updateCorporateCellCompletedEventGallery = (id, payload) => {
  return api.put(`/corporatecell/completed-events/${id}/gallery`, payload);
};

// ==========================================
// 23. DELETE COMPLETED EVENT GALLERY ITEM
// DELETE /corporatecell/completed-events/:id/gallery/:gallery_id
// ==========================================
export const deleteCorporateCellGalleryItem = (id, galleryId) => {
  return api.delete(`/corporatecell/completed-events/${id}/gallery/${galleryId}`);
};

