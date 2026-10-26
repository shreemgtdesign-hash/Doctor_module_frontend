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

      <div className="min-h-screen bg-[#F8F6F3] dark:bg-[#181513] px-8 py-6">

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
            dark:text-[#EDE3DA]
            transition
            hover:text-[#7A4A35]
            dark:hover:text-white
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
              text-[28px]
              font-bold
              text-[#2F2F2F]
              dark:text-white
            ">
              Consultation History
            </h1>

            <p className="
              mt-2
              text-[15px]
              font-medium
              text-[#777777]
              dark:text-[#A8988D]
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
              dark:border-[#382E28]
              bg-white
              dark:bg-[#1D1714]
              px-4
            ">

              <HiOutlineCalendar
                size={19}
                className="text-[#6A3F2D] dark:text-[#E59850]"
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
                  dark:text-white
                  outline-none
                "
              >
                <option value="today" className="bg-white dark:bg-[#1D1714] text-[#4D2E23] dark:text-white">
                  Today
                </option>

                <option value="week" className="bg-white dark:bg-[#1D1714] text-[#4D2E23] dark:text-white">
                  This Week
                </option>

                <option value="month" className="bg-white dark:bg-[#1D1714] text-[#4D2E23] dark:text-white">
                  This Month
                </option>

                <option value="all" className="bg-white dark:bg-[#1D1714] text-[#4D2E23] dark:text-white">
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
                  dark:text-[#E59850]
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
          dark:border-[#382E28]
          bg-white
          dark:bg-[#241E1B]
        ">

          {/* TABLE HEADER */}

          <div className="
            grid
            grid-cols-[280px_170px_150px_140px_180px_120px_160px]
            border-b
            border-[#EFE2D7]
            dark:border-[#382E28]
            bg-[#FFF9F3]
            dark:bg-[#2C231F]
          ">

            <div className="
              border-r
              border-[#EFE2D7]
              dark:border-[#382E28]
              px-6
              py-5
              text-[17px]
              font-semibold
              text-[#4D2E23]
              dark:text-white
            ">
              Patient Details
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              dark:border-[#382E28]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
              dark:text-white
            ">
              Date
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              dark:border-[#382E28]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
              dark:text-white
            ">
              Type
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              dark:border-[#382E28]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
              dark:text-white
            ">
              Time
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              dark:border-[#382E28]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
              dark:text-white
            ">
              Purpose
            </div>

            <div className="
              border-r
              border-[#EFE2D7]
              dark:border-[#382E28]
              px-6
              py-5
              text-center
              text-[17px]
              font-semibold
              text-[#4D2E23]
              dark:text-white
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
              dark:text-white
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
                  dark:border-[#382E28]
                  last:border-b-0
                  hover:bg-[#FFF9F5]
                  dark:hover:bg-[#2C231F]
                  transition
                "
              >

                {/* PATIENT */}

                <div className="
                  border-r
                  border-[#EFE2D7]
                  dark:border-[#382E28]
                  px-6
                  py-5
                ">

                  <h3 className="
                    text-[18px]
                    font-semibold
                    text-[#4D2E23]
                    dark:text-white
                  ">
                    {item.patient_name || "Unknown Patient"}
                  </h3>

                  <p className="
                    mt-1
                    text-[14px]
                    text-[#8A8A8A]
                    dark:text-[#A8988D]
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
                  dark:border-[#382E28]
                  px-6
                  py-5
                ">
                  <p className="
                    text-center
                    text-[16px]
                    font-medium
                    text-[#4D2E23]
                    dark:text-[#EDE3DA]
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
                  dark:border-[#382E28]
                  px-6
                  py-5
                ">
                  <p className="
                    text-[16px]
                    font-medium
                    text-[#4D2E23]
                    dark:text-[#EDE3DA]
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
                  dark:border-[#382E28]
                  px-6
                  py-5
                ">
                  <p className="
                    text-[16px]
                    font-medium
                    text-[#4D2E23]
                    dark:text-[#EDE3DA]
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
                  dark:border-[#382E28]
                  px-6
                  py-5
                ">
                  <p className="
                    text-center
                    text-[16px]
                    font-medium
                    text-[#4D2E23]
                    dark:text-[#EDE3DA]
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
                  dark:border-[#382E28]
                  px-6
                  py-5
                ">
                  <p className="
                    text-[17px]
                    font-semibold
                    text-[#4D2E23]
                    dark:text-white
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
                          ? "bg-[#EAF8EC] dark:bg-[#163321] text-[#2E6B41] dark:text-[#4ADE80] border border-transparent dark:border-[#1E462D]"
                          : item.status === "Cancelled"
                            ? "bg-[#FDECEC] dark:bg-[#3D1418] text-[#B42318] dark:text-[#F87171] border border-transparent dark:border-[#5C1D24]"
                            : "bg-[#FFF3E5] dark:bg-[#382414] text-[#A15C00] dark:text-[#FBBF24] border border-transparent dark:border-[#4A301A]"
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