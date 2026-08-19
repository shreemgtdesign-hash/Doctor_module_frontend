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
  loadMedicinesPrescribedList,
} from "../../../redux/dashboard/dashboardThunk";


const MedicinePrescribedTable = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();


  // ==========================================
  // PERIOD
  // ==========================================

  const [period, setPeriod] =
    useState("today");

  const [dropdownOpen, setDropdownOpen] =
    useState(false);


  // ==========================================
  // DASHBOARD REDUX
  // ==========================================

  const {
    medicinesPrescribedList,
    medicinesPrescribedListLoading,
  } = useSelector(
    (state) => state.dashboard
  );


  // ==========================================
  // LOAD MEDICINES
  // ==========================================

  useEffect(() => {

    dispatch(
      loadMedicinesPrescribedList(
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

  const medicines =
    medicinesPrescribedList
      ?.prescribed_medicines || [];


  const total =
    medicinesPrescribedList?.count ??
    medicines.length;


  // ==========================================
  // PERIOD LABEL
  // ==========================================

  const periodLabel = {

    today: "Today",

    week: "This Week",

    month: "This Month",

  };


  // ==========================================
  // PERIOD OPTIONS
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


  // ==========================================
  // CHANGE PERIOD
  // ==========================================

  const handlePeriodChange = (
    newPeriod
  ) => {

    setPeriod(newPeriod);

    setDropdownOpen(false);

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div
      className="
        min-h-screen
        bg-[#F8F6F3]
        px-8
        py-6
      "
    >

      {/* ===================================== */}
      {/* BACK */}
      {/* ===================================== */}

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


      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div
        className="
          mt-8
          flex
          items-start
          justify-between
        "
      >

        {/* TITLE */}

        <div>

          <h1
            className="
              text-[34px]
              font-bold
              text-[#2F2F2F]
            "
          >
            Medicines Prescribed
          </h1>


          <p
            className="
              mt-2
              text-[18px]
              text-[#777777]
            "
          >
            {total} Total Medicines
          </p>

        </div>


        {/* ================================= */}
        {/* PERIOD DROPDOWN */}
        {/* ================================= */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setDropdownOpen(
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
              px-5
              text-[16px]
              font-medium
              text-[#4D2E23]
            "
          >

            <HiOutlineCalendar
              size={18}
            />

            {periodLabel[period]}

            <HiChevronDown
              size={18}
              className={
                dropdownOpen
                  ? "rotate-180 transition"
                  : "transition"
              }
            />

          </button>


          {/* DROPDOWN */}

          {dropdownOpen && (

            <div
              className="
                absolute
                right-0
                z-50
                mt-2
                w-40
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
                      w-full
                      px-4
                      py-3
                      text-left
                      text-[15px]
                      transition
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


      {/* ===================================== */}
      {/* TABLE */}
      {/* ===================================== */}

      <div
        className="
          mt-8
          overflow-x-auto
          overflow-hidden
          rounded-[22px]
          border
          border-[#E7DBD3]
          bg-white
        "
      >

        <div
          className="
            min-w-[1350px]
          "
        >

          {/* ================================= */}
          {/* TABLE HEADER */}
          {/* ================================= */}

          <div
            className="
              grid
              grid-cols-[280px_170px_250px_290px_220px_140px]
              border-b
              border-[#EFE2D7]
              bg-[#FFF9F3]
            "
          >

            <div
              className="
                border-r
                border-[#EFE2D7]
                px-8
                py-5
                text-[17px]
                font-semibold
                text-[#4D2E23]
              "
            >
              Medicine Details
            </div>


            <div
              className="
                border-r
                border-[#EFE2D7]
                px-6
                py-5
                text-center
                text-[17px]
                font-semibold
                text-[#4D2E23]
              "
            >
              Category
            </div>


            <div
              className="
                border-r
                border-[#EFE2D7]
                px-6
                py-5
                text-center
                text-[17px]
                font-semibold
                text-[#4D2E23]
              "
            >
              Manufacturer
            </div>


            <div
              className="
                border-r
                border-[#EFE2D7]
                px-6
                py-5
                text-center
                text-[17px]
                font-semibold
                text-[#4D2E23]
              "
            >
              Patient Details
            </div>


            <div
              className="
                border-r
                border-[#EFE2D7]
                px-6
                py-5
                text-center
                text-[17px]
                font-semibold
                text-[#4D2E23]
              "
            >
              Date
            </div>


            <div
              className="
                px-6
                py-5
                text-center
                text-[17px]
                font-semibold
                text-[#4D2E23]
              "
            >
              Price
            </div>

          </div>


          {/* ================================= */}
          {/* LOADING */}
          {/* ================================= */}

          {medicinesPrescribedListLoading ? (

            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
                text-[16px]
                text-[#8A756B]
              "
            >
              Loading medicines...
            </div>

          ) : medicines.length === 0 ? (

            /* ================================= */
            /* EMPTY */
            /* ================================= */

            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
                text-[16px]
                text-[#8A756B]
              "
            >
              No medicines prescribed
            </div>

          ) : (

            /* ================================= */
            /* MEDICINE ROWS */
            /* ================================= */

            medicines.map(
              (medicine, index) => (

                <div
                  key={
                    medicine.prescription_item_id ||
                    index
                  }
                  className="
                    grid
                    grid-cols-[280px_170px_250px_290px_220px_140px]
                    border-b
                    border-[#EFE2D7]
                    last:border-b-0
                  "
                >

                  {/* ========================= */}
                  {/* MEDICINE */}
                  {/* ========================= */}

                  <div
                    className="
                      border-r
                      border-[#EFE2D7]
                      px-8
                      py-6
                    "
                  >

                    <h3
                      className="
                        text-[18px]
                        font-semibold
                        leading-6
                        text-[#4D2E23]
                      "
                    >
                      {
                        medicine.medicine_details
                      }
                    </h3>

                  </div>


                  {/* ========================= */}
                  {/* CATEGORY */}
                  {/* ========================= */}

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      border-r
                      border-[#EFE2D7]
                      px-6
                      py-6
                    "
                  >

                    <p
                      className="
                        text-[17px]
                        font-medium
                        text-[#4D2E23]
                      "
                    >
                      {
                        medicine.category
                      }
                    </p>

                  </div>


                  {/* ========================= */}
                  {/* MANUFACTURER */}
                  {/* ========================= */}

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      border-r
                      border-[#EFE2D7]
                      px-6
                      py-6
                    "
                  >

                    <p
                      className="
                        text-center
                        text-[17px]
                        font-medium
                        text-[#4D2E23]
                      "
                    >
                      {
                        medicine.manufacturer
                      }
                    </p>

                  </div>


                  {/* ========================= */}
                  {/* PATIENT */}
                  {/* ========================= */}

                  <div
                    className="
                      border-r
                      border-[#EFE2D7]
                      px-8
                      py-6
                    "
                  >

                    <h3
                      className="
                        text-[18px]
                        font-semibold
                        text-[#4D2E23]
                      "
                    >
                      {
                        medicine.patient_name
                      }
                    </h3>


                    <p
                      className="
                        mt-1
                        text-[14px]
                        text-[#888888]
                      "
                    >
                      Patient ID:{" "}
                      {
                        medicine.patient_id
                      }
                    </p>

                  </div>


                  {/* ========================= */}
                  {/* DATE */}
                  {/* ========================= */}

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      border-r
                      border-[#EFE2D7]
                      px-6
                      py-6
                    "
                  >

                    <p
                      className="
                        text-center
                        text-[17px]
                        font-medium
                        text-[#4D2E23]
                      "
                    >
                      {
                        medicine.date
                      }
                    </p>

                  </div>


                  {/* ========================= */}
                  {/* PRICE */}
                  {/* ========================= */}

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      px-6
                      py-6
                    "
                  >

                    <p
                      className="
                        text-[18px]
                        font-semibold
                        text-[#4D2E23]
                      "
                    >
                      ₹
                      {Number(
                        medicine.price || 0
                      ).toFixed(2)}
                    </p>

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


export default MedicinePrescribedTable;