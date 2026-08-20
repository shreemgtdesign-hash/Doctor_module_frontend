import {
  FaUserMd,
  FaLeaf,
  FaCapsules,
} from "react-icons/fa";

import {
  FaWallet,
  FaArrowTrendUp,
} from "react-icons/fa6";

import DashboardCard from "../../../components/Dashboard/DashboardCard";
import RevenueCard from "../../../components/Dashboard/Revenuecard";
import BusinessCard from "../../../components/Dashboard/BusinessCard";

const BillingDetails = () => {
  // ==========================================
  // BILLING DATA
  // ==========================================

  const billing = {
    consultation: 168000,
    therapies: 96500,
    medicines: 74500,
    total: 339000,
    growth: 18,
  };

  // ==========================================
  // CURRENCY FORMAT
  // ==========================================

  const formatAmount = (amount) => {
    return `${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <DashboardCard className="p-6">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-[28px] font-semibold text-[#4B2E2A]">
            Billing Details
          </h2>

          <p className="mt-1 text-[15px] text-[#8A756B]">
            Weekly Revenue Summary
          </p>

        </div>

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-[#FFF4EB]
          "
        >

          <FaWallet
            className="text-2xl text-[#D48A43]"
          />

        </div>

      </div>


      {/* ===================================== */}
      {/* REVENUE CARDS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* ================================= */}
        {/* CONSULTATION */}
        {/* ================================= */}

        <RevenueCard
          title="Consultation"
          amount={formatAmount(
            billing.consultation
          )}
          percentage={12}
          icon={
            <FaUserMd className="text-[#D48A43]" />
          }
        />


        {/* ================================= */}
        {/* THERAPIES */}
        {/* ================================= */}

        <RevenueCard
          title="Therapies"
          amount={formatAmount(
            billing.therapies
          )}
          percentage={8}
          icon={
            <FaLeaf className="text-[#D48A43]" />
          }
        />


        {/* ================================= */}
        {/* MEDICINES */}
        {/* ================================= */}

        <RevenueCard
          title="Medicines"
          amount={formatAmount(
            billing.medicines
          )}
          percentage={6}
          icon={
            <FaCapsules className="text-[#D48A43]" />
          }
        />


        {/* ================================= */}
        {/* TOTAL BUSINESS */}
        {/* ================================= */}

        <BusinessCard
          amount={formatAmount(
            billing.total
          )}
        >

          {/* Growth */}

          <div className="mt-4 flex items-center justify-between gap-2">

            <div
              className="
                flex
                items-center
                gap-2
                font-semibold
                text-green-600
              "
            >

              <FaArrowTrendUp />

              <span>
                +{billing.growth}%
              </span>

            </div>

            <span className="text-right text-xs text-gray-500">
              Compared to last week
            </span>

          </div>


          {/* Progress */}

          <div className="mt-5">

            <div
              className="
                h-3
                overflow-hidden
                rounded-full
                bg-[#F2E8E2]
              "
            >

              <div
                className="
                  h-full
                  rounded-full
                  bg-[#6A3F2D]
                  transition-all
                  duration-500
                "
                style={{
                  width: `${Math.min(
                    billing.growth * 4,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        </BusinessCard>

      </div>

    </DashboardCard>
  );
};

export default BillingDetails;