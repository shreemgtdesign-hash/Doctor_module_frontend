import {
    useEffect,
    useState,
    useMemo,
    useRef,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    HiChevronRight,
    HiOutlineChevronDown,
    HiOutlineCalendarDays,
    HiCheck,
} from "react-icons/hi2";

import {
    loadPatientWellness,
} from "../../../redux/consultation/consultationThunk";

import {
    getPatientWellness,
} from "../../../api/doctorAppointmentApi";


const fields = [
    {
        key: "bp",
        label: "BP",
        unit: "mmHg",
    },
    {
        key: "sugar",
        label: "Sugar",
        unit: "mg/dL",
    },
    {
        key: "pulse",
        label: "Pulse",
        unit: "bpm",
    },
    {
        key: "spo2",
        label: "SpO2",
        unit: "%",
    },
    {
        key: "temperature",
        label: "Temp.",
        unit: "C",
    },
    {
        key: "toxicity",
        label: "Toxicity",
        unit: "%",
    },
];


const JuniorVitals = ({
    patientId,
}) => {

    const dispatch = useDispatch();
    const dropdownRef = useRef(null);

    const {
        patientWellness,
    } = useSelector(
        (state) => state.consultation
    );

    const [values, setValues] = useState({});
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isViewingPast, setIsViewingPast] = useState(false);
    const [selectedDateLabel, setSelectedDateLabel] = useState("Today");
    const [showPastVitals, setShowPastVitals] = useState(false);
    const [loadingVitals, setLoadingVitals] = useState(false);

    // =====================================================
    // FORMAT DATE DISPLAY HELPER
    // =====================================================

    const formatDateDisplay = (item) => {
        if (!item) return "";
        if (item.formatted_date) return item.formatted_date;
        if (item.label) return item.label;
        if (item.date) {
            try {
                const d = new Date(item.date);
                if (!isNaN(d.getTime())) {
                    return d.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                }
            } catch (e) {
                // fallback
            }
            return String(item.date);
        }
        return "Recorded Vitals";
    };

    // =====================================================
    // PREVIOUS DATES FROM HISTORY
    // =====================================================

    const previousDates = useMemo(() => {
        const raw =
            patientWellness?.history ||
            patientWellness?.past_vitals ||
            patientWellness?.vitals_history ||
            patientWellness?.records ||
            [];
        let list = Array.isArray(raw) ? raw.filter((item) => item && !item.is_today) : [];
        if (
            list.length === 0 &&
            patientWellness?.previous &&
            typeof patientWellness.previous === "object" &&
            !patientWellness.previous.is_today
        ) {
            list = [patientWellness.previous];
        }
        return list;
    }, [patientWellness]);

    // =====================================================
    // HELPER: MATCH PAST RECORD FROM API RESPONSE
    // =====================================================

    const findRecordForDate = (resData, targetItem) => {
        if (!resData || typeof resData !== "object") return null;

        const targetDate = targetItem?.date;
        const targetId = targetItem?.id;

        // 1. Look in history array
        const historyList =
            resData.history ||
            resData.past_vitals ||
            resData.vitals_history ||
            resData.records;
        if (Array.isArray(historyList) && historyList.length > 0) {
            if (targetDate) {
                const matchByDate = historyList.find(
                    (h) => h && h.date === targetDate && !h.is_today
                );
                if (matchByDate) return matchByDate;
            }
            if (targetId) {
                const matchById = historyList.find(
                    (h) => h && h.id === targetId && !h.is_today
                );
                if (matchById) return matchById;
            }
            if (targetDate) {
                const matchAnyDate = historyList.find((h) => h && h.date === targetDate);
                if (matchAnyDate) return matchAnyDate;
            }
        }

        // 2. Check previous
        if (resData.previous && typeof resData.previous === "object") {
            if (
                (targetDate && resData.previous.date === targetDate) ||
                (targetId && resData.previous.id === targetId) ||
                !resData.previous.is_today
            ) {
                return resData.previous;
            }
        }

        // 3. Check vitals property if present and not today
        if (resData.vitals && typeof resData.vitals === "object") {
            if (
                (targetDate && (resData.date === targetDate || resData.vitals.date === targetDate)) ||
                !resData.vitals.is_today
            ) {
                return resData.vitals;
            }
        }

        // 4. Check resData itself if matching date and not today
        if (
            resData.date &&
            targetDate &&
            resData.date === targetDate &&
            !resData.is_today
        ) {
            return resData;
        }

        // NEVER fallback to resData.today or resData (which contains today's vitals)
        return null;
    };

    // =====================================================
    // APPLY VITALS TO FORM STATE
    // =====================================================

    const applyVitalsToState = (record) => {
        if (!record) return;
        const v = record.vitals || record;
        setValues({
            bp: v.bp ?? "",
            sugar: v.sugar ?? "",
            pulse: v.pulse ?? "",
            spo2: v.spo2 ?? "",
            temperature: v.temperature ?? v.temp ?? "",
            toxicity: v.toxicity ?? v.body_toxicity ?? "",
        });
    };

    // =====================================================
    // LOAD WELLNESS ON MOUNT / PATIENT CHANGE
    // =====================================================

    useEffect(() => {
        setIsViewingPast(false);
        setSelectedRecord(null);
        setSelectedDateLabel("Today");
        setShowPastVitals(false);

        if (!patientId) {
            return;
        }

        dispatch(
            loadPatientWellness({
                patientId,
                period: "today",
            })
        );
    }, [dispatch, patientId]);

    // =====================================================
    // SYNC TODAY'S VITALS (WHEN NOT VIEWING PAST)
    // =====================================================

    useEffect(() => {
        if (!isViewingPast) {
            const today = patientWellness?.today || patientWellness || {};
            applyVitalsToState(today);
        }
    }, [patientWellness, isViewingPast]);

    // =====================================================
    // CLOSE DROPDOWN ON CLICK OUTSIDE
    // =====================================================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowPastVitals(false);
            }
        };

        if (showPastVitals) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPastVitals]);

    // =====================================================
    // SELECT PREVIOUS DATE
    // =====================================================

    const handleDateChange = async (historyItem) => {
        if (!historyItem) return;

        setShowPastVitals(false);
        setIsViewingPast(true);

        const label = formatDateDisplay(historyItem);
        setSelectedDateLabel(label);

        // 1. Immediately apply any inline data available
        const inlineData = historyItem.vitals
            ? { ...historyItem, ...historyItem.vitals, formatted_date: label, is_today: false }
            : { ...historyItem, formatted_date: label, is_today: false };

        setSelectedRecord(inlineData);
        applyVitalsToState(inlineData);

        // 2. Fetch specific date vitals from backend if patientId and date exist
        if (patientId && historyItem.date) {
            setLoadingVitals(true);
            try {
                const response = await getPatientWellness(patientId, {
                    date: historyItem.date,
                });
                const resData = response?.data?.data || response?.data;
                const remoteRecord = findRecordForDate(resData, historyItem);

                if (remoteRecord && typeof remoteRecord === "object") {
                    const merged = {
                        ...inlineData,
                        ...remoteRecord,
                        formatted_date: label,
                        is_today: false,
                    };
                    setSelectedRecord(merged);
                    applyVitalsToState(merged);
                }
            } catch (err) {
                console.warn("Could not fetch remote vitals for date, using inline history data:", err);
            } finally {
                setLoadingVitals(false);
            }
        }
    };

    // =====================================================
    // RETURN TO TODAY
    // =====================================================

    const handleToday = () => {
        setShowPastVitals(false);
        setIsViewingPast(false);
        setSelectedRecord(null);
        setSelectedDateLabel("Today");

        const today = patientWellness?.today || patientWellness || {};
        applyVitalsToState(today);
    };

    // =====================================================
    // HANDLE CHANGE FOR CURRENT INPUTS
    // =====================================================

    const handleChange = (key, value) => {
        setValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // =====================================================
    // AYURVEDIC BODY TYPE
    // =====================================================

    const activeRecord = selectedRecord || patientWellness?.today || patientWellness || {};
    const bodyType =
        activeRecord.ayurvedic_body_type ||
        activeRecord.body_type ||
        activeRecord.ayurvedic_type ||
        patientWellness?.ayurvedic_body_type ||
        patientWellness?.body_type ||
        "--";

    return (
        <div className="rounded-[16px] border border-[#E8DDD4] bg-white">
            {/* ================================================= */}
            {/* VITALS GRID */}
            {/* ================================================= */}
            <div className="overflow-hidden rounded-t-[16px] grid grid-cols-[138px_1fr_1fr_1fr]">
                {/* ============================================= */}
                {/* AYURVEDIC BODY TYPE */}
                {/* ============================================= */}
                <div className="row-span-2 flex flex-col items-center justify-center border-r border-[#E8DDD4] bg-[#FFFBF7] px-4 py-5">
                    <p className="text-center text-[14px] font-semibold leading-[18px] text-[#4D2E23]">
                        Ayurvedic
                        <br />
                        Body Type
                    </p>

                    <p className="mt-7 text-[18px] font-semibold text-[#2F2521]">
                        {bodyType}
                    </p>

                    {/* Decorative leaf */}
                    <div className="mt-5 text-[#DDBA91] opacity-70">
                        <svg
                            width="58"
                            height="45"
                            viewBox="0 0 58 45"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8 39C18 28 28 18 51 7"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinecap="round"
                            />
                            <path
                                d="M15 31C13 25 14 20 18 17"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />
                            <path
                                d="M21 27C20 20 22 15 27 12"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />
                            <path
                                d="M29 22C29 16 32 11 37 9"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />
                            <path
                                d="M36 18C38 13 42 10 47 8"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* ================================================= */}
                {/* SIX VITALS */}
                {/* ================================================= */}
                {fields.map((field, index) => {
                    const isTopRow = index < 3;
                    const isLastColumn = index === 2 || index === 5;

                    return (
                        <div
                            key={field.key}
                            className={`flex min-h-[105px] flex-col items-center justify-center px-3 py-4 ${
                                !isLastColumn ? "border-r border-[#E8DDD4]" : ""
                            } ${isTopRow ? "border-b border-[#E8DDD4]" : ""}`}
                        >
                            {/* Label */}
                            <p className="w-full text-left text-[13px] font-semibold text-[#4D2E23]">
                                {field.label}
                            </p>

                            {/* Value */}
                            <input
                                type="text"
                                value={values[field.key] ?? ""}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder="--"
                                className="mt-2 w-full border-0 bg-transparent text-center text-[20px] font-semibold leading-none text-[#2F2521] outline-none placeholder:text-[#9AA0AE]"
                            />

                            {/* Unit */}
                            <p className="mt-2 text-[12px] text-[#8B7A70]">
                                {field.unit}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* ================================================= */}
            {/* VIEW PAST VITALS BAR + DROPDOWN */}
            {/* ================================================= */}
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-[#E8DDD4] px-4 py-3 gap-2 rounded-b-[16px]">
                {/* Left side: Context badge */}
                {isViewingPast ? (
                    <div className="flex items-center gap-2 text-[12px] text-[#8A563B]">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#8A563B]" />
                        <span>
                            Showing past vitals for <strong>{selectedDateLabel}</strong>
                        </span>
                        <button
                            type="button"
                            onClick={handleToday}
                            className="ml-1 text-[12px] font-bold text-[#6E3C27] hover:underline cursor-pointer"
                        >
                            (Back to Today)
                        </button>
                    </div>
                ) : (
                    <div className="text-[12px] text-[#8B7A70]">
                        Recorded vitals for today
                    </div>
                )}

                {/* Right side: Button & Dropdown */}
                <div className="relative ml-auto" ref={dropdownRef}>
                    <button
                        type="button"
                        disabled={loadingVitals}
                        onClick={() => setShowPastVitals((prev) => !prev)}
                        className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4D2E23] transition hover:text-[#8A563B] disabled:opacity-50 cursor-pointer"
                    >
                        <span>{isViewingPast ? selectedDateLabel : "View Past Vitals"}</span>
                        <HiOutlineChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                                showPastVitals ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* PAST VITALS DROPDOWN */}
                    {showPastVitals && (
                        <div className="absolute right-0 top-full mt-2 z-50 w-[220px] overflow-hidden rounded-xl border border-[#EBDDD2] bg-white shadow-[0_8px_25px_rgba(89,53,44,0.14)]">
                            {/* HEADER */}
                            <div className="flex items-center justify-between border-b border-[#F0E5DE] px-3.5 py-2.5 bg-[#FAF6F2]">
                                <span className="text-[11px] font-bold text-[#59352C]">
                                    Previous Vitals
                                </span>
                                <HiOutlineCalendarDays size={14} className="text-[#8A563B]" />
                            </div>

                            {/* TODAY OPTION */}
                            <button
                                type="button"
                                onClick={handleToday}
                                className={`flex w-full items-center justify-between border-b border-[#F5ECE6] px-3.5 py-2.5 text-left text-[11px] transition hover:bg-[#FFF8F3] cursor-pointer ${
                                    !isViewingPast
                                        ? "bg-[#FFF4EC] font-bold text-[#6E3C27]"
                                        : "font-medium text-[#59352C]"
                                }`}
                            >
                                <span>Today</span>
                                {!isViewingPast ? (
                                    <HiCheck size={14} className="text-[#2E7D32]" />
                                ) : (
                                    <HiChevronRight size={13} className="text-[#8A563B]" />
                                )}
                            </button>

                            {/* PREVIOUS DATES LIST */}
                            {previousDates.length > 0 ? (
                                <div className="max-h-[200px] overflow-y-auto p-1">
                                    {previousDates.map((item, index) => {
                                        const itemKey = item.id || item.date || index;
                                        const label = formatDateDisplay(item);
                                        const isSelected =
                                            isViewingPast &&
                                            (selectedRecord?.date === item.date ||
                                                selectedDateLabel === label);

                                        return (
                                            <button
                                                key={itemKey}
                                                type="button"
                                                onClick={() => handleDateChange(item)}
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[11px] transition hover:bg-[#FFF8F3] cursor-pointer ${
                                                    isSelected
                                                        ? "bg-[#FFF4EC] font-bold text-[#6E3C27]"
                                                        : "text-[#59352C]"
                                                }`}
                                            >
                                                <span>{label}</span>
                                                {isSelected ? (
                                                    <HiCheck size={14} className="text-[#2E7D32]" />
                                                ) : (
                                                    <HiChevronRight
                                                        size={13}
                                                        className="shrink-0 text-[#8A563B]"
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="px-3.5 py-3 text-[11px] text-[#8A7A71]">
                                    No previous vitals available.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JuniorVitals;
