import { useEffect, useState } from "react";
import { FaCapsules } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";
import StatsCard from "../../../components/Dashboard/StatsCard";
import {loadMedicines } from "../../../redux/dashboard/dashboardThunk";

const MedicinesPrescribed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doctor = useSelector((state) => state.auth.user);

  const medicines = useSelector(
    (state) => state.dashboard.medicines
  );

  const [period, setPeriod] = useState("today");

  useEffect(() => {
    if (!doctor?.id) return;

    dispatch(
      loadMedicines({
        doctorId: doctor.id,
        period,
      })
    );
  }, [dispatch, doctor?.id, period]);

  return (
    <div
      onClick={() => navigate("/doctor/medicines-prescribed")}
      className="cursor-pointer"
    >
      <DashboardCard className="px-5 pt-5 pb-3">
        {/* Header */}

        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
            Medicines Prescribed
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
              {medicines?.total ?? 0}
            </h1>

            <p className="mt-1 text-[14px] text-[#7D726B]">
              Total Medicines
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center">
            <FaCapsules
              size={30}
              className="text-[#E4C08D]"
            />
          </div>
        </div>

        <div className="mt-3 mb-2 border-t border-[#EFE4DC]" />

        <div className="grid grid-cols-3">
          {medicines?.breakdown?.map((item, index) => (
            <StatsCard
              key={item.category}
              title={item.category}
              value={item.count}
              border={index !== medicines.breakdown.length - 1}
            />
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default MedicinesPrescribed;