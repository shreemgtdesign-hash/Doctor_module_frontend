import {
    getPatientList,
    getPatientProfile,
    updatePatient,
    deletePatient,
} from "../api/frontOfficePatientApi";


// ==========================================
// FETCH PATIENT LIST
// ==========================================

export const fetchPatientList = async (
    params = {}
) => {

    const response =
        await getPatientList(params);

    return response.data;
};


// ==========================================
// FETCH PATIENT PROFILE
// ==========================================

export const fetchPatientProfile = async (
    patientId
) => {

    const response =
        await getPatientProfile(
            patientId
        );

    return response.data;
};


// ==========================================
// UPDATE PATIENT
// ==========================================

export const fetchUpdatePatient = async (
    patientId,
    data
) => {

    const response =
        await updatePatient(
            patientId,
            data
        );

    return response.data;
};


// ==========================================
// DELETE PATIENT
// ==========================================

export const fetchDeletePatient = async (
    patientId
) => {

    const response =
        await deletePatient(
            patientId
        );

    return response.data;
};