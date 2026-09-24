import {
  getCorporateDashboard,
  getCorporateEvents,
} from "../api/corporateDashboardApi";


// ==========================================
// DASHBOARD OVERVIEW
// ==========================================

export const fetchCorporateDashboard = async () => {
  const response = await getCorporateDashboard();

  return response.data?.data || {};
};


// ==========================================
// EVENTS BY MONTH
// ==========================================

export const fetchCorporateEvents = async (
  month
) => {
  const response = await getCorporateEvents(month);

  return {
    count: response.data?.count || 0,

    currentMonth:
      response.data?.current_month || month,

    data:
      response.data?.data || [],
  };
};