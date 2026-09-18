import api from "./axios";

// ==========================================
// FRONT OFFICE DASHBOARD APIs
// ==========================================

// Appointments Completed

export const getFrontOfficeUpcomingAppointments = (
  period = "week"
) =>
  api.get(
    "/frontoffice/dashboard/upcoming-appointments",
    {
      params: {
        period,
      },
    }
  );
// Insurance
export const getFrontOfficeInsurance = () =>
  api.get(
    "/frontoffice/dashboard/insurance"
  );


// Packages
export const getFrontOfficePackages = () =>
  api.get(
    "/frontoffice/dashboard/packages"
  );


// Medical Camp
export const getFrontOfficeMedicalCamp = () =>
  api.get(
    "/frontoffice/dashboard/medical-camp"
  );


// Referrals
export const getFrontOfficeReferrals = () =>
  api.get(
    "/frontoffice/dashboard/referrals"
  );


// Billing Details
export const getFrontOfficeBillingDetails = (
    period = "week"
) =>
    api.get(
        "/frontoffice/dashboard/billing-details",
        {
            params: {
                period,
            },
        }
    );

// Recent Transactions
export const getFrontOfficeRecentTransactions = () =>
  api.get(
    "/frontoffice/dashboard/recent-transactions"
  );


// Pending Actions
export const getFrontOfficePendingActions = () =>
  api.get(
    "/frontoffice/dashboard/pending-actions"
  );


export const getMedicalCampDetails = (campId) =>
  api.get(
    `/frontoffice/medicalcamp-details/${campId}`
  );


// ==========================================
// SALES DETAILS
// ==========================================

export const getFrontOfficeSalesDetails = (
    period = "week"
) =>
    api.get(
        "/frontoffice/dashboard/sales-details",
        {
            params: {
                period,
            },
        }
    );