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
    registerMedicalCampPatient,
    createDirectWalkInPatient,
    getDoctorTimeSlots,
    createDirectWalkInMedicinePurchase,
    getFrontOfficeTherapies,
    createDirectWalkInTherapyBooking,
    getAppointmentConfirmation,
    getFrontOfficeUpcomingAppointmentDetails,
    updateFrontOfficeUpcomingAppointmentDetails,
    getFrontOfficeUpcomingAppointments,
    getPatientReports,
    uploadPatientReportFile,
    createPatientReport,
    confirmAppointmentRoom,
    getHomevisitAppointmentConfirmation,
    getTherapyAppointmentConfirmation,
    getHomevisitConfirmationList,
    selectTherapist,
    getTherapistList,
    sendPendingActionReminder,
    getTherapyReminders,
    getAppointmentReminders,
    createMedicalCamp,
    getOnlineMedicineOrderDetails,
    getOnlineMedicineOrders

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

export const fetchConfirmAppointmentRoom = async (data) => {

    const response =
        await confirmAppointmentRoom(data);

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

export const fetchCreateDirectWalkInPatient = async (data) => {
    const response =
        await createDirectWalkInPatient(data);

    return response.data;
};

export const fetchCreateDirectWalkInMedicinePurchase = async (
    data
) => {
    const response =
        await createDirectWalkInMedicinePurchase(data);

    return response.data;
};

export const fetchCreateDirectWalkInTherapyBooking = async (
    data
) => {
    const response =
        await createDirectWalkInTherapyBooking(data);

    return response.data;
};

export const fetchFrontOfficeTherapies = async () => {
    const response = await getFrontOfficeTherapies();

    return response.data;
};

export const fetchDoctorTimeSlots = (doctorId, date) =>
  getDoctorTimeSlots(doctorId, date);

// ==========================================
// GET APPOINTMENT CONFIRMATION
// ==========================================

export const fetchAppointmentConfirmation = async (
    doctorId
) => {

    const response =
        await getAppointmentConfirmation(
            doctorId
        );

    return response.data;
};

export const fetchFrontOfficeUpcomingAppointmentDetails =
  async (appointmentId) => {

    const response =
      await getFrontOfficeUpcomingAppointmentDetails(
        appointmentId
      );

    return response.data;
  };


// ==========================================
// UPDATE APPOINTMENT DETAILS
// ==========================================

export const saveFrontOfficeUpcomingAppointmentDetails =
  async (
    appointmentId,
    payload
  ) => {

    const response =
      await updateFrontOfficeUpcomingAppointmentDetails(
        appointmentId,
        payload
      );

    return response.data;
  };



  // ==========================================
// UPCOMING APPOINTMENTS LIST
// ==========================================

export const fetchFrontOfficeUpcomingAppointments =
    async (
        period = "week",
        page = 1,
        limit = 12
    ) => {

        const response =
            await getFrontOfficeUpcomingAppointments(
                period,
                page,
                limit
            );

        return response.data;
    };




    // ==========================================
// UPLOAD PATIENT REPORT FILE
// ==========================================

export const fetchUploadPatientReportFile = async (
    formData
) => {

    const response =
        await uploadPatientReportFile(
            formData
        );

    return response.data;
};


// ==========================================
// CREATE PATIENT REPORT
// ==========================================

export const fetchCreatePatientReport = async (
    data
) => {

    const response =
        await createPatientReport(
            data
        );

    return response.data;
};


// ==========================================
// GET PATIENT REPORTS
// ==========================================

export const fetchPatientReports = async (
    patientId
) => {

    const response =
        await getPatientReports(
            patientId
        );

    return response.data;
};


export const fetchTherapyAppointmentConfirmation =
    async () => {

        const response =
            await getTherapyAppointmentConfirmation();

        return response.data;
    };


// ==========================================
// GET HOME VISIT CONFIRMATION
// ==========================================

export const fetchHomevisitAppointmentConfirmation =
    async (
        doctorId
    ) => {

        const response =
            await getHomevisitAppointmentConfirmation(
                doctorId
            );

        return response.data;
    };


// ==========================================
// GET HOME VISIT CONFIRMATION LIST
// ==========================================

export const fetchHomevisitConfirmationList = async () => {

    const response =
        await getHomevisitConfirmationList();

    return response.data;
};


// ==========================================
// GET THERAPIST LIST
// ==========================================

export const fetchTherapistList = async () => {

    const response =
        await getTherapistList();

    return response.data;
};


// ==========================================
// SELECT THERAPIST
// ==========================================

export const fetchSelectTherapist = async (
    data
) => {

    const response =
        await selectTherapist(data);

    return response.data;
};

// ==========================================
// GET APPOINTMENT REMINDERS
// ==========================================

export const fetchAppointmentReminders = async () => {

    const response =
        await getAppointmentReminders();

    return response.data;
};


// ==========================================
// GET THERAPY REMINDERS
// ==========================================

export const fetchTherapyReminders = async () => {

    const response =
        await getTherapyReminders();

    return response.data;
};


// ==========================================
// SEND PENDING ACTION REMINDER
// ==========================================

export const fetchSendPendingActionReminder = async (
    data
) => {

    const response =
        await sendPendingActionReminder(
            data
        );

    return response.data;
};

// ==========================================
// CREATE MEDICAL CAMP
// ==========================================

export const fetchCreateMedicalCamp = async (
    data
) => {

    const response =
        await createMedicalCamp(data);

    return response.data;
};

// ==========================================
// GET ONLINE MEDICINE ORDERS
// ==========================================

export const fetchOnlineMedicineOrders = async (
    page = 1,
    limit = 8
) => {

    const response =
        await getOnlineMedicineOrders(
            page,
            limit
        );

    return response.data;
};


// ==========================================
// GET ONLINE MEDICINE ORDER DETAILS
// ==========================================

export const fetchOnlineMedicineOrderDetails =
    async (
        orderId
    ) => {

        const response =
            await getOnlineMedicineOrderDetails(
                orderId
            );

        return response.data;
    };