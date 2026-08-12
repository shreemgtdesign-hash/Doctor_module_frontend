import { createSlice } from "@reduxjs/toolkit";
import { login } from "./authThunk";

// ==========================================
// RESTORE AUTH DATA FROM LOCAL STORAGE
// ==========================================

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

let parsedUser = null;

try {
    parsedUser = storedUser
        ? JSON.parse(storedUser)
        : null;
} catch (error) {
    console.error(
        "Failed to parse stored user:",
        error
    );

    parsedUser = null;
}

const initialState = {
    loading: false,

    user: parsedUser,

    token: storedToken || null,

    isAuthenticated:
        !!storedToken && !!parsedUser,

    error: null,
};


// ==========================================
// AUTH SLICE
// ==========================================

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        // ==================================
        // LOGOUT
        // ==================================

        logout: (state) => {

            state.user = null;

            state.token = null;

            state.isAuthenticated = false;

            state.error = null;

            // Clear COMMON auth storage
            localStorage.removeItem("user");

            localStorage.removeItem("token");

            // Remove old doctor-specific keys
            localStorage.removeItem("doctor");

            localStorage.removeItem("doctor_token");
        },

    },

    extraReducers: (builder) => {

        // ==================================
        // LOGIN PENDING
        // ==================================

        builder.addCase(
            login.pending,
            (state) => {

                state.loading = true;

                state.error = null;

            }
        );


        // ==================================
        // LOGIN SUCCESS
        // ==================================

        builder.addCase(
            login.fulfilled,
            (state, action) => {

                state.loading = false;

                state.user =
                    action.payload.user;

                state.token =
                    action.payload.token;

                state.isAuthenticated = true;

                state.error = null;

            }
        );


        // ==================================
        // LOGIN FAILED
        // ==================================

        builder.addCase(
            login.rejected,
            (state, action) => {

                state.loading = false;

                state.error =
                    action.payload ||
                    "Login failed";

                state.isAuthenticated = false;

            }
        );

    },

});


export const {
    logout,
} = authSlice.actions;


export default authSlice.reducer;