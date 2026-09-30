import { useEffect, useState } from "react";
import { FaCapsules } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import DashboardDropdown from "../../../components/Dashboard/DashboardDropdown";

import { loadMedicines } from "../../../redux/dashboard/dashboardThunk";

const MedicinesPrescribed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================
  // DOCTOR
  // ==========================================

  const doctor = useSelector(
    (state) => state.auth.user
  );

  // ==========================================
  // MEDICINES
  // ==========================================

  const medicines = useSelector(
    (state) => state.dashboard.medicines
  );

  // ==========================================
  // PERIOD
  // ==========================================

  const [period, setPeriod] = useState("today");

  // ==========================================
  // LOAD MEDICINES
  // ==========================================

  useEffect(() => {
    if (!doctor?.id) return;

    dispatch(
      loadMedicines({
        doctorId: doctor.id,
        period,
      })
    );
  }, [
    dispatch,
    doctor?.id,
    period,
  ]);

  // ==========================================
  // API DATA
  // ==========================================

  const medicineData =
    medicines?.data ?? medicines ?? {};

  const totalMedicines =
    medicineData?.total_medicines ?? 0;

  const inHouseManufactures =
    medicineData?.in_house_manufactures ?? 0;

  const otherManufacturers =
    medicineData?.other_manufacturers ?? 0;

  return (
    <div
      onClick={() =>
        navigate(
          "/doctor/medicines-prescribed"
        )
      }
      className="cursor-pointer"
    >
      <DashboardCard className="p-5 sm:p-6 hover:shadow-md transition-all">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex items-center justify-between">

          <h2 className="text-[17px] sm:text-[18px] font-semibold text-[#4B2E2A] tracking-tight">
            Medicines Prescribed
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


        {/* ================================= */}
        {/* TOTAL MEDICINES */}
        {/* ================================= */}

        <div className="mt-4 flex items-center justify-between">

          <div>

            <h1 className="text-[28px] sm:text-[32px] font-bold leading-none text-[#4B2E2A]">
              {totalMedicines}
            </h1>

            <p className="mt-1.5 text-[12px] sm:text-[13px] font-medium text-[#7D726B]">
              Total Medicines
            </p>

          </div>


          {/* MEDICINE ICON */}

          <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-[#FFF4EB] border border-[#FFE8D6] text-[#D48A43] shrink-0">

            <FaCapsules
              size={24}
              className="text-[#D48A43]"
            />

          </div>

        </div>


        {/* ================================= */}
        {/* DIVIDER */}
        {/* ================================= */}

        <div className="my-3 sm:my-3.5 border-t border-[#EFE4DC]" />


        {/* ================================= */}
        {/* MANUFACTURER BREAKDOWN */}
        {/* ================================= */}

        <div className="grid grid-cols-2">

          {/* IN-HOUSE */}

          <div className="
            flex
            flex-col
            items-center
            justify-center
            border-r
            border-[#EFE4DC]
            pr-4
            py-1
          ">

            <p className="
              text-center
              text-[11px]
              sm:text-[12px]
              font-semibold
              uppercase
              tracking-wider
              text-[#7D6B63]
            ">
              In-house Manufactures
            </p>

            <p className="
              mt-1
              text-[18px]
              sm:text-[20px]
              font-bold
              leading-tight
              text-[#4B2E2A]
            ">
              {inHouseManufactures}
            </p>

          </div>


          {/* OTHER */}

          <div className="
            flex
            flex-col
            items-center
            justify-center
            pl-4
            py-1
          ">

            <p className="
              text-center
              text-[11px]
              sm:text-[12px]
              font-semibold
              uppercase
              tracking-wider
              text-[#7D6B63]
            ">
              Other Manufacturers
            </p>

            <p className="
              mt-1
              text-[18px]
              sm:text-[20px]
              font-bold
              leading-tight
              text-[#4B2E2A]
            ">
              {otherManufacturers}
            </p>

          </div>

        </div>

      </DashboardCard>
    </div>
  );
};

export default MedicinesPrescribed;