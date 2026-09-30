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
}) => {
  return (
    <div
      className="
        w-full
        min-w-0
        max-w-full
        mb-6
      "
    >
      <div
        className="
          grid
          grid-cols-3
          gap-3
          w-full
        "
      >
        {sections.map((item) => {
          const Icon = item.icon;

          const isActive =
            activeSection === item.section;

          return (
            <button
              key={item.section}
              type="button"
              onClick={() =>
                setActiveSection(item.section)
              }
              className={`
                flex
                h-[52px]
                w-full
                min-w-0
                items-center
                gap-2
                rounded-[16px]
                border
                px-3
                transition-all
                duration-200

                ${
                  isActive
                    ? `
                      border-[#70412E]
                      bg-[#FFF3E8]
                      text-[#59352C]
                      shadow-sm
                    `
                    : `
                      border-[#E7DBD3]
                      bg-white
                      text-[#59352C]
                      hover:border-[#C9A995]
                      hover:bg-[#FFF9F5]
                    `
                }
              `}
            >
              {/* ICON */}

              <span
                className={`
                  flex
                  h-[34px]
                  w-[34px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-[11px]

                  ${
                    isActive
                      ? "bg-[#FFE5D0]"
                      : "bg-[#FFF0E3]"
                  }
                `}
              >
                <Icon size={19} />
              </span>

              {/* TITLE */}

              <span
                className="
                  min-w-0
                  truncate
                  text-[13px]
                  font-semibold
                "
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConsultationSectionNav;