import {
    HiOutlinePlus,
    HiOutlineArrowPathRoundedSquare,
    HiOutlineDocumentChartBar,
    HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

const cards = [
    {
        title: "Chief Complaints",
        section: "complaints",
        icon: <HiOutlinePlus />,
    },
    {
        title: "Patient History",
        section: "history",
        icon: <HiOutlineArrowPathRoundedSquare />,
    },
    {
        title: "Reports",
        section: "reports",
        icon: <HiOutlineDocumentChartBar />,
    },
    {
        title: "Diagnosis",
        section: "diagnosis",
        icon: <HiOutlineMagnifyingGlass />,
    },
];

const JuniorConsultationGrid = ({
    activeSection,
    setActiveSection,
}) => {
    return (
        <div
            className="
                mt-5
                grid
                grid-cols-2
                gap-3
            "
        >
            {cards.map((card) => {
                const active =
                    activeSection === card.section;

                return (
                    <button
                        key={card.title}
                        type="button"
                        onClick={() =>
                            setActiveSection(card.section)
                        }
                        className={`
                            group
                            flex
                            h-[64px]
                            w-full
                            items-center
                            rounded-[18px]
                            border
                            px-2
                            text-left
                            transition-all
                            duration-200

                            ${
                                active
                                    ? `
                                        border-[#7A4933]
                                        bg-[#FFF7F0]
                                        shadow-[0_2px_6px_rgba(90,50,35,0.08)]
                                    `
                                    : `
                                        border-[#E7DBD3]
                                        bg-white
                                        hover:border-[#C9A995]
                                        hover:bg-[#FFF9F5]
                                    `
                            }
                        `}
                    >
                        {/* ICON */}
                        <div
                            className={`
                                flex
                                h-[46px]
                                w-[46px]
                                shrink-0
                                items-center
                                justify-center
                                rounded-[15px]

                                ${
                                    active
                                        ? `
                                            bg-[#FFE9D7]
                                            text-[#75452F]
                                        `
                                        : `
                                            bg-[#FFF0E3]
                                            text-[#75452F]
                                        `
                                }
                            `}
                        >
                            <span className="text-[23px]">
                                {card.icon}
                            </span>
                        </div>

                        {/* TITLE */}
                        <span
                            className="
                                ml-3
                                text-[16px]
                                font-semibold
                                leading-[20px]
                                text-[#59352C]
                            "
                        >
                            {card.title}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default JuniorConsultationGrid;