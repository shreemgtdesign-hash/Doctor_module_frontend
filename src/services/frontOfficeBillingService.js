import {
    getPendingPayments,
    getPendingPaymentInvoiceDetails,
    getAssociateDoctorPayouts,
    getAssociateDoctorPayoutDetails,
    getVisitingDoctorPayoutDetails,
    getVisitingDoctorPayouts,
} from "../api/frontOfficeBillingApi";


// ==========================================
// GET PENDING PAYMENTS
// ==========================================

export const fetchPendingPayments =
    async (
        page = 1,
        limit = 8
    ) => {

        const response =
            await getPendingPayments(
                page,
                limit
            );

        return response.data;
    };


// ==========================================
// GET INVOICE DETAILS
// ==========================================

export const fetchPendingPaymentInvoiceDetails =
    async (
        appointmentId
    ) => {

        const response =
            await getPendingPaymentInvoiceDetails(
                appointmentId
            );

        return response.data;
    };


export const fetchVisitingDoctorPayouts = async (
  page = 1,
  limit = 8
) => {
  const response = await getVisitingDoctorPayouts(page, limit);

  return response.data;
};


export const fetchVisitingDoctorPayoutDetails = async (
  doctorId
) => {
  const response =
    await getVisitingDoctorPayoutDetails(doctorId);

  return response.data;
};


/* =========================================================
   ASSOCIATE DOCTOR
========================================================= */

export const fetchAssociateDoctorPayouts = async (
  page = 1,
  limit = 8
) => {
  const response =
    await getAssociateDoctorPayouts(page, limit);

  return response.data;
};


export const fetchAssociateDoctorPayoutDetails = async (
  doctorId
) => {
  const response =
    await getAssociateDoctorPayoutDetails(doctorId);

  return response.data;
};