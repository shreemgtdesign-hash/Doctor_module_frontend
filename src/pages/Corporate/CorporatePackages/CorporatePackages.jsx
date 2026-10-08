import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiChevronDown, HiArrowRight } from "react-icons/hi";
import { getCorporatePackages } from "../../../api/corporateDashboardApi";
import PackageDetailsModal from "../components/PackageDetailsModal";
import DashboardLayout from "../../../components/Layout/DashboardLayout";

const CATEGORIES = ["All", "Seminars", "Retreats", "Workshop", "Check-ups"];
const DURATIONS = ["All", "1/2 Day", "1 Day", "2 Days"];

const getBadgeStyle = (badge, color) => {
  const b = (badge || color || "").toLowerCase();
  if (b.includes("seminar") || b.includes("green")) {
    return "bg-[#E8F8EC] text-[#257A42]";
  }
  if (b.includes("retreat") || b.includes("purple")) {
    return "bg-[#F4EDFC] text-[#6E3BB5]";
  }
  if (b.includes("check") || b.includes("pink") || b.includes("red")) {
    return "bg-[#FDECEC] text-[#D32F2F]";
  }
  return "bg-[#EAF4FD] text-[#236CB2]";
};

const CorporatePackages = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDuration, setActiveDuration] = useState("All");
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({
    total_count: 47,
    page: 1,
    limit: 6,
    total_pages: 8,
    showing_text: "Showing Services 1 - 6 of 47"
  });
  const [loading, setLoading] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await getCorporatePackages({
        category: activeCategory,
        duration: activeDuration,
        page: currentPage,
        limit: 6
      });
      if (res.data?.success) {
        setPackages(res.data.data || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [activeCategory, activeDuration, currentPage]);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    } else if (direction === "next" && currentPage < (pagination.total_pages || 8)) {
      setCurrentPage((p) => p + 1);
    }
  };

  return (
    <DashboardLayout role="corporate">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================= */}
        {/* HEADER: Title, Subtitle, Customize Button */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[28px] font-bold text-[#4D2E23] tracking-tight">
              Request an Event
            </h1>
            <p className="mt-1 text-[14px] text-[#7F726A]">
              Choose from our wellness offerings or customize an event for your team.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/corporate/customize-event")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7A4B3A] hover:bg-[#643C2D] px-6 py-2.5 text-[14px] font-medium text-white transition shadow-sm shrink-0 self-start sm:self-auto"
          >
            <span>Customize Event</span>
            <HiArrowRight size={16} />
          </button>
        </div>

        {/* ========================================================= */}
        {/* CATEGORY TABS */}
        {/* ========================================================= */}
        <div className="border-b border-[#EFE5DC]">
          <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`pb-3 text-[14px] font-medium transition-all whitespace-nowrap relative ${
                    isActive
                      ? "text-[#4D2E23] font-bold border-b-2 border-[#4D2E23]"
                      : "text-[#7F726A] hover:text-[#4D2E23]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* FILTER BAR: Duration dropdown + Pagination info */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-4 pt-1">
          {/* Duration Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDurationDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-[#EFE5DC] bg-white px-4 py-2 text-xs font-semibold text-[#4D2E23] shadow-sm hover:border-[#D5C2B4] transition"
            >
              <span>{activeDuration === "All" ? "Select Duration" : `Duration: ${activeDuration}`}</span>
              <HiChevronDown size={15} className={`text-[#7F726A] transition-transform ${durationDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {durationDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 z-20 w-44 rounded-2xl border border-[#EFE5DC] bg-white p-1.5 shadow-xl">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      setActiveDuration(dur);
                      setDurationDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left rounded-xl px-3.5 py-2 text-xs transition ${
                      activeDuration === dur
                        ? "bg-[#FAF4EF] font-bold text-[#4D2E23]"
                        : "text-[#7F726A] hover:bg-[#FAF6F2] hover:text-[#4D2E23]"
                    }`}
                  >
                    {dur === "All" ? "All Durations" : dur}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Showing Count & Pagination Arrows */}
          <div className="flex items-center gap-3 text-xs text-[#7F726A]">
            <span>{pagination.showing_text || `Showing Services 1 - ${packages.length} of 47`}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePageChange("prev")}
                disabled={currentPage <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EFE5DC] bg-white text-[#4D2E23] hover:bg-[#FAF4EF] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                <HiOutlineChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => handlePageChange("next")}
                disabled={currentPage >= (pagination.total_pages || 8)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EFE5DC] bg-white text-[#4D2E23] hover:bg-[#FAF4EF] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                <HiOutlineChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PACKAGES GRID (3 COLUMNS) */}
        {/* ========================================================= */}
        {loading ? (
          <div className="py-20 text-center text-[#7F726A]">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="py-20 text-center rounded-[24px] border border-dashed border-[#EFE5DC] bg-white p-8">
            <h3 className="text-lg font-bold text-[#4D2E23]">No events found</h3>
            <p className="mt-1 text-sm text-[#7F726A]">Try changing your category or duration filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const badgeClass = getBadgeStyle(pkg.category_badge, pkg.badge_color);

              return (
                <div
                  key={pkg.id}
                  className="flex flex-col rounded-[24px] border border-[#EFE5DC] bg-white overflow-hidden shadow-sm hover:shadow-md transition duration-200"
                >
                  {/* Card Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#FAF4EF]">
                    <img
                      src={pkg.image_url}
                      alt={pkg.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title & Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[17px] font-bold text-[#4D2E23] truncate">
                          {pkg.title}
                        </h3>
                        <span className={`rounded-full px-3 py-0.5 text-xs font-semibold shrink-0 ${badgeClass}`}>
                          {pkg.category_badge || pkg.category || "Workshop"}
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
                        onClick={() => setSelectedPackageId(pkg.id)}
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

        {/* Modal for Details */}
        <PackageDetailsModal
          packageId={selectedPackageId}
          packageData={packages.find((p) => p.id === selectedPackageId)}
          isOpen={!!selectedPackageId}
          onClose={() => setSelectedPackageId(null)}
          onSelectPackage={() => {
            navigate("/corporate/customize-event");
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default CorporatePackages;
