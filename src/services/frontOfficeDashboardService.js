import {
  getAppointmentsCompleted,
  getFrontOfficeInsurance,
  getFrontOfficePackages,
  getFrontOfficeMedicalCamp,
  getFrontOfficeReferrals,
  getFrontOfficeBillingDetails,
  getFrontOfficeRecentTransactions,
  getFrontOfficePendingActions,
} from "../api/frontOfficeDashboardApi";


// ==========================================
// APPOINTMENTS COMPLETED
// ==========================================

export const fetchAppointmentsCompleted = async (
  period = "week"
) => {

  const response =
    await getAppointmentsCompleted(period);

  return response.data;
};


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

      fetchAppointmentsCompleted(period),

      fetchFrontOfficeInsurance(),

      fetchFrontOfficePackages(),

      fetchFrontOfficeMedicalCamp(),

      fetchFrontOfficeReferrals(),

      fetchFrontOfficeBillingDetails(),

      fetchFrontOfficeRecentTransactions(),

      fetchFrontOfficePendingActions(),

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