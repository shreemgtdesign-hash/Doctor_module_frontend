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
                dark:bg-none
                dark:bg-[#241E1B]
                dark:border-[#382E28]
                shadow-[0_2px_12px_rgba(90,50,35,0.04)]
                dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]
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