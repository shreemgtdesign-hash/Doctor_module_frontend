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
    icon: <HiOutlinePlus size={30} />,
  },
  {
    title: "Diagnosis",
    section: "diagnosis",
    icon: <HiOutlineMagnifyingGlass size={30} />,
  },
  {
    title: "Prescription",
    section: "prescription",
    icon: <HiOutlinePencilSquare size={30} />,
  },
  {
    title: "Therapy",
    section: "therapy",
    icon: <HiOutlineClipboardDocumentList size={30} />,
  },
  {
    title: "Reports",
    section: "reports",
    icon: <HiOutlineDocumentChartBar size={30} />,
  },
  {
    title: "Patient History",
    section: "history",
    icon: <HiOutlineArrowPathRoundedSquare size={30} />,
  },
];

const ConsultationGrid = ({
  activeSection,
  setActiveSection,
}) => {
  return (
    <div className="mt-8 grid grid-cols-3 gap-5">
      {cards.map((card) => (
        <ConsultationCard
          key={card.title}
          title={card.title}
          icon={card.icon}
          active={activeSection === card.section}
          onClick={() => {
  console.log("Clicked:", card.section);
  setActiveSection(card.section);
}}
        />
      ))}
    </div>
  );
};

export default ConsultationGrid;