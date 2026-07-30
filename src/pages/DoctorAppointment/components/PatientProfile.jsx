import { useSelector } from "react-redux";

import PatientHeader from "./PatientHeader";

import PatientOverview from "../sections/PatientOverview";
import ChiefComplaints from "../sections/ChiefComplaints";
import Diagnosis from "../sections/Diagnosis";
import Prescription from "../sections/Prescription";
import Therapy from "../sections/Therapy";
import Reports from "../sections/Reports";
import PatientHistory from "../sections/PatientHistory";

const PatientProfile = ({
  activeSection,
  setActiveSection,
}) => {
  const {
    selectedPatient,
    patientProfile,
    patientWellness,
    patientLoading,
  } = useSelector((state) => state.consultation);
  console.log("Selected Patient:", selectedPatient);

  if (patientLoading && !selectedPatient) {
    return (
      <div className="h-[720px] rounded-[30px] border border-[#E7DBD3] bg-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!selectedPatient) {
    return (
      <div className=" rounded-[30px] border border-[#E7DBD3] bg-white flex items-center justify-center">
        <p className="text-lg text-[#8B7A70]">
          Select a patient to begin consultation
        </p>
      </div>
    );
  }

  return (
   <div className="min-h-[720px] rounded-[30px] border border-[#E7DBD3] bg-white p-8">
      <PatientHeader
        patient={patientProfile}
        wellness={patientWellness}
        appointment={selectedPatient}
      />

      {activeSection === "overview" && (
       <PatientOverview
  setActiveSection={setActiveSection}
  activeSection={activeSection}
/>
      )}

      {activeSection === "complaints" && (
        <ChiefComplaints
          appointmentId={selectedPatient?.id}
        />
      )}

      {activeSection === "diagnosis" && (
        <Diagnosis
          patient={patientProfile}
           appointmentId={selectedPatient?.id}
        />
      )}

      {activeSection === "prescription" && (
        <Prescription
          patient={patientProfile}
          appointment={selectedPatient?.id}
          consultationId={selectedPatient?.consultation_id}
    patientId={selectedPatient?.patient_id}
    
        />
      )}

      {activeSection === "therapy" && (
        <Therapy
          patient={patientProfile}
          appointmentId={selectedPatient?.id}
           consultationId={selectedPatient?.consultation_id}
        />
      )}

      {activeSection === "reports" && (
        <Reports
          patient={patientProfile}
          appointment={selectedPatient}
        />
      )}

      {activeSection === "history" && (
        <PatientHistory
          patient={patientProfile}
          appointment={selectedPatient}
        />
      )}
    </div>
  );
};

export default PatientProfile;