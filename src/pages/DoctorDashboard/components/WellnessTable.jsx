import {
  useEffect,
  useState,
} from "react";

import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiChevronDown,
} from "react-icons/hi2";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  loadWellnessSummaryList,
} from "../../../redux/dashboard/dashboardThunk";


const WellnessTable = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [period, setPeriod] =
    useState("today");

  const [showDropdown, setShowDropdown] =
    useState(false);


  // ==========================================
  // REDUX
  // ==========================================

  const {
    wellnessSummaryList,
    wellnessSummaryListLoading,
  } = useSelector(
    (state) => state.dashboard
  );


  // ==========================================
  // LOAD WELLNESS DATA
  // ==========================================

  useEffect(() => {

    dispatch(
      loadWellnessSummaryList(
        period
      )
    );

  }, [
    dispatch,
    period,
  ]);


  // ==========================================
  // DATA
  // ==========================================

  const wellnessList =
    wellnessSummaryList?.data || [];

  const totalConsultations =
    wellnessSummaryList
      ?.total_consultations ??
    wellnessSummaryList?.count ??
    0;


  // ==========================================
  // PERIOD
  // ==========================================

  const periodOptions = [
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
  ];


  const selectedPeriod =
    periodOptions.find(
      (item) =>
        item.value === period
    )?.label || "Today";


  return (

    <div
      className="
        min-h-screen
        bg-[#F8F6F3]
        px-7
        py-6
      "
    >

      {/* ======================================
          BACK
      ====================================== */}

      <button
        type="button"
        onClick={() =>
          navigate(
            "/doctordashboard"
          )
        }
        className="
          flex
          items-center
          gap-2
          text-[15px]
          font-semibold
          text-[#4D2E23]
          transition
          hover:text-[#7A4A35]
        "
      >

        <HiOutlineArrowLeft
          size={20}
        />

        Back to Dashboard

      </button>


      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div
        className="
          mt-8
          flex
          items-end
          justify-between
        "
      >

        <div>

          <h1
            className="
              text-[25px]
              font-bold
              text-[#2F2F2F]
            "
          >
            Wellness Consultations
          </h1>

          <p
            className="
              mt-1
              text-[14px]
              text-[#888888]
            "
          >
            {totalConsultations} Total Consultations
          </p>

        </div>


        {/* ======================================
            PERIOD DROPDOWN
        ====================================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowDropdown(
                (prev) => !prev
              )
            }
            className="
              flex
              h-[38px]
              items-center
              gap-2
              rounded-xl
              border
              border-[#E7DBD3]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#4D2E23]
            "
          >

            <HiOutlineCalendar
              size={16}
            />

            {selectedPeriod}

            <HiChevronDown
              size={16}
              className={`
                transition-transform
                duration-200
                ${
                  showDropdown
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>


          {showDropdown && (

            <div
              className="
                absolute
                right-0
                top-[44px]
                z-50
                w-[145px]
                overflow-hidden
                rounded-xl
                border
                border-[#E7DBD3]
                bg-white
                shadow-lg
              "
            >

              {periodOptions.map(
                (option) => (

                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {

                      setPeriod(
                        option.value
                      );

                      setShowDropdown(
                        false
                      );

                    }}
                    className={`
                      w-full
                      px-4
                      py-2.5
                      text-left
                      text-[13px]
                      hover:bg-[#FFF7F0]

                      ${
                        period ===
                        option.value
                          ? "bg-[#FFF7F0] font-semibold text-[#4D2E23]"
                          : "text-[#6F625B]"
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


      {/* ======================================
          TABLE
      ====================================== */}

      <div
        className="
          mt-6
          overflow-x-auto
          rounded-[18px]
          border
          border-[#E7DBD3]
          bg-white
        "
      >

        <div className="min-w-[1100px]">

          {/* ==================================
              TABLE HEADER
          ================================== */}

          <div
            className="
              grid
              grid-cols-[1.35fr_1fr_0.85fr_0.85fr_1.25fr_0.75fr_0.8fr]
              border-b
              border-[#EFE2D7]
              bg-[#FFF9F3]
            "
          >

            <HeaderCell>
              Patient Details
            </HeaderCell>

            <HeaderCell>
              Date
            </HeaderCell>

            <HeaderCell>
              Type
            </HeaderCell>

            <HeaderCell>
              Time
            </HeaderCell>

            <HeaderCell>
              Purpose
            </HeaderCell>

            <HeaderCell>
              Price
            </HeaderCell>

            <HeaderCell last>
              Status
            </HeaderCell>

          </div>


          {/* ==================================
              LOADING
          ================================== */}

          {wellnessSummaryListLoading ? (

            <div
              className="
                flex
                h-[300px]
                items-center
                justify-center
                text-[14px]
                text-[#8A756B]
              "
            >
              Loading wellness consultations...
            </div>

          ) : wellnessList.length === 0 ? (

            /* ==================================
                EMPTY
            ================================== */

            <div
              className="
                flex
                h-[300px]
                flex-col
                items-center
                justify-center
              "
            >

              <p
                className="
                  text-[17px]
                  font-semibold
                  text-[#4D2E23]
                "
              >
                No wellness consultations
              </p>

              <p
                className="
                  mt-1
                  text-[13px]
                  text-[#999999]
                "
              >
                No consultations available
                for this period.
              </p>

            </div>

          ) : (

            /* ==================================
                DATA
            ================================== */

            wellnessList.map(
              (item, index) => (

                <div
                  key={
                    item.id ||
                    index
                  }
                  className="
                    grid
                    grid-cols-[1.35fr_1fr_0.85fr_0.85fr_1.25fr_0.75fr_0.8fr]
                    border-b
                    border-[#EFE2D7]
                    last:border-b-0
                  "
                >

                  {/* PATIENT */}

                  <div
                    className="
                      border-r
                      border-[#EFE2D7]
                      px-4
                      py-4
                    "
                  >

                    <p
                      className="
                        text-[14px]
                        font-semibold
                        text-[#4D2E23]
                      "
                    >
                      {item.patient_name ||
                        "-"}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        text-[#999999]
                      "
                    >
                      Patient ID:{" "}
                      {item.patient_code ||
                        item.patient_id ||
                        "-"}
                    </p>

                  </div>


                  <BodyCell>
                    {item.date || "-"}
                  </BodyCell>


                  <BodyCell>
                    {item.type || "-"}
                  </BodyCell>


                  <BodyCell>
                    {item.time || "-"}
                  </BodyCell>


                  <BodyCell>
                    {item.purpose || "-"}
                  </BodyCell>


                  <BodyCell>
                    ₹
                    {Number(
                      item.price || 0
                    ).toFixed(0)}
                  </BodyCell>


                  {/* STATUS */}

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      px-3
                      py-4
                    "
                  >

                    <StatusBadge
                      status={
                        item.status
                      }
                    />

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>

  );
};


// ==========================================
// HEADER CELL
// ==========================================

const HeaderCell = ({
  children,
  last = false,
}) => (

  <div
    className={`
      px-4
      py-3.5
      text-center
      text-[12px]
      font-semibold
      text-[#6D5146]

      ${
        !last
          ? "border-r border-[#EFE2D7]"
          : ""
      }
    `}
  >
    {children}
  </div>

);


// ==========================================
// BODY CELL
// ==========================================

const BodyCell = ({
  children,
}) => (

  <div
    className="
      flex
      items-center
      justify-center
      border-r
      border-[#EFE2D7]
      px-3
      py-4
      text-center
      text-[13px]
      font-medium
      text-[#4D2E23]
    "
  >
    {children}
  </div>

);


// ==========================================
// STATUS
// ==========================================

const StatusBadge = ({
  status,
}) => {

  const value =
    String(status || "")
      .toLowerCase();

  let classes =
    "bg-[#F2F2F2] text-[#777777]";

  if (
    value === "completed" ||
    value === "booked" ||
    value === "confirmed"
  ) {
    classes =
      "bg-[#E8F8EC] text-[#378456]";
  }

  if (
    value === "cancelled" ||
    value === "canceled"
  ) {
    classes =
      "bg-[#FDECEE] text-[#A45C66]";
  }

  if (
    value === "pending" ||
    value === "waiting"
  ) {
    classes =
      "bg-[#FFF3DD] text-[#A8732C]";
  }

  return (

    <span
      className={`
        rounded-full
        px-3
        py-1
        text-[11px]
        font-medium
        capitalize
        ${classes}
      `}
    >
      {status || "-"}
    </span>

  );
};


export default WellnessTable;