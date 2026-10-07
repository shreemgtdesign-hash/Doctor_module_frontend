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
    loadInsuranceList,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";


const InsuranceList = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        insuranceList = [],
        insuranceLoading = false,
        insuranceError = null,
        insuranceTotal = 0,
    } = useSelector(
        (state) =>
            state.frontOfficeAppointment
    );


    const [insuranceType, setInsuranceType] =
        useState("all");

    const [page, setPage] =
        useState(1);


    const limit = 12;


    // ==========================================
    // LOAD INSURANCE
    // ==========================================

    useEffect(() => {

        dispatch(
            loadInsuranceList(
                insuranceType === "all"
                    ? ""
                    : insuranceType
            )
        );

    }, [
        dispatch,
        insuranceType,
        page,
    ]);


    // ==========================================
    // INSURANCE TYPE
    // ==========================================

    const handleTypeChange = (
        type
    ) => {

        setInsuranceType(type);

        setPage(1);

    };


    // ==========================================
    // PAGINATION
    // ==========================================

    const totalPages =
        Math.ceil(
            insuranceTotal / limit
        ) || 1;


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

    const formatDate = (
        date
    ) => {

        if (!date) return "N/A";

        return new Date(
            date
        ).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

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
                                Insurance
                            </h2>


                            <p
                                className="
                                    mt-2
                                    text-[14px]
                                    leading-6
                                    text-[#6f5a52]
                                    sm:text-[15px]
                                "
                            >
                                View and manage
                                in-house and external
                                insurance policies.
                            </p>

                        </div>

                    </div>


                    {/* ======================================
                        PAGINATION
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
                            Showing Patients{" "}

                            {insuranceTotal === 0
                                ? 0
                                : (page - 1) *
                                  limit +
                                  1}

                            {" "} - {" "}

                            {Math.min(
                                page * limit,
                                insuranceTotal
                            )}

                            {" "}of{" "}

                            {insuranceTotal}

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
                    TABS
                ====================================== */}

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        gap-6
                        overflow-x-auto
                        border-b
                        border-[#eadfd9]
                        sm:gap-10
                    "
                >

                    {/* ALL */}

                    <button
                        type="button"
                        onClick={() =>
                            handleTypeChange(
                                "all"
                            )
                        }
                        className={`
                            whitespace-nowrap
                            pb-3
                            text-[15px]
                            font-medium
                            transition
                            sm:text-[16px]
                            ${
                                insuranceType ===
                                "all"
                                    ? "border-b-2 border-[#6f3f2b] text-[#4b2b21]"
                                    : "text-[#b8aaa5]"
                            }
                        `}
                    >
                        All Policies
                    </button>


                    {/* IN-HOUSE */}

                    <button
                        type="button"
                        onClick={() =>
                            handleTypeChange(
                                "in-house"
                            )
                        }
                        className={`
                            whitespace-nowrap
                            pb-3
                            text-[15px]
                            font-medium
                            transition
                            sm:text-[16px]
                            ${
                                insuranceType ===
                                "in-house"
                                    ? "border-b-2 border-[#6f3f2b] text-[#4b2b21]"
                                    : "text-[#b8aaa5]"
                            }
                        `}
                    >
                        In-house Policies
                    </button>


                    {/* EXTERNAL */}

                    <button
                        type="button"
                        onClick={() =>
                            handleTypeChange(
                                "external"
                            )
                        }
                        className={`
                            whitespace-nowrap
                            pb-3
                            text-[15px]
                            font-medium
                            transition
                            sm:text-[16px]
                            ${
                                insuranceType ===
                                "external"
                                    ? "border-b-2 border-[#6f3f2b] text-[#4b2b21]"
                                    : "text-[#b8aaa5]"
                            }
                        `}
                    >
                        External Policies
                    </button>

                </div>


                {/* ======================================
                    TABLE
                ====================================== */}

                <div
                    className="
                        w-full
                        overflow-x-auto
                        overflow-hidden
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

                            <col className="w-[18%]" />

                            <col className="w-[13%]" />

                            <col className="w-[15%]" />

                            <col className="w-[13%]" />

                            <col className="w-[11%]" />

                            <col className="w-[8%]" />

                        </colgroup>


                        {/* ======================================
                            TABLE HEADER
                        ====================================== */}

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
                                    Insurance Provider
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
                                    Insurance Type
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
                                    Policy number
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
                                    Valid till
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
                                    Status
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


                        {/* ======================================
                            TABLE BODY
                        ====================================== */}

                        <tbody>

                            {/* LOADING */}

                            {insuranceLoading ? (

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
                                        Loading insurance
                                        records...
                                    </td>

                                </tr>

                            ) : insuranceError ? (

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
                                        {typeof insuranceError ===
                                        "string"
                                            ? insuranceError
                                            : "Failed to load insurance records"}
                                    </td>

                                </tr>

                            ) : insuranceList.length ===
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
                                        No insurance
                                        records found
                                    </td>

                                </tr>

                            ) : (

                                /* DATA */

                                insuranceList.map(
                                    (insurance) => (

                                        <tr
                                            key={
                                                insurance.id
                                            }
                                            className="
                                                align-middle
                                                border-t
                                                border-[#eadfd9]
                                                hover:bg-[#fffaf7]
                                            "
                                        >

                                            {/* PATIENT */}

                                            <td
                                                className="
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
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
                                                        insurance.patient_name ||
                                                        "N/A"
                                                    }
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-[12px]
                                                        text-[#77706d]
                                                    "
                                                >
                                                    Patient ID:{" "}
                                                    {
                                                        insurance.patient_id ||
                                                        "N/A"
                                                    }
                                                </p>

                                            </td>


                                            {/* PROVIDER */}

                                            <td
                                                className="
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
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
                                                        insurance.insurance_provider ||
                                                        "N/A"
                                                    }
                                                </p>

                                            </td>


                                            {/* TYPE */}

                                            <td
                                                className="
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-[14px]
                                                        font-semibold
                                                        text-[#4b2b21]
                                                    "
                                                >
                                                    {
                                                        insurance.insurance_type ||
                                                        "N/A"
                                                    }
                                                </span>

                                            </td>


                                            {/* POLICY */}

                                            <td
                                                className="
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        break-words
                                                        text-[14px]
                                                        font-semibold
                                                        text-[#4b2b21]
                                                    "
                                                >
                                                    {
                                                        insurance.policy_number ||
                                                        "N/A"
                                                    }
                                                </span>

                                            </td>


                                            {/* VALID TILL */}

                                            <td
                                                className="
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
                                                        text-[14px]
                                                        font-semibold
                                                        text-[#4b2b21]
                                                    "
                                                >
                                                    {formatDate(
                                                        insurance.valid_till
                                                    )}
                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td
                                                className="
                                                    border-r
                                                    border-[#eadfd9]
                                                    px-5
                                                    py-4
                                                    text-center
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
                                                        ${
                                                            insurance.status?.toLowerCase() ===
                                                            "active"
                                                                ? "bg-[#e9f9ed] text-[#27663a]"
                                                                : "bg-[#fff2e5] text-[#7b4b2c]"
                                                        }
                                                    `}
                                                >
                                                    {
                                                        insurance.status ||
                                                        "N/A"
                                                    }
                                                </span>

                                            </td>


                                            {/* ACTION */}

                                            <td
                                                className="
                                                    px-5
                                                    py-4
                                                    text-center
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    aria-label="Actions"
                                                    className="
                                                        inline-flex
                                                        h-8
                                                        w-8
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


export default InsuranceList;

