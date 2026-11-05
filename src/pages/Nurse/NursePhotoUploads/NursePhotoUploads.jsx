import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadPhotoUploadsDue } from "../../../redux/nurse/nurseThunk";
import {
  selectNursePhotoUploads,
  selectNursePhotoUploadsSummary,
  selectNursePhotoUploadsHeader,
  selectNursePhotoUploadsLoading,
  selectNursePhotoUploadsError,
} from "../../../redux/nurse/nurseSlice";

const NursePhotoUploads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const photos = useSelector(selectNursePhotoUploads);
  const summary = useSelector(selectNursePhotoUploadsSummary);
  const header = useSelector(selectNursePhotoUploadsHeader);
  const loading = useSelector(selectNursePhotoUploadsLoading);
  const error = useSelector(selectNursePhotoUploadsError);

  useEffect(() => {
    dispatch(loadPhotoUploadsDue());
  }, [dispatch]);

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
            {header?.title || "Photo Uploads Due"}
          </h1>
          <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-1">
            {header?.breadcrumb || "Nurse Actions"} ·{" "}
            {header?.subtitle ||
              `${summary?.due ?? 0} activity photos still missing`}
          </p>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4.5">
          {/* Card 1: Due */}
          <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-5 shadow-xs">
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.due ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Due
            </div>
          </div>

          {/* Card 2: Later today */}
          <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-5 shadow-xs">
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.later_today ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Later today
            </div>
          </div>

          {/* Card 3: Therapy */}
          <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-5 shadow-xs">
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.therapy ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Therapy
            </div>
          </div>

          {/* Card 4: Meals */}
          <div className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-5 shadow-xs">
            <div className="text-[26px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
              {summary?.meals ?? 0}
            </div>
            <div className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-2">
              Meals
            </div>
          </div>
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
            {typeof error === "string" ? error : "Failed to load photo uploads."}
          </div>
        ) : photos.length === 0 ? (
          <div className="mt-7 rounded-[20px] border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white/50 dark:bg-[#201A17]/50 py-16 px-6 text-center">
            <FaCamera className="mx-auto text-3xl text-[#B3A499] mb-3" />
            <h4 className="text-sm font-bold text-[#4B2E2A] dark:text-[#EDE3DA]">
              No photo uploads due
            </h4>
            <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
              All completed therapies and activities have their photo records verified.
            </p>
          </div>
        ) : (
          /* List of Photo Due Cards */
          <div className="mt-7 space-y-4">
            {photos.map((item, idx) => {
              const itemId =
                item.id || item.admission_id || item.patient_id || `photo-${idx}`;
              const pName = item.patient_name || "Patient";
              const missingText =
                item.missing_label ||
                item.activity_title ||
                "Activity photo missing";
              const subtext =
                item.subtext ||
                [
                  item.room_number,
                  item.room_type,
                  item.completed_at || (item.doctor_name ? `Dr. ${item.doctor_name}` : ""),
                ]
                  .filter(Boolean)
                  .join(" · ");
              const badgeText = item.badge || "Missing";

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
                      {missingText}
                    </p>
                    {subtext && (
                      <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-1.5 leading-none">
                        {subtext}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="inline-block px-4.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#FEECEE] text-[#B91C1C] dark:bg-[#3D1A1A] dark:text-[#FCA5A5]">
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

export default NursePhotoUploads;

