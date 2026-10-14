import {
  getCorporateDashboard,
  getCorporateEvents,
  getCorporateMyEvents,
  getCorporateCompanyDetailsOptions,
  submitCorporateCompanyRegistration,
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


// ==========================================
// MY EVENTS
// ==========================================

export const fetchCorporateMyEvents = async (params = {}) => {
  const response = await getCorporateMyEvents(params);
  return response.data || {};
};

// ==========================================
// COMPANY DETAILS OPTIONS & REGISTRATION
// ==========================================

export const fetchCorporateCompanyDetailsOptions = async () => {
  const response = await getCorporateCompanyDetailsOptions();
  return response.data || {};
};

export const registerCorporateCompany = async (payload) => {
  const response = await submitCorporateCompanyRegistration(payload);
  return response.data || {};
};