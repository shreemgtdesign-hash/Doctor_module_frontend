import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiChevronDown,
} from "react-icons/hi2";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadConsultationHistoryList,
} from "../../../redux/dashboard/dashboardThunk";

const ConsultationHistoryTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const history = useSelector(
    (state) => state.dashboard.consultationHistoryList
  );

  const loading = useSelector(
    (state) => state.dashboard.loading
  );

  const [period, setPeriod] = useState("today");

  const periodLabel = {
    today: "Today",
    week: "This Week",
    month: "This Month",
    all: "Till Date",
  };

  useEffect(() => {
    dispatch(
      loadConsultationHistoryList({
        period,
      })
    );
  }, [dispatch, period]);

  return (
    <DashboardLayout role="doctor">

      {/* =========================================
          PAGE CONTENT
      ========================================= */}

      <div className="min-h-screen bg-[#F8F6F3] px-8 py-6">

        {/* =========================================
            BACK BUTTON
        ========================================= */}

        <button
          type="button"
          onClick={() => navigate("/doctordashboard")}
          className="
            flex
            items-center
            gap-2
            text-[16px]
            font-semibold
            text-[#4D2E23]
            transition
            hover:text-[#7A4A35]
          "
        >
          <HiOutlineArrowLeft size={22} />

          Back to Dashboard
        </button>


        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <div className="mt-8 flex items-center justify-between">

          {/* LEFT */}

          <div>

            <h1 className="
              text-[34px]
              font-bold
              leading-tight
              text-[#2F2F2F]
            ">
              Consultations History
            </h1>

            <p className="
              mt-3
              text-[18px]
              text-[#777777]
            ">
              {loading
                ? "Loading consultations..."
                : `${history.length} Total Consultations`}
            </p>

          </div>


          {/* RIGHT - PERIOD */}

          <div className="relative">

            <div className="
              flex
              h-12
              items-center
              gap-2
              rounded-xl
              border
              border-[#E7DBD3]
              bg-white
              px-4
            ">

              <HiOutlineCalendar
                size={19}
                className="text-[#6A3F2D]"
              />

              <select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value)
                }
                className="
                  appearance-none
                  cursor-pointer
                  bg-transparent
                  pr-7
                  text-[16px]
                  font-medium
                  text-[#4D2E23]
                  outline-none
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

                <option value="all">
                  Till Date
                </option>
              </select>

              <HiChevronDown
                size={17}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  text-[#6A3F2D]
                "
              />

            </div>

          </div>

        </div>


        {/* =========================================
            TABLE
        ========================================= */}

        <div className="
          mt-8
          overflow-hidden
          rounded-[22px]
          border
          border-[#E7DBD3]
          bg-white
        ">

          {/* TABLE HEADER */}

          <div className="
            grid
            grid-cols-[280px_170px_150px_140px_180px_120px_160px]
            border-b
            border-[#EFE2D7]
            bg-[#FFF9F3]
          ">

            <div className="
              border-r
              border-[#EFE2D7]
              px-6
              py-5
              text-[17px]
              font-semibold
              text-[#4D2E23]
            ">
              Patient Details
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
            ">
              Date
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
            ">
              Type
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
            ">
              Time
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
            ">
              Purpose
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
            ">
              Price
            </div>

            <div className="
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
            ">
              Status
            </div>

          </div>


          {/* LOADING */}

          {loading && (
            <div className="
              flex
              h-40
              items-center
              justify-center
              text-[#8A756B]
            ">
              Loading consultations...
            </div>
          )}


          {/* EMPTY */}

          {!loading && history.length === 0 && (
            <div className="
              flex
              h-40
              items-center
              justify-center
              text-[#8A756B]
            ">
              No consultations found for{" "}
              {periodLabel[period]}.
            </div>
          )}


          {/* TABLE BODY */}

          {!loading &&
            history.map((item, index) => (

              <div
                key={
                  item.id ||
                  `${item.patient_id}-${item.date}-${item.time}-${index}`
                }
                className="
                  grid
                  grid-cols-[280px_170px_150px_140px_180px_120px_160px]
                  border-b
                  border-[#EFE2D7]
                  last:border-b-0
                "
              >

                {/* PATIENT */}

                <div className="
                  border-r
                  border-[#EFE2D7]
                  px-6
                  py-5
                ">

                  <h3 className="
                    text-[18px]
                    font-semibold
                    text-[#4D2E23]
                  ">
                    {item.patient_name || "Unknown Patient"}
                  </h3>

                  <p className="
                    mt-1
                    text-[14px]
                    text-[#8A8A8A]
                  ">
                    Patient ID:{" "}
                    {item.patient_id || "N/A"}
                  </p>

                </div>


                {/* DATE */}

                <div className="
                  flex
                  items-center
                  justify-center
                  border-r
                  border-[#EFE2D7]
                  px-6
                  py-5
                ">
                  <p className="
                    text-center
                    text-[16px]
                    font-medium
                    text-[#4D2E23]
                  ">
                    {item.date || "-"}
                  </p>
                </div>


                {/* TYPE */}

                <div className="
                  flex
                  items-center
                  justify-center
                  border-r
                  border-[#EFE2D7]
                  px-6
                  py-5
                ">
                  <p className="
                    text-[16px]
                    font-medium
                    text-[#4D2E23]
                  ">
                    {item.type || "-"}
                  </p>
                </div>


                {/* TIME */}

                <div className="
                  flex
                  items-center
                  justify-center
                  border-r
                  border-[#EFE2D7]
                  px-6
                  py-5
                ">
                  <p className="
                    text-[16px]
                    font-medium
                    text-[#4D2E23]
                  ">
                    {item.time || "-"}
                  </p>
                </div>


                {/* PURPOSE */}

                <div className="
                  flex
                  items-center
                  justify-center
                  border-r
                  border-[#EFE2D7]
                  px-6
                  py-5
                ">
                  <p className="
                    text-center
                    text-[16px]
                    font-medium
                    text-[#4D2E23]
                  ">
                    {item.purpose || "-"}
                  </p>
                </div>


                {/* PRICE */}

                <div className="
                  flex
                  items-center
                  justify-center
                  border-r
                  border-[#EFE2D7]
                  px-6
                  py-5
                ">
                  <p className="
                    text-[17px]
                    font-semibold
                    text-[#4D2E23]
                  ">
                    ₹{item.price ?? 0}
                  </p>
                </div>


                {/* STATUS */}

                <div className="
                  flex
                  items-center
                  justify-center
                  px-6
                  py-5
                ">

                  <span
                    className={`
                      rounded-full
                      px-5
                      py-2
                      text-[14px]
                      font-medium

                      ${
                        item.status === "Completed"
                          ? "bg-[#EAF8EC] text-[#2E6B41]"
                          : item.status === "Cancelled"
                            ? "bg-[#FDECEC] text-[#B42318]"
                            : "bg-[#FFF3E5] text-[#A15C00]"
                      }
                    `}
                  >
                    {item.status || "Pending"}
                  </span>

                </div>

              </div>

            ))}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default ConsultationHistoryTable;