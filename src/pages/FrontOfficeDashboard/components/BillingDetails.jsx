import {
  FaUserMd,
  FaLeaf,
  FaCapsules,
  FaWallet,
} from "react-icons/fa";

import {
  useSelector,
} from "react-redux";

import DashboardCard
  from "../../../components/Dashboard/DashboardCard";


const BillingDetails = () => {

  const billing =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
          .billing
    );


  const revenue =
    billing?.revenue_breakup || {};


  return (

    <DashboardCard
      className="
        px-5
        pt-5
        pb-5
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div>

          <h2
            className="
              text-[17px]
              font-semibold
              text-[#4B2E2A]
            "
          >
            Billing Details
          </h2>

        </div>

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
          This Week
          <span>⌄</span>
        </button>

      </div>


      <div
        className="
          grid
          grid-cols-[220px_1fr]
          gap-5
        "
      >

        {/* Total */}

        <div
          className="
            rounded-2xl
            border
            border-[#EFE4DC]
            p-4
          "
        >

          <p
            className="
              text-[13px]
              font-medium
              text-[#4B2E2A]
            "
          >
            Total Business Done
          </p>

          <h1
            className="
              mt-3
              text-[24px]
              font-bold
              text-[#4B2E2A]
            "
          >
            {billing?.formatted_total ||
              "₹0"}
          </h1>

          <p
            className="
              mt-1
              text-[12px]
              text-[#7D726B]
            "
          >
            {billing?.period ||
              "This Week"}
          </p>

        </div>


        {/* Revenue Breakup */}

        <div>

          <p
            className="
              mb-3
              text-[13px]
              font-medium
              text-[#4B2E2A]
            "
          >
            Revenue Breakup
          </p>

          <div
            className="
              grid
              grid-cols-3
              gap-4
            "
          >

            <RevenueCard
              title="Therapies"
              data={
                revenue.therapies
              }
              icon={
                <FaLeaf />
              }
            />

            <RevenueCard
              title="Medicines"
              data={
                revenue.medicines
              }
              icon={
                <FaCapsules />
              }
            />

            <RevenueCard
              title="Consultations"
              data={
                revenue.consultations
              }
              icon={
                <FaUserMd />
              }
            />

          </div>

        </div>

      </div>

    </DashboardCard>

  );
};


const RevenueCard = ({
  title,
  data,
  icon,
}) => {

  return (

    <div
      className="
        rounded-2xl
        border
        border-[#EFE4DC]
        p-4
      "
    >

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
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-[#FFF1E6]
            text-[#D48A43]
          "
        >
          {icon}
        </div>

        <span
          className="
            text-[13px]
            font-medium
            text-[#4B2E2A]
          "
        >
          {title}
        </span>

      </div>


      <h3
        className="
          mt-3
          text-[22px]
          font-bold
          text-[#4B2E2A]
        "
      >
        {data?.formatted || "₹0"}
      </h3>


      <div
        className="
          mt-2
          flex
          justify-end
        "
      >

        <span
          className="
            rounded-md
            bg-[#EAFBEF]
            px-2
            py-1
            text-[11px]
            font-semibold
            text-green-600
          "
        >
          {data?.growth || "+0.0%"}
        </span>

      </div>

    </div>

  );
};


export default BillingDetails;