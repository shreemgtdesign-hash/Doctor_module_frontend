import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {

  HiChevronRight,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import VitalCard
  from "../components/VitalCard";

import ConsultationGrid
  from "../components/ConsultationGrid";

import FinishButton
  from "../components/FinishButton";

import {
  loadPatientWellness,
} from "../../../redux/consultation/consultationThunk";


const PatientOverview = ({
  activeSection,
  setActiveSection,
}) => {

  const dispatch =
    useDispatch();


  // ==========================================
  // REDUX
  // ==========================================

  const {
    patientWellness,
    selectedPatient,
  } = useSelector(
    (state) =>
      state.consultation
  );


  // ==========================================
  // LOCAL STATE
  // ==========================================

  const [
    showPastVitals,
    setShowPastVitals,
  ] = useState(false);


  const [
    selectedVitalDate,
    setSelectedVitalDate,
  ] = useState(null);


  const [
    previousDates,
    setPreviousDates,
  ] = useState([]);


  const [
    loadingVitals,
    setLoadingVitals,
  ] = useState(false);


  // ==========================================
  // PATIENT ID
  // ==========================================

  const patientId =
    selectedPatient?.patient_id ||
    selectedPatient?.patientId ||
    selectedPatient?.id;


  // ==========================================
  // GET TODAY'S VITALS + HISTORY
  // ==========================================

  useEffect(() => {

    if (!patientId) {
      return;
    }


    const loadTodayVitals =
      async () => {

        setLoadingVitals(true);


        try {

          const result =
            await dispatch(
              loadPatientWellness({
                patientId,
                period: "today",
              })
            ).unwrap();


          console.log(
            "Patient Wellness:",
            result
          );


          // ====================================
          // TODAY'S RECORD
          // ====================================

          const today =
            result?.today ||
            result;


          setSelectedVitalDate(
            today
          );


          // ====================================
          // PREVIOUS DATES
          // ====================================

          if (
            Array.isArray(
              result?.history
            )
          ) {

            const previous =
              result.history.filter(
                (item) =>
                  !item.is_today
              );


            setPreviousDates(
              previous
            );

          }

        } catch (error) {

          console.error(
            "Failed to load patient wellness:",
            error
          );

        } finally {

          setLoadingVitals(false);

        }

      };


    loadTodayVitals();

  }, [
    dispatch,
    patientId,
  ]);


  // ==========================================
  // SYNC WITH REDUX
  // ==========================================

  useEffect(() => {

    if (!patientWellness) {
      return;
    }


    // Today's vitals

    if (
      patientWellness?.today
    ) {

      setSelectedVitalDate(
        patientWellness.today
      );

    }


    // Previous appointment dates

    if (
      Array.isArray(
        patientWellness?.history
      )
    ) {

      const previous =
        patientWellness.history.filter(
          (item) =>
            !item.is_today
        );


      setPreviousDates(
        previous
      );

    }

  }, [
    patientWellness,
  ]);


  // ==========================================
  // CURRENT VITALS
  // ==========================================

  const currentVitals =
    selectedVitalDate ||
    patientWellness?.today ||
    patientWellness ||
    {};


  // ==========================================
  // SELECTED DATE LABEL
  // ==========================================

  const selectedDateLabel =
    currentVitals?.is_today
      ? "Today"
      : currentVitals?.formatted_date ||
      currentVitals?.label ||
      "View Past Vitals";


  // ==========================================
  // SELECT PREVIOUS VITALS
  // ==========================================

  const handleDateChange =
    async (
      historyItem
    ) => {

      if (
        !patientId ||
        !historyItem?.date
      ) {
        return;
      }


      setShowPastVitals(
        false
      );


      setLoadingVitals(
        true
      );


      try {

        console.log(
          "Loading vitals for date:",
          historyItem.date
        );


        const result =
          await dispatch(
            loadPatientWellness({
              patientId,
              date: historyItem.date,
            })
          ).unwrap();


        console.log(
          "Previous Vitals Response:",
          result
        );


        /*
         * For a date request, the backend may return
         * the selected record in `today`, `previous`,
         * or directly in the response.
         */

        const selectedRecord =
          result?.today ||
          result?.previous ||
          result;


        setSelectedVitalDate(
          selectedRecord
        );


        /*
         * Keep the complete history list.
         */

        if (
          Array.isArray(
            result?.history
          )
        ) {

          setPreviousDates(
            result.history.filter(
              (item) =>
                !item.is_today
            )
          );

        }

      } catch (error) {

        console.error(
          "Failed to load previous vitals:",
          error
        );

      } finally {

        setLoadingVitals(
          false
        );

      }

    };


  // ==========================================
  // GO BACK TO TODAY
  // ==========================================

  const handleToday =
    async () => {

      if (!patientId) {
        return;
      }


      setShowPastVitals(
        false
      );


      setLoadingVitals(
        true
      );


      try {

        const result =
          await dispatch(
            loadPatientWellness({
              patientId,
              period: "today",
            })
          ).unwrap();


        setSelectedVitalDate(
          result?.today ||
          result
        );


        /*
         * Restore history.
         */

        if (
          Array.isArray(
            result?.history
          )
        ) {

          setPreviousDates(
            result.history.filter(
              (item) =>
                !item.is_today
            )
          );

        }

      } catch (error) {

        console.error(
          "Failed to load today's vitals:",
          error
        );

      } finally {

        setLoadingVitals(
          false
        );

      }

    };


  return (

    <>

      {/* ==========================================
          VITALS + AYURVEDIC BODY TYPE
      ========================================== */}

      <div
        className="
    grid
    grid-cols-4
    gap-2
  "
      >

        {/* ======================================
            AYURVEDIC BODY TYPE
        ====================================== */}

        <div
          className="
    row-span-2
    flex
    min-h-[180px]
    flex-col
    items-center
    justify-between
    rounded-xl
    border
    border-[#EBDDD2]
    bg-[#FFFBF7]
    px-3
    py-3
  "
        >

          <div
            className="
              text-center
            "
          >

            <p
  className="
    text-center
    text-[13px]
    font-semibold
    leading-4
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
    text-[15px]
    font-semibold
    text-[#59352C]
  "
>
            {currentVitals?.body_type ||
              currentVitals?.ayurvedic_body_type ||
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
              width="55"
              height="42"
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
            BP
        ====================================== */}

        <VitalCard
          title="BP"
          value={
            currentVitals?.bp ||
            "--"
          }
          unit={
            currentVitals?.bp_unit ||
            "mmHg"
          }
        />


        {/* ======================================
            SUGAR
        ====================================== */}

        <VitalCard
          title="Sugar"
          value={
            currentVitals?.sugar ||
            "--"
          }
          unit={
            currentVitals?.sugar_unit ||
            "mg/dL"
          }
        />


        {/* ======================================
            PULSE
        ====================================== */}

        <VitalCard
          title="Pulse"
          value={
            currentVitals?.pulse ||
            "--"
          }
          unit={
            currentVitals?.pulse_unit ||
            "bpm"
          }
        />


        {/* ======================================
            SPO2
        ====================================== */}

        <VitalCard
          title="SpO2"
          value={
            currentVitals?.spo2 ||
            "--"
          }
          unit={
            currentVitals?.spo2_unit ||
            "%"
          }
        />


        {/* ======================================
            TEMPERATURE
        ====================================== */}

        <VitalCard
          title="Temp."
          value={
            currentVitals?.temperature ||
            currentVitals?.temp ||
            "--"
          }
          unit={
            currentVitals?.temperature_unit ||
            currentVitals?.temp_unit ||
            "C"
          }
        />


        {/* ======================================
            TOXICITY
        ====================================== */}

        <VitalCard
          title="Toxicity"
          value={
            currentVitals?.toxicity ??
            currentVitals?.body_toxicity ??
            "--"
          }
          unit={
            currentVitals?.toxicity_unit ||
            currentVitals?.body_toxicity_unit ||
            "%"
          }
        />

      </div>


      {/* =================================================
          VIEW PAST VITALS

          IMPORTANT:
          This is ALWAYS rendered.
          It is NOT dependent on previousDates.length.
      ================================================= */}

      <div
        className="
          relative
          mt-1
          flex
          justify-end
        "
      >

        <button
          type="button"
          disabled={
            loadingVitals
          }
          onClick={() =>
            setShowPastVitals(
              (previous) =>
                !previous
            )
          }
          className="
            flex
            items-center
            gap-1
            bg-transparent
            px-1
            py-1
            text-[11px]
            font-medium
            text-[#59352C]
            transition
            hover:text-[#8A563B]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          <span>
            {currentVitals?.is_today
              ? "View Past Vitals"
              : selectedDateLabel}
          </span>


          <HiChevronRight
            size={14}
            className="
              text-[#8A563B]
            "
          />

        </button>


        {/* ==========================================
            PAST VITALS DROPDOWN
        ========================================== */}

        {showPastVitals && (

          <div
            className="
              absolute
              right-0
              top-9
              z-50
              w-[205px]
              overflow-hidden
              rounded-xl
              border
              border-[#EBDDD2]
              bg-white
              shadow-[0_8px_25px_rgba(89,53,44,0.12)]
            "
          >

            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#F0E5DE]
                px-3
                py-2.5
              "
            >

              <span
                className="
                  text-[11px]
                  font-semibold
                  text-[#59352C]
                "
              >
                Previous Vitals
              </span>


              <HiOutlineCalendarDays
                size={14}
                className="
                  text-[#8A563B]
                "
              />

            </div>


            {/* TODAY */}

            <button
              type="button"
              onClick={
                handleToday
              }
              className="
                flex
                w-full
                items-center
                justify-between
                border-b
                border-[#F5ECE6]
                px-3
                py-2.5
                text-left
                text-[11px]
                font-medium
                text-[#59352C]
                transition
                hover:bg-[#FFF8F3]
              "
            >

              <span>
                Today
              </span>


              <HiChevronRight
                size={13}
                className="
                  text-[#8A563B]
                "
              />

            </button>


            {/* ======================================
                PREVIOUS DATES
            ====================================== */}

            {previousDates.length > 0 ? (

              <div
                className="
                  max-h-[220px]
                  overflow-y-auto
                  p-1
                "
              >

                {previousDates.map(
                  (
                    item,
                    index
                  ) => {

                    const itemKey =
                      item.id ||
                      item.date ||
                      index;


                    const isSelected =
                      currentVitals?.date ===
                      item.date;


                    return (

                      <button
                        key={
                          itemKey
                        }
                        type="button"
                        onClick={() =>
                          handleDateChange(
                            item
                          )
                        }
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between
                          rounded-lg
                          px-3
                          py-2.5
                          text-left
                          text-[11px]
                          text-[#59352C]
                          transition
                          hover:bg-[#FFF8F3]
                          ${isSelected
                            ? "bg-[#FFF4EC] font-semibold"
                            : ""
                          }
                        `}
                      >

                        <span>
                          {item.formatted_date ||
                            item.label ||
                            item.date}
                        </span>


                        <HiChevronRight
                          size={13}
                          className="
                            shrink-0
                            text-[#8A563B]
                          "
                        />

                      </button>

                    );

                  }
                )}

              </div>

            ) : (

              <div
                className="
                  px-3
                  py-3
                  text-[11px]
                  text-[#8A7A71]
                "
              >
                No previous vitals available.
              </div>

            )}

          </div>

        )}

      </div>


      {/* ==========================================
          LOADING
      ========================================== */}

      {loadingVitals && (

        <div
          className="
            mt-1
            text-right
            text-[10px]
            text-[#8A7A71]
          "
        >
          Loading vitals...
        </div>

      )}


      {/* ==========================================
          SELECTED PREVIOUS DATE
      ========================================== */}

      {!currentVitals?.is_today &&
        currentVitals?.formatted_date && (

          <div
            className="
              mt-1
              text-right
              text-[10px]
              text-[#8A7A71]
            "
          >

            Showing vitals for{" "}

            <span
              className="
                font-medium
                text-[#59352C]
              "
            >
              {currentVitals.formatted_date}
            </span>

          </div>

        )}






      <ConsultationGrid
        activeSection={
          activeSection
        }
        setActiveSection={
          setActiveSection
        }
      />




      <FinishButton
        appointmentId={
          selectedPatient?.id
        }
      />

    </>

  );

};


export default PatientOverview;