import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";
import StatsCard from "../../../components/Dashboard/StatsCard";
import {loadConsultation, loadOverview } from "../../../redux/dashboard/dashboardThunk";

const ScheduleOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doctor = useSelector((state) => state.auth.user);

  const overview = useSelector(
    (state) => state.dashboard.overview
  );

  const [period, setPeriod] = useState("today");

  useEffect(() => {
    if (!doctor?.id) return;

    dispatch(
      loadOverview({
        doctorId: doctor.id,
        period,
      })
    );
  }, [dispatch, doctor?.id, period]);

  return (
    <DashboardCard className="px-5 pt-5 pb-3">

      <div
        onClick={() => navigate("/doctor/appointments")}
        className="cursor-pointer"
      >
        {/* Header */}

        <div className="flex items-center justify-between">

          <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
            Schedule Overview
          </h2>

          <DashboardDropdown
            value={period}
            options={[
              { label: "Today", value: "today" },
              { label: "This Week", value: "week" },
              { label: "This Month", value: "month" },
            ]}
            onChange={setPeriod}
          />

        </div>

        {/* Main */}

        <div className="mt-3 flex items-center justify-between">

          <div>

            <h1 className="text-[28px] font-bold leading-none text-[#4B2E2A]">
              {overview?.total_appointments ?? 0}
            </h1>

            <p className="mt-1 text-[12px] text-[#7D726B]">
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

        {/* Divider */}

        <div className="my-2 border-t border-[#EFE4DC]" />

        {/* Stats */}

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

      </div>

    </DashboardCard>
  );
};

export default ScheduleOverview;