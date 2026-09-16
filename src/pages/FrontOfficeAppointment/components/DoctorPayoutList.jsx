import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadVisitingDoctorPayouts,
  loadAssociateDoctorPayouts,
} from "../../../redux/frontOffice/frontOfficeBillingThunk";

const DoctorPayoutList = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isVisiting = type === "visiting";

  const title = isVisiting
    ? "Visiting Doctor payouts"
    : "Associate Doctor payouts";

  const basePath = isVisiting
    ? "/frontoffice/billing/visiting-doctor-payouts"
    : "/frontoffice/billing/associate-doctor-payouts";

  const {
    data,
    loading,
    error,
    total,
    pagination,
  } = useSelector((state) => {
    const billing = state.frontOfficeBilling;

    return {
      data: isVisiting
        ? billing.visitingDoctorPayouts
        : billing.associateDoctorPayouts,

      loading: isVisiting
        ? billing.visitingDoctorPayoutsLoading
        : billing.associateDoctorPayoutsLoading,

      error: isVisiting
        ? billing.visitingDoctorPayoutsError
        : billing.associateDoctorPayoutsError,

      total: isVisiting
        ? billing.visitingDoctorPayoutsTotal
        : billing.associateDoctorPayoutsTotal,

      pagination: isVisiting
        ? billing.visitingDoctorPayoutsPagination
        : billing.associateDoctorPayoutsPagination,
    };
  });

  const page =
    pagination?.current_page || 1;

  const limit =
    pagination?.per_page || 8;

  useEffect(() => {
    if (isVisiting) {
      dispatch(
        loadVisitingDoctorPayouts({
          page,
          limit,
        })
      );
    } else {
      dispatch(
        loadAssociateDoctorPayouts({
          page,
          limit,
        })
      );
    }
  }, [dispatch, isVisiting, page, limit]);

  const handlePageChange = (newPage) => {
    if (isVisiting) {
      dispatch(
        loadVisitingDoctorPayouts({
          page: newPage,
          limit,
        })
      );
    } else {
      dispatch(
        loadAssociateDoctorPayouts({
          page: newPage,
          limit,
        })
      );
    }
  };

  return (
    <DashboardLayout role="frontoffice">
      <div className="min-h-screen bg-white px-6 py-5 text-[#4B2E2A]">

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-[18px] font-semibold">
          <span>Billing Details</span>

          <span className="text-[#8A817B]">
            ›
          </span>

          <span>{title}</span>
        </div>

        {/* Total */}
        <p className="mb-8 text-[14px] text-[#6F6863]">
          {total} Total Pending Payouts
        </p>

        {/* Pagination text */}
        <div className="mb-5 flex items-center justify-end gap-4 text-[12px] text-[#7D726B]">
          <span>
            {pagination?.start_index || 0} -{" "}
            {pagination?.end_index || 0} of{" "}
            {total}
          </span>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                handlePageChange(page - 1)
              }
              className="px-2 text-[20px] disabled:opacity-30"
            >
              ‹
            </button>

            <button
              type="button"
              disabled={
                page >=
                (pagination?.total_pages || 1)
              }
              onClick={() =>
                handlePageChange(page + 1)
              }
              className="px-2 text-[20px] disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[16px] border border-[#E8DDD6]">

          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.6fr] border-b border-[#E8DDD6] bg-[#FFF9F4]">

            <div className="px-4 py-3 text-[12px] font-medium">
              Doctor
            </div>

            <div className="border-l border-[#E8DDD6] px-4 py-3 text-center text-[12px] font-medium">
              Consultation
              <br />
              (₹)
            </div>

            <div className="border-l border-[#E8DDD6] px-4 py-3 text-center text-[12px] font-medium">
              Referral (₹)
            </div>

            <div className="border-l border-[#E8DDD6] px-4 py-3 text-center text-[12px] font-medium">
              Medicines (₹)
            </div>

            <div className="border-l border-[#E8DDD6] px-4 py-3 text-center text-[12px] font-medium">
              Total
              <br />
              Amount (₹)
            </div>

            <div className="border-l border-[#E8DDD6] px-4 py-3 text-center text-[12px] font-medium">
              Actions
            </div>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-[12px] text-[#7D726B]">
              Loading payouts...
            </div>
          ) : error ? (
            <div className="px-5 py-12 text-center text-[12px] text-red-600">
              Failed to load payouts.
            </div>
          ) : data.length === 0 ? (
            <div className="px-5 py-12 text-center text-[12px] text-[#7D726B]">
              No pending payouts found.
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.doctor_id}
                className="grid min-h-[92px] grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.6fr] border-b border-[#EEE4DD] last:border-b-0"
              >
                {/* Doctor */}
                <div className="px-4 py-5">
                  <p className="text-[13px] font-semibold">
                    {item.doctor?.doctor_name ||
                      item.doctor?.name ||
                      "--"}
                  </p>

                  <p className="mt-1 text-[11px] text-[#81756E]">
                    Doctor ID:{" "}
                    {item.doctor?.doctor_code ||
                      item.doctor_id ||
                      "--"}
                  </p>
                </div>

                {/* Consultation */}
                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 text-[13px] font-semibold">
                  {item.formatted_consultation ||
                    "-"}
                </div>

                {/* Referral */}
                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 text-[13px] font-semibold">
                  {item.formatted_referral || "-"}
                </div>

                {/* Medicines */}
                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 text-[13px] font-semibold">
                  {item.formatted_medicines || "-"}
                </div>

                {/* Total */}
                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 text-[13px] font-semibold">
                  {item.formatted_total || "0"}
                </div>

                {/* Action */}
                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `${basePath}/${item.doctor_id}`
                      )
                    }
                    className="w-full rounded-full border border-[#E6D5C5] bg-[#FFFDF9] px-4 py-2 text-[12px] font-semibold text-[#4B2E2A] shadow-sm transition hover:bg-[#FFF8F0]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorPayoutList;