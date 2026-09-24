import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";



import CalendarView from "./CalendarView";
import EventListView from "./EventListView";
import { loadCorporateEvents } from "../../../../redux/corporate/corporateDashboardThunk";


const getMonthLabel = (
  date
) => {
  return date.toLocaleString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );
};


const UpcomingEvents = () => {

  const dispatch = useDispatch();


  const {
    events = [],
    eventsLoading,
    eventsError,
  } = useSelector(
    (state) =>
      state.corporateDashboard
  );


  const [activeView, setActiveView] =
    useState("calendar");


  const [monthDate, setMonthDate] =
    useState(() => new Date());


  // ==========================================
  // LOAD EVENTS
  // ==========================================

  useEffect(() => {

    const month =
      getMonthLabel(monthDate);

    dispatch(
      loadCorporateEvents(month)
    );

  }, [
    dispatch,
    monthDate,
  ]);


  // ==========================================
  // MONTH NAVIGATION
  // ==========================================

  const previousMonth = () => {

    setMonthDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  };


  const nextMonth = () => {

    setMonthDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };


  const goToToday = () => {

    setMonthDate(
      new Date()
    );
  };


  return (
    <section className="mt-8">

      {/* HEADER */}

      <h2
        className="
          text-[18px]
          font-semibold
          text-[#252525]
        "
      >
        Upcoming Events
      </h2>


      {/* TABS */}

      <div
        className="
          mt-5
          flex
          border-b
          border-[#EDE4DD]
        "
      >

        <button
          type="button"
          onClick={() =>
            setActiveView("calendar")
          }
          className={`
            px-5
            pb-3
            text-[14px]
            font-semibold
            transition

            ${
              activeView === "calendar"
                ? `
                  border-b-2
                  border-[#5A3224]
                  text-[#4D2E23]
                `
                : `
                  text-[#B4AAA4]
                `
            }
          `}
        >
          Calendar view
        </button>


        <button
          type="button"
          onClick={() =>
            setActiveView("list")
          }
          className={`
            px-5
            pb-3
            text-[14px]
            font-semibold
            transition

            ${
              activeView === "list"
                ? `
                  border-b-2
                  border-[#5A3224]
                  text-[#4D2E23]
                `
                : `
                  text-[#B4AAA4]
                `
            }
          `}
        >
          List View
        </button>

      </div>


      {/* ERROR */}

      {eventsError && (
        <div
          className="
            mt-5
            rounded-xl
            bg-red-50
            p-4
            text-sm
            text-red-600
          "
        >
          {typeof eventsError ===
          "string"
            ? eventsError
            : "Failed to load events."}
        </div>
      )}


      {/* LOADING */}

      {eventsLoading ? (

        <div
          className="
            flex
            min-h-[300px]
            items-center
            justify-center
            text-sm
            text-[#8B7A70]
          "
        >
          Loading events...
        </div>

      ) : activeView ===
        "calendar" ? (

        <CalendarView
          monthDate={monthDate}
          events={events}
          onPreviousMonth={
            previousMonth
          }
          onNextMonth={
            nextMonth
          }
          onToday={
            goToToday
          }
        />

      ) : (

        <EventListView
          monthDate={monthDate}
          events={events}
          onPreviousMonth={
            previousMonth
          }
          onNextMonth={
            nextMonth
          }
        />

      )}

    </section>
  );
};


export default UpcomingEvents;