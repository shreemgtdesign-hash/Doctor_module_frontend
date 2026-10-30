import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineAdjustments,
  HiX,
} from "react-icons/hi";
import { SlidersHorizontal, Mic } from "lucide-react";
import { loadTreatments } from "../../../redux/patient/patientThunk";
import { setSelectedTreatment } from "../../../redux/patient/patientSlice";

const CATEGORIES = ["All", "Therapy", "Wellness", "Beauty Care", "Panchakarma"];

const PatientBookTherapy = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { treatments, treatmentsLoading } = useSelector((state) => state.patient);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFilterChips, setActiveFilterChips] = useState([
   ""
  ]);

  useEffect(() => {
    dispatch(loadTreatments());
  }, [dispatch]);

  // Remove a filter chip
  const handleRemoveChip = (chipToRemove) => {
    setActiveFilterChips((prev) => prev.filter((c) => c !== chipToRemove));
  };

  // Filter therapies locally by search term & category
  const filteredTreatments = (treatments || []).filter((item) => {
    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = (item.name || "").toLowerCase().includes(q);
      const matchDesc = (item.description || "").toLowerCase().includes(q);
      const matchBenefits = (item.benefits || "").toLowerCase().includes(q);
      const matchCode = (item.code || "").toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBenefits && !matchCode) return false;
    }

    // Category
    if (selectedCategory !== "All") {
      const cat = (item.category || "").toUpperCase();
      const target = selectedCategory.toUpperCase().replace(" ", "_");
      if (!cat.includes(target) && target !== "THERAPY" && target !== "ALL") {
        return false;
      }
    }

    return true;
  });

  const handleSelectTreatment = (therapy) => {
    dispatch(setSelectedTreatment(therapy));
    navigate(`/patient/book-therapy/${therapy.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] text-[#2C1810] dark:text-[#EDE3DA] font-sans pb-16">
      {/* Top Header / Back Bar */}
      <div className="sticky top-0 z-40 w-full border-b border-[#EFE5DC] dark:border-[#382E28] bg-[#FFFDFB] dark:bg-[#1E1714] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button
              type="button"
              onClick={() => navigate("/patient/dashboard")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:text-[#2C1810] transition cursor-pointer"
            >
              <HiOutlineArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6 animate-fadeIn">
        {/* Title & Available Count */}
        <div>
          <h1 className="text-[26px] sm:text-[28px] font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
            Ayurvedic Therapies
          </h1>
          <p className="text-xs sm:text-[13px] text-[#7F726A] dark:text-[#A8988D] mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#257A42] inline-block" />
            <span>{filteredTreatments.length} available Therapies</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <HiOutlineSearch
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7D75] dark:text-[#A8988D]"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by therapy or benefit"
            className="w-full rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] pl-11 pr-12 py-3.5 text-sm font-medium text-[#2C1810] dark:text-[#EDE3DA] placeholder-[#A8988D] outline-none shadow-xs transition focus:border-[#6F4432] dark:focus:border-[#C59B82]"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7D75] hover:text-[#4D2E23] transition cursor-pointer"
            title="Voice search"
          >
            <Mic size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] px-4 py-2 text-xs font-semibold text-[#4D2E23] dark:text-[#EDE3DA] shadow-2xs hover:bg-[#FAF4ED] dark:hover:bg-[#2C231F] transition cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* Removable Active Chips */}
          {activeFilterChips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#EADBD0] dark:border-[#382E28] bg-[#FAF3EC] dark:bg-[#2C231F] px-3.5 py-2 text-xs font-medium text-[#4D2E23] dark:text-[#EDE3DA]"
            >
              <span>{chip}</span>
              <button
                type="button"
                onClick={() => handleRemoveChip(chip)}
                className="hover:text-red-600 transition cursor-pointer"
              >
                <HiX size={13} />
              </button>
            </span>
          ))}

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto ml-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-2xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#6F4432] text-white shadow-xs"
                    : "border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] text-[#7F726A] dark:text-[#A8988D] hover:bg-[#FAF4ED]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Therapies Grid (2 Columns as shown in Screenshot) */}
        {treatmentsLoading ? (
          <div className="py-20 text-center text-[#8A7D75]">
            Loading Ayurvedic therapies...
          </div>
        ) : filteredTreatments.length === 0 ? (
          <div className="py-16 text-center text-[#8A7D75]">
            No therapies found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {filteredTreatments.map((therapy) => {
              const price = therapy.op_price
                ? `₹${parseInt(therapy.op_price, 10).toLocaleString()}`
                : "₹1,200";

              return (
                <div
                  key={therapy.id}
                  className="rounded-[24px] border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs hover:shadow-md hover:border-[#6F4432] dark:hover:border-[#C59B82] transition duration-200"
                >
                  {/* Left: Square Image with Price Tag */}
                  <div className="relative h-28 w-28 sm:h-28 sm:w-28 shrink-0 rounded-2xl overflow-hidden bg-[#FAF4EF] dark:bg-[#1E1714]">
                    <img
                      src={therapy.image_url}
                      alt={therapy.name}
                      className="h-full w-full object-cover"
                    />
                    {/* Price Pill at bottom */}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 rounded-lg bg-white/95 dark:bg-[#1A1412]/95 py-1 text-center shadow-xs">
                      <span className="text-[12px] font-bold text-[#4D2E23] dark:text-[#EDE3DA]">
                        {price}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA] truncate">
                      {therapy.name}
                    </h3>
                    <p className="text-xs text-[#7F726A] dark:text-[#A8988D] line-clamp-2 leading-relaxed">
                      {therapy.description}
                    </p>

                    {/* Meta: Duration & Next Slot */}
                    <div className="flex items-center gap-3 text-[11.5px] font-medium text-[#8A7D75] dark:text-[#9C8C80] pt-1">
                      <span className="flex items-center gap-1">
                        <HiOutlineClock size={14} className="text-[#6F4432]" />
                        {therapy.treatment_duration || `${therapy.duration_minutes || 45} min`}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <HiOutlineCalendar size={14} className="text-[#6F4432]" />
                        {therapy.next_slot || "Today, 3:30 PM"}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleSelectTreatment(therapy)}
                      className="flex-1 sm:flex-none sm:w-28 rounded-full border border-[#E5DCD5] dark:border-[#382E28] bg-white dark:bg-[#241E1B] px-4 py-2 text-xs font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:bg-[#FAF4ED] dark:hover:bg-[#2C231F] transition text-center cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTreatment(therapy)}
                      className="flex-1 sm:flex-none sm:w-28 rounded-full bg-[#6F4432] hover:bg-[#5C3829] text-white px-4 py-2 text-xs font-semibold transition text-center shadow-xs cursor-pointer"
                    >
                      Book Therapy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientBookTherapy;

 