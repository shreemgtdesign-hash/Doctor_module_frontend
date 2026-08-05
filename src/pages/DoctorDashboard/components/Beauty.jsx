import { HiSparkles } from "react-icons/hi2";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";

const Beauty = ({ period, setPeriod, beauty }) => {


  return (
    <DashboardCard className="px-5 pt-5 pb-4 cursor-pointer hover:shadow-md transition-all">

      {/* Header */}

      <div className="flex items-center justify-between">

        <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
          Beauty
        </h2>

        <DashboardDropdown
          value={period}
          options={[
            { label: "Today", value: "today" },
            { label: "This Week", value: "week" },
            { label: "This Month", value: "month" },
            { label: "Till Date", value: "till_date" },
          ]}
          onChange={setPeriod}
        />

      </div>

      {/* Content */}

      <div className="mt-5 flex items-start justify-between">

        <div>

          <h1 className="text-[42px] font-bold leading-none text-[#4B2E2A]">
            {beauty?.total ?? 0}
          </h1>

          <p className="mt-2 text-[15px] text-[#7D726B]">
            Total Beauty Consultations
          </p>

        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFF4EC]">

          <HiSparkles
            size={40}
            className="text-[#E4C08D]"
          />

        </div>

      </div>

    </DashboardCard>
  );
};

export default Beauty;