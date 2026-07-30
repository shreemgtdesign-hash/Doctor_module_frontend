const ConsultationCard = ({
  title,
  icon,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`group rounded-3xl border p-6 transition ${
        active
          ? "border-[#6A3F2D] bg-[#FFF8F4]"
          : "border-[#E8DDD4] bg-white hover:border-[#6A3F2D] hover:bg-[#FFF8F4]"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFEAD8] text-[#6A3F2D]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#4D2E23]">
        {title}
      </h3>
    </button>
  );
};

export default ConsultationCard;