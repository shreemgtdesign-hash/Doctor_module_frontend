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
                border-[#E8D7CC]
                bg-white
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