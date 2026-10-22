import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight, HiChevronLeft, HiChevronRight, HiRefresh } from "react-icons/hi";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { getCorporateCellCompletedEvents } from "../../../api/corporateCellApi";

const DEFAULT_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80";

const getBadgeStyle = (type, badgeColor) => {
  const t = (type || "").toLowerCase();
  const c = (badgeColor || "").toLowerCase();

  if (c === "green" || t.includes("seminar")) {
    return "bg-[#E6F8EB] text-[#22843F]";
  }
  if (c === "purple" || t.includes("retreat")) {
    return "bg-[#F1EDFD] text-[#7F56D9]";
  }
  if (c === "blue" || t.includes("workshop") || t.includes("online")) {
    return "bg-[#E8F4FD] text-[#2563EB]";
  }
  if (c === "orange" || t.includes("talk") || t.includes("check-up")) {
    return "bg-[#FDF2E9] text-[#D97706]";
  }
  return "bg-[#EFE8DF] text-[#6F4432]";
};

const CorporateCellCompletedEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showingText, setShowingText] = useState("");

  const fetchCompletedEvents = async (currentPage) => {
    setLoading(true);
    try {
      const res = await getCorporateCellCompletedEvents({
        page: currentPage,
        limit,
      });

      if (res.data?.success) {
        const list = res.data.data || res.data.events || [];
        setEvents(list);
        setTotal(res.data.total ?? list.length);
        setTotalPages(res.data.total_pages || Math.max(1, Math.ceil((res.data.total || list.length) / limit)));
        setShowingText(
          res.data.showing_text ||
            `Showing Services ${(currentPage - 1) * limit + 1} - ${Math.min(
              currentPage * limit,
              res.data.total || list.length
            )} of ${res.data.total || list.length}`
        );
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Failed to fetch completed events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedEvents(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <DashboardLayout role="corporate_cell">
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 sm:p-8 shadow-2xs">
            {/* Header */}
            <div>
              <h1 className="text-[22px] sm:text-[24px] font-bold text-[#2C1810] tracking-tight">
                Completed Events
              </h1>
              <p className="text-[13.5px] text-[#7A6B63] mt-1">
                Review past events, view details, and upload event photos.
              </p>
            </div>

            {/* Divider */}
            <div className="border-b border-[#F0E8DF] my-5" />

            {/* Top Bar with Pagination */}
            <div className="flex items-center justify-end gap-3 mb-5">
              <span className="text-[12.5px] text-[#7A6B63] font-medium">
                {showingText || (events.length > 0 ? `Showing Services 1 - ${events.length} of ${total || events.length}` : "")}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={page <= 1 || loading}
                  className={`p-1.5 rounded-lg border transition ${
                    page <= 1 || loading
                      ? "border-[#EFE5DC] text-[#C4B7AC] cursor-not-allowed bg-[#FAF7F2]"
                      : "border-[#DFD3C6] text-[#4D2E23] hover:bg-[#F9F4EE] cursor-pointer"
                  }`}
                  aria-label="Previous Page"
                >
                  <HiChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page >= totalPages || loading}
                  className={`p-1.5 rounded-lg border transition ${
                    page >= totalPages || loading
                      ? "border-[#EFE5DC] text-[#C4B7AC] cursor-not-allowed bg-[#FAF7F2]"
                      : "border-[#DFD3C6] text-[#4D2E23] hover:bg-[#F9F4EE] cursor-pointer"
                  }`}
                  aria-label="Next Page"
                >
                  <HiChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {loading ? (
              <div className="flex items-center justify-center py-24 text-[#8A7D75] gap-2">
                <HiRefresh className="animate-spin text-[#6F4432]" size={22} />
                <span className="text-sm font-medium">Loading completed events...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="py-20 text-center text-[#8A7D75]">
                <p className="text-base font-semibold text-[#2C1810]">No completed events found</p>
                <p className="text-xs mt-1">There are no completed events recorded at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((evt) => {
                  const eventId = evt.id || evt.event_no;
                  const typeBadge = evt.type_badge || "Seminar";
                  const imageUrl = evt.image_url || DEFAULT_EVENT_IMAGE;

                  // Compose subtitle line if not present
                  const subtitle =
                    evt.subtitle_line ||
                    [evt.event_date_formatted || evt.event_date, evt.time_display, evt.title]
                      .filter(Boolean)
                      .join(" | ");

                  return (
                    <div
                      key={eventId}
                      className="rounded-2xl border border-[#F0E8DF] bg-white p-4 sm:p-5 transition hover:border-[#E0D2C4] hover:shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                          {/* Image Thumbnail */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F4EDE4] border border-[#EFE5DC]">
                            <img
                              src={imageUrl}
                              alt={evt.title || evt.company_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_EVENT_IMAGE;
                              }}
                            />
                          </div>

                          {/* Text Information */}
                          <div className="min-w-0">
                            <h3 className="text-[16px] sm:text-[17px] font-bold text-[#2C1810] truncate">
                              {evt.company_name || evt.title}
                            </h3>
                            <p className="text-[13px] text-[#7A6B63] mt-1 truncate">
                              {subtitle}
                            </p>
                            <p className="text-[13px] text-[#8C7E74] mt-1 line-clamp-1">
                              {evt.description || "Improves focus, reduces stress and enhances well-being."}
                            </p>
                          </div>
                        </div>

                        {/* Right: Badge & Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between shrink-0 sm:h-20 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F2EAE1]">
                          <span
                            className={`rounded-full px-3.5 py-1 text-[11px] font-semibold tracking-wide ${getBadgeStyle(
                              typeBadge,
                              evt.badge_color
                            )}`}
                          >
                            {typeBadge}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/corporate-cell/completed-events/${eventId}`)
                            }
                            className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#4D2E23] hover:text-[#2C1810] transition cursor-pointer"
                          >
                            <span>{evt.action_text || "View & Upload"}</span>
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateCellCompletedEvents;

