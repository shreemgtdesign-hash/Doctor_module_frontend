import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentChartBar,
  HiOutlineArrowPathRoundedSquare,
} from "react-icons/hi2";


const sections = [
  {
    title: "Chief Complaints",
    section: "complaints",
    icon: HiOutlinePlus,
  },
  {
    title: "Patient History",
    section: "history",
    icon: HiOutlineArrowPathRoundedSquare,
  },
  {
    title: "Reports",
    section: "reports",
    icon: HiOutlineDocumentChartBar,
  },
  {
    title: "Diagnosis",
    section: "diagnosis",
    icon: HiOutlineMagnifyingGlass,
  },
  {
    title: "Prescription",
    section: "prescription",
    icon: HiOutlinePencilSquare,
  },
  {
    title: "Therapy",
    section: "therapy",
    icon: HiOutlineClipboardDocumentList,
  },
];


const ConsultationSectionNav = ({
  activeSection,
  setActiveSection,
  role,
}) => {

  const visibleSections =
    role === "junior-doctor"
      ? sections.filter((item) =>
          [
            "complaints",
            "history",
            "reports",
            "diagnosis",
          ].includes(item.section)
        )
      : sections;


  return (
    <div
      className="
        sticky
        top-0
        z-40

        mb-5
        w-full
        min-w-0
        max-w-full

        overflow-hidden

        border-b
        border-[#E7DBD3]

        bg-white

        px-0
        py-3
      "
    >

      <div
        className="
          flex
          w-full
          min-w-0
          items-center
          justify-center
          gap-4
          px-1
        "
      >

        {visibleSections.map((item) => {

          const Icon = item.icon;

          const isActive =
            activeSection === item.section;


          return (
            <button
              key={item.section}

              type="button"

              onClick={() =>
                setActiveSection(
                  item.section
                )
              }

              aria-label={item.title}

              className={`
                group
                flex
                h-[46px]

                shrink-0
                items-center
                justify-center

                overflow-hidden
                rounded-[13px]
                border

                transition-all
                duration-300
                ease-out

                ${
                  isActive
                    ? `
                      w-[125px]
                      border-[#70412E]
                      bg-[#FFF3E8]
                      text-[#59352C]
                      shadow-sm
                    `
                    : `
                      w-[44px]
                      border-[#E7DBD3]
                      bg-[#FFF0E3]
                      text-[#59352C]

                      hover:w-[145px]
                      hover:border-[#C9A995]
                      hover:bg-[#FFE7D4]
                      hover:shadow-sm
                    `
                }
              `}
            >

              <span
                className="
                  flex
                  min-w-0
                  items-center
                  justify-center
                "
              >

                {/* ICON */}

                <span
                  className="
                    flex
                    h-[30px]
                    w-[30px]
                    shrink-0
                    items-center
                    justify-center
                  "
                >
                  <Icon
                    size={21}
                    strokeWidth={2}
                  />
                </span>


                {/* TITLE */}

                <span
                  className={`
                    overflow-hidden
                    whitespace-nowrap
                    text-center
                    text-[10px]
                    font-semibold
                    leading-none

                    opacity-0

                    transition-all
                    duration-300
                    ease-out

                    group-hover:max-w-[100px]
                    group-hover:opacity-100

                    ${
                      isActive
                        ? `
                          max-w-[100px]
                          opacity-100
                        `
                        : `
                          max-w-0
                        `
                    }
                  `}
                >
                  {item.title}
                </span>

              </span>

            </button>
          );

        })}

      </div>

    </div>
  );
};


export default ConsultationSectionNav;