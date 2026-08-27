import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import { loadPackages } from "../../../redux/frontOffice/frontOfficeAppointmentThunk";
import DashboardLayout from "../../../components/Layout/DashboardLayout";

const Packages = () => {
  const dispatch = useDispatch();

  const {
    packages = [],
    packagesLoading = false,
    packagesError = null,
    packagesCount = 0,
  } = useSelector(
    (state) => state.frontOfficeAppointment || {}
  );

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  const limit = 10;

  // ==========================================
  // LOAD PACKAGES
  // ==========================================

  useEffect(() => {
    dispatch(
      loadPackages({
        page,
        limit,
      })
    );
  }, [dispatch, page]);

  // ==========================================
  // FILTER PACKAGES
  // ==========================================

  const filteredPackages = packages.filter((item) => {
    if (activeTab === "all") {
      return true;
    }

    return (
      item.category?.toLowerCase() ===
      activeTab.toLowerCase()
    );
  });

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages =
    Math.ceil(packagesCount / limit) || 1;

  const start =
    packagesCount === 0
      ? 0
      : (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    packagesCount
  );

  return (
    <DashboardLayout role="frontoffice">
      <div className="w-full px-7 py-7">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex items-start justify-between mb-8">

          <div>
            <h1 className="text-[24px] font-semibold text-[#302522] mb-2">
              Packages
            </h1>

            <p className="text-[16px] text-[#67483d]">
              View and manage all healthcare packages.
            </p>
          </div>

          <button
            type="button"
            className="bg-[#8B5035] text-white px-8 py-3 rounded-[14px] text-[15px] font-semibold flex items-center gap-2"
          >
            <span className="text-[21px] leading-none">
              +
            </span>

            Add Patient
          </button>

        </div>


        {/* ======================================
            TABS
        ====================================== */}

        <div className="flex items-center gap-10 border-b border-[#eadfd8]">

          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setPage(1);
            }}
            className={`pb-4 text-[16px] ${
              activeTab === "all"
                ? "text-[#4b2d22] font-semibold border-b-2 border-[#6d3d2b]"
                : "text-[#b6a5a0]"
            }`}
          >
            All Packages
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("healthcare");
              setPage(1);
            }}
            className={`pb-4 text-[16px] ${
              activeTab === "healthcare"
                ? "text-[#4b2d22] font-semibold border-b-2 border-[#6d3d2b]"
                : "text-[#b6a5a0]"
            }`}
          >
            Healthcare
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("wellness");
              setPage(1);
            }}
            className={`pb-4 text-[16px] ${
              activeTab === "wellness"
                ? "text-[#4b2d22] font-semibold border-b-2 border-[#6d3d2b]"
                : "text-[#b6a5a0]"
            }`}
          >
            Wellness
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("beauty");
              setPage(1);
            }}
            className={`pb-4 text-[16px] ${
              activeTab === "beauty"
                ? "text-[#4b2d22] font-semibold border-b-2 border-[#6d3d2b]"
                : "text-[#b6a5a0]"
            }`}
          >
            Beauty
          </button>

        </div>


        {/* ======================================
            PAGINATION TOP
        ====================================== */}

        <div className="flex justify-end items-center gap-6 py-6">

          <span className="text-[14px] text-[#666]">
            Showing Patients {start} - {end} of{" "}
            {packagesCount}
          </span>

          <div className="flex items-center gap-5">

            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              className={`text-[28px] leading-none ${
                page === 1
                  ? "text-[#cbbdb8] cursor-not-allowed"
                  : "text-[#6d3d2b]"
              }`}
            >
              ‹
            </button>

            <span className="text-[14px] font-medium text-[#4b2d22]">
              {page}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className={`text-[28px] leading-none ${
                page >= totalPages
                  ? "text-[#cbbdb8] cursor-not-allowed"
                  : "text-[#6d3d2b]"
              }`}
            >
              ›
            </button>

          </div>

        </div>


        {/* ======================================
            TABLE
        ====================================== */}

        <div className="w-full overflow-x-auto border border-[#eadfd8] rounded-[16px]">

          <table className="w-full min-w-[1200px] border-collapse table-fixed">

            <thead>

              <tr className="bg-[#fffaf6]">

                <th className="w-[16%] text-left px-5 py-4 text-[13px] font-medium text-[#4b2d22] border-r border-b border-[#eadfd8]">
                  Patient Name
                </th>

                <th className="w-[17%] text-left px-5 py-4 text-[13px] font-medium text-[#4b2d22] border-r border-b border-[#eadfd8]">
                  Package Name
                </th>

                <th className="w-[11%] text-left px-5 py-4 text-[13px] font-medium text-[#4b2d22] border-r border-b border-[#eadfd8]">
                  Category
                </th>

                <th className="w-[17%] text-left px-5 py-4 text-[13px] font-medium text-[#4b2d22] border-r border-b border-[#eadfd8]">
                  Amount
                </th>

                <th className="w-[11%] text-left px-5 py-4 text-[13px] font-medium text-[#4b2d22] border-r border-b border-[#eadfd8]">
                  Start Date
                </th>

                <th className="w-[11%] text-left px-5 py-4 text-[13px] font-medium text-[#4b2d22] border-r border-b border-[#eadfd8]">
                  End Date
                </th>

                <th className="w-[10%] text-left px-5 py-4 text-[13px] font-medium text-[#4b2d22] border-r border-b border-[#eadfd8]">
                  Status
                </th>

                <th className="w-[7%] text-center px-4 py-4 text-[13px] font-medium text-[#4b2d22] border-b border-[#eadfd8]">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {packagesLoading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center py-12 text-[#777]"
                  >
                    Loading packages...
                  </td>

                </tr>

              ) : packagesError ? (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center py-12 text-red-500"
                  >
                    {typeof packagesError === "string"
                      ? packagesError
                      : "Failed to load packages"}
                  </td>

                </tr>

              ) : filteredPackages.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center py-12 text-[#777]"
                  >
                    No packages found
                  </td>

                </tr>

              ) : (

                filteredPackages.map((item) => {

                  const isSessionPackage =
                    item.total_sessions;

                  const usedSessions =
                    item.used_sessions || 0;

                  const sessionPercentage =
                    item.total_sessions
                      ? Math.min(
                          (usedSessions /
                            item.total_sessions) *
                            100,
                          100
                        )
                      : 0;

                  const amountPercentage =
                    item.total_amount
                      ? Math.min(
                          ((item.used_amount || 0) /
                            item.total_amount) *
                            100,
                          100
                        )
                      : 0;

                  return (
                    <tr
                      key={
                        item.id ||
                        item.package_id
                      }
                      className="border-b border-[#f0e7e2] last:border-b-0"
                    >

                      {/* =================================
                          PATIENT
                      ================================= */}

                      <td className="px-5 py-5 align-middle border-r border-[#eadfd8]">

                        <div className="font-semibold text-[14px] text-[#4b2d22] mb-1 truncate">
                          {item.patient_name ||
                            "N/A"}
                        </div>

                        <div className="text-[12px] text-[#777] truncate">
                          Patient ID:{" "}
                          {item.patient_id ||
                            "N/A"}
                        </div>

                      </td>


                      {/* =================================
                          PACKAGE
                      ================================= */}

                      <td className="px-5 py-5 align-middle border-r border-[#eadfd8]">

                        <div className="font-semibold text-[14px] text-[#4b2d22] mb-1 truncate">
                          {item.package_name ||
                            "N/A"}
                        </div>

                        <div className="text-[12px] text-[#777] leading-5 break-words">
                          {item.package_description ||
                            item.description ||
                            ""}
                        </div>

                      </td>


                      {/* =================================
                          CATEGORY
                      ================================= */}

                      <td className="px-5 py-5 align-middle border-r border-[#eadfd8]">

                        <span className="font-semibold text-[14px] text-[#4b2d22]">
                          {item.category ||
                            "N/A"}
                        </span>

                      </td>


                      {/* =================================
                          AMOUNT
                      ================================= */}

                      <td className="px-5 py-5 align-middle border-r border-[#eadfd8]">

                        {isSessionPackage ? (

                          <div>

                            <div className="font-semibold text-[14px] text-[#4b2d22]">
                              {usedSessions}/
                              {item.total_sessions}
                            </div>

                            <div className="w-full max-w-[130px] h-[4px] bg-[#eeeeee] rounded-full mt-2 overflow-hidden">

                              <div
                                className="h-full bg-[#6b9e1c] rounded-full"
                                style={{
                                  width: `${sessionPercentage}%`,
                                }}
                              />

                            </div>

                            <div className="text-[12px] text-[#777] mt-1">
                              {Math.max(
                                0,
                                item.total_sessions -
                                  usedSessions
                              )}{" "}
                              sessions left
                            </div>

                          </div>

                        ) : (

                          <div>

                            <div className="font-semibold text-[14px] text-[#4b2d22]">
                              ₹
                              {item.used_amount ||
                                0}{" "}
                              used
                            </div>

                            <div className="w-full max-w-[130px] h-[4px] bg-[#eeeeee] rounded-full mt-2 overflow-hidden">

                              <div
                                className="h-full bg-[#8b5035] rounded-full"
                                style={{
                                  width: `${amountPercentage}%`,
                                }}
                              />

                            </div>

                            <div className="text-[12px] text-[#777] mt-1">
                              ₹
                              {item.remaining_amount ||
                                0}{" "}
                              remaining
                            </div>

                          </div>

                        )}

                      </td>


                      {/* =================================
                          START DATE
                      ================================= */}

                      <td className="px-5 py-5 align-middle border-r border-[#eadfd8]">

                        <span className="font-semibold text-[14px] text-[#4b2d22] whitespace-nowrap">
                          {item.start_date ||
                            "-"}
                        </span>

                      </td>


                      {/* =================================
                          END DATE
                      ================================= */}

                      <td className="px-5 py-5 align-middle border-r border-[#eadfd8]">

                        <span className="font-semibold text-[14px] text-[#4b2d22] whitespace-nowrap">
                          {item.end_date ||
                            "-"}
                        </span>

                      </td>


                      {/* =================================
                          STATUS
                      ================================= */}

                      <td className="px-5 py-5 align-middle border-r border-[#eadfd8]">

                        <span
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-[8px] text-[12px] font-medium whitespace-nowrap ${
                            item.status?.toLowerCase() ===
                            "active"
                              ? "bg-[#eaf9ed] text-[#236033]"
                              : item.status?.toLowerCase() ===
                                "expired"
                              ? "bg-[#fff2e5] text-[#70452e]"
                              : "bg-[#fff4e5] text-[#70452e]"
                          }`}
                        >
                          {item.status ||
                            "N/A"}
                        </span>

                      </td>


                      {/* =================================
                          ACTION
                      ================================= */}

                      <td className="px-4 py-5 align-middle text-center">

                        <button
                          type="button"
                          className="text-[22px] text-[#4b2d22] leading-none"
                        >
                          ⋮
                        </button>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Packages;