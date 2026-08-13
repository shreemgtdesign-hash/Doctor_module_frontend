import api from "./axios";

// ==========================================
// THERAPIES PERFORMED
// ==========================================

export const getTherapiesPerformed = () =>
    api.get(
        "/therapist/dashboard/therapies-performed"
    );


// ==========================================
// AILMENTS ADDRESSED
// ==========================================

export const getTherapistAilments = () =>
    api.get(
        "/therapist/dashboard/ailments-addressed"
    );


// ==========================================
// PATIENTS TENDED
// ==========================================

export const getTherapistPatients = () =>
    api.get(
        "/therapist/dashboard/patients-tended"
    );


// ==========================================
// SALES
// ==========================================

export const getTherapistSales = () =>
    api.get(
        "/therapist/dashboard/sales"
    );