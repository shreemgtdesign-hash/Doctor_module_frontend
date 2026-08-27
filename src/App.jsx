import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";

import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointment from "./pages/DoctorAppointment";
import Login from "./pages/Login";
import ConsultationHistoryTable from "./pages/DoctorDashboard/components/ConsultationHistorytable";
import MedicinePrescribedTable from "./pages/DoctorDashboard/components/MedicinePrescribedTable";
import AilmentsAddressedTable from "./pages/DoctorDashboard/components/AilmentsAddressedTable";
import PharmacistDashboard from "./pages/Pharmacist/PharmacistDashboard";
import PharmacistAppointments from "./pages/Pharmacist/PharmacistAppointments";
import TherapiesPrescribedTable from "./pages/DoctorDashboard/components/TherapiesPrescribedTable";
import TherapistDashboard from "./pages/TherapistDashboard";
import TherapistAppointments from "./pages/TherapistAppointments/TherapistAppointments";
import WellnessTable from "./pages/DoctorDashboard/components/WellnessTable";
import BeautyTable from "./pages/DoctorDashboard/components/BeautyTable";
import FrontOfficeDashboard from "./pages/FrontOfficeDashboard";
import DoctorMaster from "./pages/FrontOfficeAppointment/components/DoctorMaster";
import FrontOfficeAppointments from "./pages/FrontOfficeAppointment/components/FrontOfficeAppointments";
import AppointmentConfirmation from "./pages/FrontOfficeAppointment/components/AppointmentConfirmation";
import InsuranceList from "./pages/FrontOfficeAppointment/components/InsuranceList";
import Packages from "./pages/FrontOfficeAppointment/components/Packages";
import ReferralList from "./pages/FrontOfficeAppointment/components/ReferralList";
import MedCampCalender from "./pages/FrontOfficeAppointment/components/Med-Camp-Calender";
import MedicalCampDetails from "./pages/FrontOfficeAppointment/components/MedicalCampDetails";

function App() {
    return (
        <Routes>

            {/* Root */}
            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />


            {/* Login */}
            <Route
                path="/login"
                element={<Login />}
            />


            {/* Doctor */}
            <Route
                path="/doctordashboard"
                element={<DoctorDashboard />}
            />

            <Route
                path="/doctor/appointments"
                element={<DoctorAppointment />}
            />


            {/* Pharmacist */}
            <Route
                path="/pharmacist/dashboard"
                element={<PharmacistDashboard />}
            />

            <Route
                path="/pharmacist/appointments"
                element={<PharmacistAppointments />}
            />


            {/* Doctor tables */}
            <Route
                path="/doctor/consultation-history"
                element={<ConsultationHistoryTable />}
            />

            <Route
                path="/doctor/medicines-prescribed"
                element={<MedicinePrescribedTable />}
            />

            <Route
                path="/doctor/ailments-addressed"
                element={<AilmentsAddressedTable />}
            />


            {/* Unknown route */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            <Route
                path="/doctor/therapies-prescribed"
                element={<TherapiesPrescribedTable />}
            />
            <Route
                path="/therapist/dashboard"
                element={
                    <TherapistDashboard />
                }
            />
            <Route
                path="/therapist/appointments"
                element={
                    <TherapistAppointments />
                }
            />
            <Route
                path="/doctor/wellness-table"
                element={
                    <WellnessTable />
                }
            />
            <Route
                path="/doctor/beauty-table"
                element={
                    <BeautyTable />
                }
            />

            <Route
                path="/frontoffice/dashboard"
                element={
                    <FrontOfficeDashboard />
                }
            />

            <Route
    path="/frontoffice/doctors"
    element={<DoctorMaster />}
/>

<Route
    path="/frontoffice/pending-actions"
    element={<FrontOfficeAppointments />}
/>
<Route
  path="/frontoffice/appointment-confirmation"
  element={
    <AppointmentConfirmation />
  }
/>
<Route
  path="/frontoffice/insurance-list"
  element={
    <InsuranceList />
  }
/>
<Route
  path="/frontoffice/packages-list"
  element={
    <Packages />
  }
/>
<Route
  path="/frontoffice/referral-list"
  element={
    < ReferralList/>
  }
/>

<Route
  path="/frontoffice/medcamp-calender"
  element={
    < MedCampCalender/>
  }
/>
<Route
  path="/frontoffice/medcamp-details"
  element={
    < MedicalCampDetails/>
  }
/>





        </Routes>
    );
}

export default App;