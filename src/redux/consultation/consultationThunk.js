import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAppointments,
  getPatientProfile,
  getPatientWellness,
} from "../../api/doctorAppointmentApi";
import { fetchChiefComplaints, saveChiefComplaints,fetchDiagnosis,saveDiagnosis,fetchAssociateDoctors,createAssociateDoctor,fetchPrescriptionProducts,
  fetchPrescription,savePrescription,savePrescriptionNotes,savePatientAllergies,fetchTherapiesSearch,fetchTherapies,
  saveTherapy,editTherapy, } from "../../services/doctorAppointmentService";

export const loadAppointments = createAsyncThunk(
  "consultation/loadAppointments",
  async ({ doctorId, date, status = "" }, { rejectWithValue }) => {
    try {
      const response = await getAppointments(
        doctorId,
        date,
        status
      );

      console.log("Appointments API Response:", response.data);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
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

export const addAssociateDoctorThunk =
  createAsyncThunk(
    "consultation/addAssociateDoctor",
    async (
      { appointmentId, payload },
      { rejectWithValue }
    ) => {
      try {
        await createAssociateDoctor(
          appointmentId,
          payload
        );

        // Reload the updated doctor list
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