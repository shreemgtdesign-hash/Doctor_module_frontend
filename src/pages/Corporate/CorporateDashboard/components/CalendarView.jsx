import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";


const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];


const CalendarView = ({
  monthDate,
  events = [],
  onPreviousMonth,
  onNextMonth,
  onToday,
}) => {

  const year =
    monthDate.getFullYear();

  const month =
    monthDate.getMonth();


  const monthName =
    monthDate.toLocaleString(
      "en-US",
      {
        month: "long",
      }
    );


  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  const previousMonthDays =
    new Date(
      year,
      month,
      0
    ).getDate();


  const totalCells =
    Math.ceil(
      (firstDay + daysInMonth) / 7
    ) * 7;


  const getEventForDay = (
    day
  ) => {
    return events.filter(
      (event) =>
        Number(
          event?.date_badge?.day
        ) === day &&
        Number(
          event?.date_badge?.year
        ) === year &&
        event?.date_badge?.month ===
          monthName
            .substring(0, 3)
            .toUpperCase()
    );
  };


  return (
    <div>

      {/* CALENDAR CONTROLS */}

      <div
        className="
          flex
          items-center
          justify-between
          py-5
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
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
              hover:bg-[#FFF8F2]
            "
          >
            <HiOutlineChevronLeft
              size={20}
            />
          </button>


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
              hover:bg-[#FFF8F2]
            "
          >
            <HiOutlineChevronRight
              size={20}
            />
          </button>


          <button
            type="button"
            onClick={onToday}
            className="
              ml-2
              text-[14px]
              font-medium
              text-[#4D2E23]
            "
          >
            Today
          </button>

        </div>


        {/* MONTH */}

        <div
          className="
            rounded-[10px]
            border
            border-[#E8D9CF]
            bg-[#FFFCF9]
            px-12
            py-2
            text-[14px]
            font-medium
            text-[#4D2E23]
          "
        >
          {monthName} {year}
        </div>


        {/* MONTH / WEEK */}

        <div
          className="
            flex
            overflow-hidden
            rounded-[10px]
            border
            border-[#E8D9CF]
            bg-white
          "
        >

          <button
            type="button"
            className="
              bg-[#FFF8F0]
              px-8
              py-2
              text-[14px]
              font-medium
              text-[#4D2E23]
            "
          >
            Month
          </button>

          <button
            type="button"
            className="
              px-8
              py-2
              text-[14px]
              text-[#4D2E23]
            "
          >
            Week
          </button>

        </div>

      </div>


      {/* WEEK HEADER */}

      <div
        className="
          grid
          grid-cols-7
          overflow-hidden
          rounded-t-[14px]
          border
          border-[#E9DED6]
        "
      >

        {weekDays.map(
          (day) => (
            <div
              key={day}
              className="
                border-r
                border-[#E9DED6]
                bg-[#FFFCF9]
                py-3
                text-center
                text-[13px]
                font-semibold
                text-[#4D2E23]
                last:border-r-0
              "
            >
              {day}
            </div>
          )
        )}

      </div>


      {/* CALENDAR */}

      <div
        className="
          grid
          grid-cols-7
          overflow-hidden
          rounded-b-[14px]
          border-l
          border-b
          border-[#E9DED6]
        "
      >

        {Array.from({
          length: totalCells,
        }).map((_, index) => {

          let day;
          let currentMonth = true;

          if (index < firstDay) {
            day =
              previousMonthDays -
              firstDay +
              index +
              1;

            currentMonth = false;

          } else if (
            index >=
            firstDay + daysInMonth
          ) {
            day =
              index -
              (firstDay + daysInMonth) +
              1;

            currentMonth = false;

          } else {
            day =
              index -
              firstDay +
              1;
          }


          const dayEvents =
            currentMonth
              ? getEventForDay(day)
              : [];


          return (
            <div
              key={index}
              className={`
                min-h-[135px]
                border-r
                border-t
                border-[#E9DED6]
                p-3
                last:border-r-0

                ${
                  currentMonth
                    ? "bg-white"
                    : "bg-[#F7F7F7]"
                }
              `}
            >

              <div
                className={`
                  text-[12px]
                  font-medium

                  ${
                    currentMonth
                      ? "text-[#4D2E23]"
                      : "text-[#B4AAA4]"
                  }
                `}
              >
                {day}
              </div>


              {dayEvents.map(
                (event) => (
                  <div
                    key={event.id}
                    className="mt-4"
                  >

                    <p
                      className="
                        text-[11px]
                        font-semibold
                        text-[#3D8B2E]
                      "
                    >
                      {event.title}
                    </p>

                    {event.instructor_name && (
                      <p
                        className="
                          mt-1
                          text-[11px]
                          font-semibold
                          text-[#4D7B35]
                        "
                      >
                        {event.instructor_name}
                      </p>
                    )}

                    <p
                      className="
                        mt-2
                        text-[11px]
                        text-[#39312D]
                      "
                    >
                      {event.time}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[11px]
                        text-[#39312D]
                      "
                    >
                      {event.registrations_label}
                    </p>

                  </div>
                )
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
};


export default CalendarView;