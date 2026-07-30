import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTodaySchedule } from "../../api/doctorAppointmentApi";

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