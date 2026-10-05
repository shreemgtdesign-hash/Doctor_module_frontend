const DashboardCard = ({
    children,
    className = "",
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className={`
                rounded-[20px]
                border
                border-[#E4D9C5]
                bg-[linear-gradient(90deg,#FFFDFB_0%,#F8F2EB_100%,#E4D9C5_100%)]
                shadow-[0_2px_12px_rgba(90,50,35,0.04)]
                transition-all
                duration-200
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default DashboardCard;