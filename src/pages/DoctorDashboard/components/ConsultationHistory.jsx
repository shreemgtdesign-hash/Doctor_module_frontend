import { useEffect, useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";
import StatsCard from "../../../components/Dashboard/StatsCard";

import { loadConsultation } from "../../../redux/dashboard/dashboardThunk";

const ConsultationHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const consultation = useSelector(
    (state) => state.dashboard.consultation
  );

  const [period, setPeriod] = useState("today");

  useEffect(() => {
    console.log(
      "🔥 Loading consultation history:",
      period
    );

    dispatch(
      loadConsultation({
        period,
      })
    );
  }, [dispatch, period]);

  return (
    <div
      onClick={() => navigate("/doctor/consultation-history")}
      className="cursor-pointer"
    >
      <DashboardCard className="p-5 sm:p-6 hover:shadow-md transition-all">

        {/* Header */}
        <div className="flex items-center justify-between">

          <h2 className="text-[17px] sm:text-[18px] font-semibold text-[#4B2E2A] tracking-tight">
            Consultations History
          </h2>

          <div onClick={(e) => e.stopPropagation()}>
            <DashboardDropdown
              value={period}
              options={[
                {
                  label: "Today",
                  value: "today",
                },
                {
                  label: "This Week",
                  value: "week",
                },
                {
                  label: "This Month",
                  value: "month",
                },
              ]}
              onChange={setPeriod}
            />
          </div>

        </div>

        {/* Main KPI */}
        <div className="mt-4 flex items-center justify-between">

          <div>

            <h1 className="text-[28px] sm:text-[32px] font-bold leading-none text-[#4B2E2A]">
              {Number(
                consultation?.total_consultations ?? 0
              ).toLocaleString()}
            </h1>

            <p className="mt-1.5 text-[12px] sm:text-[13px] font-medium text-[#7D726B]">
              Total Consultations
            </p>

          </div>

          <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-[#FFF4EB] border border-[#FFE8D6] text-[#D48A43] shrink-0">

            <FaUserDoctor
              size={24}
              className="text-[#D48A43]"
            />

          </div>

        </div>

        {/* Divider */}
        <div className="my-3 sm:my-3.5 border-t border-[#EFE4DC]" />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 sm:gap-y-0">

          <div className="border-r border-[#EFE4DC]">
            <StatsCard
              title="In-Person"
              value={consultation?.in_person ?? 0}
              border={false}
            />
          </div>

          <div className="sm:border-r border-[#EFE4DC]">
            <StatsCard
              title="Video Appts."
              value={consultation?.video_appts ?? 0}
              border={false}
            />
          </div>

          <div className="border-r border-[#EFE4DC]">
            <StatsCard
              title="Home Visits"
              value={consultation?.home_visits ?? 0}
              border={false}
            />
          </div>

          <div>
            <StatsCard
              title="Follow-Ups"
              value={consultation?.follow_ups ?? 0}
              border={false}
            />
          </div>

        </div>

      </DashboardCard>
    </div>
  );
};

export default ConsultationHistory;