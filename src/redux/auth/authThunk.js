import { createAsyncThunk } from "@reduxjs/toolkit";
import { doctorLogin } from "../../services/authService";

export const loginDoctor = createAsyncThunk(
  "auth/loginDoctor",

  async (credentials, { rejectWithValue }) => {
    try {
      const response = await doctorLogin(credentials);

      // Save in localStorage for persistence
      localStorage.setItem("doctor_token", response.token);
      localStorage.setItem("doctor", JSON.stringify(response.user));

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);