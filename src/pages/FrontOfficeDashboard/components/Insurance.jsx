import {
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import {
  useSelector,
} from "react-redux";

import DashboardCard
  from "../../../components/Dashboard/DashboardCard";
import { useNavigate } from "react-router-dom";


const Insurance = () => {
    const navigate = useNavigate()

  const insurance =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
          .insurance
    );


  return (

    <DashboardCard
      className="
        px-5
        pt-5
        pb-4
      "
      onClick={()=> navigate('/frontoffice/insurance-list')}
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
          Insurance
        </h2>

        <PeriodButton
          label="Today"
        />

      </div>


      <div className="mt-4">

        <h1
          className="
            text-[26px]
            font-bold
            text-[#4B2E2A]
          "
        >
          {insurance?.total_policies ?? 0}
        </h1>

        <p
          className="
            text-[12px]
            text-[#7D726B]
          "
        >
          Total Policies
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
            grid-cols-3
          "
        >

          <Stat
            title="Active Policies"
            value={
              insurance?.active_policies ?? 0
            }
          />

          <Stat
            title="Claims Pending"
            value={
              insurance?.claims_pending ?? 0
            }
          />

          <Stat
            title="Claims Approved"
            value={
              insurance?.claims_approved ?? 0
            }
            last
          />

        </div>

      </div>

    </DashboardCard>

  );
};


const Stat = ({
  title,
  value,
  last,
}) => (

  <div
    className={`
      text-center
      ${
        !last
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


const PeriodButton = ({
  label,
}) => (

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

    {label}

    <span>⌄</span>

  </button>
);


export default Insurance;