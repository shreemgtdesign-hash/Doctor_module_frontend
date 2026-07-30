import { FaRegCalendarAlt } from "react-icons/fa";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";
import StatsCard from "../../../components/Dashboard/StatsCard";
import { useSelector } from "react-redux";
const ScheduleOverview = ({period, setPeriod}) => {
   

    const overview = useSelector(
        state => state.dashboard.overview
    );

    

    return (
        <DashboardCard className="px-5 pt-5 pb-3">

            {/* Header */}

            <div className="flex items-center justify-between">

                <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
                    Schedule Overview
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

            {/* Content */}

            <div className="mt-3 flex items-center justify-between">

                <div>

                    <h1 className="text-[28px] font-bold leading-none text-[#4B2E2A]">
                        {overview?.total_appointments ?? 0}
                    </h1>

                    <p className="mt-0.5 text-[12px] text-[#7D726B]">
                        Total Appointments
                    </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center">

                    <FaRegCalendarAlt
                        size={26}
                        className="text-[#E4C08D]"
                    />

                </div>

            </div>

            <div className="my-2 border-t border-[#EFE4DC]" />

            <div className="grid grid-cols-4">

                <StatsCard
                    title="In-Person"
                    value={overview?.in_person ?? 0}
                />

                <StatsCard
                    title="Video Appts."
                    value={overview?.video_appts ?? 0}
                />

                <StatsCard
                    title="Home Visits"
                    value={overview?.home_visits ?? 0}
                />

                <StatsCard
                    title="Follow-Ups"
                    value={overview?.follow_ups ?? 0}
                    border={false}
                />

            </div>

        </DashboardCard>
    );
};

export default ScheduleOverview;