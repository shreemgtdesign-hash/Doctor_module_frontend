import {
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import {
  useSelector,
} from "react-redux";

import DashboardCard
  from "../../../components/Dashboard/DashboardCard";
import { useNavigate } from "react-router-dom";


const Packages = () => {
 const navigate = useNavigate()
  const packages =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
          .packages
    );


  return (

    <DashboardCard
      className="
        px-5
        pt-5
        pb-4
      "
       onClick={()=> navigate('/frontoffice/packages-list')}
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h2
          className="
            text-[17px]
            font-semibold
            text-[#4B2E2A]
          "
        >
          Packages
        </h2>

        <PeriodButton />

      </div>


      <div className="mt-4">

        <h1
          className="
            text-[26px]
            font-bold
            text-[#4B2E2A]
          "
        >
          {packages?.total_packages ?? 0}
        </h1>

        <p
          className="
            text-[12px]
            text-[#7D726B]
          "
        >
          Total Packages
        </p>

      </div>


      <div
        className="
          mt-4
          border-t
          border-[#EFE4DC]
          pt-3
        "
      >

        <div
          className="
            grid
            grid-cols-2
          "
        >

          <Stat
            title="Active Packages"
            value={
              packages?.active_packages ?? 0
          }
          border
          />

          <Stat
            title="Expiring this month"
            value={
              packages?.expiring_this_month ?? 0
            }
          />

        </div>

      </div>

    </DashboardCard>

  );
};


const Stat = ({
  title,
  value,
  border,
}) => (

  <div
    className={`
      text-center
      ${
        border
          ? "border-r border-[#EFE4DC]"
          : ""
      }
    `}
  >

    <p
      className="
        text-[12px]
        text-[#4B2E2A]
      "
    >
      {title}
    </p>

    <p
      className="
        mt-1
        text-[16px]
        font-bold
        text-[#4B2E2A]
      "
    >
      {value}
    </p>

  </div>
);


const PeriodButton = () => (

  <button
    type="button"
    className="
      flex
      items-center
      gap-2
      rounded-lg
      border
      border-[#E7DBD3]
      px-3
      py-2
      text-[12px]
      text-[#4B2E2A]
    "
  >

    <HiOutlineCalendarDays
      size={14}
    />

    Till Date

    <span>⌄</span>

  </button>

);


export default Packages;