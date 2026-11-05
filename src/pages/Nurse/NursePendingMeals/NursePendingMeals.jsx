import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadPendingMeals } from "../../../redux/nurse/nurseThunk";
import {
  selectNursePendingMeals,
  selectNursePendingMealsSummary,
  selectNursePendingMealsHeader,
  selectNursePendingMealsLoading,
  selectNursePendingMealsError,
} from "../../../redux/nurse/nurseSlice";

const NursePendingMeals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const meals = useSelector(selectNursePendingMeals);
  const summary = useSelector(selectNursePendingMealsSummary);
  const header = useSelector(selectNursePendingMealsHeader);
  const loading = useSelector(selectNursePendingMealsLoading);
  const error = useSelector(selectNursePendingMealsError);

  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    dispatch(loadPendingMeals({ meal_type: filterType }));
  }, [dispatch, filterType]);

  const handleCardClick = (item) => {
    const targetId = item.admission_id || item.patient_id || item.id;
    if (targetId) {
      navigate(`/nurse/patients/${targetId}/daily-log`, {
        state: { patient: item },
      });
    }
  };

  const getBadgeStyle = (badgeColor, count) => {
    const col = String(badgeColor || "").toLowerCase();
    if (col === "pink" || col === "red" || count >= 3) {
      return "bg-[#FEECEE] text-[#B91C1C] dark:bg-[#3D1A1A] dark:text-[#FCA5A5]";
    }
    return "bg-[#FFF4E6] text-[#A25729] dark:bg-[#38271A] dark:text-[#FBBF24]";
  };

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-8 py-7 font-sans">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
            {header?.title || "Pending Meal Logs"}
          </h1>
          <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-1">
            {header?.breadcrumb || "Nurse Actions"} ·{" "}
            {header?.subtitle || `${summary?.open ?? 0} meal logs still open today`}
          </p>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4.5">
          {/* Card 1: Open */}
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`rounded-[20px] border px-6 py-5 text-left transition-all cursor-pointer ${
              filterType === "all"
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

          {/* Card 2: Breakfast */}
          <button
            type="button"
            onClick={() => setFilterType("breakfast")}
            className={`rounded-[20px] border px-6 py-5 text-left transition-all cursor-pointer ${
              filterType === "breakfast"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-white dark:bg-[#251E1A] shadow-xs"
                : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.breakfast ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Breakfast
            </div>
          </button>

          {/* Card 3: Lunch */}
          <button
            type="button"
            onClick={() => setFilterType("lunch")}
            className={`rounded-[20px] border px-6 py-5 text-left transition-all cursor-pointer ${
              filterType === "lunch"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-white dark:bg-[#251E1A] shadow-xs"
                : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.lunch ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Lunch
            </div>
          </button>

          {/* Card 4: Dinner */}
          <button
            type="button"
            onClick={() => setFilterType("dinner")}
            className={`rounded-[20px] border px-6 py-5 text-left transition-all cursor-pointer ${
              filterType === "dinner"
                ? "border-2 border-[#542F1E] dark:border-[#D5A794] bg-white dark:bg-[#251E1A] shadow-xs"
                : "border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] hover:border-[#CBB4A5]"
            }`}
          >
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.dinner ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Dinner
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
            {typeof error === "string" ? error : "Failed to load pending meals."}
          </div>
        ) : meals.length === 0 ? (
          <div className="mt-7 rounded-[20px] border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white/50 dark:bg-[#201A17]/50 py-16 px-6 text-center">
            <FaUtensils className="mx-auto text-3xl text-[#B3A499] mb-3" />
            <h4 className="text-sm font-bold text-[#4B2E2A] dark:text-[#EDE3DA]">
              No pending meal logs
            </h4>
            <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
              All scheduled patient meals for today have been logged.
            </p>
          </div>
        ) : (
          /* List of Meal Cards */
          <div className="mt-7 space-y-4">
            {meals.map((item, idx) => {
              const itemId = item.admission_id || item.patient_id || `meal-${idx}`;
              const pName = item.patient_name || "Patient";
              const desc =
                item.description ||
                (Array.isArray(item.unlogged_meals)
                  ? `${item.unlogged_meals.join(", ")} not logged`
                  : "Meal not logged");
              const subtext =
                item.location_text ||
                [item.room_number, item.room_type, item.doctor_name]
                  .filter(Boolean)
                  .join(" · ");
              const badgeText =
                item.badge ||
                (item.meals_count ? `${item.meals_count} meals` : "Pending");
              const badgeStyle = getBadgeStyle(
                item.badge_color,
                item.meals_count || item.unlogged_meals?.length
              );

              return (
                <div
                  key={itemId}
                  onClick={() => handleCardClick(item)}
                  className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-7 py-5 shadow-xs flex items-center justify-between gap-4 hover:border-[#CBB4A5] transition cursor-pointer"
                >
                  <div>
                    <h3 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
                      {pName}
                    </h3>
                    <p className="text-[13.5px] font-medium text-[#2C1810] dark:text-[#EDE3DA] mt-2 leading-none">
                      {desc}
                    </p>
                    {subtext && (
                      <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-1.5 leading-none">
                        {subtext}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span
                      className={`inline-block px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wide ${badgeStyle}`}
                    >
                      {badgeText}
                    </span>
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

export default NursePendingMeals;

