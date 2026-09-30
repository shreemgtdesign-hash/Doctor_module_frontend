const RevenueCard = ({
  title,
  amount,
  percentage,
  icon,
}) => {
  return (
    <div className="rounded-[20px] border border-[#ECE3DC] p-5 bg-white shadow-[0_2px_10px_rgba(90,50,35,0.03)] hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF2E8] text-[#D48A43]">
          {icon}
        </div>

        <p className="text-[14px] sm:text-[15px] font-semibold text-[#4B2E2A]">
          {title}
        </p>
      </div>

      <h2 className="mt-4 text-[26px] sm:text-[28px] font-semibold text-[#4B2E2A] leading-tight">
        ₹{amount}
      </h2>

      <div className="mt-4 flex justify-end">
        <span className="rounded-full bg-[#E8F8EC] px-3 py-0.5 text-[13px] font-semibold text-[#149647]">
          +{percentage}%
        </span>
      </div>
    </div>
  );
};

export default RevenueCard;