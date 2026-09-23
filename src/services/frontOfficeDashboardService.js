import {
    getFrontOfficeInsurance,
    getFrontOfficePackages,
    getFrontOfficeMedicalCamp,
    getFrontOfficeReferrals,
    getFrontOfficeBillingDetails,
    getFrontOfficeRecentTransactions,
    getFrontOfficePendingActions,
    getFrontOfficeUpcomingAppointments,
    getFrontOfficeSalesDetails,
} from "../api/frontOfficeDashboardApi";


// ==========================================
// APPOINTMENTS
// ==========================================

export const fetchFrontOfficeUpcomingAppointments =
    async (period = "week") => {

        const response =
            await getFrontOfficeUpcomingAppointments(
                period
            );

        return response.data;
    };


// ==========================================
// INSURANCE
// ==========================================

export const fetchFrontOfficeInsurance =
    async (period = "week") => {

        const response =
            await getFrontOfficeInsurance(
                period
            );

        return response.data.data;
    };


// ==========================================
// PACKAGES
// ==========================================

export const fetchFrontOfficePackages =
    async (period = "week") => {

        const response =
            await getFrontOfficePackages(
                period
            );

        return response.data.data;
    };


// ==========================================
// MEDICAL CAMP
// ==========================================

export const fetchFrontOfficeMedicalCamp =
    async (period = "week") => {

        const response =
            await getFrontOfficeMedicalCamp(
                period
            );

        return response.data.data;
    };


// ==========================================
// REFERRALS
// ==========================================

export const fetchFrontOfficeReferrals =
    async (period = "week") => {

        const response =
            await getFrontOfficeReferrals(
                period
            );

        return response.data.data;
    };


// ==========================================
// BILLING
// ==========================================

export const fetchFrontOfficeBillingDetails =
    async (period = "week") => {

        const response =
            await getFrontOfficeBillingDetails(
                period
            );

        console.log(
            "BILLING API RESPONSE:",
            response.data
        );

        return response.data?.billing_details || null;
    };


// ==========================================
// RECENT TRANSACTIONS
// ==========================================

export const fetchFrontOfficeRecentTransactions =
    async (period = "today") => {

        const response =
            await getFrontOfficeRecentTransactions(
                period
            );

        return response.data;
    };

// ==========================================
// PENDING ACTIONS
// ==========================================

export const fetchFrontOfficePendingActions =
    async (period = "today") => {

        const response =
            await getFrontOfficePendingActions(
                period
            );

        return response.data.data;
    };


// ==========================================
// COMPLETE DASHBOARD
// ==========================================

export const fetchFrontOfficeDashboard =
    async (period = "week") => {

        const [
            appointments,
            insurance,
            packages,
            medicalCamp,
            referrals,
            billing,
            transactions,
            pendingActions,
        ] = await Promise.all([

            fetchFrontOfficeUpcomingAppointments(
                period
            ),

            fetchFrontOfficeInsurance(
                period
            ),

            fetchFrontOfficePackages(
                period
            ),

            fetchFrontOfficeMedicalCamp(
                period
            ),

            fetchFrontOfficeReferrals(
                period
            ),

            fetchFrontOfficeBillingDetails(
                period
            ),

            fetchFrontOfficeRecentTransactions(
                period
            ),

            fetchFrontOfficePendingActions(
                period
            ),

        ]);

        console.log(
            "🔥 BILLING FROM DASHBOARD SERVICE:",
            billing
        );

        return {
            appointments,
            insurance,
            packages,
            medicalCamp,
            referrals,
            billing,
            transactions,
            pendingActions,
        };
    };


// ==========================================
// SALES DETAILS
// ==========================================

export const fetchFrontOfficeSalesDetails =
    async (period = "week") => {

        const response =
            await getFrontOfficeSalesDetails(
                period
            );

        return response.data?.data || null;
    };