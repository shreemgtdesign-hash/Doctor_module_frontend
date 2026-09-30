const StatsCard = ({ title, value, border = true }) => {
  return (
    <div
      className={`py-1 px-1 sm:px-2 text-center ${
        border ? "border-r border-[#EFE4DC]" : ""
      }`}
    >
      <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#7D6B63] truncate">
        {title}
      </p>

      <h3 className="mt-1 text-[18px] sm:text-[20px] font-semibold text-[#4B2E2A] leading-tight">
        {value}
      </h3>
    </div>
  );
};

export default StatsCard;