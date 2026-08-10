import api from "./axios";

// ==========================================
// Pharmacist Login
// ==========================================

export const pharmacistLogin = (payload) =>
    api.post("/auth/pharmacist/login", payload);


// ==========================================
// Pharmacist Dashboard
// ==========================================

// Medicines Dispensed
export const getMedicinesDispensed = () =>
    api.get("/pharmacist/dashboard/medicines-dispensed");

// Ailments Addressed
export const getPharmacistAilments = () =>
    api.get("/pharmacist/dashboard/ailments-addressed");

// Patients Tended
export const getPatientsTended = () =>
    api.get("/pharmacist/dashboard/patients-tended");

// Sales
export const getPharmacistSales = () =>
    api.get("/pharmacist/dashboard/sales");


// ==========================================
// Pharmacist Patients
// ==========================================

export const getPharmacistPatients = () =>
    api.get("/pharmacist/patients");


// ==========================================
// Prescription
// ==========================================

export const getPrescriptionItems = (consultationId) =>
    api.get(`/prescriptions/${consultationId}`);


// ==========================================
// Dispensing
// ==========================================

// Dispense single prescription item
export const dispensePrescriptionItem = (
    consultationId,
    payload
) =>
    api.put(
        `/pharmacist/prescriptions/item/${consultationId}`,
        payload
    );


// Bulk dispense
export const dispensePrescriptionBulk = (payload) =>
    api.post(
        "/pharmacist/prescriptions/dispense-bulk",
        payload
    );