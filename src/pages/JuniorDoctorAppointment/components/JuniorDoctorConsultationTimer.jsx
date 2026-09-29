const JuniorDoctorConsultationTimer = ({
  timeLeft = 0,
}) => {

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  const formattedTime =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

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
        sticky
        top-14
        ml-auto
        z-50
        w-[112px]
        h-[70px]
        -mb-[70px]
      "
    >

      <svg
        className="
          absolute
          inset-0
          w-full
          h-full
        "
        viewBox="0 0 112 70"
        fill="none"
      >

        <rect
          x="4"
          y="4"
          width="104"
          height="62"
          rx="18"
          stroke="#F0F1F1"
          strokeWidth="6"
        />

        <rect
          x="4"
          y="4"
          width="104"
          height="62"
          rx="18"
          pathLength="100"
          stroke="#A65E10"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          className="
            transition-[stroke-dashoffset]
            duration-1000
            ease-linear
          "
        />

      </svg>

      <div
        className="
          absolute
          inset-0
          z-10
          flex
          items-center
          justify-center
          text-[20px]
          font-semibold
          text-[#59352C]
        "
      >
        {formattedTime}
      </div>

    </div>
  );
};

export default JuniorDoctorConsultationTimer;