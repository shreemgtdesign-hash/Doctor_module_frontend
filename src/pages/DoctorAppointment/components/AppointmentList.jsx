import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useEffect,
  useRef,
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
  // TOTAL
  // ==========================================

  const totalPatients = appointments.length;

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
  // SELECT PATIENT
  // ==========================================

  const handleSelectPatient = (patient) => {
    if (!patient) return;

    if (selectedPatient?.id === patient.id) {
      return;
    }

    // Save current scroll position
    const currentScrollTop =
      listRef.current?.scrollTop || 0;

    // Select patient
    dispatch(
      setSelectedPatient(patient)
    );

    // Load patient details
    dispatch(
      loadPatientDetails(
        patient.patient_id
      )
    );

    // Restore list scroll position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollTop =
            currentScrollTop;
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

    if (!selectedStillExists) {
      const firstPatient =
        appointments[0];

      dispatch(
        setSelectedPatient(
          firstPatient
        )
      );

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

      <div className="flex items-center justify-between">
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

      <SearchBar />

      {/* ================================= */}
      {/* FILTER */}
      {/* ================================= */}

      <FilterTabs />

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
        ) : appointments.length > 0 ? (
          appointments.map(
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
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-gray-500
            "
          >
            No appointments found
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;