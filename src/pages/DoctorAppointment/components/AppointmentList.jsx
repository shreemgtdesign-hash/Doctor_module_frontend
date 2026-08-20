import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";

import {
  setSelectedPatient,
} from "../../../redux/consultation/consultationSlice";

import {
  loadPatientDetails,
  loadAppointments,
} from "../../../redux/consultation/consultationThunk";

import AppointmentCard from "./AppointmentCard";

const AppointmentList = ({
  period,
}) => {
  const dispatch = useDispatch();

  // ==========================================
  // SCROLL REF
  // ==========================================

  const listRef = useRef(null);

  // ==========================================
  // SEARCH STATE
  // ==========================================

  const [search, setSearch] = useState("");

  // ==========================================
  // FILTER STATE
  // ==========================================

  const [activeFilter, setActiveFilter] =
    useState("");

  // ==========================================
  // CONSULTATION STATE
  // ==========================================

  const {
    appointments = [],
    loading,
    selectedPatient,
  } = useSelector(
    (state) => state.consultation
  );

  // ==========================================
  // DOCTOR
  // ==========================================

  const doctor = useSelector(
    (state) => state.auth.user
  );

  // ==========================================
  // PERIOD LABEL
  // ==========================================

  const getPeriodLabel = () => {
    switch (period) {
      case "week":
        return "Weekly Appointments";

      case "month":
        return "Monthly Appointments";

      case "today":
      default:
        return "Today's Appointments";
    }
  };

  // ==========================================
  // SEARCH VALUE
  // ==========================================

  const normalizedSearch =
    search.trim().toLowerCase();

  // ==========================================
  // FILTER + SEARCH + SELECTED FIRST
  // ==========================================

  const displayedAppointments = useMemo(() => {

    let result = [...appointments];

    // ========================================
    // SEARCH
    // ========================================

    if (normalizedSearch) {

      result = result.filter(
        (patient) => {

          const patientName =
            patient?.patient_name ||
            patient?.patientName ||
            patient?.name ||
            patient?.patient?.name ||
            "";

          const patientId =
            patient?.patient_id ||
            patient?.patient_code ||
            patient?.patientId ||
            patient?.patient?.id ||
            "";

          const mobile =
            patient?.mobile ||
            patient?.phone ||
            patient?.mobile_number ||
            patient?.patient?.mobile ||
            patient?.patient?.phone ||
            "";

          const searchableText =
            `${patientName} ${patientId} ${mobile}`
              .toLowerCase();

          return searchableText.includes(
            normalizedSearch
          );
        }
      );

    }

    // ========================================
    // STATUS FILTER
    // ========================================

    if (activeFilter) {

      const normalizedFilter =
        activeFilter
          .toString()
          .toLowerCase();

      result = result.filter(
        (patient) => {

          const status =
            patient?.status
              ?.toString()
              .toLowerCase();

          return (
            status ===
            normalizedFilter
          );

        }
      );

    }

    // ========================================
    // SELECTED PATIENT FIRST
    // ========================================

    if (selectedPatient?.id) {

      const selectedIndex =
        result.findIndex(
          (patient) =>
            patient.id ===
            selectedPatient.id
        );

      if (selectedIndex > 0) {

        const selectedPatientItem =
          result[selectedIndex];

        result = [
          selectedPatientItem,
          ...result.filter(
            (_, index) =>
              index !== selectedIndex
          ),
        ];

      }

    }

    return result;

  }, [
    appointments,
    normalizedSearch,
    activeFilter,
    selectedPatient?.id,
  ]);

  // ==========================================
  // SELECT PATIENT
  // ==========================================

  const handleSelectPatient = (
    patient
  ) => {

    if (!patient) {
      return;
    }

    // ========================================
    // SELECT PATIENT
    // ========================================

    dispatch(
      setSelectedPatient(
        patient
      )
    );

    // ========================================
    // LOAD PATIENT DETAILS
    // ========================================

    if (patient.patient_id) {

      dispatch(
        loadPatientDetails(
          patient.patient_id
        )
      );

    }

    // ========================================
    // MOVE SCROLL TO TOP
    // ========================================

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        if (listRef.current) {

          listRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });

        }

      });

    });

  };

  // ==========================================
  // LOAD APPOINTMENTS
  // ==========================================

  useEffect(() => {

    if (!doctor?.id) {
      return;
    }

    dispatch(
      loadAppointments({
        doctorId:
          doctor.doctor_id ||
          doctor.id,

        period,

        status: "",
      })
    );

  }, [
    dispatch,
    doctor?.doctor_id,
    doctor?.id,
    period,
  ]);

  // ==========================================
  // RESET SEARCH/FILTER WHEN PERIOD CHANGES
  // ==========================================

  useEffect(() => {

    setSearch("");
    setActiveFilter("");

  }, [period]);

  // ==========================================
  // AUTO SELECT FIRST PATIENT
  // ==========================================

  useEffect(() => {

    if (!appointments.length) {
      return;
    }

    const selectedStillExists =
      appointments.some(
        (patient) =>
          patient.id ===
          selectedPatient?.id
      );

    // ========================================
    // DON'T CHANGE CURRENT PATIENT
    // ========================================

    if (selectedStillExists) {
      return;
    }

    // ========================================
    // SELECT FIRST PATIENT
    // ========================================

    const firstPatient =
      appointments[0];

    dispatch(
      setSelectedPatient(
        firstPatient
      )
    );

    if (firstPatient.patient_id) {

      dispatch(
        loadPatientDetails(
          firstPatient.patient_id
        )
      );

    }

  }, [
    appointments,
    dispatch,
    selectedPatient?.id,
  ]);

  // ==========================================
  // TOTAL DISPLAYED PATIENTS
  // ==========================================

  const totalPatients =
    displayedAppointments.length;

  // ==========================================
  // CLEAR SEARCH + FILTER
  // ==========================================

  const clearSearchAndFilter = () => {

    setSearch("");
    setActiveFilter("");

  };

  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div
      className="
        flex
        h-full
        min-h-0
        flex-col
        rounded-[30px]
        border
        border-[#E7DBD3]
        bg-white
        p-6
      "
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-[24px]
              font-bold
              text-[#4D2E23]
            "
          >
            {getPeriodLabel()}
          </h2>

          <p
            className="
              mt-1
              text-[#8A756B]
            "
          >
            {totalPatients}{" "}
            Patient
            {totalPatients !== 1
              ? "s"
              : ""}
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

      <SearchBar
        value={search}
        onChange={setSearch}
      />


      {/* ================================= */}
      {/* FILTER */}
      {/* ================================= */}

      <FilterTabs
        value={activeFilter}
        onChange={setActiveFilter}
      />


      {/* ================================= */}
      {/* APPOINTMENT LIST */}
      {/* ================================= */}

      <div
        ref={listRef}
        className="
          mt-5
          min-h-0
          flex-1
          overflow-y-auto
          pr-2
          hide-scrollbar
        "
      >

        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading &&
        appointments.length === 0 ? (

          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-[#8B7A70]
            "
          >
            Loading appointments...
          </div>

        ) : displayedAppointments.length >
          0 ? (

          /* ================================= */
          /* PATIENT LIST */
          /* ================================= */

          displayedAppointments.map(
            (patient) => (

              <AppointmentCard
                key={patient.id}
                patient={patient}

                selected={
                  selectedPatient?.id ===
                  patient.id
                }

                onClick={() =>
                  handleSelectPatient(
                    patient
                  )
                }
              />

            )
          )

        ) : (

          /* ================================= */
          /* NO RESULTS */
          /* ================================= */

          <div
            className="
              flex
              h-full
              flex-col
              items-center
              justify-center
              text-gray-500
            "
          >

            <p className="text-base">
              No appointments found
            </p>

            {(search ||
              activeFilter) && (

              <button
                type="button"
                onClick={
                  clearSearchAndFilter
                }
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-[#8B573D]
                  hover:underline
                "
              >
                Clear search and filters
              </button>

            )}

          </div>

        )}

      </div>

    </div>

  );
};

export default AppointmentList;