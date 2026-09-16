import {
    useEffect,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {

    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from "react-icons/hi2";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";
import { loadPendingPayments } from "../../../redux/frontOffice/frontOfficeBillingThunk";



const PendingPayments = () => {

    const dispatch = useDispatch();

    const navigate =
        useNavigate();


    const {
        pendingPayments = [],

        pendingPaymentsPagination,
        totalPendingPayments,
    } =
        useSelector(
            (state) =>
                state.frontOfficeBilling
        );


    const currentPage =
        pendingPaymentsPagination?.current_page ||
        1;

    const totalPages =
        pendingPaymentsPagination?.total_pages ||
        1;


    useEffect(() => {

        dispatch(
            loadPendingPayments({
                page: currentPage,
                limit: 8,
            })
        );

    }, [dispatch, currentPage]);


    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        dispatch(
            loadPendingPayments({
                page,
                limit: 8,
            })
        );

    };


    return (

        <DashboardLayout
            role="frontoffice"
        >

            <div
                className="
                    min-h-full
                    bg-white
                    px-6
                    py-5
                "
            >

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div
                    className="
                        mb-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <h1
                            className="
                                text-[20px]
                                font-semibold
                                text-[#2F2F2F]
                            "
                        >
                            Billing Details
                        </h1>

                        <span
                            className="
                                text-[20px]
                                text-[#4B2E2A]
                            "
                        >
                            ›
                        </span>

                        <h1
                            className="
                                text-[20px]
                                font-semibold
                                text-[#2F2F2F]
                            "
                        >
                            Pending payments
                        </h1>

                    </div>


                    <p
                        className="
                            mt-2
                            text-[13px]
                            text-[#756D69]
                        "
                    >
                        {totalPendingPayments}
                        {" "}
                        Total Pending payments
                    </p>

                </div>


                {/* ================================= */}
                {/* PAGINATION TOP */}
                {/* ================================= */}

                <div
                    className="
                        mb-3
                        flex
                        items-center
                        justify-end
                        gap-5
                    "
                >

                    <span
                        className="
                            text-[12px]
                            text-[#666]
                        "
                    >
                        Showing Appointments{" "}
                        {
                            pendingPaymentsPagination
                                ?.start_index || 0
                        }
                        {" - "}
                        {
                            pendingPaymentsPagination
                                ?.end_index || 0
                        }
                        {" of "}
                        {totalPendingPayments}
                    </span>


                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            disabled={
                                currentPage === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage - 1
                                )
                            }
                            className="
                                text-[#C7B7AF]
                                disabled:opacity-40
                            "
                        >

                            <HiOutlineChevronLeft
                                size={18}
                            />

                        </button>


                        <button
                            type="button"
                            disabled={
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage + 1
                                )
                            }
                            className="
                                text-[#4B2E2A]
                                disabled:opacity-40
                            "
                        >

                            <HiOutlineChevronRight
                                size={18}
                            />

                        </button>

                    </div>

                </div>


                {/* ================================= */}
                {/* TABLE */}
                {/* ================================= */}

                {/* ================================= */}
                {/* TABLE */}
                {/* ================================= */}

                <div
                    className="
        overflow-hidden
        rounded-[16px]
        border
        border-[#EFE4DC]
    "
                >

                    <table
                        className="
            w-full
            border-collapse
        "
                    >

                        <thead>

                            <tr
                                className="
                    bg-[#FFF9F4]
                "
                            >

                                <th
                                    className="
                        border-r
                        border-[#EFE4DC]
                        px-3
                        py-2.5
                        text-left
                        text-[11px]
                        font-medium
                        text-[#4B2E2A]
                    "
                                >
                                    Patient Details
                                </th>


                                <th
                                    className="
                        border-r
                        border-[#EFE4DC]
                        px-3
                        py-2.5
                        text-left
                        text-[11px]
                        font-medium
                        text-[#4B2E2A]
                    "
                                >
                                    Doctor
                                </th>


                                <th
                                    className="
                        border-r
                        border-[#EFE4DC]
                        px-3
                        py-2.5
                        text-left
                        text-[11px]
                        font-medium
                        text-[#4B2E2A]
                    "
                                >
                                    Date and Time
                                </th>


                                <th
                                    className="
                        border-r
                        border-[#EFE4DC]
                        px-3
                        py-2.5
                        text-center
                        text-[11px]
                        font-medium
                        text-[#4B2E2A]
                    "
                                >
                                    Consultation
                                    <br />
                                    (₹)
                                </th>


                                <th
                                    className="
                        border-r
                        border-[#EFE4DC]
                        px-3
                        py-2.5
                        text-center
                        text-[11px]
                        font-medium
                        text-[#4B2E2A]
                    "
                                >
                                    Therapy
                                    <br />
                                    (₹)
                                </th>


                                <th
                                    className="
                        border-r
                        border-[#EFE4DC]
                        px-3
                        py-2.5
                        text-center
                        text-[11px]
                        font-medium
                        text-[#4B2E2A]
                    "
                                >
                                    Medicines
                                    <br />
                                    (₹)
                                </th>


                                <th
                                    className="
                        border-r
                        border-[#EFE4DC]
                        px-3
                        py-2.5
                        text-center
                        text-[11px]
                        font-medium
                        text-[#4B2E2A]
                    "
                                >
                                    Total
                                    <br />
                                    Amount(₹)
                                </th>


                                <th
                                    className="
                        px-3
                        py-2.5
                        text-center
                        text-[11px]
                        font-medium
                        text-[#4B2E2A]
                    "
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {pendingPayments.map(
                                (item) => (

                                    <tr
                                        key={item.id}
                                        className="
                            border-t
                            border-[#EFE4DC]
                        "
                                    >

                                        {/* PATIENT */}

                                        <td
                                            className="
                                border-r
                                border-[#EFE4DC]
                                px-3
                                py-3
                                align-top
                            "
                                        >

                                            <p
                                                className="
                                    text-[12px]
                                    font-semibold
                                    text-[#4B2E2A]
                                "
                                            >
                                                {
                                                    item
                                                        ?.patient_details
                                                        ?.name ||
                                                    "—"
                                                }
                                            </p>

                                            <p
                                                className="
                                    mt-1
                                    text-[10px]
                                    text-[#777]
                                "
                                            >
                                                Patient ID:{" "}
                                                {
                                                    item
                                                        ?.patient_details
                                                        ?.patient_id ||
                                                    "—"
                                                }
                                            </p>

                                        </td>


                                        {/* DOCTOR */}

                                        <td
                                            className="
                                border-r
                                border-[#EFE4DC]
                                px-3
                                py-3
                                align-top
                            "
                                        >

                                            <p
                                                className="
                                    text-[12px]
                                    font-semibold
                                    text-[#4B2E2A]
                                "
                                            >
                                                {
                                                    item
                                                        ?.doctor
                                                        ?.name ||
                                                    "—"
                                                }
                                            </p>

                                            <p
                                                className="
                                    mt-1
                                    text-[10px]
                                    text-[#777]
                                "
                                            >
                                                {
                                                    item
                                                        ?.doctor
                                                        ?.sub_doctors ||
                                                    "-"
                                                }
                                            </p>

                                        </td>


                                        {/* DATE */}

                                        <td
                                            className="
                                border-r
                                border-[#EFE4DC]
                                px-3
                                py-3
                                align-top
                            "
                                        >

                                            <p
                                                className="
                                    text-[12px]
                                    font-semibold
                                    text-[#4B2E2A]
                                "
                                            >
                                                {
                                                    item
                                                        ?.date_and_time
                                                        ?.date ||
                                                    "—"
                                                }
                                            </p>

                                            <p
                                                className="
                                    mt-1
                                    text-[10px]
                                    text-[#777]
                                "
                                            >
                                                {
                                                    item
                                                        ?.date_and_time
                                                        ?.time ||
                                                    "—"
                                                }
                                            </p>

                                        </td>


                                        {/* CONSULTATION */}

                                        <td
                                            className="
                                border-r
                                border-[#EFE4DC]
                                px-3
                                py-3
                                text-center
                                text-[12px]
                                font-medium
                                text-[#4B2E2A]
                            "
                                        >
                                            {
                                                item?.formatted_consultation ||
                                                "-"
                                            }
                                        </td>


                                        {/* THERAPY */}

                                        <td
                                            className="
                                border-r
                                border-[#EFE4DC]
                                px-3
                                py-3
                                text-center
                                text-[12px]
                                font-medium
                                text-[#4B2E2A]
                            "
                                        >
                                            {
                                                item?.formatted_therapy ||
                                                "-"
                                            }
                                        </td>


                                        {/* MEDICINES */}

                                        <td
                                            className="
                                border-r
                                border-[#EFE4DC]
                                px-3
                                py-3
                                text-center
                                text-[12px]
                                font-medium
                                text-[#4B2E2A]
                            "
                                        >
                                            {
                                                item?.formatted_medicines ||
                                                "-"
                                            }
                                        </td>


                                        {/* TOTAL */}

                                        <td
                                            className="
                                border-r
                                border-[#EFE4DC]
                                px-3
                                py-3
                                text-center
                                text-[12px]
                                font-semibold
                                text-[#4B2E2A]
                            "
                                        >
                                            {
                                                item?.formatted_total ||
                                                "-"
                                            }
                                        </td>


                                        {/* ACTION */}

                                        <td
                                            className="
                                px-3
                                py-3
                                text-center
                            "
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/frontoffice/billing/pending-payments/${item.appointment_id}`
                                                    )
                                                }
                                                className="
                                    rounded-full
                                    border
                                    border-[#E7DBD3]
                                    px-4
                                    py-1.5
                                    text-[11px]
                                    font-medium
                                    text-[#4B2E2A]
                                    hover:bg-[#FFF9F4]
                                "
                                            >
                                                View Details
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </DashboardLayout>

    );
};


export default PendingPayments;