const DashboardCard = ({ children, className = "" }) => {
  return (
    <div
      className={`
        m-2
        rounded-[22px]
        border
        border-[#E8D7CC]
        bg-white
     
        shadow-[0_2px_10px_rgba(0,0,0,0.03)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default DashboardCard;