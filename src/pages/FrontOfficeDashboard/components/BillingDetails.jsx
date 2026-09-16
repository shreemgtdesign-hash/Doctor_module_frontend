import {
  FaLeaf,
} from "react-icons/fa";

import {
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import {
  useSelector,
} from "react-redux";
import {
  useNavigate,
} from "react-router-dom";
import DashboardCard
  from "../../../components/Dashboard/DashboardCard";


const BillingDetails = () => {
  const navigate = useNavigate();
  const billing =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
          .billing
    );


  const visitingDoctor =
    billing?.visiting_doctor_payouts || {};


  const associateDoctor =
    billing?.associate_doctor_payouts || {};


  const pendingPayments =
    billing?.pending_payments || {};


  return (

    <DashboardCard
      className="
        px-5
        pt-5
        pb-5
      "
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
        "
      >

        <h2
          className="
            text-[17px]
            font-semibold
            text-[#4B2E2A]
          "
        >
          Billing Details
        </h2>


        <button
          type="button"
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-[#E7DBD3]
            px-3
            py-2
            text-[12px]
            text-[#4B2E2A]
          "
        >

          <HiOutlineCalendarDays
            size={14}
          />

          {billing?.period === "week"
            ? "This Week"
            : billing?.period || "This Week"}

          <span>⌄</span>

        </button>

      </div>


      {/* ================================= */}
      {/* BILLING CARDS */}
      {/* ================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-3
        "
      >

        <BillingCard
          data={visitingDoctor}
          onClick={() =>
            navigate(
              "/frontoffice/billing/visiting-doctor-payouts"
            )
          }
        />

        <BillingCard
          data={associateDoctor}
          onClick={() =>
            navigate(
              "/frontoffice/billing/associate-doctor-payouts"
            )
          }
        />

        <BillingCard
          data={pendingPayments}
          onClick={() =>
            navigate(
              "/frontoffice/billing/pending-payments"
            )
          }
        />

      </div>

    </DashboardCard>

  );
};


const BillingCard = ({
  data, onClick
}) => {

  return (

    <div
      onClick={onClick}
      className="
        rounded-2xl
        border
        border-[#EFE4DC]
        px-4
        py-4
      "
    >

      {/* ================================= */}
      {/* ICON + TITLE */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#FFF0E4]
            text-[#4B2E2A]
          "
        >

          <FaLeaf
            size={16}
          />

        </div>


        <p
          className="
            text-[13px]
            font-medium
            leading-4
            text-[#4B2E2A]
          "
        >
          {data?.label || "—"}
        </p>

      </div>


      {/* ================================= */}
      {/* COUNT */}
      {/* ================================= */}

      <h1
        className="
          mt-4
          text-[26px]
          font-bold
          text-[#4B2E2A]
        "
      >
        {data?.count ?? 0}
      </h1>


      {/* ================================= */}
      {/* SUBTEXT */}
      {/* ================================= */}

      <p
        className="
          text-[12px]
          text-[#7D726B]
        "
      >
        {data?.subtext || "—"}
      </p>

    </div>

  );
};


export default BillingDetails;