import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    HiOutlineCheck,
} from "react-icons/hi2";

import {
    dispenseBulk,
    loadPrescriptionItems,
} from "../../../../redux/pharmacist/pharmacistThunk";


const PrescriptionTable = ({
    patient,
    items,
}) => {

    const dispatch = useDispatch();

    const dispensing =
        useSelector(
            (state) =>
                state.pharmacist.dispensing
        );


    // ==========================================
    // QUANTITY STATE
    // ==========================================

    const [quantities, setQuantities] =
        useState({});


    // ==========================================
    // DISCOUNT STATE
    // ==========================================

    const [discounts, setDiscounts] =
        useState({});


    // ==========================================
    // GET DISPATCHED QUANTITY
    // ==========================================

    const getDispensedQuantity = (item) => {

        if (
            quantities[item.id] !== undefined
        ) {
            return quantities[item.id];
        }

        return Number(
            item.qty_dispensed ??
            item.quantity_dispensed ??
            0
        );
    };


    // ==========================================
    // GET DISCOUNT %
    // ==========================================

    const getDiscount = (item) => {

        if (
            discounts[item.id] !== undefined
        ) {
            return discounts[item.id];
        }

        return Number(
            item.discount_percent ??
            item.discount ??
            0
        );
    };


    // ==========================================
    // QUANTITY CHANGE
    // ==========================================

    const handleQuantityChange = (
        item,
        value
    ) => {

        let quantity = Number(value);

        if (Number.isNaN(quantity)) {
            quantity = 0;
        }

        quantity = Math.max(
            0,
            quantity
        );

        setQuantities((prev) => ({
            ...prev,
            [item.id]: quantity,
        }));
    };


    // ==========================================
    // DISCOUNT CHANGE
    // ==========================================

    const handleDiscountChange = (
        item,
        value
    ) => {

        // Allow empty field while typing
        if (value === "") {

            setDiscounts((prev) => ({
                ...prev,
                [item.id]: "",
            }));

            return;
        }

        let discount = Number(value);

        if (Number.isNaN(discount)) {
            discount = 0;
        }

        // Discount must be between 0 and 100
        discount = Math.max(
            0,
            Math.min(
                100,
                discount
            )
        );

        setDiscounts((prev) => ({
            ...prev,
            [item.id]: discount,
        }));
    };


    // ==========================================
    // CALCULATE ITEM TOTAL
    // ==========================================

    const getItemTotal = (item) => {

        const quantity =
            getDispensedQuantity(item);

        const price =
            Number(item.price || 0);

        const discount =
            Number(getDiscount(item) || 0);

        const subtotal =
            price * quantity;

        const discountAmount =
            subtotal * (discount / 100);

        return subtotal - discountAmount;
    };


    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    const total = items.reduce(
        (sum, item) => {

            return (
                sum +
                getItemTotal(item)
            );

        },
        0
    );


    // ==========================================
    // DISPENSE
    // ==========================================

    const handleDispense = async () => {

        const payload = {

            // Keep these according to your
            // existing patient/order structure
            order_id:
                patient?.order_id,

            patient_id:
                patient?.patient_id ||
                patient?.id,

            items: items.map((item) => ({

                id:
                    item.id,

                quantity_dispensed:
                    getDispensedQuantity(item),

                price:
                    Number(
                        item.price || 0
                    ),

                discount:
                    Number(
                        getDiscount(item) || 0
                    ),

            })),

        };


        console.log(
            "Dispense Payload:",
            payload
        );


        try {

            await dispatch(
                dispenseBulk(payload)
            ).unwrap();


            // ==================================
            // RELOAD PRESCRIPTION
            // ==================================

            if (
                patient?.consultation_id
            ) {

                dispatch(
                    loadPrescriptionItems(
                        patient.consultation_id
                    )
                );

            }


            // ==================================
            // CLEAR LOCAL STATE
            // ==================================

            setQuantities({});
            setDiscounts({});


        } catch (error) {

            console.error(
                "Dispense failed:",
                error
            );

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="mt-6">

            {/* ==================================
                TITLE
            ================================== */}

            <div className="mb-5 flex items-center justify-between">

                <h2 className="text-[24px] font-bold text-[#4D2E23]">
                    Prescription List
                </h2>

            </div>


            {/* ==================================
                TABLE
            ================================== */}

            <div className="overflow-hidden rounded-2xl border border-[#EFE4DC]">

                <table className="w-full table-fixed border-collapse">

                    <colgroup>

                        {/* Medicine */}
                        <col className="w-[29%]" />

                        {/* Qty Prescribed */}
                        <col className="w-[11%]" />

                        {/* Qty Dispensed */}
                        <col className="w-[15%]" />

                        {/* Stock */}
                        <col className="w-[13%]" />

                        {/* Discount */}
                        <col className="w-[12%]" />

                        {/* Price */}
                        <col className="w-[10%]" />

                        {/* Total */}
                        <col className="w-[10%]" />

                    </colgroup>


                    {/* ==================================
                        HEADER
                    ================================== */}

                    <thead>

                        <tr className="bg-[#FFF9F5] text-left text-sm text-[#6F625A]">

                            <th className="px-5 py-4">
                                Medicine
                            </th>

                            <th className="px-3 py-4 text-center">
                                Qty.
                                <br />
                                Prescribed
                            </th>

                            <th className="px-3 py-4 text-center">
                                Qty.
                                <br />
                                Dispensed
                            </th>

                            <th className="px-3 py-4 text-center">
                                Stock
                            </th>

                            <th className="px-3 py-4 text-center">
                                Discount
                            </th>

                            <th className="px-3 py-4 text-right">
                                Price
                            </th>

                            <th className="px-3 py-4 text-right">
                                Total
                            </th>

                        </tr>

                    </thead>


                    {/* ==================================
                        BODY
                    ================================== */}

                    <tbody>

                        {items.map((item) => {

                            const prescribed =
                                Number(
                                    item.quantity || 0
                                );

                            const dispensed =
                                getDispensedQuantity(
                                    item
                                );

                            const discount =
                                getDiscount(item);

                            const itemTotal =
                                getItemTotal(item);


                            return (

                                <tr
                                    key={item.id}
                                    className="border-t border-[#EFE4DC]"
                                >

                                    {/* ==================================
                                        MEDICINE
                                    ================================== */}

                                    <td className="px-5 py-5 align-middle">

                                        <p className="truncate font-semibold text-[#4D2E23]">
                                            {item.medicine_name}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-[#8B7A70]">
                                            {item.category}
                                        </p>

                                    </td>


                                    {/* ==================================
                                        PRESCRIBED
                                    ================================== */}

                                    <td className="px-3 py-5 text-center font-semibold text-[#4D2E23]">

                                        {prescribed}

                                    </td>


                                    {/* ==================================
                                        DISPENSED
                                    ================================== */}

                                    <td className="px-3 py-5">

                                        <div className="flex items-center justify-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item,
                                                        dispensed - 1
                                                    )
                                                }
                                                className="
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    rounded-lg
                                                    border
                                                    border-[#E5D8CF]
                                                    text-[#4D2E23]
                                                    transition
                                                    hover:bg-[#FFF5ED]
                                                "
                                            >
                                                −
                                            </button>


                                            <span className="w-8 shrink-0 text-center font-semibold text-[#4D2E23]">

                                                {dispensed}

                                            </span>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item,
                                                        dispensed + 1
                                                    )
                                                }
                                                className="
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    rounded-lg
                                                    border
                                                    border-[#E5D8CF]
                                                    text-[#4D2E23]
                                                    transition
                                                    hover:bg-[#FFF5ED]
                                                "
                                            >
                                                +
                                            </button>

                                        </div>

                                    </td>


                                    {/* ==================================
                                        STOCK
                                    ================================== */}

                                    <td className="px-3 py-5 text-center">

                                        <span
                                            className="
                                                inline-block
                                                whitespace-nowrap
                                                rounded-lg
                                                bg-[#E8F8ED]
                                                px-3
                                                py-2
                                                text-xs
                                                font-medium
                                                text-green-700
                                            "
                                        >
                                            In stock
                                        </span>

                                    </td>


                                    {/* ==================================
                                        DISCOUNT
                                    ================================== */}

                                    <td className="px-3 py-5">

                                        <div className="flex items-center justify-center">

                                            <div
                                                className="
                                                    flex
                                                    w-[78px]
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    border
                                                    border-[#E5D8CF]
                                                    bg-white
                                                    px-3
                                                    py-2
                                                    transition
                                                    focus-within:border-[#8B573D]
                                                    focus-within:ring-1
                                                    focus-within:ring-[#8B573D]/20
                                                "
                                            >

                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    value={
                                                        discount === ""
                                                            ? ""
                                                            : discount
                                                    }
                                                    onChange={(e) =>
                                                        handleDiscountChange(
                                                            item,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="
                                                        w-full
                                                        bg-transparent
                                                        text-center
                                                        text-sm
                                                        font-semibold
                                                        text-[#4D2E23]
                                                        outline-none
                                                    "
                                                />

                                                <span className="text-sm font-semibold text-[#8B7A70]">
                                                    %
                                                </span>

                                            </div>

                                        </div>

                                    </td>


                                    {/* ==================================
                                        PRICE
                                    ================================== */}

                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-3
                                            py-5
                                            text-right
                                            font-semibold
                                            text-[#4D2E23]
                                        "
                                    >

                                        ₹
                                        {Number(
                                            item.price || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </td>


                                    {/* ==================================
                                        TOTAL
                                    ================================== */}

                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-3
                                            py-5
                                            text-right
                                            font-semibold
                                            text-[#4D2E23]
                                        "
                                    >

                                        ₹
                                        {itemTotal.toLocaleString(
                                            "en-IN",
                                            {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2,
                                            }
                                        )}

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>


                    {/* ==================================
                        FOOTER
                    ================================== */}

                    <tfoot>

                        <tr className="border-t border-[#EFE4DC]">

                            <td
                                colSpan="6"
                                className="
                                    px-5
                                    py-5
                                    text-right
                                    text-lg
                                    font-bold
                                    text-[#4D2E23]
                                "
                            >
                                Total
                            </td>


                            <td
                                className="
                                    px-3
                                    py-5
                                    text-right
                                    text-xl
                                    font-bold
                                    text-[#4D2E23]
                                    whitespace-nowrap
                                "
                            >

                                ₹
                                {total.toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    }
                                )}

                            </td>

                        </tr>

                    </tfoot>

                </table>

            </div>


            {/* ==================================
                REVIEW DATE
            ================================== */}

            {items[0]?.review_date && (

                <div className="mt-5 flex justify-end">

                    <div className="rounded-xl border border-[#EFE4DC] px-5 py-3">

                        <span className="text-sm text-[#8B7A70]">
                            Review Date
                        </span>

                        <p className="mt-1 font-semibold text-[#4D2E23]">

                            {new Date(
                                items[0].review_date
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}

                        </p>

                    </div>

                </div>

            )}


            {/* ==================================
                SAVE & DISPENSE
            ================================== */}

            <div className="mt-6 flex justify-end">

                <button
                    type="button"
                    disabled={dispensing}
                    onClick={handleDispense}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-[#8B573D]
                        px-8
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#74442F]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    <HiOutlineCheck size={20} />

                    {dispensing
                        ? "Dispensing..."
                        : "Save & Dispense"}

                </button>

            </div>

        </div>

    );

};


export default PrescriptionTable;