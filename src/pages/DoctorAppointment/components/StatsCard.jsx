const StatsCard = ({ value, title, border = true }) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        h-[115px]
        ${border ? "border-l border-[#EEE4DD]" : ""}
      `}
    >
      <h2 className="text-[38px] font-bold text-[#593A2E]">
        {value}
      </h2>

      <p className="mt-1 text-[16px] text-[#7D7068]">
        {title}
      </p>
    </div>
  );
};

export default StatsCard;