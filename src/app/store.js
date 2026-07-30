import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/auth/authSlice";
import dashboardReducer from "../redux/dashboard/dashboardSlice";
import appointmentReducer from "../redux/appointment/appointmentSlice";
import consultationReducer from "../redux/consultation/consultationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    appointment: appointmentReducer,
    consultation: consultationReducer,
  },
});