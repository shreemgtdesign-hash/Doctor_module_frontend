import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiChevronDown,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadConsultationHistoryList } from "../../../redux/dashboard/dashboardThunk";
const ConsultationHistoryTable = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const doctor = useSelector((state) => state.auth.user);

  const history = useSelector(
    (state) => state.dashboard.consultationHistoryList
  );

  const [period, setPeriod] = useState("today");
  const periodLabel = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  all: "Till Date",
}[period] || "Today";
  useEffect(() => {
    if (doctor?.id) {
      dispatch(
        loadConsultationHistoryList({
          doctorId: doctor.id,
          period,
        })
      );
    }
  }, [dispatch, doctor, period]);
  return (
    <div className="min-h-screen bg-[#F8F6F3] px-8 py-6">

      {/* Back Button */}

      <button
        onClick={() => navigate("/doctordashboard")}
        className="flex items-center gap-2 text-[16px] font-semibold text-[#4D2E23] hover:text-[#7A4A35]">
        <HiOutlineArrowLeft size={22} />
        Back to Dashboard
      </button>

      {/* Header */}

      <div className="mt-8 flex items-start justify-between">

        <div>
          <h1 className="text-[34px] font-bold leading-none text-[#2F2F2F]">
            Consultations History
          </h1>

          <p className="mt-3 text-[18px] text-[#777777]">
            {history.length} Total Consultations
          </p>
        </div>

        <select
  value={period}
  onChange={(e) => setPeriod(e.target.value)}
  className="h-11 rounded-xl border border-[#E7DBD3] bg-white px-4 text-[16px] font-medium text-[#4D2E23] outline-none"
>
  <option value="today">Today</option>
  <option value="week">This Week</option>
  <option value="month">This Month</option>
  <option value="all">Till Date</option>
</select>

      </div>

      {/* Table */}

      <div className="mt-8 overflow-hidden rounded-[22px] border border-[#E7DBD3] bg-white">

        {/* Table Header */}

        <div className="grid grid-cols-[280px_170px_150px_140px_180px_120px_160px] bg-[#FFF9F3] border-b border-[#EFE2D7]">

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-[17px] font-semibold text-[#4D2E23]">
            Patient Details
          </div>

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Date
          </div>

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Type
          </div>

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Time
          </div>

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Purpose
          </div>

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Price
          </div>

          <div className="px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Status
          </div>

        </div>

        {/* Table Body */}

        {history.map((item) => (

          <div
            key={item.id}
            className="grid grid-cols-[280px_170px_150px_140px_180px_120px_160px] border-b border-[#EFE2D7] last:border-b-0"
          >

            {/* Patient */}

            <div className="border-r border-[#EFE2D7] px-6 py-5">

              <h3 className="text-[18px] font-semibold text-[#4D2E23]">
                {item.patient_name}
              </h3>

              <p className="mt-1 text-[14px] text-[#8A8A8A]">
                Patient ID: {item.patient_id}
              </p>

            </div>

            {/* Date */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[16px] font-medium text-[#4D2E23] text-center">
                {item.date}
              </p>

            </div>

            {/* Type */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[16px] font-medium text-[#4D2E23]">
                {item.type}
              </p>

            </div>

            {/* Time */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[16px] font-medium text-[#4D2E23]">
                {item.time}
              </p>

            </div>

            {/* Purpose */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[16px] font-medium text-[#4D2E23]">
                {item.purpose}
              </p>

            </div>

            {/* Price */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[17px] font-semibold text-[#4D2E23]">
                ₹{item.price}
              </p>

            </div>

            {/* Status */}

            <div className="flex items-center justify-center px-6 py-5">

              <span
                className={`rounded-full px-5 py-2 text-[14px] font-medium ${item.status === "Completed"
                    ? "bg-[#EAF8EC] text-[#2E6B41]"
                    : item.status === "Cancelled"
                      ? "bg-[#FDECEC] text-[#B42318]"
                      : "bg-[#FFF3E5] text-[#A15C00]"
                  }`}
              >
                {item.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ConsultationHistoryTable;