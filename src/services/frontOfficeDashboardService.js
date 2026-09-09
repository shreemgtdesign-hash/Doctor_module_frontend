import {

  getFrontOfficeInsurance,
  getFrontOfficePackages,
  getFrontOfficeMedicalCamp,
  getFrontOfficeReferrals,
  getFrontOfficeBillingDetails,
  getFrontOfficeRecentTransactions,
  getFrontOfficePendingActions,
  getFrontOfficeUpcomingAppointments,
} from "../api/frontOfficeDashboardApi";


// ==========================================
// APPOINTMENTS COMPLETED
// ==========================================




// ==========================================
// INSURANCE
// ==========================================

export const fetchFrontOfficeInsurance = async () => {

  const response =
    await getFrontOfficeInsurance();

  return response.data.data;
};


// ==========================================
// PACKAGES
// ==========================================

export const fetchFrontOfficePackages = async () => {

  const response =
    await getFrontOfficePackages();

  return response.data.data;
};


// ==========================================
// MEDICAL CAMP
// ==========================================

export const fetchFrontOfficeMedicalCamp =
  async () => {

    const response =
      await getFrontOfficeMedicalCamp();

    return response.data.data;
  };


// ==========================================
// REFERRALS
// ==========================================

export const fetchFrontOfficeReferrals =
  async () => {

    const response =
      await getFrontOfficeReferrals();

    return response.data.data;
  };


// ==========================================
// BILLING
// ==========================================

export const fetchFrontOfficeBillingDetails =
  async () => {

    const response =
      await getFrontOfficeBillingDetails();

    return response.data.data;
  };


// ==========================================
// RECENT TRANSACTIONS
// ==========================================

export const fetchFrontOfficeRecentTransactions =
  async () => {

    const response =
      await getFrontOfficeRecentTransactions();

    return response.data;
  };


// ==========================================
// PENDING ACTIONS
// ==========================================

export const fetchFrontOfficePendingActions =
  async () => {

    const response =
      await getFrontOfficePendingActions();

    return response.data.data;
  };
export const fetchFrontOfficeUpcomingAppointments =
  async (period = "week") => {

    const response =
      await getFrontOfficeUpcomingAppointments(
        period
      );

    return response.data;
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

      fetchFrontOfficeUpcomingAppointments(period),
      fetchFrontOfficeInsurance(period),

      fetchFrontOfficePackages(period),

      fetchFrontOfficeMedicalCamp(period),

      fetchFrontOfficeReferrals(period),

      fetchFrontOfficeBillingDetails(period),

      fetchFrontOfficeRecentTransactions(period),

      fetchFrontOfficePendingActions(period),

    ]);

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