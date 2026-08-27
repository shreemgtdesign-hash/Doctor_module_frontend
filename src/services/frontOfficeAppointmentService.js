import {
    confirmAppointmentSlot,
    createDoctor,
    updateDoctor,
    toggleDoctorStatus,
    deleteDoctor,
    addDoctorSchedule,
    deleteDoctorSchedule,
    getInsuranceList,
    getReferralList,
    getPackages,
    getDoctorList,
    getMedicalCampList,
    registerMedicalCampPatient

} from "../api/frontOfficeAppoinntmentApi";
import { getMedicalCampDetails } from "../api/frontOfficeDashboardApi";


// ==========================================
// CONFIRM APPOINTMENT
// ==========================================

export const fetchConfirmAppointmentSlot = async (data) => {

    const response =
        await confirmAppointmentSlot(data);

    return response.data;
};


// ==========================================
// CREATE DOCTOR
// ==========================================

export const fetchCreateDoctor = async (data) => {

    const response =
        await createDoctor(data);

    return response.data;
};


// ==========================================
// UPDATE DOCTOR
// ==========================================

export const fetchUpdateDoctor = async (
    doctorId,
    data
) => {

    const response =
        await updateDoctor(
            doctorId,
            data
        );

    return response.data;
};


// ==========================================
// TOGGLE DOCTOR STATUS
// ==========================================

export const fetchToggleDoctorStatus = async (
    doctorId
) => {

    const response =
        await toggleDoctorStatus(
            doctorId
        );

    return response.data;
};


// ==========================================
// DELETE DOCTOR
// ==========================================

export const fetchDeleteDoctor = async (
    doctorId
) => {

    const response =
        await deleteDoctor(
            doctorId
        );

    return response.data;
};


// ==========================================
// ADD DOCTOR SCHEDULE
// ==========================================

export const fetchAddDoctorSchedule = async (
    data
) => {

    const response =
        await addDoctorSchedule(
            data
        );

    return response.data;
};


// ==========================================
// DELETE DOCTOR SCHEDULE
// ==========================================

export const fetchDeleteDoctorSchedule = async (
    scheduleId
) => {

    const response =
        await deleteDoctorSchedule(
            scheduleId
        );

    return response.data;
};

export const fetchInsuranceList = async (
    type = ""
) => {

    const response =
        await getInsuranceList(type);

    return response.data;

};

export const fetchReferralList = async (params = {}) => {

    const response =
        await getReferralList(params);

    return response.data;
};

export const fetchPackages = async (params = {}) => {
  const response = await getPackages(params);

  return response.data;
};

export const fetchDoctorList = async (params = {}) => {
  const response =
    await getDoctorList(params);

  return response.data;
};

export const fetchMedicalCampList = async (
  params = {}
) => {
  const response =
    await getMedicalCampList(
      params
    );

  return response.data;
};

export const fetchMedicalCampDetails = async (
  campId
) => {
  const response =
    await getMedicalCampDetails(
      campId
    );

  return response.data;
};

// ==========================================
// REGISTER MEDICAL CAMP PATIENT
// ==========================================

export const fetchRegisterMedicalCampPatient = async (
    data
) => {

    const response =
        await registerMedicalCampPatient(
            data
        );

    return response.data;
};