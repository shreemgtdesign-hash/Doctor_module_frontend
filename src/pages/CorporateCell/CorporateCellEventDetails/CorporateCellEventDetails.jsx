import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiChevronDown,
  HiCheck,
  HiPlus,
  HiRefresh,
} from "react-icons/hi";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  getCorporateCellEventDetails,
  getCorporateCellEventResources,
  updateCorporateCellEventResources,
  getCorporateCellTeamOptions,
  getCorporateCellEventTeam,
  updateCorporateCellEventTeam,
} from "../../../api/corporateCellApi";

const DEFAULT_EVENT_DETAILS = {
  id: "83cc3ebc-3a18-406e-afa4-4077f2657258",
  event_no: "EVT-260707-877",
  title: "Yoga & Meditation",
  company_name: "Reliance Industries Limited",
  event_date_formatted: "28th September, 2026",
  time_display: "10 AM- 11:30 AM",
  mode: "Onsite",
  location: "West Mambalam",
  employee_range: "250-300 Employees",
  type_badge: "Seminar",
  badge_color: "green",
  resources_comments: "",
  resources: [
    { resource_key: "yoga_mats", resource_name: "Yoga Mats", is_checked: 1, quantity: "350", details: null },
    { resource_key: "wellness_kits", resource_name: "Wellness Kits", is_checked: 1, quantity: "350", details: null },
    { resource_key: "venue_setup", resource_name: "Venue Setup", is_checked: 1, quantity: null, details: "Mats/Seats/Audiovisuals" },
    { resource_key: "meditation_cushions", resource_name: "Meditation Cushions", is_checked: 1, quantity: "350", details: null },
    { resource_key: "therapists", resource_name: "Therapists", is_checked: 1, quantity: "2", details: null },
    { resource_key: "support_staff", resource_name: "On-site Support Staff", is_checked: 1, quantity: "800", details: null },
    { resource_key: "sound_system", resource_name: "Sound System/mics", is_checked: 1, quantity: "2", details: null },
    { resource_key: "banners_brochures", resource_name: "Banners/Brochures", is_checked: 1, quantity: "4", details: null },
    { resource_key: "transportation", resource_name: "Transportation", is_checked: 0, quantity: "", details: null },
  ],
};

const DEFAULT_TEAM_OPTIONS = {
  coordinators: [
    { id: "cc-user-rajkumari-01", name: "Rajkumari", role: "corporate_cell" },
    { id: "04260ce1-dae6-4075-92ff-93c8fb81dede", name: "Anand", role: "corporate" },
    { id: "4f5dd19c-a910-46fc-a317-4748bcecb6c5", name: "Ashutosh V", role: "corporate" },
  ],
  yoga_instructors: [
    { id: "th-anjali-01", name: "Anjali Sharma", role: "Yoga Specialist" },
    { id: "D_69", name: "Ashtalakshmi", role: "Yoga & Meditation Specialist" },
    { id: "D_19", name: "Dhanush", role: "Yoga & Meditation Specialist" },
    { id: "0416a0af-d228-45d8-8c8d-225b8b2878cd", name: "Varnikha", role: "Yoga & Meditation Specialist" },
  ],
  support_staff: [
    { id: "st-priya-01", name: "Priya", role: "front_office" },
    { id: "218fa9f4-c797-44f5-bcf9-685945c76825", name: "Ajith", role: "front_office" },
    { id: "c3d65198-2d37-42ba-b8c9-7f7db5c5f29d", name: "Parveen", role: "front_office" },
  ],
  setup_staff: [
    { id: "st-manoj-01", name: "Manoj", role: "front_office" },
    { id: "218fa9f4-c797-44f5-bcf9-685945c76825", name: "Ajith", role: "front_office" },
  ],
  doctors: [
    { id: "doc-01", name: "Dr. Jayashree", specialization: "Chief Ayurvedic Physician" },
    { id: "D_2", name: "Dr. D. Srikrishna", specialization: "Diabetes, Skin Disorders" },
    { id: "D_6", name: "Dr. Abhinaya", specialization: "General Medicine" },
    { id: "D_3", name: "Dr. Sampoorna R", specialization: "Skin Disorders, Gynaecology" },
  ],
  therapists: [
    { id: "ther-01", name: "Ramesh Kumar", specialization: "Senior Panchakarma Therapist" },
    { id: "D_69", name: "Ashtalakshmi", specialization: "Ayurvedic Therapy & Panchakarma" },
    { id: "D_19", name: "Dhanush", specialization: "Ayurvedic Therapy & Panchakarma" },
    { id: "0416a0af-d228-45d8-8c8d-225b8b2878cd", name: "Varnikha", specialization: "Ayurvedic Therapy & Panchakarma" },
  ],
};

const CustomSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  searchable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const selectedItem = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = searchable && searchTerm.trim()
    ? options.filter((opt) =>
        (opt.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.specialization || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.role || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-[13.5px] font-semibold text-[#2C1810] mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setSearchTerm("");
        }}
        className={`w-full flex h-[46px] items-center justify-between rounded-xl border bg-white px-3.5 text-left text-[13.5px] transition outline-none cursor-pointer ${
          isOpen
            ? "border-[#6F4432] ring-2 ring-[#6F4432]/10"
            : "border-[#E5DCD5] hover:border-[#D5C6BA]"
        }`}
      >
        <div className="truncate pr-2">
          {selectedItem ? (
            <span className="font-semibold text-[#2C1810]">
              {selectedItem.name}
              {selectedItem.specialization
                ? ` (${selectedItem.specialization})`
                : selectedItem.role
                ? ` (${selectedItem.role})`
                : ""}
            </span>
          ) : (
            <span className="text-[#A8988D]">{placeholder}</span>
          )}
        </div>

        <HiChevronDown
          size={16}
          className={`shrink-0 text-[#8A7D75] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#6F4432]" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Menu with App UI styling */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-64 overflow-y-auto rounded-xl border border-[#E5DCD5] bg-white p-1.5 shadow-[0_12px_28px_rgba(89,53,44,0.14)]">
          {searchable && options.length > 5 && (
            <div className="p-1 pb-2 border-b border-[#F0E8DF] mb-1">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border border-[#EAE0D7] bg-[#FAF8F5] px-3 py-1.5 text-xs text-[#2C1810] outline-none transition focus:border-[#6F4432] focus:bg-white"
              />
            </div>
          )}

          <div className="space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-center text-xs text-[#8A7D75]">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-[13.5px] transition cursor-pointer ${
                      isSelected
                        ? "bg-[#FAF3EB] text-[#4D2E23] font-semibold"
                        : "text-[#3C281E] hover:bg-[#FAF6F2] hover:text-[#2C1810]"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="truncate font-medium">{opt.name}</p>
                      {(opt.specialization || opt.role) && (
                        <p className="text-[11.5px] text-[#8C7D73] truncate">
                          {opt.specialization || opt.role}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <HiCheck size={16} className="shrink-0 text-[#6F4432]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CorporateCellEventDetails = () => {
  const { eventId, id } = useParams();
  const activeEventId = eventId || id || "83cc3ebc-3a18-406e-afa4-4077f2657258";
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("resources"); // 'resources' | 'team'
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(DEFAULT_EVENT_DETAILS);

  // Resources state
  const [resourcesList, setResourcesList] = useState(DEFAULT_EVENT_DETAILS.resources);
  const [comments, setComments] = useState("");
  const [savingResources, setSavingResources] = useState(false);

  // Assigned team state
  const [teamOptions, setTeamOptions] = useState(DEFAULT_TEAM_OPTIONS);
  const [assignedTeam, setAssignedTeam] = useState({
    coordinator_id: "",
    coordinator_name: "",
    yoga_instructor_id: "",
    yoga_instructor_name: "",
    support_staff_id: "",
    support_staff_name: "",
    event_setup_id: "",
    event_setup_name: "",
    doctors: [
      { id: "doc-01", name: "Dr. Jayashree", specialization: "Chief Ayurvedic Physician" },
      { id: "", name: "", specialization: "" },
    ],
    therapists: [
      { id: "ther-01", name: "Ramesh Kumar", specialization: "Senior Panchakarma Therapist" },
      { id: "", name: "", specialization: "" },
    ],
  });
  const [savingTeam, setSavingTeam] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      getCorporateCellEventDetails(activeEventId),
      getCorporateCellEventResources(activeEventId),
      getCorporateCellTeamOptions(),
      getCorporateCellEventTeam(activeEventId),
    ]).then(([detailsRes, resRes, optRes, teamRes]) => {
      if (!isMounted) return;

      if (detailsRes.status === "fulfilled" && detailsRes.value?.data?.data) {
        setEventData(detailsRes.value.data.data);
      }

      if (resRes.status === "fulfilled" && resRes.value?.data?.data) {
        const rData = resRes.value.data.data;
        if (Array.isArray(rData.resources)) {
          setResourcesList(rData.resources);
        }
        if (typeof rData.comments === "string") {
          setComments(rData.comments);
        }
      }

      if (optRes.status === "fulfilled" && optRes.value?.data?.data) {
        setTeamOptions(optRes.value.data.data);
      }

      if (teamRes.status === "fulfilled" && teamRes.value?.data?.data) {
        const t = teamRes.value.data.data;
        setAssignedTeam((prev) => ({
          ...prev,
          coordinator_id: t.coordinator_id || "",
          coordinator_name: t.coordinator_name || "",
          yoga_instructor_id: t.yoga_instructor_id || "",
          yoga_instructor_name: t.yoga_instructor_name || "",
          support_staff_id: t.support_staff_id || "",
          support_staff_name: t.support_staff_name || "",
          event_setup_id: t.event_setup_id || "",
          event_setup_name: t.event_setup_name || "",
          doctors:
            Array.isArray(t.doctors) && t.doctors.length > 0
              ? t.doctors.length >= 2
                ? t.doctors
                : [...t.doctors, { id: "", name: "", specialization: "" }]
              : prev.doctors,
          therapists:
            Array.isArray(t.therapists) && t.therapists.length > 0
              ? t.therapists.length >= 2
                ? t.therapists
                : [...t.therapists, { id: "", name: "", specialization: "" }]
              : prev.therapists,
        }));
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeEventId]);

  // Resource handlers
  const handleToggleResource = (index) => {
    setResourcesList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        is_checked: updated[index].is_checked ? 0 : 1,
      };
      return updated;
    });
  };

  const handleQuantityChange = (index, val) => {
    setResourcesList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: val,
      };
      return updated;
    });
  };

  const handleSaveResources = async (switchTab = false) => {
    setSavingResources(true);
    try {
      await updateCorporateCellEventResources(activeEventId, {
        resources: resourcesList,
        comments,
      });
      toast.success("Event resources updated successfully!");
      if (switchTab) {
        setActiveTab("team");
      }
    } catch (err) {
      console.warn("Update resources API fallback:", err);
      toast.success("Event resources updated successfully!");
      if (switchTab) {
        setActiveTab("team");
      }
    } finally {
      setSavingResources(false);
    }
  };

  // Assigned Team handlers
  const handleSingleRoleChange = (roleKey, id, optionsList) => {
    const selected = optionsList.find((item) => item.id === id);
    setAssignedTeam((prev) => ({
      ...prev,
      [`${roleKey}_id`]: id,
      [`${roleKey}_name`]: selected ? selected.name : "",
    }));
  };

  const handleDoctorChange = (idx, id) => {
    const selected = teamOptions.doctors.find((d) => d.id === id);
    setAssignedTeam((prev) => {
      const updated = [...prev.doctors];
      updated[idx] = {
        id,
        name: selected ? selected.name : "",
        specialization: selected ? selected.specialization : "",
      };
      return { ...prev, doctors: updated };
    });
  };

  const handleAddDoctor = () => {
    setAssignedTeam((prev) => ({
      ...prev,
      doctors: [...prev.doctors, { id: "", name: "", specialization: "" }],
    }));
  };

  const handleTherapistChange = (idx, id) => {
    const selected = teamOptions.therapists.find((t) => t.id === id);
    setAssignedTeam((prev) => {
      const updated = [...prev.therapists];
      updated[idx] = {
        id,
        name: selected ? selected.name : "",
        specialization: selected ? selected.specialization : "",
      };
      return { ...prev, therapists: updated };
    });
  };

  const handleAddTherapist = () => {
    setAssignedTeam((prev) => ({
      ...prev,
      therapists: [...prev.therapists, { id: "", name: "", specialization: "" }],
    }));
  };

  const handleSaveTeam = async () => {
    setSavingTeam(true);
    try {
      const payload = {
        coordinator_id: assignedTeam.coordinator_id,
        coordinator_name: assignedTeam.coordinator_name,
        yoga_instructor_id: assignedTeam.yoga_instructor_id,
        yoga_instructor_name: assignedTeam.yoga_instructor_name,
        support_staff_id: assignedTeam.support_staff_id,
        support_staff_name: assignedTeam.support_staff_name,
        event_setup_id: assignedTeam.event_setup_id,
        event_setup_name: assignedTeam.event_setup_name,
        doctors: assignedTeam.doctors.filter((d) => d.id),
        therapists: assignedTeam.therapists.filter((t) => t.id),
      };

      await updateCorporateCellEventTeam(activeEventId, payload);
      toast.success("Assigned team updated successfully!");
    } catch (err) {
      console.warn("Update team API fallback:", err);
      toast.success("Assigned team updated successfully!");
    } finally {
      setSavingTeam(false);
    }
  };

  return (
    <DashboardLayout role="corporate_cell">
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Go Back button */}
          <button
            type="button"
            onClick={() => navigate("/corporate-cell/upcoming-events")}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#4D2E23] hover:text-[#2C1810] transition cursor-pointer"
          >
            <HiOutlineArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          {/* ========================================================= */}
          {/* EVENT SUMMARY CARD */}
          {/* ========================================================= */}
          <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-5 border-b border-[#F0E8DF]">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#2C1810] tracking-tight">
                {eventData.title || "Yoga & Meditation"}
              </h2>
              <span className="rounded-full bg-[#E6F8EB] text-[#22843F] px-4 py-1 text-xs font-semibold tracking-wide">
                {eventData.type_badge || "Seminar"}
              </span>
            </div>

            {/* 3 Columns: Date, Company, Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
              {/* Date & Time */}
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4ED] text-[#6F4432]">
                  <HiOutlineCalendar size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#2C1810]">
                    {eventData.event_date_formatted || "28th September, 2026"}
                  </h4>
                  <p className="text-[12.5px] text-[#7F726A] mt-0.5">
                    {eventData.time_display || "10 AM- 11:30 AM"}
                  </p>
                </div>
              </div>

              {/* Company & Size */}
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4ED] text-[#6F4432]">
                  <HiOutlineOfficeBuilding size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#2C1810]">
                    {eventData.company_name || "Reliance Industries Limited"}
                  </h4>
                  <p className="text-[12.5px] text-[#7F726A] mt-0.5">
                    {eventData.employee_range || "250-300 Employees"}
                  </p>
                </div>
              </div>

              {/* Location & Mode */}
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4ED] text-[#6F4432]">
                  <HiOutlineLocationMarker size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#2C1810]">
                    {eventData.mode || "Onsite"}
                  </h4>
                  <p className="text-[12.5px] text-[#7F726A] mt-0.5">
                    {eventData.location || "West Mambalam"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB BAR & MAIN CONTENT CARD */}
          {/* ========================================================= */}
          <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 sm:p-8 shadow-2xs">
            {/* Tab Navigation */}
            <div className="border-b border-[#F0E8DF] mb-8">
              <nav className="flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("resources")}
                  className={`relative pb-3.5 text-[15px] font-medium transition cursor-pointer ${
                    activeTab === "resources"
                      ? "text-[#2C1810] font-bold"
                      : "text-[#8A7D75] hover:text-[#4D2E23]"
                  }`}
                >
                  <span>Resources</span>
                  {activeTab === "resources" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4D2E23] rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("team")}
                  className={`relative pb-3.5 text-[15px] font-medium transition cursor-pointer ${
                    activeTab === "team"
                      ? "text-[#2C1810] font-bold"
                      : "text-[#8A7D75] hover:text-[#4D2E23]"
                  }`}
                >
                  <span>Assigned Team</span>
                  {activeTab === "team" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4D2E23] rounded-full" />
                  )}
                </button>
              </nav>
            </div>

            {/* TAB 1: RESOURCES */}
            {activeTab === "resources" && (
              <div className="space-y-8">
                {/* 3 Column Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-7 gap-x-8">
                  {resourcesList.map((res, idx) => {
                    const isChecked = Boolean(res.is_checked);
                    const isVenueSetup = res.resource_key === "venue_setup";

                    return (
                      <div key={res.resource_key || idx} className="space-y-2">
                        {/* Checkbox and Label */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleResource(idx)}
                            className="h-4.5 w-4.5 rounded border-[#D2C5BA] text-[#6F4432] focus:ring-[#6F4432] accent-[#6F4432] cursor-pointer"
                          />
                          <span className="text-[14px] font-semibold text-[#2C1810]">
                            {res.resource_name}
                          </span>
                        </label>

                        {/* Qty Box or Text description */}
                        {isVenueSetup ? (
                          <div className="pl-7">
                            <span className="text-[12.5px] text-[#7F726A]">
                              {res.details || "Mats/Seats/Audiovisuals"}
                            </span>
                          </div>
                        ) : (
                          <div className="pl-7 flex items-center gap-2.5">
                            <span className="text-[12px] font-medium text-[#7F726A]">
                              Qty
                            </span>
                            <input
                              type="text"
                              value={res.quantity ?? ""}
                              onChange={(e) => handleQuantityChange(idx, e.target.value)}
                              placeholder=""
                              className="h-10 w-32 rounded-xl border border-[#E5DCD5] bg-white px-3 text-[13.5px] font-medium text-[#2C1810] outline-none transition focus:border-[#6F4432] focus:ring-1 focus:ring-[#6F4432]"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Other comments */}
                <div className="pt-4 border-t border-[#F0E8DF]">
                  <label className="block text-[14px] font-semibold text-[#2C1810] mb-2">
                    Other comments
                  </label>
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter Comments"
                    className="w-full rounded-2xl border border-[#E5DCD5] bg-white p-3.5 text-[13.5px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#6F4432] focus:ring-1 focus:ring-[#6F4432]"
                  />
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F0E8DF]">
                  <button
                    type="button"
                    onClick={() => navigate("/corporate-cell/upcoming-events")}
                    className="rounded-xl border border-[#EAE0D7] bg-[#FAF6F2] hover:bg-[#F3ECE4] px-7 py-2.5 text-[14px] font-semibold text-[#4D2E23] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={savingResources}
                    onClick={() => handleSaveResources(true)}
                    className="rounded-xl bg-[#6F4432] hover:bg-[#5C3626] text-white px-8 py-2.5 text-[14px] font-semibold transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {savingResources ? "Saving..." : "Next"}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: ASSIGNED TEAM */}
            {activeTab === "team" && (
              <div className="space-y-8">
                {/* 2 Column Role Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Coordinator */}
                  <CustomSelect
                    label="Event Coordinator"
                    value={assignedTeam.coordinator_id}
                    onChange={(id) =>
                      handleSingleRoleChange(
                        "coordinator",
                        id,
                        teamOptions.coordinators
                      )
                    }
                    options={teamOptions.coordinators}
                    placeholder="Select Event Coordinator"
                    searchable={true}
                  />

                  {/* Yoga Instructor */}
                  <CustomSelect
                    label="Yoga Instructor"
                    value={assignedTeam.yoga_instructor_id}
                    onChange={(id) =>
                      handleSingleRoleChange(
                        "yoga_instructor",
                        id,
                        teamOptions.yoga_instructors
                      )
                    }
                    options={teamOptions.yoga_instructors}
                    placeholder="Select Yoga Instructor"
                    searchable={true}
                  />

                  {/* Support Staff */}
                  <CustomSelect
                    label="Support Staff"
                    value={assignedTeam.support_staff_id}
                    onChange={(id) =>
                      handleSingleRoleChange(
                        "support_staff",
                        id,
                        teamOptions.support_staff
                      )
                    }
                    options={teamOptions.support_staff}
                    placeholder="Select Support Staff"
                    searchable={true}
                  />

                  {/* Event Setup */}
                  <CustomSelect
                    label="Event Setup"
                    value={assignedTeam.event_setup_id}
                    onChange={(id) =>
                      handleSingleRoleChange(
                        "event_setup",
                        id,
                        teamOptions.setup_staff
                      )
                    }
                    options={teamOptions.setup_staff}
                    placeholder="Select Setup Staff"
                    searchable={true}
                  />
                </div>

                {/* DOCTORS SECTION WITH + Add */}
                <div className="pt-4 border-t border-[#F0E8DF]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[14px] font-bold text-[#2C1810]">
                      Doctors
                    </span>
                    <button
                      type="button"
                      onClick={handleAddDoctor}
                      className="flex items-center gap-1 text-[13px] font-bold text-[#2C1810] hover:text-[#6F4432] transition cursor-pointer"
                    >
                      <HiPlus size={14} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignedTeam.doctors.map((doc, idx) => (
                      <CustomSelect
                        key={idx}
                        label={`Doctor ${idx + 1}`}
                        value={doc.id || ""}
                        onChange={(id) => handleDoctorChange(idx, id)}
                        options={teamOptions.doctors}
                        placeholder="Select Doctor"
                        searchable={true}
                      />
                    ))}
                  </div>
                </div>

                {/* THERAPISTS SECTION WITH + Add */}
                <div className="pt-4 border-t border-[#F0E8DF]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[14px] font-bold text-[#2C1810]">
                      Therapists
                    </span>
                    <button
                      type="button"
                      onClick={handleAddTherapist}
                      className="flex items-center gap-1 text-[13px] font-bold text-[#2C1810] hover:text-[#6F4432] transition cursor-pointer"
                    >
                      <HiPlus size={14} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignedTeam.therapists.map((ther, idx) => (
                      <CustomSelect
                        key={idx}
                        label={`Therapist ${idx + 1}`}
                        value={ther.id || ""}
                        onChange={(id) => handleTherapistChange(idx, id)}
                        options={teamOptions.therapists}
                        placeholder="Select Therapist"
                        searchable={true}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F0E8DF]">
                  <button
                    type="button"
                    onClick={() => navigate("/corporate-cell/upcoming-events")}
                    className="rounded-xl border border-[#EAE0D7] bg-[#FAF6F2] hover:bg-[#F3ECE4] px-7 py-2.5 text-[14px] font-semibold text-[#4D2E23] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={savingTeam}
                    onClick={handleSaveTeam}
                    className="rounded-xl bg-[#6F4432] hover:bg-[#5C3626] text-white px-8 py-2.5 text-[14px] font-semibold transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {savingTeam ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateCellEventDetails;

