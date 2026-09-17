import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadMedicalCampList,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const MedCampCalender = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================================================
  // REDUX
  // =========================================================

  const {
    medicalCampList = [],
    medicalCampLoading = false,
    medicalCampError = null,
  } = useSelector(
    (state) => state.frontOfficeAppointment || {}
  );

  // =========================================================
  // STATE
  // =========================================================

  const [view, setView] = useState("calendar");

  const [calendarMode, setCalendarMode] = useState("month");

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  // =========================================================
  // LOAD MEDICAL CAMPS
  // =========================================================

  useEffect(() => {
    dispatch(
      loadMedicalCampList({
        page: 1,
        limit: 50,
      })
    );
  }, [dispatch]);

  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  const camps = useMemo(() => {
    if (!Array.isArray(medicalCampList)) {
      return [];
    }

    return medicalCampList;
  }, [medicalCampList]);

  // =========================================================
  // SET INITIAL MONTH FROM FIRST CAMP
  // =========================================================

  useEffect(() => {
    if (!camps.length) {
      return;
    }

    const sortedCamps = [...camps]
      .filter((camp) => camp?.camp_date)
      .sort(
        (a, b) =>
          new Date(a.camp_date) -
          new Date(b.camp_date)
      );

    if (!sortedCamps.length) {
      return;
    }

    const firstCampDate = new Date(
      sortedCamps[0].camp_date
    );

    setCurrentDate(
      new Date(
        firstCampDate.getFullYear(),
        firstCampDate.getMonth(),
        1
      )
    );
  }, [camps]);

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const getDateKey = (date) => {
    if (!date) {
      return "";
    }

    const d = new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  const getCampDateKey = (camp) => {
    if (!camp?.camp_date) {
      return "";
    }

    return getDateKey(camp.camp_date);
  };

  // =========================================================
  // GROUP CAMPS BY DATE
  // =========================================================

  const campsByDate = useMemo(() => {
    const grouped = {};

    camps.forEach((camp) => {
      const key = getCampDateKey(camp);

      if (!key) {
        return;
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(camp);
    });

    return grouped;
  }, [camps]);

  // =========================================================
  // MONTH DETAILS
  // =========================================================

  const monthStart = useMemo(
    () =>
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ),
    [currentDate]
  );

  const monthEnd = useMemo(
    () =>
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ),
    [currentDate]
  );

  const monthName = currentDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  // =========================================================
  // MONTH CALENDAR DAYS
  // =========================================================

  const monthDays = useMemo(() => {
    const firstDay = monthStart.getDay();

    const daysInMonth = monthEnd.getDate();

    const previousMonthDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        previousMonthDays - i
      );

      days.push({
        date,
        currentMonth: false,
      });
    }

    // Current month days
    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      days.push({
        date,
        currentMonth: true,
      });
    }

    // Next month days
    let nextDay = 1;

    while (days.length % 7 !== 0) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        nextDay
      );

      days.push({
        date,
        currentMonth: false,
      });

      nextDay++;
    }

    return days;
  }, [
    currentDate,
    monthStart,
    monthEnd,
  ]);

  // =========================================================
  // WEEK DAYS
  // =========================================================

  const weekDays = useMemo(() => {
    const date = new Date(currentDate);

    const day = date.getDay();

    const startOfWeek = new Date(date);

    startOfWeek.setDate(
      date.getDate() - day
    );

    return Array.from(
      { length: 7 },
      (_, index) => {
        const weekDate = new Date(
          startOfWeek
        );

        weekDate.setDate(
          startOfWeek.getDate() + index
        );

        return {
          date: weekDate,
          currentMonth:
            weekDate.getMonth() ===
            currentDate.getMonth(),
        };
      }
    );
  }, [currentDate]);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handlePrevious = () => {
    if (calendarMode === "month") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        )
      );
      return;
    }

    const previousWeek = new Date(
      currentDate
    );

    previousWeek.setDate(
      previousWeek.getDate() - 7
    );

    setCurrentDate(previousWeek);
  };

  const handleNext = () => {
    if (calendarMode === "month") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        )
      );
      return;
    }

    const nextWeek = new Date(
      currentDate
    );

    nextWeek.setDate(
      nextWeek.getDate() + 7
    );

    setCurrentDate(nextWeek);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // =========================================================
  // OPEN CAMP DETAILS
  // =========================================================

  const handleCampClick = (camp) => {
    if (!camp?.id) {
      return;
    }

    navigate(
      "/frontoffice/medcamp-details",
      {
        state: {
          campId: camp.id,
          camp,
        },
      }
    );
  };

  // =========================================================
  // ADD CAMP
  // =========================================================

  const handleAddCamp = () => {
  navigate("/frontoffice/medcamp/add");
};

  // =========================================================
  // DATE DISPLAY
  // =========================================================

  const formatDayNumber = (date) => {
    return date.getDate();
  };

  const formatCampDate = (camp) => {
    if (camp?.formatted_camp_date) {
      return camp.formatted_camp_date;
    }

    if (!camp?.camp_date) {
      return "—";
    }

    return new Date(
      camp.camp_date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // WEEK LABEL
  // =========================================================

  const weekLabel = useMemo(() => {
    const first = weekDays[0]?.date;
    const last = weekDays[6]?.date;

    if (!first || !last) {
      return "";
    }

    const firstMonth =
      first.toLocaleDateString("en-US", {
        month: "short",
      });

    const lastMonth =
      last.toLocaleDateString("en-US", {
        month: "short",
      });

    if (firstMonth === lastMonth) {
      return `${firstMonth} ${first.getDate()} - ${last.getDate()}, ${first.getFullYear()}`;
    }

    return `${firstMonth} ${first.getDate()} - ${lastMonth} ${last.getDate()}, ${last.getFullYear()}`;
  }, [weekDays]);

  // =========================================================
  // RENDER CAMP INSIDE CALENDAR
  // =========================================================

  const renderCamp = (camp) => {
    return (
      <button
        key={camp.id}
        type="button"
        onClick={() =>
          handleCampClick(camp)
        }
        className="
          mt-2
          w-full
          text-left
          rounded-md
          px-1.5
          py-1
          hover:bg-[#fff3e9]
          transition
          cursor-pointer
        "
      >
        <p
          className="
            text-[11px]
            font-semibold
            text-green-700
            leading-4
            truncate
          "
          title={camp.camp_name}
        >
          {camp.camp_name || "Medical Camp"}
        </p>

        <p
          className="
            mt-0.5
            text-[11px]
            font-semibold
            text-[#5c3023]
            leading-4
            truncate
          "
          title={camp.doctor_name}
        >
          {camp.doctor_name || "—"}
        </p>

        <p
          className="
            mt-1
            text-[10px]
            text-[#33221c]
            leading-4
          "
        >
          {camp.working_hours || "—"}
        </p>

        <p
          className="
            text-[10px]
            text-[#33221c]
            leading-4
          "
        >
          {camp.registrations_text ||
            `${camp.registrations_count || 0} Registrations`}
        </p>
      </button>
    );
  };

  // =========================================================
  // CALENDAR CELL
  // =========================================================

  const renderCalendarCell = ({
    date,
    currentMonth,
  }) => {
    const key = getDateKey(date);

    const dateCamps =
      campsByDate[key] || [];

    const hasCamp =
      dateCamps.length > 0;

    return (
      <div
        key={key}
        className={`
          min-h-[122px]
          border-r
          border-b
          border-[#eee2d8]
          p-2
          ${
            !currentMonth
              ? "bg-[#f7f7f7]"
              : "bg-white"
          }
          ${
            hasCamp
              ? "bg-[#fffaf5]"
              : ""
          }
        `}
      >
        <div
          className={`
            text-[12px]
            font-semibold
            ${
              currentMonth
                ? "text-[#5c3023]"
                : "text-[#aaa]"
            }
          `}
        >
          {formatDayNumber(date)}
        </div>

        {dateCamps.map(
          (camp) =>
            renderCamp(camp)
        )}
      </div>
    );
  };

  // =========================================================
  // LIST VIEW
  // =========================================================

  const renderListView = () => {
    if (medicalCampLoading) {
      return (
        <div className="rounded-xl border border-[#eaded4] bg-white py-16 text-center">
          <p className="text-sm text-[#6d5145]">
            Loading medical camps...
          </p>
        </div>
      );
    }

    if (medicalCampError) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 py-12 text-center">
          <p className="text-sm text-red-600">
            {typeof medicalCampError ===
            "string"
              ? medicalCampError
              : "Failed to load medical camps"}
          </p>
        </div>
      );
    }

    if (!camps.length) {
      return (
        <div className="rounded-xl border border-[#eaded4] bg-white py-16 text-center">
          <p className="text-sm text-[#6d5145]">
            No medical camps found.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-xl border border-[#eaded4] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse">
            <thead>
              <tr className="bg-[#fffaf5]">
                <th className="border-b border-[#eaded4] px-4 py-3 text-left text-[11px] font-semibold text-[#4d2b20]">
                  Camp Details
                </th>

                <th className="border-b border-[#eaded4] px-4 py-3 text-left text-[11px] font-semibold text-[#4d2b20]">
                  Doctor
                </th>

                <th className="border-b border-[#eaded4] px-4 py-3 text-left text-[11px] font-semibold text-[#4d2b20]">
                  Date
                </th>

                <th className="border-b border-[#eaded4] px-4 py-3 text-left text-[11px] font-semibold text-[#4d2b20]">
                  Working Hours
                </th>

                <th className="border-b border-[#eaded4] px-4 py-3 text-left text-[11px] font-semibold text-[#4d2b20]">
                  Registrations
                </th>

                <th className="border-b border-[#eaded4] px-4 py-3 text-left text-[11px] font-semibold text-[#4d2b20]">
                  Location
                </th>

                <th className="border-b border-[#eaded4] px-4 py-3 text-left text-[11px] font-semibold text-[#4d2b20]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {camps.map((camp) => (
                <tr
                  key={camp.id}
                  onClick={() =>
                    handleCampClick(
                      camp
                    )
                  }
                  className="
                    cursor-pointer
                    hover:bg-[#fffaf5]
                    transition
                  "
                >
                  <td className="border-b border-[#eee5df] px-4 py-4 align-top">
                    <p className="text-[12px] font-semibold text-[#4d2b20]">
                      {camp.camp_name ||
                        "—"}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500">
                      Camp ID:{" "}
                      {camp.camp_code ||
                        "—"}
                    </p>
                  </td>

                  <td className="border-b border-[#eee5df] px-4 py-4 align-top">
                    <p className="text-[12px] font-semibold text-[#4d2b20]">
                      {camp.doctor_name ||
                        "—"}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500">
                      {camp.doctor_specialty ||
                        "—"}
                    </p>
                  </td>

                  <td className="border-b border-[#eee5df] px-4 py-4 align-top text-[12px] font-medium text-[#4d2b20]">
                    {formatCampDate(
                      camp
                    )}
                  </td>

                  <td className="border-b border-[#eee5df] px-4 py-4 align-top text-[12px] text-[#4d2b20]">
                    {camp.working_hours ||
                      "—"}
                  </td>

                  <td className="border-b border-[#eee5df] px-4 py-4 align-top text-[12px] font-medium text-[#4d2b20]">
                    {camp.registrations_text ||
                      `${camp.registrations_count || 0} Registrations`}
                  </td>

                  <td className="border-b border-[#eee5df] px-4 py-4 align-top text-[11px] text-[#6d5145]">
                    {camp.location ||
                      "—"}
                  </td>

                  <td className="border-b border-[#eee5df] px-4 py-4 align-top">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        ${
                          camp.status
                            ?.toLowerCase() ===
                          "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {camp.status ||
                        "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <DashboardLayout role="frontoffice">
      <div className="w-full px-5 py-5 lg:px-6 lg:py-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-start justify-between gap-4">

          <div>
            <h1 className="text-[20px] font-semibold text-[#24201e]">
              Medical Camp
            </h1>

            <p className="mt-1 text-[13px] text-[#5c3023]">
              Manage and track all medical camps.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCamp}
            className="
              flex
              h-[42px]
              min-w-[175px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#895238]
              px-5
              text-[13px]
              font-semibold
              text-white
              hover:bg-[#75452f]
              transition
            "
          >
            <span className="text-lg leading-none">
              +
            </span>

            Add Camp
          </button>

        </div>

        {/* =================================================
            VIEW TABS
        ================================================= */}

        <div className="mt-7 border-b border-[#eaded4]">

          <div className="flex gap-8">

            <button
              type="button"
              onClick={() =>
                setView("calendar")
              }
              className={`
                relative
                pb-3
                text-[13px]
                font-semibold
                ${
                  view === "calendar"
                    ? "text-[#5c3023]"
                    : "text-[#b4a6a0]"
                }
              `}
            >
              Calendar view

              {view === "calendar" && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#5c3023]" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setView("list")
              }
              className={`
                relative
                pb-3
                text-[13px]
                font-semibold
                ${
                  view === "list"
                    ? "text-[#5c3023]"
                    : "text-[#b4a6a0]"
                }
              `}
            >
              List View

              {view === "list" && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#5c3023]" />
              )}
            </button>

          </div>

        </div>

        {/* =================================================
            LOADING / ERROR
        ================================================= */}

        {view === "calendar" &&
          medicalCampLoading && (
            <div className="mt-5 rounded-xl border border-[#eaded4] bg-white py-10 text-center">
              <p className="text-sm text-[#6d5145]">
                Loading medical camps...
              </p>
            </div>
          )}

        {view === "calendar" &&
          medicalCampError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 py-10 text-center">
              <p className="text-sm text-red-600">
                {typeof medicalCampError ===
                "string"
                  ? medicalCampError
                  : "Failed to load medical camps"}
              </p>
            </div>
          )}

        {/* =================================================
            CALENDAR
        ================================================= */}

        {view === "calendar" &&
          !medicalCampLoading &&
          !medicalCampError && (

            <div className="mt-5">

              {/* Calendar Controls */}

              <div className="mb-4 flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={
                      handlePrevious
                    }
                    className="
                      flex
                      h-[38px]
                      w-[38px]
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#eaded4]
                      bg-white
                      text-[22px]
                      text-[#5c3023]
                      hover:bg-[#fff8f2]
                    "
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleNext
                    }
                    className="
                      flex
                      h-[38px]
                      w-[38px]
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#eaded4]
                      bg-white
                      text-[22px]
                      text-[#5c3023]
                      hover:bg-[#fff8f2]
                    "
                  >
                    ›
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleToday
                    }
                    className="
                      ml-2
                      px-3
                      text-[13px]
                      font-medium
                      text-[#4d2b20]
                    "
                  >
                    Today
                  </button>

                </div>

                {/* Month / Week Heading */}

                <div className="rounded-xl border border-[#eaded4] bg-[#fffaf5] px-8 py-2.5">

                  <p className="text-[13px] font-semibold text-[#4d2b20]">
                    {calendarMode ===
                    "month"
                      ? monthName
                      : weekLabel}
                  </p>

                </div>

                {/* Month / Week */}

                <div className="flex overflow-hidden rounded-xl border border-[#eaded4] bg-white">

                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMode(
                        "month"
                      )
                    }
                    className={`
                      min-w-[105px]
                      px-5
                      py-2
                      text-[13px]
                      font-medium
                      ${
                        calendarMode ===
                        "month"
                          ? "bg-[#fffaf5] text-[#4d2b20]"
                          : "text-[#4d4d4d]"
                      }
                    `}
                  >
                    Month
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMode(
                        "week"
                      )
                    }
                    className={`
                      min-w-[105px]
                      border-l
                      border-[#eaded4]
                      px-5
                      py-2
                      text-[13px]
                      font-medium
                      ${
                        calendarMode ===
                        "week"
                          ? "bg-[#fffaf5] text-[#4d2b20]"
                          : "text-[#4d4d4d]"
                      }
                    `}
                  >
                    Week
                  </button>

                </div>

              </div>

              {/* =================================================
                  MONTH VIEW
              ================================================= */}

              {calendarMode ===
                "month" && (

                <div className="overflow-hidden rounded-xl border border-[#eaded4] bg-white">

                  {/* Week Header */}

                  <div className="grid grid-cols-7 bg-[#fffaf5]">

                    {[
                      "Sun",
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                    ].map(
                      (day) => (
                        <div
                          key={day}
                          className="
                            border-r
                            border-b
                            border-[#eaded4]
                            px-2
                            py-3
                            text-center
                            text-[12px]
                            font-semibold
                            text-[#4d2b20]
                          "
                        >
                          {day}
                        </div>
                      )
                    )}

                  </div>

                  {/* Calendar Grid */}

                  <div className="grid grid-cols-7">

                    {monthDays.map(
                      (calendarDay) =>
                        renderCalendarCell(
                          calendarDay
                        )
                    )}

                  </div>

                </div>
              )}

              {/* =================================================
                  WEEK VIEW
              ================================================= */}

              {calendarMode ===
                "week" && (

                <div className="overflow-hidden rounded-xl border border-[#eaded4] bg-white">

                  <div className="grid grid-cols-7 bg-[#fffaf5]">

                    {weekDays.map(
                      ({
                        date,
                      }) => (
                        <div
                          key={getDateKey(
                            date
                          )}
                          className="
                            border-r
                            border-b
                            border-[#eaded4]
                            px-2
                            py-3
                            text-center
                          "
                        >
                          <p className="text-[11px] font-semibold text-[#8b756d]">
                            {date.toLocaleDateString(
                              "en-US",
                              {
                                weekday:
                                  "short",
                              }
                            )}
                          </p>

                          <p className="mt-1 text-[15px] font-semibold text-[#4d2b20]">
                            {date.getDate()}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                  <div className="grid min-h-[400px] grid-cols-7">

                    {weekDays.map(
                      ({
                        date,
                      }) => {
                        const key =
                          getDateKey(
                            date
                          );

                        const dateCamps =
                          campsByDate[
                            key
                          ] || [];

                        const hasCamp =
                          dateCamps.length >
                          0;

                        return (
                          <div
                            key={key}
                            className={`
                              min-h-[400px]
                              border-r
                              border-[#eee2d8]
                              p-2
                              ${
                                hasCamp
                                  ? "bg-[#fffaf5]"
                                  : "bg-white"
                              }
                            `}
                          >
                            {dateCamps.map(
                              (
                                camp
                              ) =>
                                renderCamp(
                                  camp
                                )
                            )}
                          </div>
                        );
                      }
                    )}

                  </div>

                </div>
              )}

            </div>
          )}

        {/* =================================================
            LIST VIEW
        ================================================= */}

        {view === "list" && (
          <div className="mt-5">
            {renderListView()}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MedCampCalender;