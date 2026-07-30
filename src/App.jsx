import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";

import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointment from "./pages/DoctorAppointment";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DoctorDashboard />} />
      <Route
              path="/login"
                  element={<Login />}
       />
      <Route
        path="/doctor/appointments"
        element={<DoctorAppointment />}
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route
    path="/doctordashboard"
    element={<DoctorDashboard />}
/>
    </Routes>
  );
}

export default App;