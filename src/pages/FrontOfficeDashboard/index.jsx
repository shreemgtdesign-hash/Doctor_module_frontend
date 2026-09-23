import {
  useEffect,

} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout
  from "../../components/Layout/DashboardLayout";
import {
  loadFrontOfficeDashboard,
  loadFrontOfficeAppointments,
} from "../../redux/frontOffice/frontOfficeDashboardThunk";
import AppointmentsCompleted
  from "./components/UpcomingAppointments";

import Insurance
  from "./components/Insurance";

import Packages
  from "./components/Packages";

import MedicalCamp
  from "./components/MedicalCamp";

import Referrals
  from "./components/Referrals";

import BillingDetails
  from "./components/BillingDetails";

import RecentTransactions
  from "./components/RecentTransactions";

import PendingActions
  from "./components/PendingActions";
import SalesDetails from "./components/SalesDetails";

const FrontOfficeDashboard = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
    period,
  } =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
    );

  // Listen for real-time notification events to keep dashboard data fresh
  useEffect(() => {
    const handleFCMNotification = () => {
      dispatch(
        loadFrontOfficeDashboard({
          period: period || "today",
        })
      );
      dispatch(
        loadFrontOfficeAppointments({
          period: period || "today",
        })
      );
    };

    window.addEventListener("fcm_notification", handleFCMNotification);

    return () => {
      window.removeEventListener("fcm_notification", handleFCMNotification);
    };
  }, [dispatch, period]);



  const handlePeriodChange = (
    newPeriod
  ) => {

    dispatch(
      loadFrontOfficeAppointments({
        period: newPeriod,
      })
    );

  };


  useEffect(() => {

    dispatch(
      loadFrontOfficeDashboard({
        period: "today",
      })
    );

  }, [dispatch]);


  return (

    <DashboardLayout
      role="frontoffice"
    >

      <div
        className="
          min-h-screen
          bg-[#F7F7F7]
          p-6
        "
      >

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (

          <div
            className="
              mb-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-5
              py-3
              text-red-600
            "
          >
            {typeof error === "string"
              ? error
              : "Failed to load dashboard."}
          </div>

        )}


        {/* ================================= */}
        {/* TOP SECTION */}
        {/* ================================= */}

        <div
          className="
            grid
            grid-cols-[1fr_220px]
            gap-4
          "
        >

          <AppointmentsCompleted
            period={period}
            onPeriodChange={
              handlePeriodChange
            }
          />

          {/* Walk-in */}

          <div
            className="
              rounded-[18px]
              border
              border-[#E7DBD3]
              bg-white
              p-5
            "
          >

            <h3
              className="
                text-[16px]
                font-semibold
                text-[#4B2E2A]
              "
            >
              Add Direct Walk-in
              Appointment
            </h3>

            <p
              className="
                mt-3
                text-[12px]
                leading-5
                text-[#7D726B]
              "
            >
              Quickly add a new walk-in
              patient and an appointment.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/frontoffice/direct-walkin")
              }
              className="
    mt-5
    w-full
    rounded-xl
    bg-[#8A4F32]
    py-3
    text-[14px]
    font-semibold
    text-white
    transition
    hover:bg-[#6A3F2D]
  "
            >
              + Add Patient
            </button>

          </div>

        </div>


        {/* ================================= */}
        {/* INSURANCE + PACKAGES */}
        {/* ================================= */}

        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-4
          "
        >

          <Insurance />

          <Packages />

        </div>


        {/* ================================= */}
        {/* MEDICAL CAMP + REFERRALS */}
        {/* ================================= */}

        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-4
          "
        >

          <MedicalCamp />

          <Referrals />

        </div>


        {/* ================================= */}
        {/* BILLING */}
        {/* ================================= */}

        <div className="mt-4">

          <BillingDetails />

        </div>

        <div className="mt-4">
          <SalesDetails />
        </div>


        {/* ================================= */}
        {/* RECENT + PENDING */}
        {/* ================================= */}

        <div
          className="
            mt-4
            grid
            grid-cols-[1.6fr_1fr]
            gap-4
          "
        >

          <RecentTransactions />

          <PendingActions />

        </div>


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading && (

          <div
            className="
              fixed
              bottom-5
              right-5
              rounded-xl
              bg-[#6A3F2D]
              px-5
              py-3
              text-sm
              font-medium
              text-white
              shadow-lg
            "
          >
            Loading...
          </div>

        )}

      </div>

    </DashboardLayout>

  );

};

export default FrontOfficeDashboard;