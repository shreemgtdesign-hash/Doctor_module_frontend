import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadPendingPatientLogs } from "../../../redux/nurse/nurseThunk";
import {
  selectNursePendingPatientLogs,
  selectNursePendingPatientLogsHeader,
  selectNursePendingPatientLogsLoading,
  selectNursePendingPatientLogsError,
} from "../../../redux/nurse/nurseSlice";

const NursePendingPatientLogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const patientLogs = useSelector(selectNursePendingPatientLogs);
  const header = useSelector(selectNursePendingPatientLogsHeader);
  const loading = useSelector(selectNursePendingPatientLogsLoading);
  const error = useSelector(selectNursePendingPatientLogsError);

  useEffect(() => {
    dispatch(loadPendingPatientLogs());
  }, [dispatch]);

  const handleOpenLog = (item) => {
    const targetId = item.patient_id || item.admission_id || item.id;
    if (item.action_url) {
      navigate(item.action_url, { state: { patient: item } });
    } else if (targetId) {
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
            {header?.title || "Patient Logs"}
          </h1>
          <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-1">
            {header?.breadcrumb || "Nurse Actions"} ·{" "}
            {header?.subtitle ||
              `${patientLogs?.length ?? 0} patient logs still open today`}
          </p>
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
            {typeof error === "string" ? error : "Failed to load pending patient logs."}
          </div>
        ) : patientLogs.length === 0 ? (
          <div className="mt-7 rounded-[20px] border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white/50 dark:bg-[#201A17]/50 py-16 px-6 text-center">
            <FaClipboardList className="mx-auto text-3xl text-[#B3A499] mb-3" />
            <h4 className="text-sm font-bold text-[#4B2E2A] dark:text-[#EDE3DA]">
              No pending patient logs
            </h4>
            <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
              All daily patient logs for today have been completed.
            </p>
          </div>
        ) : (
          /* List of Patient Log Cards */
          <div className="mt-7 space-y-4">
            {patientLogs.map((item, idx) => {
              const itemId =
                item.daily_log_id ||
                item.admission_id ||
                item.patient_id ||
                `log-${idx}`;
              const pName = item.patient_name || item.name || "Patient";
              const subtitle =
                item.subtitle ||
                `Patient ID: ${item.patient_code || item.patient_id || "—"} · ${
                  item.doctor_name || item.sr_doctor || ""
                }`;
              const locationText = [
                item.room_number ? `Rm ${item.room_number}` : null,
                item.room_type,
                item.gender,
                item.age ? `${item.age} yrs` : null,
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <div
                  key={itemId}
                  onClick={() => handleOpenLog(item)}
                  className="rounded-[20px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-7 py-5 shadow-xs flex items-center justify-between gap-4 hover:border-[#CBB4A5] transition cursor-pointer"
                >
                  <div>
                    <h3 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA] leading-none">
                      {pName}
                    </h3>
                    <p className="text-[13.5px] font-medium text-[#2C1810] dark:text-[#EDE3DA] mt-2 leading-none">
                      {subtitle}
                    </p>
                    {locationText && (
                      <p className="text-[12px] text-[#7D726B] dark:text-[#A8988D] mt-1.5 leading-none">
                        {locationText}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenLog(item);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#8A5035] hover:bg-[#6E3C27] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      {item.action_button || "View Details"}
                    </button>
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

export default NursePendingPatientLogs;

