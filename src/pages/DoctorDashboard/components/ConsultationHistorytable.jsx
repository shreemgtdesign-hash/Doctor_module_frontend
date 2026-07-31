import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiChevronDown,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const ConsultationHistoryTable = () => {
  const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-[#F8F6F3] px-8 py-6">

      {/* Back Button */}

      <button 
      onClick={() => navigate("/")}
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
            204 Total Consultations
          </p>
        </div>

        <button className="flex h-11 items-center gap-2 rounded-xl border border-[#E7DBD3] bg-white px-5 text-[16px] font-medium text-[#4D2E23]">
          <HiOutlineCalendar size={18} />
          This Week
          <HiChevronDown size={18} />
        </button>

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

        {Array.from({ length: 8 }).map((_, index) => (

          <div
            key={index}
            className="grid grid-cols-[280px_170px_150px_140px_180px_120px_160px] border-b border-[#EFE2D7] last:border-b-0"
          >

            {/* Patient */}

            <div className="border-r border-[#EFE2D7] px-6 py-5">

              <h3 className="text-[18px] font-semibold text-[#4D2E23]">
                Meera Iyer
              </h3>

              <p className="mt-1 text-[14px] text-[#8A8A8A]">
                Patient ID: 1234567
              </p>

            </div>

            {/* Date */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[16px] font-medium text-[#4D2E23] text-center">
                21st June, 2026
              </p>

            </div>

            {/* Type */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[16px] font-medium text-[#4D2E23]">
                In Person
              </p>

            </div>

            {/* Time */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[16px] font-medium text-[#4D2E23]">
                10:00 AM
              </p>

            </div>

            {/* Purpose */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[16px] font-medium text-[#4D2E23]">
                Consultation
              </p>

            </div>

            {/* Price */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-5">

              <p className="text-[17px] font-semibold text-[#4D2E23]">
                ₹1200
              </p>

            </div>

            {/* Status */}

            <div className="flex items-center justify-center px-6 py-5">

              <span className="rounded-full bg-[#EAF8EC] px-5 py-2 text-[14px] font-medium text-[#2E6B41]">
                Completed
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ConsultationHistoryTable;