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
        size={30}
      />
    ),
  },

  {
    title: "Patient History",
    section: "history",
    icon: (
      <HiOutlineArrowPathRoundedSquare
        size={30}
      />
    ),
  },

  {
    title: "Reports",
    section: "reports",
    icon: (
      <HiOutlineDocumentChartBar
        size={30}
      />
    ),
  },

  {
    title: "Diagnosis",
    section: "diagnosis",
    icon: (
      <HiOutlineMagnifyingGlass
        size={30}
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
        mt-7
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
              rounded-2xl
              border
              p-5
              text-left
              transition

              ${
                activeSection ===
                card.section
                  ? `
                    border-[#6A3F2D]
                    bg-[#FFF8F2]
                  `
                  : `
                    border-[#E8DDD4]
                    bg-white
                    hover:border-[#6A3F2D]
                    hover:bg-[#FFF8F2]
                  `
              }
            `}
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-[#FFEAD8]
                text-[#6A3F2D]
              "
            >

              {card.icon}

            </div>


            <h3
              className="
                mt-4
                text-[15px]
                font-semibold
                text-[#4D2E23]
              "
            >
              {card.title}
            </h3>

          </button>

        )
      )}

    </div>

  );

};


export default JuniorConsultationGrid;