import { FaUserDoctor } from "react-icons/fa6";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";
import StatsCard from "../../../components/Dashboard/StatsCard";
import { useSelector } from "react-redux";

const ConsultationHistory = ({period, setPeriod}) => {
  

  const consultation = useSelector(
    (state) => state.dashboard.consultation
  );

  return (
    <DashboardCard className="px-5 pt-5 pb-3">
      {/* Header */}

      <div className="flex items-center justify-between">

        <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
          Consultations History
        </h2>

        <DashboardDropdown
          value={period}
          options={[
            { label: "Till Date", value: "all" },
            { label: "This Month", value: "month" },
            { label: "This Week", value: "week" },
          ]}
          onChange={setPeriod}
        />

      </div>

      {/* Main */}

      <div className="mt-3 flex items-start justify-between">

        <div>

          <h1 className="text-[28px] font-bold leading-none text-[#4B2E2A]">
            {(consultation?.total ?? 0).toLocaleString()}
          </h1>

          <p className="mt-1 text-[12px] text-[#7D726B]">
            Total Consultations Till Date
          </p>

        </div>

        <div className="flex h-14 w-14 items-center justify-center">

          <FaUserDoctor
            size={30}
            className="text-[#E4C08D]"
          />

        </div>

      </div>

      {/* Divider */}

      <div className="mt-3 mb-2 border-t border-[#EFE4DC]" />

      {/* Stats */}

      <div className="grid grid-cols-4">

        <StatsCard
          title="In-Person"
          value={consultation?.newPatients ?? 0}
        />

        <StatsCard
          title="Video Appts."
          value={consultation?.revisit ?? 0}
        />

        <StatsCard
          title="Home Visits"
          value={consultation?.referred ?? 0}
        />

        <StatsCard
          title="Follow-Ups"
          value={consultation?.emergency ?? 0}
          border={false}
        />

      </div>

    </DashboardCard>
  );
};

export default ConsultationHistory;