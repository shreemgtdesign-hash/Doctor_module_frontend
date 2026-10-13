import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    HiOutlineArrowLeft,
    HiOutlineCalendar,
    HiChevronDown,
} from "react-icons/hi";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { loadTherapiesPerformedTable } from "../../../redux/therapist/therapistThunk";

const FILTER_OPTIONS = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "All", value: "all" },
];

const TherapiesPerformedTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [period, setPeriod] = useState("week");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const {
        therapiesPerformedTable = {},
        therapiesPerformedTableLoading = false,
        therapiesPerformedTableError = null,
    } = useSelector((state) => state.therapist || {});

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Load data on mount & period change
    useEffect(() => {
        dispatch(loadTherapiesPerformedTable(period));
    }, [dispatch, period]);

    // Extract table rows safely
    const tableData =
        (Array.isArray(therapiesPerformedTable?.data) &&
            therapiesPerformedTable.data) ||
        (Array.isArray(therapiesPerformedTable?.therapies) &&
            therapiesPerformedTable.therapies) ||
        (Array.isArray(therapiesPerformedTable?.list) &&
            therapiesPerformedTable.list) ||
        [];

    // Extract total count and bullet text
    const totalCount =
        therapiesPerformedTable?.total_count ??
        therapiesPerformedTable?.total_therapies ??
        therapiesPerformedTable?.total ??
        tableData.length;

    const bulletText =
        therapiesPerformedTable?.bullet_text ||
        therapiesPerformedTable?.total_text ||
        `${totalCount} Therapies`;

    // Clean bullet display: ensure leading bullet symbol
    const cleanBulletDisplay = bulletText.startsWith("•")
        ? bulletText
        : `• ${bulletText}`;

    // Resolve currently selected filter label
    const selectedOption =
        FILTER_OPTIONS.find(
            (opt) =>
                opt.value === period ||
                opt.value?.toLowerCase() === period?.toLowerCase() ||
                opt.label?.toLowerCase() === period?.toLowerCase()
        ) ||
        FILTER_OPTIONS.find(
            (opt) =>
                opt.label.toLowerCase() ===
                therapiesPerformedTable?.period?.toLowerCase()
        ) ||
        FILTER_OPTIONS[1]; // default to "This Week"

    const handlePeriodSelect = (newPeriod) => {
        setPeriod(newPeriod);
        setDropdownOpen(false);
    };

    return (
        <DashboardLayout role="therapist">
            <div className="min-h-screen bg-[#FBF8F5] px-4 py-6 sm:px-6 md:px-8">
                {/* ========================================= */}
                {/* BACK NAVIGATION */}
                {/* ========================================= */}
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => navigate("/therapist/dashboard")}
                        className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-[13px] font-medium text-[#7D6B61] transition-colors hover:bg-[#F2ECE5] hover:text-[#4D2E23]"
                    >
                        <HiOutlineArrowLeft size={16} />
                        <span>Back to Dashboard</span>
                    </button>
                </div>

                {/* ========================================= */}
                {/* HEADER: TITLE + PERIOD FILTER */}
                {/* ========================================= */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-bold text-[#3B2219] sm:text-[24px]">
                            {therapiesPerformedTable?.title || "Therapies Performed"}
                        </h1>
                        <p className="mt-1 flex items-center text-[14px] font-medium text-[#4D2E23]">
                            {cleanBulletDisplay}
                        </p>
                    </div>

                    {/* PERIOD DROPDOWN */}
                    <div ref={dropdownRef} className="relative inline-block">
                        <button
                            type="button"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="inline-flex h-[40px] items-center gap-2.5 rounded-xl border border-[#E4D9C5] bg-white px-4 text-[13px] font-medium text-[#4D2E23] shadow-sm transition hover:border-[#8A4F32]"
                        >
                            <HiOutlineCalendar
                                size={17}
                                className="text-[#6B4D3E]"
                            />
                            <span>{selectedOption?.label || "This Week"}</span>
                            <HiChevronDown
                                size={16}
                                className={`text-[#6B4D3E] transition-transform duration-200 ${
                                    dropdownOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-[46px] z-50 min-w-[150px] overflow-hidden rounded-xl border border-[#E4D9C5] bg-white py-1 shadow-[0_8px_20px_rgba(89,53,44,0.12)]">
                                {FILTER_OPTIONS.map((opt) => {
                                    const isSelected =
                                        opt.value === selectedOption.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() =>
                                                handlePeriodSelect(opt.value)
                                            }
                                            className={`block w-full px-4 py-2.5 text-left text-[13px] transition ${
                                                isSelected
                                                    ? "bg-[#FAF3EB] font-semibold text-[#8A4F32]"
                                                    : "text-[#555] hover:bg-[#FAF6F2] hover:text-[#3B2219]"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================= */}
                {/* TABLE CONTAINER */}
                {/* ========================================= */}
                <div className="mt-6 overflow-hidden rounded-[16px] border border-[#E8DDD6] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            {/* TABLE HEADER */}
                            <thead>
                                <tr className="border-b border-[#E8DDD6] bg-[#FAF3EB]">
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#634E42]">
                                        Patient Details
                                    </th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#634E42]">
                                        Therapy
                                    </th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#634E42]">
                                        Time
                                    </th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#634E42]">
                                        Doctor
                                    </th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#634E42]">
                                        Therapist
                                    </th>
                                    <th className="px-6 py-4 text-center text-[13px] font-semibold text-[#634E42]">
                                        Therapist
                                    </th>
                                </tr>
                            </thead>

                            {/* TABLE BODY */}
                            <tbody className="divide-y divide-[#F4ECE5]">
                                {therapiesPerformedTableLoading &&
                                tableData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8A4F32] border-t-transparent" />
                                                <p className="text-[14px] text-[#7D6B61]">
                                                    Loading therapies performed...
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : therapiesPerformedTableError &&
                                  tableData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center"
                                        >
                                            <p className="text-[14px] font-medium text-red-600">
                                                Failed to load therapies performed.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    dispatch(
                                                        loadTherapiesPerformedTable(
                                                            period
                                                        )
                                                    )
                                                }
                                                className="mt-3 rounded-lg bg-[#8A4F32] px-4 py-1.5 text-[12px] font-medium text-white transition hover:bg-[#6D3D26]"
                                            >
                                                Try Again
                                            </button>
                                        </td>
                                    </tr>
                                ) : tableData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center"
                                        >
                                            <p className="text-[14px] font-medium text-[#7D6B61]">
                                                No therapies performed recorded for this period.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    tableData.map((item, index) => {
                                        // Patient Details
                                        const patientName =
                                            item.patient_name ||
                                            item.patient_details?.patient_name ||
                                            item.patient_details?.name ||
                                            "—";

                                        const patientId =
                                            item.patient_id ||
                                            item.patient_code ||
                                            item.patient_details?.patient_id ||
                                            item.patient_details?.patient_code ||
                                            "";

                                        // Therapy Details
                                        const therapyName =
                                            item.therapy_name ||
                                            item.therapy?.therapy_name ||
                                            item.therapy?.name ||
                                            "—";

                                        const duration =
                                            item.duration ||
                                            item.treatment_duration ||
                                            item.therapy?.duration ||
                                            item.therapy?.treatment_duration ||
                                            (item.duration_minutes
                                                ? `${item.duration_minutes} mins`
                                                : "") ||
                                            "—";

                                        // Time
                                        const time =
                                            item.time ||
                                            item.formatted_time ||
                                            item.slot_time ||
                                            "—";

                                        // Doctor
                                        const doctorName =
                                            item.doctor_name ||
                                            item.doctor?.doctor_name ||
                                            item.doctor?.name ||
                                            "—";

                                        // Therapist
                                        const therapistName =
                                            item.therapist_name ||
                                            item.therapist?.therapist_name ||
                                            item.therapist?.name ||
                                            "—";

                                        // Badge / Category (Column 6)
                                        const badgeText =
                                            item.therapist_badge ||
                                            item.badge ||
                                            item.category ||
                                            item.department ||
                                            "Panchakarma";

                                        return (
                                            <tr
                                                key={
                                                    item.id ||
                                                    item.booking_id ||
                                                    `therapy-row-${index}`
                                                }
                                                className="transition-colors hover:bg-[#FAF6F2]/60"
                                            >
                                                {/* Patient Details */}
                                                <td className="px-6 py-4 align-middle">
                                                    <p className="text-[14px] font-bold text-[#3B2219]">
                                                        {patientName}
                                                    </p>
                                                    {patientId && (
                                                        <p className="mt-0.5 text-[12px] text-[#8C7A70]">
                                                            Patient ID: {patientId}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Therapy */}
                                                <td className="px-6 py-4 align-middle">
                                                    <p className="text-[14px] font-bold text-[#3B2219]">
                                                        {therapyName}
                                                    </p>
                                                    <p className="mt-0.5 text-[12px] text-[#8C7A70]">
                                                        {duration}
                                                    </p>
                                                </td>

                                                {/* Time */}
                                                <td className="px-6 py-4 align-middle">
                                                    <p className="text-[14px] font-bold text-[#3B2219]">
                                                        {time}
                                                    </p>
                                                </td>

                                                {/* Doctor */}
                                                <td className="px-6 py-4 align-middle">
                                                    <p className="text-[14px] font-bold text-[#3B2219]">
                                                        {doctorName}
                                                    </p>
                                                </td>

                                                {/* Therapist */}
                                                <td className="px-6 py-4 align-middle">
                                                    <p className="text-[14px] font-bold text-[#3B2219]">
                                                        {therapistName}
                                                    </p>
                                                </td>

                                                {/* Badge / Category */}
                                                <td className="px-6 py-4 text-center align-middle">
                                                    <span className="inline-flex items-center justify-center rounded-full border border-[#F2DFD2] bg-[#FAF0E6] px-4 py-1 text-[12px] font-medium text-[#7A4B38]">
                                                        {badgeText}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TherapiesPerformedTable;
