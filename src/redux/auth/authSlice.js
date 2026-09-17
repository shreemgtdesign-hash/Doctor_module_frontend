import { createSlice } from "@reduxjs/toolkit";
import { login } from "./authThunk";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const storedRole = localStorage.getItem("role");

const initialState = {
  loading: false,

  user: storedUser
    ? JSON.parse(storedUser)
    : null,

  token: storedToken || null,

  role: storedRole || null,

  isAuthenticated: !!storedToken,

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;

        // IMPORTANT
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.user)
        );

        localStorage.setItem(
          "token",
          action.payload.token
        );

        localStorage.setItem(
          "role",
          action.payload.role
        );
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;