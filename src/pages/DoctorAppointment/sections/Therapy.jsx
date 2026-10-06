import {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    HiOutlineMagnifyingGlass,
    HiOutlineMicrophone,
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineClock,
    HiOutlineArrowRightOnRectangle,
    HiOutlineArrowLeft,
    HiChevronDown,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
    loadTherapies,
    searchTherapiesThunk,
    saveTherapyThunk,
    updateTherapyThunk,
    deleteTherapyThunk,
    loadAssociateDoctors,
} from "../../../redux/consultation/consultationThunk";
import SpeechToTextTextarea from "../../../components/Layout/SpeechToTextTextarea";
import ConsultationSectionNav from "../components/ConsultationSectionNav";

const therapyCategories = [
    "Treatments",
    "Rejuvenation",
    "Anorectal care",
    "Panchakarma",
    "Pain care",
];

const Therapy = ({
    appointmentId,
    onBack,
    onContinue,
    consultationTimeLeft,
    consultationTimerStarted,
    activeSection,
    setActiveSection,
}) => {
    const dispatch = useDispatch();

    const [openDoctorDropdown, setOpenDoctorDropdown] = useState(null);
    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(null);

    // ==========================================
    // SEARCH
    // ==========================================
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    // ==========================================
    // EDITING LIST & SAVING
    // ==========================================
    const [editableTherapies, setEditableTherapies] = useState([]);
    const [saving, setSaving] = useState(false);

    // ==========================================
    // REDUX STATE
    // ==========================================
    const {
        therapy,
        therapySearch,
        associateDoctors = [],
    } = useSelector((state) => state.consultation);

    // ==========================================
    // TOTAL AMOUNT CALCULATION
    // ==========================================
    const total = editableTherapies.reduce((sum, item) => {
        return sum + Number(item.amount || 0);
    }, 0);

    // ==========================================
    // SYNC WITH REDUX THERAPIES
    // ==========================================
    useEffect(() => {
        const items = (therapy?.items || []).map((item) => ({
            ...item,
            category: item.category || "Treatments",
            no_of_days: item.no_of_days || item.days_count || 1,
            notes: item.notes || item.doctor_prescription_therpay_notes || "",
        }));

        setEditableTherapies(items);
    }, [therapy?.items]);

    // ==========================================
    // LOAD INITIAL DATA
    // ==========================================
    useEffect(() => {
        if (!appointmentId) return;

        dispatch(loadTherapies(appointmentId));
        dispatch(loadAssociateDoctors(appointmentId));
    }, [appointmentId, dispatch]);

    // ==========================================
    // SEARCH THERAPIES
    // ==========================================
    useEffect(() => {
        if (!search.trim()) {
            setShowDropdown(false);
            return;
        }

        dispatch(searchTherapiesThunk(search));
        setShowDropdown(true);
    }, [search, dispatch]);

    // ==========================================
    // CLOSE DROPDOWNS ON OUTSIDE CLICK
    // ==========================================
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // Close card dropdowns on outside click
    useEffect(() => {
        const handleCardDropdownClick = (event) => {
            if (!event.target.closest("[data-therapy-dropdown]")) {
                setOpenDoctorDropdown(null);
                setOpenCategoryDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleCardDropdownClick);
        return () => {
            document.removeEventListener("mousedown", handleCardDropdownClick);
        };
    }, []);

    // ==========================================
    // ADD THERAPY
    // ==========================================
    const addTherapy = (selectedTherapy) => {
        if (!selectedTherapy) return;

        const isAlreadySelected = editableTherapies.some(
            (item) =>
                String(item.treatment_id) === String(selectedTherapy.id) ||
                String(item.id) === String(selectedTherapy.id)
        );

        if (isAlreadySelected) {
            alert("This therapy is already selected.");
            return;
        }

        const newTherapy = {
            isNew: true,
            treatment_id: selectedTherapy.id,
            treatment_name:
                selectedTherapy.name ||
                selectedTherapy.treatment_name ||
                "Therapy",
            description:
                selectedTherapy.notes ||
                selectedTherapy.description ||
                "",
            image_url: selectedTherapy.image_url || "",
            amount: Number(
                selectedTherapy.daycare_price ||
                selectedTherapy.price ||
                0
            ),
            duration_minutes:
                selectedTherapy.duration_minutes ||
                selectedTherapy.duration ||
                45,
            booking_date: new Date().toISOString().split("T")[0],
            slot_time: "10:00:00",
            notes: "",
            doctor_prescription_therpay_notes: "",
            no_of_days: 1,
            category: selectedTherapy.category || "Treatments",
            doctor_name: "",
        };

        setEditableTherapies((prev) => [...prev, newTherapy]);
        setSearch("");
        setShowDropdown(false);
    };

    // ==========================================
    // UPDATE THERAPY
    // ==========================================
    const updateTherapy = (index, key, value) => {
        setEditableTherapies((prev) =>
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

    // ==========================================
    // DELETE THERAPY
    // ==========================================
    const deleteTherapy = async (item, index) => {
        if (item.id && !item.isNew) {
            try {
                await dispatch(deleteTherapyThunk(item.id)).unwrap();
            } catch (error) {
                console.error("Failed to delete therapy:", error);
            }
        }
        setEditableTherapies((prev) => prev.filter((_, i) => i !== index));
    };

    // ==========================================
    // SAVE ALL THERAPIES
    // ==========================================
    const saveAll = async () => {
        try {
            setSaving(true);

            for (const item of editableTherapies) {
                if (item.isNew || !item.id) {
                    // POST /visits/{appointmentId}/therapies
                    const payload = {
                        treatment_id: item.treatment_id,
                        booking_date:
                            item.booking_date?.split("T")[0] ||
                            new Date().toISOString().split("T")[0],
                        slot_time: item.slot_time || "10:00:00",
                        doctor_prescription_therpay_notes:
                            item.notes ||
                            item.doctor_prescription_therpay_notes ||
                            "",
                        no_of_days: Number(item.no_of_days || 1),
                        category: item.category || "Treatments",
                        doctor_name: item.doctor_name || "",
                    };

                    await dispatch(
                        saveTherapyThunk({
                            appointmentId,
                            payload,
                        })
                    ).unwrap();
                } else {
                    // PUT /visits/therapies/{id}
                    await dispatch(
                        updateTherapyThunk({
                            therapyId: item.id,
                            payload: {
                                booking_date:
                                    item.booking_date?.split("T")[0] ||
                                    new Date().toISOString().split("T")[0],
                                slot_time: item.slot_time || "10:00:00",
                                amount: Number(item.amount || 0),
                                notes:
                                    item.notes ||
                                    item.doctor_prescription_therpay_notes ||
                                    "",
                                no_of_days: Number(
                                    item.no_of_days ||
                                    item.days_count ||
                                    1
                                ),
                                category: item.category || "Treatments",
                                doctor_name: item.doctor_name || "",
                            },
                        })
                    ).unwrap();
                }
            }

            // Reload fresh therapies list
            await dispatch(loadTherapies(appointmentId)).unwrap();

            if (onContinue) {
                onContinue();
            }
        } catch (error) {
            console.error("Failed to save therapies:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full min-w-0 max-w-full space-y-6">
            {/* Consultation Section Nav */}
            <ConsultationSectionNav
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            {/* ========================================================= */}
            {/* HEADER */}
            {/* ========================================================= */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[30px] font-bold text-[#4D2E23]">
                        Therapy
                    </h2>
                    <p className="mt-1 text-[17px] text-[#786A61]">
                        Add and manage therapies
                    </p>
                </div>
            </div>

            {/* ========================================================= */}
            {/* SEARCH THERAPY (Matching Prescription Search Bar) */}
            {/* ========================================================= */}
            <div ref={searchRef} className="relative w-full">
                <div className="flex h-[64px] items-center rounded-2xl border border-[#E8DDD5] bg-white px-5 shadow-sm transition focus-within:border-[#8A563B]">
                    <HiOutlineMagnifyingGlass
                        size={22}
                        className="text-[#4D2E23] shrink-0"
                    />

                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => {
                            if (search.trim()) setShowDropdown(true);
                        }}
                        placeholder="Search therapy..."
                        className="ml-4 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#9A918B]"
                    />

                    <HiOutlineMicrophone
                        size={20}
                        className="text-[#4D2E23] shrink-0"
                    />
                </div>

                {/* SEARCH RESULTS DROPDOWN */}
                {showDropdown && search.trim() && therapySearch?.length > 0 && (
                    <div className="absolute left-0 right-0 top-[70px] z-50 max-h-[300px] overflow-y-auto rounded-2xl border border-[#E7DBD3] bg-white shadow-xl p-2 hide-scrollbar">
                        {therapySearch.map((item) => {
                            const isAlreadySelected = editableTherapies.some(
                                (t) =>
                                    String(t.treatment_id) === String(item.id) ||
                                    String(t.id) === String(item.id)
                            );

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    disabled={isAlreadySelected}
                                    onClick={() => {
                                        if (!isAlreadySelected) {
                                            addTherapy(item);
                                        }
                                    }}
                                    className={`flex w-full items-center justify-between rounded-xl border-b border-[#F2E8E2] px-4 py-3 text-left transition last:border-b-0 ${
                                        isAlreadySelected
                                            ? "cursor-not-allowed bg-[#FAF7F4] opacity-60"
                                            : "hover:bg-[#FFF8F2]"
                                    }`}
                                >
                                    {/* Left */}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#EEE3DB] bg-[#FFF0E5]">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[#8A563B]">
                                                    <HiOutlinePlus size={20} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-[15px] font-semibold text-[#4D2E23]">
                                                {item.name || item.treatment_name}
                                            </h3>
                                            <p className="mt-0.5 text-xs text-[#8D8D8D]">
                                                {item.category || "Treatments"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="ml-4 flex shrink-0 items-center gap-3">
                                        {isAlreadySelected ? (
                                            <span className="rounded-full bg-[#FDEEDC] px-3 py-1 text-xs font-semibold text-[#8A563B]">
                                                Already Selected
                                            </span>
                                        ) : (
                                            <span className="text-[16px] font-bold text-[#4D2E23]">
                                                ₹{Number(item.daycare_price || item.price || 0).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* NO RESULTS DROPDOWN */}
                {showDropdown && search.trim() && therapySearch?.length === 0 && (
                    <div className="absolute left-0 right-0 top-[70px] z-50 rounded-2xl border border-[#E7DBD3] bg-white p-5 text-center shadow-xl">
                        <p className="text-[#8B7A70] text-[15px]">
                            No therapies found matching &ldquo;{search}&rdquo;
                        </p>
                    </div>
                )}
            </div>

            {/* ========================================================= */}
            {/* THERAPY LIST HEADER */}
            {/* ========================================================= */}
            <div className="flex items-center justify-between pt-2">
                <h2 className="text-[30px] font-bold text-[#4D2E23]">
                    Therapy List
                </h2>
            </div>

            {/* ========================================================= */}
            {/* THERAPY CARDS CONTAINER (Matching Prescription) */}
            {/* ========================================================= */}
            <div className="w-full min-w-0 overflow-hidden rounded-[28px] border border-[#E7DBD3] bg-white shadow-sm">
                {/* EMPTY STATE */}
                {editableTherapies.length === 0 ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0E5] text-[#8A563B]">
                            <HiOutlinePlus size={28} />
                        </div>
                        <h3 className="mt-4 text-[20px] font-semibold text-[#4D2E23]">
                            No therapies added
                        </h3>
                        <p className="mt-2 text-[15px] text-[#8D8D8D]">
                            Search therapies above to add to this patient&apos;s consultation.
                        </p>
                    </div>
                ) : (
                    editableTherapies.map((item, index) => {
                        return (
                            <div
                                key={item.id ?? item.treatment_id ?? index}
                                className="w-full min-w-0 border-b border-[#ECE2DA] p-6 sm:p-7 last:border-b-0"
                            >
                                {/* ================================================= */}
                                {/* CARD HEADER: Image, Info & Doctor / Category / Price */}
                                {/* ================================================= */}
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    {/* LEFT: Image + Treatment Name + Details */}
                                    <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
                                        <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-[#F7EFE8] border border-[#EFE4DC]">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[#8A563B]">
                                                    <HiOutlinePlus size={26} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate text-[20px] sm:text-[22px] font-bold text-[#4D2E23]">
                                                {item.treatment_name}
                                            </h2>

                                            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                                                <span className="rounded-full bg-[#FFF0E5] px-3 py-1 text-xs font-semibold text-[#8A563B]">
                                                    {item.category || "Treatments"}
                                                </span>
                                                <span className="h-3 w-px bg-[#DCCFC6]" />
                                                <div className="flex items-center gap-1.5 text-[14px] text-[#7E7E7E]">
                                                    <HiOutlineClock size={16} className="text-[#A16D18]" />
                                                    <span>
                                                        {item.duration_minutes || 45} mins
                                                    </span>
                                                </div>
                                            </div>

                                            {item.description ? (
                                                <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-[#7E7E7E]">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* RIGHT: Dropdowns + Price + Delete */}
                                    <div
                                        data-therapy-dropdown
                                        className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end"
                                    >
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            {/* DOCTOR DROPDOWN */}
                                            <div className="relative w-full sm:w-[200px]">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpenDoctorDropdown(
                                                            openDoctorDropdown === index ? null : index
                                                        );
                                                        setOpenCategoryDropdown(null);
                                                    }}
                                                    className="flex h-[44px] w-full items-center justify-between rounded-xl border border-[#E7DBD3] bg-white px-3.5 text-left transition hover:border-[#CDB5A6]"
                                                >
                                                    <span className="truncate text-[13px] font-semibold text-[#4D2E23]">
                                                        {item.doctor_name || (
                                                            <span className="font-normal text-[#9A8D84]">
                                                                Select Doctor
                                                            </span>
                                                        )}
                                                    </span>
                                                    <HiChevronDown
                                                        size={16}
                                                        className={`ml-2 shrink-0 text-[#7B665A] transition-transform ${
                                                            openDoctorDropdown === index ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>

                                                {openDoctorDropdown === index && (
                                                    <div className="absolute right-0 top-[50px] z-[100] max-h-[260px] w-[min(300px,calc(100vw-48px))] overflow-y-auto rounded-2xl border border-[#E7DBD3] bg-white shadow-xl hide-scrollbar">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                updateTherapy(index, "doctor_name", "");
                                                                setOpenDoctorDropdown(null);
                                                            }}
                                                            className="flex w-full border-b border-[#F0E7E1] px-4 py-2.5 text-left text-[12px] text-[#9A8D84] hover:bg-[#FFF8F2]"
                                                        >
                                                            Select Doctor
                                                        </button>
                                                        {(associateDoctors || []).map((doc) => {
                                                            const docId = doc.doctor_id || doc.id;
                                                            const docName =
                                                                doc.doctor_name || doc.name || doc.select_doctor || "";
                                                            const isSelected = item.doctor_name === docName;

                                                            return (
                                                                <button
                                                                    key={docId}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        updateTherapy(index, "doctor_name", docName);
                                                                        setOpenDoctorDropdown(null);
                                                                    }}
                                                                    className={`flex w-full items-center justify-between border-b border-[#F2E8E2] px-4 py-2.5 text-left last:border-b-0 transition hover:bg-[#FFF8F2] ${
                                                                        isSelected ? "bg-[#FFF8F2]" : "bg-white"
                                                                    }`}
                                                                >
                                                                    <div className="min-w-0">
                                                                        <p className="truncate text-[13px] font-semibold text-[#4D2E23]">
                                                                            {docName}
                                                                        </p>
                                                                        {doc.category && (
                                                                            <p className="mt-0.5 truncate text-[11px] text-[#8D8179]">
                                                                                {doc.category}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    {isSelected && (
                                                                        <span className="ml-2 text-[12px] font-bold text-[#8A563B]">
                                                                            ✓
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* CATEGORY DROPDOWN */}
                                            <div className="relative w-full sm:w-[160px]">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpenCategoryDropdown(
                                                            openCategoryDropdown === index ? null : index
                                                        );
                                                        setOpenDoctorDropdown(null);
                                                    }}
                                                    className="flex h-[44px] w-full items-center justify-between rounded-xl border border-[#E7DBD3] bg-white px-3.5 text-left transition hover:border-[#CDB5A6]"
                                                >
                                                    <span className="truncate text-[13px] font-semibold text-[#4D2E23]">
                                                        {item.category || "Treatments"}
                                                    </span>
                                                    <HiChevronDown
                                                        size={16}
                                                        className={`ml-2 shrink-0 text-[#7B665A] transition-transform ${
                                                            openCategoryDropdown === index ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>

                                                {openCategoryDropdown === index && (
                                                    <div className="absolute right-0 top-[50px] z-[100] w-[180px] overflow-hidden rounded-2xl border border-[#E7DBD3] bg-white shadow-xl">
                                                        {therapyCategories.map((cat) => {
                                                            const isSelected = item.category === cat;
                                                            return (
                                                                <button
                                                                    key={cat}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        updateTherapy(index, "category", cat);
                                                                        setOpenCategoryDropdown(null);
                                                                    }}
                                                                    className={`flex w-full items-center justify-between border-b border-[#F2E8E2] px-4 py-2.5 text-left text-[12px] last:border-b-0 hover:bg-[#FFF8F2] ${
                                                                        isSelected
                                                                            ? "bg-[#FFF8F2] font-semibold text-[#4D2E23]"
                                                                            : "text-[#6F625B]"
                                                                    }`}
                                                                >
                                                                    <span>{cat}</span>
                                                                    {isSelected && (
                                                                        <span className="text-[12px] font-bold text-[#8A563B]">
                                                                            ✓
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* PRICE & DELETE BUTTON */}
                                        <div className="flex items-center gap-4 mt-1 lg:mt-2">
                                            <span className="text-[18px] font-bold text-[#4D2E23]">
                                                ₹{Number(item.amount || 0).toLocaleString()}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => deleteTherapy(item, index)}
                                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F2DCD3] text-[#B42318] hover:bg-[#FDECEC] transition shadow-sm"
                                                title="Remove therapy"
                                            >
                                                <HiOutlineTrash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* ================================================= */}
                                {/* DIVIDER */}
                                {/* ================================================= */}
                                <div className="my-5 border-t border-[#EFE4DD]" />

                                {/* ================================================= */}
                                {/* NUMBER OF DAYS + INSTRUCTIONS / NOTES */}
                                {/* ================================================= */}
                                <div className="space-y-4">
                                    {/* Number of Days input */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-[15px] font-semibold text-[#4D2E23]">
                                            Number of Days:
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={
                                                    item.no_of_days !== undefined
                                                        ? String(item.no_of_days).replace(/\D/g, "")
                                                        : 1
                                                }
                                                onChange={(e) =>
                                                    updateTherapy(index, "no_of_days", e.target.value)
                                                }
                                                className="h-10 w-20 rounded-xl border border-[#E7DBD3] bg-white text-center text-[15px] font-semibold text-[#4D2E23] outline-none focus:border-[#8A563B]"
                                            />
                                            <span className="text-[14px] font-medium text-[#7E7E7E]">
                                                Days
                                            </span>
                                        </div>
                                    </div>

                                    {/* Therapy Notes / Instructions */}
                                    <div>
                                        <label className="mb-2 block text-[15px] font-semibold text-[#4D2E23]">
                                            Therapy Notes / Special Instructions
                                        </label>
                                        <div className="relative rounded-2xl border border-[#E7DBD3] bg-white shadow-inner">
                                            <SpeechToTextTextarea
                                                value={item.notes || item.doctor_prescription_therpay_notes || ""}
                                                onChange={(value) => {
                                                    updateTherapy(index, "notes", value);
                                                    updateTherapy(index, "doctor_prescription_therpay_notes", value);
                                                }}
                                                placeholder="Enter therapy notes or instructions for the therapist..."
                                                rows={3}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* ========================================================= */}
                {/* TOTAL SECTION */}
                {/* ========================================================= */}
                <div className="flex items-center justify-between border-t border-[#ECE2DA] px-7 py-6">
                    <h2 className="text-[24px] font-bold text-[#4D2E23]">
                        Total
                    </h2>
                    <h2 className="text-[20px] font-bold text-[#824C39]">
                        ₹{total.toLocaleString()}
                    </h2>
                </div>
            </div>

            {/* ========================================================= */}
            {/* ACTION BUTTONS (Back / Save & Continue) */}
            {/* ========================================================= */}
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
                <button
                    type="button"
                    onClick={() => {
                        if (onBack) onBack();
                    }}
                    disabled={saving}
                    className="flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl border border-[#E3D2C7] bg-[#FFFDFB] text-[18px] font-semibold text-[#4D2E23] transition hover:bg-[#FFF5EE] disabled:opacity-60"
                >
                    <HiOutlineArrowLeft size={22} />
                    Back
                </button>

                <button
                    type="button"
                    onClick={saveAll}
                    disabled={saving}
                    className="flex h-14 flex-1 items-center justify-center gap-4 rounded-2xl bg-[#8A563B] text-[18px] font-semibold text-white transition hover:bg-[#754630] disabled:opacity-60 shadow-sm"
                >
                    <HiOutlineArrowRightOnRectangle size={22} />
                    {saving ? "Saving..." : "Save & Continue"}
                </button>
            </div>
        </div>
    );
};

export default Therapy;