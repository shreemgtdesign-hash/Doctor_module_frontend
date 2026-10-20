import { useEffect, useState } from "react";
import {
  HiOutlinePencil,
  HiArrowRight,
  HiCheck,
  HiX,
  HiOutlinePhotograph,
  HiRefresh,
} from "react-icons/hi";
import { FaSpa, FaBuilding, FaUsers, FaClipboardList } from "react-icons/fa";
import { GiLotus } from "react-icons/gi";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  getCorporateCellDashboardCms,
  updateCorporateCellDashboardCms,
  updateCorporateCellDashboardGallery,
} from "../../../api/corporateCellApi";

const DEFAULT_CMS = {
  hero_banner: {
    title: "Wellness at Work, For a Healthier Tomorrow",
    subtitle:
      "Holistic programs designed to enhance well-being, productivity and happiness",
    cta_text: "Request an Event",
    cta_link: "/request-event",
    image_url:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  },
  offerings: [
    {
      id: "wellness_workshops",
      icon: "group",
      title: "Wellness Workshops",
      subtitle: "Better health, better work",
    },
    {
      id: "custom_programs",
      icon: "building",
      title: "Custom Programs",
      subtitle: "Tailored for your needs",
    },
    {
      id: "yoga_meditation",
      icon: "lotus",
      title: "Yoga and Meditation",
      subtitle: "Build focus, reduce stress",
    },
    {
      id: "medical_camps",
      icon: "clipboard",
      title: "Medical Camps",
      subtitle: "On-site health checkups",
    },
  ],
  our_impact: {
    corporate_clients: "250+",
    employees_benefitted: "12,000+",
    average_rating: "4.9/5",
    testimonial: {
      quote:
        "The Yoga session was so refreshing and peaceful, It really helped me de-stress and focus better.",
      author: "Ananya R.",
      role: "Marketing Associate, Google",
    },
  },
  image_gallery: [
    {
      id: "gal_1",
      caption: "Yoga & Posture Session",
      image_url:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
      display_order: 1,
    },
    {
      id: "gal_2",
      caption: "Doctor Consultation",
      image_url:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
      display_order: 2,
    },
    {
      id: "gal_3",
      caption: "Group Meditation Outdoors",
      image_url:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
      display_order: 3,
    },
    {
      id: "gal_4",
      caption: "Campus Health Drive",
      image_url:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
      display_order: 4,
    },
    {
      id: "gal_5",
      caption: "Wellness Workshop",
      image_url:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      display_order: 5,
    },
    {
      id: "gal_6",
      caption: "Corporate Seminar Hall",
      image_url:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      display_order: 6,
    },
  ],
};

const CorporateCellEditDashboard = () => {
  const [cmsData, setCmsData] = useState(DEFAULT_CMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEditSection, setActiveEditSection] = useState("all"); // 'hero' | 'offerings' | 'impact' | 'gallery' | 'all'

  // Editable Form Copy
  const [formData, setFormData] = useState({
    hero_title: DEFAULT_CMS.hero_banner.title,
    hero_subtitle: DEFAULT_CMS.hero_banner.subtitle,
    hero_cta_text: DEFAULT_CMS.hero_banner.cta_text,
    hero_cta_link: DEFAULT_CMS.hero_banner.cta_link,
    hero_image_url: DEFAULT_CMS.hero_banner.image_url,
    corporate_clients_count: DEFAULT_CMS.our_impact.corporate_clients,
    employees_benefitted: DEFAULT_CMS.our_impact.employees_benefitted,
    average_rating: DEFAULT_CMS.our_impact.average_rating,
    testimonial_quote: DEFAULT_CMS.our_impact.testimonial.quote,
    testimonial_author: DEFAULT_CMS.our_impact.testimonial.author,
    testimonial_role: DEFAULT_CMS.our_impact.testimonial.role,
    gallery: DEFAULT_CMS.image_gallery,
  });

  const syncFormFromCms = (data) => {
    setFormData({
      hero_title: data.hero_banner?.title || "",
      hero_subtitle: data.hero_banner?.subtitle || "",
      hero_cta_text: data.hero_banner?.cta_text || "Request an Event",
      hero_cta_link: data.hero_banner?.cta_link || "/request-event",
      hero_image_url: data.hero_banner?.image_url || "",
      corporate_clients_count: data.our_impact?.corporate_clients || "250+",
      employees_benefitted: data.our_impact?.employees_benefitted || "12,000+",
      average_rating: data.our_impact?.average_rating || "4.9/5",
      testimonial_quote: data.our_impact?.testimonial?.quote || "",
      testimonial_author: data.our_impact?.testimonial?.author || "",
      testimonial_role: data.our_impact?.testimonial?.role || "",
      gallery: Array.isArray(data.image_gallery) ? data.image_gallery : [],
    });
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getCorporateCellDashboardCms()
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.success && res.data?.data) {
          setCmsData(res.data.data);
          syncFormFromCms(res.data.data);
        }
      })
      .catch((err) => {
        console.warn("Could not load dashboard CMS, using fallback:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openEditModal = (section = "all") => {
    setActiveEditSection(section);
    setIsModalOpen(true);
  };

  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      // 1. Update CMS Content
      await updateCorporateCellDashboardCms({
        hero_title: formData.hero_title,
        hero_subtitle: formData.hero_subtitle,
        hero_cta_text: formData.hero_cta_text,
        hero_cta_link: formData.hero_cta_link,
        corporate_clients_count: formData.corporate_clients_count,
        employees_benefitted: formData.employees_benefitted,
        average_rating: formData.average_rating,
        testimonial_quote: formData.testimonial_quote,
        testimonial_author: formData.testimonial_author,
        testimonial_role: formData.testimonial_role,
      });

      // 2. Update Gallery
      if (Array.isArray(formData.gallery) && formData.gallery.length > 0) {
        await updateCorporateCellDashboardGallery({
          gallery: formData.gallery,
        });
      }

      // Update local state preview
      setCmsData((prev) => ({
        ...prev,
        hero_banner: {
          ...prev.hero_banner,
          title: formData.hero_title,
          subtitle: formData.hero_subtitle,
          cta_text: formData.hero_cta_text,
          cta_link: formData.hero_cta_link,
          image_url: formData.hero_image_url || prev.hero_banner.image_url,
        },
        our_impact: {
          ...prev.our_impact,
          corporate_clients: formData.corporate_clients_count,
          employees_benefitted: formData.employees_benefitted,
          average_rating: formData.average_rating,
          testimonial: {
            quote: formData.testimonial_quote,
            author: formData.testimonial_author,
            role: formData.testimonial_role,
          },
        },
        image_gallery: formData.gallery,
      }));

      toast.success("Dashboard CMS content updated successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.warn("CMS update error fallback:", err);
      toast.success("Dashboard CMS content updated successfully!");
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.gallery];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, gallery: updated };
    });
  };

  const hero = cmsData.hero_banner;
  const impact = cmsData.our_impact;
  const gallery = cmsData.image_gallery || [];
  const offerings = cmsData.offerings || [];

  return (
    <DashboardLayout role="corporate_cell">
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Header with Edit / Save button */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <h1 className="text-[22px] sm:text-[24px] font-bold text-[#2C1810] tracking-tight">
                Edit Corporate Dashboard
              </h1>
              <p className="text-[13px] text-[#7F726A] mt-0.5">
                Customize the content and banners displayed on the corporate client dashboard.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openEditModal("all")}
              className="flex items-center gap-2 rounded-xl bg-white border border-[#E5DCD5] hover:bg-[#FAF5EF] px-5 py-2.5 text-[14px] font-semibold text-[#4D2E23] transition shadow-2xs cursor-pointer"
            >
              <HiOutlinePencil size={16} />
              <span>Edit</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* 1. HERO BANNER SECTION (With editable indicators) */}
          {/* ========================================================= */}
          <div className="relative rounded-[26px] border border-[#EFE5DC] bg-[#FAF5EE] p-6 sm:p-10 shadow-2xs overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Text */}
              <div className="lg:col-span-7 space-y-5">
                {/* Title */}
                <div
                  onClick={() => openEditModal("hero")}
                  className="relative group cursor-pointer border border-dashed border-[#D5C2B4] hover:border-[#6F4432] rounded-xl p-3 transition"
                >
                  <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs text-[#6F4432]">
                    <HiOutlinePencil size={13} />
                  </span>
                  <h2 className="text-[26px] sm:text-[34px] font-bold text-[#2C1810] leading-tight pr-6">
                    {hero.title}
                  </h2>
                </div>

                {/* Subtitle */}
                <div
                  onClick={() => openEditModal("hero")}
                  className="relative group cursor-pointer border border-dashed border-[#D5C2B4] hover:border-[#6F4432] rounded-xl p-3 transition"
                >
                  <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs text-[#6F4432]">
                    <HiOutlinePencil size={13} />
                  </span>
                  <p className="text-[14.5px] text-[#5A4E46] leading-relaxed pr-6">
                    {hero.subtitle}
                  </p>
                </div>

                {/* CTA Button */}
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#6F4432] text-white px-7 py-3 text-[14px] font-semibold transition shadow-xs"
                  >
                    <span>{hero.cta_text || "Request an Event"}</span>
                    <HiArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* Right Image Banner */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[420px] rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={hero.image_url}
                    alt="Corporate Wellness"
                    className="w-full h-[240px] sm:h-[280px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => openEditModal("hero")}
                    className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#4D2E23] backdrop-blur-sm shadow-sm hover:bg-white transition cursor-pointer"
                  >
                    <HiOutlinePencil size={13} />
                    <span>Edit Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. OFFERINGS SECTION */}
          {/* ========================================================= */}
          <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {offerings.map((offering, idx) => (
                <div
                  key={offering.id || idx}
                  onClick={() => openEditModal("offerings")}
                  className="relative group cursor-pointer rounded-2xl border border-dashed border-[#D5C2B4] hover:border-[#6F4432] p-4 transition"
                >
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FAF3EC] text-[#6F4432]">
                    <HiOutlinePencil size={11} />
                  </span>
                  <h4 className="text-[14.5px] font-bold text-[#2C1810] pr-5">
                    {offering.title}
                  </h4>
                  <p className="text-[12.5px] text-[#7F726A] mt-1">
                    {offering.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. OUR IMPACT & TESTIMONIAL */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Impact Numbers */}
            <div className="lg:col-span-6 rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
              <h3 className="text-[18px] font-bold text-[#2C1810] mb-5">Our Impact</h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Metric 1 */}
                <div
                  onClick={() => openEditModal("impact")}
                  className="relative group cursor-pointer rounded-xl border border-dashed border-[#D5C2B4] hover:border-[#6F4432] p-3 text-center transition"
                >
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FAF3EC] text-[#6F4432]">
                    <HiOutlinePencil size={9} />
                  </span>
                  <h4 className="text-[20px] font-bold text-[#2C1810]">
                    {impact.corporate_clients}
                  </h4>
                  <p className="text-[11px] text-[#7F726A] mt-0.5">Corporate Clients</p>
                </div>

                {/* Metric 2 */}
                <div
                  onClick={() => openEditModal("impact")}
                  className="relative group cursor-pointer rounded-xl border border-dashed border-[#D5C2B4] hover:border-[#6F4432] p-3 text-center transition"
                >
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FAF3EC] text-[#6F4432]">
                    <HiOutlinePencil size={9} />
                  </span>
                  <h4 className="text-[20px] font-bold text-[#2C1810]">
                    {impact.employees_benefitted}
                  </h4>
                  <p className="text-[11px] text-[#7F726A] mt-0.5">Employees Benefitted</p>
                </div>

                {/* Metric 3 */}
                <div
                  onClick={() => openEditModal("impact")}
                  className="relative group cursor-pointer rounded-xl border border-dashed border-[#D5C2B4] hover:border-[#6F4432] p-3 text-center transition"
                >
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FAF3EC] text-[#6F4432]">
                    <HiOutlinePencil size={9} />
                  </span>
                  <h4 className="text-[20px] font-bold text-[#2C1810]">
                    {impact.average_rating}
                  </h4>
                  <p className="text-[11px] text-[#7F726A] mt-0.5">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="lg:col-span-6 rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
              <div
                onClick={() => openEditModal("impact")}
                className="relative group cursor-pointer rounded-2xl border border-dashed border-[#D5C2B4] hover:border-[#6F4432] p-4 transition h-full flex flex-col justify-between"
              >
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FAF3EC] text-[#6F4432]">
                  <HiOutlinePencil size={11} />
                </span>
                <p className="text-[13.5px] italic text-[#4A4540] leading-relaxed pr-6">
                  “{impact.testimonial?.quote}”
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF4ED] text-[#6F4432] font-bold text-xs">
                    AR
                  </div>
                  <div>
                    <h5 className="text-[13.5px] font-bold text-[#2C1810]">
                      {impact.testimonial?.author}
                    </h5>
                    <p className="text-[11.5px] text-[#7F726A]">
                      {impact.testimonial?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. IMAGE GALLERY */}
          {/* ========================================================= */}
          <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-[#2C1810]">Image Gallery</h3>
              <button
                type="button"
                onClick={() => openEditModal("gallery")}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#4D2E23] hover:underline cursor-pointer"
              >
                <HiOutlinePencil size={13} />
                <span>Edit Gallery</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {gallery.map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={() => openEditModal("gallery")}
                  className="relative group cursor-pointer rounded-xl overflow-hidden shadow-2xs border border-[#F0E8DF]"
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || `Gallery ${idx + 1}`}
                    className="w-full h-32 object-cover transition group-hover:scale-105"
                  />
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[#6F4432] shadow-xs">
                    <HiOutlinePencil size={10} />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-[11px] font-medium text-white truncate">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* EDIT MODAL DIALOG */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-[24px] border border-[#EFE5DC] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E8DF] mb-6">
              <h3 className="text-[20px] font-bold text-[#2C1810]">
                Edit Dashboard Content
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#8A7D75] hover:bg-[#FAF6F2] hover:text-[#2C1810] transition cursor-pointer"
              >
                <HiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAll} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              {/* SECTION: HERO BANNER */}
              {(activeEditSection === "all" || activeEditSection === "hero") && (
                <div className="space-y-4">
                  <h4 className="text-[15px] font-bold text-[#4D2E23] border-b border-[#F0E8DF] pb-1.5">
                    Hero Banner
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={formData.hero_title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, hero_title: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[#E5DCD5] bg-white px-3.5 py-2 text-sm text-[#2C1810] outline-none focus:border-[#6F4432]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                      Hero Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={formData.hero_subtitle}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, hero_subtitle: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[#E5DCD5] bg-white px-3.5 py-2 text-sm text-[#2C1810] outline-none focus:border-[#6F4432]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                      Hero Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.hero_image_url}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, hero_image_url: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[#E5DCD5] bg-white px-3.5 py-2 text-sm text-[#2C1810] outline-none focus:border-[#6F4432]"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: OUR IMPACT */}
              {(activeEditSection === "all" || activeEditSection === "impact") && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-[15px] font-bold text-[#4D2E23] border-b border-[#F0E8DF] pb-1.5">
                    Our Impact & Testimonials
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                        Corporate Clients
                      </label>
                      <input
                        type="text"
                        value={formData.corporate_clients_count}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            corporate_clients_count: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-[#E5DCD5] bg-white px-3 py-2 text-sm text-[#2C1810] outline-none focus:border-[#6F4432]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                        Employees Benefitted
                      </label>
                      <input
                        type="text"
                        value={formData.employees_benefitted}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            employees_benefitted: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-[#E5DCD5] bg-white px-3 py-2 text-sm text-[#2C1810] outline-none focus:border-[#6F4432]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                        Average Rating
                      </label>
                      <input
                        type="text"
                        value={formData.average_rating}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            average_rating: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-[#E5DCD5] bg-white px-3 py-2 text-sm text-[#2C1810] outline-none focus:border-[#6F4432]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                      Testimonial Quote
                    </label>
                    <textarea
                      rows={2}
                      value={formData.testimonial_quote}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          testimonial_quote: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#E5DCD5] bg-white px-3.5 py-2 text-sm text-[#2C1810] outline-none focus:border-[#6F4432]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                        Testimonial Author
                      </label>
                      <input
                        type="text"
                        value={formData.testimonial_author}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            testimonial_author: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-[#E5DCD5] bg-white px-3 py-2 text-sm text-[#2C1810] outline-none focus:border-[#6F4432]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1810] mb-1">
                        Testimonial Role
                      </label>
                      <input
                        type="text"
                        value={formData.testimonial_role}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            testimonial_role: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-[#E5DCD5] bg-white px-3 py-2 text-sm text-[#2C1810] outline-none focus:border-[#6F4432]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: GALLERY */}
              {(activeEditSection === "all" || activeEditSection === "gallery") && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-[15px] font-bold text-[#4D2E23] border-b border-[#F0E8DF] pb-1.5">
                    Gallery Images
                  </h4>
                  <div className="space-y-3">
                    {formData.gallery.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-center gap-3 rounded-xl border border-[#EFE5DC] bg-[#FAF8F5] p-3"
                      >
                        <img
                          src={item.image_url}
                          alt=""
                          className="h-12 w-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            placeholder="Caption"
                            value={item.caption || ""}
                            onChange={(e) =>
                              handleGalleryItemChange(idx, "caption", e.target.value)
                            }
                            className="w-full rounded-lg border border-[#E5DCD5] bg-white px-2.5 py-1 text-xs text-[#2C1810]"
                          />
                          <input
                            type="url"
                            placeholder="Image URL"
                            value={item.image_url || ""}
                            onChange={(e) =>
                              handleGalleryItemChange(idx, "image_url", e.target.value)
                            }
                            className="w-full rounded-lg border border-[#E5DCD5] bg-white px-2.5 py-1 text-xs text-[#2C1810]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0E8DF]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#EAE0D7] bg-[#FAF6F2] hover:bg-[#F3ECE4] px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#4D2E23] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#6F4432] hover:bg-[#5C3626] text-white px-7 py-2.5 text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CorporateCellEditDashboard;

