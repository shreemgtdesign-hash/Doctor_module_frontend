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
        icon: (
            <HiOutlinePlus
                size={24}
            />
        ),
    },

    {
        title: "Patient History",
        section: "history",
        icon: (
            <HiOutlineArrowPathRoundedSquare
                size={24}
            />
        ),
    },

    {
        title: "Reports",
        section: "reports",
        icon: (
            <HiOutlineDocumentChartBar
                size={24}
            />
        ),
    },

    {
        title: "Diagnosis",
        section: "diagnosis",
        icon: (
            <HiOutlineMagnifyingGlass
                size={24}
            />
        ),
    },

];


const JuniorConsultationGrid = ({
    activeSection,
    setActiveSection,
}) => {

    return (

        <div
            className="
                grid
                grid-cols-2
                gap-4
            "
        >

            {cards.map(
                (card) => (

                    <button
                        key={
                            card.title
                        }

                        type="button"

                        onClick={() =>
                            setActiveSection(
                                card.section
                            )
                        }

                        className={`
                            group
                            flex
                            h-[100px]
                            flex-col
                            items-center
                            justify-center
                            rounded-[16px]
                            border
                            px-4
                            transition-all
                            duration-200

                            ${
                                activeSection ===
                                card.section

                                    ? `
                                        border-[#D9B89C]
                                        bg-[#FFF8F2]
                                    `

                                    : `
                                        border-[#E8DDD4]
                                        bg-[#FFFCF9]
                                        hover:border-[#D9B89C]
                                        hover:bg-[#FFF8F2]
                                    `
                            }
                        `}
                    >

                        {/* ================================= */}
                        {/* ICON */}
                        {/* ================================= */}

                        <div
                            className="
                                flex
                                h-[42px]
                                w-[42px]
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#FFEAD8]
                                text-[#6A3F2D]
                                transition-transform
                                duration-200
                                group-hover:scale-105
                            "
                        >

                            {
                                card.icon
                            }

                        </div>


                        {/* ================================= */}
                        {/* TITLE */}
                        {/* ================================= */}

                        <h3
                            className="
                                mt-3
                                text-center
                                text-[14px]
                                font-semibold
                                text-[#4D2E23]
                            "
                        >
                            {
                                card.title
                            }
                        </h3>

                    </button>

                )
            )}

        </div>

    );

};


export default JuniorConsultationGrid;