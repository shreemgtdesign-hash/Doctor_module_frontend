import {
  getMonthlySummary,
  getScheduleOverview,
  getTodaySchedule,
  getAppointments,
  getPatientProfile,
  getPatientWellness,
  getChiefComplaints,
  updateChiefComplaints,
  getDiagnosis,
  updateDiagnosis,
  getAssociateDoctors,
  searchPrescriptionProducts,
  getPrescription,
  createPrescription,
  updatePrescriptionNotes,
  updatePatientAllergies,
  updatePrescriptionItem,
  updatePrescription,
  addTherapy,
  getTherapies,
  searchTherapies,
  updateTherapy,
  getConsultationHistoryList,
  getMedicinesPrescribedList,
  getDiagnosisCategories,
  getDoctorsList,
  addAssociateDoctor,
  deleteAssociateDoctor,
  deleteTherapy,



} from "../api/doctorAppointmentApi";


export const fetchDashboard = async (doctorId, period) => {
  const [summary, overview, schedule] = await Promise.all([
    getMonthlySummary(doctorId),
    getScheduleOverview(doctorId, period),
    getTodaySchedule(doctorId),
  ]);

  return {
    summary: summary.data.data,
    overview: overview.data.data,
    schedule: schedule.data.data,
  };
};

export const fetchAppointments = async (

    period,
    status = ""
) => {

    const response =
        await getAppointments(
          
            period,
            status
        );

    return response.data.data;
};

export const fetchPatientProfile = async (
  patientId
) => {
  const response = await getPatientProfile(patientId);

  return response.data.data;
};

export const fetchPatientWellness = async (
  patientId
) => {
  const response = await getPatientWellness(patientId);

  return response.data.data;
};

export const fetchPatientDetails = async (
  patientId
) => {
  const [profile, wellness] = await Promise.all([
    getPatientProfile(patientId),
    getPatientWellness(patientId),
  ]);

  return {
    profile: profile.data.data,
    wellness: wellness.data.data,
  };
};


export const fetchChiefComplaints = async (
  appointmentId
) => {
  const response =
    await getChiefComplaints(appointmentId);

  console.log("GET Chief Complaints:", response.data);
  return response.data.data;
};

export const saveChiefComplaints = async (
  appointmentId,
  payload
) => {
  const response =
    await updateChiefComplaints(
      appointmentId,
      payload
    );

  return response.data;
};

export const fetchDiagnosis = async (appointmentId) => {
  const response = await getDiagnosis(appointmentId);
  return response.data.data;
};

export const saveDiagnosis = async (
  appointmentId,
  payload
) => {
  const response = await updateDiagnosis(
    appointmentId,
    payload
  );

  return response.data;
};

export const fetchAssociateDoctors = async (
  appointmentId
) => {
  const response = await getAssociateDoctors(
    appointmentId
  );

  return response.data.data;
};



// ============================
// Search Medicines
// ============================

export const fetchPrescriptionProducts = async (
  search
) => {
  const response =
    await searchPrescriptionProducts(search);

  return response.data.data;
};

// ============================
// Get Prescription
// ============================

export const fetchPrescription = async (
  consultationId
) => {

  const response =
    await getPrescription(
      consultationId
    );

  const medicines =
    response.data.data || [];

  return {

    consultation_id:
      consultationId,

    items:
      medicines,

    total:
      medicines.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
          Number(item.quantity || 1),
        0
      ),

    special_instructions:
      medicines[0]?.special_instructions || "",

    review_date:
      medicines[0]?.review_date || "",
  };
};



export const savePrescription =
  async (payload) => {
    const response =
      await createPrescription(
        payload
      );

    return response.data;
  };

// ============================
// Save Notes
// ============================

export const savePrescriptionNotes =
  async (
    consultationId,
    payload
  ) => {
    const response =
      await updatePrescriptionNotes(
        consultationId,
        payload
      );

    return response.data;
  };

// ============================
// Save Allergies
// ============================

export const savePatientAllergies =
  async (
    patient_d,
    payload
  ) => {
    const response =
      await updatePatientAllergies(
        patient_d,
        payload
      );

    return response.data;
  };


// ============================
// Search Therapies
// ============================

export const fetchTherapiesSearch = async (search) => {
  const response = await searchTherapies(search);
  return response.data.data;
};

// ============================
// Load Therapies
// ============================

export const fetchTherapies = async (appointmentId) => {
  const response = await getTherapies(appointmentId);
  console.log("Therapies GET:", response.data);
  return response.data.data;
};

// ============================
// Add Therapy
// ============================

export const saveTherapy = async (
  appointmentId,
  payload
) => {
  const response = await addTherapy(
    appointmentId,
    payload
  );

  return response.data;
};

// ============================
// Update Therapy
// ============================

export const editTherapy = async (
  therapyId,
  payload
) => {
  const response = await updateTherapy(
    therapyId,
    payload
  );

  return response.data;
};

export const removeTherapy = async (
  therapyId
) => {
  const response =
    await deleteTherapy(
      therapyId
    );

  return response.data;
};


// ============================
// Consultation History List
// ============================

export const fetchConsultationHistoryList =
  async (doctorId, period) => {
    const response =
      await getConsultationHistoryList(
        doctorId,
        period
      );

    return response.data;
  };


// ============================
// Medicines Prescribed List
// ============================

export const fetchMedicinesPrescribedList =
  async (doctorId, period) => {
    const response =
      await getMedicinesPrescribedList(
        doctorId,
        period
      );

    return response.data;
  };

export const fetchDiagnosisCategories = async () => {
  const response = await getDiagnosisCategories();
  return response.data.data;
};


export const editPrescription = async (
  consultationId,
  payload
) => {

  const response =
    await updatePrescription(
      consultationId,
      payload
    );

  return response.data;

};

export const editPrescriptionItem = async (
  itemId,
  payload
) => {

  const response =
    await updatePrescriptionItem(
      itemId,
      payload
    );

  return response.data;

};

// =========================
// Load Doctors
// =========================

export const fetchDoctorsList = async () => {
  const response = await getDoctorsList();

  return response.data.data;
};

// =========================
// Add Associate Doctor
// =========================

export const createAssociateDoctor = async (
  appointmentId,
  payload
) => {

  const response = await addAssociateDoctor(
    appointmentId,
    payload
  );

  return response.data;
};

// =========================
// Delete Associate Doctor
// =========================

export const removeAssociateDoctor = async (
  associateDoctorId
) => {

  const response = await deleteAssociateDoctor(
    associateDoctorId
  );

  return response.data;
};