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
import MedicineDispensedTable from "./pages/Pharmacist/PharmacistDashboard/components/MedicineDespensedTable";
import DutyDoctorDashboard from "./pages/DutyDoctor/DutyDoctorDashboard";
import DutyDoctorAssessment from "./pages/DutyDoctor/DutyDoctorAssessment";
import DirectWalkIn from "./pages/FrontOfficeAppointment/components/DirectWalkIn";
import FrontofficePatientTable from "./pages/FrontOfficePatient/components/FrontofficePatientTable";
import ViewPatientProfile from "./pages/FrontOfficePatient/components/ViewPatientProfile";
import EditPatient from "./pages/FrontOfficePatient/components/EditPatient";
import PendingActions from "./pages/FrontOfficeAppointment/components/PendingActionScreen";
import PendingActionScreen from "./pages/FrontOfficeAppointment/components/PendingActionScreen";
import AppointmentConfirmationList from "./pages/FrontOfficeAppointment/components/AppointmentConfirmationList";
import UpcomingAppointmentsList from "./pages/FrontOfficeDashboard/components/UpcomingAppointmentList";
import PatientAppointmentDetails from "./pages/FrontOfficeAppointment/components/PatientAppointmentdetails";
import TherapyConfirmation from "./pages/FrontOfficeAppointment/components/TherapyConfirmation";
import HomevisitConfirmation from "./pages/FrontOfficeAppointment/components/HomevisitConfirmation";
import HomeVisitConfirmationList from "./pages/FrontOfficeAppointment/components/HomeVisitConfirmationList";
import HomeVisitConfirmation from "./pages/FrontOfficeAppointment/components/HomevisitConfirmation";
import AppointmentReminders from "./pages/FrontOfficeAppointment/components/AppointmentReminders";
import TherapyReminders from "./pages/FrontOfficeAppointment/components/TherapyReminders";
import PendingPayments from "./pages/FrontOfficeAppointment/components/PendingPayments";
import PendingPaymentDetails from "./pages/FrontOfficeAppointment/components/PendingPaymentDetails";
import AssociateDoctorPayoutDetails from "./pages/FrontOfficeAppointment/components/AssociateDoctorPayoutDetails";
import AssociateDoctorPayouts from "./pages/FrontOfficeAppointment/components/AssociateDoctorPayouts";
import VisitingDoctorPayoutDetails from "./pages/FrontOfficeAppointment/components/VisitingDoctorPayoutDetails";
import VisitingDoctorPayouts from "./pages/FrontOfficeAppointment/components/VisitingDoctorPayouts";
import NotificationListener from "./components/Notifications/NotificationListener";
import AddMedicalCamp from "./pages/FrontOfficeAppointment/components/AddMedicalCamp";
import OnlineMedicineOrders from "./pages/FrontOfficeAppointment/components/OnlineMedicineOrders";
import OnlineMedicineOrderDetails from "./pages/FrontOfficeAppointment/components/OnlineMedicineOrderDetails";
import EmployeePurchase from "./pages/Pharmacist/PharmacistAppointments/components/EmployeePurchase";
import OnlineDeliveryOrders from "./pages/Pharmacist/PharmacistAppointments/components/OnlineDeliveryOrders";
import OnlineOrderDetails from "./pages/Pharmacist/PharmacistAppointments/components/OnlineOrderDetails";

function App() {
  return (
    <>
      <NotificationListener />
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
      <Route
        path="/pharmacist/medicine-dispensed"
        element={<MedicineDispensedTable />}
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
        path="/frontoffice/pending-actions/appointment-confirmation/:doctorId"
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
          < ReferralList />
        }
      />

      <Route
        path="/frontoffice/medcamp-calender"
        element={
          < MedCampCalender />
        }
      />
      <Route
        path="/frontoffice/medcamp-details"
        element={
          < MedicalCampDetails />
        }
      />

      <Route
        path="/duty-doctor/dashboard"
        element={
          < DutyDoctorDashboard />
        }
      />

      <Route
        path="/duty-doctor/assessment/:bookingId"
        element={
          <DutyDoctorAssessment />
        }
      />

      <Route
        path="/frontoffice/direct-walkin"
        element={<DirectWalkIn />}
      />

      <Route
        path="/frontoffice/patients-table"
        element={<FrontofficePatientTable />}
      />
      <Route
        path="/frontoffice/patient/view/:id"
        element={<ViewPatientProfile />}
      />

      <Route
        path="/frontoffice/patient/edit/:id"
        element={<EditPatient />}
      />
      <Route
        path="/frontoffice/pending-actions-screen"
        element={<PendingActionScreen />}
      />

      <Route
        path="/frontoffice/pending-actions/appointment-confirmations"
        element={
          <AppointmentConfirmationList />
        }
      />

      <Route
        path="/frontoffice/pending-actions/appointment-confirmation/:doctorId"
        element={
          <AppointmentConfirmation />
        }
      />

      <Route
        path="/frontoffice/upcoming-appointments"
        element={
          <UpcomingAppointmentsList />
        }
      />
      <Route
        path="/frontoffice/upcoming-appointments/:appointmentId"
        element={
          <PatientAppointmentDetails />
        }
      />
      <Route
        path="/frontoffice/pending-action/therapy-confirmations"
        element={
          <TherapyConfirmation />
        }
      />

      <Route
        path="/frontoffice/pending-action/homevisit-confirmations/:doctorId"
        element={
          <HomevisitConfirmation />
        }
      />
      <Route
    path="/frontoffice/pending-actions/home-visit-confirmations"
    element={
        <HomeVisitConfirmationList />
    }
/>

<Route
    path="/frontoffice/home-visit-confirmation/:doctorId"
    element={
        <HomeVisitConfirmation />
    }
/>
<Route
    path="/frontoffice/appointments/reminders"
    element={<AppointmentReminders />}
/>

<Route
    path="/frontoffice/therapies/reminders"
    element={<TherapyReminders />}
/>
<Route
    path="/frontoffice/billing/pending-payments"
    element={<PendingPayments />}
/>

<Route
    path="/frontoffice/billing/pending-payments/:appointmentId"
    element={<PendingPaymentDetails />}
/>
<Route
  path="/frontoffice/billing/visiting-doctor-payouts"
  element={<VisitingDoctorPayouts />}
/>

<Route
  path="/frontoffice/billing/visiting-doctor-payouts/:doctorId"
  element={<VisitingDoctorPayoutDetails />}
/>

<Route
  path="/frontoffice/billing/associate-doctor-payouts"
  element={<AssociateDoctorPayouts />}
/>

<Route
  path="/frontoffice/billing/associate-doctor-payouts/:doctorId"
  element={<AssociateDoctorPayoutDetails/>}
/>
<Route
    path="/frontoffice/medcamp/add"
    element={<AddMedicalCamp />}
/>
<Route
    path="/frontoffice/pending-actions/online-orders"
    element={
        <OnlineMedicineOrders />
    }
/>

<Route
    path="/frontoffice/pending-actions/online-orders/:orderId"
    element={
        <OnlineMedicineOrderDetails />
    }
/>

<Route
    path="/pharmacist/employee-purchases/add"
    element={
        <EmployeePurchase />
    }
/>

<Route
    path="/pharmacist/online-purchases"
    element={
        <OnlineDeliveryOrders />
    }
/>

<Route
    path="/pharmacist/online-purchases/:orderId"
    element={
        <OnlineOrderDetails />
    }
/>

    </Routes>
    </>
  );
}

export default App;