import {
  FaHeartbeat,
  FaLungs,
  FaBrain,
  FaBone,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";
import AilmentCard from "../../../components/Dashboard/AilmentCard";

const AilmentsAddressed = ({ period, setPeriod }) => {
  const navigate = useNavigate();

  const iconMap = {
    Orthopedics: (
      <FaBone className="text-[#8A4D34] text-lg" />
    ),
    Neurology: (
      <FaBrain className="text-[#8A4D34] text-lg" />
    ),
    Endocrinology: (
      <FaHeartbeat className="text-[#8A4D34] text-lg" />
    ),
    Cardiology: (
      <FaHeartbeat className="text-[#8A4D34] text-lg" />
    ),
    Pulmonology: (
      <FaLungs className="text-[#8A4D34] text-lg" />
    ),
    Respiratory: (
      <FaLungs className="text-[#8A4D34] text-lg" />
    ),
    Diabetes: (
      <FaHeartbeat className="text-[#8A4D34] text-lg" />
    ),
    Cardiac: (
      <FaHeartbeat className="text-[#8A4D34] text-lg" />
    ),
    Skin: (
      <FaHeartbeat className="text-[#8A4D34] text-lg" />
    ),
  };

  const ailments = useSelector(
    (state) => state.dashboard.ailments
  );

  return (
    <div
      onClick={() =>
        navigate("/doctor/ailments-addressed")
      }
      className="cursor-pointer"
    >
      <DashboardCard className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
            Ailments Addressed
          </h2>

          <DashboardDropdown
            value={period}
            options={[
              { label: "This Week", value: "week" },
              { label: "This Month", value: "month" },
              { label: "Today", value: "today" },
            ]}
            onChange={setPeriod}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {ailments?.data?.map((item) => (
            <AilmentCard
              key={item.category}
              title={item.category}
              count={item.count}
              icon={
                iconMap[item.category] ?? (
                  <FaHeartbeat className="text-[#8A4D34] text-lg" />
                )
              }
            />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default AilmentsAddressed;