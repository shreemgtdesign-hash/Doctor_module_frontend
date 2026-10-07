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
    loadPackages,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";


const Packages = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        packages = [],
        packagesLoading = false,
        packagesError = null,
        packagesCount = 0,
    } = useSelector(
        (state) =>
            state.frontOfficeAppointment || {}
    );


    const [activeTab, setActiveTab] =
        useState("all");

    const [page, setPage] =
        useState(1);


    const limit = 10;


    // ==========================================
    // LOAD PACKAGES
    // ==========================================

    useEffect(() => {

        dispatch(
            loadPackages({
                page,
                limit,
            })
        );

    }, [
        dispatch,
        page,
    ]);


    // ==========================================
    // FILTER PACKAGES
    // ==========================================

    const filteredPackages =
        packages.filter((item) => {

            if (activeTab === "all") {
                return true;
            }

            return (
                item.category?.toLowerCase() ===
                activeTab.toLowerCase()
            );

        });


    // ==========================================
    // PAGINATION
    // ==========================================

    const totalPages =
        Math.ceil(
            packagesCount / limit
        ) || 1;


    const start =
        packagesCount === 0
            ? 0
            : (page - 1) * limit + 1;


    const end =
        Math.min(
            page * limit,
            packagesCount
        );


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
                        mb-7
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

                            <h1
                                className="
                                    text-[22px]
                                    font-semibold
                                    leading-tight
                                    text-[#302522]
                                    sm:text-[24px]
                                "
                            >
                                Packages
                            </h1>


                            <p
                                className="
                                    mt-2
                                    text-[14px]
                                    leading-6
                                    text-[#67483d]
                                    sm:text-[15px]
                                "
                            >
                                View and manage all
                                healthcare packages.
                            </p>

                        </div>

                    </div>


                    {/* ADD PATIENT */}

                    <button
                        type="button"
                        className="
                            flex
                            w-fit
                            items-center
                            gap-2
                            rounded-[12px]
                            bg-[#8B5035]
                            px-6
                            py-2.5
                            text-[14px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#75432F]
                            xl:mt-0
                        "
                    >

                        <span
                            className="
                                text-[20px]
                                leading-none
                            "
                        >
                            +
                        </span>

                        Add Patient

                    </button>

                </div>


                {/* ======================================
                    TABS
                ====================================== */}

                <div
                    className="
                        flex
                        items-center
                        gap-6
                        overflow-x-auto
                        border-b
                        border-[#eadfd8]
                        sm:gap-10
                    "
                >

                    {/* ALL PACKAGES */}

                    <button
                        type="button"
                        onClick={() => {

                            setActiveTab(
                                "all"
                            );

                            setPage(1);

                        }}
                        className={`
                            whitespace-nowrap
                            pb-3
                            text-[15px]
                            transition
                            sm:pb-4
                            sm:text-[16px]
                            ${
                                activeTab ===
                                "all"
                                    ? "border-b-2 border-[#6d3d2b] font-semibold text-[#4b2d22]"
                                    : "text-[#b6a5a0]"
                            }
                        `}
                    >
                        All Packages
                    </button>


                    {/* HEALTHCARE */}

                    <button
                        type="button"
                        onClick={() => {

                            setActiveTab(
                                "healthcare"
                            );

                            setPage(1);

                        }}
                        className={`
                            whitespace-nowrap
                            pb-3
                            text-[15px]
                            transition
                            sm:pb-4
                            sm:text-[16px]
                            ${
                                activeTab ===
                                "healthcare"
                                    ? "border-b-2 border-[#6d3d2b] font-semibold text-[#4b2d22]"
                                    : "text-[#b6a5a0]"
                            }
                        `}
                    >
                        Healthcare
                    </button>


                    {/* WELLNESS */}

                    <button
                        type="button"
                        onClick={() => {

                            setActiveTab(
                                "wellness"
                            );

                            setPage(1);

                        }}
                        className={`
                            whitespace-nowrap
                            pb-3
                            text-[15px]
                            transition
                            sm:pb-4
                            sm:text-[16px]
                            ${
                                activeTab ===
                                "wellness"
                                    ? "border-b-2 border-[#6d3d2b] font-semibold text-[#4b2d22]"
                                    : "text-[#b6a5a0]"
                            }
                        `}
                    >
                        Wellness
                    </button>


                    {/* BEAUTY */}

                    <button
                        type="button"
                        onClick={() => {

                            setActiveTab(
                                "beauty"
                            );

                            setPage(1);

                        }}
                        className={`
                            whitespace-nowrap
                            pb-3
                            text-[15px]
                            transition
                            sm:pb-4
                            sm:text-[16px]
                            ${
                                activeTab ===
                                "beauty"
                                    ? "border-b-2 border-[#6d3d2b] font-semibold text-[#4b2d22]"
                                    : "text-[#b6a5a0]"
                            }
                        `}
                    >
                        Beauty
                    </button>

                </div>


                {/* ======================================
                    PAGINATION TOP
                ====================================== */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-end
                        gap-4
                        py-5
                        sm:gap-6
                        sm:py-6
                    "
                >

                    <span
                        className="
                            text-[13px]
                            text-[#666]
                            sm:text-[14px]
                        "
                    >
                        Showing Patients{" "}
                        {start} - {end} of{" "}
                        {packagesCount}
                    </span>


                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            sm:gap-5
                        "
                    >

                        {/* PREVIOUS */}

                        <button
                            type="button"
                            disabled={
                                page === 1
                            }
                            onClick={() =>
                                setPage(
                                    (prev) =>
                                        prev - 1
                                )
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
                                        ? "cursor-not-allowed text-[#cbbdb8]"
                                        : "text-[#6d3d2b] hover:bg-[#f5ebe6]"
                                }
                            `}
                        >
                            ‹
                        </button>


                        {/* PAGE */}

                        <span
                            className="
                                text-[14px]
                                font-medium
                                text-[#4b2d22]
                            "
                        >
                            {page}
                        </span>


                        {/* NEXT */}

                        <button
                            type="button"
                            disabled={
                                page >=
                                totalPages
                            }
                            onClick={() =>
                                setPage(
                                    (prev) =>
                                        prev + 1
                                )
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
                                    page >=
                                    totalPages
                                        ? "cursor-not-allowed text-[#cbbdb8]"
                                        : "text-[#6d3d2b] hover:bg-[#f5ebe6]"
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
                        overflow-x-auto
                        overflow-hidden
                        rounded-[16px]
                        border
                        border-[#eadfd8]
                        bg-white
                    "
                >

                    <table
                        className="
                            w-full
                            min-w-[1200px]
                            table-fixed
                            border-collapse
                        "
                    >

                        <thead>

                            <tr
                                className="
                                    bg-[#fffaf6]
                                "
                            >

                                <th
                                    className="
                                        w-[16%]
                                        border-b
                                        border-r
                                        border-[#eadfd8]
                                        px-5
                                        py-4
                                        text-left
                                        text-[13px]
                                        font-medium
                                        text-[#4b2d22]
                                    "
                                >
                                    Patient Name
                                </th>


                                <th
                                    className="
                                        w-[17%]
                                        border-b
                                        border-r
                                        border-[#eadfd8]
                                        px-5
                                        py-4
                                        text-left
                                        text-[13px]
                                        font-medium
                                        text-[#4b2d22]
                                    "
                                >
                                    Package Name
                                </th>


                                <th
                                    className="
                                        w-[11%]
                                        border-b
                                        border-r
                                        border-[#eadfd8]
                                        px-5
                                        py-4
                                        text-left
                                        text-[13px]
                                        font-medium
                                        text-[#4b2d22]
                                    "
                                >
                                    Category
                                </th>


                                <th
                                    className="
                                        w-[17%]
                                        border-b
                                        border-r
                                        border-[#eadfd8]
                                        px-5
                                        py-4
                                        text-left
                                        text-[13px]
                                        font-medium
                                        text-[#4b2d22]
                                    "
                                >
                                    Amount
                                </th>


                                <th
                                    className="
                                        w-[11%]
                                        border-b
                                        border-r
                                        border-[#eadfd8]
                                        px-5
                                        py-4
                                        text-left
                                        text-[13px]
                                        font-medium
                                        text-[#4b2d22]
                                    "
                                >
                                    Start Date
                                </th>


                                <th
                                    className="
                                        w-[11%]
                                        border-b
                                        border-r
                                        border-[#eadfd8]
                                        px-5
                                        py-4
                                        text-left
                                        text-[13px]
                                        font-medium
                                        text-[#4b2d22]
                                    "
                                >
                                    End Date
                                </th>


                                <th
                                    className="
                                        w-[10%]
                                        border-b
                                        border-r
                                        border-[#eadfd8]
                                        px-5
                                        py-4
                                        text-left
                                        text-[13px]
                                        font-medium
                                        text-[#4b2d22]
                                    "
                                >
                                    Status
                                </th>


                                <th
                                    className="
                                        w-[7%]
                                        border-b
                                        border-[#eadfd8]
                                        px-4
                                        py-4
                                        text-center
                                        text-[13px]
                                        font-medium
                                        text-[#4b2d22]
                                    "
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {/* LOADING */}

                            {packagesLoading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="
                                            py-12
                                            text-center
                                            text-[#777]
                                        "
                                    >
                                        Loading packages...
                                    </td>

                                </tr>

                            ) : packagesError ? (

                                /* ERROR */

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="
                                            py-12
                                            text-center
                                            text-red-500
                                        "
                                    >
                                        {typeof packagesError ===
                                        "string"
                                            ? packagesError
                                            : "Failed to load packages"}
                                    </td>

                                </tr>

                            ) : filteredPackages.length ===
                              0 ? (

                                /* EMPTY */

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="
                                            py-12
                                            text-center
                                            text-[#777]
                                        "
                                    >
                                        No packages found
                                    </td>

                                </tr>

                            ) : (

                                /* DATA */

                                filteredPackages.map(
                                    (item) => {

                                        const isSessionPackage =
                                            item.total_sessions;

                                        const usedSessions =
                                            item.used_sessions ||
                                            0;


                                        const sessionPercentage =
                                            item.total_sessions
                                                ? Math.min(
                                                      (usedSessions /
                                                          item.total_sessions) *
                                                          100,
                                                      100
                                                  )
                                                : 0;


                                        const amountPercentage =
                                            item.total_amount
                                                ? Math.min(
                                                      ((item.used_amount ||
                                                          0) /
                                                          item.total_amount) *
                                                          100,
                                                      100
                                                  )
                                                : 0;


                                        return (

                                            <tr
                                                key={
                                                    item.id ||
                                                    item.package_id
                                                }
                                                className="
                                                    border-b
                                                    border-[#f0e7e2]
                                                    last:border-b-0
                                                    hover:bg-[#fffaf7]
                                                "
                                            >

                                                {/* PATIENT */}

                                                <td
                                                    className="
                                                        align-middle
                                                        border-r
                                                        border-[#eadfd8]
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            mb-1
                                                            truncate
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#4b2d22]
                                                        "
                                                    >
                                                        {
                                                            item.patient_name ||
                                                            "N/A"
                                                        }
                                                    </div>


                                                    <div
                                                        className="
                                                            truncate
                                                            text-[12px]
                                                            text-[#777]
                                                        "
                                                    >
                                                        Patient ID:{" "}
                                                        {
                                                            item.patient_id ||
                                                            "N/A"
                                                        }
                                                    </div>

                                                </td>


                                                {/* PACKAGE */}

                                                <td
                                                    className="
                                                        align-middle
                                                        border-r
                                                        border-[#eadfd8]
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            mb-1
                                                            truncate
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#4b2d22]
                                                        "
                                                    >
                                                        {
                                                            item.package_name ||
                                                            "N/A"
                                                        }
                                                    </div>


                                                    <div
                                                        className="
                                                            break-words
                                                            text-[12px]
                                                            leading-5
                                                            text-[#777]
                                                        "
                                                    >
                                                        {
                                                            item.package_description ||
                                                            item.description ||
                                                            ""
                                                        }
                                                    </div>

                                                </td>


                                                {/* CATEGORY */}

                                                <td
                                                    className="
                                                        align-middle
                                                        border-r
                                                        border-[#eadfd8]
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#4b2d22]
                                                        "
                                                    >
                                                        {
                                                            item.category ||
                                                            "N/A"
                                                        }
                                                    </span>

                                                </td>


                                                {/* AMOUNT */}

                                                <td
                                                    className="
                                                        align-middle
                                                        border-r
                                                        border-[#eadfd8]
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    {isSessionPackage ? (

                                                        <div>

                                                            <div
                                                                className="
                                                                    text-[14px]
                                                                    font-semibold
                                                                    text-[#4b2d22]
                                                                "
                                                            >
                                                                {
                                                                    usedSessions
                                                                }
                                                                /
                                                                {
                                                                    item.total_sessions
                                                                }
                                                            </div>


                                                            <div
                                                                className="
                                                                    mt-2
                                                                    h-[4px]
                                                                    w-full
                                                                    max-w-[130px]
                                                                    overflow-hidden
                                                                    rounded-full
                                                                    bg-[#eeeeee]
                                                                "
                                                            >

                                                                <div
                                                                    className="
                                                                        h-full
                                                                        rounded-full
                                                                        bg-[#6b9e1c]
                                                                    "
                                                                    style={{
                                                                        width: `${sessionPercentage}%`,
                                                                    }}
                                                                />

                                                            </div>


                                                            <div
                                                                className="
                                                                    mt-1
                                                                    text-[12px]
                                                                    text-[#777]
                                                                "
                                                            >
                                                                {Math.max(
                                                                    0,
                                                                    item.total_sessions -
                                                                        usedSessions
                                                                )}{" "}
                                                                sessions
                                                                left
                                                            </div>

                                                        </div>

                                                    ) : (

                                                        <div>

                                                            <div
                                                                className="
                                                                    text-[14px]
                                                                    font-semibold
                                                                    text-[#4b2d22]
                                                                "
                                                            >
                                                                ₹
                                                                {
                                                                    item.used_amount ||
                                                                    0
                                                                }{" "}
                                                                used
                                                            </div>


                                                            <div
                                                                className="
                                                                    mt-2
                                                                    h-[4px]
                                                                    w-full
                                                                    max-w-[130px]
                                                                    overflow-hidden
                                                                    rounded-full
                                                                    bg-[#eeeeee]
                                                                "
                                                            >

                                                                <div
                                                                    className="
                                                                        h-full
                                                                        rounded-full
                                                                        bg-[#8b5035]
                                                                    "
                                                                    style={{
                                                                        width: `${amountPercentage}%`,
                                                                    }}
                                                                />

                                                            </div>


                                                            <div
                                                                className="
                                                                    mt-1
                                                                    text-[12px]
                                                                    text-[#777]
                                                                "
                                                            >
                                                                ₹
                                                                {
                                                                    item.remaining_amount ||
                                                                    0
                                                                }{" "}
                                                                remaining
                                                            </div>

                                                        </div>

                                                    )}

                                                </td>


                                                {/* START DATE */}

                                                <td
                                                    className="
                                                        align-middle
                                                        border-r
                                                        border-[#eadfd8]
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            whitespace-nowrap
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#4b2d22]
                                                        "
                                                    >
                                                        {
                                                            item.start_date ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                {/* END DATE */}

                                                <td
                                                    className="
                                                        align-middle
                                                        border-r
                                                        border-[#eadfd8]
                                                        px-5
                                                        py-5
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            whitespace-nowrap
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#4b2d22]
                                                        "
                                                    >
                                                        {
                                                            item.end_date ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td
                                                    className="
                                                        align-middle
                                                        border-r
                                                        border-[#eadfd8]
                                                        px-5
                                                        py-5
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
                                                            py-1.5
                                                            text-[12px]
                                                            font-medium
                                                            ${
                                                                item.status?.toLowerCase() ===
                                                                "active"
                                                                    ? "bg-[#eaf9ed] text-[#236033]"
                                                                    : item.status?.toLowerCase() ===
                                                                      "expired"
                                                                    ? "bg-[#fff2e5] text-[#70452e]"
                                                                    : "bg-[#fff4e5] text-[#70452e]"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            item.status ||
                                                            "N/A"
                                                        }
                                                    </span>

                                                </td>


                                                {/* ACTION */}

                                                <td
                                                    className="
                                                        align-middle
                                                        px-4
                                                        py-5
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
                                                            text-[#4b2d22]
                                                            transition
                                                            hover:bg-[#f5ebe6]
                                                        "
                                                    >
                                                        ⋮
                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </DashboardLayout>

    );

};


export default Packages;