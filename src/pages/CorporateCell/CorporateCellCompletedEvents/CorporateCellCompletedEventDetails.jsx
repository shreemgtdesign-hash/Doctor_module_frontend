import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlineTrash,
  HiRefresh,
  HiOutlinePhotograph,
  HiX,
} from "react-icons/hi";
import { LuCloudUpload, LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  getCorporateCellCompletedEventDetails,
  getCorporateCellCompletedEventGallery,
  updateCorporateCellCompletedEventGallery,
  deleteCorporateCellGalleryItem,
} from "../../../api/corporateCellApi";

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

const extractDateBadge = (evt) => {
  if (evt?.date_badge?.month && evt?.date_badge?.day) {
    return evt.date_badge;
  }
  const dateStr = evt?.event_date_formatted || evt?.event_date;
  if (!dateStr) return { month: "OCT", day: "22" };

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const monthNames = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC",
      ];
      return {
        month: monthNames[d.getMonth()],
        day: String(d.getDate()),
      };
    }
  } catch (_) {}

  const match = String(dateStr).match(/(\d+)(?:st|nd|rd|th)?\s+([A-Za-z]+)/i);
  if (match) {
    const day = match[1];
    const month = match[2].slice(0, 4).toUpperCase();
    return { month: month.startsWith("SEPT") ? "SEPT" : month.slice(0, 3), day };
  }

  return { month: "OCT", day: "22" };
};

const CorporateCellCompletedEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTab, setUploadTab] = useState("file"); // 'file' | 'url'
  const [previewUrl, setPreviewUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch Event Details & Gallery
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const detailsRes = await getCorporateCellCompletedEventDetails(id);
        if (!isMounted) return;

        if (detailsRes.data?.success && detailsRes.data?.data) {
          const data = detailsRes.data.data;
          setEventData(data);

          // Initial gallery from event details or separate gallery call
          const initialGallery =
            data.gallery || data.image_gallery || [];
          setGallery(Array.isArray(initialGallery) ? initialGallery : []);
        }

        // Also fetch gallery endpoint to ensure latest items
        try {
          const galleryRes = await getCorporateCellCompletedEventGallery(id);
          if (!isMounted) return;
          if (galleryRes.data?.success && Array.isArray(galleryRes.data?.data?.gallery)) {
            setGallery(galleryRes.data.data.gallery);
          }
        } catch (gErr) {
          console.warn("Secondary gallery fetch note:", gErr);
        }
      } catch (err) {
        console.error("Failed to fetch completed event details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Open file dialog or modal
  const handleOpenUpload = () => {
    setPreviewUrl("");
    setInputUrl("");
    setImageTitle("");
    setShowUploadModal(true);
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      if (!imageTitle) {
        setImageTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit new photo to gallery
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const finalMediaUrl = uploadTab === "file" ? previewUrl : inputUrl.trim();

    if (!finalMediaUrl) {
      toast.error(
        uploadTab === "file" ? "Please choose an image file" : "Please enter an image URL"
      );
      return;
    }

    setUploading(true);
    try {
      // Build clean gallery payload
      const existingClean = (gallery || []).map((item) => ({
        media_url: item.media_url || item.image_url || item.thumbnail_url,
        media_type: item.media_type || "image",
        title: item.title || "Event Photo",
      }));

      const newEntry = {
        media_url: finalMediaUrl,
        media_type: "image",
        title: imageTitle.trim() || "Event Photo",
      };

      const payload = {
        gallery: [...existingClean, newEntry],
      };

      const res = await updateCorporateCellCompletedEventGallery(id, payload);

      if (res.data?.success) {
        toast.success(res.data.message || "Event gallery updated successfully");
        const updatedList =
          res.data.data?.gallery || res.data.data?.image_gallery;
        if (Array.isArray(updatedList)) {
          setGallery(updatedList);
        } else {
          // Fallback append locally
          setGallery((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              ...newEntry,
              image_url: finalMediaUrl,
            },
          ]);
        }
      } else {
        toast.success("Photo uploaded successfully");
        setGallery((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            ...newEntry,
            image_url: finalMediaUrl,
          },
        ]);
      }

      setShowUploadModal(false);
      setPreviewUrl("");
      setInputUrl("");
      setImageTitle("");
    } catch (err) {
      console.error("Upload gallery error:", err);
      toast.error(err.response?.data?.message || "Failed to upload image to gallery");
    } finally {
      setUploading(false);
    }
  };

  // Delete image from gallery
  const handleDeleteImage = async (galleryItemId, index) => {
    const targetId = galleryItemId || gallery[index]?.id;
    if (!targetId) {
      // If no ID exists, filter out by index
      setGallery((prev) => prev.filter((_, idx) => idx !== index));
      toast.success("Image removed");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this photo from the event gallery?")) {
      return;
    }

    setDeletingId(targetId);
    try {
      const res = await deleteCorporateCellGalleryItem(id, targetId);
      if (res.data?.success) {
        toast.success(res.data.message || "Gallery item deleted successfully");
        if (Array.isArray(res.data.data?.gallery)) {
          setGallery(res.data.data.gallery);
        } else {
          setGallery((prev) => prev.filter((item, idx) => item.id !== targetId && idx !== index));
        }
      } else {
        setGallery((prev) => prev.filter((item, idx) => item.id !== targetId && idx !== index));
        toast.success("Gallery item deleted successfully");
      }
    } catch (err) {
      console.error("Delete gallery error:", err);
      // Fallback: If delete endpoint fails or 404s, try updating gallery via PUT without this item
      try {
        const filtered = gallery.filter((item, idx) => item.id !== targetId && idx !== index);
        await updateCorporateCellCompletedEventGallery(id, {
          gallery: filtered.map((item) => ({
            media_url: item.media_url || item.image_url,
            media_type: item.media_type || "image",
            title: item.title || "Event Photo",
          })),
        });
        setGallery(filtered);
        toast.success("Gallery item deleted successfully");
      } catch (fallbackErr) {
        toast.error(err.response?.data?.message || "Failed to delete gallery image");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="corporate_cell">
        <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] flex items-center justify-center p-6">
          <div className="flex items-center gap-2 text-[#7A6B63]">
            <HiRefresh className="animate-spin text-[#6F4432]" size={24} />
            <span className="text-sm font-medium">Loading event details...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const dateBadge = extractDateBadge(eventData || {});
  const typeBadge = eventData?.type_badge || "Seminar";
  const badgeColor = eventData?.badge_color || "green";
  const tiles = eventData?.info_tiles || {};

  return (
    <DashboardLayout role="corporate_cell">
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/corporate-cell/completed-events")}
            className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2C1810] hover:text-[#6B4226] transition cursor-pointer"
          >
            <HiArrowLeft size={16} />
            <span>Back to Completed Events</span>
          </button>

          {/* Hero Event Card */}
          <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left Date + Titles */}
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                {/* Date Badge */}
                <div className="flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 flex-col items-center justify-center rounded-xl border border-[#EFE5DC] bg-[#F8F2EA]">
                  <span className="text-[11px] font-bold tracking-wider text-[#8A5A43] uppercase">
                    {dateBadge.month}
                  </span>
                  <span className="text-[22px] font-bold text-[#2C1810] leading-none mt-0.5">
                    {dateBadge.day}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="min-w-0">
                  <h1 className="text-[20px] sm:text-[22px] font-bold text-[#2C1810] truncate">
                    {eventData?.title || "Nutrition & Diet"}
                  </h1>
                  {eventData?.company_name && (
                    <p className="text-[14px] text-[#6B5E55] font-medium mt-0.5 truncate">
                      {eventData.company_name}
                    </p>
                  )}
                  <p className="text-[13px] text-[#8C7E74] mt-0.5">
                    {eventData?.time_display || "10 AM- 11:30 AM"}
                    <span className="mx-2">|</span>
                    <span>{eventData?.mode || eventData?.location || "On-site"}</span>
                  </p>
                </div>
              </div>

              {/* Right Type Badge */}
              <div className="shrink-0 self-start sm:self-center">
                <span
                  className={`rounded-full px-3.5 py-1 text-[11px] font-semibold tracking-wide ${getBadgeStyle(
                    typeBadge,
                    badgeColor
                  )}`}
                >
                  {typeBadge}
                </span>
              </div>
            </div>
          </div>

          {/* 8 Info Tiles (4 columns x 2 rows on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Tile 1: DATE */}
            <div className="bg-white border border-[#EFE5DC] rounded-2xl p-4 sm:p-5 flex flex-col justify-center min-h-[72px] shadow-2xs">
              <span className="text-[11px] font-bold text-[#8C7E74] tracking-wider uppercase mb-1">
                DATE
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#2C1810] truncate">
                {tiles.date || eventData?.event_date_formatted || "—"}
              </span>
            </div>

            {/* Tile 2: TIME */}
            <div className="bg-white border border-[#EFE5DC] rounded-2xl p-4 sm:p-5 flex flex-col justify-center min-h-[72px] shadow-2xs">
              <span className="text-[11px] font-bold text-[#8C7E74] tracking-wider uppercase mb-1">
                TIME
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#2C1810] truncate">
                {tiles.time || eventData?.time_display || "—"}
              </span>
            </div>

            {/* Tile 3: DOCTORS */}
            <div className="bg-white border border-[#EFE5DC] rounded-2xl p-4 sm:p-5 flex flex-col justify-center min-h-[72px] shadow-2xs">
              <span className="text-[11px] font-bold text-[#8C7E74] tracking-wider uppercase mb-1">
                DOCTORS
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#2C1810] truncate">
                {tiles.doctors || "—"}
              </span>
            </div>

            {/* Tile 4: FACILITATORS */}
            <div className="bg-white border border-[#EFE5DC] rounded-2xl p-4 sm:p-5 flex flex-col justify-center min-h-[72px] shadow-2xs">
              <span className="text-[11px] font-bold text-[#8C7E74] tracking-wider uppercase mb-1">
                FACILITATORS
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#2C1810] truncate">
                {tiles.facilitators || "—"}
              </span>
            </div>

            {/* Tile 5: ATTENDEES */}
            <div className="bg-white border border-[#EFE5DC] rounded-2xl p-4 sm:p-5 flex flex-col justify-center min-h-[72px] shadow-2xs">
              <span className="text-[11px] font-bold text-[#8C7E74] tracking-wider uppercase mb-1">
                ATTENDEES
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#2C1810] truncate">
                {tiles.attendees || eventData?.attendees || "—"}
              </span>
            </div>

            {/* Tile 6: LOCATION */}
            <div className="bg-white border border-[#EFE5DC] rounded-2xl p-4 sm:p-5 flex flex-col justify-center min-h-[72px] shadow-2xs">
              <span className="text-[11px] font-bold text-[#8C7E74] tracking-wider uppercase mb-1">
                LOCATION
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#2C1810] truncate">
                {tiles.location || eventData?.mode || eventData?.location || "—"}
              </span>
            </div>

            {/* Tile 7: VENUE */}
            <div className="bg-white border border-[#EFE5DC] rounded-2xl p-4 sm:p-5 flex flex-col justify-center min-h-[72px] shadow-2xs">
              <span className="text-[11px] font-bold text-[#8C7E74] tracking-wider uppercase mb-1">
                VENUE
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#2C1810] truncate">
                {tiles.venue || eventData?.venue || eventData?.location || "—"}
              </span>
            </div>

            {/* Tile 8: CATEGORY */}
            <div className="bg-white border border-[#EFE5DC] rounded-2xl p-4 sm:p-5 flex flex-col justify-center min-h-[72px] shadow-2xs">
              <span className="text-[11px] font-bold text-[#8C7E74] tracking-wider uppercase mb-1">
                CATEGORY
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#2C1810] truncate">
                {tiles.category || eventData?.category || typeBadge}
              </span>
            </div>
          </div>

          {/* About this event Section */}
          <div>
            <h2 className="text-[16px] sm:text-[17px] font-bold text-[#2C1810] mb-2">
              About this event
            </h2>
            <p className="text-[13.5px] sm:text-[14px] text-[#6B5E55] leading-relaxed">
              {eventData?.about_this_event ||
                eventData?.description ||
                "A guided yoga and meditation session designed to improve focus, reduce workplace stress, and support holistic well-being for employees."}
            </p>
          </div>

          {/* Image Gallery Section */}
          <div className="space-y-4 pt-2">
            {/* Gallery Header with Upload Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] sm:text-[20px] font-bold text-[#2C1810]">
                Image Gallery
              </h2>
              <button
                type="button"
                onClick={handleOpenUpload}
                className="bg-[#6B4226] hover:bg-[#57351E] text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 cursor-pointer shadow-xs transition"
              >
                <LuUpload size={16} />
                <span>Upload</span>
              </button>
            </div>

            {/* Gallery Content */}
            {gallery.length === 0 ? (
              /* Empty Gallery State */
              <div
                onClick={handleOpenUpload}
                className="rounded-2xl border-2 border-dashed border-[#DFD3C6] bg-white p-12 sm:p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FAF7F2] transition group"
              >
                <div className="w-14 h-14 rounded-full bg-[#FDF0E6] flex items-center justify-center text-[#B85D1B] mb-3 group-hover:scale-105 transition-transform">
                  <LuCloudUpload size={28} />
                </div>
                <h3 className="text-[16px] font-bold text-[#2C1810]">
                  Upload Photos & Videos
                </h3>
                <p className="text-xs text-[#8C7E74] mt-1">
                  Upload Photos and Videos from your event.
                </p>
              </div>
            ) : (
              /* Populated Gallery State with Delete Icon on Corner */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item, index) => {
                  const imgUrl = item.media_url || item.image_url || item.thumbnail_url;
                  const itemId = item.id || `gallery-${index}`;
                  const isDeleting = deletingId === item.id;

                  return (
                    <div
                      key={itemId}
                      className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F4EDE4] border border-[#EFE5DC] shadow-xs"
                    >
                      <img
                        src={imgUrl}
                        alt={item.title || `Event Photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80";
                        }}
                      />

                      {/* Delete Icon in Top-Right Corner */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(item.id, index);
                        }}
                        disabled={isDeleting}
                        title="Delete photo"
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-[#B3261E] text-white flex items-center justify-center transition shadow-md cursor-pointer z-10"
                      >
                        {isDeleting ? (
                          <HiRefresh className="animate-spin" size={14} />
                        ) : (
                          <HiOutlineTrash size={16} />
                        )}
                      </button>

                      {/* Caption / Title Overlay at bottom if available */}
                      {item.title && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 pt-6 pointer-events-none">
                          <p className="text-white text-xs font-medium truncate">
                            {item.title}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#EFE5DC] p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E8DF]">
              <h3 className="text-[18px] font-bold text-[#2C1810]">
                Upload Event Photo
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-[#8C7E74] hover:text-[#2C1810] p-1 rounded-lg transition cursor-pointer"
              >
                <HiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              {/* Tab Selector: Choose File vs Enter URL */}
              <div className="flex rounded-xl bg-[#FAF7F2] p-1 border border-[#EFE5DC]">
                <button
                  type="button"
                  onClick={() => setUploadTab("file")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    uploadTab === "file"
                      ? "bg-white text-[#2C1810] shadow-xs"
                      : "text-[#8C7E74] hover:text-[#2C1810]"
                  }`}
                >
                  Choose From Computer
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab("url")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    uploadTab === "url"
                      ? "bg-white text-[#2C1810] shadow-xs"
                      : "text-[#8C7E74] hover:text-[#2C1810]"
                  }`}
                >
                  Enter Image URL
                </button>
              </div>

              {uploadTab === "file" ? (
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase tracking-wider mb-1.5">
                    Select Image File
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-[#6B5E55] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#6B4226] file:text-white hover:file:bg-[#57351E] cursor-pointer"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase tracking-wider mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-xl border border-[#DFD3C6] px-3.5 py-2.5 text-sm text-[#2C1810] focus:outline-hidden focus:border-[#6B4226]"
                  />
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] uppercase tracking-wider mb-1.5">
                  Photo Title / Caption (Optional)
                </label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="e.g. Outdoor Yoga Session"
                  className="w-full rounded-xl border border-[#DFD3C6] px-3.5 py-2.5 text-sm text-[#2C1810] focus:outline-hidden focus:border-[#6B4226]"
                />
              </div>

              {/* Preview Box */}
              {(previewUrl || inputUrl) && (
                <div>
                  <label className="block text-xs font-bold text-[#6B5E55] uppercase tracking-wider mb-1.5">
                    Preview
                  </label>
                  <div className="h-44 rounded-xl border border-[#EFE5DC] overflow-hidden bg-[#FAF7F2]">
                    <img
                      src={uploadTab === "file" ? previewUrl : inputUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E8DF]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#6B5E55] hover:bg-[#FAF7F2] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || (uploadTab === "file" && !previewUrl) || (uploadTab === "url" && !inputUrl.trim())}
                  className="bg-[#6B4226] hover:bg-[#57351E] disabled:bg-[#C4B7AC] text-white px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <HiRefresh className="animate-spin" size={16} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Add to Gallery</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CorporateCellCompletedEventDetails;
