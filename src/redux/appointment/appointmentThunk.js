import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTodaySchedule} from "../../api/doctorAppointmentApi";
import { fetchDiagnosisCategories } from "../../services/doctorAppointmentService";

export const getAppointments = createAsyncThunk(
  "appointment/getAppointments",

  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await getTodaySchedule(doctorId);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


export const searchDiagnosisCategoriesThunk = createAsyncThunk(
  "consultation/searchDiagnosisCategories",
  async (_, thunkAPI) => {
    try {
      return await fetchDiagnosisCategories();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);