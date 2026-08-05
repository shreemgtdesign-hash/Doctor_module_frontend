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
    savePrescriptionNotesThunk,
    savePatientAllergiesThunk,
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
        allergies,
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

    useEffect(() => {

        if (!consultationId) return;

        dispatch(loadPrescription(consultationId));

    }, [consultationId]);

    useEffect(() => {

        const items = prescription.items || [];

        setEditableMedicines(items);

        setBackupMedicines(
            JSON.parse(JSON.stringify(items))
        );

        setSpecialInstructions(
            prescription.specialInstructions || ""
        );

        setReviewDate(
            prescription.reviewDate || ""
        );
        setPatientAllergies(
        items[0]?.patient_allergies || []
    );

    }, [prescription]);

   

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

                unit_rate: Number(
                    medicine.unit_rate
                ),

                price: Number(
                    medicine.unit_rate
                ),

                quantity: 1,

                tabletCount: 1,

                timeOfDay: ["Morning"],

                food: "Before Food",

                duration: "30 Days",
            },

        ]);

        setSearch("");

        setShowSearch(false);

    };

    const removeMedicine = (index) => {

        setEditableMedicines((prev) =>
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
    const savePrescription = async () => {
        try {
            console.log("Dispatch Payload:", {
                consultation_id: consultationId,
                items: editableMedicines,
            });

            // Save Medicines
            await dispatch(
                savePrescriptionThunk({
                    consultation_id: consultationId,
                    items: editableMedicines,
                })
            ).unwrap();

            // Save Notes
            await dispatch(
                savePrescriptionNotesThunk({
                    consultationId,
                    payload: {
                        special_instructions: specialInstructions,
                        review_date: reviewDate,
                    },
                })
            ).unwrap();

            // Save Allergies
            await dispatch(
                savePatientAllergiesThunk({
                    patientId,
                    payload: {
                        allergies: patientAllergies,
                    },
                })
            ).unwrap();

            // Reload latest prescription
            dispatch(loadPrescription(consultationId));

            setEditing(false);

            onContinue?.();

        } catch (error) {
            console.log(error);
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

                {showSearch &&
                    prescriptionSearch.length > 0 && (

                        <div className="absolute left-0 right-0 top-[72px] z-50 overflow-hidden rounded-[28px] border border-[#E7DBD3] bg-white shadow-2xl">

                            {prescriptionSearch.map((medicine) => (

                                <button
                                    key={medicine.id}
                                    onClick={() =>
                                        addMedicine(medicine)
                                    }
                                    className="flex w-full items-center justify-between border-b border-[#F2E8E2] p-5 text-left transition hover:bg-[#FFF8F4]"
                                >

                                    <div className="flex items-center gap-4">

                                        <img
                                            src={medicine.image_url}
                                            alt=""
                                            className="h-16 w-16 rounded-2xl border border-[#EEE3DB] object-cover"
                                        />

                                        <div>

                                            <h3 className="text-[17px] font-semibold text-[#4D2E23]">
                                                {medicine.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-[#8D8D8D]">
                                                {medicine.category}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <div className="rounded-full bg-[#EAF9EC] px-4 py-1 text-xs font-medium text-[#317C4A]">
                                            In Stock
                                        </div>

                                        <h2 className="mt-3 text-[26px] font-bold text-[#4D2E23]">
                                            ₹{Number(
                                                medicine.unit_rate
                                            ).toFixed(0)}
                                        </h2>

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
                    className="flex items-center gap-2 text-[15px] font-semibold text-[#4D2E23]"
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
                            key={medicine.id}
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

                                    <h2 className="mt-3 text-[34px] font-bold text-[#4D2E23]">
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

                                                {medicine.dosage} •{" "}
                                                {(medicine.timeOfDay || []).join(", ")} •{" "}
                                                {medicine.food}

                                                <HiChevronDown size={18} />

                                            </button>

                                        ) : (

                                            <p className="mt-2 text-[16px] font-medium text-[#4D2E23]">

                                                {medicine.dosage} •{" "}
                                                {(medicine.timeOfDay || []).join(", ")} •{" "}
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

                                <div className="ml-8 flex flex-col items-end justify-between">

                                    {editing ? (

                                        <div className="mt-4 flex items-center justify-end gap-3">

                                            <button
                                                onClick={() =>
                                                    updateMedicine(
                                                        index,
                                                        "quantity",
                                                        Math.max(
                                                            1,
                                                            Number(medicine.quantity) - 1
                                                        )
                                                    )
                                                }
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD]"
                                            >

                                                -

                                            </button>

                                            <span className="w-8 text-center font-semibold">

                                                {medicine.quantity}

                                            </span>

                                            <button
                                                onClick={() =>
                                                    updateMedicine(
                                                        index,
                                                        "quantity",
                                                        Number(medicine.quantity) + 1
                                                    )
                                                }
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD]"
                                            >

                                                +

                                            </button>

                                        </div>

                                    ) : (

                                        <h2 className="mt-3 text-[34px] font-bold text-[#4D2E23]">

                                            ₹{(
                                                Number(medicine.price) *
                                                Number(medicine.quantity)
                                            ).toFixed(2)}

                                        </h2>

                                    )}

                                    {editing && (

                                        <button
                                            onClick={() => removeMedicine(index)}
                                            className="mt-8 rounded-xl p-3 text-red-500 transition hover:bg-red-50"
                                        >

                                            <HiOutlineTrash size={22} />

                                        </button>

                                    )}

                                </div>

                            </div>

                            {/* DOSAGE POPUP */}

                            {dosagePopup === index && (

                                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">

                                    <div className="w-[460px] rounded-[32px] bg-white p-8 shadow-2xl">

                                        <h2 className="text-[28px] font-bold text-[#4D2E23]">
                                            Dosage
                                        </h2>

                                        <p className="mt-2 text-[#85766D]">
                                            Select dosage details
                                        </p>

                                        {/* Tablet */}

                                        <div className="mt-8">

                                            <p className="mb-3 font-semibold">
                                                Tablet Count
                                            </p>

                                            <div className="flex gap-3">

                                                {tabletOptions.map((item) => (

                                                    <button
                                                        key={item}
                                                        onClick={() =>
                                                            updateMedicine(index, "tabletCount", item)
                                                        }
                                                        className={`h-12 w-12 rounded-xl border transition

                                                            ${medicine.tabletCount === item
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

                                        </div>

                                        {/* Time */}

                                        <div className="mt-8">

                                            <p className="mb-3 font-semibold">
                                                Time
                                            </p>

                                            <div className="flex flex-wrap gap-3">

                                                {timeOptions.map((item) => (

                                                    <button
                                                        key={item}
                                                        onClick={() =>
                                                            toggleTime(index, item)
                                                        }
                                                        className={`rounded-full px-5 py-2 border transition

                                                  ${medicine.timeOfDay?.includes(item)
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

                                        </div>

                                        {/* Food */}

                                        <div className="mt-8">

                                            <p className="mb-3 font-semibold">
                                                Food
                                            </p>

                                            <div className="flex gap-3">

                                                {foodOptions.map((item) => (

                                                    <button
                                                        key={item}
                                                        onClick={() =>
                                                            updateMedicine(index, "food", item)
                                                        }
                                                        className={`rounded-full px-5 py-2 border transition

${medicine.food === item
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

                                        </div>

                                        <button
                                            onClick={() => {
                                                updateMedicine(
                                                    index,
                                                    "dosage",
                                                    `${medicine.tabletCount} tablet${medicine.tabletCount > 1 ? "s" : ""}`
                                                );

                                                setDosagePopup(null);
                                            }}
                                            className="mt-10 h-14 w-full rounded-xl bg-[#8A563B] font-semibold text-white hover:bg-[#74452E]"
                                        >
                                            Save
                                        </button>

                                    </div>

                                </div>

                            )}
                            {/* ============================
   Duration Popup
============================ */}

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
                            key={`${item.id}`}
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
                    onClick={savePrescription}
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