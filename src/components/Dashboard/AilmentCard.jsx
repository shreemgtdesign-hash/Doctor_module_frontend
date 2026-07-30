const AilmentCard = ({
  title,
  count,
  icon,
}) => {
  return (
    <div className="rounded-[22px] border border-[#ECE3DC] p-5 bg-white">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[15px] text-[#4B2E2A]">
            {title}
          </p>

          <h3 className="mt-4 text-[32px] font-bold text-[#4B2E2A]">
            {count}
          </h3>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF2E8]">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AilmentCard;