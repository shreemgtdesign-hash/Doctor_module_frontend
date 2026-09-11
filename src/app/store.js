import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/auth/authSlice";
import dashboardReducer from "../redux/dashboard/dashboardSlice";
import appointmentReducer from "../redux/appointment/appointmentSlice";
import consultationReducer from "../redux/consultation/consultationSlice";
import pharmacistReducer from "../redux/pharmacist/pharmacistSlice";
import therapistReducer from "../redux/therapist/therapistSlice";
import frontOfficeDashboardReducer from "../redux/frontOffice/frontOfficeDashboardSlice";
import frontOfficeAppointmentReducer from "../redux/frontOffice/frontOfficeAppointmentSlice";
import notificationReducer
  from "../redux/notifications/notificationSlice";
import frontOfficePatientReducer from "../redux/frontOffice/frontOfficePatientSlice";
import dutyDoctorReducer
    from "../redux/dutyDoctor/dutyDoctorSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    appointment: appointmentReducer,
    consultation: consultationReducer,
    pharmacist: pharmacistReducer,
    therapist: therapistReducer,
    frontOfficeDashboard: frontOfficeDashboardReducer,
    frontOfficeAppointment: frontOfficeAppointmentReducer,
    frontOfficePatient: frontOfficePatientReducer,
    notifications:notificationReducer,
    dutyDoctor:dutyDoctorReducer
  },
});