import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  loadReferralList,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";
import DashboardLayout from "../../../components/Layout/DashboardLayout";



const ReferralList = () => {
  const dispatch = useDispatch();

  const {
    referralList = [],
    referralLoading = false,
    referralError = null,
  } = useSelector(
    (state) => state.frontOfficeAppointment || {}
  );

  const [page, setPage] = useState(1);

  const limit = 12;

  // ==========================================
  // LOAD REFERRALS
  // ==========================================

  useEffect(() => {
    dispatch(loadReferralList());
  }, [dispatch]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalRecords = referralList.length;

  const totalPages =
    Math.ceil(totalRecords / limit) || 1;

  const startIndex = (page - 1) * limit;

  const paginatedReferrals = referralList.slice(
    startIndex,
    startIndex + limit
  );

  const startRecord =
    totalRecords === 0
      ? 0
      : startIndex + 1;

  const endRecord = Math.min(
    startIndex + limit,
    totalRecords
  );

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS
  // ==========================================

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (
      value === "issued" ||
      value === "active" ||
      value === "completed" ||
      value === "confirmed"
    ) {
      return "bg-[#e9f9ed] text-[#27663a]";
    }

    if (
      value === "pending" ||
      value === "waiting" ||
      value === "booked"
    ) {
      return "bg-[#fff3e5] text-[#795238]";
    }

    return "bg-[#f3f0ee] text-[#665650]";
  };

  return (
    <DashboardLayout role="frontoffice">

      <div className="w-full">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex items-start justify-between mb-6">

          <div>

            <h2 className="text-[24px] font-semibold text-[#3f261d]">
              Referral Codes
            </h2>

            <p className="mt-2 text-[16px] text-[#6f4f43]">
              View and manage all referral codes applied
            </p>

          </div>

          {/* PAGINATION TOP RIGHT */}

          <div className="flex items-center gap-5 mt-8">

            <span className="text-[14px] text-[#6f6f6f] whitespace-nowrap">
              Showing Referrals{" "}
              {startRecord} - {endRecord} of{" "}
              {totalRecords}
            </span>

            <button
              type="button"
              onClick={handlePrevious}
              disabled={page === 1}
              className={`text-[28px] leading-none ${
                page === 1
                  ? "text-[#d5c9c4] cursor-not-allowed"
                  : "text-[#8b4f32] cursor-pointer"
              }`}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={page >= totalPages}
              className={`text-[28px] leading-none ${
                page >= totalPages
                  ? "text-[#d5c9c4] cursor-not-allowed"
                  : "text-[#8b4f32] cursor-pointer"
              }`}
            >
              ›
            </button>

          </div>

        </div>


        {/* ======================================
            TABLE
        ====================================== */}

        <div className="w-full overflow-x-auto overflow-hidden rounded-[16px] border border-[#eadfd9]">

          <table className="w-full min-w-[1100px] border-collapse table-fixed">

            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[20%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[11%]" />
              <col className="w-[5%]" />
            </colgroup>


            {/* ==================================
                TABLE HEADER
            ================================== */}

            <thead>

              <tr className="bg-[#fff9f5]">

                <th className="px-5 py-4 text-left text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9] whitespace-nowrap">
                  Patient Name
                </th>

                <th className="px-5 py-4 text-left text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9] whitespace-nowrap">
                  Referred By
                </th>

                <th className="px-5 py-4 text-center text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9] whitespace-nowrap">
                  Referral Code
                </th>

                <th className="px-5 py-4 text-center text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9] whitespace-nowrap">
                  Referral Date
                </th>

                <th className="px-5 py-4 text-center text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9] whitespace-nowrap">
                  Appointment Date
                </th>

                <th className="px-5 py-4 text-center text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9] whitespace-nowrap">
                  Benefit Status
                </th>

                <th className="px-5 py-4 text-center text-[13px] font-medium text-[#57372c] whitespace-nowrap">
                  Actions
                </th>

              </tr>

            </thead>


            {/* ==================================
                TABLE BODY
            ================================== */}

            <tbody>

              {referralLoading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="py-12 text-center text-[14px] text-[#75655f]"
                  >
                    Loading referral records...
                  </td>

                </tr>

              ) : referralError ? (

                <tr>

                  <td
                    colSpan="7"
                    className="py-12 text-center text-[14px] text-red-600"
                  >
                    {typeof referralError === "string"
                      ? referralError
                      : "Failed to load referral records"}
                  </td>

                </tr>

              ) : paginatedReferrals.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="py-12 text-center text-[14px] text-[#75655f]"
                  >
                    No referral records found
                  </td>

                </tr>

              ) : (

                paginatedReferrals.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t border-[#eadfd9] hover:bg-[#fffaf7]"
                  >

                    {/* ==============================
                        PATIENT NAME
                    ============================== */}

                    <td className="px-5 py-4 align-middle border-r border-[#eadfd9]">

                      <div className="flex flex-col">

                        <p className="text-[14px] font-semibold text-[#4b2b21] truncate">
                          {item.patient_name || "—"}
                        </p>

                        <p className="mt-1 text-[12px] text-[#77706d]">
                          Patient ID:{" "}
                          {item.patient_id || "—"}
                        </p>

                      </div>

                    </td>


                    {/* ==============================
                        REFERRED BY
                    ============================== */}

                    <td className="px-5 py-4 align-middle border-r border-[#eadfd9]">

                      <div className="flex flex-col">

                        <p className="text-[14px] font-semibold text-[#4b2b21] truncate">
                          {item.referred_by ||
                            item.referred_by_name ||
                            item.referred_by_id ||
                            "—"}
                        </p>

                        <p className="mt-1 text-[12px] text-[#77706d]">
                          Patient ID:{" "}
                          {item.referred_by_id || "—"}
                        </p>

                      </div>

                    </td>


                    {/* ==============================
                        REFERRAL CODE
                    ============================== */}

                    <td className="px-5 py-4 text-center align-middle border-r border-[#eadfd9]">

                      <span className="inline-flex items-center justify-center text-[14px] font-semibold text-[#4b2b21] whitespace-nowrap">
                        {item.referral_code || "—"}
                      </span>

                    </td>


                    {/* ==============================
                        REFERRAL DATE
                    ============================== */}

                    <td className="px-5 py-4 text-center align-middle border-r border-[#eadfd9]">

                      <span className="text-[13px] font-semibold text-[#4b2b21] whitespace-nowrap">
                        {formatDate(item.referral_date)}
                      </span>

                    </td>


                    {/* ==============================
                        APPOINTMENT DATE
                    ============================== */}

                    <td className="px-5 py-4 text-center align-middle border-r border-[#eadfd9]">

                      <span className="text-[13px] font-semibold text-[#4b2b21] whitespace-nowrap">
                        {formatDate(item.appointment_date)}
                      </span>

                    </td>


                    {/* ==============================
                        BENEFIT STATUS
                    ============================== */}

                    <td className="px-5 py-4 text-center align-middle border-r border-[#eadfd9]">

                      <div className="flex flex-col items-center justify-center gap-1">

                        <span
                          className={`inline-flex items-center justify-center rounded-[8px] px-3 py-1 text-[12px] font-medium whitespace-nowrap ${getStatusStyle(
                            item.benefit_status_display
                          )}`}
                        >
                          {item.benefit_status_display ||
                            item.benefit_status ||
                            "—"}
                        </span>

                        {item.benefit_amount !==
                          undefined &&
                          item.benefit_amount !==
                            null && (

                          <span className="text-[12px] text-[#77706d] whitespace-nowrap">
                            ₹
                            {Number(
                              item.benefit_amount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        )}

                      </div>

                    </td>


                    {/* ==============================
                        ACTION
                    ============================== */}

                    <td className="px-5 py-4 text-center align-middle">

                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[22px] leading-none text-[#4b2b21] hover:bg-[#f5ebe6] cursor-pointer"
                      >
                        ⋮
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default ReferralList;