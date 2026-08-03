import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchDashboard,  } from "../../services/doctorDashboardService";
import { fetchConsultationHistoryList, fetchMedicinesPrescribedList } from "../../services/doctorAppointmentService";

export const getDashboard =
    createAsyncThunk(

        "dashboard/getDashboard",

        async (
            {
                doctorId,
                period,
            },
            { rejectWithValue }
        ) => {

            try {

                return await fetchDashboard(
                    doctorId,
                    period
                );

            } catch (err) {

                return rejectWithValue(
                    err.response?.data ||
                    err.message
                );

            }

        }
    );

export const loadConsultationHistoryList =
    createAsyncThunk(
        "dashboard/loadConsultationHistoryList",
        async (
            { doctorId, period },
            { rejectWithValue }
        ) => {
            try {
                return await fetchConsultationHistoryList(
                    doctorId,
                    period
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data || error.message
                );
            }
        }
    );

    export const loadMedicinesPrescribedList =
  createAsyncThunk(
    "dashboard/loadMedicinesPrescribedList",
    async (
      { doctorId, period },
      { rejectWithValue }
    ) => {
      try {
        return await fetchMedicinesPrescribedList(
          doctorId,
          period
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message
        );
      }
    }
  );