import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiChevronDown,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const MedicinePrescribedTable = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F6F3] px-8 py-6">

      {/* Back */}

      <button
        onClick={() => navigate("/doctordashboard")}
        className="flex items-center gap-2 text-[16px] font-semibold text-[#4D2E23] transition hover:text-[#7A4A35]"
      >
        <HiOutlineArrowLeft size={22} />
        Back to Dashboard
      </button>

      {/* Header */}

      <div className="mt-8 flex items-start justify-between">

        <div>
          <h1 className="text-[34px] font-bold text-[#2F2F2F]">
            Medicines Prescribed
          </h1>

          <p className="mt-2 text-[18px] text-[#777777]">
            312 Total Medicines
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

        {/* Header */}

        <div className="grid grid-cols-[280px_170px_250px_290px_220px_140px] border-b border-[#EFE2D7] bg-[#FFF9F3]">

          <div className="border-r border-[#EFE2D7] px-8 py-5 text-[17px] font-semibold text-[#4D2E23]">
            Medicine Details
          </div>

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Category
          </div>

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Manufacturer
          </div>

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Patient Details
          </div>

          <div className="border-r border-[#EFE2D7] px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Date
          </div>

          <div className="px-6 py-5 text-center text-[17px] font-semibold text-[#4D2E23]">
            Price
          </div>

        </div>

        {/* Body */}

        {Array.from({ length: 8 }).map((_, index) => (

          <div
            key={index}
            className="grid grid-cols-[280px_170px_250px_290px_220px_140px] border-b border-[#EFE2D7] last:border-b-0"
          >

            {/* Medicine */}

            <div className="border-r border-[#EFE2D7] px-8 py-6">

              <h3 className="text-[18px] font-semibold text-[#4D2E23]">
                Murivenna Thailam
              </h3>

            </div>

            {/* Category */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-6">

              <p className="text-[17px] font-medium text-[#4D2E23]">
                Thailam
              </p>

            </div>

            {/* Manufacturer */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-6">

              <p className="text-[17px] font-medium text-[#4D2E23] text-center">
                Shree Ayurvedic
              </p>

            </div>

            {/* Patient */}

            <div className="border-r border-[#EFE2D7] px-8 py-6">

              <h3 className="text-[18px] font-semibold text-[#4D2E23]">
                Meera Iyer
              </h3>

              <p className="mt-1 text-[14px] text-[#888888]">
                Patient ID: 1234567
              </p>

            </div>

            {/* Date */}

            <div className="flex items-center justify-center border-r border-[#EFE2D7] px-6 py-6">

              <p className="text-[17px] font-medium text-[#4D2E23]">
                21st June, 2026
              </p>

            </div>

            {/* Price */}

            <div className="flex items-center justify-center px-6 py-6">

              <p className="text-[18px] font-semibold text-[#4D2E23]">
                ₹1200
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default MedicinePrescribedTable;