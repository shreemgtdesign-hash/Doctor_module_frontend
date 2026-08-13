import { useEffect, useState } from "react";

import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiChevronDown,
} from "react-icons/hi2";

import {
  FaHeartbeat,
  FaBone,
  FaBrain,
  FaLungs,
  FaEllipsisH,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadAilments,
  loadAilmentsList,
} from "../../../redux/dashboard/dashboardThunk";

const AilmentsAddressedTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [period, setPeriod] = useState("week");

  const {
    ailments,
    ailmentsHistory,
  } = useSelector(
    (state) => state.dashboard
  );

  // ==========================================
  // Load APIs
  // ==========================================

  useEffect(() => {
    dispatch(
      loadAilments({
        period,
      })
    );

    dispatch(
      loadAilmentsList({
        period,
      })
    );
  }, [dispatch, period]);


  // ==========================================
  // Summary Categories
  // ==========================================

  const categories =
    ailments?.categories || {};


  const cards = [
    {
      title: "All",
      key: "all",
      icon: <FaEllipsisH />,
    },

    {
      title: "Diabetes",
      key: "diabetes",
      icon: <FaHeartbeat />,
    },

    {
      title: "Orthopedics",
      key: "orthopedics",
      icon: <FaBone />,
    },

    {
      title: "Cardiac",
      key: "cardiac",
      icon: <FaHeartbeat />,
    },

    {
      title: "Neurological",
      key: "neurological",
      icon: <FaBrain />,
    },

    {
      title: "Skin",
      key: "skin",
      icon: <FaHeartbeat />,
    },

    {
      title: "Respiratory",
      key: "respiratory",
      icon: <FaLungs />,
    },

    {
      title: "Digestive",
      key: "digestive",
      icon: <FaHeartbeat />,
    },

    {
      title: "Pediatric",
      key: "pediatric",
      icon: <FaHeartbeat />,
    },

    {
      title: "Other",
      key: "other",
      icon: <FaEllipsisH />,
    },
  ];


  // ==========================================
  // Period Label
  // ==========================================

  const periodLabel = {
    today: "Today",
    week: "This Week",
    month: "This Month",
  };


  return (
    <DashboardLayout role="doctor">

      <div className="min-h-screen bg-[#F8F6F3] px-8 py-6">

        {/* ================================= */}
        {/* Back */}
        {/* ================================= */}

        <button
          type="button"
          onClick={() =>
            navigate("/doctordashboard")
          }
          className="
            flex
            items-center
            gap-2
            text-[16px]
            font-semibold
            text-[#4D2E23]
            hover:text-[#7A4A35]
          "
        >
          <HiOutlineArrowLeft size={22} />

          Back to Dashboard
        </button>


        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <div className="mt-10 flex items-start justify-between">

          <div>

            <h1 className="text-[28px] font-bold text-[#2F2F2F]">
              Ailments Addressed
            </h1>

            <p className="mt-1 text-[18px] text-[#777]">
              {ailments?.total_consultations ?? 0} Total Consultations
            </p>

          </div>


          {/* Period */}
          <div className="relative">

            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value)
              }
              className="
                h-12
                appearance-none
                rounded-xl
                border
                border-[#E8D9CD]
                bg-white
                py-0
                pl-12
                pr-12
                text-[16px]
                font-medium
                text-[#4D2E23]
                outline-none
                cursor-pointer
              "
            >
              <option value="today">
                Today
              </option>

              <option value="week">
                This Week
              </option>

              <option value="month">
                This Month
              </option>
            </select>

            <HiOutlineCalendar
              size={18}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#6A3F2D]
              "
            />

            <HiChevronDown
              size={16}
              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[#6A3F2D]
              "
            />

          </div>

        </div>


        {/* ================================= */}
        {/* Summary Cards */}
        {/* ================================= */}

        <div className="mt-8 grid grid-cols-5 gap-4">

          {cards.map((card, index) => (

            <div
              key={card.key}
              className={`
                rounded-2xl
                border
                bg-white
                p-5
                transition-all

                ${
                  index === 0
                    ? "border-2 border-[#4D2E23]"
                    : "border-[#E7DBD3]"
                }
              `}
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[14px] text-[#4D2E23]">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-[22px] font-bold text-[#4D2E23]">
                    {categories?.[card.key] ?? 0}
                  </h2>

                </div>


                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#FFF1E5]
                    text-[#7A4A35]
                  "
                >
                  {card.icon}
                </div>

              </div>

            </div>

          ))}

        </div>


        {/* ================================= */}
        {/* Table */}
        {/* ================================= */}

        <div className="
          mt-8
          overflow-hidden
          rounded-[28px]
          border
          border-[#E7DBD3]
          bg-white
        ">

          {/* Table Header */}

          <div
            className="
              grid
              grid-cols-[1.1fr_1.6fr_1.3fr_1fr_1.2fr_1fr]
              bg-[#FFF9F3]
            "
          >

            {[
              "Ailment",
              "Patient Details",
              "Date",
              "Time",
              "Purpose",
              "Price",
            ].map((item) => (

              <div
                key={item}
                className="
                  border-r
                  border-b
                  border-[#EFE2D7]
                  px-6
                  py-5
                  text-center
                  text-[15px]
                  font-semibold
                  text-[#4D2E23]
                  last:border-r-0
                "
              >
                {item}
              </div>

            ))}

          </div>


          {/* Table Rows */}

          {ailmentsHistory.length > 0 ? (

            ailmentsHistory.map((row, index) => (

              <div
                key={`${row.patient_id}-${row.date}-${index}`}
                className="
                  grid
                  grid-cols-[1.1fr_1.6fr_1.3fr_1fr_1.2fr_1fr]
                "
              >

                {/* Ailment */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    border-r
                    border-[#EFE2D7]
                    px-6
                    py-6
                    text-[16px]
                    font-semibold
                    text-[#4D2E23]
                  "
                >
                  {row.ailment || "-"}
                </div>


                {/* Patient */}

                <div
                  className="
                    border-r
                    border-[#EFE2D7]
                    px-6
                    py-6
                  "
                >

                  <h3 className="text-[16px] font-bold text-[#4D2E23]">
                    {row.patient_name || "Unknown Patient"}
                  </h3>

                  <p className="mt-1 text-[14px] text-[#7C7C7C]">
                    Patient ID: {row.patient_id || "-"}
                  </p>

                </div>


                {/* Date */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    border-r
                    border-[#EFE2D7]
                    px-6
                    py-6
                    text-[16px]
                    font-semibold
                    text-[#4D2E23]
                  "
                >
                  {row.date || "-"}
                </div>


                {/* Time */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    border-r
                    border-[#EFE2D7]
                    px-6
                    py-6
                    text-[16px]
                    font-semibold
                    text-[#4D2E23]
                  "
                >
                  {row.time || "-"}
                </div>


                {/* Purpose */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    border-r
                    border-[#EFE2D7]
                    px-6
                    py-6
                    text-[16px]
                    font-semibold
                    text-[#4D2E23]
                  "
                >
                  {row.purpose || "-"}
                </div>


                {/* Price */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    px-6
                    py-6
                    text-[16px]
                    font-bold
                    text-[#4D2E23]
                  "
                >
                  ₹
                  {Number(
                    row.price || 0
                  ).toLocaleString("en-IN")}
                </div>

              </div>

            ))

          ) : (

            <div className="flex min-h-[250px] items-center justify-center">

              <p className="text-[#7C7C7C]">
                No ailments found for{" "}
                {periodLabel[period]?.toLowerCase() || period}.
              </p>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default AilmentsAddressedTable;