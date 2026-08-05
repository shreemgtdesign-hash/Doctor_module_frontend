import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaLeaf } from "react-icons/fa";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";
import StatsCard from "../../../components/Dashboard/StatsCard";
import {loadTherapiesDashboard } from "../../../redux/dashboard/dashboardThunk";

const TherapiesPrescribed = () => {
  const dispatch = useDispatch();

  const doctor = useSelector((state) => state.auth.user);

  const therapies = useSelector(
    (state) => state.dashboard.therapies
  );

  const breakdown = therapies?.breakdown ?? [];

  const [period, setPeriod] = useState("today");

  useEffect(() => {
    if (!doctor?.id) return;

    dispatch(
      loadTherapiesDashboard({
        doctorId: doctor.id,
        period,
      })
    );
  }, [dispatch, doctor?.id, period]);

  return (
    <DashboardCard className="px-5 pt-5 pb-3">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
          Therapies Prescribed
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

      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-none text-[#4B2E2A]">
            {therapies?.total ?? 0}
          </h1>

          <p className="mt-1 text-[12px] text-[#7D726B]">
            Total Therapies
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center">
          <FaLeaf
            size={30}
            className="text-[#E4C08D]"
          />
        </div>
      </div>

      {/* Divider */}

      <div className="mt-3 mb-2 border-t border-[#EFE4DC]" />

      {/* Stats */}

      <div
        className={`grid gap-2 ${
          breakdown.length <= 4
            ? "grid-cols-4"
            : "grid-cols-2"
        }`}
      >
        {breakdown.map((item, index) => (
          <StatsCard
            key={`${item.therapy_name}-${index}`}
            title={item.therapy_name}
            value={item.count}
            border={index !== breakdown.length - 1}
          />
        ))}
      </div>
    </DashboardCard>
  );
};

export default TherapiesPrescribed;