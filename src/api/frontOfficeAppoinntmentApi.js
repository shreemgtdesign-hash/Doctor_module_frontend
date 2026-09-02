import api from "./axios";

// ==========================================
// FRONT OFFICE APPOINTMENT APIs
// ==========================================

// Confirm Appointment Slot
export const confirmAppointmentSlot = (data) =>
    api.post(
        "/frontoffice/appointments/confirm",
        data
    );

export const getDoctorList = (params = {}) =>
    api.get(
        "/frontoffice/doctors",
        {
            params,
        }
    );

export const createDoctor = (data) =>
    api.post(
        "/frontoffice/doctors",
        data
    );



export const updateDoctor = (doctorId, data) =>
    api.put(
        `/frontoffice/doctors/${doctorId}`,
        data
    );


// Deactivate / Activate Doctor
export const toggleDoctorStatus = (doctorId) =>
    api.put(
        `/frontoffice/doctors/${doctorId}/status`
    );


// Delete Doctor
export const deleteDoctor = (doctorId) =>
    api.delete(
        `/frontoffice/doctors/${doctorId}`
    );


// ==========================================
// DOCTOR SCHEDULE APIs
// ==========================================

// Add Doctor Schedule
export const addDoctorSchedule = (data) =>
    api.post(
        "/frontoffice/doctors/schedule",
        data
    );


// Delete Doctor Schedule
export const deleteDoctorSchedule = (scheduleId) =>
    api.delete(
        `/frontoffice/doctors/schedule/${scheduleId}`
    );

export const getInsuranceList = (type = "") => {
    const url = type
        ? `/frontoffice/insurance-list?type=${type}`
        : "/frontoffice/insurance-list";

    return api.get(url);
};

export const getReferralList = (params = {}) =>
    api.get(
        "/frontoffice/referrals-list",
        {
            params,
        }
    );

export const getPackages = (params = {}) =>
    api.get(
        "/frontoffice/packages-list",
        {
            params,
        }
    );

export const getMedicalCampList = (params = {}) =>
    api.get(
        "/frontoffice/medicalcamp-calendar-list",
        {
            params,
        }
    );
    export const registerMedicalCampPatient = (data) =>
    api.post(
        "/frontoffice/medicalcamp/register-patient",
        data
    );
export const createDirectWalkInPatient = (data) =>
  api.post("/frontoffice/patients/walk-in", data);

export const getDoctorTimeSlots = (doctorId, date) =>
  api.get(`/frontoffice/doctors/${doctorId}/slots`, {
    params: { date },
  });