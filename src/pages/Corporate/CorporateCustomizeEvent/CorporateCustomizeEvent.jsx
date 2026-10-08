import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineChevronRight,
  HiOutlineCalendar,
  HiChevronDown,
  HiArrowRight,
  HiCheck,
  HiOutlineSparkles
} from "react-icons/hi";
import toast from "react-hot-toast";
import {
  getCorporateCustomizeOptions,
  createCorporateCustomizeEvent
} from "../../../api/corporateDashboardApi";
import PackageDetailsModal from "../components/PackageDetailsModal";
import DashboardLayout from "../../../components/Layout/DashboardLayout";

const getBadgeStyle = (badge) => {
  const b = (badge || "").toLowerCase();
  if (b.includes("seminar")) return "bg-[#E8F8EC] text-[#257A42]";
  if (b.includes("retreat")) return "bg-[#F4EDFC] text-[#6E3BB5]";
  if (b.includes("check")) return "bg-[#FDECEC] text-[#D32F2F]";
  return "bg-[#EAF4FD] text-[#236CB2]";
};

const CorporateCustomizeEvent = () => {
  const navigate = useNavigate();

  // Form State
  const [category, setCategory] = useState("Workshop");
  const [area, setArea] = useState("");
  const [mode, setMode] = useState("Online");
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [duration, setDuration] = useState("1 Day");
  const [timings, setTimings] = useState("");

  // Options & Packages (Loaded dynamically from API)
  const [categoriesList, setCategoriesList] = useState(["Workshop", "Seminars", "Retreats", "Check-ups"]);
  const [areasList, setAreasList] = useState([]);
  const [modesList, setModesList] = useState(["Online", "On-site"]);
  const [durationsList, setDurationsList] = useState(["1/2 Day", "1 Day", "2 Days"]);
  const [timingsList, setTimingsList] = useState([]);

  const [eventsList, setEventsList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal details
  const [activePackageId, setActivePackageId] = useState(null);

  // Success Confirmation Modal
  const [successResult, setSuccessResult] = useState(null);

  // Fetch Options dynamically
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getCorporateCustomizeOptions(category)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.data || res.data || {};
        const camp = data.camp_information || data;

        if (camp.categories && Array.isArray(camp.categories)) {
          setCategoriesList(camp.categories);
        }
        if (camp.areas && Array.isArray(camp.areas)) {
          setAreasList(camp.areas);
          if (!area && camp.areas.length > 0) setArea(camp.areas[0]);
        }
        if (camp.modes && Array.isArray(camp.modes)) {
          setModesList(camp.modes);
          if (!mode && camp.modes.length > 0) setMode(camp.modes[0]);
        }
        if (camp.durations && Array.isArray(camp.durations)) {
          setDurationsList(camp.durations);
          if (!duration && camp.durations.length > 0) setDuration(camp.durations[0]);
        }
        if (camp.timings && Array.isArray(camp.timings)) {
          setTimingsList(camp.timings);
          if (!timings && camp.timings.length > 0) setTimings(camp.timings[0]);
        }

        const events = data.choose_event || data.events || (Array.isArray(data) ? data : []);
        setEventsList(events);
      })
      .catch((err) => {
        console.error("Error loading customize options:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  // Toggle package add / remove
  const togglePackage = (pkgId) => {
    setSelectedIds((prev) => {
      if (prev.includes(pkgId)) {
        return prev.filter((id) => id !== pkgId);
      } else {
        return [...prev, pkgId];
      }
    });
  };

  // Submit form
  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please add at least one event from the list below.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category,
        area,
        mode,
        event_date: eventDate,
        duration,
        timings,
        selected_package_ids: selectedIds,
        notes: `Customized corporate event for ${category}`
      };

      const res = await createCorporateCustomizeEvent(payload);
      if (res.data?.success) {
        setSuccessResult(res.data.data || { request_no: "REQ-EVT-260707-482" });
        toast.success("Event request submitted successfully!");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Failed to submit event request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="corporate">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        {/* ========================================================= */}
        {/* TOP BREADCRUMB & CONFIRM BUTTON */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[22px] sm:text-[26px] font-bold text-[#4D2E23]">
              <span
                onClick={() => navigate("/corporate/packages")}
                className="hover:underline cursor-pointer text-[#7F726A] font-semibold"
              >
                Request an Event
              </span>
              <HiOutlineChevronRight size={18} className="text-[#A49488]" />
              <span>Customize Event</span>
            </div>
            <p className="mt-1 text-[14px] text-[#7F726A]">
              Customize an event for your team.
            </p>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7A4B3A] hover:bg-[#643C2D] px-7 py-3 text-[14px] font-medium text-white transition shadow-sm shrink-0 self-start sm:self-auto disabled:opacity-60 cursor-pointer"
          >
            <span>{submitting ? "Submitting..." : "Confirm Details"}</span>
            <HiArrowRight size={16} />
          </button>
        </div>

        {/* ========================================================= */}
        {/* CAMP INFORMATION FORM */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <h2 className="text-[18px] font-bold text-[#4D2E23]">
            Camp Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Category */}
            <div>
              <label className="block text-xs font-semibold text-[#4D2E23] mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-[#EFE5DC] bg-white px-4 py-3 text-sm font-semibold text-[#4D2E23] shadow-sm outline-none transition focus:border-[#7A4B3A]"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <HiChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7F726A]" />
              </div>
            </div>

            {/* 2. Area */}
            <div>
              <label className="block text-xs font-semibold text-[#4D2E23] mb-2">
                Area
              </label>
              <div className="relative">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-[#EFE5DC] bg-white px-4 py-3 text-sm font-semibold text-[#4D2E23] shadow-sm outline-none transition focus:border-[#7A4B3A]"
                >
                  {areasList.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <HiChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7F726A]" />
              </div>
            </div>

            {/* 3. Mode */}
            <div>
              <label className="block text-xs font-semibold text-[#4D2E23] mb-2">
                Mode
              </label>
              <div className="relative">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-[#EFE5DC] bg-white px-4 py-3 text-sm font-semibold text-[#4D2E23] shadow-sm outline-none transition focus:border-[#7A4B3A]"
                >
                  {modesList.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <HiChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7F726A]" />
              </div>
            </div>

            {/* 4. Date */}
            <div>
              <label className="block text-xs font-semibold text-[#4D2E23] mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-2xl border border-[#EFE5DC] bg-white px-4 py-2.5 text-sm font-semibold text-[#4D2E23] shadow-sm outline-none transition focus:border-[#7A4B3A]"
                />
              </div>
            </div>

            {/* 5. Duration (Pills) */}
            <div>
              <label className="block text-xs font-semibold text-[#4D2E23] mb-2">
                Duration
              </label>
              <div className="flex items-center gap-2.5">
                {durationsList.map((dur) => {
                  const isSelected = duration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`flex-1 rounded-2xl px-4 py-2.5 text-sm font-semibold transition text-center shadow-sm ${
                        isSelected
                          ? "border-2 border-[#4D2E23] bg-white text-[#4D2E23]"
                          : "border border-[#EFE5DC] bg-white text-[#7F726A] hover:border-[#D5C2B4]"
                      }`}
                    >
                      {dur}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Timings */}
            <div>
              <label className="block text-xs font-semibold text-[#4D2E23] mb-2">
                Timings
              </label>
              <div className="relative">
                <select
                  value={timings}
                  onChange={(e) => setTimings(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-[#EFE5DC] bg-white px-4 py-3 text-sm font-semibold text-[#4D2E23] shadow-sm outline-none transition focus:border-[#7A4B3A]"
                >
                  {timingsList.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <HiChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7F726A]" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CHOOSE EVENT GRID */}
        {/* ========================================================= */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#4D2E23]">
              Choose Event
            </h2>
            <span className="text-xs font-semibold text-[#7A4B3A] bg-[#FAF4EF] px-3 py-1 rounded-full border border-[#EFE5DC]">
              {selectedIds.length} Selected
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#7F726A]">Loading events...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsList.map((pkg) => {
                const isAdded = selectedIds.includes(pkg.id);
                const badgeClass = getBadgeStyle(pkg.category_badge);

                return (
                  <div
                    key={pkg.id}
                    className={`flex flex-col rounded-[24px] border bg-white overflow-hidden shadow-sm transition duration-200 ${
                      isAdded ? "border-[#7A4B3A] ring-1 ring-[#7A4B3A]/20" : "border-[#EFE5DC] hover:shadow-md"
                    }`}
                  >
                    {/* Card Image Banner */}
                    <div className="relative h-44 w-full overflow-hidden bg-[#FAF4EF]">
                      <img
                        src={pkg.image_url}
                        alt={pkg.title}
                        className="h-full w-full object-cover"
                      />

                      {/* Top Right: + Add / ✓ Added Pill Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePackage(pkg.id);
                        }}
                        className={`absolute right-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-md transition ${
                          isAdded
                            ? "bg-white text-[#4D2E23] hover:bg-gray-100"
                            : "bg-white text-[#4D2E23] hover:bg-gray-100"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <HiCheck size={14} className="text-[#257A42] stroke-[2.5]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm font-bold leading-none">+</span>
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title & Category Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-[17px] font-bold text-[#4D2E23] truncate">
                            {pkg.title}
                          </h3>
                          <span className={`rounded-full px-3 py-0.5 text-xs font-semibold shrink-0 ${badgeClass}`}>
                            {pkg.category_badge || "Workshop"}
                          </span>
                        </div>

                        {/* Duration & Mode */}
                        <p className="mt-2 text-xs font-medium text-[#8A7C73]">
                          {pkg.duration} <span className="mx-1 text-[#D5C2B4]">|</span> {pkg.mode}
                        </p>

                        {/* Description */}
                        <p className="mt-2.5 text-[13px] text-[#6F5F56] leading-relaxed line-clamp-2">
                          {pkg.description}
                        </p>
                      </div>

                      {/* View Details Link */}
                      <div className="mt-4 pt-2 border-t border-[#F5ECE5]">
                        <button
                          type="button"
                          onClick={() => setActivePackageId(pkg.id)}
                          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#4D2E23] hover:text-[#7A4B3A] transition cursor-pointer"
                        >
                          <span>View Details</span>
                          <HiArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal for Details */}
        <PackageDetailsModal
          packageId={activePackageId}
          packageData={eventsList.find((p) => p.id === activePackageId)}
          isOpen={!!activePackageId}
          onClose={() => setActivePackageId(null)}
          onSelectPackage={() => {
            if (activePackageId && !selectedIds.includes(activePackageId)) {
              togglePackage(activePackageId);
            }
          }}
          isSelected={activePackageId ? selectedIds.includes(activePackageId) : false}
        />

        {/* SUCCESS CONFIRMATION MODAL */}
        {successResult && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md rounded-[28px] bg-white p-7 text-center shadow-2xl border border-[#EFE5DC]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F8EC] text-[#257A42] mb-4">
                <HiOutlineSparkles size={28} />
              </div>

              <h3 className="text-xl font-bold text-[#4D2E23]">
                Event Request Submitted!
              </h3>
              <p className="mt-2 text-sm text-[#7F726A]">
                Your request has been received. Our corporate wellness coordinator will contact you shortly.
              </p>

              <div className="mt-5 rounded-2xl bg-[#FAF6F2] p-4 text-left space-y-2 text-xs text-[#5D4E46]">
                <div className="flex justify-between">
                  <span className="text-[#8A7C73]">Request No:</span>
                  <span className="font-bold text-[#4D2E23]">{successResult.request_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A7C73]">Category:</span>
                  <span className="font-semibold text-[#4D2E23]">{successResult.category || category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A7C73]">Area:</span>
                  <span className="font-semibold text-[#4D2E23]">{successResult.area || area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A7C73]">Event Date:</span>
                  <span className="font-semibold text-[#4D2E23]">{successResult.event_date || eventDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A7C73]">Packages:</span>
                  <span className="font-semibold text-[#4D2E23]">{selectedIds.length} Sessions</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessResult(null);
                    navigate("/corporate/dashboard");
                  }}
                  className="w-full rounded-full bg-[#7A4B3A] hover:bg-[#643C2D] py-3 text-sm font-semibold text-white transition shadow-sm"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CorporateCustomizeEvent;
