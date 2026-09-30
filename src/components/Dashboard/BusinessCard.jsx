const BusinessCard = ({
  amount,
  children,
}) => {
  return (
    <div className="rounded-[20px] border border-[#ECE3DC] bg-white p-5 shadow-[0_2px_10px_rgba(90,50,35,0.03)] hover:shadow-md transition-all">
      <p className="text-[14px] sm:text-[15px] font-semibold text-[#4B2E2A]">
        Total Business Done
      </p>

      <h2 className="mt-4 text-[26px] sm:text-[28px] font-semibold text-[#4B2E2A] leading-tight">
        ₹{amount}
      </h2>

      <p className="mt-1.5 text-[12px] sm:text-[13px] text-[#7B6B63]">
        This Week
      </p>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default BusinessCard;