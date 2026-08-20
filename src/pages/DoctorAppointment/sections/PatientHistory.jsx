import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  loadPatientHistory,
} from "../../../redux/consultation/consultationThunk";


const PatientHistory = ({
  patient,
  appointment,
  onBack,
  onViewReport,
}) => {

  const dispatch = useDispatch();


  // ==========================================
  // HISTORY STATE
  // ==========================================

  const {
    patientHistory = [],
    patientHistoryLoading,
    patientHistoryError,
  } = useSelector(
    (state) => state.consultation
  );


  // ==========================================
  // PATIENT ID
  // ==========================================

  const patientId =
    patient?.id ||
    patient?.patient_id ||
    appointment?.patient_id;


  // ==========================================
  // LOAD PATIENT HISTORY
  // ==========================================

  useEffect(() => {

    if (!patientId) {
      return;
    }

    dispatch(
      loadPatientHistory(
        patientId
      )
    );

  }, [
    dispatch,
    patientId,
  ]);


  // ==========================================
  // FORMAT VALUE
  // ==========================================

  const getValue = (
    value,
    fallback = "-"
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return fallback;
    }

    return value;
  };


  // ==========================================
  // VIEW REPORT
  // ==========================================

  const handleViewReport = (
    consultationId
  ) => {

    if (!consultationId) {
      console.error(
        "Consultation ID is missing"
      );

      return;
    }

    console.log(
      "Opening consultation report:",
      consultationId
    );

    if (onViewReport) {

      onViewReport(
        consultationId
      );

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (patientHistoryLoading) {

    return (
      <div className="mt-6">

        <div className="mb-6">

          <h2
            className="
              text-2xl
              font-bold
              text-[#4D2E23]
            "
          >
            Patient History
          </h2>

          <p
            className="
              mt-1
              text-[#8B7A70]
            "
          >
            View consultation history of patient
          </p>

        </div>


        <div
          className="
            flex
            min-h-[300px]
            items-center
            justify-center
            rounded-2xl
            border
            border-[#E7DBD3]
            bg-white
            text-[#8B7A70]
          "
        >
          Loading patient history...
        </div>

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (patientHistoryError) {

    return (
      <div className="mt-6">

        <div className="mb-6">

          <h2
            className="
              text-2xl
              font-bold
              text-[#4D2E23]
            "
          >
            Patient History
          </h2>

          <p
            className="
              mt-1
              text-[#8B7A70]
            "
          >
            View consultation history of patient
          </p>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-[#E7DBD3]
            bg-[#FFF8F3]
            p-6
            text-center
            text-[#8B7A70]
          "
        >
          {typeof patientHistoryError === "string"
            ? patientHistoryError
            : "Failed to load patient history."}
        </div>

      </div>
    );

  }


  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="mt-6">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="mb-6">

        <h2
          className="
            text-2xl
            font-bold
            text-[#4D2E23]
          "
        >
          Patient History
        </h2>

        <p
          className="
            mt-1
            text-[#8B7A70]
          "
        >
          View consultation history of patient
        </p>

      </div>


      {/* ================================= */}
      {/* EMPTY */}
      {/* ================================= */}

      {patientHistory.length === 0 ? (

        <div
          className="
            rounded-2xl
            border
            border-[#E7DBD3]
            bg-white
            p-8
            text-center
            text-[#8B7A70]
          "
        >
          No consultation history found.
        </div>

      ) : (

        /* ================================= */
        /* HISTORY CARDS */
        /* ================================= */

        <div className="space-y-5">

          {patientHistory.map(
            (visit, index) => (

              <div
                key={
                  visit.consultation_id ||
                  index
                }
                className="
                  rounded-[18px]
                  border
                  border-[#E7DBD3]
                  bg-white
                  px-4
                  py-4
                  shadow-[0_2px_8px_rgba(90,60,45,0.06)]
                "
              >

                {/* ================================= */}
                {/* TOP */}
                {/* ================================= */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <h3
                      className="
                        text-[17px]
                        font-semibold
                        text-[#4D2E23]
                      "
                    >
                      {getValue(
                        visit.doctor_name,
                        "Doctor"
                      )}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-[14px]
                        font-medium
                        text-[#4D2E23]
                      "
                    >
                      {getValue(
                        visit.date
                      )}
                    </p>

                  </div>


                  {/* TYPE */}

                  <span
                    className={`
                      whitespace-nowrap
                      rounded-lg
                      px-3
                      py-1
                      text-[11px]
                      font-medium
                      ${
                        visit.type
                          ?.toLowerCase()
                          .includes("video")
                          ? "bg-[#EAF9EF] text-[#317A4D]"
                          : "bg-[#FFF4E8] text-[#6A4939]"
                      }
                    `}
                  >
                    {getValue(
                      visit.type,
                      "In-person"
                    )}
                  </span>

                </div>


                {/* ================================= */}
                {/* AILMENT */}
                {/* ================================= */}

                <div
                  className="
                    mt-3
                    text-[12px]
                    text-[#81746D]
                  "
                >
                  {getValue(
                    visit.ailment
                  )}
                </div>


                {/* ================================= */}
                {/* DIVIDER */}
                {/* ================================= */}

                <div
                  className="
                    my-3
                    border-t
                    border-[#EFE4DC]
                  "
                />


                {/* ================================= */}
                {/* THERAPY + MEDICINES */}
                {/* ================================= */}

                <div
                  className="
                    grid
                    grid-cols-2
                  "
                >

                  {/* THERAPIES */}

                  <div
                    className="
                      border-r
                      border-[#EFE4DC]
                      pr-4
                    "
                  >

                    <h4
                      className="
                        text-[15px]
                        font-medium
                        text-[#4D2E23]
                      "
                    >
                      Therapies prescribed
                    </h4>

                    <p
                      className="
                        mt-2
                        text-[13px]
                        leading-5
                        text-[#2F2F2F]
                      "
                    >
                      {getValue(
                        visit.therapies_prescribed
                      )}
                    </p>

                  </div>


                  {/* MEDICINES */}

                  <div className="pl-4">

                    <h4
                      className="
                        text-[15px]
                        font-medium
                        text-[#4D2E23]
                      "
                    >
                      Medicines Prescribed
                    </h4>

                    <p
                      className="
                        mt-2
                        line-clamp-2
                        text-[13px]
                        leading-5
                        text-[#2F2F2F]
                      "
                    >
                      {getValue(
                        visit.medicines_prescribed
                      )}
                    </p>

                  </div>

                </div>


                {/* ================================= */}
                {/* BOTTOM DIVIDER */}
                {/* ================================= */}

                <div
                  className="
                    mt-3
                    border-t
                    border-[#EFE4DC]
                  "
                />


                {/* ================================= */}
                {/* VIEW REPORT */}
                {/* ================================= */}

                <div
                  className="
                    mt-3
                    flex
                    justify-end
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      handleViewReport(
                        visit.consultation_id
                      )
                    }
                    disabled={
                      !visit.consultation_id
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      text-[12px]
                      font-medium
                      text-[#4D2E23]
                      transition
                      hover:text-[#8B573D]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >

                    View Report

                    <HiOutlineArrowRight
                      size={16}
                    />

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* ================================= */}
      {/* BACK BUTTON */}
      {/* ================================= */}

      <div
        className="
          mt-6
          border-t
          border-[#E7DBD3]
          pt-4
        "
      >

        <button
          type="button"
          onClick={onBack}
          className="
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#E7DBD3]
            bg-[#FFF9F4]
            text-[14px]
            font-medium
            text-[#4D2E23]
            transition
            hover:bg-[#FFF3EA]
          "
        >

          <HiOutlineArrowLeft
            size={18}
          />

          Back

        </button>

      </div>

    </div>
  );
};

export default PatientHistory;