import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    loadReportById,
    markReportReviewedThunk,
} from "../../../redux/consultation/consultationThunk";

import {
    selectSelectedReport,
    selectSelectedReportLoading,
    selectReportReviewLoading,
} from  "../../../redux/consultation/consultationSlice";


const ViewXRayReport = ({
    reportId,
    patient,
    onBack,
}) => {

    const dispatch = useDispatch();


    // ==========================================
    // REDUX
    // ==========================================

    const report = useSelector(
        selectSelectedReport
    );

    const loading = useSelector(
        selectSelectedReportLoading
    );

    const reviewLoading = useSelector(
        selectReportReviewLoading
    );


    // ==========================================
    // LOAD REPORT
    // ==========================================

    useEffect(() => {

        if (!reportId) {
            return;
        }

        dispatch(
            loadReportById(
                reportId
            )
        );

    }, [
        dispatch,
        reportId,
    ]);


    // ==========================================
    // MARK REVIEWED
    // ==========================================

    const handleMarkReviewed = () => {

        if (
            !report?.id ||
            reviewLoading
        ) {
            return;
        }

        dispatch(
            markReportReviewedThunk(
                report.id
            )
        );

    };


    // ==========================================
    // PATIENT NAME
    // ==========================================

    const patientName =
        patient?.patient_name ||
        patient?.name ||
        patient?.patient?.name ||
        report?.patient?.name ||
        "Patient";


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div
                className="
                    flex
                    h-full
                    flex-col
                    bg-white
                "
            >

                <div
                    className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        text-[14px]
                        text-[#8B7A70]
                    "
                >
                    Loading report...
                </div>


                <div
                    className="
                        shrink-0
                        border-t
                        border-[#EFE4DC]
                        px-7
                        py-4
                    "
                >

                    <button
                        type="button"
                        onClick={onBack}
                        className="
                            flex
                            h-[58px]
                            w-full
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
                        "
                    >
                        <span className="text-[22px]">
                            ←
                        </span>

                        Back
                    </button>

                </div>

            </div>

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
                CONTENT
            ===================================== */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-7
                    pt-7
                    scrollbar-thin
                    scrollbar-thumb-[#E7D8CE]
                    scrollbar-track-transparent
                "
            >

                {/* =================================
                    PATIENT HEADER
                ================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[#EFE4DC]
                        pb-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        {/* Profile */}

                        <div
                            className="
                                flex
                                h-[68px]
                                w-[68px]
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-full
                                border
                                border-[#E8DDD5]
                                bg-[#F2F2F2]
                            "
                        >

                            {(
                                patient?.profile_image ||
                                patient?.image_url ||
                                report?.patient?.profile_image
                            ) ? (

                                <img
                                    src={
                                        patient?.profile_image ||
                                        patient?.image_url ||
                                        report?.patient?.profile_image
                                    }
                                    alt=""
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                />

                            ) : (

                                <svg
                                    width="34"
                                    height="34"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-[#8B7A70]"
                                >

                                    <path
                                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.0784 16.1716C18.3284 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4216 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />

                                </svg>

                            )}

                        </div>


                        <div>

                            <h2
                                className="
                                    text-[20px]
                                    font-semibold
                                    text-[#35231D]
                                "
                            >
                                {patientName}
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[15px]
                                    text-[#6F625A]
                                "
                            >
                                {patient?.age
                                    ? `${patient.age} Years`
                                    : patient?.age_gender_text ||
                                      report?.patient?.age_gender_text ||
                                      ""}
                                {patient?.age &&
                                patient?.gender
                                    ? " • "
                                    : ""}
                                {patient?.gender ||
                                    report?.patient?.gender ||
                                    ""}
                            </p>


                            <div
                                className="
                                    mt-2
                                    text-[13px]
                                    text-[#8B7A70]
                                "
                            >
                                {patient?.patient_code
                                    ? `Patient ID: ${patient.patient_code}`
                                    : report?.patient?.patient_code
                                        ? `Patient ID: ${report.patient.patient_code}`
                                        : ""}
                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================
                    REPORT HEADER
                ================================= */}

                <div className="mt-6">

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-[18px]
                                    font-semibold
                                    text-[#59352C]
                                "
                            >
                                {report?.report_name ||
                                    report?.report_type ||
                                    "Report"}
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[14px]
                                    font-medium
                                    text-[#59352C]
                                "
                            >
                                {report?.date_text ||
                                    ""}
                            </p>


                            {report?.lab_name && (

                                <p
                                    className="
                                        mt-2
                                        text-[12px]
                                        text-[#8B7A70]
                                    "
                                >
                                    Lab:{" "}
                                    {report.lab_name}
                                </p>

                            )}

                        </div>


                        {/* Status */}

                        <span
                            className={`
                                shrink-0
                                rounded-lg
                                px-3
                                py-1.5
                                text-[11px]
                                font-medium
                                ${
                                    report?.status?.toLowerCase() ===
                                    "reviewed"
                                        ? "bg-[#E9F9EE] text-[#287442]"
                                        : "bg-[#FFF5E8] text-[#8A5A20]"
                                }
                            `}
                        >
                            {
                                report?.status
                                    ?.charAt(0)
                                    .toUpperCase()
                            }
                            {
                                report?.status
                                    ?.slice(1)
                            }
                        </span>

                    </div>

                </div>


                {/* =================================
                    REPORT IMAGE
                ================================= */}

                {(
                    report?.image_url ||
                    report?.file_url
                ) ? (

                    <div
                        className="
                            mt-6
                            overflow-hidden
                            rounded-2xl
                            border
                            border-[#E7DDD5]
                            bg-[#26343B]
                        "
                    >

                        <div
                            className="
                                flex
                                min-h-[360px]
                                items-center
                                justify-center
                                bg-[#26343B]
                            "
                        >

                            <img
                                src={
                                    report.image_url ||
                                    report.file_url
                                }
                                alt={
                                    report.report_name ||
                                    "Report"
                                }
                                className="
                                    max-h-[520px]
                                    w-full
                                    object-contain
                                "
                            />

                        </div>


                        {/* Image Controls */}

                        <div
                            className="
                                flex
                                h-11
                                items-center
                                justify-between
                                bg-[#26343B]
                                px-4
                                text-white
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-5
                                "
                            >

                                <button
                                    type="button"
                                    className="
                                        text-xl
                                        opacity-90
                                        hover:opacity-100
                                    "
                                >
                                    ⌕
                                </button>

                                <span
                                    className="
                                        text-[14px]
                                    "
                                >
                                    100%
                                </span>

                                <button
                                    type="button"
                                    className="
                                        text-xl
                                        opacity-90
                                        hover:opacity-100
                                    "
                                >
                                    ⊕
                                </button>

                            </div>


                            <button
                                type="button"
                                className="
                                    text-lg
                                    opacity-90
                                    hover:opacity-100
                                "
                            >
                                ⛶
                            </button>

                        </div>

                    </div>

                ) : (

                    <div
                        className="
                            mt-6
                            flex
                            h-[260px]
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-[#E8DDD5]
                            bg-[#FFFCF9]
                            text-[14px]
                            text-[#8B7A70]
                        "
                    >
                        No report preview available
                    </div>

                )}


                {/* =================================
                    FINDINGS
                ================================= */}

                {(
                    report?.findings ||
                    report?.findings_list?.length
                ) && (

                    <div className="mt-7">

                        <h3
                            className="
                                text-[15px]
                                font-semibold
                                text-[#59352C]
                            "
                        >
                            Findings
                        </h3>


                        {report?.findings_list?.length > 0 ? (

                            <ul
                                className="
                                    mt-2
                                    list-disc
                                    space-y-1
                                    pl-5
                                    text-[13px]
                                    leading-5
                                    text-[#49362E]
                                "
                            >

                                {report.findings_list.map(
                                    (finding, index) => (

                                        <li
                                            key={`${finding}-${index}`}
                                        >
                                            {finding}
                                        </li>

                                    )
                                )}

                            </ul>

                        ) : (

                            <div
                                className="
                                    mt-2
                                    whitespace-pre-line
                                    text-[13px]
                                    leading-6
                                    text-[#49362E]
                                "
                            >
                                {report.findings}
                            </div>

                        )}

                    </div>

                )}


                {/* =================================
                    KEY VALUES
                ================================= */}

                {report?.key_values && (

                    <div className="mt-6">

                        <h3
                            className="
                                text-[15px]
                                font-semibold
                                text-[#59352C]
                            "
                        >
                            Key Values
                        </h3>


                        <div
                            className="
                                mt-3
                                grid
                                grid-cols-1
                                gap-3
                                sm:grid-cols-2
                            "
                        >

                            {Object.entries(
                                report.key_values
                            ).map(
                                ([key, value]) => (

                                    <div
                                        key={key}
                                        className="
                                            rounded-xl
                                            border
                                            border-[#EDE2DA]
                                            bg-[#FFFCF9]
                                            p-3
                                        "
                                    >

                                        <p
                                            className="
                                                text-[11px]
                                                text-[#8B7A70]
                                            "
                                        >
                                            {key}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-[14px]
                                                font-medium
                                                text-[#49362E]
                                            "
                                        >
                                            {String(value)}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* =================================
                    REVIEW BUTTON
                ================================= */}

                {report?.status?.toLowerCase() ===
                    "pending" && (

                    <div className="mt-6 pb-5">

                        <button
                            type="button"
                            disabled={
                                reviewLoading
                            }
                            onClick={
                                handleMarkReviewed
                            }
                            className="
                                rounded-xl
                                bg-[#FFF1E4]
                                px-5
                                py-3
                                text-[13px]
                                font-semibold
                                text-[#59352C]
                                transition
                                hover:bg-[#FFE6D2]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {reviewLoading
                                ? "Marking..."
                                : "Mark as Reviewed"}
                        </button>

                    </div>

                )}

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

                <button
                    type="button"
                    onClick={onBack}
                    className="
                        flex
                        h-[58px]
                        w-full
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

            </div>

        </div>
    );
};


export default ViewXRayReport;