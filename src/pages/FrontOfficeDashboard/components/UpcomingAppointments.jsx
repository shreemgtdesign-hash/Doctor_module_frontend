import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  HiOutlineCalendarDays,
  HiChevronDown,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import DashboardCard
  from "../../../components/Dashboard/DashboardCard";

import {
  loadFrontOfficeAppointments,
} from "../../../redux/frontOffice/frontOfficeDashboardThunk";


const UpcomingAppointments = ({
  period = "week",
  onPeriodChange,
}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  // ==========================================
  // REDUX DATA
  // ==========================================

  const appointments =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
          .appointments
    );


  const loading =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
          .loading
    );


  // ==========================================
  // LOCAL PERIOD
  // ==========================================

  const [selectedPeriod, setSelectedPeriod] =
    useState(period || "week");


  const [showPeriodMenu, setShowPeriodMenu] =
    useState(false);


  // ==========================================
  // KEEP LOCAL PERIOD IN SYNC WITH PARENT
  // ==========================================

  useEffect(() => {

    if (period) {

      setSelectedPeriod(
        period
      );

    }

  }, [period]);


  // ==========================================
  // LOAD UPCOMING APPOINTMENTS
  // ==========================================

  useEffect(() => {

    dispatch(
      loadFrontOfficeAppointments({
        period: selectedPeriod,
      })
    );

  }, [
    dispatch,
    selectedPeriod,
  ]);


  // ==========================================
  // NORMALIZE API RESPONSE
  // ==========================================

  const data =
    appointments?.data ||
    appointments ||
    {};


  // ==========================================
  // TOTAL
  // ==========================================

  const total =
    data?.total ??
    data?.total_appointments ??
    0;


  // ==========================================
  // GROWTH
  // ==========================================

  const growth =
    data?.growth_percentage ||
    "+0.0%";


  // ==========================================
  // COMPARISON TEXT
  // ==========================================

  const comparisonText =
    data?.comparison_text ||
    "Compared to last week";


  // ==========================================
  // BREAKUP
  // ==========================================

  const breakup =
    data?.breakup ||
    {};


  // ==========================================
  // PERIOD LABEL
  // ==========================================

  const getPeriodLabel = () => {

    switch (selectedPeriod) {

      case "today":
        return "Today";

      case "month":
        return "This Month";

      case "week":
      default:
        return "This Week";

    }

  };


  // ==========================================
  // PERIOD OPTIONS
  // ==========================================

  const periodOptions = [

    {
      value: "today",
      label: "Today",
    },

    {
      value: "week",
      label: "This Week",
    },

    {
      value: "month",
      label: "This Month",
    },

  ];


  // ==========================================
  // CHANGE PERIOD
  // ==========================================

  const handlePeriodChange = (
    nextPeriod
  ) => {

    setSelectedPeriod(
      nextPeriod
    );

    setShowPeriodMenu(
      false
    );


    /*
     * If parent is also maintaining the
     * period, notify it.
     */

    if (onPeriodChange) {

      onPeriodChange(
        nextPeriod
      );

    }

  };


  return (

    <DashboardCard
      className="
        px-5
        pt-5
        pb-4
      "
      onClick={() =>
        navigate(
          "/frontoffice/upcoming-appointments"
        )
      }
    >

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        {/* ======================================= */}
        {/* LEFT SIDE */}
        {/* ======================================= */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >

          {/* TOTAL */}

          <h2
            className="
              shrink-0
              text-[26px]
              font-semibold
              text-[#4B2E2A]
            "
          >
            {Number(total).toLocaleString()}
          </h2>


          {/* TITLE */}

          <span
            className="
              shrink-0
              text-[16px]
              font-semibold
              text-[#4B2E2A]
            "
          >
            Upcoming Appointments
          </span>


          {/* GROWTH */}

          <span
            className="
              shrink-0
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


          {/* COMPARISON */}

          <span
            className="
              truncate
              text-[11px]
              text-[#8A756B]
            "
          >
            {comparisonText}
          </span>

        </div>


        {/* ======================================= */}
        {/* PERIOD DROPDOWN */}
        {/* ======================================= */}

        <div
          className="
            relative
            shrink-0
          "
        >

          <button
            type="button"
            disabled={loading}
            onClick={(event) => {
              event.stopPropagation();

              setShowPeriodMenu(
                (previous) =>
                  !previous
              );
            }}
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
              font-medium
              text-[#4B2E2A]
              transition
              hover:bg-[#FFFAF6]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            <HiOutlineCalendarDays
              size={15}
            />

            {getPeriodLabel()}

            <HiChevronDown
              size={15}
            />

          </button>


          {/* ===================================== */}
          {/* DROPDOWN MENU */}
          {/* ===================================== */}

          {showPeriodMenu && (

            <div
              className="
                absolute
                right-0
                top-[43px]
                z-50
                w-[135px]
                overflow-hidden
                rounded-xl
                border
                border-[#E7DBD3]
                bg-white
                py-1
                shadow-lg
              "
            >

              {periodOptions.map(
                (option) => (

                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      handlePeriodChange(
                        option.value
                      )
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      px-4
                      py-2.5
                      text-left
                      text-[12px]
                      transition
                      hover:bg-[#FFF5ED]

                      ${selectedPeriod ===
                        option.value
                        ? "bg-[#FFF5ED] font-semibold text-[#8A4F32]"
                        : "text-[#4B2E2A]"
                      }
                    `}
                  >
                    {option.label}
                  </button>

                )
              )}

            </div>

          )}

        </div>

      </div>


      {/* ========================================= */}
      {/* DIVIDER */}
      {/* ========================================= */}

      <div
        className="
          my-4
          border-t
          border-[#EFE4DC]
        "
      />


      {/* ========================================= */}
      {/* BREAKUP */}
      {/* ========================================= */}

      <div
        className="
          grid
          grid-cols-6
        "
      >

        <Breakup
          title="In-Person"
          value={
            breakup?.in_person ??
            0
          }
        />


        <Breakup
          title="Video Appt."
          value={
            breakup?.video_appt ??
            0
          }
        />


        <Breakup
          title="Home Visit"
          value={
            breakup?.home_visit ??
            0
          }
        />


        <Breakup
          title="Follow-Up"
          value={
            breakup?.follow_up ??
            0
          }
        />


        <Breakup
          title="Direct Walk-in"
          value={
            breakup?.direct_walk_in ??
            0
          }
        />


        <Breakup
          title="Therapy"
          value={
            breakup?.therapy ??
            0
          }
          last
        />

      </div>


      {/* ========================================= */}
      {/* LOADING */}
      {/* ========================================= */}

      {loading && (

        <div
          className="
            mt-3
            text-right
            text-[10px]
            text-[#8A756B]
          "
        >
          Loading...
        </div>

      )}

    </DashboardCard>

  );
};


// ==========================================
// BREAKUP ITEM
// ==========================================

const Breakup = ({
  title,
  value,
  last,
}) => {

  return (

    <div
      className={`
        px-2
        text-center

        ${!last
          ? "border-r border-[#EFE4DC]"
          : ""
        }
      `}
    >

      <p
        className="
          text-[16px]
          font-medium
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


export default UpcomingAppointments;