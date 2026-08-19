import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    HiOutlineMagnifyingGlass,
    HiOutlineMicrophone,
    HiOutlineTrash,
    HiOutlinePencilSquare,

    HiChevronDown,

    HiOutlinePlus,
    HiOutlineArrowRightOnRectangle,
    HiOutlineArrowLeft,
} from "react-icons/hi2";

import {
    loadPrescription,
    searchPrescriptionProductsThunk,
    savePrescriptionThunk,
    updatePrescriptionThunk,

} from "../../../redux/consultation/consultationThunk";

const tabletOptions = [1, 2, 3, 4, 5];

const timeOptions = [
    "Morning",
    "Afternoon",
    "Night",
];

const foodOptions = [
    "Before Food",
    "After Food",
];

const durationOptions = [
    "3 Days",
    "5 Days",
    "7 Days",
    "10 Days",
    "15 Days",
    "30 Days",
];

const Prescription = ({
    consultationId,
    patientId,
    onContinue,
    onBack,
}) => {

    const dispatch = useDispatch();

    const {
        prescription,
        prescriptionSearch,

        loading,
    } = useSelector(
        (state) => state.consultation
    );

    const [search, setSearch] = useState("");

    const [showSearch, setShowSearch] =
        useState(false);

    const [editing, setEditing] =
        useState(false);

    const [editableMedicines,
        setEditableMedicines] =
        useState([]);
    const [backupMedicines, setBackupMedicines] = useState([]);
    const [hasExistingPrescription, setHasExistingPrescription] =
        useState(false);

    // medicines removed during edit
    const [deletedMedicines, setDeletedMedicines] =
        useState([]);
    const [specialInstructions,
        setSpecialInstructions] =
        useState("");

    const [reviewDate,
        setReviewDate] =
        useState("");

    const [patientAllergies,
        setPatientAllergies] =
        useState([]);

    const [allergyInput,
        setAllergyInput] =
        useState("");

    const [dosagePopup,
        setDosagePopup] =
        useState(null);

    const [durationPopup,
        setDurationPopup] =
        useState(null);
    const parseDosage = (dosage) => {

        if (!dosage) {

            return {
                morning: 0,
                afternoon: 0,
                evening: 0,
                night: 0,
            };

        }

        const values =
            dosage
                .split("-")
                .map((value) =>
                    Number(value.trim()) || 0
                );

        return {

            morning:
                values[0] ?? 0,

            afternoon:
                values[1] ?? 0,

            evening:
                values[2] ?? 0,

            night:
                values[3] ?? 0,

        };

    };
    useEffect(() => {

        console.log(
            "🔵 Prescription changed:",
            consultationId
        );

        // ALWAYS clear previous patient UI first
        setEditableMedicines([]);
        setBackupMedicines([]);
        setDeletedMedicines([]);

        setHasExistingPrescription(false);

        setSpecialInstructions("");
        setReviewDate("");
        setPatientAllergies([]);

        setDosagePopup(null);
        setDurationPopup(null);

        setSearch("");
        setShowSearch(false);

        // Then check consultation
        if (!consultationId) {

            console.log(
                "❌ No consultationId"
            );

            return;
        }

        console.log(
            "🚀 GET prescription:",
            consultationId
        );

        dispatch(
            loadPrescription(consultationId)
        );

    }, [
        consultationId,
        dispatch
    ]);
    useEffect(() => {

        if (!prescription) {
            return;
        }

        // ========================================
        // VERY IMPORTANT
        // Make sure this prescription belongs
        // to the currently selected patient
        // ========================================

        if (
            !Array.isArray(prescription) &&
            prescription.consultation_id &&
            prescription.consultation_id !== consultationId
        ) {
            return;
        }
        const items = Array.isArray(prescription)
            ? prescription
            : prescription.items ||
            prescription.data ||
            [];

        const cloned = items.map((item) => {

            // Backend dosage:
            // "1 - 1 - 0 - 1"

            const dosageParts =
                parseDosage(item.dosage);

            const morning =
                Number(
                    item.morning ??
                    dosageParts.morning
                ) || 0;

            const afternoon =
                Number(
                    item.afternoon ??
                    dosageParts.afternoon
                ) || 0;

            const evening =
                Number(
                    item.evening ??
                    dosageParts.evening
                ) || 0;

            const night =
                Number(
                    item.night ??
                    dosageParts.night
                ) || 0;

            const dosage =
                `${morning} - ${afternoon} - ${evening} - ${night}`;

            return {
                ...item,

                id: item.id,

                product_id:
                    item.product_id,

                medicine_name:
                    item.medicine_name,

                category:
                    item.category,

                price:
                    Number(item.price) || 0,

                image_url:
                    item.image_url,

                morning,
                afternoon,
                evening,
                night,

                dosage,

                food:
                    item.food || "Before Food",

                duration:
                    item.duration || "30 Days",

                quantity:
                    Number(item.quantity) || 1,

                frequency:
                    item.frequency ?? null,

                timeOfDay:
                    item.time_of_day || [],
            };
        });

        setEditableMedicines(
            JSON.parse(
                JSON.stringify(cloned)
            )
        );

        setBackupMedicines(
            JSON.parse(
                JSON.stringify(cloned)
            )
        );

        setDeletedMedicines([]);

        setHasExistingPrescription(
            cloned.length > 0
        );

        setSpecialInstructions(
            prescription.special_instructions ||
            prescription.specialInstructions ||
            items[0]?.special_instructions ||
            ""
        );

        setReviewDate(
            prescription.review_date ||
            prescription.reviewDate ||
            items[0]?.review_date ||
            ""
        );

        setPatientAllergies(
            items[0]?.patient_allergies || []
        );

    }, [
        prescription,
        consultationId
    ]);


    useEffect(() => {

        if (search.trim().length < 2) {

            setShowSearch(false);

            return;

        }

        const timer = setTimeout(() => {

            dispatch(
                searchPrescriptionProductsThunk(search)
            );

            setShowSearch(true);

        }, 400);

        return () => clearTimeout(timer);

    }, [search]);


    const addMedicine = (medicine) => {

        const exists =
            editableMedicines.find(
                (item) =>
                    item.product_id === medicine.id
            );

        if (exists) return;

        setEditableMedicines((prev) => [

            ...prev,

            {
                product_id: medicine.id,

                medicine_name: medicine.name,

                category: medicine.category,

                image_url: medicine.image_url,

                price: Number(medicine.unit_rate),

                quantity: 1,

                morning: 1,
                afternoon: 0,
                evening: 0,
                night: 0,

                dosage: "1 - 0 - 0 - 0",

                frequency: null,

                duration: "30 Days",

                food: "Before Food",
            },

        ]);

        setSearch("");

        setShowSearch(false);

    };

    const removeMedicine = (index) => {

        const medicine =
            editableMedicines[index];

        // Track removed medicines that already exist in DB
        if (medicine.id) {

            setDeletedMedicines(prev => [
                ...prev,
                medicine,
            ]);

        }

        setEditableMedicines(prev =>
            prev.filter((_, i) => i !== index)
        );

    };

    const updateMedicine = (
        index,
        key,
        value
    ) => {

        setEditableMedicines((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [key]: value,
                    }
                    : item
            )
        );

    };

    const toggleTime = (
        index,
        value
    ) => {

        const medicine =
            editableMedicines[index];

        let times =
            medicine.timeOfDay || [];

        if (times.includes(value)) {

            times = times.filter(
                (x) => x !== value
            );

        } else {

            times = [...times, value];

        }

        updateMedicine(
            index,
            "timeOfDay",
            times
        );

    };
    console.log("consultationId prop:", consultationId);
    const handleSaveAndContinue = async () => {
        try {

            const payload = {
                consultation_id: consultationId,

                special_instructions:
                    specialInstructions,

                review_date:
                    reviewDate,

                patient_allergies:
                    patientAllergies,

                items: editableMedicines.map((item) => {

                    const morning =
                        Number(item.morning) || 0;

                    const afternoon =
                        Number(item.afternoon) || 0;

                    const evening =
                        Number(item.evening) || 0;

                    const night =
                        Number(item.night) || 0;

                    const dosage =
                        `${morning} - ${afternoon} - ${evening} - ${night}`;

                    return {
                        product_id:
                            item.product_id,

                        medicine_name:
                            item.medicine_name,

                        category:
                            item.category,

                        price:
                            Number(item.price) || 0,

                        morning,

                        afternoon,

                        evening,

                        night,

                        dosage,

                        food:
                            item.food || "Before Food",

                        duration:
                            item.duration,

                        quantity:
                            Number(item.quantity) || 1,
                    };
                }),
            };

            console.log(
                "Prescription payload:",
                payload
            );

            if (hasExistingPrescription) {

                await dispatch(
                    updatePrescriptionThunk({
                        prescriptionId:
                            consultationId,

                        payload,
                    })
                ).unwrap();

            } else {

                await dispatch(
                    savePrescriptionThunk(
                        payload
                    )
                ).unwrap();

            }

            // Reload latest prescription
            await dispatch(
                loadPrescription(
                    consultationId
                )
            );

            setEditing(false);

            // Go to next section
            onContinue?.();

        } catch (error) {

            console.error(
                "Failed to save prescription:",
                error
            );

        }
    };
    const total = useMemo(() => {

        return editableMedicines.reduce(

            (sum, item) =>

                sum +
                Number(item.price) *
                Number(item.quantity),

            0

        );

    }, [editableMedicines]);

    return (
        <div className="mt-6 space-y-8">

            {/* Header */}

            <div>

                <h2 className="text-[30px] font-bold text-[#4D2E23]">
                    Prescription
                </h2>

                <p className="mt-1 text-[17px] text-[#786A61]">
                    Add and manage prescriptions
                </p>

            </div>

            {/* Search */}

            <div className="relative">

                <div className="flex h-[64px] items-center rounded-2xl border border-[#E8DDD5] bg-white px-5">

                    <HiOutlineMagnifyingGlass
                        size={22}
                        className="text-[#4D2E23]"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search medicine..."
                        className="ml-4 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#9A918B]"
                    />

                    <HiOutlineMicrophone
                        size={20}
                        className="text-[#4D2E23]"
                    />

                </div>

                {/* Dropdown */}

                {/* Dropdown */}
                {showSearch && prescriptionSearch.length > 0 && (
                    <div
                        className="
            absolute
            left-0
            right-0
            top-[68px]
            z-50
            max-h-[280px]
            overflow-y-auto
            rounded-2xl
            border
            border-[#E7DBD3]
            bg-white
            shadow-xl
            hide-scrollbar
        "
                    >
                        {prescriptionSearch.map((medicine) => (
                            <button
                                key={medicine.id}
                                type="button"
                                onClick={() => addMedicine(medicine)}
                                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    border-b
                    border-[#F2E8E2]
                    px-4
                    py-3
                    text-left
                    transition
                    last:border-b-0
                    hover:bg-[#FFF8F4]
                "
                            >
                                {/* Left */}
                                <div className="flex min-w-0 items-center gap-3">

                                    <img
                                        src={medicine.image_url}
                                        alt=""
                                        className="
                            h-11
                            w-11
                            flex-shrink-0
                            rounded-xl
                            border
                            border-[#EEE3DB]
                            object-cover
                        "
                                    />

                                    <div className="min-w-0">

                                        <h3 className="
                            truncate
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                        ">
                                            {medicine.name}
                                        </h3>

                                        <p className="
                            mt-0.5
                            text-xs
                            text-[#8D8D8D]
                        ">
                                            {medicine.category}
                                        </p>

                                    </div>

                                </div>

                                {/* Right */}
                                <div className="
                    ml-4
                    flex
                    flex-shrink-0
                    items-center
                    gap-3
                ">

                                    <span className="
                        rounded-full
                        bg-[#EAF9EC]
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        text-[#317C4A]
                    ">
                                        In Stock
                                    </span>

                                    <span className="
                        min-w-[55px]
                        text-right
                        text-[16px]
                        font-bold
                        text-[#4D2E23]
                    ">
                                        ₹{Number(
                                            medicine.unit_rate
                                        ).toFixed(0)}
                                    </span>

                                </div>

                            </button>
                        ))}
                    </div>
                )}

            </div>

            {/* Header */}

            <div className="flex items-center justify-between">

                <h2 className="text-[30px] font-bold text-[#4D2E23]">
                    Prescription List
                </h2>

                <button

                    onClick={() => {
                        if (!editing) {
                            setBackupMedicines(
                                JSON.parse(JSON.stringify(editableMedicines))
                            );
                            setEditing(true);
                        } else {
                            setEditableMedicines(
                                JSON.parse(JSON.stringify(backupMedicines))
                            );
                            setEditing(false);
                        }
                    }}
                    className={`flex items-center gap-2 text-[15px] font-semibold${hasExistingPrescription
                        ? "text-[#4D2E23]"
                        : "text-gray-400 cursor-not-allowed"}
`}
                >
                    <HiOutlinePencilSquare size={18} />
                    {editing ? "Cancel" : "Edit"}
                </button>

            </div>

            {/* Medicine Cards */}

            <div className="overflow-hidden rounded-[28px] border border-[#E7DBD3] bg-white">

                {editableMedicines.length === 0 && (

                    <div className="flex h-[220px] flex-col items-center justify-center">

                        <h3 className="text-xl font-semibold text-[#4D2E23]">
                            No medicines added
                        </h3>

                        <p className="mt-2 text-[#8D8D8D]">
                            Search medicines above to create a prescription.
                        </p>

                    </div>

                )}
                {editableMedicines.map(
                    (medicine, index) => (

                        <div
                            key={
                                medicine.id ??
                                medicine.product_id ??
                                index
                            }
                            className="border-b border-[#ECE2DA] p-7 last:border-b-0"
                        >

                            {/* Top */}

                            <div className="flex items-start justify-between">

                                <div className="flex gap-5">

                                    <img
                                        src={medicine.image_url}
                                        alt=""
                                        className="h-20 w-20 rounded-3xl bg-[#F7EFE8] object-cover"
                                    />

                                    <div>

                                        <h2 className="text-[22px] font-bold text-[#4D2E23]">
                                            {medicine.medicine_name}
                                        </h2>

                                        <p className="mt-2 text-[#7E7E7E]">
                                            {medicine.category}
                                        </p>

                                    </div>

                                </div>

                                <div className="text-right">

                                    <div className="rounded-full bg-[#E8F8EA] px-4 py-1 text-xs font-medium text-[#2E7A46]">
                                        In Stock
                                    </div>

                                    <h2 className="mt-3 text-[24px] font-bold text-[#4D2E23]">
                                        ₹{Number(
                                            medicine.price
                                        ).toFixed(2)}
                                    </h2>

                                </div>

                            </div>

                            <div className="my-6 border-t border-[#EFE4DD]" />

                            {/* Details */}

                            <div className="flex items-start justify-between">

                                <div className="flex-1 space-y-6">
                                    {/* Dosage */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wider text-[#B09C8F]">
                                            Dosage
                                        </p>

                                        {editing ? (

                                            <button
                                                onClick={() => setDosagePopup(index)}
                                                className="mt-2 flex items-center gap-2 rounded-xl border border-[#E7DBD3] bg-[#FFF8F4] px-4 py-3 font-medium text-[#4D2E23]"
                                            >

                                                <p className="
                                                  mt-2
                                                  text-[16px]
                                                  font-medium
                                                  text-[#4D2E23]
                                              ">

                                                    {medicine.dosage || "0 - 0 - 0 - 0"}

                                                    {" • "}

                                                    {medicine.food || "Before Food"}

                                                </p>

                                                <HiChevronDown size={18} />

                                            </button>

                                        ) : (

                                            <p className="mt-2 text-[16px] font-medium text-[#4D2E23]">

                                                {medicine.dosage} •{" "}
                                                {(medicine.timeOfDay || []).join(", ")}
                                                {medicine.food}

                                            </p>

                                        )}

                                    </div>

                                    {/* Duration */}

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wider text-[#B09C8F]">
                                            Duration
                                        </p>

                                        {editing ? (

                                            <button
                                                onClick={() => setDurationPopup(index)}
                                                className="mt-2 flex items-center gap-2 rounded-xl border border-[#E7DBD3] bg-[#FFF8F4] px-4 py-3 font-medium text-[#4D2E23]"
                                            >

                                                {medicine.duration}

                                                <HiChevronDown size={18} />

                                            </button>

                                        ) : (

                                            <p className="mt-2 text-[16px] font-medium text-[#4D2E23]">
                                                {medicine.duration}
                                            </p>

                                        )}

                                    </div>

                                </div>

                                {/* Right */}

                              

                            </div>

                            {/* DOSAGE POPUP */}

                            {/* ==========================================
    DOSAGE POPUP
========================================== */}

                            {dosagePopup === index && (

                                <div
                                    className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-sm
        "
                                >

                                    <div
                                        className="
                w-[520px]
                rounded-[32px]
                bg-white
                p-8
                shadow-2xl
            "
                                    >

                                        {/* ================================= */}
                                        {/* HEADER */}
                                        {/* ================================= */}

                                        <h2 className="
                text-[28px]
                font-bold
                text-[#4D2E23]
            ">
                                            Dosage
                                        </h2>

                                        <p className="
                mt-2
                text-[#85766D]
            ">
                                            Select dosage for each session
                                        </p>


                                        {/* ================================= */}
                                        {/* MORNING */}
                                        {/* ================================= */}

                                        <div className="mt-8">

                                            <p className="
                    mb-3
                    font-semibold
                    text-[#4D2E23]
                ">
                                                Morning
                                            </p>

                                            <div className="
                    flex
                    gap-3
                ">

                                                {[0, 1, 2].map(
                                                    (value) => (

                                                        <button
                                                            key={value}
                                                            type="button"

                                                            onClick={() =>
                                                                updateMedicine(
                                                                    index,
                                                                    "morning",
                                                                    value
                                                                )
                                                            }

                                                            className={`
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    font-semibold
                                    transition

                                    ${Number(
                                                                medicine.morning
                                                            ) === value

                                                                    ? `
                                                border-[#8A563B]
                                                bg-[#8A563B]
                                                text-white
                                            `

                                                                    : `
                                                border-[#DDD]
                                                bg-white
                                                text-[#4D2E23]
                                            `
                                                                }
                                `}
                                                        >
                                                            {value}
                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* ================================= */}
                                        {/* AFTERNOON */}
                                        {/* ================================= */}

                                        <div className="mt-6">

                                            <p className="
                    mb-3
                    font-semibold
                    text-[#4D2E23]
                ">
                                                Afternoon
                                            </p>

                                            <div className="
                    flex
                    gap-3
                ">

                                                {[0, 1, 2].map(
                                                    (value) => (

                                                        <button
                                                            key={value}
                                                            type="button"

                                                            onClick={() =>
                                                                updateMedicine(
                                                                    index,
                                                                    "afternoon",
                                                                    value
                                                                )
                                                            }

                                                            className={`
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    font-semibold
                                    transition

                                    ${Number(
                                                                medicine.afternoon
                                                            ) === value

                                                                    ? `
                                                border-[#8A563B]
                                                bg-[#8A563B]
                                                text-white
                                            `

                                                                    : `
                                                border-[#DDD]
                                                bg-white
                                                text-[#4D2E23]
                                            `
                                                                }
                                `}
                                                        >
                                                            {value}
                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* ================================= */}
                                        {/* EVENING */}
                                        {/* ================================= */}

                                        <div className="mt-6">

                                            <p className="
                    mb-3
                    font-semibold
                    text-[#4D2E23]
                ">
                                                Evening
                                            </p>

                                            <div className="
                    flex
                    gap-3
                ">

                                                {[0, 1, 2].map(
                                                    (value) => (

                                                        <button
                                                            key={value}
                                                            type="button"

                                                            onClick={() =>
                                                                updateMedicine(
                                                                    index,
                                                                    "evening",
                                                                    value
                                                                )
                                                            }

                                                            className={`
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    font-semibold
                                    transition

                                    ${Number(
                                                                medicine.evening
                                                            ) === value

                                                                    ? `
                                                border-[#8A563B]
                                                bg-[#8A563B]
                                                text-white
                                            `

                                                                    : `
                                                border-[#DDD]
                                                bg-white
                                                text-[#4D2E23]
                                            `
                                                                }
                                `}
                                                        >
                                                            {value}
                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* ================================= */}
                                        {/* NIGHT */}
                                        {/* ================================= */}

                                        <div className="mt-6">

                                            <p className="
                    mb-3
                    font-semibold
                    text-[#4D2E23]
                ">
                                                Night
                                            </p>

                                            <div className="
                    flex
                    gap-3
                ">

                                                {[0, 1, 2].map(
                                                    (value) => (

                                                        <button
                                                            key={value}
                                                            type="button"

                                                            onClick={() =>
                                                                updateMedicine(
                                                                    index,
                                                                    "night",
                                                                    value
                                                                )
                                                            }

                                                            className={`
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    font-semibold
                                    transition

                                    ${Number(
                                                                medicine.night
                                                            ) === value

                                                                    ? `
                                                border-[#8A563B]
                                                bg-[#8A563B]
                                                text-white
                                            `

                                                                    : `
                                                border-[#DDD]
                                                bg-white
                                                text-[#4D2E23]
                                            `
                                                                }
                                `}
                                                        >
                                                            {value}
                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* ================================= */}
                                        {/* FOOD */}
                                        {/* ================================= */}

                                        <div className="mt-8">

                                            <p className="
                    mb-3
                    font-semibold
                    text-[#4D2E23]
                ">
                                                Food
                                            </p>

                                            <div className="
                    flex
                    gap-3
                ">

                                                {[
                                                    "Before Food",
                                                    "After Food",
                                                ].map(
                                                    (food) => (

                                                        <button
                                                            key={food}
                                                            type="button"

                                                            onClick={() =>
                                                                updateMedicine(
                                                                    index,
                                                                    "food",
                                                                    food
                                                                )
                                                            }

                                                            className={`
                                    rounded-full
                                    border
                                    px-5
                                    py-2
                                    transition

                                    ${medicine.food === food

                                                                    ? `
                                                border-[#8A563B]
                                                bg-[#8A563B]
                                                text-white
                                            `

                                                                    : `
                                                border-[#DDD]
                                                bg-white
                                                text-[#4D2E23]
                                            `
                                                                }
                                `}
                                                        >
                                                            {food}
                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* ================================= */}
                                        {/* SAVE */}
                                        {/* ================================= */}

                                        <button
                                            type="button"

                                            onClick={() => {

                                                const dosage =
                                                    `${medicine.morning} - ` +
                                                    `${medicine.afternoon} - ` +
                                                    `${medicine.evening} - ` +
                                                    `${medicine.night}`;

                                                updateMedicine(
                                                    index,
                                                    "dosage",
                                                    dosage
                                                );

                                                setDosagePopup(
                                                    null
                                                );

                                            }}

                                            className="
                    mt-10
                    h-14
                    w-full
                    rounded-xl
                    bg-[#8A563B]
                    font-semibold
                    text-white
                    hover:bg-[#74452E]
                "
                                        >
                                            Save
                                        </button>

                                    </div>

                                </div>

                            )}

                            {durationPopup === index && (

                                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">

                                    <div className="w-[460px] rounded-[32px] bg-white p-8 shadow-2xl">

                                        <h2 className="text-[28px] font-bold text-[#4D2E23]">
                                            Duration
                                        </h2>

                                        <p className="mt-2 text-[#85766D]">
                                            Select treatment duration
                                        </p>

                                        <div className="mt-8 grid grid-cols-2 gap-3">

                                            {durationOptions.map((item) => (

                                                <button
                                                    key={item}
                                                    onClick={() =>
                                                        updateMedicine(index, "duration", item)
                                                    }
                                                    className={`rounded-xl border p-4 font-medium transition

                                         ${medicine.duration === item
                                                            ?
                                                            "bg-[#8A563B] border-[#8A563B] text-white"
                                                            :
                                                            "border-[#DDD]"
                                                        }`}

                                                >

                                                    {item}

                                                </button>

                                            ))}

                                        </div>

                                        <button
                                            onClick={() => setDurationPopup(null)}
                                            className="mt-10 h-14 w-full rounded-xl bg-[#8A563B] text-white font-semibold hover:bg-[#74452E]"
                                        >

                                            Save

                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    ))}


                <div className="flex items-center justify-between border-t border-[#ECE2DA] px-7 py-7">

                    <h2 className="text-[28px] font-bold text-[#4D2E23]">
                        Total
                    </h2>

                    <h2 className="text-[34px] font-bold text-[#4D2E23]">

                        ₹{total.toFixed(2)}

                    </h2>

                </div>

            </div>



            <div>

                <label className="mb-3 block text-[18px] font-semibold text-[#4D2E23]">
                    Special Instructions
                </label>

                <textarea

                    rows={5}

                    value={specialInstructions}

                    onChange={(e) =>
                        setSpecialInstructions(e.target.value)
                    }

                    placeholder="Write special instructions..."

                    className="w-full rounded-[24px] border border-[#E7DBD3] bg-white p-5 outline-none focus:border-[#8A563B]"

                />

            </div>


            <div>

                <label className="mb-3 block text-[18px] font-semibold text-[#4D2E23]">
                    Review Date
                </label>

                <input
                    type="date"
                    value={
                        reviewDate
                            ? reviewDate.split("T")[0]
                            : ""
                    }
                    onChange={(e) => setReviewDate(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-[#E7DBD3] px-5 outline-none focus:border-[#8A563B]"
                />

            </div>


            <div>

                <label className="mb-3 block text-[18px] font-semibold text-[#4D2E23]">
                    Patient Allergies
                </label>

                <div className="flex gap-3">

                    <input

                        value={allergyInput}

                        onChange={(e) =>
                            setAllergyInput(e.target.value)
                        }

                        placeholder="Type allergy"

                        className="h-14 flex-1 rounded-2xl border border-[#E7DBD3] px-5 outline-none focus:border-[#8A563B]"

                    />

                    <button

                        onClick={() => {

                            if (!allergyInput.trim()) return;

                            setPatientAllergies(prev => [
                                ...prev,
                                allergyInput
                            ]);

                            setAllergyInput("");

                        }}

                        className="h-14 rounded-2xl bg-[#8A563B] px-7 text-white"

                    >

                        <HiOutlinePlus size={22} />

                    </button>

                </div>

                <div className="mt-5 flex flex-wrap gap-3">

                    {patientAllergies.map((item, index) => (

                        <div
                            key={index}
                            className="flex items-center gap-3 rounded-full border border-[#E7DBD3] bg-[#FFF8F4] px-5 py-3">

                            <span className="font-medium">

                                {item}

                            </span>

                            <button
                                onClick={() => {

                                    setPatientAllergies(
                                        patientAllergies.filter((_, i) => i !== index)
                                    );

                                }}
                                className="text-red-500 hover:text-red-700"
                            >

                                <HiOutlineTrash size={16} />

                            </button>

                        </div>

                    ))}

                </div>

            </div>



            <div className="mt-8 grid grid-cols-2 gap-5">

                {/* Back Button */}

                <button
                    type="button"
                    onClick={() => onBack?.()}
                    className="flex h-16 items-center justify-center gap-3 rounded-[22px] border border-[#DCC8BA] bg-[#FFF9F5] text-[20px] font-semibold text-[#4D2E23] transition hover:bg-[#F9F0EA]"
                >
                    <HiOutlineArrowLeft size={22} />
                    Back
                </button>

                {/* Save & Continue */}

                <button
                    type="button"
                    onClick={handleSaveAndContinue}
                    disabled={loading}
                    className="flex h-16 items-center justify-center gap-3 rounded-[22px] bg-[#8A563B] text-[20px] font-semibold text-white transition hover:bg-[#74452E] disabled:opacity-70"
                >
                    <HiOutlineArrowRightOnRectangle size={22} />

                    {loading
                        ? "Saving..."
                        : "Save & Continue"}
                </button>

            </div>

        </div>

    );

};

export default Prescription;