import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

import EventCard from "./EventCard";


const EventListView = ({
  events = [],
  monthDate,
  onPreviousMonth,
  onNextMonth,
}) => {

  const monthName =
    monthDate.toLocaleString(
      "en-US",
      {
        month: "long",
      }
    );

  const year =
    monthDate.getFullYear();


  return (
    <div>

      {/* MONTH NAVIGATION */}

      <div
        className="
          flex
          items-center
          justify-center
          gap-3
          py-6
        "
      >

        <button
          type="button"
          onClick={onPreviousMonth}
          className="
            flex
            h-[36px]
            w-[36px]
            items-center
            justify-center
            rounded-[10px]
            border
            border-[#E8D9CF]
            bg-white
            text-[#4D2E23]
          "
        >
          <HiOutlineChevronLeft
            size={20}
          />
        </button>


        <div
          className="
            min-w-[240px]
            rounded-[10px]
            border
            border-[#E8D9CF]
            bg-[#FFFCF9]
            px-10
            py-2
            text-center
            text-[14px]
            font-medium
            text-[#4D2E23]
          "
        >
          {monthName} {year}
        </div>


        <button
          type="button"
          onClick={onNextMonth}
          className="
            flex
            h-[36px]
            w-[36px]
            items-center
            justify-center
            rounded-[10px]
            border
            border-[#E8D9CF]
            bg-white
            text-[#4D2E23]
          "
        >
          <HiOutlineChevronRight
            size={20}
          />
        </button>

      </div>


      {/* EVENTS */}

      {events.length === 0 ? (

        <div
          className="
            flex
            min-h-[250px]
            items-center
            justify-center
            rounded-[18px]
            border
            border-[#E8D9CF]
            bg-white
            text-[15px]
            text-[#8B7A70]
          "
        >
          No upcoming events for this month.
        </div>

      ) : (

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {events.map(
            (event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            )
          )}

        </div>

      )}

    </div>
  );
};


export default EventListView;