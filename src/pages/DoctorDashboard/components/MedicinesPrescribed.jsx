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
      <DashboardCard className="px-5 pt-5 pb-3">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex items-center justify-between">

          <h2 className="
            text-[18px]
            font-semibold
            text-[#4B2E2A]
          ">
            Medicines Prescribed
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


        {/* ================================= */}
        {/* TOTAL MEDICINES */}
        {/* ================================= */}

        <div className="
          mt-4
          flex
          items-start
          justify-between
        ">

          <div>

            <h1 className="
              text-[28px]
              font-bold
              leading-none
              text-[#4B2E2A]
            ">
              {totalMedicines}
            </h1>

            <p className="
              mt-2
              text-[12px]
              text-[#7D726B]
            ">
              Total Medicines
            </p>

          </div>


          {/* MEDICINE ICON */}

          <div className="
            flex
            h-[76px]
            w-[76px]
            items-center
            justify-center
            mr-1
          ">

            <FaCapsules
              size={48}
              className="text-[#E4C08D]"
            />

          </div>

        </div>


        {/* ================================= */}
        {/* DIVIDER */}
        {/* ================================= */}

        <div className="
          mt-4
          border-t
          border-[#EFE4DC]
        " />


        {/* ================================= */}
        {/* MANUFACTURER BREAKDOWN */}
        {/* ================================= */}

        <div className="
          mt-3
          grid
          grid-cols-2
        ">

          {/* IN-HOUSE */}

          <div className="
            flex
            flex-col
            items-center
            justify-center
            border-r
            border-[#EFE4DC]
            pr-4
            mt-4
          ">

            <p className="
              text-center
              text-[17px]
              font-medium
              text-[#4B2E2A]
            ">
              In-house Manufactures
            </p>

            <p className="
              mt-2
              text-[16px]
              font-bold
              leading-none
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
          ">

            <p className="
              text-center
              text-[17px]
              font-medium
              text-[#4B2E2A]
            ">
              Other Manufacturers
            </p>

            <p className="
              mt-2
              text-[16px]
              font-bold
              leading-none
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