import {
  HiOutlinePhone,
  HiOutlineArrowsPointingOut,
} from "react-icons/hi2";

import ConsultationTimer from "./ConsultationTimer";

const PatientHeader = ({
  patient,
  appointment,
  timeLeft,

  // Sidebar control
  sidebarOpen,
  setSidebarOpen,
}) => {

  if (!patient) return null;

  return (
    <div
      className="
        sticky
        top-0
        z-[50]
        w-full
        border-b
        border-[#ECE3DC]
        bg-white
        px-5
        py-4
        shadow-[0_2px_8px_rgba(80,50,40,0.05)]
      "
    >

      {/* ==========================================
          PATIENT HEADER CONTENT
      ========================================== */}

      <div
        className="
          relative
          flex
          w-full
          min-h-[92px]
          items-center
        "
      >

        {/* ==========================================
            LEFT - PATIENT INFORMATION
        ========================================== */}

        <div
          className="
            flex
            min-w-0
            max-w-full
            items-center
            gap-4
            pr-[145px]
          "
        >

          {/* ========================================
              PATIENT IMAGE
          ======================================== */}

          <img
            src={
              patient?.avatar ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(
                  patient?.name || "Patient"
                )
            }
            alt={patient?.name}
            className="
              h-[72px]
              w-[72px]
              shrink-0
              rounded-full
              border-2
              border-white
              object-cover
              shadow-[0_1px_5px_rgba(0,0,0,0.15)]
            "
          />


          {/* ========================================
              PATIENT DETAILS
          ======================================== */}

          <div className="min-w-0">

            {/* NAME */}

            <h2
              className="
                truncate
                text-[22px]
                font-semibold
                leading-tight
                text-[#2F2A28]
              "
            >
              {patient?.name}
            </h2>


            {/* AGE + GENDER */}

            <p
              className="
                mt-1
                text-[16px]
                leading-tight
                text-[#5D3B32]
              "
            >
              {patient?.age} Years

              <span className="mx-1.5">
                •
              </span>

              {patient?.gender}
            </p>


            {/* PHONE + PATIENT ID */}

            <div
              className="
                mt-2
                flex
                flex-wrap
                items-center
                gap-x-2
                text-[14px]
                text-[#81756F]
              "
            >

              <HiOutlinePhone
                size={16}
                className="shrink-0"
              />

              <span>
                {patient?.mobile}
              </span>

              <span className="mx-1 text-[#B5AAA4]">
                |
              </span>

              <span>
                Patient ID:{" "}
                {patient?.patient_code}
              </span>

              {appointment?.token_no && (
                <>
                  <span className="mx-1 text-[#B5AAA4]">
                    |
                  </span>

                  <span>
                    Token:{" "}
                    {appointment.token_no}
                  </span>
                </>
              )}

            </div>


            {/* TAGS */}

            <div
              className="
                mt-2
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <span
                className="
                  rounded-lg
                  bg-[#FFF3EB]
                  px-3
                  py-1
                  text-[12px]
                  font-medium
                  leading-4
                  text-[#6A3F2D]
                "
              >
                {patient?.blood_group || "--"}
              </span>


              <span
                className="
                  rounded-lg
                  bg-[#FFF3EB]
                  px-3
                  py-1
                  text-[12px]
                  font-medium
                  leading-4
                  text-[#6A3F2D]
                "
              >
                {patient?.allergies?.length
                  ? patient.allergies.join(", ")
                  : "No Allergies"}
              </span>


              {appointment?.status && (
                <span
                  className="
                    rounded-lg
                    bg-[#E9F8EF]
                    px-3
                    py-1
                    text-[12px]
                    font-medium
                    capitalize
                    leading-4
                    text-[#18794E]
                  "
                >
                  {appointment.status.replace(
                    "_",
                    " "
                  )}
                </span>
              )}

            </div>

          </div>

        </div>


        {/* ==========================================
            TIMER
            BOTTOM RIGHT
        ========================================== */}

        <div
          className="
            absolute
            bottom-[6px]
            right-[62px]
            z-20
          "
        >

          <ConsultationTimer
            timeLeft={timeLeft}
          />

        </div>


        {/* ==========================================
            SIDEBAR TOGGLE
            TOP RIGHT
        ========================================== */}

        <button
          type="button"
          aria-label={
            sidebarOpen
              ? "Close sidebar"
              : "Open sidebar"
          }
          onClick={() =>
            setSidebarOpen?.(
              (previous) => !previous
            )
          }
          className={`
            absolute
            right-0
            top-0
            z-30

            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center

            rounded-xl
            border
            border-[#E6DAD3]
            bg-[#FFF9F5]

            text-[#6A3F2D]

            shadow-[0_1px_4px_rgba(80,50,40,0.06)]

            transition-all
            duration-200

            hover:bg-[#FFF2EA]
            hover:shadow-[0_2px_7px_rgba(80,50,40,0.10)]
          `}
        >

          <HiOutlineArrowsPointingOut
            size={18}
            className="
              transition-transform
              duration-300
            "
          />

        </button>

      </div>

    </div>
  );
};

export default PatientHeader;