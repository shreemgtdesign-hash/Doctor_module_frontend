import ActionCard from "./ActionCard";
import { actions } from "../../pages/DoctorDashboard/mockData";

const ActionGrid = () => {
  return (
    <div className="grid grid-cols-5 gap-6">
      {actions.map((item) => (
        <ActionCard
          key={item.title}
          {...item}
        />
      ))}
    </div>
  );
};

export default ActionGrid;