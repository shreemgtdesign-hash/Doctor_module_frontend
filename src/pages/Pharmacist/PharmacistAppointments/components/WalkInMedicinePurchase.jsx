import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Search,
    Plus,
    Minus,
    ArrowLeft,
    LogIn,
    Loader2,
    Maximize2,
} from "lucide-react";

import {
    searchMedicines,
    dispenseBulk,
} from "../../../../redux/pharmacist/pharmacistThunk";
import { setWalkInMedicines } from "../../../../redux/pharmacist/pharmacistSlice";


const WalkInMedicinePurchase = ({
    patient,
    onBack,
}) => {

    const dispatch = useDispatch();


    // ==========================================
    // REDUX
    // ==========================================

    const {
        medicineSearch,
        dispensing,
        walkInMedicines
    } = useSelector(
        (state) => state.pharmacist
    );


    // ==========================================
    // LOCAL STATE
    // ==========================================

    const [search, setSearch] =
        useState("");

    const selectedMedicines =
    walkInMedicines?.[patient?.order_id] || [];

    // ==========================================
    // SEARCH MEDICINES
    // ==========================================

    useEffect(() => {

        const searchValue =
            search.trim();


        if (!searchValue) {
            return;
        }


        const timer =
            setTimeout(() => {

                dispatch(
                    searchMedicines(
                        searchValue
                    )
                );

            }, 350);


        return () => {
            clearTimeout(timer);
        };

    }, [
        search,
        dispatch,
    ]);


    // ==========================================
    // RESET LOCAL FORM WHEN PATIENT CHANGES
    // ==========================================

    useEffect(() => {

        
        setSearch("");

    }, [
        patient?.patient_id,
        patient?.id,
    ]);


    // ==========================================
    // ADD MEDICINE
    // ==========================================

    const handleAddMedicine = (
        medicine
    ) => {

        const alreadyExists =
            selectedMedicines.some(
                (item) =>
                    item.id === medicine.id
            );


        if (alreadyExists) {

            setSearch("");

            return;
        }


        const stock =
            Number(
                medicine.stock_quantity
            ) || 0;


        // Don't allow medicine with zero stock
        if (stock <= 0) {
            return;
        }


        dispatch(
    setWalkInMedicines({
        orderId: patient?.order_id,
        medicines: [
            ...selectedMedicines,
            {
                ...medicine,
                quantity_dispensed: 1,
            },
        ],
    })
);

        setSearch("");

    };


    // ==========================================
    // CHANGE QUANTITY
    // ==========================================

    const handleQuantityChange = (
    medicineId,
    change
) => {

    const updatedMedicines =
        selectedMedicines.map(
            (medicine) => {

                if (
                    medicine.id !==
                    medicineId
                ) {
                    return medicine;
                }

                const stock =
                    Number(
                        medicine.stock_quantity
                    ) || 0;

                const currentQuantity =
                    Number(
                        medicine.quantity_dispensed
                    ) || 1;

                const nextQuantity =
                    currentQuantity +
                    change;

                if (nextQuantity < 1) {
                    return medicine;
                }

                if (
                    nextQuantity >
                    stock
                ) {
                    return medicine;
                }

                return {
                    ...medicine,
                    quantity_dispensed:
                        nextQuantity,
                };
            }
        );

    dispatch(
        setWalkInMedicines({
            orderId: patient?.order_id,
            medicines:
                updatedMedicines,
        })
    );
};


    // ==========================================
    // TOTAL
    // ==========================================

    const total =
        selectedMedicines.reduce(
            (
                sum,
                medicine
            ) => {

                const price =
                    Number(
                        medicine.price
                    ) || 0;


                const quantity =
                    Number(
                        medicine.quantity_dispensed
                    ) || 0;


                return (
                    sum +
                    price *
                    quantity
                );

            },
            0
        );


    // ==========================================
    // DISPENSE
    // ==========================================

    const handleDispense =
        async () => {

            const patientId =
                patient?.patient_id ||
                patient?.id;


            const orderId =
                patient?.order_id;


            if (!patientId) {

                console.error(
                    "Walk-in patient ID is missing"
                );

                return;
            }


            if (!orderId) {

                console.error(
                    "Walk-in order ID is missing"
                );

                return;
            }


            if (
                selectedMedicines.length === 0
            ) {
                return;
            }


            const payload = {

                order_id:
                    orderId,

                patient_id:
                    patientId,

                items:
                    selectedMedicines.map(
                        (medicine) => ({

                            id:
                                medicine.id,

                            quantity_dispensed:
                                medicine.quantity_dispensed,

                        })
                    ),

            };


            const result =
                await dispatch(
                    dispenseBulk(
                        payload
                    )
                );


            // After successful dispensing
            if (
                dispenseBulk.fulfilled.match(
                    result
                )
            ) {

               

                setSearch("");

            }

        };


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (
        value
    ) => {

        const number =
            Number(value) || 0;


        return number.toFixed(2);

    };


    // ==========================================
    // STOCK CLASS
    // ==========================================

    const getStockClass = (
        quantity
    ) => {

        const stock =
            Number(quantity) || 0;


        if (stock <= 10) {

            return `
                bg-[#FFF2DF]
                text-[#7B5A35]
            `;

        }


        return `
            bg-[#EDFFF0]
            text-[#3D6947]
        `;

    };


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

            {/* ======================================
                PATIENT HEADER
            ====================================== */}

            <div
                className="
                    shrink-0
                    px-7
                    
                "
            >

              
            </div>


            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-7
                    pt-6
                    pb-6
                    scrollbar-thin
                    scrollbar-thumb-[#E7D8CE]
                    scrollbar-track-transparent
                "
            >

                {/* ==================================
                    TITLE
                ================================== */}

                <h2
                    className="
                        text-[24px]
                        font-semibold
                        text-[#59352C]
                    "
                >
                    Medicine List
                </h2>


                {/* ==================================
                    SEARCH
                ================================== */}

                <div
                    className="
                        relative
                        mt-7
                    "
                >

                    <Search
                        size={23}
                        strokeWidth={2}
                        className="
                            absolute
                            left-5
                            top-1/2
                            -translate-y-1/2
                            text-[#59352C]
                        "
                    />


                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search medicines"
                        className="
                            h-[62px]
                            w-full
                            rounded-[18px]
                            border
                            border-[#E3D8CD]
                            bg-white
                            pl-14
                            pr-5
                            text-[15px]
                            text-[#3F302A]
                            outline-none
                            transition
                            placeholder:text-[#9B938E]
                            focus:border-[#8A5038]
                            focus:ring-2
                            focus:ring-[#8A5038]/10
                        "
                    />


                    {/* ==================================
                        SEARCH RESULTS
                    ================================== */}

                    {search.trim() && (

                        <div
                            className="
                                absolute
                                left-0
                                right-0
                                top-[70px]
                                z-50
                                max-h-[320px]
                                overflow-y-auto
                                rounded-[18px]
                                border
                                border-[#E8DDD5]
                                bg-white
                                shadow-[0_12px_35px_rgba(60,40,30,0.15)]
                            "
                        >

                            {medicineSearch.loading ? (

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        px-5
                                        py-6
                                        text-sm
                                        text-[#8B7A70]
                                    "
                                >

                                    <Loader2
                                        size={17}
                                        className="
                                            animate-spin
                                        "
                                    />

                                    Searching medicines...

                                </div>

                            ) : medicineSearch.data?.length > 0 ? (

                                medicineSearch.data.map(
                                    (medicine) => {

                                        const alreadyAdded =
                                            selectedMedicines.some(
                                                (item) =>
                                                    item.id ===
                                                    medicine.id
                                            );


                                        const stock =
                                            Number(
                                                medicine.stock_quantity
                                            ) || 0;


                                        return (

                                            <button
                                                key={
                                                    medicine.id
                                                }
                                                type="button"
                                                disabled={
                                                    alreadyAdded ||
                                                    stock <= 0
                                                }
                                                onClick={() =>
                                                    handleAddMedicine(
                                                        medicine
                                                    )
                                                }
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    border-b
                                                    border-[#F0E9E4]
                                                    px-5
                                                    py-4
                                                    text-left
                                                    transition
                                                    last:border-b-0
                                                    hover:bg-[#FFF8F3]
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                "
                                            >

                                                <div
                                                    className="
                                                        min-w-0
                                                        pr-4
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            truncate
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#4D2E23]
                                                        "
                                                    >
                                                        {
                                                            medicine.medicine_name
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[12px]
                                                            text-[#8B7A70]
                                                        "
                                                    >
                                                        {
                                                            medicine.category
                                                        }

                                                        {" • "}

                                                        ₹
                                                        {
                                                            formatPrice(
                                                                medicine.price
                                                            )
                                                        }

                                                        {" • "}

                                                        Stock:{" "}
                                                        {
                                                            stock
                                                        }

                                                    </p>

                                                </div>


                                                <span
                                                    className="
                                                        shrink-0
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#8A5038]
                                                    "
                                                >

                                                    {stock <= 0
                                                        ? "Out of stock"
                                                        : alreadyAdded
                                                            ? "Added"
                                                            : "Add"}

                                                </span>

                                            </button>

                                        );

                                    }
                                )

                            ) : (

                                <div
                                    className="
                                        px-5
                                        py-6
                                        text-center
                                        text-sm
                                        text-[#8B7A70]
                                    "
                                >
                                    No medicines found
                                </div>

                            )}

                        </div>

                    )}

                </div>


                {/* ==================================
                    ERROR
                ================================== */}

                {medicineSearch.error && (

                    <div
                        className="
                            mt-3
                            rounded-xl
                            bg-[#FFF3F1]
                            px-4
                            py-3
                            text-sm
                            text-[#A44A3A]
                        "
                    >

                        {typeof medicineSearch.error ===
                        "string"
                            ? medicineSearch.error
                            : medicineSearch.error?.message ||
                              "Failed to search medicines."}

                    </div>

                )}


                {/* ==================================
                    MEDICINE TABLE
                ================================== */}

                {selectedMedicines.length > 0 && (

                    <div
                        className="
                            mt-5
                            overflow-hidden
                            rounded-[20px]
                            border
                            border-[#E8DDD5]
                            bg-white
                        "
                    >

                        <div
                            className="
                                overflow-x-auto
                            "
                        >

                            <table
                                className="
                                    w-full
                                    min-w-[700px]
                                    table-fixed
                                    border-collapse
                                "
                            >

                                {/* =========================
                                    HEADER
                                ========================= */}

                                <thead>

                                    <tr
                                        className="
                                            bg-[#FFF9F5]
                                        "
                                    >

                                        <th
                                            className="
                                                w-[37%]
                                                border-r
                                                border-[#E8DDD5]
                                                px-5
                                                py-5
                                                text-left
                                                text-[14px]
                                                font-medium
                                                text-[#4D382F]
                                            "
                                        >
                                            Medicine
                                        </th>


                                        <th
                                            className="
                                                w-[23%]
                                                border-r
                                                border-[#E8DDD5]
                                                px-3
                                                py-5
                                                text-center
                                                text-[14px]
                                                font-medium
                                                text-[#4D382F]
                                            "
                                        >
                                            Qty. Dispensed
                                        </th>


                                        <th
                                            className="
                                                w-[18%]
                                                border-r
                                                border-[#E8DDD5]
                                                px-3
                                                py-5
                                                text-center
                                                text-[14px]
                                                font-medium
                                                text-[#4D382F]
                                            "
                                        >
                                            Stock
                                        </th>


                                        <th
                                            className="
                                                w-[11%]
                                                border-r
                                                border-[#E8DDD5]
                                                px-2
                                                py-5
                                                text-center
                                                text-[14px]
                                                font-medium
                                                text-[#4D382F]
                                            "
                                        >
                                            Price
                                        </th>


                                        <th
                                            className="
                                                w-[11%]
                                                px-2
                                                py-5
                                                text-center
                                                text-[14px]
                                                font-medium
                                                text-[#4D382F]
                                            "
                                        >
                                            Total
                                        </th>

                                    </tr>

                                </thead>


                                {/* =========================
                                    BODY
                                ========================= */}

                                <tbody>

                                    {selectedMedicines.map(
                                        (medicine) => {

                                            const quantity =
                                                Number(
                                                    medicine.quantity_dispensed
                                                ) || 1;


                                            const price =
                                                Number(
                                                    medicine.price
                                                ) || 0;


                                            const itemTotal =
                                                price *
                                                quantity;


                                            return (

                                                <tr
                                                    key={
                                                        medicine.id
                                                    }
                                                    className="
                                                        border-t
                                                        border-[#E8DDD5]
                                                    "
                                                >

                                                    {/* MEDICINE */}

                                                    <td
                                                        className="
                                                            border-r
                                                            border-[#E8DDD5]
                                                            px-5
                                                            py-5
                                                            align-middle
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                line-clamp-2
                                                                text-[15px]
                                                                font-semibold
                                                                leading-6
                                                                text-[#4D2E23]
                                                            "
                                                        >
                                                            {
                                                                medicine.medicine_name
                                                            }
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[13px]
                                                                text-[#8B817C]
                                                            "
                                                        >
                                                            {
                                                                medicine.category
                                                            }
                                                        </p>

                                                    </td>


                                                    {/* QUANTITY */}

                                                    <td
                                                        className="
                                                            border-r
                                                            border-[#E8DDD5]
                                                            px-2
                                                            align-middle
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                justify-center
                                                                gap-2
                                                            "
                                                        >

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        medicine.id,
                                                                        -1
                                                                    )
                                                                }
                                                                disabled={
                                                                    quantity <=
                                                                    1
                                                                }
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    items-center
                                                                    justify-center
                                                                    rounded-xl
                                                                    border
                                                                    border-[#E8DDD5]
                                                                    bg-[#FFFCF8]
                                                                    text-[#59352C]
                                                                    transition
                                                                    hover:bg-[#FFF5ED]
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-40
                                                                "
                                                            >

                                                                <Minus
                                                                    size={16}
                                                                />

                                                            </button>


                                                            <span
                                                                className="
                                                                    min-w-[22px]
                                                                    text-center
                                                                    text-[14px]
                                                                    font-semibold
                                                                    text-[#4D2E23]
                                                                "
                                                            >
                                                                {
                                                                    quantity
                                                                }
                                                            </span>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        medicine.id,
                                                                        1
                                                                    )
                                                                }
                                                                disabled={
                                                                    quantity >=
                                                                    Number(
                                                                        medicine.stock_quantity
                                                                    )
                                                                }
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    items-center
                                                                    justify-center
                                                                    rounded-xl
                                                                    border
                                                                    border-[#E8DDD5]
                                                                    bg-[#FFFCF8]
                                                                    text-[#59352C]
                                                                    transition
                                                                    hover:bg-[#FFF5ED]
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-40
                                                                "
                                                            >

                                                                <Plus
                                                                    size={16}
                                                                />

                                                            </button>

                                                        </div>

                                                    </td>


                                                    {/* STOCK */}

                                                    <td
                                                        className="
                                                            border-r
                                                            border-[#E8DDD5]
                                                            px-2
                                                            align-middle
                                                        "
                                                    >

                                                        <div
                                                            className={`
                                                                mx-auto
                                                                w-fit
                                                                rounded-xl
                                                                px-4
                                                                py-2
                                                                text-[12px]
                                                                font-medium
                                                                ${getStockClass(
                                                                    medicine.stock_quantity
                                                                )}
                                                            `}
                                                        >

                                                            {
                                                                medicine.stock_status ||
                                                                medicine.stock ||
                                                                `Stock: ${medicine.stock_quantity}`
                                                            }

                                                        </div>

                                                    </td>


                                                    {/* PRICE */}

                                                    <td
                                                        className="
                                                            border-r
                                                            border-[#E8DDD5]
                                                            px-2
                                                            text-center
                                                            align-middle
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                text-[16px]
                                                                font-semibold
                                                                text-[#4D2E23]
                                                            "
                                                        >

                                                            ₹
                                                            {
                                                                formatPrice(
                                                                    price
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* TOTAL */}

                                                    <td
                                                        className="
                                                            px-2
                                                            text-center
                                                            align-middle
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                text-[16px]
                                                                font-semibold
                                                                text-[#4D2E23]
                                                            "
                                                        >

                                                            ₹
                                                            {
                                                                formatPrice(
                                                                    itemTotal
                                                                )
                                                            }

                                                        </span>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>


                                {/* =========================
                                    FOOTER TOTAL
                                ========================= */}

                                <tfoot>

                                    <tr
                                        className="
                                            border-t
                                            border-[#E8DDD5]
                                        "
                                    >

                                        <td
                                            colSpan={4}
                                            className="
                                                px-5
                                                py-5
                                                text-[20px]
                                                font-semibold
                                                text-[#4D2E23]
                                            "
                                        >
                                            Total
                                        </td>


                                        <td
                                            className="
                                                px-2
                                                py-5
                                                text-center
                                                text-[20px]
                                                font-bold
                                                text-[#4D2E23]
                                            "
                                        >

                                            ₹
                                            {
                                                formatPrice(
                                                    total
                                                )
                                            }

                                        </td>

                                    </tr>

                                </tfoot>

                            </table>

                        </div>

                    </div>

                )}


                {/* ==================================
                    EMPTY STATE
                ================================== */}

                {selectedMedicines.length === 0 &&
                    !search.trim() &&
                    !medicineSearch.loading && (

                    <div
                        className="
                            mt-8
                            rounded-[18px]
                            border
                            border-dashed
                            border-[#E5D9D0]
                            bg-[#FFFCF9]
                            px-6
                            py-12
                            text-center
                        "
                    >

                        <Search
                            size={28}
                            className="
                                mx-auto
                                text-[#C7B7AD]
                            "
                        />


                        <p
                            className="
                                mt-3
                                text-[14px]
                                text-[#8B7A70]
                            "
                        >
                            Search and select medicines
                            for this walk-in patient.
                        </p>

                    </div>

                )}


                {/* ==================================
                    DISPENSE ERROR
                ================================== */}

                {medicineSearch.error && (

                    <div
                        className="
                            mt-4
                            rounded-xl
                            bg-[#FFF3F1]
                            px-4
                            py-3
                            text-sm
                            text-[#A44A3A]
                        "
                    >

                        {typeof medicineSearch.error ===
                        "string"
                            ? medicineSearch.error
                            : medicineSearch.error?.message ||
                              "Failed to dispense medicines."}

                    </div>

                )}

            </div>


            {/* ======================================
                FOOTER
            ====================================== */}

            <div
                className="
                    shrink-0
                    border-t
                    border-[#EEE5DE]
                    bg-white
                    px-7
                    py-5
                "
            >

                <div
                    className="
                        flex
                        gap-5
                    "
                >

                    {/* BACK */}

                    <button
                        type="button"
                        onClick={onBack}
                        className="
                            flex
                            h-[60px]
                            flex-1
                            items-center
                            justify-center
                            gap-3
                            rounded-[18px]
                            border
                            border-[#E4D8CD]
                            bg-[#FFFCF8]
                            text-[16px]
                            font-medium
                            text-[#59352C]
                            transition
                            hover:bg-[#FFF8F3]
                        "
                    >

                        <ArrowLeft
                            size={22}
                        />

                        Back

                    </button>


                    {/* SAVE */}

                    <button
                        type="button"
                        disabled={
                            dispensing ||
                            selectedMedicines.length === 0 ||
                            !patient?.order_id
                        }
                        onClick={
                            handleDispense
                        }
                        className="
                            flex
                            h-[60px]
                            flex-1
                            items-center
                            justify-center
                            gap-3
                            rounded-[18px]
                            bg-[#8A5038]
                            text-[16px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#75432F]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {dispensing ? (

                            <>

                                <Loader2
                                    size={21}
                                    className="
                                        animate-spin
                                    "
                                />

                                Dispensing...

                            </>

                        ) : (

                            <>

                                <LogIn
                                    size={21}
                                />

                                Save and Continue

                            </>

                        )}

                    </button>

                </div>

            </div>

        </div>
    );
};


export default WalkInMedicinePurchase;