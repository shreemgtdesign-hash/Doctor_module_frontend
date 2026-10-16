import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { submitCorporateEventFeedback, getCorporatePackageDetails } from "../../../api/corporateDashboardApi";

// Default event metadata matching Screenshot 1 specification
const DEFAULT_EVENT = {
  id: "e7a8b002-628d-4b82-9842-7cf3b04c9002",
  title: "Stress Management",
  category: "Seminar",
  description: "Improves focus, reduces stress and enhances well-being.",
  formatted_date: "17th November, 2026",
  timings: "10AM - 1PM",
  attendees_label: "97 Attendees",
  image_url:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
};


const CorporateEventFeedback = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Resolved event ID
  const resolvedEventId = useMemo(() => {
    return (
      eventId ||
      location.state?.event?.id ||
      location.state?.eventId ||
      searchParams.get("event_id") ||
      DEFAULT_EVENT.id
    );
  }, [eventId, location.state, searchParams]);

  // Event details to show on the top banner
  const [eventData, setEventData] = useState(() => {
    if (location.state?.event) {
      return { ...DEFAULT_EVENT, ...location.state.event };
    }
    return DEFAULT_EVENT;
  });

  // Fetch event details if specific eventId provided and not in state
  useEffect(() => {
    if (resolvedEventId && resolvedEventId !== DEFAULT_EVENT.id && !location.state?.event) {
      getCorporatePackageDetails(resolvedEventId)
        .then((res) => {
          const fetched = res.data?.data || res.data;
          if (fetched && (fetched.title || fetched.name)) {
            setEventData((prev) => ({
              ...prev,
              ...fetched,
              title: fetched.title || fetched.name || prev.title,
              description: fetched.description || prev.description,
              category: fetched.category || prev.category,
              timings: fetched.timings || fetched.time || prev.timings,
              formatted_date: fetched.formatted_date || fetched.date || prev.formatted_date,
              image_url: fetched.image_url || prev.image_url,
            }));
          }
        })
        .catch(() => {
          // Keep current eventData on error
        });
    }
  }, [resolvedEventId, location.state]);

  // Form state matching exact API keys
  const [formData, setFormData] = useState({
    overall_rating: 0,
    overall_comments: "",
    relevance: "",
    relevance_comments: "",
    logistics: "",
    logistics_comments: "",
    engagement: "",
    engagement_comments: "",
    future_workshops: "",
    future_workshops_comments: "",
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Field change handlers
  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, overall_rating: rating }));
  };

  const handleSelectOption = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.overall_rating) {
      toast.error("Please provide an overall rating");
      return;
    }

    setSubmitting(true);
    const payload = {
      event_id: resolvedEventId,
      overall_rating: Number(formData.overall_rating),
      overall_comments: formData.overall_comments.trim(),
      relevance: formData.relevance || "Good",
      relevance_comments: formData.relevance_comments.trim(),
      logistics: formData.logistics || "Good",
      logistics_comments: formData.logistics_comments.trim(),
      engagement: formData.engagement || "Good",
      engagement_comments: formData.engagement_comments.trim(),
      future_workshops: formData.future_workshops || "Yes",
      future_workshops_comments: formData.future_workshops_comments.trim(),
    };

    try {
      const res = await submitCorporateEventFeedback(payload);
      const msg = res.data?.message || "Event feedback submitted successfully";
      toast.success(msg);
      navigate("/corporate/my-events");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit event feedback. Please try again.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Custom Radio Option Component
  const renderRadioOption = (name, value, isChecked, onChange) => {
    return (
      <label
        key={value}
        onClick={() => onChange(value)}
        className="flex items-center gap-3 cursor-pointer group select-none py-1"
      >
        <span
          className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-all ${
            isChecked
              ? "border-[#4D2E23] bg-white ring-2 ring-[#4D2E23]/20"
              : "border-[#BCAEA5] bg-white group-hover:border-[#4D2E23]"
          }`}
        >
          {isChecked && (
            <span className="h-[9px] w-[9px] rounded-full bg-[#4D2E23]" />
          )}
        </span>
        <span
          className={`text-[14px] transition ${
            isChecked
              ? "font-semibold text-[#2C1810]"
              : "font-normal text-[#4D2E23] group-hover:text-[#2C1810]"
          }`}
        >
          {value}
        </span>
      </label>
    );
  };

  return (
    <DashboardLayout role="corporate">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================= */}
        {/* TOP BAR: Back Navigation */}
        {/* ========================================================= */}
        <div>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#2C1810] hover:text-[#5A3728] transition cursor-pointer"
          >
            <HiOutlineArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* HEADER: Title & Subtitle */}
        {/* ========================================================= */}
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#2C1810] tracking-tight">
            Event Feedback
          </h1>
          <p className="mt-1 text-[14px] text-[#7F726A]">
            Help us understand your experience so we can make future sessions even better.
          </p>
        </div>

        {/* ========================================================= */}
        {/* EVENT BANNER CARD (Stress Management) */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-[#EFE5DC] bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-xs">
          {/* Thumbnail */}
          <div className="w-[110px] h-[78px] sm:w-[130px] sm:h-[88px] rounded-xl overflow-hidden shrink-0 bg-[#F5ECE5]">
            <img
              src={eventData.image_url}
              alt={eventData.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_EVENT.image_url;
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-[#2C1810] tracking-tight truncate">
                {eventData.title}
              </h2>
              <span className="shrink-0 rounded-full bg-[#E0F2FE] px-3.5 py-0.5 text-xs font-semibold text-[#0284C7]">
                {eventData.category || "Seminar"}
              </span>
            </div>

            <p className="mt-1 text-[13px] text-[#6B5E57] line-clamp-1">
              {eventData.description}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] sm:text-[13px] text-[#8B7A70]">
              <span>{eventData.formatted_date}</span>
              <span className="text-[#D5C2B4]">|</span>
              <span>{eventData.timings}</span>
              <span className="text-[#D5C2B4]">|</span>
              <span>{eventData.attendees_label || "97 Attendees"}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FEEDBACK FORM */}
        {/* ========================================================= */}
        <form onSubmit={handleSubmit} className="divide-y divide-[#EFE5DC]">
          {/* SECTION 1: Overall Experience */}
          <div className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-2">
              <h3 className="text-[16px] font-bold text-[#2C1810]">
                Overall Experience
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#7F726A]">
                How would you rate your overall experience of the event?
              </p>

              {/* Star Rating Interaction */}
              <div className="pt-2 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled =
                    (hoverRating || formData.overall_rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                      aria-label={`Rate ${star} star`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={isFilled ? "#5A3728" : "none"}
                        stroke={isFilled ? "#5A3728" : "#BCAEA5"}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-7 h-7 sm:w-8 sm:h-8 transition-colors"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <label
                htmlFor="overall_comments"
                className="block text-[13px] font-bold text-[#2C1810]"
              >
                Additional Comments (Optional)
              </label>
              <textarea
                id="overall_comments"
                rows={3}
                value={formData.overall_comments}
                onChange={(e) =>
                  handleTextChange("overall_comments", e.target.value)
                }
                placeholder="Enter Comments"
                className="w-full rounded-2xl border border-[#E7DCD2] bg-white p-3.5 text-sm text-[#2C1810] placeholder:text-[#B4A69C] focus:border-[#5A3728] focus:ring-2 focus:ring-[#5A3728]/15 outline-none resize-none transition"
              />
            </div>
          </div>

          {/* SECTION 2: Relevance */}
          <div className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-2">
              <h3 className="text-[16px] font-bold text-[#2C1810]">
                Relevance
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#7F726A]">
                How relevant and useful was the event?
              </p>

              <div className="pt-2 grid grid-cols-2 gap-x-8 gap-y-3 max-w-sm">
                <div>
                  {renderRadioOption(
                    "relevance",
                    "Excellent",
                    formData.relevance === "Excellent",
                    (val) => handleSelectOption("relevance", val)
                  )}
                  {renderRadioOption(
                    "relevance",
                    "Average",
                    formData.relevance === "Average",
                    (val) => handleSelectOption("relevance", val)
                  )}
                </div>
                <div>
                  {renderRadioOption(
                    "relevance",
                    "Good",
                    formData.relevance === "Good",
                    (val) => handleSelectOption("relevance", val)
                  )}
                  {renderRadioOption(
                    "relevance",
                    "Poor",
                    formData.relevance === "Poor",
                    (val) => handleSelectOption("relevance", val)
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <label
                htmlFor="relevance_comments"
                className="block text-[13px] font-bold text-[#2C1810]"
              >
                Additional Comments (Optional)
              </label>
              <textarea
                id="relevance_comments"
                rows={3}
                value={formData.relevance_comments}
                onChange={(e) =>
                  handleTextChange("relevance_comments", e.target.value)
                }
                placeholder="Enter Comments"
                className="w-full rounded-2xl border border-[#E7DCD2] bg-white p-3.5 text-sm text-[#2C1810] placeholder:text-[#B4A69C] focus:border-[#5A3728] focus:ring-2 focus:ring-[#5A3728]/15 outline-none resize-none transition"
              />
            </div>
          </div>

          {/* SECTION 3: Logistics and Arrangements */}
          <div className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-2">
              <h3 className="text-[16px] font-bold text-[#2C1810]">
                Logistics and Arrangements
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#7F726A]">
                How would you rate the logistics and arrangements?
              </p>

              <div className="pt-2 grid grid-cols-2 gap-x-8 gap-y-3 max-w-sm">
                <div>
                  {renderRadioOption(
                    "logistics",
                    "Excellent",
                    formData.logistics === "Excellent",
                    (val) => handleSelectOption("logistics", val)
                  )}
                  {renderRadioOption(
                    "logistics",
                    "Average",
                    formData.logistics === "Average",
                    (val) => handleSelectOption("logistics", val)
                  )}
                </div>
                <div>
                  {renderRadioOption(
                    "logistics",
                    "Good",
                    formData.logistics === "Good",
                    (val) => handleSelectOption("logistics", val)
                  )}
                  {renderRadioOption(
                    "logistics",
                    "Poor",
                    formData.logistics === "Poor",
                    (val) => handleSelectOption("logistics", val)
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <label
                htmlFor="logistics_comments"
                className="block text-[13px] font-bold text-[#2C1810]"
              >
                Additional Comments (Optional)
              </label>
              <textarea
                id="logistics_comments"
                rows={3}
                value={formData.logistics_comments}
                onChange={(e) =>
                  handleTextChange("logistics_comments", e.target.value)
                }
                placeholder="Enter Comments"
                className="w-full rounded-2xl border border-[#E7DCD2] bg-white p-3.5 text-sm text-[#2C1810] placeholder:text-[#B4A69C] focus:border-[#5A3728] focus:ring-2 focus:ring-[#5A3728]/15 outline-none resize-none transition"
              />
            </div>
          </div>

          {/* SECTION 4: Participant Engagement */}
          <div className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-2">
              <h3 className="text-[16px] font-bold text-[#2C1810]">
                Participant Engagement
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#7F726A]">
                How would you rate the engagement and interaction with the trainer?
              </p>

              <div className="pt-2 grid grid-cols-2 gap-x-8 gap-y-3 max-w-sm">
                <div>
                  {renderRadioOption(
                    "engagement",
                    "Excellent",
                    formData.engagement === "Excellent",
                    (val) => handleSelectOption("engagement", val)
                  )}
                  {renderRadioOption(
                    "engagement",
                    "Average",
                    formData.engagement === "Average",
                    (val) => handleSelectOption("engagement", val)
                  )}
                </div>
                <div>
                  {renderRadioOption(
                    "engagement",
                    "Good",
                    formData.engagement === "Good",
                    (val) => handleSelectOption("engagement", val)
                  )}
                  {renderRadioOption(
                    "engagement",
                    "Poor",
                    formData.engagement === "Poor",
                    (val) => handleSelectOption("engagement", val)
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <label
                htmlFor="engagement_comments"
                className="block text-[13px] font-bold text-[#2C1810]"
              >
                Additional Comments (Optional)
              </label>
              <textarea
                id="engagement_comments"
                rows={3}
                value={formData.engagement_comments}
                onChange={(e) =>
                  handleTextChange("engagement_comments", e.target.value)
                }
                placeholder="Enter Comments"
                className="w-full rounded-2xl border border-[#E7DCD2] bg-white p-3.5 text-sm text-[#2C1810] placeholder:text-[#B4A69C] focus:border-[#5A3728] focus:ring-2 focus:ring-[#5A3728]/15 outline-none resize-none transition"
              />
            </div>
          </div>

          {/* SECTION 5: Future workshops */}
          <div className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-2">
              <h3 className="text-[16px] font-bold text-[#2C1810]">
                Future workshops
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#7F726A]">
                Would you like to have similar sessions in the future?
              </p>

              <div className="pt-2 grid grid-cols-2 gap-x-8 gap-y-3 max-w-sm">
                <div>
                  {renderRadioOption(
                    "future_workshops",
                    "Yes",
                    formData.future_workshops === "Yes",
                    (val) => handleSelectOption("future_workshops", val)
                  )}
                  {renderRadioOption(
                    "future_workshops",
                    "Maybe",
                    formData.future_workshops === "Maybe",
                    (val) => handleSelectOption("future_workshops", val)
                  )}
                </div>
                <div>
                  {renderRadioOption(
                    "future_workshops",
                    "No",
                    formData.future_workshops === "No",
                    (val) => handleSelectOption("future_workshops", val)
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <label
                htmlFor="future_workshops_comments"
                className="block text-[13px] font-bold text-[#2C1810]"
              >
                Additional Comments (Optional)
              </label>
              <textarea
                id="future_workshops_comments"
                rows={3}
                value={formData.future_workshops_comments}
                onChange={(e) =>
                  handleTextChange("future_workshops_comments", e.target.value)
                }
                placeholder="Enter Comments"
                className="w-full rounded-2xl border border-[#E7DCD2] bg-white p-3.5 text-sm text-[#2C1810] placeholder:text-[#B4A69C] focus:border-[#5A3728] focus:ring-2 focus:ring-[#5A3728]/15 outline-none resize-none transition"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM ACTIONS */}
          {/* ========================================================= */}
          <div className="pt-6 pb-12 flex items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-[#E8DCD2] bg-[#FAF6F2] hover:bg-[#F3ECE5] px-10 py-2.5 text-sm font-semibold text-[#4D2E23] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#5A3728] hover:bg-[#482b1f] px-12 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CorporateEventFeedback;
