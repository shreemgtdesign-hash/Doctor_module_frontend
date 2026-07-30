import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchDashboard } from "../../services/doctorDashboardService";

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