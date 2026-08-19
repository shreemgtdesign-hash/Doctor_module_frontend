import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  finishConsultationThunk,
} from "../../../redux/consultation/consultationThunk";

const FinishButton = ({
  appointmentId,
}) => {
  const dispatch = useDispatch();

  // ==========================================
  // ERROR POPUP
  // ==========================================

  const [showError, setShowError] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [missingFlows, setMissingFlows] =
    useState([]);

  // ==========================================
  // SUCCESS POPUP
  // ==========================================

  const [showSuccess, setShowSuccess] =
    useState(false);

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // FINISH CONSULTATION
  // ==========================================

  const handleFinish = async () => {
    if (!appointmentId || loading) {
      return;
    }

    setLoading(true);

    // Close previous popups
    setShowError(false);
    setShowSuccess(false);

    try {
      const result = await dispatch(
        finishConsultationThunk(
          appointmentId
        )
      ).unwrap();

      console.log(
        "Consultation finished:",
        result
      );

      // ======================================
      // SHOW SUCCESS POPUP
      // ======================================

      setShowSuccess(true);

    } catch (error) {
      console.error(
        "Finish consultation error:",
        error
      );

      setErrorMessage(
        error?.message ||
        error?.detail ||
        "Please complete the required consultation flow."
      );

      setMissingFlows(
        error?.missing ||
        error?.incomplete_flows ||
        error?.required_sections ||
        []
      );

      setShowError(true);

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================================= */}
      {/* FINISH BUTTON */}
      {/* ================================= */}

      <div className="mt-8 flex justify-end">

        <button
          type="button"
          onClick={handleFinish}
          disabled={loading}
          className="
            h-14
            rounded-2xl
            bg-[#6A3F2D]
            px-10
            font-semibold
            text-white
            transition
            hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "Finishing..."
            : "Finish Consultation"}
        </button>

      </div>


      {/* ================================= */}
      {/* ERROR POPUP */}
      {/* ================================= */}

      {showError && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
        >

          <div
            className="
              w-full
              max-w-[450px]
              rounded-[24px]
              bg-white
              p-7
              shadow-2xl
            "
          >

            <h2
              className="
                text-[22px]
                font-bold
                text-[#4D2E23]
              "
            >
              Cannot Finish Consultation
            </h2>

            <p
              className="
                mt-3
                text-[15px]
                text-[#7D726B]
              "
            >
              {errorMessage}
            </p>


            {/* Missing flows */}

            {missingFlows.length > 0 && (

              <div className="mt-5">

                <p
                  className="
                    mb-2
                    text-[15px]
                    font-semibold
                    text-[#4D2E23]
                  "
                >
                  Please complete the following:
                </p>

                <div className="space-y-2">

                  {missingFlows.map(
                    (flow, index) => (

                      <div
                        key={index}
                        className="
                          rounded-xl
                          bg-[#FFF4EC]
                          px-4
                          py-3
                          text-[14px]
                          font-medium
                          text-[#6A3F2D]
                        "
                      >
                        {flow}
                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            {/* Close */}

            <button
              type="button"
              onClick={() =>
                setShowError(false)
              }
              className="
                mt-6
                w-full
                rounded-xl
                bg-[#6A3F2D]
                py-3
                font-semibold
                text-white
                transition
                hover:opacity-90
              "
            >
              OK
            </button>

          </div>

        </div>

      )}


      {/* ================================= */}
      {/* SUCCESS POPUP */}
      {/* ================================= */}

      {showSuccess && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
        >

          <div
            className="
              w-full
              max-w-[430px]
              rounded-[24px]
              bg-white
              p-8
              text-center
              shadow-2xl
            "
          >

            {/* Success Icon */}

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[#EAF7EE]
              "
            >

              <span
                className="
                  text-[32px]
                  font-bold
                  text-[#3B8F57]
                "
              >
                ✓
              </span>

            </div>


            {/* Title */}

            <h2
              className="
                mt-5
                text-[23px]
                font-bold
                text-[#4D2E23]
              "
            >
              Consultation Completed
            </h2>


            {/* Message */}

            <p
              className="
                mt-3
                text-[15px]
                leading-6
                text-[#7D726B]
              "
            >
              Consultation completed successfully.
            </p>


            {/* OK Button */}

            <button
              type="button"
              onClick={() =>
                setShowSuccess(false)
              }
              className="
                mt-6
                w-full
                rounded-xl
                bg-[#6A3F2D]
                py-3
                font-semibold
                text-white
                transition
                hover:opacity-90
              "
            >
              OK
            </button>

          </div>

        </div>

      )}

    </>
  );
};

export default FinishButton;