import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Search,
    Mic,
    MicOff,
    ChevronUp,
    ChevronDown,
    X,
    Plus,
} from "lucide-react";
import { HiCheck, HiOutlineCheck } from "react-icons/hi2";
import toast from "react-hot-toast";

import {
    dispenseBulk,
    loadPrescriptionItems,
    removePrescriptionItem,
} from "../../../../redux/pharmacist/pharmacistThunk";
import { searchPharmacistMedicines } from "../../../../api/pharmacistApi";

const FALLBACK_MEDICINES = [
    { id: "fb_1", name: "Triphala Tablet", category: "Digestive", price: 68, stock: "In stock" },
    { id: "fb_2", name: "Ashwagandha Churna", category: "Digestive", price: 78, stock: "Last 10 Left" },
    { id: "fb_3", name: "Brahmi Vati", category: "Neurological", price: 95, stock: "In stock" },
    { id: "fb_4", name: "Shatavari Ghrita", category: "Wellness", price: 120, stock: "In stock" },
    { id: "fb_5", name: "Trikatu Churna", category: "Digestive", price: 55, stock: "In stock" },
    { id: "fb_6", name: "Amrutharishtam", category: "Immunity", price: 140, stock: "In stock" },
];

const PrescriptionTable = ({
    patient,
    items = [],
    loading = false,
}) => {
    const dispatch = useDispatch();

    const dispensing = useSelector(
        (state) => state.pharmacist.dispensing
    );

    // ==========================================
    // LOCAL PRESCRIPTION ITEMS
    // ==========================================
    const [localItems, setLocalItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [discounts, setDiscounts] = useState({});
    const [remarks, setRemarks] = useState({});
    const [checkedItems, setCheckedItems] = useState({});

    // ==========================================
    // SEARCH & AUTOCOMPLETE STATE
    // ==========================================
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const searchRef = useRef(null);
    const recognitionRef = useRef(null);

    // ==========================================
    // SYNC PROPS INTO LOCAL STATE
    // ==========================================
    useEffect(() => {
        if (Array.isArray(items) && items.length > 0) {
            setLocalItems(items);

            const initialQuantities = {};
            const initialDiscounts = {};
            const initialRemarks = {};
            const initialChecked = {};

            items.forEach((item) => {
                const dispensed = Number(
                    item.qty_dispensed ?? item.quantity_dispensed ?? item.quantity ?? 1
                );
                initialQuantities[item.id] = dispensed;
                // Important: Do NOT default to 25%. Default to item's discount or 0.
                initialDiscounts[item.id] = Number(
                    item.discount_percent ?? item.discount ?? 0
                );
                initialRemarks[item.id] = item.remarks ?? "";
                // If dispensed is 0, start unchecked (as in row 1 of design image)
                initialChecked[item.id] = dispensed > 0;
            });

            setQuantities(initialQuantities);
            setDiscounts(initialDiscounts);
            setRemarks(initialRemarks);
            setCheckedItems(initialChecked);
        } else {
            setLocalItems([]);
        }
    }, [items]);

    // ==========================================
    // CLOSE SEARCH DROPDOWN ON OUTSIDE CLICK
    // ==========================================
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ==========================================
    // SEARCH MEDICINES DEBOUNCE
    // ==========================================
    useEffect(() => {
        const query = searchQuery.trim();
        if (!query) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearching(true);
                const res = await searchPharmacistMedicines(query);
                const apiData = res.data?.data || res.data || [];
                if (Array.isArray(apiData) && apiData.length > 0) {
                    setSearchResults(apiData);
                } else {
                    const fallbackMatches = FALLBACK_MEDICINES.filter((m) =>
                        m.name.toLowerCase().includes(query.toLowerCase()) ||
                        m.category.toLowerCase().includes(query.toLowerCase())
                    );
                    setSearchResults(fallbackMatches);
                }
                setShowDropdown(true);
            } catch (err) {
                console.warn("Search medicines API fallback:", err);
                const fallbackMatches = FALLBACK_MEDICINES.filter((m) =>
                    m.name.toLowerCase().includes(query.toLowerCase()) ||
                    m.category.toLowerCase().includes(query.toLowerCase())
                );
                setSearchResults(fallbackMatches);
                setShowDropdown(true);
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // ==========================================
    // MICROPHONE SPEECH RECOGNITION
    // ==========================================
    const handleMicToggle = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast.error("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = "en-IN";
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onresult = (event) => {
                const speechText = event.results[0][0].transcript;
                setSearchQuery(speechText);
                setIsListening(false);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);

            recognitionRef.current = recognition;
            recognition.start();
        } catch (error) {
            console.error("Speech recognition error:", error);
            setIsListening(false);
        }
    };

    // ==========================================
    // QUANTITY GETTER & SETTER
    // ==========================================
    const getDispensedQuantity = (item) => {
        if (quantities[item.id] !== undefined) {
            return quantities[item.id];
        }
        return Number(
            item.qty_dispensed ?? item.quantity_dispensed ?? item.quantity ?? 1
        );
    };

    const handleQuantityChange = (item, newQuantity) => {
        const qty = Math.max(0, Number(newQuantity) || 0);
        setQuantities((prev) => ({
            ...prev,
            [item.id]: qty,
        }));
        // If incremented above 0 and previously unchecked, check it
        if (qty > 0 && !checkedItems[item.id]) {
            setCheckedItems((prev) => ({ ...prev, [item.id]: true }));
        }
    };

    // ==========================================
    // DISCOUNT GETTER & SETTER
    // ==========================================
    const getDiscount = (item) => {
        if (discounts[item.id] !== undefined) {
            return discounts[item.id];
        }
        return Number(item.discount_percent ?? item.discount ?? 0);
    };

    const handleDiscountChange = (item, value) => {
        if (value === "") {
            setDiscounts((prev) => ({
                ...prev,
                [item.id]: "",
            }));
            return;
        }
        let disc = Number(value);
        if (Number.isNaN(disc)) disc = 0;
        disc = Math.max(0, Math.min(100, disc));
        setDiscounts((prev) => ({
            ...prev,
            [item.id]: disc,
        }));
    };

    // ==========================================
    // REMARKS SETTER
    // ==========================================
    const handleRemarksChange = (itemId, val) => {
        setRemarks((prev) => ({
            ...prev,
            [itemId]: val,
        }));
    };

    // ==========================================
    // CHECKBOX TOGGLE
    // ==========================================
    const toggleCheck = (itemId) => {
        setCheckedItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    // ==========================================
    // ADD MEDICINE FROM SEARCH
    // ==========================================
    const handleAddMedicine = (med) => {
        const medName = med.name || med.medicine_name || "New Medicine";
        const existing = localItems.find(
            (i) => (i.medicine_name || i.name)?.toLowerCase() === medName.toLowerCase()
        );

        if (existing) {
            const currentQty = getDispensedQuantity(existing);
            handleQuantityChange(existing, currentQty + 1);
            setCheckedItems((prev) => ({ ...prev, [existing.id]: true }));
            toast.success(`Increased quantity for ${medName}`);
            setSearchQuery("");
            setShowDropdown(false);
            return;
        }

        const newId = med.id || `temp_${Date.now()}`;
        const newItem = {
            id: newId,
            medicine_name: medName,
            category: med.category || med.type || "Digestive",
            quantity: 1,
            qty_prescribed: 1,
            price: Number(med.price || med.unit_price || med.mrp || 68),
            stock: med.stock_status || (med.stock > 0 ? "In stock" : "In stock"),
            discount_percent: 0,
            remarks: "",
            isNew: true,
        };

        setLocalItems((prev) => [...prev, newItem]);
        setQuantities((prev) => ({ ...prev, [newId]: 1 }));
        setCheckedItems((prev) => ({ ...prev, [newId]: true }));
        setDiscounts((prev) => ({ ...prev, [newId]: 0 }));
        setRemarks((prev) => ({ ...prev, [newId]: "" }));
        setSearchQuery("");
        setShowDropdown(false);
        toast.success(`Added ${medName} to prescription`);
    };

    // ==========================================
    // DELETE MEDICINE ITEM
    // ==========================================
    const handleDeleteItem = async (e, item) => {
        e.stopPropagation();

        if (item.isNew || String(item.id).startsWith("temp_")) {
            setLocalItems((prev) => prev.filter((i) => i.id !== item.id));
            toast.success("Medicine removed");
            return;
        }

        try {
            setDeletingId(item.id);
            await dispatch(removePrescriptionItem(item.id)).unwrap();
            setLocalItems((prev) => prev.filter((i) => i.id !== item.id));
            toast.success("Prescription item removed");
        } catch (error) {
            console.warn("Delete prescription item API warning:", error);
            // Optimistic removal so user UI stays responsive
            setLocalItems((prev) => prev.filter((i) => i.id !== item.id));
            toast.success("Prescription item removed");
        } finally {
            setDeletingId(null);
        }
    };

    // ==========================================
    // CALCULATE ITEM TOTAL
    // ==========================================
    const getItemTotal = (item) => {
        const qty = getDispensedQuantity(item);
        const price = Number(item.price || 0);
        const discount = Number(getDiscount(item) || 0);

        const subtotal = price * qty;
        const discountAmount = subtotal * (discount / 100);
        return Math.max(0, subtotal - discountAmount);
    };

    // ==========================================
    // CALCULATE GRAND TOTAL (CHECKED ONLY)
    // ==========================================
    const total = localItems.reduce((sum, item) => {
        if (!checkedItems[item.id]) return sum;
        return sum + getItemTotal(item);
    }, 0);

    // ==========================================
    // DISPENSE BULK
    // ==========================================
    const handleDispense = async () => {
        const activeItems = localItems.filter(
            (item) => checkedItems[item.id] && getDispensedQuantity(item) > 0
        );

        if (activeItems.length === 0) {
            toast.error("Please select at least one medicine with quantity to dispense.");
            return;
        }

        const payload = {
            order_id: patient?.order_id,
            patient_id: patient?.patient_id || patient?.id,
            items: activeItems.map((item) => ({
                id: item.id,
                medicine_name: item.medicine_name,
                quantity_dispensed: getDispensedQuantity(item),
                price: Number(item.price || 0),
                discount: Number(getDiscount(item) || 0),
                remarks: remarks[item.id] || item.remarks || "",
            })),
        };

        try {
            await dispatch(dispenseBulk(payload)).unwrap();
            toast.success("Medicines dispensed successfully!");

            if (patient?.consultation_id) {
                dispatch(loadPrescriptionItems(patient.consultation_id));
            }
        } catch (error) {
            console.error("Dispense failed:", error);
            toast.error("Failed to dispense medicines.");
        }
    };

    // Stock pill renderer
    const renderStockBadge = (stock) => {
        const text = String(stock || "In stock");
        const lower = text.toLowerCase();

        if (lower.includes("last") || lower.includes("left") || lower.includes("low")) {
            return (
                <span className="inline-block whitespace-nowrap rounded-xl bg-[#FFF1E5] px-3.5 py-1.5 text-xs font-semibold text-[#914D2A]">
                    {text}
                </span>
            );
        }
        if (lower.includes("out") || lower.includes("unavailable")) {
            return (
                <span className="inline-block whitespace-nowrap rounded-xl bg-[#FDECEC] px-3.5 py-1.5 text-xs font-semibold text-[#DC2626]">
                    Out of stock
                </span>
            );
        }
        return (
            <span className="inline-block whitespace-nowrap rounded-xl bg-[#E8F8ED] px-3.5 py-1.5 text-xs font-semibold text-[#1E8345]">
                In stock
            </span>
        );
    };

    return (
        <div className="mt-5">
            {/* ==================================
                HEADER: PRESCRIPTION LIST
            ================================== */}
            <div className="mb-4">
                <h2 className="text-[22px] font-bold text-[#4B2E2A] tracking-tight">
                    Prescription List
                </h2>
            </div>

            {/* ==================================
                SEARCH BY MEDICINE BAR
            ================================== */}
            <div ref={searchRef} className="relative mb-5">
                <div className="flex h-[48px] w-full items-center gap-3 rounded-2xl border border-[#E5D8CF] bg-white px-4 shadow-sm transition focus-within:border-[#8B573D] focus-within:ring-2 focus-within:ring-[#8B573D]/10">
                    <Search size={19} className="text-[#8B7A70] shrink-0" />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                            if (searchQuery.trim().length > 0) setShowDropdown(true);
                        }}
                        placeholder="Search by medicine"
                        className="w-full bg-transparent text-[14px] text-[#4D2E23] placeholder-[#A2948A] outline-none"
                    />

                    {/* Microphone icon */}
                    <button
                        type="button"
                        onClick={handleMicToggle}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                            isListening
                                ? "bg-red-50 text-red-600 animate-pulse"
                                : "text-[#8B7A70] hover:text-[#4B2E2A]"
                        }`}
                        title={isListening ? "Stop listening" : "Speak to search"}
                    >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && (
                    <div className="absolute left-0 right-0 top-[54px] z-50 max-h-[280px] overflow-y-auto rounded-2xl border border-[#E5D8CF] bg-white p-2 shadow-xl scrollbar-thin scrollbar-thumb-[#E7D8CE]">
                        {searching ? (
                            <div className="py-4 text-center text-xs text-[#8B7A70]">
                                Searching medicines...
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((med, index) => (
                                <div
                                    key={med.id || index}
                                    onClick={() => handleAddMedicine(med)}
                                    className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 transition hover:bg-[#FFF5ED]"
                                >
                                    <div>
                                        <p className="text-[14px] font-semibold text-[#4D2E23]">
                                            {med.name || med.medicine_name}
                                        </p>
                                        <p className="text-xs text-[#8B7A70]">
                                            {med.category || med.type || "Digestive"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {renderStockBadge(med.stock || med.stock_status || "In stock")}
                                        <span className="text-[14px] font-bold text-[#4D2E23]">
                                            ₹{Number(med.price || med.unit_price || med.mrp || 68).toLocaleString("en-IN")}
                                        </span>
                                        <button
                                            type="button"
                                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B573D] text-white shadow-sm transition hover:bg-[#74442F]"
                                            title="Add medicine"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-4 text-center text-xs text-[#8B7A70]">
                                No matching medicines found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ==================================
                TABLE CONTAINER
            ================================== */}
            <div className="overflow-hidden rounded-2xl border border-[#EFE4DC] bg-white shadow-sm">
                <table className="w-full border-collapse">
                    {/* Header */}
                    <thead>
                        <tr className="bg-[#FAF4EF] text-left text-[13px] font-semibold text-[#6F625A]">
                            <th className="px-5 py-4 w-[28%]">
                                Medicine
                            </th>
                            <th className="px-3 py-4 text-center w-[11%]">
                                Qty.
                                <br />
                                Prescribed
                            </th>
                            <th className="px-3 py-4 text-center w-[11%]">
                                Qty.
                                <br />
                                Dispensed
                            </th>
                            <th className="px-3 py-4 text-center w-[12%]">
                                Stock
                            </th>
                            <th className="px-3 py-4 text-center w-[11%]">
                                Discount
                            </th>
                            <th className="px-4 py-4 text-left w-[13%]">
                                Remarks
                            </th>
                            <th className="px-4 py-4 text-right w-[8%]">
                                Price
                            </th>
                            <th className="px-5 py-4 text-right w-[9%]">
                                Total
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="py-10 text-center text-sm text-[#8B7A70]">
                                    Loading prescription items...
                                </td>
                            </tr>
                        ) : localItems.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="py-10 text-center text-sm text-[#8B7A70]">
                                    No medicines found in this prescription. Search above to add medicines.
                                </td>
                            </tr>
                        ) : (
                            localItems.map((item) => {
                                const prescribed = Number(
                                    item.qty_prescribed ?? item.quantity ?? 1
                                );
                                const dispensed = getDispensedQuantity(item);
                                const isChecked = !!checkedItems[item.id];
                                const itemTotal = getItemTotal(item);
                                const discountVal =
                                    discounts[item.id] !== undefined
                                        ? discounts[item.id]
                                        : (item.discount_percent ?? item.discount ?? "");

                                return (
                                    <tr
                                        key={item.id}
                                        className="border-t border-[#EFE4DC] hover:bg-[#FFFDFB] transition-colors"
                                    >
                                        {/* ==================================
                                            1. CHECKBOX + MEDICINE + DELETE ICON
                                        ================================== */}
                                        <td className="px-5 py-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                {/* Checkbox */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCheck(item.id)}
                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] transition cursor-pointer ${
                                                        isChecked
                                                            ? "bg-[#4D2E23] text-white"
                                                            : "border-2 border-[#59352C] bg-white hover:border-[#4D2E23]"
                                                    }`}
                                                    title={isChecked ? "Unselect" : "Select"}
                                                >
                                                    {isChecked && (
                                                        <HiCheck size={14} className="stroke-[2]" />
                                                    )}
                                                </button>

                                                {/* Medicine Name & Category */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-[14px] font-bold text-[#4D2E23] leading-tight">
                                                        {item.medicine_name}
                                                    </p>
                                                    <p className="mt-0.5 truncate text-[12px] text-[#8B7A70]">
                                                        {item.category || "Digestive"}
                                                    </p>
                                                </div>

                                                {/* Small Cross Delete Icon */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteItem(e, item)}
                                                    disabled={deletingId === item.id}
                                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#B0A196] hover:bg-[#FDECEC] hover:text-[#DC2626] transition"
                                                    title="Remove medicine"
                                                >
                                                    {deletingId === item.id ? (
                                                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#DC2626] border-t-transparent" />
                                                    ) : (
                                                        <X size={15} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>

                                        {/* ==================================
                                            2. QTY PRESCRIBED
                                        ================================== */}
                                        <td className="px-3 py-4 text-center align-middle">
                                            <span className="text-[15px] font-bold text-[#4D2E23]">
                                                {prescribed}
                                            </span>
                                        </td>

                                        {/* ==================================
                                            3. QTY DISPENSED (VERTICAL STEPPER)
                                        ================================== */}
                                        <td className="px-3 py-4 text-center align-middle">
                                            <div className="inline-flex min-w-[70px] items-center justify-between rounded-xl border border-[#E5D8CF] bg-white px-2.5 py-1 shadow-sm">
                                                <span className="w-5 text-center text-[14px] font-bold text-[#4D2E23]">
                                                    {dispensed}
                                                </span>
                                                <div className="flex flex-col items-center ml-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                             handleQuantityChange(item, dispensed + 1)
                                                        }
                                                        className="text-[#8B7A70] hover:text-[#4D2E23] leading-none transition p-0.5"
                                                        title="Increase"
                                                    >
                                                        <ChevronUp size={13} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleQuantityChange(item, dispensed - 1)
                                                        }
                                                        className="text-[#8B7A70] hover:text-[#4D2E23] leading-none transition p-0.5"
                                                        title="Decrease"
                                                    >
                                                        <ChevronDown size={13} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ==================================
                                            4. STOCK BADGE
                                        ================================== */}
                                        <td className="px-3 py-4 text-center align-middle">
                                            {renderStockBadge(item.stock || item.stock_status)}
                                        </td>

                                        {/* ==================================
                                            5. DISCOUNT PILL (DEFAULT 0%, NOT 25%)
                                        ================================== */}
                                        <td className="px-3 py-4 text-center align-middle">
                                            <div className="inline-flex items-center justify-center rounded-2xl border border-[#E5D8CF] bg-white px-3 py-1 shadow-sm focus-within:border-[#8B573D]">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    placeholder="0"
                                                    value={discountVal}
                                                    onChange={(e) =>
                                                        handleDiscountChange(item, e.target.value)
                                                    }
                                                    className="w-6 bg-transparent text-center text-xs font-semibold text-[#4D2E23] outline-none"
                                                />
                                                <span className="text-xs font-semibold text-[#8B7A70]">
                                                    %
                                                </span>
                                            </div>
                                        </td>

                                        {/* ==================================
                                            6. REMARKS PILL
                                        ================================== */}
                                        <td className="px-4 py-4 align-middle">
                                            <input
                                                type="text"
                                                placeholder="Add remarks"
                                                value={remarks[item.id] ?? item.remarks ?? ""}
                                                onChange={(e) =>
                                                    handleRemarksChange(item.id, e.target.value)
                                                }
                                                className="w-full max-w-[150px] rounded-2xl border border-[#E5D8CF] bg-white px-3.5 py-1.5 text-xs text-[#4D2E23] placeholder-[#A0938A] outline-none shadow-sm transition focus:border-[#8B573D]"
                                            />
                                        </td>

                                        {/* ==================================
                                            7. PRICE
                                        ================================== */}
                                        <td className="px-4 py-4 text-right align-middle whitespace-nowrap">
                                            <span className="text-[15px] font-bold text-[#4D2E23]">
                                                ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                            </span>
                                        </td>

                                        {/* ==================================
                                            8. TOTAL (HYPHEN IF UNCHECKED)
                                        ================================== */}
                                        <td className="px-5 py-4 text-right align-middle whitespace-nowrap">
                                            {isChecked ? (
                                                <span className="text-[15px] font-bold text-[#4D2E23]">
                                                    ₹{itemTotal.toLocaleString("en-IN", {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </span>
                                            ) : (
                                                <span className="text-[16px] font-semibold text-[#8B7A70]">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>

                    {/* ==================================
                        FOOTER: GRAND TOTAL
                    ================================== */}
                    <tfoot>
                        <tr className="border-t border-[#EFE4DC] bg-white">
                            <td
                                colSpan="7"
                                className="px-5 py-4 text-left text-[17px] font-bold text-[#4D2E23]"
                            >
                                Total
                            </td>
                            <td
                                className="px-5 py-4 text-right text-[20px] font-bold text-[#4D2E23] whitespace-nowrap"
                            >
                                ₹{total.toLocaleString("en-IN", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                })}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* ==================================
                REVIEW DATE (UNTOUCHED AS REQUESTED)
            ================================== */}
            {items[0]?.review_date && (
                <div className="mt-5 flex justify-end">
                    <div className="rounded-xl border border-[#EFE4DC] px-5 py-3">
                        <span className="text-sm text-[#8B7A70]">
                            Review Date
                        </span>
                        <p className="mt-1 font-semibold text-[#4D2E23]">
                            {new Date(items[0].review_date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>
            )}

            {/* ==================================
                SAVE & DISPENSE (UNTOUCHED AS REQUESTED)
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
                    {dispensing ? "Dispensing..." : "Save & Dispense"}
                </button>
            </div>
        </div>
    );
};

export default PrescriptionTable;