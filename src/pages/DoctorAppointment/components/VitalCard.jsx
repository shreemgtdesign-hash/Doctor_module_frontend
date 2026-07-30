const VitalCard = ({ title, value }) => {
  return (
    <div className="rounded-2xl border border-[#E8DDD4] bg-[#FAF8F6] p-4">
      <p className="text-sm text-[#8C7C72]">{title}</p>

      <h3 className="mt-2 text-[24px] font-bold text-[#4D2E23]">
        {value}
      </h3>
    </div>
  );
};

export default VitalCard;