import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
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
    loadChiefComplaints,
    searchPrescriptionProductsThunk,
    savePrescriptionThunk,
    updatePrescriptionThunk,
    loadAssociateDoctors,

} from "../../../redux/consultation/consultationThunk";
import ConsultationTimer from "../components/ConsultationTimer";



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
    onContinue,
    consultationTimerStarted,
    consultationTimeLeft,
    appointment,
    onBack,
}) => {

    const dispatch = useDispatch();
    const [openDoctorDropdown, setOpenDoctorDropdown] = useState(null);
    const {
        prescription,
        prescriptionSearch,
        chiefComplaints,
        loading,
        associateDoctors = [],
    } = useSelector(
        (state) => state.consultation
    );
    const activeConsultationId =
        consultationId ||
        appointment ||
        prescription?.consultation_id;
    const prescriptionConsultationRef = useRef(null);
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
        "🔵 Prescription consultation changed:",
        activeConsultationId
    );

    // Mark the new consultation immediately.
    // This prevents the old prescription from being
    // processed for the new patient.
    prescriptionConsultationRef.current = activeConsultationId;

    // ALWAYS clear previous patient UI first
    setEditableMedicines([]);
    setBackupMedicines([]);
    setDeletedMedicines([]);

    setHasExistingPrescription(false);

    setSpecialInstructions("");
    setReviewDate("");
    setPatientAllergies([]);



    setSearch("");
    setShowSearch(false);

    // No consultation
    if (!activeConsultationId) {
        console.log("❌ No consultationId");
        return;
    }

    console.log(
        "🚀 GET prescription:",
        activeConsultationId
    );

    dispatch(
        loadPrescription(activeConsultationId)
    );

}, [
    activeConsultationId,
    dispatch
]);
    useEffect(() => {

    console.log(
        "🟣 Prescription response changed:",
        {
            consultationId: activeConsultationId,
            prescription,
        }
    );

    // No consultation selected
    if (!activeConsultationId) {
        setEditableMedicines([]);
        setBackupMedicines([]);
        setHasExistingPrescription(false);
        setSpecialInstructions("");
        setReviewDate("");
        setPatientAllergies([]);

        return;
    }

    // IMPORTANT:
    // If this prescription doesn't exist yet,
    // this patient has no prescription.
    if (!prescription) {

        console.log(
            "📭 No prescription for:",
            activeConsultationId
        );

        setEditableMedicines([]);
        setBackupMedicines([]);
        setDeletedMedicines([]);

        setHasExistingPrescription(false);

        setSpecialInstructions("");
        setReviewDate("");
        setPatientAllergies([]);

        return;
    }

    const items = Array.isArray(prescription)
        ? prescription
        : Array.isArray(prescription?.data)
            ? prescription.data
            : Array.isArray(prescription?.items)
                ? prescription.items
                : [];

    // API returned no prescription items
    if (items.length === 0) {

        console.log(
            "📭 Prescription is empty for:",
            activeConsultationId
        );

        setEditableMedicines([]);
        setBackupMedicines([]);
        setDeletedMedicines([]);

        setHasExistingPrescription(false);

        setSpecialInstructions("");
        setReviewDate("");

        return;
    }

    const cloned = items.map((item) => {

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

            dosage:
                `${morning} - ${afternoon} - ${evening} - ${night}`,

            food:
                item.food || "Before Food",

            duration:
                item.duration || "30 Days",

            quantity:
                Number(item.quantity) || 1,

            frequency:
                item.frequency ?? null,
        };
    });

    console.log(
        "✅ Setting prescription for:",
        activeConsultationId,
        cloned
    );

    setEditableMedicines(
        JSON.parse(JSON.stringify(cloned))
    );

    setBackupMedicines(
        JSON.parse(JSON.stringify(cloned))
    );

    setDeletedMedicines([]);

    setHasExistingPrescription(
        cloned.length > 0
    );

    setSpecialInstructions(
        prescription?.special_instructions ||
        prescription?.specialInstructions ||
        items[0]?.special_instructions ||
        ""
    );

    setReviewDate(
        prescription?.review_date ||
        prescription?.reviewDate ||
        items[0]?.review_date ||
        ""
    );

    const prescriptionAllergies =
        items.find(
            (item) =>
                Array.isArray(
                    item.patient_allergies
                ) &&
                item.patient_allergies.length > 0
        )?.patient_allergies || [];

    if (
        !chiefComplaints?.allergies?.length &&
        !chiefComplaints?.allergies_conditions?.length
    ) {
        setPatientAllergies(
            prescriptionAllergies
        );
    }

}, [
    prescription,
    chiefComplaints,
    activeConsultationId
]);
    useEffect(() => {

        const savedChiefComplaintAllergies =
            chiefComplaints?.allergies ??
            chiefComplaints?.allergies_conditions ??
            [];

        let formattedChiefComplaintAllergies = [];

        if (Array.isArray(savedChiefComplaintAllergies)) {

            formattedChiefComplaintAllergies =
                savedChiefComplaintAllergies
                    .filter(Boolean);

        } else if (
            typeof savedChiefComplaintAllergies === "string" &&
            savedChiefComplaintAllergies.trim()
        ) {

            formattedChiefComplaintAllergies =
                savedChiefComplaintAllergies
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
        }

        if (formattedChiefComplaintAllergies.length > 0) {

            // Chief Complaints allergies
            // should be displayed in Prescription

            setPatientAllergies(
                formattedChiefComplaintAllergies
            );

        }

    }, [chiefComplaints]);
    useEffect(() => {

        if (!appointment) return;

        dispatch(
            loadChiefComplaints(
                appointment
            )
        );

    }, [
        appointment,
        dispatch,
    ]);





    // ========================================
    // LOAD DOCTORS FOR SELECT DOCTOR
    // ========================================

    // ========================================
// LOAD ASSOCIATED DOCTORS FOR SELECT DOCTOR
// ========================================

useEffect(() => {
    if (!appointment) return;

    dispatch(
        loadAssociateDoctors(appointment)
    );
}, [appointment, dispatch]);

    // ========================================
    // SEARCH MEDICINES
    // ========================================

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
                notes:medicine.notes,
                quantity: 1,

                morning: 1,
                afternoon: 0,
                evening: 0,
                night: 0,

                dosage: "1 - 0 - 0 - 0",

                frequency: null,

                duration: "30 Days",
                doctor_name: "",
                food: "Before Food",
            },

        ]);

        setSearch("");

        setShowSearch(false);

    };

    // const removeMedicine = (index) => {

    //     const medicine =
    //         editableMedicines[index];

    //     // Track removed medicines that already exist in DB
    //     if (medicine.id) {

    //         setDeletedMedicines(prev => [
    //             ...prev,
    //             medicine,
    //         ]);

    //     }

    //     setEditableMedicines(prev =>
    //         prev.filter((_, i) => i !== index)
    //     );

    // };

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

    // const toggleTime = (
    //     index,
    //     value
    // ) => {

    //     const medicine =
    //         editableMedicines[index];

    //     let times =
    //         medicine.timeOfDay || [];

    //     if (times.includes(value)) {

    //         times = times.filter(
    //             (x) => x !== value
    //         );

    //     } else {

    //         times = [...times, value];

    //     }

    //     updateMedicine(
    //         index,
    //         "timeOfDay",
    //         times
    //     );

    // };
    console.log("consultationId prop:", consultationId, "activeConsultationId:", activeConsultationId);
    const handleSaveAndContinue = async () => {
        try {
            if (!activeConsultationId) {
                console.error("❌ No consultationId found to save prescription");
                return;
            }

            const payload = {
                consultation_id: activeConsultationId,

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
                        notes: item.notes || "",

                        duration:
                            item.duration,

                        quantity:
                            Number(item.quantity) || 1,

                        doctor_name:
                            item.doctor_name || "",
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
                        consultationId:
                            activeConsultationId,
                        prescriptionId:
                            activeConsultationId,

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
                    activeConsultationId
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

            <div className="flex items-center justify-between">
                <div>

                <h2 className="text-[30px] font-bold text-[#4D2E23]">
                    Prescription
                </h2>

                <p className="mt-1 text-[17px] text-[#786A61]">
                    Add and manage prescriptions
                </p>
                </div>

                {consultationTimerStarted && (
                    <ConsultationTimer
                        timeLeft={
                            consultationTimeLeft
                        }
                    />
                )}
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
                    hover:bg-[#FFF8F2]
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

            {/* ========================================================= */}
{/* MEDICINE CARDS */}
{/* ========================================================= */}

<div className="overflow-hidden rounded-[28px] border border-[#E7DBD3] bg-white">

    {/* NO MEDICINES */}
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

    {/* MEDICINES */}
    {editableMedicines.map((medicine, index) => (
        <div
            key={
                medicine.id ??
                medicine.product_id ??
                index
            }
            className="
                border-b
                border-[#ECE2DA]
                p-7
                last:border-b-0
            "
        >

            {/* ================================================= */}
            {/* MEDICINE HEADER */}
            {/* ================================================= */}

            <div className="flex items-start justify-between">

                {/* LEFT - MEDICINE */}
                <div className="flex min-w-0 gap-5">

                    <div
                        className="
                            h-20
                            w-20
                            flex-shrink-0
                            overflow-hidden
                            rounded-3xl
                            bg-[#F7EFE8]
                        "
                    >
                        {medicine.image_url ? (
                            <img
                                src={medicine.image_url}
                                alt=""
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />
                        ) : null}
                    </div>

                    <div className="min-w-0">

                        <h2
                            className="
                                text-[22px]
                                font-bold
                                text-[#4D2E23]
                            "
                        >
                            {medicine.medicine_name}
                        </h2>

                        <div className="mt-2 flex items-center gap-3">

                            <p className="text-[15px] text-[#7E7E7E]">
                                {medicine.category}
                            </p>

                            <span className="h-4 w-px bg-[#DCCFC6]" />

                            <p className="text-[15px] text-[#7E7E7E]">
                                {medicine.brand ||
                                    medicine.manufacturer ||
                                    "Ayurvedic Medicine"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* RIGHT - DOCTOR + STOCK */}
                <div className="flex flex-col items-end gap-3">

                    {/* DOCTOR DROPDOWN */}
                    <div className="relative w-[220px]">

                        <button
                            type="button"
                            disabled={!editing}
                            onClick={() =>
                                setOpenDoctorDropdown(
                                    openDoctorDropdown === index
                                        ? null
                                        : index
                                )
                            }
                            className="
                                flex
                                h-[48px]
                                w-full
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-[#E7DBD3]
                                bg-white
                                px-4
                                text-left
                                transition
                                hover:border-[#CDB5A6]
                                disabled:cursor-not-allowed
                                disabled:bg-[#FAF7F4]
                            "
                        >

                            <div className="min-w-0">

                                {medicine.doctor_name ? (
                                    <p
                                        className="
                                            truncate
                                            text-[13px]
                                            font-semibold
                                            text-[#4D2E23]
                                        "
                                    >
                                        {medicine.doctor_name}
                                    </p>
                                ) : (
                                    <p
                                        className="
                                            text-[13px]
                                            font-medium
                                            text-[#9A8D84]
                                        "
                                    >
                                        Select Doctor
                                    </p>
                                )}

                            </div>

                            <HiChevronDown
                                size={18}
                                className={`
                                    ml-2
                                    flex-shrink-0
                                    text-[#7B665A]
                                    transition-transform
                                    ${
                                        openDoctorDropdown === index
                                            ? "rotate-180"
                                            : ""
                                    }
                                `}
                            />

                        </button>


                        {/* DOCTOR DROPDOWN MENU */}
                        {editing &&
                            openDoctorDropdown === index && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-[54px]
                                        z-[100]
                                        w-[320px]
                                        max-h-[300px]
                                        overflow-y-auto
                                        rounded-2xl
                                        border
                                        border-[#E7DBD3]
                                        bg-white
                                        shadow-xl
                                    "
                                >

                                    {/* DEFAULT */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            updateMedicine(
                                                index,
                                                "doctor_name",
                                                ""
                                            );

                                            setOpenDoctorDropdown(
                                                null
                                            );
                                        }}
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            border-b
                                            border-[#F0E7E1]
                                            px-4
                                            py-3
                                            text-left
                                            hover:bg-[#FFF8F2]
                                        "
                                    >
                                        <span className="text-[12px] text-[#9A8D84]">
                                            Select Doctor
                                        </span>
                                    </button>


                                    {/* ASSOCIATED DOCTORS */}
                                    {(associateDoctors || []).map(
                                        (doctor) => {

                                            const doctorId =
                                                doctor.doctor_id ||
                                                doctor.id;

                                            const doctorName =
                                                doctor.doctor_name ||
                                                doctor.name ||
                                                doctor.select_doctor ||
                                                "";

                                            const doctorCategory =
                                                doctor.category || "";

                                            const isSelected =
                                                medicine.doctor_name ===
                                                doctorName;

                                            return (
                                                <button
                                                    key={doctorId}
                                                    type="button"
                                                    onClick={() => {

                                                        updateMedicine(
                                                            index,
                                                            "doctor_name",
                                                            doctorName
                                                        );

                                                        setOpenDoctorDropdown(
                                                            null
                                                        );

                                                    }}
                                                    className={`
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
                                                        hover:bg-[#FFF8F2]
                                                        ${
                                                            isSelected
                                                                ? "bg-[#FFF8F2]"
                                                                : "bg-white"
                                                        }
                                                    `}
                                                >

                                                    <div className="min-w-0">

                                                        <p
                                                            className="
                                                                truncate
                                                                text-[13px]
                                                                font-semibold
                                                                text-[#4D2E23]
                                                            "
                                                        >
                                                            {doctorName}
                                                        </p>

                                                        {doctorCategory && (
                                                            <p
                                                                className="
                                                                    mt-1
                                                                    truncate
                                                                    text-[11px]
                                                                    text-[#8D8179]
                                                                "
                                                            >
                                                                {
                                                                    doctorCategory
                                                                }
                                                            </p>
                                                        )}

                                                    </div>

                                                    {isSelected && (
                                                        <span
                                                            className="
                                                                ml-3
                                                                flex-shrink-0
                                                                text-[12px]
                                                                font-semibold
                                                                text-[#8A563B]
                                                            "
                                                        >
                                                            ✓
                                                        </span>
                                                    )}

                                                </button>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                    </div>


                    {/* STOCK */}
                    <div
                        className="
                            rounded-full
                            bg-[#E8F8EA]
                            px-4
                            py-1
                            text-xs
                            font-medium
                            text-[#2E7A46]
                        "
                    >
                        In Stock
                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* DIVIDER */}
            {/* ================================================= */}

            <div className="my-6 border-t border-[#EFE4DD]" />


            {/* ================================================= */}
            {/* DOSAGE + DURATION */}
            {/* ================================================= */}

            <div className="grid grid-cols-2 gap-8">

                {/* ================================================= */}
                {/* DOSAGE */}
                {/* ================================================= */}

                <div>

                    <p
                        className="
                            text-[17px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Dosage
                    </p>

                    <div className="mt-3 flex items-center gap-2">

                        {/* MORNING */}
                        <input
                            type="number"
                            min="0"
                            max="9"
                            value={
                                medicine.morning ??
                                0
                            }
                            disabled={!editing}
                            onChange={(e) =>
                                updateMedicine(
                                    index,
                                    "morning",
                                    e.target.value
                                )
                            }
                            className="
                                h-11
                                w-12
                                pl-4
                                rounded-xl
                                border
                                border-[#E7DBD3]
                                bg-white
                                text-center
                                text-[15px]
                                font-medium
                                text-[#4D2E23]
                                outline-none
                                focus:border-[#8A563B]
                                disabled:bg-[#FAF7F4]
                                disabled:text-[#6F6863]
                            "
                        />

                        <span className="text-[#9A8D84]">
                            -
                        </span>


                        {/* AFTERNOON */}
                        <input
                            type="number"
                            min="0"
                            max="9"
                            value={
                                medicine.afternoon ??
                                0
                            }
                            disabled={!editing}
                            onChange={(e) =>
                                updateMedicine(
                                    index,
                                    "afternoon",
                                    e.target.value
                                )
                            }
                            className="
                                h-11
                                w-12
                                pl-4
                                rounded-xl
                                border
                                border-[#E7DBD3]
                                bg-white
                                text-center
                                text-[15px]
                                font-medium
                                text-[#4D2E23]
                                outline-none
                                focus:border-[#8A563B]
                                disabled:bg-[#FAF7F4]
                                disabled:text-[#6F6863]
                            "
                        />

                        <span className="text-[#9A8D84]">
                            -
                        </span>


                        {/* EVENING */}
                        <input
                            type="number"
                            min="0"
                            max="9"
                            value={
                                medicine.evening ??
                                0
                            }
                            disabled={!editing}
                            onChange={(e) =>
                                updateMedicine(
                                    index,
                                    "evening",
                                    e.target.value
                                )
                            }
                            className="
                                h-11
                                w-12
                                pl-4
                                rounded-xl
                                border
                                border-[#E7DBD3]
                                bg-white
                                text-center
                                text-[15px]
                                font-medium
                                text-[#4D2E23]
                                outline-none
                                focus:border-[#8A563B]
                                disabled:bg-[#FAF7F4]
                                disabled:text-[#6F6863]
                            "
                        />

                        <span className="text-[#9A8D84]">
                            -
                        </span>


                        {/* NIGHT */}
                        <input
                            type="number"
                            min="0"
                            max="9"
                            value={
                                medicine.night ??
                                0
                            }
                            disabled={!editing}
                            onChange={(e) =>
                                updateMedicine(
                                    index,
                                    "night",
                                    e.target.value
                                )
                            }
                            className="
                                h-11
                                w-12
                                pl-4
                                rounded-xl
                                border
                                border-[#E7DBD3]
                                bg-white
                                text-center
                                text-[15px]
                                font-medium
                                text-[#4D2E23]
                                outline-none
                                focus:border-[#8A563B]
                                disabled:bg-[#FAF7F4]
                                disabled:text-[#6F6863]
                            "
                        />

                    </div>


                    {/* DOSAGE LABELS */}

                    <div className="mt-1 flex gap-6">

                        <span className="w-12 text-center text-[10px] text-[#A4968D]">
                            Morning
                        </span>

                        <span className="w-12 text-center text-[10px] text-[#A4968D]">
                            Afternoon
                        </span>

                        <span className="w-12 text-center text-[10px] text-[#A4968D]">
                            Evening
                        </span>

                        <span className="w-12 text-center text-[10px] text-[#A4968D]">
                            Night
                        </span>

                    </div>

                </div>


                {/* ================================================= */}
                {/* DURATION */}
                {/* ================================================= */}

                <div>

                    <p
                        className="
                            text-[17px]
                            font-semibold
                            text-[#4D2E23]
                        "
                    >
                        Duration
                    </p>

                    <div className="relative mt-3 w-[180px]">

                        <select
                            value={
                                medicine.duration ||
                                "30 Days"
                            }
                            disabled={!editing}
                            onChange={(e) =>
                                updateMedicine(
                                    index,
                                    "duration",
                                    e.target.value
                                )
                            }
                            className="
                                h-11
                                w-full
                                appearance-none
                                rounded-xl
                                border
                                border-[#E7DBD3]
                                bg-white
                                px-4
                                pr-10
                                text-[14px]
                                font-medium
                                text-[#4D2E23]
                                outline-none
                                focus:border-[#8A563B]
                                disabled:bg-[#FAF7F4]
                                disabled:text-[#6F6863]
                            "
                        >

                            {durationOptions.map(
                                (duration) => (
                                    <option
                                        key={duration}
                                        value={duration}
                                    >
                                        {duration}
                                    </option>
                                )
                            )}

                        </select>

                        <HiChevronDown
                            size={17}
                            className="
                                pointer-events-none
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-[#7B665A]
                            "
                        />

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* FOOD */}
            {/* ================================================= */}

            <div className="mt-6">

                <p
                    className="
                        mb-2
                        text-[17px]
                        font-semibold
                        text-[#4D2E23]
                    "
                >
                    Food
                </p>

                <div className="relative w-[190px]">

                    <select
                        value={
                            medicine.food ||
                            "Before Food"
                        }
                        disabled={!editing}
                        onChange={(e) =>
                            updateMedicine(
                                index,
                                "food",
                                e.target.value
                            )
                        }
                        className="
                            h-11
                            w-full
                            appearance-none
                            rounded-xl
                            border
                            border-[#E7DBD3]
                            bg-white
                            px-4
                            pr-10
                            text-[14px]
                            font-medium
                            text-[#4D2E23]
                            outline-none
                            focus:border-[#8A563B]
                            disabled:bg-[#FAF7F4]
                            disabled:text-[#6F6863]
                        "
                    >

                        <option value="Before Food">
                            Before Food
                        </option>

                        <option value="After Food">
                            After Food
                        </option>

                    </select>

                    <HiChevronDown
                        size={17}
                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#7B665A]
                        "
                    />

                </div>

            </div>


            {/* ================================================= */}
            {/* MEDICINE NOTES */}
            {/* ================================================= */}

            <div className="mt-6">

                <div
                    className="
                        relative
                        rounded-[18px]
                        border
                        border-[#E7DBD3]
                        bg-white
                    "
                >

                    <textarea
                        maxLength={200}
                        rows={4}
                        value={
                            medicine.notes ||
                            ""
                        }
                        disabled={!editing}
                        onChange={(e) =>
                            updateMedicine(
                                index,
                                "notes",
                                e.target.value
                            )
                        }
                        placeholder="Enter Special Instructions"
                        className="
                            w-full
                            resize-none
                            rounded-[18px]
                            bg-transparent
                            px-5
                            py-4
                            text-[14px]
                            text-[#4D2E23]
                            outline-none
                            placeholder:text-[#8D8179]
                            disabled:bg-[#FAF7F4]
                            disabled:text-[#6F6863]
                        "
                    />

                    <div
                        className="
                            flex
                            justify-end
                            px-5
                            pb-4
                            text-[13px]
                            text-[#6F6863]
                        "
                    >
                        {(medicine.notes || "").length}/200
                        {" "}
                        Characters
                    </div>

                </div>

            </div>

        </div>
    ))}


    {/* ========================================================= */}
    {/* TOTAL */}
    {/* ========================================================= */}

    <div
        className="
            flex
            items-center
            justify-between
            border-t
            border-[#ECE2DA]
            px-7
            py-7
        "
    >

        <h2
            className="
                text-[24px]
                font-bold
                text-[#4D2E23]
            "
        >
            Total
        </h2>

        <h2
            className="
                text-[15px]
                font-bold
                text-[#824C39]
            "
        >
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
                    Allergies
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
                            className="flex items-center gap-3 rounded-full border border-[#E7DBD3] bg-[#FFF8F2] px-5 py-3">

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