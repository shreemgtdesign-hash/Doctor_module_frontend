import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineArrowLeft,
  HiOutlineArrowRightOnRectangle,
  HiOutlineEye,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import { FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  loadPatientDailyLog,
  updatePatientDailyLog,
  loadMealsMenu,
} from "../../../redux/nurse/nurseThunk";
import {
  selectNurseDailyLog,
  selectNurseDailyLogLoading,
  selectNurseDailyLogSaving,
  selectNurseMealsMenu,
} from "../../../redux/nurse/nurseSlice";

const LOG_TABS = ["All", "Vitals", "Meals", "Activities", "Medicines", "Therapy"];

// Default meals template
const DEFAULT_MEALS = [
  { meal_type: "Pre-Breakfast", menu: "", status: "Pending", served_at: null },
  { meal_type: "Kashayam", menu: "", status: "Pending", served_at: null },
  { meal_type: "Breakfast", menu: "", status: "Pending", served_at: null },
  { meal_type: "Lunch", menu: "", status: "Pending", served_at: null },
  { meal_type: "Snacks", menu: "", status: "Pending", served_at: null },
  { meal_type: "Dinner", menu: "", status: "Pending", served_at: null },
  { meal_type: "Post-Dinner", menu: "", status: "Pending", served_at: null },
];

// Fallback menu options by type in case menu API is loading or empty
const FALLBACK_MENUS_BY_TYPE = {
  "Pre-Breakfast": [
    { label: "Fruit Bowl (Papaya + Apple)", value: "Fruit Bowl (Papaya + Apple)" },
    { label: "Herbal Kashayam", value: "Herbal Kashayam" },
    { label: "Idli + Sambar", value: "Idli + Sambar" },
    { label: "Ragi Malt", value: "Ragi Malt" },
    { label: "Warm Cumin Water", value: "Warm Cumin Water" },
  ],
  Kashayam: [
    { label: "Amrutharishtam", value: "Amrutharishtam" },
    { label: "Dasamoola Kashayam", value: "Dasamoola Kashayam" },
    { label: "Maharasnadi Kashayam", value: "Maharasnadi Kashayam" },
    { label: "Punarnavadi Kashayam", value: "Punarnavadi Kashayam" },
    { label: "Varanadi Kashayam", value: "Varanadi Kashayam" },
  ],
  Breakfast: [
    { label: "Idli + Sambar", value: "Idli + Sambar" },
    { label: "Moong Dal Cheela", value: "Moong Dal Cheela" },
    { label: "Oats Porridge", value: "Oats Porridge" },
    { label: "Poha", value: "Poha" },
    { label: "Upma", value: "Upma" },
  ],
  Lunch: [
    { label: "Curd Rice + Steamed Veggies", value: "Curd Rice + Steamed Veggies" },
    { label: "Khichdi + Ghee", value: "Khichdi + Ghee" },
    { label: "Rice + Dal", value: "Rice + Dal" },
    { label: "Rice + Sambar + Poriyal", value: "Rice + Sambar + Poriyal" },
    { label: "Roti + Subji", value: "Roti + Subji" },
  ],
  Snacks: [
    { label: "Boiled Green Gram", value: "Boiled Green Gram" },
    { label: "Fruits + Herbal Tea", value: "Fruits + Herbal Tea" },
    { label: "Herbal Chai + Ragi Biscuits", value: "Herbal Chai + Ragi Biscuits" },
    { label: "Roasted Makhana", value: "Roasted Makhana" },
    { label: "Sprouts Salad", value: "Sprouts Salad" },
  ],
  Dinner: [
    { label: "Chapati + Dal + Sabzi", value: "Chapati + Dal + Sabzi" },
    { label: "Dalia", value: "Dalia" },
    { label: "Khichdi", value: "Khichdi" },
    { label: "Moong Dal Soup", value: "Moong Dal Soup" },
    { label: "Vegetable Soup + Roti", value: "Vegetable Soup + Roti" },
  ],
  "Post-Dinner": [
    { label: "Golden Milk", value: "Golden Milk" },
    { label: "Triphala Decoction", value: "Triphala Decoction" },
    { label: "Warm Fennel Water", value: "Warm Fennel Water" },
    { label: "Warm Milk + Turmeric", value: "Warm Milk + Turmeric" },
  ],
};

const DEFAULT_ACTIVITIES = [
  { id: 1, title: "1. Morning Walk / Exercise", status: "Pending", completed_at: null, photo_url: null },
  { id: 2, title: "2. Abhyanga (Oil Massage)", status: "Pending", completed_at: null, photo_url: null },
  { id: 3, title: "3. Steam Therapy (Swedana)", status: "Pending", completed_at: null, photo_url: null },
  { id: 4, title: "4. Yoga / Meditation Session", status: "Pending", completed_at: null, photo_url: null },
  { id: 5, title: "5. Evening Physiotherapy", status: "Pending", completed_at: null, photo_url: null },
];

const DEFAULT_MEDICINES = [
  { id: 1, medicine_name: "Dashamoola Kwath", dosage: "15 ml · Oral", status: "Overdue", completed_at: null, is_administered: false },
  { id: 2, medicine_name: "Brahmi vati", dosage: "1 tablet · Oral", status: "Due now", completed_at: null, is_administered: false },
  { id: 3, medicine_name: "Abhyanga taila", dosage: "Topical · Scheduled 04:00 PM", status: "Upcoming", completed_at: null, is_administered: false },
  { id: 4, medicine_name: "Triphala churna", dosage: "1 tsp · Oral · Scheduled 08:00 PM", status: "Upcoming", completed_at: null, is_administered: false },
];

const DEFAULT_THERAPIES = [
  { id: 1, therapy_name: "Shirodhara", status: "Overdue", completed_at: null, is_completed: false },
  { id: 2, therapy_name: "Kati Basti", status: "Due now", completed_at: null, is_completed: false },
];

const formatCurrentTime = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const NursePatientDailyLog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const patientId = id || location.state?.patient?.admission_id || location.state?.patient?.patient_id || "default-patient";

  const dailyLogData = useSelector(selectNurseDailyLog);
  const loading = useSelector(selectNurseDailyLogLoading);
  const saving = useSelector(selectNurseDailyLogSaving);
  const mealsMenu = useSelector(selectNurseMealsMenu);

  const [activeTab, setActiveTab] = useState("All");
  const [selectedDate, setSelectedDate] = useState("2026-11-04");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Patient Header info
  const [patientName, setPatientName] = useState(
    location.state?.patient?.patient_name || location.state?.patient?.name || "Kriti Balaji"
  );
  const [patientCode, setPatientCode] = useState(
    location.state?.patient?.patient_code || location.state?.patient?.code || "PAT123456"
  );
  const [gender, setGender] = useState(location.state?.patient?.gender || "Female");
  const [notes, setNotes] = useState("");
  const [nurseName, setNurseName] = useState("Monisha");

  // Vitals State
  const [vitals, setVitals] = useState({
    bp: "",
    sugar: "",
    pulse: "",
    spo2: "",
    temperature: "",
  });

  // Sections State
  const [meals, setMeals] = useState(DEFAULT_MEALS);
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);
  const [medicines, setMedicines] = useState(DEFAULT_MEDICINES);
  const [therapies, setTherapies] = useState(DEFAULT_THERAPIES);

  // Hidden file inputs for photos
  const fileInputRefs = useRef({});

  // Fetch meals menu dropdown once
  useEffect(() => {
    dispatch(loadMealsMenu());
  }, [dispatch]);

  // Fetch daily log when ID or selectedDate changes
  useEffect(() => {
    if (patientId) {
      setJustSaved(false);
      dispatch(loadPatientDailyLog({ patientId, params: { date: selectedDate } }));
    }
  }, [dispatch, patientId, selectedDate]);

  // Sync data from API response when dailyLogData arrives
  useEffect(() => {
    if (dailyLogData) {
      if (dailyLogData.patient_name) setPatientName(dailyLogData.patient_name);
      if (dailyLogData.patient_code) setPatientCode(dailyLogData.patient_code);
      if (dailyLogData.gender) setGender(dailyLogData.gender);
      if (dailyLogData.notes !== undefined) setNotes(dailyLogData.notes || "");
      if (dailyLogData.nurse_name) setNurseName(dailyLogData.nurse_name);

      if (dailyLogData.vitals) {
        setVitals({
          bp: dailyLogData.vitals.bp || "",
          sugar: dailyLogData.vitals.sugar || "",
          pulse: dailyLogData.vitals.pulse !== undefined ? String(dailyLogData.vitals.pulse) : "",
          spo2: dailyLogData.vitals.spo2 || "",
          temperature: dailyLogData.vitals.temperature || "",
        });
      }

      // Handle meals
      if (Array.isArray(dailyLogData.meals) && dailyLogData.meals.length > 0) {
        setMeals(dailyLogData.meals);
      } else {
        setMeals(DEFAULT_MEALS);
      }

      // Handle activities (may be object with .items or array)
      const rawActivities = dailyLogData.activities?.items || (Array.isArray(dailyLogData.activities) ? dailyLogData.activities : null);
      if (rawActivities && rawActivities.length > 0) {
        setActivities(rawActivities);
      } else {
        setActivities(DEFAULT_ACTIVITIES);
      }

      // Handle medicines (may be object with .items or array)
      const rawMedicines = dailyLogData.medicines?.items || (Array.isArray(dailyLogData.medicines) ? dailyLogData.medicines : null);
      if (rawMedicines && rawMedicines.length > 0) {
        setMedicines(rawMedicines);
      } else {
        setMedicines(DEFAULT_MEDICINES);
      }

      // Handle therapies (may be object with .items or array)
      const rawTherapies = dailyLogData.therapies?.items || (Array.isArray(dailyLogData.therapies) ? dailyLogData.therapies : null);
      if (rawTherapies && rawTherapies.length > 0) {
        setTherapies(rawTherapies);
      } else {
        setTherapies(DEFAULT_THERAPIES);
      }
    }
  }, [dailyLogData]);

  // Determine if the current date's log is already saved and therefore read-only
  const isReadOnly = Boolean(
    justSaved ||
    dailyLogData?.is_saved ||
    dailyLogData?.is_readonly ||
    dailyLogData?.status === "saved" ||
    dailyLogData?.status === "completed" ||
    // Check if any meal is served or has a menu assigned in fetched data
    (Array.isArray(dailyLogData?.meals) && dailyLogData.meals.some((m) => m.status === "Served" || (m.menu && m.menu.trim() !== ""))) ||
    // Check if any activity is already completed with photo in fetched data
    (dailyLogData?.activities?.completed_count > 0) ||
    // Check if any medicine is administered
    (dailyLogData?.medicines?.completed_count > 0) ||
    // Check if any therapy is completed
    (dailyLogData?.therapies?.completed_count > 0)
  );

  // Meal Change Handler
  const handleMealChange = (index, value) => {
    if (isReadOnly) return;
    setMeals((prev) => {
      const updated = [...prev];
      const target = { ...updated[index] };
      target.menu = value;
      if (value) {
        target.status = "Served";
        if (!target.served_at) {
          target.served_at = formatCurrentTime();
        }
      }
      updated[index] = target;
      return updated;
    });
  };

  // Meal Status Toggle (Served vs Pending)
  const handleToggleMealStatus = (index) => {
    if (isReadOnly) return;
    setMeals((prev) => {
      const updated = [...prev];
      const target = { ...updated[index] };
      if (target.status === "Served") {
        target.status = "Pending";
        target.served_at = null;
      } else {
        target.status = "Served";
        target.served_at = formatCurrentTime();
      }
      updated[index] = target;
      return updated;
    });
  };

  // Activity Checkbox Toggle
  const handleToggleActivity = (index) => {
    if (isReadOnly) return;
    setActivities((prev) => {
      const updated = [...prev];
      const target = { ...updated[index] };
      const isDone = target.status === "Completed" || target.completed;
      if (isDone) {
        target.status = "Pending";
        target.completed = false;
        target.completed_at = null;
      } else {
        target.status = "Completed";
        target.completed = true;
        target.completed_at = target.completed_at || formatCurrentTime();
      }
      updated[index] = target;
      return updated;
    });
  };

  // Activity Photo Upload Handler
  const handleActivityPhotoUpload = (index, event) => {
    if (isReadOnly) return;
    const file = event.target.files?.[0];
    if (file) {
      setActivities((prev) => {
        const updated = [...prev];
        const target = { ...updated[index] };
        target.photo_url = file.name;
        target.status = "Completed";
        target.completed = true;
        if (!target.completed_at) {
          target.completed_at = formatCurrentTime();
        }
        updated[index] = target;
        return updated;
      });
      toast.success(`Photo "${file.name}" uploaded successfully!`);
    }
  };

  // Medicine Checkbox Toggle
  const handleToggleMedicine = (index) => {
    if (isReadOnly) return;
    setMedicines((prev) => {
      const updated = [...prev];
      const target = { ...updated[index] };
      const wasAdministered = !!target.is_administered;
      target.is_administered = !wasAdministered;
      target.given = !wasAdministered;
      if (!wasAdministered) {
        target.completed_at = target.completed_at || formatCurrentTime();
      }
      updated[index] = target;
      return updated;
    });
  };

  // Therapy Checkbox Toggle
  const handleToggleTherapy = (index) => {
    if (isReadOnly) return;
    setTherapies((prev) => {
      const updated = [...prev];
      const target = { ...updated[index] };
      const wasCompleted = target.status === "Completed" || !!target.is_completed;
      target.is_completed = !wasCompleted;
      target.completed = !wasCompleted;
      if (!wasCompleted) {
        target.status = "Completed";
        target.completed_at = target.completed_at || formatCurrentTime();
      } else {
        target.status = "Pending";
        target.completed_at = null;
      }
      updated[index] = target;
      return updated;
    });
  };

  // SAVE Daily Log
  const handleSave = async () => {
    const payload = {
      log_date: selectedDate,
      gender: gender || "Female",
      vitals: {
        bp: vitals.bp || "120/80",
        sugar: vitals.sugar || "98",
        pulse: vitals.pulse ? Number(vitals.pulse) || 72 : 72,
        spo2: vitals.spo2 ? (vitals.spo2.includes("%") ? vitals.spo2 : `${vitals.spo2}%`) : "98%",
        temperature: vitals.temperature ? (vitals.temperature.includes("°") ? vitals.temperature : `${vitals.temperature}°F`) : "98.4°F",
      },
      meals: meals.map((m) => ({
        meal_type: m.meal_type,
        menu: m.menu || "",
        status: m.status || (m.menu ? "Served" : "Pending"),
        served_at: m.served_at || (m.status === "Served" ? "08:15 AM" : null),
      })),
      activities: activities.map((a, idx) => ({
        id: a.id || idx + 1,
        title: a.title || a.name || `Activity ${idx + 1}`,
        status: a.status || (a.completed ? "Completed" : "Pending"),
        completed_at: a.completed_at || null,
        photo_url: a.photo_url || null,
      })),
      medicines: medicines.map((med, idx) => ({
        id: med.id || idx + 1,
        medicine_name: med.medicine_name || med.name || "Medicine",
        dosage: med.dosage || med.dose || "Oral",
        status: med.status || (med.is_administered ? "Completed" : "Upcoming"),
        completed_at: med.completed_at || null,
        is_administered: !!med.is_administered,
      })),
      therapies: therapies.map((th, idx) => ({
        id: th.id || idx + 1,
        therapy_name: th.therapy_name || th.name || "Therapy",
        status: th.status || (th.is_completed ? "Completed" : "Pending"),
        completed_at: th.completed_at || null,
        is_completed: !!th.is_completed,
      })),
      notes: notes || "Patient is responding well. Vitals stable.",
      nurse_name: nurseName || "Monisha",
    };

    try {
      const resultAction = await dispatch(updatePatientDailyLog({ patientId, payload }));
      if (updatePatientDailyLog.fulfilled.match(resultAction)) {
        toast.success("Patient daily log saved successfully!");
        setJustSaved(true);
      } else {
        toast.error(resultAction.payload || "Failed to save daily log.");
      }
    } catch {
      toast.error("An error occurred while saving.");
    }
  };

  // Helper for menus by type
  const getMenuOptionsForType = (mealType) => {
    if (mealsMenu?.menus_by_type && Array.isArray(mealsMenu.menus_by_type[mealType])) {
      return mealsMenu.menus_by_type[mealType];
    }
    return FALLBACK_MENUS_BY_TYPE[mealType] || [];
  };

  // Dynamic summary counters
  const activitiesDoneCount = activities.filter((a) => a.status === "Completed" || a.completed).length;
  const medicinesDoneCount = medicines.filter((m) => m.is_administered || m.given).length;
  const therapiesDoneCount = therapies.filter((t) => t.is_completed || t.status === "Completed").length;

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-8 py-7 font-sans">
        {/* Header with Title and Date Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="h-8 w-8 rounded-lg border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] flex items-center justify-center text-[#7D726B] hover:text-[#2C1810] cursor-pointer transition sm:hidden"
                title="Go Back"
              >
                <HiOutlineArrowLeft size={14} />
              </button>
              <h1 className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
                {isReadOnly ? "View Patient Daily Details" : "Enter Patient Daily Details"}
              </h1>
            </div>
            <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-1">
              {isReadOnly
                ? "View all logged tasks for the selected date."
                : "Log daily meals and track completed activities with photos"}
            </p>
          </div>

          {/* Date Selector Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            {isCustomDate ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                  className="rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-3 py-1.5 text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA] outline-none shadow-xs cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomDate(false)}
                  className="text-[11px] font-medium text-[#7D726B] hover:text-[#2C1810] underline cursor-pointer"
                >
                  Quick
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedDate}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setIsCustomDate(true);
                    } else {
                      setSelectedDate(e.target.value);
                    }
                  }}
                  className="appearance-none rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] pl-8 pr-7 py-1.5 text-xs font-semibold text-[#2C1810] dark:text-[#EDE3DA] outline-none cursor-pointer shadow-xs"
                >
                  <option value={getTodayDateString()}>Today</option>
                  <option value="2026-11-04">04 Nov 2026</option>
                  <option value="2026-11-03">03 Nov 2026</option>
                  <option value="2026-11-02">02 Nov 2026</option>
                  <option value="2026-10-29">29 Oct 2026</option>
                  <option value="custom">Pick date...</option>
                </select>
                <HiOutlineCalendar
                  size={13}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A7D75]"
                />
                <HiOutlineChevronDown
                  size={11}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A7D75]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Patient Name and Patient ID (2-Column Form) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              readOnly={isReadOnly}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Kriti Balaji"
              className={`w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-4 py-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none mt-1.5 ${
                isReadOnly ? "cursor-default" : "focus:border-[#CBB4A5]"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
              Patient ID
            </label>
            <input
              type="text"
              value={patientCode}
              readOnly={isReadOnly}
              onChange={(e) => setPatientCode(e.target.value)}
              placeholder="e.g. PAT123456"
              className={`w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-4 py-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none mt-1.5 ${
                isReadOnly ? "cursor-default" : "focus:border-[#CBB4A5]"
              }`}
            />
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-[#E7DBD3] dark:border-[#382D25] mt-6 overflow-x-auto">
          {LOG_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-semibold transition cursor-pointer shrink-0 ${
                activeTab === tab
                  ? "text-[#2C1810] dark:text-[#EDE3DA] border-b-2 border-[#2C1810] dark:border-[#EDE3DA] -mb-[1px]"
                  : "text-[#8A7D75] dark:text-[#A8988D] hover:text-[#2C1810]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <div className="py-4 text-xs font-medium text-[#8A7D75] animate-pulse">
            Fetching patient daily log details...
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. SECTION: VITALS */}
        {/* ======================================================== */}
        {(activeTab === "All" || activeTab === "Vitals") && (
          <div className="mt-6">
            <div>
              <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                Vitals
              </h2>
              <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                Add vitals for the patients
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-3.5">
              {/* BP */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-1.5">
                  BP
                </label>
                <input
                  type="text"
                  placeholder={isReadOnly ? "—" : "Enter Value"}
                  value={vitals.bp || ""}
                  readOnly={isReadOnly}
                  onChange={(e) => setVitals((v) => ({ ...v, bp: e.target.value }))}
                  className={`w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] placeholder-[#B5A8A0] outline-none ${
                    isReadOnly ? "cursor-default" : ""
                  }`}
                />
              </div>

              {/* Sugar */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-1.5">
                  Sugar
                </label>
                <input
                  type="text"
                  placeholder={isReadOnly ? "—" : "Enter Value"}
                  value={vitals.sugar || ""}
                  readOnly={isReadOnly}
                  onChange={(e) => setVitals((v) => ({ ...v, sugar: e.target.value }))}
                  className={`w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] placeholder-[#B5A8A0] outline-none ${
                    isReadOnly ? "cursor-default" : ""
                  }`}
                />
              </div>

              {/* Pulse */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-1.5">
                  Pulse
                </label>
                <input
                  type="text"
                  placeholder={isReadOnly ? "—" : "Enter Value"}
                  value={vitals.pulse || ""}
                  readOnly={isReadOnly}
                  onChange={(e) => setVitals((v) => ({ ...v, pulse: e.target.value }))}
                  className={`w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] placeholder-[#B5A8A0] outline-none ${
                    isReadOnly ? "cursor-default" : ""
                  }`}
                />
              </div>

              {/* SpO2 */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-1.5">
                  SpO2
                </label>
                <input
                  type="text"
                  placeholder={isReadOnly ? "—" : "Enter Value"}
                  value={vitals.spo2 || ""}
                  readOnly={isReadOnly}
                  onChange={(e) => setVitals((v) => ({ ...v, spo2: e.target.value }))}
                  className={`w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] placeholder-[#B5A8A0] outline-none ${
                    isReadOnly ? "cursor-default" : ""
                  }`}
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA] mb-1.5">
                  Temperature
                </label>
                <input
                  type="text"
                  placeholder={isReadOnly ? "—" : "Enter Value"}
                  value={vitals.temperature || ""}
                  readOnly={isReadOnly}
                  onChange={(e) => setVitals((v) => ({ ...v, temperature: e.target.value }))}
                  className={`w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-3.5 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] placeholder-[#B5A8A0] outline-none ${
                    isReadOnly ? "cursor-default" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. SECTION: MEALS */}
        {/* ======================================================== */}
        {(activeTab === "All" || activeTab === "Meals") && (
          <div className="mt-8">
            <div>
              <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                Meals
              </h2>
              <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                Select menu for each meal from the dropdown
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3.5">
              {meals.map((meal, idx) => {
                const options = getMenuOptionsForType(meal.meal_type);
                const isServed = meal.status === "Served";

                return (
                  <div
                    key={meal.meal_type || idx}
                    className="rounded-[18px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] p-6 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                        {meal.meal_type}
                      </span>
                      {isReadOnly ? (
                        <span className="text-[11px] font-medium text-[#7D726B] dark:text-[#A8988D]">
                          {isServed
                            ? `Served at ${meal.served_at || "08:15 AM"}`
                            : "Pending"}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleMealStatus(idx)}
                          className={`text-[11px] font-medium transition cursor-pointer ${
                            isServed
                              ? "text-[#7D726B] dark:text-[#A8988D] hover:text-[#2C1810]"
                              : "text-[#A8988D] hover:text-[#7D726B]"
                          }`}
                          title="Click to toggle status"
                        >
                          {isServed
                            ? `Served at ${meal.served_at || "08:15 AM"}`
                            : "Pending"}
                        </button>
                      )}
                    </div>

                    {isReadOnly ? (
                      /* Read-Only Mode: Plain border container with served menu text */
                      <div className="w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] px-4 py-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] mt-2.5">
                        {meal.menu || "Not served"}
                      </div>
                    ) : (
                      /* Edit Mode: Interactive select dropdown with chevron */
                      <div className="relative mt-2.5">
                        <select
                          value={meal.menu || ""}
                          onChange={(e) => handleMealChange(idx, e.target.value)}
                          className="appearance-none w-full rounded-xl border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] pl-3.5 pr-8 py-2.5 text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA] outline-none cursor-pointer"
                        >
                          <option value="">
                            {`Select ${meal.meal_type.toLowerCase()} menu`}
                          </option>
                          {options.map((opt) => {
                            const val = opt.value || opt.menu || opt.name;
                            const lbl = opt.label || opt.name || opt.menu;
                            return (
                              <option key={val} value={val}>
                                {lbl}
                              </option>
                            );
                          })}
                        </select>
                        <HiOutlineChevronDown
                          size={13}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7D75]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. SECTION: ACTIVITIES COMPLETED */}
        {/* ======================================================== */}
        {(activeTab === "All" || activeTab === "Activities") && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Activities Completed
                </h2>
                <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                  Check completed activities and upload a photo for each
                </p>
              </div>
              <span className="bg-[#F7EFE9] dark:bg-[#33251E] text-[#7D5A47] dark:text-[#D5A794] text-xs font-semibold px-3.5 py-1 rounded-full">
                {activitiesDoneCount} of {activities.length} done
              </span>
            </div>

            <div className="space-y-3 mt-3.5">
              {activities.map((act, idx) => {
                const isCompleted = act.status === "Completed" || act.completed;

                return (
                  <div
                    key={act.id || idx}
                    className="rounded-[18px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-6 shadow-xs flex items-center justify-between gap-4"
                  >
                    {/* Checkbox and Title */}
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => handleToggleActivity(idx)}
                        className={`w-5 h-5 rounded-[5px] border flex items-center justify-center transition shrink-0 ${
                          isReadOnly ? "cursor-default" : "cursor-pointer"
                        } ${
                          isCompleted
                            ? "border-[#2C1810] dark:border-[#EDE3DA] bg-[#2C1810] dark:bg-[#EDE3DA] text-white dark:text-[#2C1810]"
                            : "border-[#CBB4A5] dark:border-[#4A3D34] bg-white dark:bg-[#241E1B]"
                        }`}
                      >
                        {isCompleted && <FaCheck size={9} />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                          {act.title}
                        </h4>
                        <p className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                          {isCompleted
                            ? `Completed · ${act.completed_at || "07:40 AM"}`
                            : "Not completed"}
                        </p>
                      </div>
                    </div>

                    {/* Photo Upload Box */}
                    <div className="shrink-0">
                      <input
                        type="file"
                        ref={(el) => (fileInputRefs.current[idx] = el)}
                        onChange={(e) => handleActivityPhotoUpload(idx, e)}
                        className="hidden"
                        accept="image/*"
                      />
                      {act.photo_url ? (
                        <div
                          onClick={() => {
                            if (!isReadOnly) fileInputRefs.current[idx]?.click();
                          }}
                          className={`border border-dashed border-[#F0D5C7] dark:border-[#523A2E] bg-[#FFFDFC] dark:bg-[#241E1B] rounded-xl px-5 py-2 text-center min-w-[145px] transition ${
                            isReadOnly ? "cursor-default" : "hover:bg-[#FAF4ED] cursor-pointer"
                          }`}
                        >
                          <span className="block text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA]">
                            Photo uploaded
                          </span>
                          <span className="block text-[11px] text-[#8A7D75] dark:text-[#A8988D] mt-0.5 truncate max-w-[130px]">
                            {act.photo_url}
                          </span>
                        </div>
                      ) : isReadOnly ? (
                        <div className="border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] rounded-xl px-5 py-2 text-center min-w-[145px]">
                          <span className="block text-xs font-medium text-[#7D726B] dark:text-[#A8988D]">
                            No photo
                          </span>
                          <span className="block text-[11px] text-[#A8988D] mt-0.5">
                            Not uploaded
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          className="border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#241E1B] hover:bg-[#FAF6F2] rounded-xl px-5 py-2 text-center min-w-[145px] transition cursor-pointer"
                        >
                          <span className="block text-xs font-medium text-[#2C1810] dark:text-[#EDE3DA]">
                            + Upload photo
                          </span>
                          <span className="block text-[11px] text-[#A8988D] mt-0.5">
                            Required per activity
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. SECTION: MEDICINES */}
        {/* ======================================================== */}
        {(activeTab === "All" || activeTab === "Medicines") && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Medicines
                </h2>
                <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                  Check medicines administered
                </p>
              </div>
              <span className="bg-[#F7EFE9] dark:bg-[#33251E] text-[#7D5A47] dark:text-[#D5A794] text-xs font-semibold px-3.5 py-1 rounded-full">
                {medicinesDoneCount} of {medicines.length} done
              </span>
            </div>

            <div className="space-y-3 mt-3.5">
              {medicines.map((med, idx) => {
                const isAdministered = !!med.is_administered;
                const status = med.status || (isAdministered ? "Completed" : "Upcoming");

                let badgeStyle = "bg-[#EFF6FF] text-[#1D4ED8] dark:bg-[#1E293B] dark:text-[#93C5FD]";
                if (isAdministered) {
                  badgeStyle = "bg-[#E8F8EE] text-[#1E824C] dark:bg-[#16331E] dark:text-[#80E69B]";
                } else if (status === "Overdue") {
                  badgeStyle = "bg-[#FEECEE] text-[#B91C1C] dark:bg-[#3D1A1A] dark:text-[#FCA5A5]";
                } else if (status === "Due now") {
                  badgeStyle = "bg-[#FFF4E6] text-[#A25729] dark:bg-[#38271A] dark:text-[#FBBF24]";
                }

                return (
                  <div
                    key={med.id || idx}
                    className="rounded-[18px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-6 shadow-xs flex items-center justify-between gap-4"
                  >
                    {/* Checkbox and Info */}
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => handleToggleMedicine(idx)}
                        className={`w-5 h-5 rounded-[5px] border flex items-center justify-center transition shrink-0 ${
                          isReadOnly ? "cursor-default" : "cursor-pointer"
                        } ${
                          isAdministered
                            ? "border-[#2C1810] dark:border-[#EDE3DA] bg-[#2C1810] dark:bg-[#EDE3DA] text-white dark:text-[#2C1810]"
                            : "border-[#CBB4A5] dark:border-[#4A3D34] bg-white dark:bg-[#241E1B]"
                        }`}
                      >
                        {isAdministered && <FaCheck size={9} />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                          {med.medicine_name}
                        </h4>
                        <p className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                          {isAdministered && med.completed_at
                            ? `${med.dosage} · Completed · ${med.completed_at}`
                            : med.dosage}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <span className={`inline-block px-4.5 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
                        {isAdministered ? "Given" : status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. SECTION: THERAPY */}
        {/* ======================================================== */}
        {(activeTab === "All" || activeTab === "Therapy") && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                  Therapy
                </h2>
                <p className="text-xs font-normal text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                  Check Therapies completed
                </p>
              </div>
              <span className="bg-[#F7EFE9] dark:bg-[#33251E] text-[#7D5A47] dark:text-[#D5A794] text-xs font-semibold px-3.5 py-1 rounded-full">
                {therapiesDoneCount} of {therapies.length} done
              </span>
            </div>

            <div className="space-y-3 mt-3.5">
              {therapies.map((th, idx) => {
                const isCompleted = th.status === "Completed" || !!th.is_completed;
                const status = th.status || (isCompleted ? "Completed" : "Due now");

                let badgeStyle = "bg-[#EFF6FF] text-[#1D4ED8] dark:bg-[#1E293B] dark:text-[#93C5FD]";
                if (isCompleted) {
                  badgeStyle = "bg-[#E8F8EE] text-[#1E824C] dark:bg-[#16331E] dark:text-[#80E69B]";
                } else if (status === "Overdue") {
                  badgeStyle = "bg-[#FEECEE] text-[#B91C1C] dark:bg-[#3D1A1A] dark:text-[#FCA5A5]";
                } else if (status === "Due now") {
                  badgeStyle = "bg-[#FFF4E6] text-[#A25729] dark:bg-[#38271A] dark:text-[#FBBF24]";
                }

                return (
                  <div
                    key={th.id || idx}
                    className="rounded-[18px] border border-[#E7DBD3] dark:border-[#382D25] bg-white dark:bg-[#201A17] px-6 py-6 shadow-xs flex items-center justify-between gap-4"
                  >
                    {/* Checkbox and Info */}
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => handleToggleTherapy(idx)}
                        className={`w-5 h-5 rounded-[5px] border flex items-center justify-center transition shrink-0 ${
                          isReadOnly ? "cursor-default" : "cursor-pointer"
                        } ${
                          isCompleted
                            ? "border-[#2C1810] dark:border-[#EDE3DA] bg-[#2C1810] dark:bg-[#EDE3DA] text-white dark:text-[#2C1810]"
                            : "border-[#CBB4A5] dark:border-[#4A3D34] bg-white dark:bg-[#241E1B]"
                        }`}
                      >
                        {isCompleted && <FaCheck size={9} />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                          {th.therapy_name}
                        </h4>
                        <p className="text-[11px] text-[#7D726B] dark:text-[#A8988D] mt-0.5">
                          {isCompleted
                            ? `Completed · ${th.completed_at || "07:40 AM"}`
                            : "Pending"}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <span className={`inline-block px-4.5 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
                        {isCompleted ? "Completed" : status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. BOTTOM ACTION: SAVE DAILY LOG (Hidden when Read-Only) */}
        {/* ======================================================== */}
        {!isReadOnly && (
          <div className="mt-8 pb-10">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#70422D] hover:bg-[#5C3422] text-white py-3.5 rounded-xl font-bold text-sm shadow-xs flex items-center justify-center gap-2.5 cursor-pointer transition disabled:opacity-50"
            >
              <HiOutlineArrowRightOnRectangle size={18} />
              <span>{saving ? "Saving Daily Log..." : "Save Daily Log"}</span>
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NursePatientDailyLog;
