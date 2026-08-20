import {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import {
  loadPatientConsultationReport,
} from "../../../redux/consultation/consultationThunk";


const ViewReport = ({
  consultationId,
  onBack,
}) => {

  const dispatch = useDispatch();


  // ==========================================
  // CONSULTATION STATE
  // ==========================================

  const {
    consultationReport,
    consultationReportLoading,
    consultationReportError,
  } = useSelector(
    (state) => state.consultation
  );


  // ==========================================
  // LOAD REPORT
  // ==========================================

  useEffect(() => {

    if (!consultationId) {
      return;
    }

    dispatch(
      loadPatientConsultationReport(
        consultationId
      )
    );

  }, [
    dispatch,
    consultationId,
  ]);


  // ==========================================
  // LOADING
  // ==========================================

  if (consultationReportLoading) {

    return (
      <div
        className="
          mt-6
          flex
          min-h-[500px]
          items-center
          justify-center
          rounded-[20px]
          border
          border-[#E7DBD3]
          bg-white
          text-[#6A3F2D]
        "
      >
        Loading consultation report...
      </div>
    );

  }


  // ==========================================
  // NO CONSULTATION ID
  // ==========================================

  if (!consultationId) {

    return (
      <div
        className="
          mt-6
          rounded-[20px]
          border
          border-[#E7DBD3]
          bg-white
          p-8
          text-center
        "
      >

        <p className="text-[#8B7A70]">
          Consultation report could not be loaded.
        </p>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="
              mt-5
              rounded-xl
              bg-[#6A3F2D]
              px-6
              py-3
              font-semibold
              text-white
            "
          >
            Go Back
          </button>
        )}

      </div>
    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (consultationReportError) {

    return (
      <div
        className="
          mt-6
          flex
          min-h-[500px]
          flex-col
          items-center
          justify-center
          rounded-[20px]
          border
          border-[#E7DBD3]
          bg-white
          px-6
        "
      >

        <p
          className="
            text-[16px]
            text-[#8B7A70]
          "
        >
          Failed to load consultation report.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="
            mt-5
            rounded-xl
            bg-[#6A3F2D]
            px-6
            py-3
            font-semibold
            text-white
          "
        >
          Go Back
        </button>

      </div>
    );

  }


  // ==========================================
  // EMPTY
  // ==========================================

  if (!consultationReport) {
    return null;
  }


  // ==========================================
  // REPORT DATA
  // ==========================================

  const {
    patient,
    doctor,
    diagnosis,
    prescription = [],
    therapies_prescribed = [],
    additional_comments,
  } = consultationReport;


  return (
    <div className="mt-6">

      {/* ================================= */}
      {/* BACK */}
      {/* ================================= */}

      <button
        type="button"
        onClick={onBack}
        className="
          mb-5
          flex
          items-center
          gap-2
          text-[14px]
          font-semibold
          text-[#4D2E23]
          transition
          hover:text-[#7A4A35]
        "
      >

        <HiOutlineArrowLeft
          size={19}
        />

        Back

      </button>


      {/* ================================= */}
      {/* REPORT CARD */}
      {/* ================================= */}

      <div
        className="
          overflow-hidden
          rounded-[22px]
          border
          border-[#E7DBD3]
          bg-white
        "
      >

        {/* ================================= */}
        {/* DOCTOR HEADER */}
        {/* ================================= */}

        <div className="px-6 py-5">

          <div
            className="
              grid
              grid-cols-[1.5fr_0.9fr_1fr]
              items-center
            "
          >

            {/* DOCTOR */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  h-16
                  w-16
                  shrink-0
                  overflow-hidden
                  rounded-[14px]
                  border
                  border-[#E7DBD3]
                  bg-[#F5F0EA]
                "
              >

                {doctor?.profile_image ? (

                  <img
                    src={doctor.profile_image}
                    alt={
                      doctor?.name ||
                      "Doctor"
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                ) : (

                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      text-xl
                      font-bold
                      text-[#6A3F2D]
                    "
                  >
                    {doctor?.name
                      ?.charAt(0) ||
                      "D"}
                  </div>

                )}

              </div>


              <div>

                <h2
                  className="
                    text-[18px]
                    font-semibold
                    text-[#2F2F2F]
                  "
                >
                  {doctor?.name ||
                    "Doctor"}
                </h2>

                <p
                  className="
                    mt-1
                    text-[13px]
                    font-medium
                    text-[#008B8B]
                  "
                >
                  {doctor?.specialization ||
                    ""}
                </p>

                <p
                  className="
                    mt-1
                    text-[12px]
                    text-[#7D726B]
                  "
                >
                  {doctor?.qualification ||
                    ""}
                </p>

              </div>

            </div>


            {/* DATE / TIME */}

            <div
              className="
                border-l
                border-[#EFE4DC]
                px-5
              "
            >

              <p
                className="
                  text-[14px]
                  font-medium
                  text-[#4D2E23]
                "
              >
                {doctor?.date_text ||
                  "--"}
              </p>

              <p
                className="
                  mt-3
                  text-[14px]
                  font-medium
                  text-[#4D2E23]
                "
              >
                {doctor?.time_text ||
                  "--"}
              </p>

            </div>


            {/* CONSULTATION TYPE */}

            <div
              className="
                border-l
                border-[#EFE4DC]
                px-5
              "
            >

              <p
                className="
                  text-[14px]
                  font-medium
                  leading-5
                  text-[#4D2E23]
                "
              >
                {doctor?.consultation_type ||
                  "--"}
              </p>

            </div>

          </div>

        </div>


        {/* DIVIDER */}

        <div
          className="
            mx-6
            border-t
            border-[#EFE4DC]
          "
        />


        {/* ================================= */}
        {/* DIAGNOSIS */}
        {/* ================================= */}

        <section className="px-6 py-6">

          <h3
            className="
              text-[17px]
              font-semibold
              text-[#4D2E23]
            "
          >
            Diagnosis
          </h3>

          <div
            className="
              mt-4
              rounded-[16px]
              border
              border-[#E7DBD3]
              px-4
              py-4
            "
          >

            <p
              className="
                text-[14px]
                leading-6
                text-[#2F2F2F]
              "
            >
              {diagnosis ||
                "No diagnosis recorded."}
            </p>

          </div>

        </section>


        {/* DIVIDER */}

        <div
          className="
            mx-6
            border-t
            border-[#EFE4DC]
          "
        />


        {/* ================================= */}
        {/* PRESCRIPTION */}
        {/* ================================= */}

        <section className="px-6 py-6">

          <h3
            className="
              text-[17px]
              font-semibold
              text-[#4D2E23]
            "
          >
            Prescription
          </h3>


          <div
            className="
              mt-4
              overflow-hidden
              rounded-[16px]
              border
              border-[#E7DBD3]
            "
          >

            {prescription.length === 0 ? (

              <div
                className="
                  px-4
                  py-5
                  text-[14px]
                  text-[#8B7A70]
                "
              >
                No medicines prescribed.
              </div>

            ) : (

              prescription.map(
                (medicine, index) => (

                  <div
                    key={
                      medicine.product_id ||
                      index
                    }
                    className="
                      border-b
                      border-[#E7DBD3]
                      last:border-b-0
                    "
                  >

                    {/* MEDICINE */}

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-4
                      "
                    >

                      <div
                        className="
                          h-12
                          w-12
                          shrink-0
                          rounded-xl
                          bg-[#F1ECE4]
                        "
                      />

                      <div>

                        <h4
                          className="
                            text-[15px]
                            font-semibold
                            text-[#4D2E23]
                          "
                        >
                          {medicine.medicine_name ||
                            "Medicine"}
                        </h4>

                        <div
                          className="
                            mt-1
                            flex
                            items-center
                            gap-3
                            text-[12px]
                            text-[#7D726B]
                          "
                        >

                          <span>
                            {medicine.category ||
                              "--"}
                          </span>

                          <span>|</span>

                          <span>
                            {medicine.manufacturer ||
                              "--"}
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* DOSAGE */}

                    <div
                      className="
                        grid
                        grid-cols-2
                        border-t
                        border-[#EFE4DC]
                      "
                    >

                      <div
                        className="
                          border-r
                          border-[#EFE4DC]
                          px-4
                          py-4
                        "
                      >

                        <p
                          className="
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                          "
                        >
                          Dosage
                        </p>

                        <p
                          className="
                            mt-2
                            text-[13px]
                            text-[#7D726B]
                          "
                        >
                          {medicine.dosage_text ||
                            medicine.dosage ||
                            "--"}
                        </p>

                      </div>


                      <div
                        className="
                          px-4
                          py-4
                        "
                      >

                        <p
                          className="
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                          "
                        >
                          Duration
                        </p>

                        <p
                          className="
                            mt-2
                            text-[13px]
                            text-[#7D726B]
                          "
                        >
                          {medicine.duration ||
                            "--"}
                        </p>

                      </div>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>


        {/* DIVIDER */}

        <div
          className="
            mx-6
            border-t
            border-[#EFE4DC]
          "
        />


        {/* ================================= */}
        {/* THERAPIES */}
        {/* ================================= */}

        <section className="px-6 py-6">

          <h3
            className="
              text-[17px]
              font-semibold
              text-[#4D2E23]
            "
          >
            Therapies Prescribed
          </h3>


          <div
            className="
              mt-4
              overflow-hidden
              rounded-[16px]
              border
              border-[#E7DBD3]
            "
          >

            {therapies_prescribed.length === 0 ? (

              <div
                className="
                  px-4
                  py-5
                  text-[14px]
                  text-[#8B7A70]
                "
              >
                No therapies prescribed.
              </div>

            ) : (

              therapies_prescribed.map(
                (therapy, index) => (

                  <div
                    key={
                      therapy.therapy_id ||
                      index
                    }
                    className="
                      flex
                      items-center
                      gap-4
                      border-b
                      border-[#E7DBD3]
                      px-4
                      py-4
                      last:border-b-0
                    "
                  >

                    <div
                      className="
                        h-16
                        w-16
                        shrink-0
                        rounded-xl
                        bg-[#F1ECE4]
                      "
                    />

                    <div className="flex-1">

                      <h4
                        className="
                          text-[15px]
                          font-semibold
                          text-[#4D2E23]
                        "
                      >
                        {therapy.therapy_name ||
                          "Therapy"}
                      </h4>

                      <p
                        className="
                          mt-1
                          text-[13px]
                          text-[#8B7A70]
                        "
                      >
                        {therapy.description ||
                          "No description available"}
                      </p>

                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          gap-5
                          text-[13px]
                          text-[#2F2F2F]
                        "
                      >

                        <span
                          className="
                            flex
                            items-center
                            gap-1
                          "
                        >
                          <HiOutlineClock />

                          {therapy.duration ||
                            "--"}
                        </span>

                        <span
                          className="
                            flex
                            items-center
                            gap-1
                          "
                        >
                          <HiOutlineCalendarDays />

                          {therapy.scheduled_time
                            ?.split(",")[1]
                            ?.trim() ||
                            "--"}
                        </span>

                      </div>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>


        {/* DIVIDER */}

        <div
          className="
            mx-6
            border-t
            border-[#EFE4DC]
          "
        />


        {/* ================================= */}
        {/* ADDITIONAL COMMENTS */}
        {/* ================================= */}

        <section className="px-6 py-6">

          <h3
            className="
              text-[17px]
              font-semibold
              text-[#4D2E23]
            "
          >
            Additional Comments
          </h3>

          <div
            className="
              mt-4
              rounded-[16px]
              border
              border-[#E7DBD3]
              px-4
              py-4
            "
          >

            <p
              className="
                text-[14px]
                leading-6
                text-[#2F2F2F]
              "
            >
              {additional_comments ||
                "No additional comments."}
            </p>

          </div>

        </section>


        {/* ================================= */}
        {/* BOTTOM BACK */}
        {/* ================================= */}

        <div
          className="
            border-t
            border-[#EFE4DC]
            px-6
            py-4
          "
        >

          <button
            type="button"
            onClick={onBack}
            className="
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-[#E7DBD3]
              bg-[#FFF9F3]
              text-[14px]
              font-semibold
              text-[#4D2E23]
              transition
              hover:bg-[#FFF2E8]
            "
          >

            <HiOutlineArrowLeft
              size={18}
            />

            Back

          </button>

        </div>

      </div>

    </div>
  );
};

export default ViewReport;