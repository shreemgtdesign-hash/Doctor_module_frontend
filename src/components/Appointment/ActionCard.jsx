const ActionCard = ({ icon: Icon, title }) => {
  return (
    <button
      className="
        bg-[#FFF8F3]
        rounded-[22px]
        border
        border-[#E9D7C8]
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        h-[120px]
        flex
        flex-col
        justify-center
        items-center
        gap-4
      "
    >
      <div className="w-14 h-14 rounded-xl bg-[#FFEEDF] flex items-center justify-center">
        <Icon className="text-[#6A3F2D]" size={28} />
      </div>

      <h3 className="text-[17px] font-semibold text-[#4A2E23]">
        {title}
      </h3>
    </button>
  );
};

export default ActionCard;