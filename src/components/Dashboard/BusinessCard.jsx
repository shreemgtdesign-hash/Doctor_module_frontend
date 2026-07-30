const BusinessCard = ({
  amount,
  children,
}) => {
  return (
    <div className="rounded-[24px] border border-[#ECE3DC] bg-white p-5">
      <p className="text-[18px] text-[#4B2E2A]">
        Total Business Done
      </p>

      <h2 className="mt-4 text-[42px] font-bold text-[#4B2E2A]">
        ₹{amount}
      </h2>

      <p className="mt-2 text-[#7B6B63]">
        This Week
      </p>

      <div className="mt-5">
        {children}
      </div>
    </div>
  );
};

export default BusinessCard;