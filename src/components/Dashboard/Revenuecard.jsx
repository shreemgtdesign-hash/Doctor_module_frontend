const RevenueCard = ({
  title,
  amount,
  percentage,
  icon,
}) => {
  return (
    <div className="rounded-[24px] border border-[#ECE3DC] p-5 bg-white">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF2E8]">
          {icon}
        </div>

        <p className="text-[18px] text-[#4B2E2A]">
          {title}
        </p>
      </div>

      <h2 className="mt-6 text-[42px] font-bold text-[#4B2E2A]">
        ₹{amount}
      </h2>

      <div className="mt-5 flex justify-end">
        <span className="rounded-full bg-[#E8F8EC] px-4 py-1 text-[15px] font-semibold text-[#149647]">
          +{percentage}%
        </span>
      </div>
    </div>
  );
};

export default RevenueCard;