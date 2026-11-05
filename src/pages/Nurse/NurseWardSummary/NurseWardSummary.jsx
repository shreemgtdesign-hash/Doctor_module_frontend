import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadWardSummary } from "../../../redux/nurse/nurseThunk";
import {
  selectNurseWardSummaryDetails,
  selectNurseWardSummaryOverview,
  selectNurseWardSummaryHeader,
  selectNurseWardSummaryLoading,
  selectNurseWardSummaryError,
} from "../../../redux/nurse/nurseSlice";

const NurseWardSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const details = useSelector(selectNurseWardSummaryDetails);
  const overview = useSelector(selectNurseWardSummaryOverview);
  const header = useSelector(selectNurseWardSummaryHeader);
  const loading = useSelector(selectNurseWardSummaryLoading);
  const error = useSelector(selectNurseWardSummaryError);

  useEffect(() => {
    dispatch(loadWardSummary());
  }, [dispatch]);

  const ac = details?.ac_occupancy || {};
  const nonAc = details?.non_ac_occupancy || {};
  const garden = details?.garden_occupancy || {};
  const maintenance = details?.rooms_in_maintenance || {};

  const [showMaintenanceRooms, setShowMaintenanceRooms] = useState(false);

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-8 py-7 font-sans">
        {/* Breadcrumb Header matching Design */}
        <div className="flex items-center gap-2 text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
          <button
            type="button"
            onClick={() => navigate("/nurse/dashboard")}
            className="hover:text-[#8A5035] transition cursor-pointer"
          >
            Dashboard
          </button>
          <span className="text-[#8A7D75] font-normal text-lg">&gt;</span>
          <span>
            {header?.title || "Ward Summary"}
          </span>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4.5">
          {/* Card 1: Engaged */}
          <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-5 shadow-xs">
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {overview?.engaged ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Engaged
            </div>
          </div>

          {/* Card 2: Free */}
          <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-5 shadow-xs">
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {overview?.free ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Free
            </div>
          </div>

          {/* Card 3: Maintenance */}
          <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-5 shadow-xs">
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {overview?.maintenance ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Maintenance
            </div>
          </div>

          {/* Card 4: Total rooms */}
          <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-5 shadow-xs">
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {overview?.total_rooms ?? (overview?.engaged ?? 0) + (overview?.free ?? 0) + (overview?.maintenance ?? 0)}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Total rooms
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="mt-7 space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-28 rounded-[20px] bg-white dark:bg-[#241E1B] border border-[#E7DBD3] dark:border-[#382D25] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-7 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-6 text-center text-sm text-red-600 dark:text-red-400">
            {typeof error === "string" ? error : "Failed to load ward summary."}
          </div>
        ) : (
          /* 4 Full-Width Cards Stacked Vertically */
          <div className="mt-7 space-y-4">
            {/* 1. AC Occupancy */}
            <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-7 py-5 shadow-xs flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
                  {ac.title || "AC Occupancy"}
                </h3>
                <p className="text-[13.5px] font-medium text-[#2C1810] dark:text-[#EDE3DA] mt-2 leading-none">
                  {ac.stat_text || `${ac.engaged ?? 0} Engaged AC Rooms`}
                </p>
                <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-1.5 leading-none">
                  {ac.subtext || `${ac.total ?? 0} AC rooms total · ${ac.free ?? 0} free`}
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-block px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#FDF2F2] text-[#B91C1C] dark:bg-[#3D1A1A] dark:text-[#FCA5A5]">
                  {ac.badge || `${ac.percentage ?? 0}%`}
                </span>
              </div>
            </div>

            {/* 2. Non-AC Occupancy */}
            <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-7 py-5 shadow-xs flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
                  {nonAc.title || "Non-AC Occupancy"}
                </h3>
                <p className="text-[13.5px] font-medium text-[#2C1810] dark:text-[#EDE3DA] mt-2 leading-none">
                  {nonAc.stat_text || `${nonAc.engaged ?? 0} Engaged Non-AC Rooms`}
                </p>
                <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-1.5 leading-none">
                  {nonAc.subtext || `${nonAc.total ?? 0} Non-AC rooms total · ${nonAc.free ?? 0} free`}
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-block px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#FFF9E6] text-[#A67C00] dark:bg-[#422D11] dark:text-[#FDE68A]">
                  {nonAc.badge || `${nonAc.percentage ?? 0}%`}
                </span>
              </div>
            </div>

            {/* 3. Garden Occupancy */}
            <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-7 py-5 shadow-xs flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
                  {garden.title || "Garden Occupancy"}
                </h3>
                <p className="text-[13.5px] font-medium text-[#2C1810] dark:text-[#EDE3DA] mt-2 leading-none">
                  {garden.stat_text || `${garden.engaged ?? 0} Engaged Garden Rooms`}
                </p>
                <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-1.5 leading-none">
                  {garden.subtext || `${garden.total ?? 0} Garden rooms total · ${garden.free ?? 0} free`}
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-block px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#EFF6FF] text-[#1D4ED8] dark:bg-[#1E293B] dark:text-[#93C5FD]">
                  {garden.badge || `${garden.percentage ?? 0}%`}
                </span>
              </div>
            </div>

            {/* 4. Rooms in Maintenance */}
            <div
              onClick={() => {
                if (maintenance?.rooms?.length) {
                  setShowMaintenanceRooms((prev) => !prev);
                }
              }}
              className={`rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-7 py-5 shadow-xs transition ${
                maintenance?.rooms?.length ? "cursor-pointer hover:border-[#CBB4A5]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
                    {maintenance.title || "Rooms in Maintenance"}
                  </h3>
                  <p className="text-[13.5px] font-medium text-[#2C1810] dark:text-[#EDE3DA] mt-2 leading-none">
                    {maintenance.stat_text || `${maintenance.count ?? 0} rooms under maintenance`}
                  </p>
                  <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-1.5 leading-none">
                    {maintenance.subtext || "Across AC, Non-AC, and Garden wards"}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="inline-block px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#E0F2FE] text-[#0369A1] dark:bg-[#164E63] dark:text-[#7DD3FC]">
                    {maintenance.badge || `${maintenance.count ?? 0} rooms`}
                  </span>
                </div>
              </div>

              {/* Maintenance Rooms Breakdown Dropdown */}
              {showMaintenanceRooms && Array.isArray(maintenance?.rooms) && maintenance.rooms.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#F0E6DE] dark:border-[#382D25] grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {maintenance.rooms.map((rm) => (
                    <div
                      key={rm.id || rm.room_number}
                      className="rounded-xl bg-[#FAF8F5] dark:bg-[#1E1714] border border-[#EFE5DC] dark:border-[#382E28] p-3 text-xs"
                    >
                      <div className="font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                        {rm.room_number}
                      </div>
                      <div className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                        {rm.room_type} · {rm.floor || rm.ward}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NurseWardSummary;

