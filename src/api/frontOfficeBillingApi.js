import api from "./axios";

// ==========================================
// PENDING PAYMENTS
// ==========================================

export const getPendingPayments = (
    page = 1,
    limit = 8
) =>
    api.get(
        "/frontoffice/billing/pending-payments",
        {
            params: {
                page,
                limit,
            },
        }
    );


// ==========================================
// PENDING PAYMENT INVOICE DETAILS
// ==========================================

export const getPendingPaymentInvoiceDetails = (
    appointmentId
) =>
    api.get(
        `/frontoffice/billing/pending-payments/${appointmentId}`
    );

    export const getVisitingDoctorPayouts = (page = 1, limit = 8) =>
  api.get("/frontoffice/billing/visiting-doctor-payouts", {
    params: {
      page,
      limit,
    },
  });

export const getVisitingDoctorPayoutDetails = (doctorId) =>
  api.get(`/frontoffice/billing/visiting-doctor-payouts/${doctorId}`);


/* =========================================================
   ASSOCIATE DOCTOR PAYOUTS
========================================================= */

export const getAssociateDoctorPayouts = (page = 1, limit = 8) =>
  api.get("/frontoffice/billing/associate-doctor-payouts", {
    params: {
      page,
      limit,
    },
  });

export const getAssociateDoctorPayoutDetails = (doctorId) =>
  api.get(`/frontoffice/billing/associate-doctor-payouts/${doctorId}`);


// ==========================================
// APPLY DISCOUNT & REMARKS
// ==========================================

export const applyPendingPaymentDiscount = (
    appointmentId,
    data
) =>
    api.post(
        `/frontoffice/billing/pending-payments/${appointmentId}`,
        data
    );