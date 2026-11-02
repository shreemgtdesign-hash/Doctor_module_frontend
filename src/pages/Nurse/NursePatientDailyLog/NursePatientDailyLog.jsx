import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineArrowLeft,
  HiOutlineArrowUpTray,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { FaCheck, FaCamera, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  loadPatientDailyLog,
  updatePatientDailyLog,
} from "../../../redux/nurse/nurseThunk";
import {
  selectNurseDailyLog,
  selectNurseDailyLogLoading,
  selectNurseDailyLogSaving,
} from "../../../redux/nurse/nurseSlice";

const LOG_TABS = ["All", "Vitals", "Meals", "Activities", "Medicines", "Therapy"];

const NursePatientDailyLog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const patientId = id || "p-default";

  const dailyLogData = useSelector(selectNurseDailyLog);
  const loading = useSelector(selectNurseDailyLogLoading);
  const saving = useSelector(selectNurseDailyLogSaving);

  const [activeTab, setActiveTab] = useState("All");
  const [selectedDate, setSelectedDate] = useState("Today");

  // Form editable state initialized empty and fetched by patient ID
  const [vitals, setVitals] = useState({
    bp: "",
    sugar: "",
    pulse: "",
    spo2: "",
    temperature: "",
  });

  const [meals, setMeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [therapies, setTherapies] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(loadPatientDailyLog({ patientId: id, params: { date: selectedDate } }));
    }
  }, [dispatch, id, selectedDate]);

  useEffect(() => {
    if (dailyLogData) {
      if (dailyLogData.vitals) setVitals(dailyLogData.vitals);
      if (Array.isArray(dailyLogData.meals)) setMeals(dailyLogData.meals);
      if (Array.isArray(dailyLogData.activities)) setActivities(dailyLogData.activities);
      if (Array.isArray(dailyLogData.medicines)) setMedicines(dailyLogData.medicines);
      if (Array.isArray(dailyLogData.therapies)) setTherapies(dailyLogData.therapies);
    }
  }, [dailyLogData]);

  const handleSave = () => {
    const payload = {
      date: selectedDate,
      vitals,
      meals,
      activities,
      medicines,
      therapies,
    };
    dispatch(updatePatientDailyLog({ patientId, payload })).then((res) => {
      if (!res.error) {
        toast.success("Daily log updated successfully!");
      }
    });
  };

  const getMedBadgeClass = (status) => {
    switch (status) {
      case "Overdue":
        return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
      case "Due now":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
    }
  };

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6 font-sans space-y-6">
        {/* Back and Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] flex items-center justify-center text-[#7D726B] hover:text-[#2C1810] cursor-pointer"
            >
              <HiOutlineArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                Patient Daily Log
              </h1>
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D]">
                IPD Clinical chart, diet tracking and medicine log
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative inline-flex items-center">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="appearance-none h-10 rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#251E1A] pl-8 pr-8 text-xs font-semibold text-[#4B2E2A] dark:text-[#EDE3DA] outline-none cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="2026-11-02">2 Nov 2026</option>
                <option value="2026-11-01">1 Nov 2026</option>
              </select>
              <HiOutlineCalendar
                size={14}
                className="pointer-events-none absolute left-2.5 text-[#8A7D75]"
              />
              <HiOutlineChevronDown
                size={12}
                className="pointer-events-none absolute right-2.5 text-[#8A7D75]"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-10 rounded-xl bg-[#6E3C27] hover:bg-[#582F1E] text-white px-5 text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FaSave size={13} />
              <span>{saving ? "Saving..." : "Save Daily Log"}</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E7DBD3] dark:border-[#382D25]">
          {LOG_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === tab
                  ? "bg-[#6E3C27] text-white shadow-xs"
                  : "bg-white dark:bg-[#241E1B] border border-[#E7DBD3] dark:border-[#382D25] text-[#7D726B] hover:text-[#2C1810]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SECTION: VITALS */}
        {(activeTab === "All" || activeTab === "Vitals") && (
          <div className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Vitals Monitoring
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(vitals).map(([key, val]) => (
                <div
                  key={key}
                  className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1E1714] p-3 text-center"
                >
                  <span className="block text-[11px] font-medium text-[#7D726B] dark:text-[#A8988D] uppercase">
                    {key}
                  </span>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) =>
                      setVitals((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full text-center text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA] bg-transparent outline-none mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: MEALS */}
        {(activeTab === "All" || activeTab === "Meals") && (
          <div className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Meals & Ayurvedic Diet
            </h3>
            {meals.length === 0 ? (
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D] py-3">No meal records found for this date.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {meals.map((meal, idx) => (
                  <div
                    key={meal.id || idx}
                    className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3.5 bg-[#FAF8F5] dark:bg-[#1E1714] flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                        {meal.name}
                      </span>
                      <p className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                        {meal.menu} · {meal.time}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...meals];
                        updated[idx].served = !updated[idx].served;
                        setMeals(updated);
                      }}
                      className={`h-7 px-3 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1 ${
                        meal.served
                          ? "bg-[#EBF8EE] text-[#15803D] dark:bg-[#16331E] dark:text-[#80E69B]"
                          : "bg-[#F3EDE8] text-[#7D726B] hover:bg-[#E8DED6]"
                      }`}
                    >
                      {meal.served && <FaCheck size={10} />}
                      <span>{meal.served ? "Served" : "Mark Served"}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION: ACTIVITIES */}
        {(activeTab === "All" || activeTab === "Activities") && (
          <div className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Activities & Routine
            </h3>
            {activities.length === 0 ? (
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D] py-3">No activity routine scheduled for this date.</p>
            ) : (
              <div className="space-y-2.5">
                {activities.map((act, idx) => (
                  <div
                    key={act.id || idx}
                    className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3.5 bg-[#FAF8F5] dark:bg-[#1E1714] flex items-center justify-between gap-3"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={act.completed}
                        onChange={() => {
                          const updated = [...activities];
                          updated[idx].completed = !updated[idx].completed;
                          setActivities(updated);
                        }}
                        className="h-4 w-4 rounded accent-[#6E3C27] cursor-pointer"
                      />
                      <div>
                        <p
                          className={`text-xs font-bold ${
                            act.completed
                              ? "text-[#2C1810] dark:text-[#EDE3DA]"
                              : "text-[#6E6157] dark:text-[#A8988D]"
                          }`}
                        >
                          {act.name}
                        </p>
                        <p className="text-[11px] text-[#8A7D75] mt-0.5">
                          Scheduled: {act.time}
                        </p>
                      </div>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...activities];
                        updated[idx].photoUploaded = !updated[idx].photoUploaded;
                        setActivities(updated);
                      }}
                      className={`h-7 px-3 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                        act.photoUploaded
                          ? "bg-[#EBF8EE] text-[#15803D] dark:bg-[#16331E] dark:text-[#80E69B]"
                          : "border border-[#D5C2B4] text-[#6E3C27] hover:bg-[#FAF4ED]"
                      }`}
                    >
                      <FaCamera size={11} />
                      <span>{act.photoUploaded ? "Photo Uploaded" : "Upload Photo"}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION: MEDICINES */}
        {(activeTab === "All" || activeTab === "Medicines") && (
          <div className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Medicines & Dosages
            </h3>
            {medicines.length === 0 ? (
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D] py-3">No medicines scheduled for this date.</p>
            ) : (
              <div className="space-y-2.5">
                {medicines.map((med, idx) => (
                  <div
                    key={med.id || idx}
                    className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3.5 bg-[#FAF8F5] dark:bg-[#1E1714] flex items-center justify-between gap-3"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={med.given}
                        onChange={() => {
                          const updated = [...medicines];
                          updated[idx].given = !updated[idx].given;
                          setMedicines(updated);
                        }}
                        className="h-4 w-4 rounded accent-[#6E3C27] cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                            {med.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getMedBadgeClass(
                              med.status
                            )}`}
                          >
                            {med.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                          {med.dose} · {med.time}
                        </p>
                      </div>
                    </label>

                    <span className="text-xs font-semibold text-[#7D726B] dark:text-[#A8988D]">
                      {med.given ? "Administered" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION: THERAPY */}
        {(activeTab === "All" || activeTab === "Therapy") && (
          <div className="rounded-2xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Panchakarma Therapies
            </h3>
            {therapies.length === 0 ? (
              <p className="text-xs text-[#7D726B] dark:text-[#A8988D] py-3">No therapies scheduled for this date.</p>
            ) : (
              <div className="space-y-2.5">
                {therapies.map((th, idx) => (
                  <div
                    key={th.id || idx}
                    className="rounded-xl border border-[#EFE5DC] dark:border-[#382E28] p-3.5 bg-[#FAF8F5] dark:bg-[#1E1714] flex items-center justify-between gap-3"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={th.completed}
                        onChange={() => {
                          const updated = [...therapies];
                          updated[idx].completed = !updated[idx].completed;
                          setTherapies(updated);
                        }}
                        className="h-4 w-4 rounded accent-[#6E3C27] cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                          {th.name}
                        </p>
                        <p className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                          {th.therapist} · {th.time}
                        </p>
                      </div>
                    </label>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        th.completed
                          ? "bg-[#EBF8EE] text-[#15803D]"
                          : "bg-[#FFF2E2] text-[#8F6612]"
                      }`}
                    >
                      {th.completed ? "Completed" : "Scheduled"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NursePatientDailyLog;
