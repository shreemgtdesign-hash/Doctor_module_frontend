import { createSlice } from "@reduxjs/toolkit";
import { loginDoctor } from "./authThunk";

const initialState = {
  loading: false,

  user: JSON.parse(localStorage.getItem("doctor")) || null,

  token: localStorage.getItem("doctor_token") || null,

  isAuthenticated: !!localStorage.getItem("doctor_token"),

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("doctor");
      localStorage.removeItem("doctor_token");
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginDoctor.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })

      .addCase(loginDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;