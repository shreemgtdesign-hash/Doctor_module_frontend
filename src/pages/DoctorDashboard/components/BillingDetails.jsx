import { FaUserMd, FaLeaf, FaCapsules } from "react-icons/fa";

import { FaWallet, FaArrowTrendUp } from "react-icons/fa6";
import DashboardCard from "../../../components/Dashboard/DashboardCard";
import RevenueCard from "../../../components/Dashboard/Revenuecard";
import BusinessCard from "../../../components/Dashboard/BusinessCard";

const BillingDetails = () => {
  const billing = {
    consultation: 168000,
    therapies: 96500,
    medicines: 74500,
    total: 339000,
    growth: 18,
  };

  return (
    <DashboardCard>

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-[32px] font-semibold text-[#4B2E2A]">
            Billing Details
          </h2>

          <p className="text-[#8A756B] mt-1">
            Weekly Revenue Summary
          </p>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF4EB]">

          <FaWallet className="text-[#D48A43] text-2xl" />

        </div>

      </div>

      {/* Revenue Cards */}

      <div className="grid grid-cols-4 gap-5">

        <RevenueCard
          title="Consultation"
          amount={billing.consultation.toLocaleString()}
          percentage={12}
          icon={<FaUserMd className="text-[#D48A43]" />}
        />

        <RevenueCard
          title="Therapies"
          amount={billing.therapies.toLocaleString()}
          percentage={8}
          icon={<FaLeaf className="text-[#D48A43]" />}
        />

        <RevenueCard
          title="Medicines"
          amount={billing.medicines.toLocaleString()}
          percentage={6}
          icon={<FaCapsules className="text-[#D48A43]" />}
        />

        <BusinessCard amount={billing.total.toLocaleString()}>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2 text-green-600 font-semibold">

              <FaArrowTrendUp />

              +{billing.growth}%

            </div>

            <span className="text-sm text-gray-500">
              Compared to last week
            </span>

          </div>

          {/* Progress */}

          <div className="mt-5">

            <div className="h-3 rounded-full bg-[#F2E8E2] overflow-hidden">

              <div
                className="h-full rounded-full bg-[#6A3F2D]"
                style={{ width: `${billing.growth * 4}%` }}
              />

            </div>

          </div>

        </BusinessCard>

      </div>
    </DashboardCard>
  );
};

export default BillingDetails;