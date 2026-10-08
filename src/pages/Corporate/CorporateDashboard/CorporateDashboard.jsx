import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineViewGrid,
  HiArrowRight,
  HiOutlineBriefcase,
  HiOutlineStar,
  HiOutlineRefresh
} from "react-icons/hi";
import { FaSpa, FaStethoscope } from "react-icons/fa";
import { getCorporateDashboard } from "../../../api/corporateDashboardApi";
import DashboardLayout from "../../../components/Layout/DashboardLayout";

const getBadgeStyle = (badge) => {
  const b = (badge || "").toLowerCase();
  if (b.includes("seminar")) return "bg-[#E8F8EC] text-[#257A42]";
  if (b.includes("retreat")) return "bg-[#F4EDFC] text-[#6E3BB5]";
  if (b.includes("talk") || b.includes("orange")) return "bg-[#FEF2E6] text-[#B85D1B]";
  return "bg-[#EAF4FD] text-[#236CB2]";
};

const CorporateDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = () => {
    setLoading(true);
    setError(null);

    getCorporateDashboard()
      .then((res) => {
        setDashboardData(res.data?.data || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading corporate dashboard:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to connect to server. Please check your connection."
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const data = dashboardData || {};
  const hero = data.hero_banner;
  const highlights = data.quick_highlights || [];
  const upcomingEvents = data.upcoming_events || [];
  const impact = data.our_impact;
  const testimonials = data.testimonials || [];
  const gallery = data.image_gallery || [];

  return (
    <DashboardLayout role="corporate">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        {/* ========================================================= */}
        {/* LOADING STATE */}
        {/* ========================================================= */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-64 w-full rounded-[28px] bg-[#EFE5DC]/60" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-[22px] bg-[#EFE5DC]/40" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 h-80 rounded-[26px] bg-[#EFE5DC]/50" />
              <div className="lg:col-span-5 h-80 rounded-[26px] bg-[#EFE5DC]/50" />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ERROR STATE */}
        {/* ========================================================= */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-red-200 bg-red-50/60 p-8 text-center space-y-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={fetchDashboard}
              className="inline-flex items-center gap-2 rounded-full bg-[#7A4B3A] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#643C2D] transition"
            >
              <HiOutlineRefresh size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* DYNAMIC DASHBOARD CONTENT */}
        {/* ========================================================= */}
        {!loading && !error && (
          <>
            {/* HERO BANNER (Only if returned by API) */}
            {hero && (
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#F9F3EA] via-[#FAF5EE] to-[#F5ECE1] border border-[#EFE5DC] shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[300px]">
                  {/* Left Content */}
                  <div className="p-8 sm:p-12 lg:col-span-7 space-y-4 z-10">
                    <h1 className="text-[28px] sm:text-[36px] font-bold text-[#4D2E23] leading-[1.25] tracking-tight">
                      {hero.title}
                    </h1>
                    {hero.subtitle && (
                      <p className="text-[15px] sm:text-[16px] text-[#6F5B51] max-w-lg leading-relaxed">
                        {hero.subtitle}
                      </p>
                    )}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => navigate(hero.button_link || "/corporate/packages")}
                        className="inline-flex items-center gap-2 rounded-full bg-[#7A4B3A] hover:bg-[#643C2D] px-8 py-3.5 text-[15px] font-medium text-white transition shadow-sm"
                      >
                        <span>{hero.button_text || "Request an Event"}</span>
                        <HiArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Right Hero Image */}
                  {hero.image_url && (
                    <div className="lg:col-span-5 h-[260px] lg:h-full relative overflow-hidden flex items-end justify-center lg:justify-end">
                      <img
                        src={hero.image_url}
                        alt={hero.title || "Wellness at Work"}
                        className="h-full w-full object-cover object-center lg:object-right mix-blend-multiply opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#F9F3EA] via-transparent to-transparent" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* QUICK HIGHLIGHTS STRIP (Dynamic from API) */}
            {highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {highlights.map((item, index) => {
                  let IconComponent = HiOutlineUsers;
                  if (item.icon === "layout" || index === 1) IconComponent = HiOutlineViewGrid;
                  if (item.icon === "lotus" || index === 2) IconComponent = FaSpa;
                  if (item.icon === "stethoscope" || index === 3) IconComponent = FaStethoscope;

                  return (
                    <div
                      key={item.id || index}
                      onClick={() => navigate("/corporate/packages")}
                      className="flex items-center gap-3.5 rounded-[22px] border border-[#EFE5DC] bg-white p-4 shadow-sm hover:shadow-md hover:border-[#D5C2B4] transition cursor-pointer"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FAF4EF] text-[#7A4B3A]">
                        <IconComponent size={22} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-bold text-[#4D2E23] truncate">
                          {item.title}
                        </h4>
                        {item.subtitle && (
                          <p className="text-xs text-[#7F726A] truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TWO-COLUMN SECTION: Upcoming Events (Left) & Our Impact + Testimonial (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              {/* LEFT: UPCOMING EVENTS */}
              <div className="lg:col-span-7 flex flex-col rounded-[26px] border border-[#EFE5DC] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#F5ECE5]">
                  <h2 className="text-[20px] font-bold text-[#4D2E23]">
                    Upcoming Events
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate("/corporate/packages")}
                    className="inline-flex items-center gap-1 text-[13px] font-bold text-[#7A4B3A] hover:underline"
                  >
                    <span>View All</span>
                    <HiArrowRight size={14} />
                  </button>
                </div>

                <div className="divide-y divide-[#F5ECE5] flex-1">
                  {upcomingEvents.length === 0 ? (
                    <div className="py-12 text-center text-sm text-[#7F726A]">
                      No upcoming events scheduled at the moment.
                    </div>
                  ) : (
                    upcomingEvents.map((evt) => {
                      const badgeClass = getBadgeStyle(evt.type_badge || evt.badge_color);

                      return (
                        <div
                          key={evt.id}
                          className="flex items-center justify-between gap-4 py-4 first:pt-4 last:pb-0"
                        >
                          {/* Left: Date Box + Title & Details */}
                          <div className="flex items-center gap-4 min-w-0">
                            {/* Date Box */}
                            <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#FFF6EE] border border-[#F4E4D7] text-center">
                              <span className="text-[10px] font-extrabold tracking-wider text-[#A87258] uppercase">
                                {evt.date_badge?.month || "EVENT"}
                              </span>
                              <span className="text-[22px] font-bold text-[#4D2E23] leading-none mt-0.5">
                                {evt.date_badge?.day || "--"}
                              </span>
                            </div>

                            {/* Title & Details */}
                            <div className="min-w-0">
                              <h4 className="text-[15px] font-bold text-[#4D2E23] truncate">
                                {evt.title}
                              </h4>
                              <p className="mt-1 text-xs text-[#7F726A] truncate">
                                {evt.time_display || ""}{" "}
                                {evt.mode && (
                                  <>
                                    <span className="mx-1 text-[#D5C2B4]">|</span>{" "}
                                    {evt.mode}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Right: Badge */}
                          {evt.type_badge && (
                            <span
                              className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold ${badgeClass}`}
                            >
                              {evt.type_badge}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT: OUR IMPACT & TESTIMONIAL */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* 1. OUR IMPACT */}
                {impact && (
                  <div className="rounded-[26px] border border-[#EFE5DC] bg-white p-6 shadow-sm">
                    <h3 className="text-[18px] font-bold text-[#4D2E23] mb-5">
                      Our Impact
                    </h3>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF4EF] text-[#7A4B3A] mb-2.5">
                          <HiOutlineBriefcase size={20} />
                        </div>
                        <span className="text-[18px] sm:text-[20px] font-bold text-[#4D2E23]">
                          {impact.corporate_clients || "0"}
                        </span>
                        <span className="text-[11px] sm:text-xs text-[#7F726A] mt-0.5">
                          Corporate Clients
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF4EF] text-[#7A4B3A] mb-2.5">
                          <HiOutlineUsers size={20} />
                        </div>
                        <span className="text-[18px] sm:text-[20px] font-bold text-[#4D2E23]">
                          {impact.employees_benefitted || "0"}
                        </span>
                        <span className="text-[11px] sm:text-xs text-[#7F726A] mt-0.5">
                          Employees Benefitted
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF4EF] text-[#7A4B3A] mb-2.5">
                          <HiOutlineStar size={20} />
                        </div>
                        <span className="text-[18px] sm:text-[20px] font-bold text-[#4D2E23]">
                          {impact.average_rating || "0"}
                        </span>
                        <span className="text-[11px] sm:text-xs text-[#7F726A] mt-0.5">
                          Average Rating
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TESTIMONIAL CARD */}
                {testimonials.length > 0 && (
                  <div className="flex flex-col justify-between rounded-[26px] border border-[#EFE5DC] bg-white p-6 shadow-sm flex-1">
                    <div>
                      <span className="text-[36px] font-serif font-black leading-none text-[#E8D4C8] block mb-2">
                        &ldquo;&ldquo;
                      </span>
                      <p className="text-[14px] text-[#55463E] italic leading-relaxed">
                        {testimonials[0].quote}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#F5ECE5]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF0E7] text-sm font-bold text-[#7A4B3A]">
                          {testimonials[0].initials ||
                            (testimonials[0].author
                              ? testimonials[0].author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "C")}
                        </div>
                        <div>
                          <h5 className="text-[14px] font-bold text-[#4D2E23]">
                            {testimonials[0].author}
                          </h5>
                          <p className="text-xs text-[#7F726A]">
                            {testimonials[0].role}
                            {testimonials[0].company ? `, ${testimonials[0].company}` : ""}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate("/corporate/packages")}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EFE5DC] text-[#7A4B3A] hover:bg-[#FAF4EF] transition shadow-sm"
                      >
                        <HiArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* IMAGE GALLERY (Dynamic from API) */}
            {gallery.length > 0 && (
              <div className="space-y-4 pt-2">
                <h2 className="text-[20px] font-bold text-[#4D2E23]">
                  Image Gallery
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.slice(0, 6).map((img, i) => (
                    <div
                      key={img.id || i}
                      className="relative h-48 md:h-64 overflow-hidden rounded-[22px] bg-[#FAF4EF] shadow-sm group"
                    >
                      <img
                        src={img.image_url}
                        alt={img.title || "Gallery"}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {img.title && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition">
                          {img.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CorporateDashboard;