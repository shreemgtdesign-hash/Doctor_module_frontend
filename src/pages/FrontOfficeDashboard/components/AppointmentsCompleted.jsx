import {
  HiOutlineCalendarDays,
  HiChevronDown,
} from "react-icons/hi2";

import {
  useSelector,
} from "react-redux";

import DashboardCard
  from "../../../components/Dashboard/DashboardCard";


const AppointmentsCompleted = ({
  period,
  onPeriodChange,
}) => {

  const appointments =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
          .appointments
    );


  const data =
    appointments?.data ||
    appointments;


  const total =
    data?.total ?? 0;

  const growth =
    data?.growth_percentage ||
    "+0.0%";

  const breakup =
    data?.breakup || {};


  return (

    <DashboardCard
      className="
        px-5
        pt-5
        pb-4
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <h2
            className="
              text-[26px]
              font-semibold
              text-[#4B2E2A]
            "
          >
            {total.toLocaleString()}
          </h2>

          <span
            className="
              text-[16px]
              font-semibold
              text-[#4B2E2A]
            "
          >
            Appointments Completed
            This Week
          </span>

          <span
            className="
              rounded-md
              bg-[#EAFBEF]
              px-2
              py-1
              text-[11px]
              font-semibold
              text-green-600
            "
          >
            {growth}
          </span>

          <span
            className="
              text-[11px]
              text-[#8A756B]
            "
          >
            Compared to last week
          </span>

        </div>


        {/* Period */}

        <button
          type="button"
          className="
            flex
            h-9
            items-center
            gap-2
            rounded-lg
            border
            border-[#E7DBD3]
            bg-white
            px-3
            text-[12px]
            text-[#4B2E2A]
          "
        >

          <HiOutlineCalendarDays
            size={15}
          />

          This Week

          <HiChevronDown
            size={15}
          />

        </button>

      </div>


      {/* Divider */}

      <div
        className="
          my-4
          border-t
          border-[#EFE4DC]
        "
      />


      {/* Breakup */}

      <div
        className="
          grid
          grid-cols-6
        "
      >

        <Breakup
          title="In-Person"
          value={
            breakup.in_person ?? 0
          }
        />

        <Breakup
          title="Video Appt."
          value={
            breakup.video_appt ?? 0
          }
        />

        <Breakup
          title="Home Visit"
          value={
            breakup.home_visit ?? 0
          }
        />

        <Breakup
          title="Follow-Up"
          value={
            breakup.follow_up ?? 0
          }
        />

        <Breakup
          title="Direct Walk-in"
          value={
            breakup.direct_walk_in ?? 0
          }
        />

        <Breakup
          title="Therapy"
          value={
            breakup.therapy ?? 0
          }
          last
        />

      </div>

    </DashboardCard>
  );
};


const Breakup = ({
  title,
  value,
  last,
}) => {

  return (

    <div
      className={`
        text-center
        px-2
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
};


export default AppointmentsCompleted;