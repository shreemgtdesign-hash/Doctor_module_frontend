import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    HiOutlineMagnifyingGlass,
} from "react-icons/hi2";



import ViewXrayReport from "./ViewXrayReport";
import { loadPatientReports } from "../../../redux/consultation/consultationThunk";
import { selectPatientReports, selectPatientReportsLoading } from "../../../redux/consultation/consultationSlice";
import ConsultationTimer from "../components/ConsultationTimer";


const Reports = ({
    patient,
    onBack,
    onContinue,
    consultationTimerStarted,
    consultationTimeLeft
}) => {

    const dispatch = useDispatch();


    // ==========================================
    // STATE
    // ==========================================

    const [search, setSearch] = useState("");

    const [activeCategory, setActiveCategory] =
        useState("All");

    const [selectedReportId, setSelectedReportId] =
        useState(null);


    // ==========================================
    // REDUX
    // ==========================================

    const reports = useSelector(
        selectPatientReports
    );

    const loading = useSelector(
        selectPatientReportsLoading
    );


    // ==========================================
    // PATIENT ID
    // ==========================================

    const patientId =
        patient?.patient_id ||
        patient?.id ||
        patient?.patient?.id ||
        "";


    // ==========================================
    // LOAD PATIENT REPORTS
    // ==========================================

    useEffect(() => {

        if (!patientId) {
            return;
        }

        dispatch(
            loadPatientReports({
                patientId,
            })
        );

    }, [
        dispatch,
        patientId,
    ]);


    // ==========================================
    // REPORT CATEGORIES
    // ==========================================

    const categories = useMemo(() => {

        const types = new Set();

        reports.forEach((report) => {

            if (report?.report_type) {

                types.add(
                    report.report_type
                );
            }
        });

        return [
            "All",
            ...Array.from(types),
        ];

    }, [reports]);


    // ==========================================
    // FILTER REPORTS
    // ==========================================

    const filteredReports = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase();


        return reports.filter((report) => {

            const matchesSearch =
                !searchValue ||
                report?.report_name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                report?.report_type
                    ?.toLowerCase()
                    .includes(searchValue) ||
                report?.lab_name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                report?.findings
                    ?.toLowerCase()
                    .includes(searchValue);


            const matchesCategory =
                activeCategory === "All" ||
                report?.report_type
                    ?.toLowerCase() ===
                    activeCategory.toLowerCase();


            return (
                matchesSearch &&
                matchesCategory
            );

        });

    }, [
        reports,
        search,
        activeCategory,
    ]);


    // ==========================================
    // GROUP REPORTS BY DATE
    // ==========================================

    const groupedReports = useMemo(() => {

        const groups = {};


        filteredReports.forEach(
            (report) => {

                const date =
                    report?.date_text ||
                    "Unknown Date";


                if (!groups[date]) {

                    groups[date] = [];
                }


                groups[date].push(report);

            }
        );


        return Object.entries(groups);

    }, [filteredReports]);


    // ==========================================
    // VIEW REPORT
    // ==========================================

    if (selectedReportId) {

        return (

            <ViewXrayReport
                reportId={
                    selectedReportId
                }
                patient={patient}
                onBack={() =>
                    setSelectedReportId(null)
                }
            />

        );
    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div
            className="
                flex
                h-full
                min-h-0
                flex-col
                bg-white
            "
        >

            {/* =====================================
                REPORT CONTENT
            ===================================== */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-7
                    
                    scrollbar-thin
                    scrollbar-thumb-[#E7D8CE]
                    scrollbar-track-transparent
                "
            >

                {/* =================================
                    PATIENT HEADER
                ================================= */}

               

                {/* =================================
                    REPORT TITLE
                ================================= */}

                <div className="mt-6 flex items-center justify-between">
                   <div> 
                    <h2
                        className="
                            text-[19px]
                            font-semibold
                            text-[#59352C]
                        "
                    >
                        Reports
                    </h2>

                    <p
                        className="
                            mt-1
                            text-[14px]
                            text-[#6F625A]
                        "
                    >
                        View and manage patient reports.
                    </p>
                    </div>

                     {consultationTimerStarted && (
          <ConsultationTimer
            timeLeft={
              consultationTimeLeft
            }
          />
        )}

                </div>


                {/* =================================
                    SEARCH
                ================================= */}

                <div
                    className="
                        relative
                        mt-4
                    "
                >

                    <HiOutlineMagnifyingGlass
                        size={20}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-[#59352C]
                        "
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search by report"
                        className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[#E8DDD5]
                            bg-white
                            pl-11
                            pr-4
                            text-[14px]
                            text-[#35231D]
                            outline-none
                            placeholder:text-[#99908A]
                            focus:border-[#8B573D]
                        "
                    />

                </div>


                {/* =================================
                    CATEGORY FILTERS
                ================================= */}

                <div
                    className="
                        mt-3
                        flex
                        gap-2
                        overflow-x-auto
                        pb-1
                    "
                >

                    {categories.map(
                        (category) => (

                            <button
                                key={category}
                                type="button"
                                onClick={() =>
                                    setActiveCategory(
                                        category
                                    )
                                }
                                className={`
                                    shrink-0
                                    rounded-xl
                                    border
                                    px-4
                                    py-2
                                    text-[13px]
                                    font-medium
                                    transition
                                    ${
                                        activeCategory ===
                                        category
                                            ? "border-[#59352C] bg-[#FFF5EA] font-semibold text-[#59352C]"
                                            : "border-[#DCCFC5] bg-white text-[#59352C] hover:bg-[#FFF9F4]"
                                    }
                                `}
                            >
                                {category}
                            </button>

                        )
                    )}

                </div>


                {/* =================================
                    REPORTS
                ================================= */}

                <div className="mt-5 pb-5">

                    {loading ? (

                        <div
                            className="
                                py-16
                                text-center
                                text-[14px]
                                text-[#8B7A70]
                            "
                        >
                            Loading reports...
                        </div>

                    ) : groupedReports.length === 0 ? (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#EFE4DC]
                                bg-[#FFFCF9]
                                py-16
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-[15px]
                                    font-medium
                                    text-[#59352C]
                                "
                            >
                                No reports found
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[13px]
                                    text-[#8B7A70]
                                "
                            >
                                No reports are available for
                                this patient.
                            </p>

                        </div>

                    ) : (

                        groupedReports.map(
                            ([date, dateReports]) => (

                                <div
                                    key={date}
                                    className="mb-4"
                                >

                                    {/* Date Header */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            rounded-t-xl
                                            border
                                            border-[#EFE4DC]
                                            bg-[#FFF7EF]
                                            px-4
                                            py-3
                                        "
                                    >

                                        <h3
                                            className="
                                                text-[15px]
                                                font-semibold
                                                text-[#35231D]
                                            "
                                        >
                                            {date}
                                        </h3>


                                        <span
                                            className="
                                                text-[12px]
                                                text-[#59352C]
                                            "
                                        >
                                            {dateReports.length}{" "}
                                            {dateReports.length ===
                                            1
                                                ? "File"
                                                : "Files"}
                                        </span>

                                    </div>


                                    {/* Report Cards */}

                                    <div
                                        className="
                                            space-y-3
                                            rounded-b-xl
                                            border
                                            border-t-0
                                            border-[#EFE4DC]
                                            p-3
                                        "
                                    >

                                        {dateReports.map(
                                            (report) => (

                                                <div
                                                    key={
                                                        report.id
                                                    }
                                                    className="
                                                        rounded-2xl
                                                        border
                                                        border-[#EEE3DB]
                                                        bg-white
                                                        p-4
                                                        shadow-[0_2px_6px_rgba(89,53,44,0.04)]
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            justify-between
                                                            gap-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                min-w-0
                                                            "
                                                        >

                                                            <h4
                                                                className="
                                                                    text-[16px]
                                                                    font-semibold
                                                                    text-[#59352C]
                                                                "
                                                            >
                                                                {
                                                                    report.report_name ||
                                                                    report.report_type ||
                                                                    "Report"
                                                                }
                                                            </h4>


                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[13px]
                                                                    text-[#59352C]
                                                                "
                                                            >
                                                                {
                                                                    report.date_text
                                                                }
                                                            </p>


                                                            {report.lab_name && (

                                                                <p
                                                                    className="
                                                                        mt-2
                                                                        text-[12px]
                                                                        text-[#8B7A70]
                                                                    "
                                                                >
                                                                    Lab:{" "}
                                                                    {
                                                                        report.lab_name
                                                                    }
                                                                </p>

                                                            )}

                                                        </div>


                                                        {/* Status */}

                                                        <span
                                                            className={`
                                                                shrink-0
                                                                rounded-lg
                                                                px-3
                                                                py-1
                                                                text-[11px]
                                                                font-medium
                                                                ${
                                                                    report.status?.toLowerCase() ===
                                                                    "reviewed"
                                                                        ? "bg-[#E9F9EE] text-[#287442]"
                                                                        : "bg-[#FFF5E8] text-[#8A5A20]"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                report.status
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase() +
                                                                report.status
                                                                    ?.slice(
                                                                        1
                                                                    )
                                                            }
                                                        </span>

                                                    </div>


                                                    {/* Findings */}

                                                    {report.findings && (

                                                        <div
                                                            className="
                                                                mt-4
                                                                border-t
                                                                border-[#F0E6DF]
                                                                pt-3
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-[12px]
                                                                    font-medium
                                                                    text-[#8B7A70]
                                                                "
                                                            >
                                                                Findings
                                                            </p>


                                                            <div
                                                                className="
                                                                    mt-1
                                                                    whitespace-pre-line
                                                                    text-[13px]
                                                                    leading-5
                                                                    text-[#49362E]
                                                                "
                                                            >
                                                                {report.findings}
                                                            </div>

                                                        </div>

                                                    )}


                                                    {/* Bottom */}

                                                    <div
                                                        className="
                                                            mt-3
                                                            flex
                                                            justify-end
                                                        "
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedReportId(
                                                                    report.id
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                                text-[13px]
                                                                font-medium
                                                                text-[#59352C]
                                                                transition
                                                                hover:underline
                                                            "
                                                        >
                                                            View Report

                                                            <span>
                                                                →
                                                            </span>

                                                        </button>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>

            </div>


            {/* =====================================
                FOOTER
            ===================================== */}

            <div
                className="
                    shrink-0
                    border-t
                    border-[#EFE4DC]
                    bg-white
                    px-7
                    py-4
                "
            >

                <div
                    className="
                        flex
                        gap-4
                    "
                >

                    <button
                        type="button"
                        onClick={onBack}
                        className="
                            flex
                            h-[58px]
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            border
                            border-[#E3D5C9]
                            bg-[#FFFCF8]
                            text-[15px]
                            font-medium
                            text-[#59352C]
                            transition
                            hover:bg-[#FFF5EA]
                        "
                    >

                        <span
                            className="text-[22px]"
                        >
                            ←
                        </span>

                        Back

                    </button>


                    <button
                        type="button"
                        onClick={onContinue}
                        className="
                            flex
                            h-[58px]
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-[#875238]
                            text-[15px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#75452F]
                        "
                    >

                        Save and Continue

                        <span
                            className="text-[20px]"
                        >
                            →
                        </span>

                    </button>

                </div>

            </div>

        </div>
    );
};


export default Reports;