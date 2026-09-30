import { useEffect, useState } from "react";
import {
  FaHeartbeat,
  FaLungs,
  FaBrain,
  FaBone,
  FaLeaf,
  FaChild,
  FaEllipsisH,
  FaHandSparkles,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";

import { loadAilments } from "../../../redux/dashboard/dashboardThunk";

const AilmentsAddressed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================
  // AUTH
  // ==========================================

  const doctor = useSelector(
    (state) => state.auth.user
  );

  // ==========================================
  // REDUX DATA
  // ==========================================

  const ailments = useSelector(
    (state) => state.dashboard.ailments
  );

  const [period, setPeriod] = useState("week");

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    if (!doctor?.id) return;

    dispatch(
      loadAilments({
        doctorId: doctor.id,
        period,
      })
    );
  }, [dispatch, doctor?.id, period]);

  // ==========================================
  // DEBUG
  // ==========================================

  console.log(
    "Ailments Redux State:",
    ailments
  );

  // ==========================================
  // HANDLE BOTH POSSIBLE DATA STRUCTURES
  // ==========================================

  const categories =
    ailments?.data?.categories ??
    ailments?.categories ??
    ailments?.data?.data?.categories ??
    {};

  console.log(
    "Ailments Categories:",
    categories
  );

  // ==========================================
  // AILMENT CONFIGURATION
  // ==========================================

  const ailmentsList = [
    {
      key: "diabetes",
      title: "Diabetes",
      icon: (
        <FaHeartbeat
          size={24}
          className="text-[#5B3428]"
        />
      ),
    },

    {
      key: "orthopedics",
      title: "Orthopedics",
      icon: (
        <FaBone
          size={24}
          className="text-[#5B3428]"
        />
      ),
    },

    {
      key: "cardiac",
      title: "Cardiac",
      icon: (
        <FaHeartbeat
          size={24}
          className="text-[#5B3428]"
        />
      ),
    },

    {
      key: "neurological",
      title: "Neurological",
      icon: (
        <FaBrain
          size={24}
          className="text-[#5B3428]"
        />
      ),
    },

    {
      key: "skin",
      title: "Skin",
      icon: (
        <FaHandSparkles
          size={24}
          className="text-[#5B3428]"
        />
      ),
    },

    {
      key: "respiratory",
      title: "Respiratory",
      icon: (
        <FaLungs
          size={24}
          className="text-[#5B3428]"
        />
      ),
    },

    {
      key: "digestive",
      title: "Digestive",
      icon: (
        <FaLeaf
          size={24}
          className="text-[#5B3428]"
        />
      ),
    },

    {
      key: "pediatric",
      title: "Pediatric",
      icon: (
        <FaChild
          size={24}
          className="text-[#5B3428]"
        />
      ),
    },

    {
      key: "other",
      title: "Other",
      icon: (
        <FaEllipsisH
          size={24}
          className="text-[#5B3428]"
        />
      ),
    },
  ];

  // ==========================================
  // PERIOD LABEL
  // ==========================================

  return (
    <div
      onClick={() =>
        navigate("/doctor/ailments-addressed")
      }
      className="cursor-pointer h-full"
    >
      <DashboardCard className="p-5 sm:p-6 hover:shadow-md transition-all h-full flex flex-col justify-between">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between">

          <h2 className="text-[17px] sm:text-[18px] font-semibold text-[#4B2E2A] tracking-tight">
            Ailments Addressed
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

        {/* ======================================
            CARDS GRID
        ====================================== */}

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3 flex-1">

          {ailmentsList.map((item) => {

            const count =
              categories[item.key] ?? 0;

            return (
              <div
                key={item.key}
                className="
                  relative
                  min-h-[105px]
                  sm:min-h-[114px]
                  rounded-2xl
                  border
                  border-[#EFE4DC]
                  bg-[#FDFAF7]
                  hover:bg-[#FFF8F2]
                  hover:border-[#DFC4B2]
                  transition-all
                  p-3
                  sm:p-3.5
                  flex
                  flex-col
                  justify-between
                "
              >

                {/* Name */}

                <p className="text-[13px] sm:text-[14px] font-semibold text-[#5B3428] truncate pr-2">
                  {item.title}
                </p>

                {/* Count */}

                <p className="text-[24px] sm:text-[26px] font-bold leading-none text-[#4A2818]">
                  {count}
                </p>

                {/* Icon */}

                <div
                  className="
                    absolute
                    bottom-3
                    right-3
                    flex
                    h-9
                    w-9
                    sm:h-10
                    sm:w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#FFF0E3]
                    text-[#6A3F2D]
                  "
                >
                  {item.icon}
                </div>

              </div>
            );
          })}

        </div>

      </DashboardCard>
    </div>
  );
};

export default AilmentsAddressed;