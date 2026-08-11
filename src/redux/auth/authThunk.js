import { createAsyncThunk } from "@reduxjs/toolkit";
import { unifiedLogin } from "../../services/authService";

export const login = createAsyncThunk(
    "auth/login",

    async (credentials, { rejectWithValue }) => {
        try {
            const response = await unifiedLogin(credentials);

            // Clear old role-specific data
            localStorage.removeItem("doctor");
            localStorage.removeItem("pharmacist");

            // Save common authentication data
            localStorage.setItem(
                "token",
                response.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            localStorage.setItem(
                "role",
                response.role
            );

            return response;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    }
);