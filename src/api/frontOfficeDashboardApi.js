import api from "./axios";

// ==========================================
// FRONT OFFICE DASHBOARD APIs
// ==========================================

// ==========================================
// UPCOMING APPOINTMENTS
// ==========================================

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


// ==========================================
// INSURANCE
// ==========================================

export const getFrontOfficeInsurance = (
    period = "today"
) =>
    api.get(
        "/frontoffice/dashboard/insurance",
        {
            params: {
                period,
            },
        }
    );


// ==========================================
// PACKAGES
// ==========================================

export const getFrontOfficePackages = (
    period = "till_date"
) =>
    api.get(
        "/frontoffice/dashboard/packages",
        {
            params: {
                period,
            },
        }
    );


// ==========================================
// MEDICAL CAMP
// ==========================================

export const getFrontOfficeMedicalCamp = (
    period = "week"
) =>
    api.get(
        "/frontoffice/dashboard/medical-camp",
        {
            params: {
                period,
            },
        }
    );


// ==========================================
// REFERRALS
// ==========================================

export const getFrontOfficeReferrals = (
    period = "week"
) =>
    api.get(
        "/frontoffice/dashboard/referrals",
        {
            params: {
                period,
            },
        }
    );


// ==========================================
// BILLING DETAILS
// ==========================================

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


// ==========================================
// RECENT TRANSACTIONS
// ==========================================

export const getFrontOfficeRecentTransactions = (
    period = "week"
) =>
    api.get(
        "/frontoffice/dashboard/recent-transactions",
        {
            params: {
                period,
            },
        }
    );


// ==========================================
// PENDING ACTIONS
// ==========================================

export const getFrontOfficePendingActions = (
    period = "today"
) =>
    api.get(
        "/frontoffice/dashboard/pending-actions",
        {
            params: {
                period,
            },
        }
    );


// ==========================================
// MEDICAL CAMP DETAILS
// ==========================================

export const getMedicalCampDetails = (
    campId
) =>
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