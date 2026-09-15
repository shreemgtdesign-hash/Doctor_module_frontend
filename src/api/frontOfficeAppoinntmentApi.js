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
    api.post("/frontoffice/patients/walk-in/appointment", data);

export const createDirectWalkInMedicinePurchase = (data) => {
  return api.post(
    "/frontoffice/patients/walk-in/medicine",
    data
  );
};

export const createDirectWalkInTherapyBooking = (data) => {
  return api.post(
    "/frontoffice/patients/walk-in/therapy",
    data
  );
};
export const getFrontOfficeTherapies = () => {
  return api.get("/frontoffice/therapies");
};
export const getDoctorTimeSlots = (doctorId, date) =>
    api.get(`/frontoffice/doctors/${doctorId}/slots`, {
        params: { date },
    });

    // ==========================================
// APPOINTMENT CONFIRMATION LIST
// ==========================================

export const getAppointmentConfirmationList = () =>
    api.get(
        "/frontoffice/appointments/confirmation-list"
    );

    // ==========================================
// APPOINTMENT CONFIRMATION OVERVIEW
// ==========================================

export const getAppointmentConfirmation = (doctorId) =>
    api.get(
        "/frontoffice/appointments/confirmation",
        {
            params: {
                doctor_id: doctorId,
            },
        }
    );
export const getTherapyAppointmentConfirmation  =()=>
    api.get(
        "/frontoffice/therapy/confirmation",);

export const getHomevisitAppointmentConfirmation = (doctorId) =>
    api.get(
        "/frontoffice/homevisit/confirmation",
        {
            params: {
                doctor_id: doctorId,
            },
        }
    );


    export const getFrontOfficeUpcomingAppointments = (
    period = "week",
    page = 1,
    limit = 12
) =>
    api.get(
        "/frontoffice/upcoming-appointments",
        {
            params: {
                period,
                page,
                limit,
            },
        }
    );


export const getFrontOfficeUpcomingAppointmentDetails = (
  appointmentId
) =>
  api.get(
    `/frontoffice/upcoming-appointments/${appointmentId}`
  );


// ==========================================
// UPDATE UPCOMING APPOINTMENT DETAILS
// ==========================================

export const updateFrontOfficeUpcomingAppointmentDetails = (
  appointmentId,
  payload
) =>
  api.put(
    `/frontoffice/upcoming-appointments/${appointmentId}`,
    payload
  );


  // ==========================================
// PATIENT REPORT APIs
// ==========================================

// Upload Report File
export const uploadPatientReportFile = (formData) =>
    api.post(
        "/reports/upload",
        formData
    );

// Create Report Record
export const createPatientReport = (data) =>
    api.post(
        "/reports",
        data
    );

// Get Patient Reports
export const getPatientReports = (patientId) =>
    api.get(
        "/reports",
        {
            params: {
                patient_id: patientId,
            },
        }
    );



    // ==========================================
// CREATE PATIENT REPORT
// ==========================================

export const fetchCreatePatientReport = (payload) => {
    return api.post("/reports", payload);
};



// Confirm Appointment Slot + Room
export const confirmAppointmentRoom = (data) =>
    api.post(
        "/frontoffice/appointments/confirmroom",
        data
    );

export const getHomevisitConfirmationList = () =>
    api.get(
        "/frontoffice/homevisit/confirmation-list"
    );