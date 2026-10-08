import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiX, HiCheck, HiOutlineClock, HiOutlineUsers } from "react-icons/hi";
import { getCorporatePackageDetails } from "../../../api/corporateDashboardApi";

const PackageDetailsModal = ({
  packageId,
  packageData,
  isOpen,
  onClose,
  onSelectPackage,
  isSelected
}) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fetch package details
  useEffect(() => {
    if (!isOpen || !packageId) {
      setDetails(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getCorporatePackageDetails(packageId)
      .then((res) => {
        if (!isMounted) return;
        const apiData = res.data?.data || res.data;
        if (apiData && (apiData.title || apiData.id)) {
          setDetails(apiData);
        } else if (packageData) {
          setDetails(packageData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Could not load package details from API, using fallback data if available:", err);
        if (isMounted) {
          if (packageData) {
            setDetails(packageData);
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, packageId, packageData]);

  if (!isOpen) return null;

  const current = details || packageData;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl min-h-[340px] max-h-[90vh] overflow-y-auto rounded-[28px] bg-white shadow-2xl border border-[#EFE5DC] hide-scrollbar flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#4D2E23] shadow-md hover:bg-white transition cursor-pointer"
        >
          <HiX size={20} />
        </button>

        {loading && !current ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#7F726A] space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#7A4B3A] border-t-transparent" />
            <p className="text-sm font-medium">Loading event details...</p>
          </div>
        ) : current ? (
          <div>
            {/* Banner Image */}
            <div className="relative h-56 w-full overflow-hidden rounded-t-[28px] bg-[#FAF4EF]">
              {current.image_url ? (
                <img
                  src={current.image_url}
                  alt={current.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-[#FAF4EF] to-[#F5ECE1]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                <span className="rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-[#4D2E23] shadow">
                  {current.category_badge || current.category || "Workshop"}
                </span>
                <span className="text-xs font-semibold text-white/90">
                  {current.duration || "1 Day"} • {current.mode || "On-site"}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-7 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#4D2E23]">{current.title}</h2>
                <p className="mt-1.5 text-sm text-[#7F726A] leading-relaxed">
                  {current.subtitle || current.description || "Improves focus, reduces stress and enhances well-being."}
                </p>
              </div>

              {/* Metrics strip */}
              <div className="flex flex-wrap gap-4 border-y border-[#EFE5DC] py-4">
                <div className="flex items-center gap-2 text-sm text-[#4D2E23]">
                  <HiOutlineClock className="text-[#7A4B3A]" size={18} />
                  <span>
                    Duration:{" "}
                    <strong className="font-semibold">
                      {current.session_duration || current.duration || "60 - 90 minutes"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#4D2E23]">
                  <HiOutlineUsers className="text-[#7A4B3A]" size={18} />
                  <span>
                    Max Capacity:{" "}
                    <strong className="font-semibold">
                      {current.max_participants ? `${current.max_participants} participants` : "100+ participants"}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Key Benefits */}
              {current.benefits && current.benefits.length > 0 && (
                <div>
                  <h3 className="text-[16px] font-bold text-[#4D2E23] mb-3">Key Benefits</h3>
                  <div className="space-y-2">
                    {current.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-[#5D4E46]">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F8EC] text-[#257A42]">
                          <HiCheck size={14} />
                        </span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions */}
              {current.inclusions && current.inclusions.length > 0 && (
                <div>
                  <h3 className="text-[16px] font-bold text-[#4D2E23] mb-3">What&apos;s Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {current.inclusions.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl bg-[#FAF6F2] p-2.5 text-xs font-medium text-[#4D2E23]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#7A4B3A]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-[#EFE5DC] px-6 py-2.5 text-sm font-semibold text-[#7F726A] hover:bg-[#FAF4EF] transition cursor-pointer"
                >
                  Close
                </button>
                {onSelectPackage && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPackage(current);
                      onClose();
                    }}
                    className={`rounded-full px-7 py-2.5 text-sm font-semibold transition shadow-sm cursor-pointer ${
                      isSelected
                        ? "bg-[#257A42] text-white hover:bg-[#1E6637]"
                        : "bg-[#7A4B3A] text-white hover:bg-[#643C2D]"
                    }`}
                  >
                    {isSelected ? "✓ Added to Custom Event" : "+ Add to Custom Event"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
            <p className="text-base font-semibold text-[#4D2E23]">Unable to load event details</p>
            <p className="text-xs text-[#7F726A]">Please check your connection and try again.</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#7A4B3A] px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#643C2D] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default PackageDetailsModal;
