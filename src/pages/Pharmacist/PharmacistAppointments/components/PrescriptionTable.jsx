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
    loading,
}) => {

    const dispatch = useDispatch();

    const dispensing =
        useSelector(
            (state) =>
                state.pharmacist.dispensing
        );


    const [quantities, setQuantities] =
        useState({});


    const getDispensedQuantity = (item) => {

        if (
            quantities[item.id] !== undefined
        ) {
            return quantities[item.id];
        }

        return Number(
            item.quantity_dispensed || 0
        );

    };


    const handleQuantityChange = (
        item,
        value
    ) => {

        const prescribed =
            Number(item.quantity || 0);

        let quantity =
            Number(value);

        if (Number.isNaN(quantity)) {
            quantity = 0;
        }

        quantity =
            Math.max(
                0,
                Math.min(
                    quantity,
                    prescribed
                )
            );


        setQuantities((prev) => ({

            ...prev,

            [item.id]: quantity,

        }));

    };


    const handleDispense = async () => {

        const payload = {

            items: items.map((item) => ({

                id: item.id,

                quantity_dispensed:
                    getDispensedQuantity(item),

            })),

        };


        try {

            await dispatch(
                dispenseBulk(payload)
            ).unwrap();


            // Reload after successful dispense

            dispatch(
                loadPrescriptionItems(
                    patient.consultation_id
                )
            );


            setQuantities({});

        } catch (error) {

            console.error(
                "Dispense failed:",
                error
            );

        }

    };


    if (loading) {

        return (

            <div className="flex h-64 items-center justify-center">

                <p className="text-[#8B7A70]">
                    Loading prescription...
                </p>

            </div>

        );

    }


    if (!items.length) {

        return (

            <div className="mt-6 rounded-2xl border border-[#EFE4DC] p-10 text-center">

                <p className="text-lg font-semibold text-[#4D2E23]">
                    No prescription found
                </p>

                <p className="mt-2 text-sm text-[#8B7A70]">
                    This patient has no prescribed medicines.
                </p>

            </div>

        );

    }


    const total =
        items.reduce(
            (sum, item) =>
                sum +
                Number(item.price || 0) *
                Number(item.quantity || 0),
            0
        );


    return (

        <div className="mt-6">

            {/* Title */}

            <div className="mb-5 flex items-center justify-between">

                <h2 className="text-[24px] font-bold text-[#4D2E23]">
                    Prescription List
                </h2>

            </div>


            {/* Table */}

            <div className="overflow-hidden rounded-2xl border border-[#EFE4DC]">

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="bg-[#FFF9F5] text-left text-sm text-[#6F625A]">

                            <th className="px-5 py-4">
                                Medicine
                            </th>

                            <th className="px-5 py-4 text-center">
                                Qty.
                                <br />
                                Prescribed
                            </th>

                            <th className="px-5 py-4 text-center">
                                Qty.
                                <br />
                                Dispensed
                            </th>

                            <th className="px-5 py-4 text-center">
                                Stock
                            </th>

                            <th className="px-5 py-4 text-right">
                                Price
                            </th>

                            <th className="px-5 py-4 text-right">
                                Total
                            </th>

                        </tr>

                    </thead>


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


                            return (

                                <tr
                                    key={item.id}
                                    className="border-t border-[#EFE4DC]"
                                >

                                    {/* Medicine */}

                                    <td className="px-5 py-5">

                                        <p className="font-semibold text-[#4D2E23]">
                                            {item.medicine_name}
                                        </p>

                                        <p className="mt-1 text-xs text-[#8B7A70]">
                                            {item.category}
                                        </p>

                                    </td>


                                    {/* Prescribed */}

                                    <td className="px-5 py-5 text-center font-semibold text-[#4D2E23]">
                                        {prescribed}
                                    </td>


                                    {/* Dispensed */}

                                    <td className="px-5 py-5">

                                        <div className="flex items-center justify-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item,
                                                        dispensed - 1
                                                    )
                                                }
                                                className="h-8 w-8 rounded-lg border border-[#E5D8CF] text-[#4D2E23]"
                                            >
                                                −
                                            </button>


                                            <span className="w-8 text-center font-semibold">
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
                                                className="h-8 w-8 rounded-lg border border-[#E5D8CF] text-[#4D2E23]"
                                            >
                                                +
                                            </button>

                                        </div>

                                    </td>


                                    {/* Stock */}

                                    <td className="px-5 py-5 text-center">

                                        <span className="rounded-lg bg-[#E8F8ED] px-3 py-2 text-xs font-medium text-green-700">
                                            In stock
                                        </span>

                                    </td>


                                    {/* Price */}

                                    <td className="px-5 py-5 text-right font-semibold text-[#4D2E23]">

                                        ₹
                                        {Number(
                                            item.price || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </td>


                                    {/* Total */}

                                    <td className="px-5 py-5 text-right font-semibold text-[#4D2E23]">

                                        ₹
                                        {(
                                            Number(
                                                item.price || 0
                                            ) *
                                            dispensed
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>


                    {/* Total */}

                    <tfoot>

                        <tr className="border-t border-[#EFE4DC]">

                            <td
                                colSpan="5"
                                className="px-5 py-5 text-right text-lg font-bold text-[#4D2E23]"
                            >
                                Total
                            </td>

                            <td className="px-5 py-5 text-right text-xl font-bold text-[#4D2E23]">

                                ₹
                                {total.toLocaleString(
                                    "en-IN"
                                )}

                            </td>

                        </tr>

                    </tfoot>

                </table>

            </div>


            {/* Review Date */}

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


            {/* Save */}

            <div className="mt-6 flex justify-end">

                <button
                    type="button"
                    disabled={dispensing}
                    onClick={handleDispense}
                    className="flex items-center gap-2 rounded-xl bg-[#8B573D] px-8 py-3 font-semibold text-white transition hover:bg-[#74442F] disabled:cursor-not-allowed disabled:opacity-50"
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