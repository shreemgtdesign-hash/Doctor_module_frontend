import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentChartBar,
  HiOutlineArrowPathRoundedSquare,
} from "react-icons/hi2";

import ConsultationCard from "./ConsultationCard";

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
  {
    title: "Prescription",
    section: "prescription",
    icon: <HiOutlinePencilSquare />,
  },
  {
    title: "Therapy",
    section: "therapy",
    icon: <HiOutlineClipboardDocumentList />,
  },
];

const ConsultationGrid = ({
  activeSection,
  setActiveSection,
}) => {
  return (
    <div
      className="
        mt-5
        grid
        grid-cols-3
        gap-3
      "
    >
      {cards.map((card) => (
        <ConsultationCard
          key={card.title}
          title={card.title}
          icon={card.icon}
          active={
            activeSection === card.section
          }
          onClick={() => {
            setActiveSection(card.section);
          }}
        />
      ))}
    </div>
  );
};

export default ConsultationGrid;