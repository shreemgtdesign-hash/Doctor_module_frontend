import {
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  HiChevronRight,
  HiOutlineChevronDown,
  HiOutlineCalendarDays,
  HiCheck,
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

import {
  getPatientWellness,
} from "../../../api/doctorAppointmentApi";


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
  // LOCAL STATE & REFS
  // ==========================================

  const dropdownRef = useRef(null);

  const [
    showPastVitals,
    setShowPastVitals,
  ] = useState(false);

  const [
    selectedVitalDate,
    setSelectedVitalDate,
  ] = useState(null);

  const [
    isViewingPast,
    setIsViewingPast,
  ] = useState(false);

  const [
    selectedDateLabel,
    setSelectedDateLabel,
  ] = useState("Today");

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
  // FORMAT DATE DISPLAY HELPER
  // ==========================================

  const formatDateDisplay = (item) => {
    if (!item) return "";
    if (item.formatted_date) return item.formatted_date;
    if (item.label) return item.label;
    if (item.date) {
      try {
        const d = new Date(item.date);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        }
      } catch (e) {
        // fallback
      }
      return String(item.date);
    }
    return "Recorded Vitals";
  };

  // ==========================================
  // PREVIOUS DATES FROM HISTORY
  // ==========================================

  const previousDates = useMemo(() => {
    const raw =
      patientWellness?.history ||
      patientWellness?.past_vitals ||
      patientWellness?.vitals_history ||
      patientWellness?.records ||
      [];
    let list = Array.isArray(raw) ? raw.filter((item) => item && !item.is_today) : [];
    if (
      list.length === 0 &&
      patientWellness?.previous &&
      typeof patientWellness.previous === "object" &&
      !patientWellness.previous.is_today
    ) {
      list = [patientWellness.previous];
    }
    return list;
  }, [patientWellness]);

  // ==========================================
  // HELPER: MATCH PAST RECORD FROM API RESPONSE
  // ==========================================

  const findRecordForDate = (resData, targetItem) => {
    if (!resData || typeof resData !== "object") return null;

    const targetDate = targetItem?.date;
    const targetId = targetItem?.id;

    // 1. Look in history array
    const historyList =
      resData.history ||
      resData.past_vitals ||
      resData.vitals_history ||
      resData.records;
    if (Array.isArray(historyList) && historyList.length > 0) {
      if (targetDate) {
        const matchByDate = historyList.find(
          (h) => h && h.date === targetDate && !h.is_today
        );
        if (matchByDate) return matchByDate;
      }
      if (targetId) {
        const matchById = historyList.find(
          (h) => h && h.id === targetId && !h.is_today
        );
        if (matchById) return matchById;
      }
      if (targetDate) {
        const matchAnyDate = historyList.find((h) => h && h.date === targetDate);
        if (matchAnyDate) return matchAnyDate;
      }
    }

    // 2. Check previous
    if (resData.previous && typeof resData.previous === "object") {
      if (
        (targetDate && resData.previous.date === targetDate) ||
        (targetId && resData.previous.id === targetId) ||
        !resData.previous.is_today
      ) {
        return resData.previous;
      }
    }

    // 3. Check vitals property if present and not today
    if (resData.vitals && typeof resData.vitals === "object") {
      if (
        (targetDate && (resData.date === targetDate || resData.vitals.date === targetDate)) ||
        !resData.vitals.is_today
      ) {
        return resData.vitals;
      }
    }

    // 4. Check resData itself if matching date and not today
    if (
      resData.date &&
      targetDate &&
      resData.date === targetDate &&
      !resData.is_today
    ) {
      return resData;
    }

    // NEVER fallback to resData.today or resData (which contains today's vitals)
    return null;
  };

  // ==========================================
  // RESET ON PATIENT CHANGE
  // ==========================================

  useEffect(() => {
    setIsViewingPast(false);
    setSelectedVitalDate(null);
    setSelectedDateLabel("Today");
    setShowPastVitals(false);
  }, [patientId]);

  // ==========================================
  // GET TODAY'S VITALS ON PATIENT LOAD
  // ==========================================

  useEffect(() => {
    if (!patientId) {
      return;
    }

    const loadTodayVitals = async () => {
      setLoadingVitals(true);
      try {
        await dispatch(
          loadPatientWellness({
            patientId,
            period: "today",
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to load patient wellness:", error);
      } finally {
        setLoadingVitals(false);
      }
    };

    loadTodayVitals();
  }, [dispatch, patientId]);

  // ==========================================
  // SYNC WITH REDUX (WHEN NOT VIEWING PAST)
  // ==========================================

  useEffect(() => {
    if (!patientWellness) {
      return;
    }

    if (!isViewingPast) {
      const today = patientWellness?.today || patientWellness;
      setSelectedVitalDate(today);
      setSelectedDateLabel("Today");
    }
  }, [patientWellness, isViewingPast]);

  // ==========================================
  // CLICK OUTSIDE LISTENER TO CLOSE DROPDOWN
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPastVitals(false);
      }
    };

    if (showPastVitals) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPastVitals]);

  // ==========================================
  // CURRENT VITALS
  // ==========================================

  const currentVitals =
    selectedVitalDate ||
    patientWellness?.today ||
    patientWellness ||
    {};

  // ==========================================
  // SELECT PREVIOUS VITALS
  // ==========================================

  const handleDateChange = async (historyItem) => {
    if (!historyItem) {
      return;
    }

    setShowPastVitals(false);
    setIsViewingPast(true);

    const label = formatDateDisplay(historyItem);
    setSelectedDateLabel(label);

    // 1. Immediately apply any inline vitals data available
    const inlineData = historyItem.vitals
      ? { ...historyItem, ...historyItem.vitals, formatted_date: label, is_today: false }
      : { ...historyItem, formatted_date: label, is_today: false };

    setSelectedVitalDate(inlineData);

    // 2. Fetch remote vitals if patientId and date exist
    if (patientId && historyItem.date) {
      setLoadingVitals(true);
      try {
        const response = await getPatientWellness(patientId, {
          date: historyItem.date,
        });
        const resData = response?.data?.data || response?.data;
        const remoteRecord = findRecordForDate(resData, historyItem);

        if (remoteRecord && typeof remoteRecord === "object") {
          setSelectedVitalDate({
            ...inlineData,
            ...remoteRecord,
            formatted_date: label,
            is_today: false,
          });
        }
      } catch (err) {
        console.warn("Could not fetch remote vitals for date, using inline data:", err);
      } finally {
        setLoadingVitals(false);
      }
    }
  };

  // ==========================================
  // GO BACK TO TODAY
  // ==========================================

  const handleToday = () => {
    setShowPastVitals(false);
    setIsViewingPast(false);
    setSelectedDateLabel("Today");
    const today = patientWellness?.today || patientWellness || {};
    setSelectedVitalDate(today);
  };


  return (

    <>

      {/* ==========================================
          VITALS + AYURVEDIC BODY TYPE
      ========================================== */}

      <div
        className="
        mt-4
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
          flex-col
          items-end
          gap-1
        "
        ref={dropdownRef}
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
            cursor-pointer
          "
        >

          <span>
            {isViewingPast
              ? selectedDateLabel
              : "View Past Vitals"}
          </span>

          <HiOutlineChevronDown
            size={13}
            className={`text-[#8A563B] transition-transform duration-200 ${
              showPastVitals ? "rotate-180" : ""
            }`}
          />

        </button>

        {/* STATUS INDICATOR WHEN VIEWING PAST */}
        {isViewingPast && (
          <div className="flex items-center gap-1.5 text-[10px] text-[#8A7A71]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#8A563B]" />
            <span>
              Showing vitals for{" "}
              <strong className="text-[#59352C]">{selectedDateLabel}</strong>
            </span>
            <button
              type="button"
              onClick={handleToday}
              className="ml-1 font-bold text-[#6E3C27] hover:underline cursor-pointer"
            >
              (Back to Today)
            </button>
          </div>
        )}

        {/* ==========================================
            PAST VITALS DROPDOWN
        ========================================== */}

        {showPastVitals && (

          <div
            className="
              absolute
              right-0
              top-7
              z-50
              w-[215px]
              overflow-hidden
              rounded-xl
              border
              border-[#EBDDD2]
              bg-white
              shadow-[0_8px_25px_rgba(89,53,44,0.14)]
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
                px-3.5
                py-2.5
                bg-[#FAF6F2]
              "
            >

              <span
                className="
                  text-[11px]
                  font-bold
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
              className={`
                flex
                w-full
                items-center
                justify-between
                border-b
                border-[#F5ECE6]
                px-3.5
                py-2
                text-left
                text-[11px]
                transition
                hover:bg-[#FFF8F3]
                cursor-pointer
                ${!isViewingPast
                  ? "bg-[#FFF4EC] font-bold text-[#6E3C27]"
                  : "font-medium text-[#59352C]"}
              `}
            >

              <span>
                Today
              </span>

              {!isViewingPast ? (
                <HiCheck
                  size={14}
                  className="text-[#2E7D32]"
                />
              ) : (
                <HiChevronRight
                  size={13}
                  className="
                    text-[#8A563B]
                  "
                />
              )}

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

                    const label = formatDateDisplay(item);

                    const isSelected =
                      isViewingPast &&
                      (selectedVitalDate?.date === item.date ||
                        selectedDateLabel === label);

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
                          py-2
                          text-left
                          text-[11px]
                          transition
                          hover:bg-[#FFF8F3]
                          cursor-pointer
                          ${isSelected
                            ? "bg-[#FFF4EC] font-bold text-[#6E3C27]"
                            : "text-[#59352C]"
                          }
                        `}
                      >

                        <span>
                          {label}
                        </span>

                        {isSelected ? (
                          <HiCheck
                            size={14}
                            className="text-[#2E7D32]"
                          />
                        ) : (
                          <HiChevronRight
                            size={13}
                            className="
                              shrink-0
                              text-[#8A563B]
                            "
                          />
                        )}

                      </button>

                    );

                  }
                )}

              </div>

            ) : (

              <div
                className="
                  px-3.5
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