import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAppointments,
  getPatientProfile,
  getPatientWellness,
} from "../../api/doctorAppointmentApi";
import {
  fetchChiefComplaints, saveChiefComplaints, fetchDiagnosis, saveDiagnosis, fetchAssociateDoctors, fetchPrescriptionProducts,
  fetchPrescription, savePrescription, savePrescriptionNotes, savePatientAllergies, fetchTherapiesSearch, fetchTherapies,
  saveTherapy, editTherapy, fetchDiagnosisCategories, editPrescription,
  editPrescriptionItem, fetchDoctorsList, createAssociateDoctor, removeAssociateDoctor,
  fetchAppointments,
  removeTherapy,
  completeConsultation,
  fetchPatientHistory,
  fetchPatientConsultationReport,
} from "../../services/doctorAppointmentService";

export const loadAppointments = createAsyncThunk(
  "consultation/loadAppointments",

  async (
    {
      period,
      status = "",
    },
    { rejectWithValue }
  ) => {

    try {

      return await fetchAppointments(
        period,
        status
      );

    } catch (error) {

      return rejectWithValue(
        error.response?.data ||
        error.message
      );

    }

  }
);

export const loadPatientDetails = createAsyncThunk(
  "consultation/loadPatientDetails",
  async (patientId, { rejectWithValue }) => {
    try {
      const [profile, wellness] = await Promise.all([
        getPatientProfile(patientId),
        getPatientWellness(patientId),
      ]);

      return {
        profile: profile.data.data,
        wellness: wellness.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

export const loadChiefComplaints =
  createAsyncThunk(
    "consultation/loadChiefComplaints",

    async (appointmentId, { rejectWithValue }) => {
      try {
        return await fetchChiefComplaints(
          appointmentId
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  );

export const saveChiefComplaintsThunk =
  createAsyncThunk(
    "consultation/saveChiefComplaints",

    async (
      { appointmentId, payload },
      { rejectWithValue }
    ) => {
      try {
        return await saveChiefComplaints(
          appointmentId,
          payload
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  );

export const loadDiagnosis = createAsyncThunk(
  "consultation/loadDiagnosis",
  async (appointmentId, { rejectWithValue }) => {
    try {
      return await fetchDiagnosis(appointmentId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

export const saveDiagnosisThunk = createAsyncThunk(
  "consultation/saveDiagnosis",
  async (
    { appointmentId, payload },
    { rejectWithValue }
  ) => {
    try {
      return await saveDiagnosis(
        appointmentId,
        payload
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

export const loadAssociateDoctors = createAsyncThunk(
  "consultation/loadAssociateDoctors",
  async (appointmentId, { rejectWithValue }) => {
    try {
      return await fetchAssociateDoctors(
        appointmentId
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);



export const searchPrescriptionProductsThunk =
  createAsyncThunk(
    "consultation/searchPrescriptionProducts",
    async (search, { rejectWithValue }) => {
      try {
        return await fetchPrescriptionProducts(search);
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  )
export const loadPrescription =
  createAsyncThunk(
    "consultation/loadPrescription",
    async (appointmentId, { rejectWithValue }) => {
      try {
        return await fetchPrescription(
          appointmentId
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  );

export const savePrescriptionThunk =
  createAsyncThunk(
    "consultation/savePrescription",
    async (payload, { rejectWithValue }) => {
      try {
        return await savePrescription(payload);
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  );

export const savePrescriptionNotesThunk =
  createAsyncThunk(
    "consultation/savePrescriptionNotes",
    async (
      { consultationId, payload },
      { rejectWithValue }
    ) => {
      try {
        return await savePrescriptionNotes(
          consultationId,
          payload
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  );

export const savePatientAllergiesThunk =
  createAsyncThunk(
    "consultation/savePatientAllergies",
    async (
      { patientId, payload },
      { rejectWithValue }
    ) => {
      try {
        return await savePatientAllergies(
          patientId,
          payload
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  );



export const searchTherapiesThunk = createAsyncThunk(
  "consultation/searchTherapies",
  async (search, thunkAPI) => {
    try {
      return await fetchTherapiesSearch(search);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const loadTherapies = createAsyncThunk(
  "consultation/loadTherapies",
  async (appointmentId) => {
    const data = await fetchTherapies(appointmentId);

    console.log("Thunk received:", data);

    return data;
  }
);

export const saveTherapyThunk = createAsyncThunk(
  "consultation/saveTherapy",
  async ({ appointmentId, payload }, thunkAPI) => {
    try {
      return await saveTherapy(appointmentId, payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const updateTherapyThunk = createAsyncThunk(
  "consultation/updateTherapy",
  async ({ therapyId, payload }, thunkAPI) => {
    try {
      return await editTherapy(therapyId, payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const searchDiagnosisCategoriesThunk = createAsyncThunk(
  "consultation/searchDiagnosisCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDiagnosisCategories();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

export const updatePrescriptionThunk =
  createAsyncThunk(
    "consultation/updatePrescription",

    async (
      { consultationId, payload },
      { rejectWithValue }
    ) => {

      try {

        return await editPrescription(
          consultationId,
          payload
        );

      } catch (error) {

        return rejectWithValue(
          error.response?.data ||
          error.message
        );

      }

    }
  );

export const updatePrescriptionItemThunk =
  createAsyncThunk(
    "consultation/updatePrescriptionItem",

    async (
      { itemId, payload },
      { rejectWithValue }
    ) => {

      try {

        return await editPrescriptionItem(
          itemId,
          payload
        );

      } catch (error) {

        return rejectWithValue(
          error.response?.data ||
          error.message
        );

      }

    }
  );

export const loadDoctorsList =
  createAsyncThunk(
    "consultation/loadDoctorsList",

    async (_, { rejectWithValue }) => {

      try {

        return await fetchDoctorsList();

      } catch (error) {

        return rejectWithValue(
          error.response?.data || error.message
        );

      }

    }
  );

export const addAssociateDoctorThunk =
  createAsyncThunk(
    "consultation/addAssociateDoctor",

    async (
      { appointmentId, payload },
      { rejectWithValue }
    ) => {

      try {

        return await createAssociateDoctor(
          appointmentId,
          payload
        );

      } catch (error) {

        return rejectWithValue(
          error.response?.data || error.message
        );

      }

    }
  );

export const deleteAssociateDoctorThunk =
  createAsyncThunk(
    "consultation/deleteAssociateDoctor",

    async (
      associateDoctorId,
      { rejectWithValue }
    ) => {

      try {

        return await removeAssociateDoctor(
          associateDoctorId
        );

      } catch (error) {

        return rejectWithValue(
          error.response?.data || error.message
        );

      }

    }
  );
export const deleteTherapyThunk = createAsyncThunk(
  "consultation/deleteTherapy",

  async (
    therapyId,
    { rejectWithValue }
  ) => {

    try {

      return await removeTherapy(
        therapyId
      );

    } catch (error) {

      return rejectWithValue(
        error.response?.data ||
        error.message
      );

    }

  }
);

// Thunk
export const finishConsultationThunk =
  createAsyncThunk(
    "consultation/finishConsultation",
    async (
      appointmentId,
      { rejectWithValue }
    ) => {
      try {
        return await completeConsultation(
          appointmentId
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
          error.message
        );
      }
    }
  );

  // ==========================================
// LOAD PATIENT HISTORY
// ==========================================

export const loadPatientHistory =
  createAsyncThunk(
    "consultation/loadPatientHistory",

    async (
      patientId,
      { rejectWithValue }
    ) => {

      try {

        return await fetchPatientHistory(
          patientId
        );

      } catch (error) {

        return rejectWithValue(
          error.response?.data ||
          error.message
        );

      }

    }
  );

  // ============================
// Patient Consultation Report
// ============================

export const loadPatientConsultationReport =
  createAsyncThunk(
    "consultation/loadPatientConsultationReport",

    async (
      consultationId,
      { rejectWithValue }
    ) => {
      try {
        return await fetchPatientConsultationReport(
          consultationId
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
          error.message
        );
      }
    }
  );