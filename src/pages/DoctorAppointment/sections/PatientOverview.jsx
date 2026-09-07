import { useSelector } from "react-redux";

import VitalCard from "../components/VitalCard";
import ConsultationGrid from "../components/ConsultationGrid";
import FinishButton from "../components/FinishButton";

const PatientOverview = ({
  activeSection,
  setActiveSection,
}) => {

  const {
    patientWellness,
    selectedPatient,
  } = useSelector(
    (state) => state.consultation
  );


  return (

    <>

      {/* ==========================================
          VITALS + AYURVEDIC BODY TYPE
      ========================================== */}

      <div
        className="
          grid
          grid-cols-4
          gap-3
        "
      >

        {/* ======================================
            AYURVEDIC BODY TYPE
        ====================================== */}

        <div
          className="
            row-span-2
            flex
            min-h-[216px]
            flex-col
            items-center
            justify-between
            rounded-2xl
            border
            border-[#EBDDD2]
            bg-[#FFFBF7]
            px-4
            py-4
          "
        >

          <div className="text-center">

            <p
              className="
                text-[15px]
                font-semibold
                leading-5
                text-[#59352C]
              "
            >
              Ayurvedic
              <br />
              Body Type
            </p>

          </div>


          <p
            className="
              text-[17px]
              font-semibold
              text-[#59352C]
            "
          >
            {patientWellness?.body_type ||
              patientWellness?.ayurvedic_body_type ||
              "--"}
          </p>


          {/* Decorative leaf */}

          <div
            className="
              flex
              items-end
              justify-center
              opacity-50
            "
          >
            <svg
              width="72"
              height="55"
              viewBox="0 0 72 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                d="M8 49C22 42 35 30 43 13"
                stroke="#E7B98F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M18 43C16 37 13 34 8 32"
                stroke="#E7B98F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M25 38C23 32 21 28 17 25"
                stroke="#E7B98F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M32 32C31 26 30 22 27 18"
                stroke="#E7B98F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M38 25C38 20 38 16 36 12"
                stroke="#E7B98F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M17 43C22 43 26 41 29 38"
                stroke="#E7B98F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M25 37C30 37 34 35 37 31"
                stroke="#E7B98F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M32 31C37 31 41 28 44 24"
                stroke="#E7B98F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

            </svg>
          </div>

        </div>


        {/* ======================================
            BLOOD PRESSURE
        ====================================== */}

        <VitalCard
          title="BP"
          value={
            patientWellness?.bp
              ? `${patientWellness.bp}`
              : "--"
          }
          unit={
            patientWellness?.bp_unit ||
            "mmHg"
          }
        />


        {/* ======================================
            SUGAR
        ====================================== */}

        <VitalCard
          title="Sugar"
          value={
            patientWellness?.sugar
              ? `${patientWellness.sugar}`
              : "--"
          }
          unit={
            patientWellness?.sugar_unit ||
            "mg/dL"
          }
        />


        {/* ======================================
            PULSE
        ====================================== */}

        <VitalCard
          title="Pulse"
          value={
            patientWellness?.pulse ||
            "--"
          }
          unit={
            patientWellness?.pulse_unit ||
            "hours"
          }
        />


        {/* ======================================
            SPO2
        ====================================== */}

        <VitalCard
          title="SpO2"
          value={
            patientWellness?.spo2 ||
            "--"
          }
          unit={
            patientWellness?.spo2_unit ||
            "%"
          }
        />


        {/* ======================================
            TEMPERATURE
        ====================================== */}

        <VitalCard
          title="Temp."
          value={
            patientWellness?.temperature ||
            patientWellness?.temp ||
            "--"
          }
          unit={
            patientWellness?.temperature_unit ||
            patientWellness?.temp_unit ||
            "C"
          }
        />


        {/* ======================================
            TOXICITY
        ====================================== */}

        <VitalCard
          title="Toxicity"
          value={
            patientWellness?.toxicity ||
            "--"
          }
          unit={
            patientWellness?.toxicity_unit ||
            "%"
          }
        />

      </div>


      {/* ==========================================
          ADDITIONAL NOTES
      ========================================== */}

      <div className="mt-3">

        <h3
          className="
            mb-2
            text-[15px]
            font-semibold
            text-[#59352C]
          "
        >
          Additional Notes
        </h3>

        <textarea
          placeholder="Enter Notes"
          className="
            h-[64px]
            w-full
            resize-none
            rounded-2xl
            border
            border-[#EBDDD2]
            bg-white
            px-4
            py-3
            text-[13px]
            text-[#59352C]
            outline-none
            placeholder:text-[#9A8B83]
            focus:border-[#8A563B]
          "
        />

      </div>


      {/* ==========================================
          CONSULTATION GRID
      ========================================== */}

      <ConsultationGrid
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />


      {/* ==========================================
          FINISH CONSULTATION
      ========================================== */}

      <FinishButton
        appointmentId={selectedPatient?.id}
      />

    </>

  );
};

export default PatientOverview;