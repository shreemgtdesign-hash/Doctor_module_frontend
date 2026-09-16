import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadAssociateDoctorPayoutDetails,
} from "../../../redux/frontOffice/frontOfficeBillingThunk";

const AssociateDoctorPayoutDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctorId } = useParams();

  const {
    associateDoctorPayoutDetails,
    associateDoctorPayoutDetailsLoading,
    associateDoctorPayoutDetailsError,
  } = useSelector(
    (state) => state.frontOfficeBilling
  );

  useEffect(() => {
    if (!doctorId) return;

    dispatch(
      loadAssociateDoctorPayoutDetails(doctorId)
    );
  }, [dispatch, doctorId]);

  if (associateDoctorPayoutDetailsLoading) {
    return (
      <DashboardLayout role="frontoffice">
        <div className="flex min-h-[500px] items-center justify-center text-[13px] text-[#81756E]">
          Loading payout details...
        </div>
      </DashboardLayout>
    );
  }

  if (
    associateDoctorPayoutDetailsError ||
    !associateDoctorPayoutDetails
  ) {
    return (
      <DashboardLayout role="frontoffice">
        <div className="px-6 py-6 text-[13px] text-red-600">
          Failed to load payout details.
        </div>
      </DashboardLayout>
    );
  }

  const doctor =
    associateDoctorPayoutDetails.doctor;

  const metrics =
    associateDoctorPayoutDetails.metrics;

  const payoutSummary =
    associateDoctorPayoutDetails.payout_summary;

  const payoutsTable =
    associateDoctorPayoutDetails.payouts_table;

  return (
    <DashboardLayout role="frontoffice">
      <div className="min-h-screen bg-white px-6 py-5 text-[#4B2E2A]">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="mb-6 flex items-center gap-3">

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

          <button
            type="button"
            onClick={() =>
              navigate(
                "/frontoffice/billing/associate-doctor-payouts"
              )
            }
            className="text-[18px] font-semibold hover:text-[#8A4F32]"
          >
            Associate Doctor payouts
          </button>

          <span className="text-[24px] text-[#8A817B]">
            ›
          </span>

          <span className="text-[18px] font-semibold">
            {doctor?.doctor_name || "--"}
          </span>

        </div>


        {/* =================================================
            TOP SECTION
        ================================================= */}

        <div className="grid grid-cols-[1fr_300px] gap-5">

          {/* =================================================
              DOCTOR INFORMATION CARD
          ================================================= */}

          <div className="overflow-hidden rounded-[16px] border border-[#E8DDD6]">

            <div className="flex items-center px-4 py-4">

              {/* Doctor image */}

              <div className="h-[64px] w-[64px] overflow-hidden rounded-[16px] border border-[#E8DDD6] bg-[#F1F1F1]">

                {doctor?.profile_image && (
                  <img
                    src={doctor.profile_image}
                    alt={doctor.doctor_name}
                    className="h-full w-full object-cover"
                  />
                )}

              </div>


              {/* Doctor name */}

              <div className="ml-4">

                <h2 className="text-[16px] font-semibold">
                  {doctor?.doctor_name || "--"}
                </h2>

                <p className="mt-1 text-[12px] text-[#81756E]">
                  {doctor?.qualification || "--"}

                  {doctor?.specialization
                    ? ` | ${doctor.specialization}`
                    : ""}
                </p>

              </div>


              {/* Contact */}

              <div className="ml-auto border-l border-[#EEE4DD] pl-6 pr-4">

                <p className="text-[13px] font-semibold">
                  {doctor?.mobile || "--"}
                </p>

                <p className="mt-1 text-[11px] text-[#81756E]">
                  {doctor?.email || "--"}
                </p>

              </div>

            </div>


            {/* =================================================
                METRICS
            ================================================= */}

            <div className="grid grid-cols-4 border-t border-[#E8DDD6]">

              {/* Consultations */}

              <div className="border-r border-[#EEE4DD] px-4 py-3 text-center">

                <p className="text-[12px] font-medium">
                  Consultations
                </p>

                <p className="mt-1 text-[16px] font-semibold">
                  {metrics?.consultations?.count || 0}
                </p>

                <p className="mt-1 text-[11px] text-[#81756E]">
                  {metrics?.consultations?.formatted_amount ||
                    "₹0"}
                </p>

              </div>


              {/* Treatments */}

              <div className="border-r border-[#EEE4DD] px-4 py-3 text-center">

                <p className="text-[12px] font-medium">
                  Treatments
                </p>

                <p className="mt-1 text-[16px] font-semibold">
                  {metrics?.treatments?.count || 0}
                </p>

                <p className="mt-1 text-[11px] text-[#81756E]">
                  {metrics?.treatments?.formatted_amount ||
                    "₹0"}
                </p>

              </div>


              {/* Prescriptions */}

              <div className="border-r border-[#EEE4DD] px-4 py-3 text-center">

                <p className="text-[12px] font-medium">
                  Prescriptions
                </p>

                <p className="mt-1 text-[16px] font-semibold">
                  {metrics?.prescriptions?.count || 0}
                </p>

                <p className="mt-1 text-[11px] text-[#81756E]">
                  {metrics?.prescriptions?.formatted_amount ||
                    "₹0"}
                </p>

              </div>


              {/* Referrals */}

              <div className="px-4 py-3 text-center">

                <p className="text-[12px] font-medium">
                  Referrals
                </p>

                <p className="mt-1 text-[16px] font-semibold">
                  {metrics?.referrals?.count || 0}
                </p>

                <p className="mt-1 text-[11px] text-[#81756E]">
                  {metrics?.referrals?.formatted_amount ||
                    "₹0"}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              PAYMENT SUMMARY
          ================================================= */}

          <div className="rounded-[16px] border border-[#E8DDD6] p-4">

            <div className="flex items-center justify-between">

              <span className="text-[12px] font-medium">
                Amount to be paid
              </span>

              <span className="text-[14px] font-semibold">
                {payoutSummary?.formatted_amount_to_be_paid ||
                  "₹0"}
              </span>

            </div>


            <div className="mt-5 flex items-center justify-between border-b border-[#EEE4DD] pb-4">

              <span className="text-[12px] font-medium">
                Deductions
              </span>

              <span className="text-[13px] font-semibold">
                {payoutSummary?.formatted_deductions ||
                  "₹ 0"}
              </span>

            </div>


            <div className="mt-4 flex items-center justify-between">

              <span className="text-[13px] font-semibold">
                Total
              </span>

              <span className="text-[15px] font-semibold">
                {payoutSummary?.formatted_total ||
                  "₹0"}
              </span>

            </div>


            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center rounded-[14px] bg-[#8A4F32] px-4 py-3 text-[12px] font-semibold text-white"
            >
              💳 Process Payment
            </button>

          </div>

        </div>


        {/* =================================================
            PAYOUT TABLE
        ================================================= */}

        <div className="mt-6">

          <div className="mb-4 flex justify-end text-[12px] text-[#7D726B]">
            {payoutsTable?.showing_text}
          </div>


          <div className="overflow-hidden rounded-[16px] border border-[#E8DDD6]">

            {/* Table header */}

            <div className="grid grid-cols-[1.4fr_1.2fr_1.2fr_1fr_.7fr_.7fr_.8fr] border-b border-[#E8DDD6] bg-[#FFF9F4]">

              <div className="px-3 py-3 text-[11px] font-medium">
                Patient Details
              </div>

              <div className="border-l border-[#E8DDD6] px-3 py-3 text-[11px] font-medium">
                Date and Time
              </div>

              <div className="border-l border-[#E8DDD6] px-3 py-3 text-[11px] font-medium">
                Head Doctor
              </div>

              <div className="border-l border-[#E8DDD6] px-3 py-3 text-[11px] font-medium">
                Payout Category
              </div>

              <div className="border-l border-[#E8DDD6] px-3 py-3 text-center text-[11px] font-medium">
                Price (₹)
              </div>

              <div className="border-l border-[#E8DDD6] px-3 py-3 text-center text-[11px] font-medium">
                Commission
                <br />
                (%)
              </div>

              <div className="border-l border-[#E8DDD6] px-3 py-3 text-center text-[11px] font-medium">
                Total
                <br />
                Amount (₹)
              </div>

            </div>


            {/* Table rows */}

            {payoutsTable?.items?.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1.4fr_1.2fr_1.2fr_1fr_.7fr_.7fr_.8fr] border-b border-[#EEE4DD] last:border-b-0"
              >

                {/* Patient */}

                <div className="px-3 py-4">

                  <p className="text-[12px] font-semibold">
                    {item.patient_details?.patient_name ||
                      item.patient_details?.name ||
                      "--"}
                  </p>

                  <p className="mt-1 text-[10px] text-[#81756E]">
                    Patient ID:{" "}
                    {item.patient_details?.patient_id ||
                      "--"}
                  </p>

                </div>


                {/* Date */}

                <div className="border-l border-[#EEE4DD] px-3 py-4">

                  <p className="text-[12px] font-semibold">
                    {item.date_time?.date || "--"}
                  </p>

                  <p className="mt-1 text-[10px] text-[#81756E]">
                    {item.date_time?.time || "--"}
                  </p>

                </div>


                {/* Head Doctor */}

                <div className="border-l border-[#EEE4DD] px-3 py-4 text-[12px] font-semibold">
                  {item.head_doctor || "--"}
                </div>


                {/* Category */}

                <div className="flex items-center border-l border-[#EEE4DD] px-3 py-4">

                  <span className="rounded-full bg-[#FFF7EC] px-3 py-1 text-[10px]">
                    {item.payout_category || "--"}
                  </span>

                </div>


                {/* Price */}

                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 py-4 text-[12px] font-semibold">
                  {item.formatted_price || "0"}
                </div>


                {/* Commission */}

                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 py-4 text-[12px] font-semibold">
                  {item.commission_percent || "-"}
                </div>


                {/* Total */}

                <div className="flex items-center justify-center border-l border-[#EEE4DD] px-3 py-4 text-[12px] font-semibold">
                  {item.formatted_total || "0"}
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AssociateDoctorPayoutDetails;