const StatsCard = ({ title, value, border = true }) => {
  return (
    <div
      className={`py-1 text-center ${
        border ? "border-r border-[#EFE4DC]" : ""
      }`}
    >
      <p className="text-[11px] font-medium text-[#6D5A54]">
        {title}
      </p>

      <h3 className="mt-0.5 text-[18px] font-bold text-[#4B2E2A]">
        {value}
      </h3>
    </div>
  );
};

export default StatsCard;