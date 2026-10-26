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
  loadBeautySummaryList,
} from "../../../redux/dashboard/dashboardThunk";
import DashboardLayout from "../../../components/Layout/DashboardLayout";


const BeautyTable = () => {

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
    beautySummaryList,
    beautySummaryListLoading,
  } = useSelector(
    (state) => state.dashboard
  );


  // ==========================================
  // LOAD BEAUTY DATA
  // ==========================================

  useEffect(() => {

    dispatch(
      loadBeautySummaryList(
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

  const beautyList =
    beautySummaryList?.data || [];

  const totalConsultations =
    beautySummaryList
      ?.total_consultations ??
    beautySummaryList?.count ??
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
    <DashboardLayout role="doctor">
      <div
        className="
          min-h-screen
          bg-[#F8F6F3]
          px-8
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
            text-[16px]
            font-semibold
            text-[#4D2E23]
            transition
            hover:text-[#7A4A35]
          "
        >

          <HiOutlineArrowLeft
            size={22}
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
                text-[28px]
                font-bold
                text-[#2F2F2F]
              "
            >
              Beauty Consultations
            </h1>

            <p
              className="
                mt-2
                text-[15px]
                font-medium
                text-[#777777]
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
                h-11
                items-center
                gap-2
                rounded-xl
                border
                border-[#E7DBD3]
                bg-white
                px-4
                text-[15px]
                font-medium
                text-[#4D2E23]
              "
            >

              <HiOutlineCalendar
                size={18}
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
          dark:border-[#382E28]
          bg-white
          dark:bg-[#241E1B]
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
              dark:border-[#382E28]
              bg-[#FFF9F3]
              dark:bg-[#2C231F]
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

          {beautySummaryListLoading ? (

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
              Loading beauty consultations...
            </div>

          ) : beautyList.length === 0 ? (

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
                No beauty consultations
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

            beautyList.map(
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
                    dark:border-[#382E28]
                    hover:bg-[#FFF9F5]
                    dark:hover:bg-[#2C231F]
                    transition
                    last:border-b-0
                  "
                >

                  {/* PATIENT */}

                  <div
                    className="
                      border-r
                      border-[#EFE2D7]
                      dark:border-[#382E28]
                      px-4
                      py-4
                    "
                  >

                    <p
                      className="
                        text-[16px]
                        font-semibold
                        text-[#4D2E23]
                        dark:text-white
                      "
                    >
                      {item.patient_name ||
                        "-"}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[13px]
                        text-[#7A6E67]
                      "
                    >
                      Patient ID:{" "}
                      {item.patient_code ||
                        item.patient_id ||
                        "-"}
                    </p>

                  </div>


                  {/* DATE */}

                  <BodyCell>
                    {item.date || "-"}
                  </BodyCell>


                  {/* TYPE */}

                  <BodyCell>
                    {item.type || "-"}
                  </BodyCell>


                  {/* TIME */}

                  <BodyCell>
                    {item.time || "-"}
                  </BodyCell>


                  {/* PURPOSE */}

                  <BodyCell>
                    {item.purpose || "-"}
                  </BodyCell>


                  {/* PRICE */}

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
    </DashboardLayout>

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
      py-4
      text-center
      text-[16px]
      font-semibold
      text-[#4D2E23]
      dark:text-white

      ${
        !last
          ? "border-r border-[#EFE2D7] dark:border-[#382E28]"
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
      dark:border-[#382E28]
      px-4
      py-4
      text-center
      text-[15px]
      font-medium
      text-[#4D2E23]
      dark:text-[#EDE3DA]
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
    "bg-[#F2F2F2] dark:bg-[#2C231F] text-[#777777] dark:text-[#A8988D]";

  if (
    value === "completed" ||
    value === "booked" ||
    value === "confirmed"
  ) {
    classes =
      "bg-[#E8F8EC] dark:bg-[#163321] text-[#378456] dark:text-[#4ADE80] border border-transparent dark:border-[#1E462D]";
  }

  if (
    value === "cancelled" ||
    value === "canceled"
  ) {
    classes =
      "bg-[#FDECEE] dark:bg-[#3D1418] text-[#A45C66] dark:text-[#F87171] border border-transparent dark:border-[#5C1D24]";
  }

  if (
    value === "pending" ||
    value === "waiting"
  ) {
    classes =
      "bg-[#FFF3DD] dark:bg-[#382414] text-[#A8732C] dark:text-[#FBBF24] border border-transparent dark:border-[#4A301A]";
  }

  return (

    <span
      className={`
        rounded-full
        px-3.5
        py-1.5
        text-[12px]
        font-semibold
        capitalize
        ${classes}
      `}
    >
      {status || "-"}
    </span>

  );
};


export default BeautyTable;