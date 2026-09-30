const ConsultationCard = ({
  title,
  icon,
  active,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        flex
        h-[64px]
        w-full
        items-center
        rounded-[18px]
        border
        px-2
        text-left
        transition-all
        duration-200

        ${
          active
            ? `
              border-[#7A4933]
              bg-[#FFF7F0]
              shadow-[0_2px_6px_rgba(90,50,35,0.08)]
            `
            : `
              border-[#E7DBD3]
              bg-white
              hover:border-[#C9A995]
              hover:bg-[#FFF9F5]
            `
        }
      `}
    >
      {/* ICON */}

      <div
        className={`
          flex
          h-[46px]
          w-[46px]
          shrink-0
          items-center
          justify-center
          rounded-[15px]

          ${
            active
              ? `
                bg-[#FFE9D7]
                text-[#75452F]
              `
              : `
                bg-[#FFF0E3]
                text-[#75452F]
              `
          }
        `}
      >
        <span className="text-[23px]">
          {icon}
        </span>
      </div>


      {/* TITLE */}

      <span
        className="
          ml-3
          text-[16px]
          font-semibold
          leading-[20px]
          text-[#59352C]
        "
      >
        {title}
      </span>
    </button>
  );
};

export default ConsultationCard;