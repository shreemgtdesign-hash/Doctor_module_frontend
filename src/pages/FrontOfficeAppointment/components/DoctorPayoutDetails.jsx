import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadVisitingDoctorPayoutDetails,
  loadAssociateDoctorPayoutDetails,
} from "../../../redux/frontOffice/frontOfficeBillingThunk";

const DoctorPayoutDetails = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctorId } = useParams();

  const isVisiting = type === "visiting";

  const title = isVisiting
    ? "Visiting Doctor payouts"
    : "Associate Doctor payouts";

  const listPath = isVisiting
    ? "/frontoffice/billing/visiting-doctor-payouts"
    : "/frontoffice/billing/associate-doctor-payouts";

  const {
    details,
    loading,
    error,
  } = useSelector((state) => {
    const billing = state.frontOfficeBilling;

    return {
      details: isVisiting
        ? billing.visitingDoctorPayoutDetails
        : billing.associateDoctorPayoutDetails,

      loading: isVisiting
        ? billing.visitingDoctorPayoutDetailsLoading
        : billing.associateDoctorPayoutDetailsLoading,

      error: isVisiting
        ? billing.visitingDoctorPayoutDetailsError
        : billing.associateDoctorPayoutDetailsError,
    };
  });

  useEffect(() => {
    if (!doctorId) return;

    if (isVisiting) {
      dispatch(
        loadVisitingDoctorPayoutDetails(
          doctorId
        )
      );
    } else {
      dispatch(
        loadAssociateDoctorPayoutDetails(
          doctorId
        )
      );
    }
  }, [dispatch, doctorId, isVisiting]);

  if (loading) {
    return (
      <DashboardLayout role="frontoffice">
        <div className="flex min-h-[500px] items-center justify-center text-[13px] text-[#7D726B]">
          Loading payout details...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !details) {
    return (
      <DashboardLayout role="frontoffice">
        <div className="px-6 py-6 text-[13px] text-red-600">
          Failed to load payout details.
        </div>
      </DashboardLayout>
    );
  }

  const doctor = details.doctor;
  const metrics = details.metrics;
  const summary = details.payout_summary;

  const table = details.payouts_table;

  return (
    <DashboardLayout role="frontoffice">
      <div className="min-h-screen bg-white px-6 py-5 text-[#4B2E2A]">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-[18px] font-semibold">

          <button
            type="button"
            onClick={() => navigate("/frontoffice/dashboard")}
            className="hover:text-[#8A4F32]"
          >
            Billing Details
          </button>

          <span className="text-[#8A817B]">
            ›
          </span>

          <button
            type="button"
            onClick={() => navigate(listPath)}
            className="hover:text-[#8A4F32]"
          >
            {title}
          </button>

          <span className="text-[#8A817B]">
            ›
          </span>

          <span>
            {doctor?.doctor_name ||
              doctor?.name ||
              "--"}
          </span>
        </div>

        {/* Top section */}
        <div className="grid grid-cols-[1fr_300px] gap-5">

          {/* Doctor card */}
          <div className="overflow-hidden rounded-[16px] border border-[#E8DDD6]">

            {/* Doctor information */}
            <div className="flex items-center px-4 py-4">

              <div className="h-[64px] w-[64px] overflow-hidden rounded-[16px] border border-[#E8DDD6] bg-[#F1F1F1]">
                {doctor?.profile_image ? (
                  <img
                    src={doctor.profile_image}
                    alt={doctor.doctor_name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="ml-4">
                <h2 className="text-[16px] font-semibold">
                  {doctor?.doctor_name ||
                    doctor?.name ||
                    "--"}
                </h2>

                <p className="mt-1 text-[12px] text-[#81756E]">
                  {doctor?.qualification ||
                    "--"}
                  {doctor?.specialization
                    ? ` | ${doctor.specialization}`
                    : ""}
                </p>
              </div>

              <div className="ml-auto border-l border-[#EEE4DD] pl-6 pr-4">
                <p className="text-[13px] font-semibold">
                  {doctor?.mobile || "--"}
                </p>

                <p className="mt-1 text-[11px] text-[#81756E]">
                  {doctor?.email || "--"}
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 border-t border-[#E8DDD6]">

              <Metric
                label="Consultations"
                count={metrics?.consultations?.count}
                amount={metrics?.consultations?.formatted_amount}
              />

              <Metric
                label="Treatments"
                count={metrics?.treatments?.count}
                amount={metrics?.treatments?.formatted_amount}
              />

              <Metric
                label="Prescriptions"
                count={metrics?.prescriptions?.count}
                amount={metrics?.prescriptions?.formatted_amount}
              />

              <Metric
                label="Referrals"
                count={metrics?.referrals?.count}
                amount={metrics?.referrals?.formatted_amount}
              />

            </div>
          </div>

          {/* Payment summary */}
          <div className="rounded-[16px] border border-[#E8DDD6] p-4">

            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium">
                Amount to be paid
              </span>

              <span className="text-[14px] font-semibold">
                {summary?.formatted_amount_to_be_paid ||
                  "₹0"}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between border-b border-[#EEE4DD] pb-4">
              <span className="text-[12px] font-medium">
                Deductions
              </span>

              <span className="text-[13px] font-semibold">
                {summary?.formatted_deductions ||
                  "₹ 0"}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[13px] font-semibold">
                Total
              </span>

              <span className="text-[15px] font-semibold">
                {summary?.formatted_total ||
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

        {/* Payout table */}
        <div className="mt-6">

          <div className="mb-4 flex justify-end text-[12px] text-[#7D726B]">
            {table?.showing_text}
          </div>

          <div className="overflow-hidden rounded-[16px] border border-[#E8DDD6]">

            <div className="grid grid-cols-[1.4fr_1.2fr_1.2fr_1fr_.7fr_.7fr_.8fr] border-b border-[#E8DDD6] bg-[#FFF9F4]">

              <Header>Patient Details</Header>

              <Header>Date and Time</Header>

              <Header>Head Doctor</Header>

              <Header>Payout Category</Header>

              <Header>Price (₹)</Header>

              <Header>
                Commission
                <br />
                (%)
              </Header>

              <Header>
                Total
                <br />
                Amount (₹)
              </Header>

            </div>

            {table?.items?.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1.4fr_1.2fr_1.2fr_1fr_.7fr_.7fr_.8fr] border-b border-[#EEE4DD] last:border-b-0"
              >

                {/* Patient */}
                <div className="px-4 py-4">
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
                <div className="px-4 py-4">
                  <p className="text-[12px] font-semibold">
                    {item.date_time?.date ||
                      "--"}
                  </p>

                  <p className="mt-1 text-[10px] text-[#81756E]">
                    {item.date_time?.time ||
                      "--"}
                  </p>
                </div>

                {/* Head doctor */}
                <div className="px-4 py-4 text-[12px] font-semibold">
                  {item.head_doctor || "--"}
                </div>

                {/* Category */}
                <div className="flex items-center px-4 py-4">
                  <span className="rounded-full bg-[#FFF7EC] px-3 py-1 text-[10px]">
                    {item.payout_category || "--"}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-center px-3 py-4 text-[12px] font-semibold">
                  {item.formatted_price || "0"}
                </div>

                {/* Commission */}
                <div className="flex items-center justify-center px-3 py-4 text-[12px] font-semibold">
                  {item.commission_percent || "-"}
                </div>

                {/* Total */}
                <div className="flex items-center justify-center px-3 py-4 text-[12px] font-semibold">
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


/* =========================================================
   SMALL COMPONENTS
========================================================= */

const Metric = ({
  label,
  count,
  amount,
}) => (
  <div className="border-r border-[#EEE4DD] px-4 py-3 text-center last:border-r-0">
    <p className="text-[12px] font-medium">
      {label}
    </p>

    <p className="mt-1 text-[16px] font-semibold">
      {count ?? 0}
    </p>

    <p className="mt-1 text-[11px] text-[#81756E]">
      {amount || "₹0"}
    </p>
  </div>
);


const Header = ({ children }) => (
  <div className="px-3 py-3 text-center text-[11px] font-medium">
    {children}
  </div>
);

export default DoctorPayoutDetails;