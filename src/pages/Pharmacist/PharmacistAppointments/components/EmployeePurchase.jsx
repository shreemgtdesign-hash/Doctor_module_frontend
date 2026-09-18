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
    useNavigate,
} from "react-router-dom";

import {
    ChevronDown,
    Search,
    Mic,
    Minus,
    Plus,
} from "lucide-react";
;


import DashboardLayout from "../../../../components/Layout/DashboardLayout";
import { createPharmacistEmployeePurchase, loadPharmacistEmployees, searchMedicines } from "../../../../redux/pharmacist/pharmacistThunk";


const EmployeePurchase = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // ==========================================
    // REDUX
    // ==========================================

    const {
        employees = [],
        employeesLoading = false,
        employeesError = null,

        medicineSearch = {
            data: [],
            loading: false,
            error: null,
        },

        employeePurchaseCreating = false,
        employeePurchaseSuccess = false,
        employeePurchaseMessage = "",
        employeePurchaseData = null,
        employeePurchaseError = null,
    } = useSelector(
        (state) =>
            state.pharmacist || {}
    );


    // ==========================================
    // EMPLOYEE
    // ==========================================

    const [
        selectedEmployee,
        setSelectedEmployee,
    ] = useState(null);

    const [
        employeeDropdownOpen,
        setEmployeeDropdownOpen,
    ] = useState(false);


    // ==========================================
    // PAYMENT
    // ==========================================

    const [
        paymentMode,
        setPaymentMode,
    ] = useState("Online");

    const [
        paymentDropdownOpen,
        setPaymentDropdownOpen,
    ] = useState(false);


    // ==========================================
    // MEDICINE SEARCH
    // ==========================================

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        searchOpen,
        setSearchOpen,
    ] = useState(false);


    // ==========================================
    // MEDICINES
    // ==========================================

    const [
        items,
        setItems,
    ] = useState([]);


    // ==========================================
    // LOAD EMPLOYEES
    // ==========================================

    useEffect(() => {

        dispatch(
            loadPharmacistEmployees()
        );

    }, [dispatch]);


    // ==========================================
    // SEARCH MEDICINES
    // ==========================================

    useEffect(() => {

        const value =
            search.trim();

        if (
            value.length < 2
        ) {

            setSearchOpen(false);

            return;

        }


        const timer =
            setTimeout(() => {

                dispatch(
                    searchMedicines(
                        value
                    )
                );

                setSearchOpen(true);

            }, 350);


        return () =>
            clearTimeout(timer);

    }, [
        search,
        dispatch,
    ]);


    // ==========================================
    // SUCCESS
    // ==========================================

    useEffect(() => {

        if (
            employeePurchaseSuccess &&
            employeePurchaseData
        ) {

            // Keep the purchase result on screen
            // so the returned QR code can be shown.

            setSearch("");
            setSearchOpen(false);

        }

    }, [
        employeePurchaseSuccess,
        employeePurchaseData,
    ]);


    // ==========================================
    // OUTSIDE CLICK
    // ==========================================

    useEffect(() => {

        const handleOutsideClick = (
            event
        ) => {

            if (
                !event.target.closest(
                    "[data-employee-dropdown]"
                )
            ) {

                setEmployeeDropdownOpen(
                    false
                );

            }


            if (
                !event.target.closest(
                    "[data-payment-dropdown]"
                )
            ) {

                setPaymentDropdownOpen(
                    false
                );

            }


            if (
                !event.target.closest(
                    "[data-medicine-search]"
                )
            ) {

                setSearchOpen(
                    false
                );

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    // ==========================================
    // EMPLOYEE HELPERS
    // ==========================================

    const getEmployeeId = (
        employee
    ) => {

        return (
            employee?.employee_id ||
            employee?.id ||
            employee?.employee_code ||
            ""
        );

    };


    const getEmployeeName = (
        employee
    ) => {

        return (
            employee?.employee_name ||
            employee?.name ||
            employee?.full_name ||
            ""
        );

    };


    const getEmployeeEmail = (
        employee
    ) => {

        return (
            employee?.email ||
            employee?.email_id ||
            ""
        );

    };


    // ==========================================
    // SELECT EMPLOYEE
    // ==========================================

    const handleSelectEmployee = (
        employee
    ) => {

        setSelectedEmployee(
            employee
        );

        setEmployeeDropdownOpen(
            false
        );

    };


    // ==========================================
    // ADD MEDICINE
    // ==========================================

    const handleAddMedicine = (
        medicine
    ) => {

        const productId =
            medicine?.product_id ||
            medicine?.id ||
            medicine?.product_code ||
            "";

        const medicineName =
            medicine?.medicine_name ||
            medicine?.name ||
            medicine?.product_name ||
            "";

        const existing =
            items.find(
                (item) =>
                    String(
                        item.product_id
                    ) ===
                    String(productId)
            );


        if (existing) {

            setItems(
                (previous) =>
                    previous.map(
                        (item) =>
                            String(
                                item.product_id
                            ) ===
                            String(productId)
                                ? {
                                    ...item,
                                    quantity:
                                        item.quantity +
                                        1,
                                }
                                : item
                    )
            );

        } else {

            const price =
                Number(
                    medicine?.unit_rate ??
                    medicine?.price ??
                    medicine?.unit_price ??
                    0
                );


            setItems(
                (previous) => [
                    ...previous,

                    {
                        product_id:
                            productId,

                        medicine_name:
                            medicineName,

                        category:
                            medicine?.category ||
                            "",

                        price,

                        quantity: 1,

                        discount_percent: 0,

                        remarks: "",
                    },
                ]
            );

        }


        setSearch("");
        setSearchOpen(false);

    };


    // ==========================================
    // UPDATE MEDICINE
    // ==========================================

    const updateItem = (
        index,
        field,
        value
    ) => {

        setItems(
            (previous) =>
                previous.map(
                    (item, itemIndex) =>
                        itemIndex === index
                            ? {
                                ...item,
                                [field]:
                                    value,
                            }
                            : item
                )
        );

    };


    // ==========================================
    // QUANTITY
    // ==========================================

    const increaseQuantity = (
        index
    ) => {

        setItems(
            (previous) =>
                previous.map(
                    (item, itemIndex) =>
                        itemIndex === index
                            ? {
                                ...item,
                                quantity:
                                    item.quantity +
                                    1,
                            }
                            : item
                )
        );

    };


    const decreaseQuantity = (
        index
    ) => {

        setItems(
            (previous) =>
                previous
                    .map(
                        (
                            item,
                            itemIndex
                        ) =>
                            itemIndex === index
                                ? {
                                    ...item,
                                    quantity:
                                        Math.max(
                                            1,
                                            item.quantity -
                                            1
                                        ),
                                }
                                : item
                    )
        );

    };


    // ==========================================
    // LINE TOTAL
    // ==========================================

    const calculateLineTotal = (
        item
    ) => {

        const subtotal =
            Number(
                item.price || 0
            ) *
            Number(
                item.quantity || 0
            );


        const discount =
            Math.min(
                100,
                Math.max(
                    0,
                    Number(
                        item.discount_percent ||
                        0
                    )
                )
            );


        return (
            subtotal -
            (
                subtotal *
                discount /
                100
            )
        );

    };


    // ==========================================
    // GRAND TOTAL
    // ==========================================

    const grandTotal =
        useMemo(
            () =>
                items.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        calculateLineTotal(
                            item
                        ),
                    0
                ),
            [items]
        );


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        if (!selectedEmployee) {

            return;

        }


        if (items.length === 0) {

            return;

        }


        const payload = {

            employee_name:
                getEmployeeName(
                    selectedEmployee
                ),

            email:
                getEmployeeEmail(
                    selectedEmployee
                ),

            payment_mode:
                paymentMode,

            payment_status:
                "paid",

            items:
                items.map(
                    (item) => ({
                        product_id:
                            item.product_id,

                        medicine_name:
                            item.medicine_name,

                        quantity:
                            Number(
                                item.quantity
                            ),

                        discount_percent:
                            Number(
                                item.discount_percent ||
                                0
                            ),

                        remarks:
                            item.remarks ||
                            "",
                    })
                ),

        };


        console.log(
            "Employee Purchase Payload:",
            payload
        );


        try {

            await dispatch(
                createPharmacistEmployeePurchase(
                    payload
                )
            ).unwrap();

        } catch (error) {

            console.error(
                "Employee purchase failed:",
                error
            );

        }

    };


    const qrCode =
        employeePurchaseData?.qr_code_url ||
        "";


    // ==========================================
    // RETURN
    // ==========================================

    return (

        <DashboardLayout
            role="pharmacist"
        >

            <form
                onSubmit={
                    handleSubmit
                }
                className="
                    min-h-screen
                    bg-[#FBFAF8]
                    px-5
                    py-5
                    text-[#4B2E2A]
                "
            >


                {/* ====================================== */}
                {/* PERSONAL INFORMATION */}
                {/* ====================================== */}

                <section className="
                    rounded-[20px]
                    border
                    border-[#E8DDD6]
                    bg-white
                    shadow-sm
                ">

                    {/* HEADER */}

                    <div className="
                        border-b
                        border-[#EEE5DE]
                        px-6
                        py-5
                    ">

                        <h1 className="
                            text-[20px]
                            font-semibold
                        ">
                            Personal Information
                        </h1>

                    </div>


                    <div className="
                        grid
                        grid-cols-[1fr_1fr_300px]
                        gap-5
                        px-6
                        py-5
                    ">


                        {/* LEFT */}

                        <div className="space-y-5">

                            {/* EMPLOYEE NAME */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-[13px]
                                    font-medium
                                ">
                                    Employee Name
                                </label>


                                <div
                                    className="
                                        relative
                                    "
                                    data-employee-dropdown
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEmployeeDropdownOpen(
                                                (
                                                    previous
                                                ) =>
                                                    !previous
                                            )
                                        }
                                        className="
                                            flex
                                            h-[54px]
                                            w-full
                                            items-center
                                            justify-between
                                            rounded-xl
                                            border
                                            border-[#E7DBD3]
                                            bg-white
                                            px-4
                                            text-left
                                            text-[13px]
                                            font-medium
                                            text-[#4B2E2A]
                                        "
                                    >

                                        <span className="
                                            truncate
                                        ">
                                            {
                                                selectedEmployee
                                                    ? getEmployeeName(
                                                        selectedEmployee
                                                    )
                                                    : "Select employee"
                                            }
                                        </span>

                                        <ChevronDown
                                            size={16}
                                            className={
                                                employeeDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }
                                        />

                                    </button>


                                    {employeeDropdownOpen && (

                                        <div className="
                                            absolute
                                            left-0
                                            right-0
                                            top-[60px]
                                            z-[100]
                                            max-h-[250px]
                                            overflow-y-auto
                                            rounded-xl
                                            border
                                            border-[#E7DBD3]
                                            bg-white
                                            shadow-xl
                                        ">

                                            {employeesLoading && (

                                                <div className="
                                                    px-4
                                                    py-3
                                                    text-[11px]
                                                    text-[#81756E]
                                                ">
                                                    Loading employees...
                                                </div>

                                            )}


                                            {!employeesLoading &&
                                                employees.length ===
                                                    0 && (

                                                    <div className="
                                                        px-4
                                                        py-3
                                                        text-[11px]
                                                        text-[#81756E]
                                                    ">
                                                        No employees found.
                                                    </div>

                                                )}


                                            {employees.map(
                                                (
                                                    employee
                                                ) => {

                                                    const id =
                                                        getEmployeeId(
                                                            employee
                                                        );

                                                    const name =
                                                        getEmployeeName(
                                                            employee
                                                        );

                                                    const email =
                                                        getEmployeeEmail(
                                                            employee
                                                        );


                                                    return (

                                                        <button
                                                            key={
                                                                id ||
                                                                name
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                handleSelectEmployee(
                                                                    employee
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                w-full
                                                                items-center
                                                                justify-between
                                                                border-b
                                                                border-[#F0E6DF]
                                                                px-4
                                                                py-3
                                                                text-left
                                                                hover:bg-[#FFF8F2]
                                                            "
                                                        >

                                                            <div>

                                                                <p className="
                                                                    text-[12px]
                                                                    font-semibold
                                                                ">
                                                                    {name}
                                                                </p>

                                                                {id && (

                                                                    <p className="
                                                                        mt-1
                                                                        text-[10px]
                                                                        text-[#81756E]
                                                                    ">
                                                                        {id}
                                                                    </p>

                                                                )}

                                                            </div>


                                                            {email && (

                                                                <span className="
                                                                    max-w-[200px]
                                                                    truncate
                                                                    text-[10px]
                                                                    text-[#81756E]
                                                                ">
                                                                    {email}
                                                                </span>

                                                            )}

                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-[13px]
                                    font-medium
                                ">
                                    Email ID
                                </label>

                                <input
                                    value={
                                        selectedEmployee
                                            ? getEmployeeEmail(
                                                selectedEmployee
                                            )
                                            : ""
                                    }
                                    readOnly
                                    placeholder="Employee email"
                                    className="
                                        h-[54px]
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#E7DBD3]
                                        bg-white
                                        px-4
                                        text-[13px]
                                        outline-none
                                    "
                                />

                            </div>

                        </div>


                        {/* MIDDLE */}

                        <div className="space-y-5">

                            {/* EMPLOYEE ID */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-[13px]
                                    font-medium
                                ">
                                    Employee ID
                                </label>


                                <input
                                    value={
                                        selectedEmployee
                                            ? getEmployeeId(
                                                selectedEmployee
                                            )
                                            : ""
                                    }
                                    readOnly
                                    placeholder="Employee ID"
                                    className="
                                        h-[54px]
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#E7DBD3]
                                        bg-white
                                        px-4
                                        text-[13px]
                                        outline-none
                                    "
                                />

                            </div>


                            {/* PAYMENT */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-[13px]
                                    font-medium
                                ">
                                    Select Payment mode
                                </label>


                                <div
                                    className="
                                        relative
                                    "
                                    data-payment-dropdown
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPaymentDropdownOpen(
                                                (
                                                    previous
                                                ) =>
                                                    !previous
                                            )
                                        }
                                        className="
                                            flex
                                            h-[54px]
                                            w-full
                                            items-center
                                            justify-between
                                            rounded-xl
                                            border
                                            border-[#E7DBD3]
                                            bg-white
                                            px-4
                                            text-left
                                            text-[13px]
                                        "
                                    >

                                        <span>
                                            {paymentMode}
                                        </span>

                                        <ChevronDown
                                            size={16}
                                            className={
                                                paymentDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }
                                        />

                                    </button>


                                    {paymentDropdownOpen && (

                                        <div className="
                                            absolute
                                            left-0
                                            right-0
                                            top-[60px]
                                            z-[100]
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-[#E7DBD3]
                                            bg-white
                                            shadow-xl
                                        ">

                                            {[
                                                "Online",
                                                "Cash",
                                                "Card",
                                                "UPI",
                                            ].map(
                                                (
                                                    mode
                                                ) => (

                                                    <button
                                                        key={
                                                            mode
                                                        }
                                                        type="button"
                                                        onClick={() => {

                                                            setPaymentMode(
                                                                mode
                                                            );

                                                            setPaymentDropdownOpen(
                                                                false
                                                            );

                                                        }}
                                                        className="
                                                            flex
                                                            w-full
                                                            px-4
                                                            py-3
                                                            text-left
                                                            text-[12px]
                                                            hover:bg-[#FFF8F2]
                                                        "
                                                    >
                                                        {mode}
                                                    </button>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* TOTAL / PAYMENT */}

                        <div className="flex flex-col justify-between">

                            <div className="
                                rounded-2xl
                                border
                                border-[#E8DDD6]
                                bg-white
                                p-5
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <span className="
                                        text-[13px]
                                        font-semibold
                                    ">
                                        Total
                                    </span>

                                    <span className="
                                        text-[17px]
                                        font-bold
                                    ">
                                        ₹
                                        {grandTotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>


                                <button
                                    type="submit"
                                    disabled={
                                        employeePurchaseCreating ||
                                        !selectedEmployee ||
                                        items.length === 0
                                    }
                                    className="
                                        mt-4
                                        flex
                                        h-[48px]
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-[#8A553B]
                                        text-[12px]
                                        font-semibold
                                        text-white
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {employeePurchaseCreating
                                        ? "Processing..."
                                        : "▣ Process Payment"}

                                </button>

                            </div>


                            {/* QR */}

                            <div className="
                                mt-4
                                flex
                                h-[145px]
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-[#E8DDD6]
                                bg-white
                                p-3
                            ">

                                {qrCode ? (

                                    <img
                                        src={qrCode}
                                        alt="Payment QR"
                                        className="
                                            h-full
                                            w-full
                                            object-contain
                                        "
                                    />

                                ) : (

                                    <span className="
                                        text-[10px]
                                        text-[#9A8D84]
                                    ">
                                        Payment QR
                                    </span>

                                )}

                            </div>

                        </div>

                    </div>

                </section>


                {/* ====================================== */}
                {/* SUCCESS */}
                {/* ====================================== */}

                {employeePurchaseSuccess && (

                    <div className="
                        mt-4
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                        text-[12px]
                        text-green-700
                    ">

                        {employeePurchaseMessage}

                        {employeePurchaseData?.order_no && (

                            <span className="ml-2 font-semibold">
                                Order No:
                                {" "}
                                {employeePurchaseData.order_no}
                            </span>

                        )}

                    </div>

                )}


                {/* ====================================== */}
                {/* ERROR */}
                {/* ====================================== */}

                {(employeePurchaseError ||
                    employeesError) && (

                    <div className="
                        mt-4
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-[12px]
                        text-red-600
                    ">

                        {
                            typeof (
                                employeePurchaseError ||
                                employeesError
                            ) ===
                            "string"
                                ? (
                                    employeePurchaseError ||
                                    employeesError
                                )
                                : "Unable to process request."
                        }

                    </div>

                )}


                {/* ====================================== */}
                {/* PRESCRIPTION LIST */}
                {/* ====================================== */}

                <section className="
                    mt-6
                    rounded-[20px]
                    border
                    border-[#E8DDD6]
                    bg-white
                    p-6
                ">

                    <h2 className="
                        text-[18px]
                        font-semibold
                    ">
                        Prescription List
                    </h2>


                    {/* SEARCH */}

                    <div
                        className="
                            relative
                            mt-5
                        "
                        data-medicine-search
                    >

                        <div className="
                            flex
                            h-[54px]
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-[#E7DBD3]
                            px-4
                        ">

                            <Search
                                size={18}
                                className="
                                    text-[#4B2E2A]
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
                                onFocus={() => {

                                    if (
                                        medicineSearch.data?.length
                                    ) {
                                        setSearchOpen(
                                            true
                                        );
                                    }

                                }}
                                placeholder="Search by medicine"
                                className="
                                    flex-1
                                    bg-transparent
                                    text-[13px]
                                    outline-none
                                "
                            />

                            <Mic
                                size={17}
                                className="
                                    text-[#4B2E2A]
                                "
                            />

                        </div>


                        {searchOpen && (

                            <div className="
                                absolute
                                left-0
                                right-0
                                top-[60px]
                                z-[100]
                                max-h-[280px]
                                overflow-y-auto
                                rounded-xl
                                border
                                border-[#E7DBD3]
                                bg-white
                                shadow-xl
                            ">

                                {medicineSearch.loading && (

                                    <div className="
                                        px-4
                                        py-4
                                        text-[11px]
                                        text-[#81756E]
                                    ">
                                        Searching...
                                    </div>

                                )}


                                {!medicineSearch.loading &&
                                    medicineSearch.data?.length ===
                                        0 && (

                                        <div className="
                                            px-4
                                            py-4
                                            text-[11px]
                                            text-[#81756E]
                                        ">
                                            No medicines found.
                                        </div>

                                    )}


                                {medicineSearch.data?.map(
                                    (
                                        medicine,
                                        index
                                    ) => {

                                        const id =
                                            medicine?.product_id ||
                                            medicine?.id ||
                                            medicine?.product_code ||
                                            index;

                                        const name =
                                            medicine?.medicine_name ||
                                            medicine?.name ||
                                            medicine?.product_name ||
                                            "Medicine";


                                        const category =
                                            medicine?.category ||
                                            "";


                                        const price =
                                            Number(
                                                medicine?.unit_rate ??
                                                medicine?.price ??
                                                medicine?.unit_price ??
                                                0
                                            );


                                        return (

                                            <button
                                                key={id}
                                                type="button"
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
                                                    border-[#F0E6DF]
                                                    px-4
                                                    py-3
                                                    text-left
                                                    hover:bg-[#FFF8F2]
                                                "
                                            >

                                                <div>

                                                    <p className="
                                                        text-[12px]
                                                        font-semibold
                                                        text-[#4B2E2A]
                                                    ">
                                                        {name}
                                                    </p>

                                                    <p className="
                                                        mt-1
                                                        text-[10px]
                                                        text-[#81756E]
                                                    ">
                                                        {category}
                                                    </p>

                                                </div>


                                                <span className="
                                                    text-[11px]
                                                    font-semibold
                                                ">
                                                    ₹
                                                    {price.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>

                                            </button>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </div>


                    {/* ================================== */}
                    {/* TABLE */}
                    {/* ================================== */}

                    <div className="
                        mt-5
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#E8DDD6]
                    ">

                        {/* HEADER */}

                        <div className="
                            grid
                            grid-cols-[2fr_1.1fr_1.2fr_1.2fr_1.8fr_1.2fr]
                            border-b
                            border-[#E8DDD6]
                            bg-[#FFF9F4]
                        ">

                            <div className="
                                px-4
                                py-4
                                text-[12px]
                                font-medium
                            ">
                                Medicines
                            </div>

                            <div className="
                                border-l
                                border-[#E8DDD6]
                                px-3
                                py-4
                                text-center
                                text-[12px]
                                font-medium
                            ">
                                Price(₹)
                            </div>

                            <div className="
                                border-l
                                border-[#E8DDD6]
                                px-3
                                py-4
                                text-center
                                text-[12px]
                                font-medium
                            ">
                                Qty.
                            </div>

                            <div className="
                                border-l
                                border-[#E8DDD6]
                                px-3
                                py-4
                                text-center
                                text-[12px]
                                font-medium
                            ">
                                Discount(%)
                            </div>

                            <div className="
                                border-l
                                border-[#E8DDD6]
                                px-3
                                py-4
                                text-center
                                text-[12px]
                                font-medium
                            ">
                                Remarks
                            </div>

                            <div className="
                                border-l
                                border-[#E8DDD6]
                                px-3
                                py-4
                                text-center
                                text-[12px]
                                font-medium
                            ">
                                Total Amount(₹)
                            </div>

                        </div>


                        {/* EMPTY */}

                        {items.length === 0 && (

                            <div className="
                                flex
                                h-[180px]
                                items-center
                                justify-center
                                text-[12px]
                                text-[#81756E]
                            ">
                                Search and add medicines.
                            </div>

                        )}


                        {/* ITEMS */}

                        {items.map(
                            (
                                item,
                                index
                            ) => (

                                <div
                                    key={
                                        item.product_id ||
                                        index
                                    }
                                    className="
                                        grid
                                        min-h-[82px]
                                        grid-cols-[2fr_1.1fr_1.2fr_1.2fr_1.8fr_1.2fr]
                                        border-b
                                        border-[#EEE4DD]
                                        last:border-b-0
                                    "
                                >

                                    {/* MEDICINE */}

                                    <div className="
                                        flex
                                        flex-col
                                        justify-center
                                        px-4
                                        py-4
                                    ">

                                        <p className="
                                            text-[13px]
                                            font-semibold
                                            text-[#4B2E2A]
                                        ">
                                            {
                                                item.medicine_name
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-[10px]
                                            text-[#81756E]
                                        ">
                                            {
                                                item.category ||
                                                ""
                                            }
                                        </p>

                                    </div>


                                    {/* PRICE */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        border-l
                                        border-[#EEE4DD]
                                        text-[12px]
                                        font-semibold
                                    ">
                                        {
                                            Number(
                                                item.price ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )
                                        }
                                    </div>


                                    {/* QUANTITY */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-3
                                        border-l
                                        border-[#EEE4DD]
                                    ">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                decreaseQuantity(
                                                    index
                                                )
                                            }
                                            className="
                                                flex
                                                h-[38px]
                                                w-[38px]
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-[#E7DBD3]
                                                bg-white
                                            "
                                        >
                                            <Minus
                                                size={16}
                                            />
                                        </button>


                                        <span className="
                                            min-w-[18px]
                                            text-center
                                            text-[12px]
                                            font-semibold
                                        ">
                                            {
                                                item.quantity
                                            }
                                        </span>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                increaseQuantity(
                                                    index
                                                )
                                            }
                                            className="
                                                flex
                                                h-[38px]
                                                w-[38px]
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-[#E7DBD3]
                                                bg-white
                                            "
                                        >
                                            <Plus
                                                size={16}
                                            />
                                        </button>

                                    </div>


                                    {/* DISCOUNT */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        border-l
                                        border-[#EEE4DD]
                                    ">

                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={
                                                item.discount_percent
                                            }
                                            onChange={(event) =>
                                                updateItem(
                                                    index,
                                                    "discount_percent",
                                                    event.target.value
                                                )
                                            }
                                            className="
                                                h-[42px]
                                                w-[95px]
                                                rounded-full
                                                border
                                                border-[#E7DBD3]
                                                bg-white
                                                px-3
                                                text-center
                                                text-[11px]
                                                outline-none
                                            "
                                        />

                                    </div>


                                    {/* REMARKS */}

                                    <div className="
                                        flex
                                        items-center
                                        border-l
                                        border-[#EEE4DD]
                                        px-3
                                    ">

                                        <input
                                            type="text"
                                            value={
                                                item.remarks
                                            }
                                            onChange={(event) =>
                                                updateItem(
                                                    index,
                                                    "remarks",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Add remarks"
                                            className="
                                                h-[42px]
                                                w-full
                                                rounded-full
                                                border
                                                border-[#E7DBD3]
                                                px-4
                                                text-[11px]
                                                outline-none
                                            "
                                        />

                                    </div>


                                    {/* TOTAL */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        border-l
                                        border-[#EEE4DD]
                                        text-[13px]
                                        font-semibold
                                    ">

                                        ₹
                                        {
                                            calculateLineTotal(
                                                item
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    maximumFractionDigits: 2,
                                                }
                                            )
                                        }

                                    </div>

                                </div>

                            )
                        )}


                        {/* TOTAL */}

                        {items.length > 0 && (

                            <div className="
                                grid
                                grid-cols-[1fr_1.2fr]
                                border-t
                                border-[#EEE4DD]
                                bg-[#FFF9F4]
                            ">

                                <div className="
                                    px-4
                                    py-4
                                    text-[14px]
                                    font-semibold
                                ">
                                    Total Amount
                                </div>

                                <div className="
                                    border-l
                                    border-[#EEE4DD]
                                    px-4
                                    py-4
                                    text-right
                                    text-[14px]
                                    font-semibold
                                ">
                                    ₹
                                    {grandTotal.toLocaleString(
                                        "en-IN",
                                        {
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </div>

                            </div>

                        )}

                    </div>

                </section>

            </form>

        </DashboardLayout>
    );
};


export default EmployeePurchase;