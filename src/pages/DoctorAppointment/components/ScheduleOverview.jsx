import { HiOutlineCalendar } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import StatsCard from "./StatsCard";

const ScheduleOverview = ({ overview, period, setPeriod, }) => {
    const periods = ["today", "week", "month"];
    
    const handlePeriodChange = () => {
        const currentIndex = periods.indexOf(period);
        const nextIndex = (currentIndex + 1) % periods.length;
        setPeriod(periods[nextIndex]);
    };
    return (
        <div>

            <div  className=" flex items-center justify-between">

                <h2 className="text-[24px] font-bold text-[#4D2E23] dark:text-white">
                    Appointments
                </h2>

                <button
                    onClick={handlePeriodChange}
                    className="flex items-center gap-3 h-14 px-5 rounded-2xl bg-white dark:bg-[#241E1B] border border-[#E7DBD3] dark:border-[#382E28] dark:text-[#EDE3DA] transition cursor-pointer"
                >
                    <HiOutlineCalendar
                        size={22}
                        className="text-[#6A3F2D] dark:text-[#EDE3DA]"
                    />

                    <span className="font-medium capitalize">
                        {period}
                    </span>

                    <HiChevronDown
                        size={20}
                        className="text-[#6A3F2D] dark:text-[#EDE3DA]"
                    />

                </button>

            </div>

            <div className="mt-6 bg-white dark:bg-[#241E1B] rounded-[28px] border border-[#E7DBD3] dark:border-[#382E28] overflow-hidden">

                <div className="grid grid-cols-5">

                    <StatsCard
                        value={overview?.total_appointments ?? 0}
                        title="Total Appointments"
                    />

                    <StatsCard
                        value={overview?.in_person ?? 0}
                        title="In-Person"
                    />

                    <StatsCard
                        value={overview?.video_appts ?? 0}
                        title="Video Appts."
                    />

                    <StatsCard
                        value={overview?.home_visits ?? 0}
                        title="Home Visits"
                    />

                    <StatsCard
                        value={overview?.follow_ups ?? 0}
                        title="Follow-Ups"
                    />


                </div>

            </div>

        </div>
    );
};

export default ScheduleOverview;