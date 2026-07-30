import {
  HiOutlineCalendar,
  HiOutlineLogin,
  HiOutlineClipboardCheck,
  HiOutlineDocumentRemove,
} from "react-icons/hi";

import ActionCard from "./ActionCard";

const actions = [
  {
    title: "Upcoming Appointments",
    icon: HiOutlineCalendar,
  },
  {
    title: "Direct Check-in",
    icon: HiOutlineLogin,
  },
  {
    title: "Checked List",
    icon: HiOutlineClipboardCheck,
  },
  {
    title: "No Show List",
    icon: HiOutlineDocumentRemove,
  },
];

const DashboardActions = () => {
  return (
    <div className="grid grid-cols-4 gap-6 mt-10">
      {actions.map((item) => (
        <ActionCard
          key={item.title}
          {...item}
        />
      ))}
    </div>
  );
};

export default DashboardActions;