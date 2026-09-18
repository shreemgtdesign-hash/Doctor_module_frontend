import api from "./axios";

// ==========================================
// Pharmacist Login
// ==========================================

export const pharmacistLogin = (payload) =>
    api.post(
        "/auth/pharmacist/login",
        payload
    );


// ==========================================
// Pharmacist Dashboard
// ==========================================

export const getMedicinesDispensedTable = (period="week") =>
    api.get(
        "/pharmacist/medicines-dispensed",
         {
            params: {
                period,
            },
        }
    );

export const getMedicinesDispensed = (period="week") =>
    api.get(
        "/pharmacist/dashboard/medicines-dispensed",
         {
            params: {
                period,
            },
        }
    );

export const getPharmacistAilments = (period="week") =>
    api.get(
        "/pharmacist/dashboard/ailments-addressed",
         {
            params: {
                period,
            },
        }
    );

export const getPatientsTended = (
     period = "week"
) =>
    api.get(
        "/pharmacist/dashboard/patients-tended",
         {
            params: {
                period,
            },
        }
    );


// ==========================================
// SALES
// ==========================================

export const getPharmacistSales = (
    period = "week"
) =>
    api.get(
        "/pharmacist/dashboard/sales",
        {
            params: {
                period,
            },
        }
    );


// ==========================================
// Pharmacist Patients
// ==========================================

export const getPharmacistPatients = () =>
    api.get(
        "/pharmacist/patients"
    );


// ==========================================
// Prescription
// ==========================================

export const getPrescriptionItems = (
    consultationId
) =>
    api.get(
        `/prescriptions/${consultationId}`
    );


// ==========================================
// Dispensing
// ==========================================

export const dispensePrescriptionItem = (
    consultationId,
    payload
) =>
    api.put(
        `/pharmacist/prescriptions/item/${consultationId}`,
        payload
    );

export const dispensePrescriptionBulk = (
    payload
) =>
    api.post(
        "/pharmacist/prescriptions/dispense-bulk",
        payload
    );


// ==========================================
// Medicine Search
// ==========================================

export const searchPharmacistMedicines = (
    search
) =>
    api.get(
        "/pharmacist/medicines",
        {
            params: {
                search,
            },
        }
    );


// ==========================================
// EMPLOYEE APIs
// ==========================================

// Employee List
// IMPORTANT:
// Replace this URL if your backend gives
// a different employee-list endpoint.
export const getPharmacistEmployees = () =>
    api.get(
        "/pharmacist/employees"
    );


// ==========================================
// EMPLOYEE PURCHASE
// ==========================================

export const createEmployeePurchase = (
    payload
) =>
    api.post(
        "/pharmacist/employee-purchases",
        payload
    );


// ==========================================
// EMPLOYEE PURCHASE LIST
// ==========================================

export const getEmployeePurchases = () =>
    api.get(
        "/pharmacist/employee-purchases"
    );


// ==========================================
// ONLINE DELIVERY ORDERS
// ==========================================

// Online delivery orders queue
export const getOnlineDeliveryOrders = () =>
    api.get(
        "/pharmacist/online-orders"
    );


// Order details
export const getOnlineOrderDetails = (
    orderId
) =>
    api.get(
        `/pharmacist/orders/${orderId}`
    );


// Process delivery
export const processOnlineOrderDelivery = (
    orderId
) =>
    api.post(
        `/pharmacist/orders/${orderId}/process-delivery`
    );