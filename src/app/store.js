import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/auth/authSlice";
import dashboardReducer from "../redux/dashboard/dashboardSlice";
import appointmentReducer from "../redux/appointment/appointmentSlice";
import consultationReducer from "../redux/consultation/consultationSlice";
import pharmacistReducer from "../redux/pharmacist/pharmacistSlice";
import therapistReducer from "../redux/therapist/therapistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    appointment: appointmentReducer,
    consultation: consultationReducer,
    pharmacist: pharmacistReducer,
    therapist: therapistReducer,


  },
});