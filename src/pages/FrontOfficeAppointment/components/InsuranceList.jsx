import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  loadInsuranceList,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";
import DashboardLayout from "../../../components/Layout/DashboardLayout";

// Use the same DashboardLayout import path used by your other pages


const InsuranceList = () => {
  const dispatch = useDispatch();

  const {
    insuranceList = [],
    insuranceLoading = false,
    insuranceError = null,
    insuranceTotal = 0,
  } = useSelector(
    (state) => state.frontOfficeAppointment
  );

  const [insuranceType, setInsuranceType] = useState("all");
  const [page, setPage] = useState(1);

  const limit = 12;

  useEffect(() => {
   dispatch(
    loadInsuranceList(
    
      insuranceType === "all"
        ? ""
        : insuranceType
    )

    );
  }, [dispatch, insuranceType, page]);

  const handleTypeChange = (type) => {
    setInsuranceType(type);
    setPage(1);
  };

  const totalPages =
    Math.ceil(insuranceTotal / limit) || 1;

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

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout role="frontoffice">

      <div className="w-full px-6 py-6">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">

          <div>
            <h2 className="text-[24px] font-semibold text-[#3f261d]">
              Insurance
            </h2>

            <p className="mt-2 text-[16px] text-[#6f5a52]">
              View and manage in-house and external insurance policies.
            </p>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center gap-5 mt-8">

            <span className="text-[14px] text-[#6f6f6f]">
              Showing Patients{" "}
              {insuranceTotal === 0
                ? 0
                : (page - 1) * limit + 1}{" "}
              -{" "}
              {Math.min(page * limit, insuranceTotal)}{" "}
              of {insuranceTotal}
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


        {/* TABS */}
        <div className="flex items-center gap-10 border-b border-[#eadfd9] mb-4">

          <button
            type="button"
            onClick={() => handleTypeChange("all")}
            className={`pb-3 text-[16px] font-medium ${
              insuranceType === "all"
                ? "text-[#4b2b21] border-b-2 border-[#6f3f2b]"
                : "text-[#b8aaa5]"
            }`}
          >
            All Policies
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("in-house")}
            className={`pb-3 text-[16px] font-medium ${
              insuranceType === "in-house"
                ? "text-[#4b2b21] border-b-2 border-[#6f3f2b]"
                : "text-[#b8aaa5]"
            }`}
          >
            In-house Policies
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("external")}
            className={`pb-3 text-[16px] font-medium ${
              insuranceType === "external"
                ? "text-[#4b2b21] border-b-2 border-[#6f3f2b]"
                : "text-[#b8aaa5]"
            }`}
          >
            External Policies
          </button>

        </div>


        {/* TABLE */}
        <div className="w-full overflow-x-auto rounded-[16px] border border-[#eadfd9]">

          <table className="w-full table-fixed border-collapse">

            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[13%]" />
              <col className="w-[15%]" />
              <col className="w-[13%]" />
              <col className="w-[11%]" />
              <col className="w-[8%]" />
            </colgroup>

            <thead>
              <tr className="bg-[#fff9f5]">

                <th className="px-4 py-4 text-left text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9]">
                  Patient Name
                </th>

                <th className="px-4 py-4 text-left text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9]">
                  Insurance Provider
                </th>

                <th className="px-4 py-4 text-center text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9]">
                  Insurance Type
                </th>

                <th className="px-4 py-4 text-left text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9]">
                  Policy number
                </th>

                <th className="px-4 py-4 text-center text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9]">
                  Valid till
                </th>

                <th className="px-4 py-4 text-center text-[13px] font-medium text-[#57372c] border-r border-[#eadfd9]">
                  Status
                </th>

                <th className="px-4 py-4 text-center text-[13px] font-medium text-[#57372c]">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody>

              {insuranceLoading ? (

                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-[14px] text-[#75655f]"
                  >
                    Loading insurance records...
                  </td>
                </tr>

              ) : insuranceError ? (

                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-[14px] text-red-600"
                  >
                    {typeof insuranceError === "string"
                      ? insuranceError
                      : "Failed to load insurance records"}
                  </td>
                </tr>

              ) : insuranceList.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-[14px] text-[#75655f]"
                  >
                    No insurance records found
                  </td>
                </tr>

              ) : (

                insuranceList.map((insurance) => (

                  <tr
                    key={insurance.id}
                    className="border-t border-[#eadfd9] align-middle"
                  >

                    {/* PATIENT */}
                    <td className="px-4 py-4 border-r border-[#eadfd9]">

                      <p className="text-[15px] font-semibold text-[#4b2b21] truncate">
                        {insurance.patient_name || "N/A"}
                      </p>

                      <p className="mt-1 text-[13px] text-[#77706d] truncate">
                        Patient ID: {insurance.patient_id || "N/A"}
                      </p>

                    </td>


                    {/* PROVIDER */}
                    <td className="px-4 py-4 border-r border-[#eadfd9]">

                      <p className="text-[15px] font-semibold text-[#4b2b21] truncate">
                        {insurance.insurance_provider || "N/A"}
                      </p>

                    </td>


                    {/* TYPE */}
                    <td className="px-4 py-4 text-center border-r border-[#eadfd9]">

                      <span className="text-[14px] font-semibold text-[#4b2b21]">
                        {insurance.insurance_type || "N/A"}
                      </span>

                    </td>


                    {/* POLICY */}
                    <td className="px-4 py-4 border-r border-[#eadfd9]">

                      <span className="text-[14px] font-semibold text-[#4b2b21] break-words">
                        {insurance.policy_number || "N/A"}
                      </span>

                    </td>


                    {/* VALID TILL */}
                    <td className="px-4 py-4 text-center border-r border-[#eadfd9]">

                      <span className="text-[14px] font-semibold text-[#4b2b21] whitespace-nowrap">
                        {formatDate(insurance.valid_till)}
                      </span>

                    </td>


                    {/* STATUS */}
                    <td className="px-4 py-4 text-center border-r border-[#eadfd9]">

                      <span
                        className={`inline-flex items-center justify-center rounded-[8px] px-3 py-1 text-[13px] font-medium whitespace-nowrap ${
                          insurance.status?.toLowerCase() === "active"
                            ? "bg-[#e9f9ed] text-[#27663a]"
                            : "bg-[#fff2e5] text-[#7b4b2c]"
                        }`}
                      >
                        {insurance.status || "N/A"}
                      </span>

                    </td>


                    {/* ACTION */}
                    <td className="px-4 py-4 text-center">

                      <button
                        type="button"
                        className="text-[22px] leading-none text-[#4b2b21]"
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

export default InsuranceList;