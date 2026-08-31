import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";

import {
    CalendarDays,
    ChevronDown,
    ArrowLeft,
} from "lucide-react";
import { loadMedicinesDispensedTable } from "../../../../redux/pharmacist/pharmacistThunk";
import DashboardLayout from "../../../../components/Layout/DashboardLayout";



const MedicineDispensedTable = () => {

    const dispatch = useDispatch();

    const {
        data: medicines = [],
        count = 0,
        total_records = 0,
    } = useSelector(
        (state) =>
            state.pharmacist?.medicinesDispensedTable || {}
    );

    const loading =
        useSelector(
            (state) =>
                state.pharmacist?.loading || false
        );

    const error =
        useSelector(
            (state) =>
                state.pharmacist?.error
        );


    // ==========================================
    // PERIOD
    // ==========================================

    const [period, setPeriod] =
        useState("This Week");

    const [showPeriodMenu, setShowPeriodMenu] =
        useState(false);


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        dispatch(
            loadMedicinesDispensedTable()
        );

    }, [dispatch]);


    // ==========================================
    // PARSE API DATE
    // ==========================================

    const getMedicineDate = (item) => {

        const dateValue =
            item?.date_and_time?.date;

        if (!dateValue) {
            return null;
        }

        // Example:
        // "28th August, 2026"

        const cleaned =
            String(dateValue)
                .replace(
                    /(\d+)(st|nd|rd|th)/,
                    "$1"
                );

        const parsed =
            new Date(cleaned);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return null;
        }

        return parsed;
    };


    // ==========================================
    // PERIOD FILTER
    // ==========================================

    const filteredMedicines = useMemo(() => {

        if (!Array.isArray(medicines)) {
            return [];
        }

        const now = new Date();

        const todayStart =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

        if (period === "Today") {

            return medicines.filter(
                (item) => {

                    const medicineDate =
                        getMedicineDate(item);

                    if (!medicineDate) {
                        return false;
                    }

                    const medicineDay =
                        new Date(
                            medicineDate.getFullYear(),
                            medicineDate.getMonth(),
                            medicineDate.getDate()
                        );

                    return (
                        medicineDay.getTime() ===
                        todayStart.getTime()
                    );

                }
            );

        }


        if (period === "This Month") {

            return medicines.filter(
                (item) => {

                    const medicineDate =
                        getMedicineDate(item);

                    if (!medicineDate) {
                        return false;
                    }

                    return (
                        medicineDate.getFullYear() ===
                            now.getFullYear() &&
                        medicineDate.getMonth() ===
                            now.getMonth()
                    );

                }
            );

        }


        // ======================================
        // THIS WEEK
        // Monday -> Sunday
        // ======================================

        const currentDay =
            now.getDay();

        const daysFromMonday =
            currentDay === 0
                ? 6
                : currentDay - 1;

        const weekStart =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() -
                    daysFromMonday
            );

        weekStart.setHours(
            0,
            0,
            0,
            0
        );

        const weekEnd =
            new Date(
                weekStart
            );

        weekEnd.setDate(
            weekEnd.getDate() + 7
        );

        return medicines.filter(
            (item) => {

                const medicineDate =
                    getMedicineDate(item);

                if (!medicineDate) {
                    return false;
                }

                return (
                    medicineDate >=
                        weekStart &&
                    medicineDate <
                        weekEnd
                );

            }
        );

    }, [
        medicines,
        period,
    ]);


    // ==========================================
    // TOTAL QUANTITY
    // ==========================================

    const totalMedicines =
        useMemo(() => {

            return filteredMedicines.reduce(
                (total, item) => {

                    const quantity =
                        Number(
                            item?.qty ??
                            item?.quantity ??
                            0
                        );

                    return (
                        total +
                        (
                            Number.isNaN(
                                quantity
                            )
                                ? 0
                                : quantity
                        )
                    );

                },
                0
            );

        }, [
            filteredMedicines,
        ]);


    // ==========================================
    // TABLE ROW
    // ==========================================

    const renderTableRow = (
        medicine,
        index
    ) => {

        const patientName =
            medicine?.patient_name ||
            "—";

        const patientId =
            medicine?.patient_code ||
            medicine?.patient_id ||
            "—";

        const date =
            medicine?.date_and_time?.date ||
            "—";

        const time =
            medicine?.date_and_time?.time ||
            "—";

        const doctor =
            medicine?.doctor_name ||
            medicine?.doctor ||
            "—";

        const medicineName =
            medicine?.medicine_details ||
            "—";

        const batch =
            medicine?.batch_no ||
            "—";

        const quantity =
            medicine?.qty ??
            medicine?.quantity ??
            0;

        const expiry =
            medicine?.expiry_date ||
            "—";

        const mrp =
            Number(
                medicine?.mrp || 0
            ).toFixed(2);

        const discount =
            Number(
                medicine?.discount || 0
            ).toFixed(2);

        const courierCharges =
            Number(
                medicine?.courier_charges || 0
            ).toFixed(2);

        const totalAmount =
            Number(
                medicine?.total_amount || 0
            ).toFixed(2);

        const paymentMode =
            medicine?.payment_mode ||
            "—";


        return (
            <tr
                key={
                    medicine?.id ||
                    medicine?.order_id ||
                    index
                }
                className="
                    border-b
                    border-[#EEE4DD]
                    last:border-b-0
                "
            >

                {/* Patient Details */}

                <td
                    className="
                        px-3
                        py-4
                        align-middle
                    "
                >

                    <div
                        className="
                            min-w-[145px]
                        "
                    >

                        <p
                            className="
                                text-[14px]
                                font-semibold
                                text-[#59352C]
                            "
                        >
                            {patientName}
                        </p>

                        <p
                            className="
                                mt-1
                                text-[12px]
                                text-[#858585]
                            "
                        >
                            Patient ID: {patientId}
                        </p>

                    </div>

                </td>


                {/* Date and Time */}

                <td
                    className="
                        px-3
                        py-4
                        align-middle
                    "
                >

                    <div
                        className="
                            min-w-[120px]
                        "
                    >

                        <p
                            className="
                                text-[14px]
                                font-semibold
                                text-[#59352C]
                            "
                        >
                            {date}
                        </p>

                        <p
                            className="
                                mt-1
                                text-[12px]
                                text-[#858585]
                            "
                        >
                            {time}
                        </p>

                    </div>

                </td>


                {/* Doctor */}

                <td
                    className="
                        px-3
                        py-4
                        align-middle
                    "
                >

                    <p
                        className="
                            min-w-[130px]
                            text-[14px]
                            font-semibold
                            text-[#59352C]
                        "
                    >
                        {doctor}
                    </p>

                </td>


                {/* Medicine */}

                <td
                    className="
                        px-3
                        py-4
                        align-middle
                    "
                >

                    <p
                        className="
                            min-w-[150px]
                            text-[14px]
                            font-semibold
                            text-[#59352C]
                        "
                    >
                        {medicineName}
                    </p>

                </td>


                {/* Batch */}

                <td
                    className="
                        px-3
                        py-4
                        text-center
                        align-middle
                    "
                >

                    <span
                        className="
                            whitespace-nowrap
                            text-[14px]
                            font-semibold
                            text-[#59352C]
                        "
                    >
                        {batch}
                    </span>

                </td>


                {/* Qty */}

                <td
                    className="
                        px-3
                        py-4
                        text-center
                        align-middle
                    "
                >

                    <span
                        className="
                            text-[14px]
                            font-semibold
                            text-[#59352C]
                        "
                    >
                        {quantity}
                    </span>

                </td>


                {/* Expiry */}

                <td
                    className="
                        px-3
                        py-4
                        align-middle
                    "
                >

                    <span
                        className="
                            min-w-[120px]
                            whitespace-nowrap
                            text-[14px]
                            font-semibold
                            text-[#59352C]
                        "
                    >
                        {expiry}
                    </span>

                </td>


                {/* MRP */}

                <td
                    className="
                        px-3
                        py-4
                        text-right
                        align-middle
                    "
                >

                    <span
                        className="
                            whitespace-nowrap
                            text-[14px]
                            font-semibold
                            text-[#59352C]
                        "
                    >
                        {mrp}
                    </span>

                </td>


                {/* Discount */}

                <td
                    className="
                        px-3
                        py-4
                        text-right
                        align-middle
                    "
                >

                    <span
                        className="
                            whitespace-nowrap
                            text-[14px]
                            font-semibold
                            text-[#59352C]
                        "
                    >
                        {discount}
                    </span>

                </td>


                {/* Courier */}

                <td
                    className="
                        px-3
                        py-4
                        text-right
                        align-middle
                    "
                >

                    <span
                        className="
                            whitespace-nowrap
                            text-[14px]
                            font-semibold
                            text-[#59352C]
                        "
                    >
                        {courierCharges}
                    </span>

                </td>


                {/* Total */}

                <td
                    className="
                        px-3
                        py-4
                        text-right
                        align-middle
                    "
                >

                    <span
                        className="
                            whitespace-nowrap
                            text-[14px]
                            font-bold
                            text-[#59352C]
                        "
                    >
                        {totalAmount}
                    </span>

                </td>


                {/* Payment */}

                <td
                    className="
                        px-3
                        py-4
                        text-center
                        align-middle
                    "
                >

                    <span
                        className={`
                            inline-flex
                            min-w-[52px]
                            items-center
                            justify-center
                            rounded-full
                            px-3
                            py-1.5
                            text-[12px]
                            font-medium
                            ${
                                paymentMode
                                    .toLowerCase() === "cash"
                                    ? "bg-[#E9F8ED] text-[#34794A]"
                                    : paymentMode
                                        .toLowerCase() === "upi"
                                        ? "bg-[#FBEAF9] text-[#8A4282]"
                                        : "bg-[#F7F0E4] text-[#705536]"
                            }
                        `}
                    >
                        {paymentMode}

                    </span>

                </td>

            </tr>
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading && medicines.length === 0) {

        return (
            <div
                className="
                    min-h-screen
                    bg-white
                    px-6
                    py-6
                "
            >

                <div
                    className="
                        flex
                        min-h-[500px]
                        items-center
                        justify-center
                    "
                >

                    <p
                        className="
                            text-[16px]
                            font-medium
                            text-[#765A4F]
                        "
                    >
                        Loading medicines dispensed...
                    </p>

                </div>

            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (
        error &&
        medicines.length === 0
    ) {

        return (
            <div
                className="
                    min-h-screen
                    bg-white
                    px-6
                    py-6
                "
            >

                <div
                    className="
                        flex
                        min-h-[500px]
                        items-center
                        justify-center
                    "
                >

                    <p
                        className="
                            text-[15px]
                            font-medium
                            text-red-500
                        "
                    >
                        Failed to load medicines dispensed.
                    </p>

                </div>

            </div>
        );

    }


    return (
        <DashboardLayout role="pharmacist">

        <div
            className="
                min-h-screen
                bg-white
                px-5
                py-5
                md:px-6
                md:py-6
            "
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    pb-5
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <button
                        type="button"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            text-[#59352C]
                            transition
                            hover:bg-[#FFF5ED]
                        "
                        onClick={() =>
                            window.history.back()
                        }
                    >

                        <ArrowLeft
                            size={22}
                        />

                    </button>

                    <div>

                        <h1
                            className="
                                text-[20px]
                                font-semibold
                                text-[#292929]
                                md:text-[21px]
                            "
                        >
                            Medicines Dispensed
                        </h1>

                        <p
                            className="
                                mt-1
                                text-[13px]
                                text-[#777777]
                            "
                        >
                            {totalMedicines ||
                                filteredMedicines.length}{" "}
                            Total Medicines
                        </p>

                    </div>

                </div>


                {/* ================================= */}
                {/* PERIOD DROPDOWN */}
                {/* ================================= */}

                <div
                    className="
                        relative
                    "
                >

                    <button
                        type="button"
                        onClick={() =>
                            setShowPeriodMenu(
                                (value) => !value
                            )
                        }
                        className="
                            flex
                            h-[40px]
                            items-center
                            gap-2
                            rounded-[12px]
                            border
                            border-[#E7D8CC]
                            bg-[#FFFCF9]
                            px-4
                            text-[13px]
                            font-medium
                            text-[#59352C]
                            shadow-sm
                            transition
                            hover:bg-[#FFF6EE]
                        "
                    >

                        <CalendarDays
                            size={15}
                        />

                        <span>
                            {period}
                        </span>

                        <ChevronDown
                            size={15}
                        />

                    </button>


                    {showPeriodMenu && (

                        <div
                            className="
                                absolute
                                right-0
                                top-[46px]
                                z-30
                                w-[145px]
                                overflow-hidden
                                rounded-[12px]
                                border
                                border-[#E7D8CC]
                                bg-white
                                shadow-lg
                            "
                        >

                            {[
                                "Today",
                                "This Week",
                                "This Month",
                            ].map(
                                (option) => (

                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {

                                            setPeriod(
                                                option
                                            );

                                            setShowPeriodMenu(
                                                false
                                            );

                                        }}
                                        className={`
                                            block
                                            w-full
                                            px-4
                                            py-3
                                            text-left
                                            text-[13px]
                                            transition
                                            ${
                                                period ===
                                                option
                                                    ? "bg-[#FFF0E2] font-semibold text-[#59352C]"
                                                    : "text-[#555555] hover:bg-[#FFF8F3]"
                                            }
                                        `}
                                    >
                                        {option}
                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>


            {/* ================================= */}
            {/* TABLE */}
            {/* ================================= */}

            <div
                className="
                    overflow-hidden
                    rounded-[14px]
                    border
                    border-[#E8DED7]
                    bg-white
                "
            >

                <div
                    className="
                        w-full
                        overflow-x-auto
                    "
                >

                    <table
                        className="
                            w-full
                            min-w-[1450px]
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
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-left
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    Patient Details
                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-left
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    Date and Time
                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-left
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    Doctor
                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-left
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    Medicine details
                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-center
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    Batch No.
                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-center
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    Qty.
                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-left
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    Expiry date
                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-right
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    MRP(₹)
                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-right
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    Discount(₹)
                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-right
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    <span className="block">
                                        Courier
                                    </span>

                                    <span className="block">
                                        Charges(₹)
                                    </span>

                                </th>

                                <th
                                    className="
                                        border-r
                                        border-[#E8DED7]
                                        px-3
                                        py-3
                                        text-right
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    <span className="block">
                                        Total
                                    </span>

                                    <span className="block">
                                        Amount(₹)
                                    </span>

                                </th>

                                <th
                                    className="
                                        px-3
                                        py-3
                                        text-center
                                        text-[12px]
                                        font-medium
                                        text-[#59352C]
                                    "
                                >
                                    <span className="block">
                                        Payment
                                    </span>

                                    <span className="block">
                                        Mode
                                    </span>

                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredMedicines.length >
                            0 ? (

                                filteredMedicines.map(
                                    renderTableRow
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={12}
                                        className="
                                            h-[300px]
                                            text-center
                                            text-[15px]
                                            text-[#888888]
                                        "
                                    >
                                        No medicines dispensed
                                        for {period.toLowerCase()}.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ================================= */}
            {/* RESULT INFO */}
            {/* ================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    px-2
                    pt-4
                    text-[13px]
                    text-[#777777]
                "
            >

                <span>
                    Showing{" "}
                    <span
                        className="
                            font-medium
                            text-[#59352C]
                        "
                    >
                        {filteredMedicines.length}
                    </span>{" "}
                    records
                </span>

                <span>
                    Total records:{" "}
                    <span
                        className="
                            font-medium
                            text-[#59352C]
                        "
                    >
                        {total_records ||
                            count ||
                            0}
                    </span>
                </span>

            </div>

        </div>
        </DashboardLayout>
    );
};


export default MedicineDispensedTable;