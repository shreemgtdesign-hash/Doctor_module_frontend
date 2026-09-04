import api from "./axios";

// ==========================================
// GET PATIENT LIST
// ==========================================

export const getPatientList = (params = {}) => {
    return api.get(
        "/frontoffice/patients",
        {
            params,
        }
    );
};


// ==========================================
// GET PATIENT PROFILE + VISIT HISTORY
// ==========================================

export const getPatientProfile = (
    patientId
) => {
    return api.get(
        `/frontoffice/patients/${patientId}`
    );
};


// ==========================================
// UPDATE PATIENT
// ==========================================

export const updatePatient = (
    patientId,
    data
) => {
    return api.put(
        `/frontoffice/patients/${patientId}`,
        data
    );
};


// ==========================================
// DELETE PATIENT
// ==========================================

export const deletePatient = (
    patientId
) => {
    return api.delete(
        `/frontoffice/patients/${patientId}`
    );
};