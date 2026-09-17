import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadAssociateDoctorPayouts,
} from "../../../redux/frontOffice/frontOfficeBillingThunk";

const AssociateDoctorPayouts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
  associateDoctorPayouts = [],
  associateDoctorPayoutsLoading = false,
  associateDoctorPayoutsError = null,
  associateDoctorPayoutsPagination = null,
  associateDoctorPayoutsTotal = 0,
} = useSelector(
  (state) => state.frontOfficeAppointment
);

  const currentPage =
    associateDoctorPayoutsPagination?.current_page || 1;

  const limit =
    associateDoctorPayoutsPagination?.per_page || 8;

  useEffect(() => {
    dispatch(
      loadAssociateDoctorPayouts({
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, currentPage, limit]);

  const handlePageChange = (page) => {
    if (page < 1) return;

    if (
      page >
      (associateDoctorPayoutsPagination?.total_pages || 1)
    ) {
      return;
    }

    dispatch(
      loadAssociateDoctorPayouts({
        page,
        limit,
      })
    );
  };

  return (
    <DashboardLayout role="frontoffice">
      <div className="min-h-screen bg-white px-6 py-5 text-[#4B2E2A]">

        {/* Breadcrumb */}
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/frontoffice/dashboard")
            }
            className="text-[18px] font-semibold hover:text-[#8A4F32]"
          >
            Billing Details
          </button>

          <span className="text-[24px] text-[#8A817B]">
            ›
          </span>

          <span className="text-[18px] font-semibold">
            Associate Doctor payouts
          </span>
        </div>

        {/* Total */}
        <p className="text-[14px] text-[#6F6863]">
          {associateDoctorPayoutsTotal} Total Pending Payouts
        </p>

        {/* Pagination */}
        <div className="mb-5 mt-8 flex items-center justify-end gap-5 text-[12px] text-[#7D726B]">
          <span>
            Showing Doctors{" "}
            {associateDoctorPayoutsPagination?.start_index || 0}
            {" - "}
            {associateDoctorPayoutsPagination?.end_index || 0}
            {" of "}
            {associateDoctorPayoutsTotal}
          </span>

          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() =>
              handlePageChange(currentPage - 1)
            }
            className="text-[24px] leading-none disabled:opacity-30"
          >
            ‹
          </button>

          <button
            type="button"
            disabled={
              currentPage >=
              (associateDoctorPayoutsPagination?.total_pages || 1)
            }
            onClick={() =>
              handlePageChange(currentPage + 1)
            }
            className="text-[24px] leading-none disabled:opacity-30"
          >
            ›
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[16px] border border-[#E8DDD6]">

          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.7fr] border-b border-[#E8DDD6] bg-[#FFF9F4]">

            <div className="px-4 py-3 text-[12px] font-medium">
              Doctor
            </div>

            <div className="border-l border-[#E8DDD6] px-3 py-3 text-center text-[12px] font-medium">
              Consultation
              <br />
              (₹)
            </div>

            <div className="border-l border-[#E8DDD6] px-3 py-3 text-center text-[12px] font-medium">
              Referral (₹)
            </div>

            <div className="border-l border-[#E8DDD6] px-3 py-3 text-center text-[12px] font-medium">
              Medicines (₹)
            </div>

            <div className="border-l border-[#E8DDD6] px-3 py-3 text-center text-[12px] font-medium">
              Total
              <br />
              Amount (₹)
            </div>

            <div className="border-l border-[#E8DDD6] px-3 py-3 text-center text-[12px] font-medium">
              Actions
            </div>

          </div>

          {associateDoctorPayoutsLoading && (
            <div className="py-12 text-center text-[12px] text-[#81756E]">
              Loading payouts...
            </div>
          )}

          {!associateDoctorPayoutsLoading &&
            associateDoctorPayoutsError && (
              <div className="py-12 text-center text-[12px] text-red-600">
                Failed to load associate doctor payouts.
              </div>
            )}

          {!associateDoctorPayoutsLoading &&
            !associateDoctorPayoutsError &&
            associateDoctorPayouts.length === 0 && (
              <div className="py-12 text-center text-[12px] text-[#81756E]">
                No pending payouts found.
              </div>
            )}

          {!associateDoctorPayoutsLoading &&
            associateDoctorPayouts.map((item) => (
              <div
                key={item.doctor_id}
                className="grid min-h-[92px] grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.7fr] border-b border-[#EEE4DD] last:border-b-0"
              >

                <div className="px-4 py-5">
                  <p className="text-[13px] font-semibold">
                    {item.doctor?.doctor_name ||
                      item.doctor?.name ||
                      "--"}
                  </p>

                  <p className="mt-1 text-[11px] text-[#81756E]">
                    Doctor ID:{" "}
                    {item.doctor?.doctor_code ||
                      item.doctor_id}
                  </p>
                </div>

                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 text-[13px] font-semibold">
                  {item.formatted_consultation || "-"}
                </div>

                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 text-[13px] font-semibold">
                  {item.formatted_referral || "-"}
                </div>

                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 text-[13px] font-semibold">
                  {item.formatted_medicines || "-"}
                </div>

                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 text-[13px] font-semibold">
                  {item.formatted_total || "0"}
                </div>

                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/frontoffice/billing/associate-doctor-payouts/${item.doctor_id}`
                      )
                    }
                    className="w-full rounded-full border border-[#E6D5C5] bg-[#FFFDF9] px-4 py-2.5 text-[12px] font-semibold text-[#4B2E2A] shadow-sm hover:bg-[#FFF8F0]"
                  >
                    View Details
                  </button>
                </div>

              </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssociateDoctorPayouts;