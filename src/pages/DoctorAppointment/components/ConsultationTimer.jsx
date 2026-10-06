const ConsultationTimer = ({
  timeLeft = 0,
}) => {

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  const formattedTime =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // ==========================================
  // TIMER PROGRESS
  // ==========================================

  const progress =
    Math.max(
      0,
      Math.min(
        100,
        (timeLeft / 900) * 100
      )
    );

  return (
    <div
      className="
        relative
        h-[56px]
        w-[90px]
        shrink-0
      "
    >

      {/* ========================================
          BROWN GRADIENT
      ======================================== */}

      <svg
        className="
          absolute
          inset-0
          h-full
          w-full
        "
        viewBox="0 0 90 56"
        fill="none"
      >

        <defs>

          <linearGradient
            id="timerBrownGradient"
            x1="0"
            y1="0"
            x2="90"
            y2="56"
            gradientUnits="userSpaceOnUse"
          >

            <stop
              offset="0%"
              stopColor="#5A3022"
            />

            <stop
              offset="50%"
              stopColor="#8B5037"
            />

            <stop
              offset="100%"
              stopColor="#B8753A"
            />

          </linearGradient>

        </defs>


        {/* ========================================
            BACKGROUND BORDER
        ======================================== */}

        <rect
          x="3"
          y="3"
          width="84"
          height="50"
          rx="15"
          stroke="#F0E8E2"
          strokeWidth="5"
        />


        {/* ========================================
            PROGRESS BORDER
        ======================================== */}

        <rect
          x="3"
          y="3"
          width="84"
          height="50"
          rx="15"
          pathLength="100"
          stroke="url(#timerBrownGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={
            100 - progress
          }
          className="
            transition-[stroke-dashoffset]
            duration-1000
            ease-linear
          "
        />

      </svg>


      {/* ========================================
          TIMER TEXT
      ======================================== */}

      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          text-[17px]
          font-semibold
          text-[#59352C]
        "
      >
        {formattedTime}
      </div>

    </div>
  );
};

export default ConsultationTimer;