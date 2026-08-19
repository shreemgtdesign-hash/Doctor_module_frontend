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
      className="cursor-pointer"
    >
      <DashboardCard className="p-5">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between">

          <h2 className="text-[18px] font-semibold text-[#4B2E2A]">
            Ailments Addressed
          </h2>

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

        {/* ======================================
            CARDS
        ====================================== */}

        <div className="mt-5 grid grid-cols-3 gap-3">

          {ailmentsList.map((item) => {

            const count =
              categories[item.key] ?? 0;

            return (
              <div
                key={item.key}
                className="
                  relative
                  h-[128px]
                  rounded-[18px]
                  border
                  border-[#EFE4DC]
                  bg-white
                  p-4
                "
              >

                {/* Name */}

                <p className="text-[15px] font-medium text-[#4D2E23]">
                  {item.title}
                </p>

                {/* Count */}

                <p className="mt-3 text-[28px] font-bold leading-none text-[#4D2E23]">
                  {count}
                </p>

                {/* Icon */}

                <div
                  className="
                    absolute
                    bottom-3
                    right-3
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-[13px]
                    bg-[#FFF0E3]
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