import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRunning } from "react-icons/fa";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadActivitiesIncomplete } from "../../../redux/nurse/nurseThunk";
import {
  selectNurseActivitiesIncomplete,
  selectNurseActivitiesSummary,
  selectNurseActivitiesHeader,
  selectNurseActivitiesLoading,
  selectNurseActivitiesError,
} from "../../../redux/nurse/nurseSlice";

const NurseActivitiesIncomplete = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activities = useSelector(selectNurseActivitiesIncomplete);
  const summary = useSelector(selectNurseActivitiesSummary);
  const header = useSelector(selectNurseActivitiesHeader);
  const loading = useSelector(selectNurseActivitiesLoading);
  const error = useSelector(selectNurseActivitiesError);

  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    dispatch(loadActivitiesIncomplete({ category: activeCategory }));
  }, [dispatch, activeCategory]);

  const handleCardClick = (item) => {
    const targetId = item.admission_id || item.patient_id || item.id;
    if (targetId) {
      navigate(`/nurse/patients/${targetId}/daily-log`, {
        state: { patient: item },
      });
    }
  };

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-8 py-7 font-sans">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
            {header?.title || "Activities Incomplete"}
          </h1>
          <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-1">
            {header?.breadcrumb || "Nurse Actions"} ·{" "}
            {header?.subtitle ||
              `${summary?.open ?? 0} activity logs still incomplete`}
          </p>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4.5">
          {/* Card 1: Open */}
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-[20px] border px-6 py-5 text-left transition-all cursor-pointer ${
              activeCategory === "all"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-white dark:bg-[#251E1A] shadow-xs"
                : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.open ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Open
            </div>
          </button>

          {/* Card 2: Morning */}
          <button
            type="button"
            onClick={() => setActiveCategory("morning")}
            className={`rounded-[20px] border px-6 py-5 text-left transition-all cursor-pointer ${
              activeCategory === "morning"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-white dark:bg-[#251E1A] shadow-xs"
                : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.morning ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Morning
            </div>
          </button>

          {/* Card 3: Therapy */}
          <button
            type="button"
            onClick={() => setActiveCategory("therapy")}
            className={`rounded-[20px] border px-6 py-5 text-left transition-all cursor-pointer ${
              activeCategory === "therapy"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-white dark:bg-[#251E1A] shadow-xs"
                : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.therapy ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Therapy
            </div>
          </button>

          {/* Card 4: Evening */}
          <button
            type="button"
            onClick={() => setActiveCategory("evening")}
            className={`rounded-[20px] border px-6 py-5 text-left transition-all cursor-pointer ${
              activeCategory === "evening"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-white dark:bg-[#251E1A] shadow-xs"
                : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.evening ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Evening
            </div>
          </button>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="mt-7 space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-24 rounded-[20px] bg-white dark:bg-[#241E1B] border border-[#E7DBD3] dark:border-[#382D25] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-7 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-6 text-center text-sm text-red-600 dark:text-red-400">
            {typeof error === "string" ? error : "Failed to load activities."}
          </div>
        ) : activities.length === 0 ? (
          <div className="mt-7 rounded-[20px] border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white/50 dark:bg-[#201A17]/50 py-16 px-6 text-center">
            <FaRunning className="mx-auto text-3xl text-[#B3A499] mb-3" />
            <h4 className="text-sm font-bold text-[#4B2E2A] dark:text-[#EDE3DA]">
              No incomplete activities
            </h4>
            <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
              All daily patient activities scheduled for today have been completed.
            </p>
          </div>
        ) : (
          /* List of Activity Cards */
          <div className="mt-7 space-y-4">
            {activities.map((item, idx) => {
              const itemId =
                item.id || item.activity_id || item.admission_id || `act-${idx}`;
              const pName = item.patient_name || "Patient";
              const taskText =
                item.task ||
                item.activity_title ||
                "Activity session not completed";
              const subtext =
                item.subtext ||
                [item.room_number, item.room_type, item.doctor_name]
                  .filter(Boolean)
                  .join(" · ");

              return (
                <div
                  key={itemId}
                  onClick={() => handleCardClick(item)}
                  className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-7 py-5 shadow-xs hover:border-[#CBB4A5] transition cursor-pointer"
                >
                  <div>
                    <h3 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
                      {pName}
                    </h3>
                    <p className="text-[13.5px] font-medium text-[#2C1810] dark:text-[#EDE3DA] mt-2 leading-none">
                      {taskText}
                    </p>
                    {subtext && (
                      <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-1.5 leading-none">
                        {subtext}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NurseActivitiesIncomplete;

