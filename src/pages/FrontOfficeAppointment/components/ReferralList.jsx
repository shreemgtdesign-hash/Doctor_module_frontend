import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    HiOutlineArrowLeft,
} from "react-icons/hi";

import {
    loadReferralList,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";


const ReferralList = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        referralList = [],
        referralLoading = false,
        referralError = null,
    } = useSelector(
        (state) =>
            state.frontOfficeAppointment || {}
    );


    const [page, setPage] = useState(1);

    const limit = 12;


    // ==========================================
    // LOAD REFERRALS
    // ==========================================

    useEffect(() => {

        dispatch(
            loadReferralList()
        );

    }, [dispatch]);


    // ==========================================
    // PAGINATION
    // ==========================================

    const totalRecords =
        referralList.length;

    const totalPages =
        Math.ceil(
            totalRecords / limit
        ) || 1;

    const startIndex =
        (page - 1) * limit;

    const paginatedReferrals =
        referralList.slice(
            startIndex,
            startIndex + limit
        );


    const startRecord =
        totalRecords === 0
            ? 0
            : startIndex + 1;


    const endRecord =
        Math.min(
            startIndex + limit,
            totalRecords
        );


    const handlePrevious = () => {

        if (page > 1) {

            setPage(
                (prev) => prev - 1
            );

        }

    };


    const handleNext = () => {

        if (page < totalPages) {

            setPage(
                (prev) => prev + 1
            );

        }

    };


    // ==========================================
    // DATE FORMAT
    // ==========================================

    const formatDate = (date) => {

        if (!date) return "—";

        return new Date(
            date
        ).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );

    };


    // ==========================================
    // STATUS
    // ==========================================

    const getStatusStyle = (
        status
    ) => {

        const value =
            status?.toLowerCase();


        if (
            value === "issued" ||
            value === "active" ||
            value === "completed" ||
            value === "confirmed"
        ) {

            return "bg-[#e9f9ed] text-[#27663a]";

        }


        if (
            value === "pending" ||
            value === "waiting" ||
            value === "booked"
        ) {

            return "bg-[#fff3e5] text-[#795238]";

        }


        return "bg-[#f3f0ee] text-[#665650]";

    };


    return (

        <DashboardLayout
            role="frontoffice"
        >

            <div
                className="
                    w-full
                    px-4
                    py-5
                    sm:px-6
                    sm:py-6
                    lg:px-8
                    lg:py-7
                "
            >

                {/* ======================================
                    HEADER
                ====================================== */}

                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-5
                        xl:flex-row
                        xl:items-start
                        xl:justify-between
                    "
                >

                    {/* LEFT SIDE */}

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        {/* BACK BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/frontoffice/dashboard")
                            }
                            aria-label="Go back"
                            className="
                                mt-0.5
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-[#E7DBD3]
                                bg-white
                                text-[#4B2E2A]
                                transition
                                hover:bg-[#F9F5F1]
                            "
                        >

                            <HiOutlineArrowLeft
                                size={17}
                            />

                        </button>


                        {/* TITLE */}

                        <div>

                            <h2
                                className="
                                    text-[22px]
                                    font-semibold
                                    leading-tight
                                    text-[#3f261d]
                                    sm:text-[24px]
                                "
                            >
                                Referral Codes
                            </h2>


                            <p
                                className="
                                    mt-2
                                    text-[14px]
                                    leading-6
                                    text-[#6f4f43]
                                    sm:text-[15px]
                                "
                            >
                                View and manage all
                                referral codes applied
                            </p>

                        </div>

                    </div>


                    {/* ======================================
                        PAGINATION TOP RIGHT
                    ====================================== */}

                    <div
                        className="
                            flex
                            items-center
                            justify-end
                            gap-4
                            xl:mt-1
                        "
                    >

                        <span
                            className="
                                whitespace-nowrap
                                text-[13px]
                                text-[#6f6f6f]
                                sm:text-[14px]
                            "
                        >
                            Showing Referrals{" "}
                            {startRecord} - {endRecord}{" "}
                            of {totalRecords}
                        </span>


                        {/* PREVIOUS */}

                        <button
                            type="button"
                            onClick={
                                handlePrevious
                            }
                            disabled={
                                page === 1
                            }
                            aria-label="Previous page"
                            className={`
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                text-[26px]
                                leading-none
                                transition
                                ${
                                    page === 1
                                        ? "cursor-not-allowed text-[#d5c9c4]"
                                        : "cursor-pointer text-[#8b4f32] hover:bg-[#f5ebe6]"
                                }
                            `}
                        >
                            ‹
                        </button>


                        {/* NEXT */}

                        <button
                            type="button"
                            onClick={
                                handleNext
                            }
                            disabled={
                                page >= totalPages
                            }
                            aria-label="Next page"
                            className={`
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                text-[26px]
                                leading-none
                                transition
                                ${
                                    page >= totalPages
                                        ? "cursor-not-allowed text-[#d5c9c4]"
                                        : "cursor-pointer text-[#8b4f32] hover:bg-[#f5ebe6]"
                                }
                            `}
                        >
                            ›
                        </button>

                    </div>

                </div>


                {/* ======================================
                    TABLE
                ====================================== */}

                <div
                    className="
                        w-full
                        overflow-hidden
                        overflow-x-auto
                        rounded-[16px]
                        border
                        border-[#eadfd9]
                        bg-white
                    "
                >

                    <table
                        className="
                            w-full
                            min-w-[1100px]
                            table-fixed
                            border-collapse
                        "
                    >

                        <colgroup>

                            <col className="w-[22%]" />

                            <col className="w-[20%]" />

                            <col className="w-[14%]" />

                            <col className="w-[14%]" />

                            <col className="w-[14%]" />

                            <col className="w-[11%]" />

                            <col className="w-[5%]" />

                        </colgroup>


                        {/* ==================================
                            TABLE HEADER
                        ================================== */}

                        <thead>

                            <tr
                                className="
                                    bg-[#fff9f5]
                                "
                            >

                                <th
                                    className="
                                        whitespace-nowrap
                                        border-r
                                        border-[#eadfd9]
                                        px-5
                                        py-4
                                        text-left
                                        text-[13px]
                                        font-medium
                                        text-[#57372c]
                                    "
                                >
                                    Patient Name
                                </th>


                                <th
                                    className="
                                        whitespace-nowrap
                                        border-r
                                        border-[#eadfd9]
                                        px-5
                                        py-4
                                        text-left
                                        text-[13px]
                                        font-medium
                                        text-[#57372c]
                                    "
                                >
                                    Referred By
                                </th>


                                <th
                                    className="
                                        whitespace-nowrap
                                        border-r
                                        border-[#eadfd9]
                                        px-5
                                        py-4
                                        text-center
                                        text-[13px]
                                        font-medium
                                        text-[#57372c]
                                    "
                                >
                                    Referral Code
                                </th>


                                <th
                                    className="
                                        whitespace-nowrap
                                        border-r
                                        border-[#eadfd9]
                                        px-5
                                        py-4
                                        text-center
                                        text-[13px]
                                        font-medium
                                        text-[#57372c]
                                    "
                                >
                                    Referral Date
                                </th>


                                <th
                                    className="
                                        whitespace-nowrap
                                        border-r
                                        border-[#eadfd9]
                                        px-5
                                        py-4
                                        text-center
                                        text-[13px]
                                        font-medium
                                        text-[#57372c]
                                    "
                                >
                                    Appointment Date
                                </th>


                                <th
                                    className="
                                        whitespace-nowrap
                                        border-r
                                        border-[#eadfd9]
                                        px-5
                                        py-4
                                        text-center
                                        text-[13px]
                                        font-medium
                                        text-[#57372c]
                                    "
                                >
                                    Benefit Status
                                </th>


                                <th
                                    className="
                                        whitespace-nowrap
                                        px-5
                                        py-4
                                        text-center
                                        text-[13px]
                                        font-medium
                                        text-[#57372c]
                                    "
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        {/* ==================================
                            TABLE BODY
                        ================================== */}

                        <tbody>

                            {/* LOADING */}

                            {referralLoading ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            py-12
                                            text-center
                                            text-[14px]
                                            text-[#75655f]
                                        "
                                    >
                                        Loading referral
                                        records...
                                    </td>

                                </tr>

                            ) : referralError ? (

                                /* ERROR */

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            py-12
                                            text-center
                                            text-[14px]
                                            text-red-600
                                        "
                                    >
                                        {typeof referralError ===
                                        "string"
                                            ? referralError
                                            : "Failed to load referral records"}
                                    </td>

                                </tr>

                            ) : paginatedReferrals.length ===
                              0 ? (

                                /* EMPTY */

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            py-12
                                            text-center
                                            text-[14px]
                                            text-[#75655f]
                                        "
                                    >
                                        No referral
                                        records found
                                    </td>

                                </tr>

                            ) : (

                                /* DATA */

                                paginatedReferrals.map(
                                    (item) => (

                                        <tr
                                            key={item.id}
                                            className="
                                                border-t
                                                border-[#eadfd9]
                                                hover:bg-[#fffaf7]
                                            "
                                        >

                                            {/* ==============================
                                                PATIENT NAME
                                            ============================== */}

                                            <td
                                                className="
                                                    align-middle
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            truncate
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#4b2b21]
                                                        "
                                                    >
                                                        {
                                                            item.patient_name ||
                                                            "—"
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[12px]
                                                            text-[#77706d]
                                                        "
                                                    >
                                                        Patient ID:{" "}
                                                        {
                                                            item.patient_id ||
                                                            "—"
                                                        }
                                                    </p>

                                                </div>

                                            </td>


                                            {/* ==============================
                                                REFERRED BY
                                            ============================== */}

                                            <td
                                                className="
                                                    align-middle
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            truncate
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#4b2b21]
                                                        "
                                                    >
                                                        {
                                                            item.referred_by ||
                                                            item.referred_by_name ||
                                                            item.referred_by_id ||
                                                            "—"
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[12px]
                                                            text-[#77706d]
                                                        "
                                                    >
                                                        Patient ID:{" "}
                                                        {
                                                            item.referred_by_id ||
                                                            "—"
                                                        }
                                                    </p>

                                                </div>

                                            </td>


                                            {/* ==============================
                                                REFERRAL CODE
                                            ============================== */}

                                            <td
                                                className="
                                                    align-middle
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        whitespace-nowrap
                                                        text-[14px]
                                                        font-semibold
                                                        text-[#4b2b21]
                                                    "
                                                >
                                                    {
                                                        item.referral_code ||
                                                        "—"
                                                    }
                                                </span>

                                            </td>


                                            {/* ==============================
                                                REFERRAL DATE
                                            ============================== */}

                                            <td
                                                className="
                                                    align-middle
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <span
                                                    className="
                                                        whitespace-nowrap
                                                        text-[13px]
                                                        font-semibold
                                                        text-[#4b2b21]
                                                    "
                                                >
                                                    {formatDate(
                                                        item.referral_date
                                                    )}
                                                </span>

                                            </td>


                                            {/* ==============================
                                                APPOINTMENT DATE
                                            ============================== */}

                                            <td
                                                className="
                                                    align-middle
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <span
                                                    className="
                                                        whitespace-nowrap
                                                        text-[13px]
                                                        font-semibold
                                                        text-[#4b2b21]
                                                    "
                                                >
                                                    {formatDate(
                                                        item.appointment_date
                                                    )}
                                                </span>

                                            </td>


                                            {/* ==============================
                                                BENEFIT STATUS
                                            ============================== */}

                                            <td
                                                className="
                                                    align-middle
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        items-center
                                                        justify-center
                                                        gap-1
                                                    "
                                                >

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            justify-center
                                                            whitespace-nowrap
                                                            rounded-[8px]
                                                            px-3
                                                            py-1
                                                            text-[12px]
                                                            font-medium
                                                            ${getStatusStyle(
                                                                item.benefit_status_display
                                                            )}
                                                        `}
                                                    >
                                                        {
                                                            item.benefit_status_display ||
                                                            item.benefit_status ||
                                                            "—"
                                                        }
                                                    </span>


                                                    {item.benefit_amount !==
                                                        undefined &&
                                                        item.benefit_amount !==
                                                            null && (

                                                            <span
                                                                className="
                                                                    whitespace-nowrap
                                                                    text-[12px]
                                                                    text-[#77706d]
                                                                "
                                                            >
                                                                ₹
                                                                {Number(
                                                                    item.benefit_amount
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </span>

                                                        )}

                                                </div>

                                            </td>


                                            {/* ==============================
                                                ACTION
                                            ============================== */}

                                            <td
                                                className="
                                                    align-middle
                                                    px-5
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    className="
                                                        inline-flex
                                                        h-8
                                                        w-8
                                                        cursor-pointer
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        text-[22px]
                                                        leading-none
                                                        text-[#4b2b21]
                                                        transition
                                                        hover:bg-[#f5ebe6]
                                                    "
                                                >
                                                    ⋮
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </DashboardLayout>

    );

};


export default ReferralList;