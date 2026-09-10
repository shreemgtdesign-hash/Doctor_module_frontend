import api from "./axios";

// ==========================================
// THERAPIES PERFORMED
// ==========================================

export const getTherapiesPerformed = (
    period = "week"
) =>
    api.get(
        `/therapist/dashboard/therapies-performed?period=${period}`
    );


// ==========================================
// AILMENTS ADDRESSED
// ==========================================

export const getTherapistAilments = (
    period = "week"
) =>
    api.get(
        `/therapist/dashboard/ailments-addressed?period=${period}`
    );


// ==========================================
// PATIENTS TENDED
// ==========================================

export const getTherapistPatients = () =>
    api.get(
        "/therapist/dashboard/patients-tended"
    );


// ==========================================
// SCHEDULE OVERVIEW
// ==========================================

export const getTherapistScheduleOverview = (
    period = "today"
) => {

    return api.get(
        `/therapist/dashboard/patients-tended?period=${period}`
    );

};