import { useEffect, useState } from "react";
import { HiOutlineHeart } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";
import { loadWellness } from "../../../redux/dashboard/dashboardThunk";

const Wellness = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doctor = useSelector(
    (state) => state.auth.user
  );

  const wellness = useSelector(
    (state) => state.dashboard.wellness
  );

  const [period, setPeriod] = useState("today");

  useEffect(() => {
    if (!doctor?.id) return;

    dispatch(
      loadWellness({
        doctorId: doctor.id,
        period,
      })
    );
  }, [
    dispatch,
    doctor?.id,
    period,
  ]);

  return (
    <div
      onClick={() =>
        navigate("/doctor/wellness-table")
      }
      className="cursor-pointer"
    >
      <DashboardCard className="p-5 sm:p-6 hover:shadow-md transition-all">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex items-center justify-between">

          <h2 className="text-[17px] sm:text-[18px] font-semibold text-[#4B2E2A] tracking-tight">
            Wellness
          </h2>

          {/* Prevent card navigation when using dropdown */}

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
          >
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
                {
                  label: "Till Date",
                  value: "till_date",
                },
              ]}
              onChange={setPeriod}
            />
          </div>

        </div>

        {/* ================================= */}
        {/* CONTENT */}
        {/* ================================= */}

        <div className="mt-4 flex items-center justify-between">

          <div>

            <h1 className="text-[28px] sm:text-[32px] font-bold leading-none text-[#4B2E2A]">
              {wellness?.total_consultations ?? 0}
            </h1>

            <p className="mt-1.5 text-[12px] sm:text-[13px] font-medium text-[#7D726B]">
              Total Consultations{" "}
              {wellness?.period
                ? ` - ${wellness.period}`
                : ""}
            </p>

          </div>

          {/* Wellness Icon Badge */}

          <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-[#FFF4EB] border border-[#FFE8D6] text-[#D48A43] shrink-0">

            <HiOutlineHeart
              size={26}
              className="text-[#D48A43]"
            />

          </div>

        </div>

      </DashboardCard>
    </div>
  );
};

export default Wellness;