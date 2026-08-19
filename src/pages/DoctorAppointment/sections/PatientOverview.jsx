import { useSelector } from "react-redux";

import VitalCard from "../components/VitalCard";
import ConsultationGrid from "../components/ConsultationGrid";
import FinishButton from "../components/FinishButton";

const PatientOverview = ({ activeSection,setActiveSection }) => {
  const { patientWellness,selectedPatient, } = useSelector(
    (state) => state.consultation
  );

  return (
    <>
      {/* Vitals */}

      <div className="grid grid-cols-4 gap-4">
        <VitalCard
          title="Blood Pressure"
          value={
            patientWellness?.bp
              ? `${patientWellness.bp} ${patientWellness.bp_unit ?? ""}`
              : "--"
          }
        />

        <VitalCard
          title="Sugar"
          value={
            patientWellness?.sugar
              ? `${patientWellness.sugar} ${patientWellness.sugar_unit ?? ""}`
              : "--"
          }
        />

        <VitalCard
          title="Sleep"
          value={
            patientWellness?.sleep
              ? `${patientWellness.sleep} ${patientWellness.sleep_unit ?? ""}`
              : "--"
          }
        />

        <VitalCard
          title="Stress"
          value={patientWellness?.stress || "--"}
        />
      </div>

      {/* Consultation */}

      <ConsultationGrid
         activeSection={activeSection}
                setActiveSection={setActiveSection}
      />

      <FinishButton
  appointmentId={selectedPatient?.id}
/>
    </>
  );
};

export default PatientOverview;