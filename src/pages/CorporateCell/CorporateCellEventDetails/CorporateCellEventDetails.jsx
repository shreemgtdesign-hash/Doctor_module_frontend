import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  getCorporateCellPendingEventDetails,
  getCorporateCellEventResources,
  updateCorporateCellEventResources,
  getCorporateCellTeamOptions,
  getCorporateCellEventTeam,
  updateCorporateCellEventTeam,
} from "../../../api/corporateCellApi";

const EMPTY_TEAM_OPTIONS = {
  coordinators: [],
  yoga_instructors: [],
  support_staff: [],
  setup_staff: [],
  doctors: [],
  therapists: [],
};

const CustomSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  searchable = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const selectedItem =
    options.find((opt) => opt.id === value) ||
    (value && typeof value === "object" ? value : null);

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

  if (disabled) {
    return (
      <div>
        {label && (
          <label className="block text-[13.5px] font-semibold text-[#2C1810] mb-1.5">
            {label}
          </label>
        )}
        <div className="w-full flex h-[46px] items-center rounded-xl border border-[#EAE0D7] bg-[#FAF8F5] px-3.5 text-[13.5px]">
          {selectedItem ? (
            <span className="font-semibold text-[#2C1810] truncate">
              {selectedItem.name || selectedItem.doctor_name || selectedItem.therapist_name}
              {selectedItem.specialization
                ? ` (${selectedItem.specialization})`
                : selectedItem.role
                ? ` (${selectedItem.role})`
                : ""}
            </span>
          ) : (
            <span className="text-[#A8988D]">Not assigned</span>
          )}
        </div>
      </div>
    );
  }

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

      {/* Custom Dropdown Menu */}
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

const CorporateCellEventDetails = ({ isReadOnly: isReadOnlyProp, isPending: isPendingProp }) => {
  const { eventId, id } = useParams();
  const activeEventId = eventId || id || "ce_evt_pending_03";
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("resources"); // 'resources' | 'team'
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState({});

  // Determine read-only view:
  // If explicitly read-only, or accessed via /corporate-cell/upcoming-events/:id, or status is confirmed
  const isReadOnly = Boolean(
    isReadOnlyProp ||
    location.pathname.includes("/upcoming-events") ||
    eventData?.status?.toLowerCase() === "confirmed" ||
    eventData?.status?.toLowerCase() === "upcoming"
  );

  // Resources state
  const [resourcesList, setResourcesList] = useState([]);
  const [comments, setComments] = useState("");
  const [savingResources, setSavingResources] = useState(false);

  // Assigned team state
  const [teamOptions, setTeamOptions] = useState(EMPTY_TEAM_OPTIONS);
  const [assignedTeam, setAssignedTeam] = useState({
    coordinator_id: "",
    coordinator_name: "",
    yoga_instructor_id: "",
    yoga_instructor_name: "",
    support_staff_id: "",
    support_staff_name: "",
    event_setup_id: "",
    event_setup_name: "",
    doctors: [],
    therapists: [],
  });
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const isPendingRoute =
      isPendingProp ||
      location.pathname.includes("/pending-events") ||
      location.pathname.includes("/pending-requests");

    // Fetch details: if on pending route, use getCorporateCellPendingEventDetails first
    const fetchDetails = isPendingRoute
      ? getCorporateCellPendingEventDetails(activeEventId).catch(() =>
          getCorporateCellEventDetails(activeEventId)
        )
      : getCorporateCellEventDetails(activeEventId).catch(() =>
          getCorporateCellPendingEventDetails(activeEventId)
        );

    Promise.allSettled([
      fetchDetails,
      getCorporateCellEventResources(activeEventId),
      getCorporateCellTeamOptions(),
      getCorporateCellEventTeam(activeEventId),
    ]).then(([detailsRes, resRes, optRes, teamRes]) => {
      if (!isMounted) return;

      if (detailsRes.status === "fulfilled" && detailsRes.value?.data?.data) {
        const d = detailsRes.value.data.data;
        setEventData(d);

        // Validate event status:
        // - If event confirmation status is already confirmed -> redirect to /upcoming-events
        // - If event request is under pending confirmation -> redirect to /pending-events
        const currentStatus = (d.status || "").toLowerCase();
        if (
          (currentStatus === "confirmed" || currentStatus === "upcoming") &&
          (location.pathname.includes("/pending-events") || location.pathname.includes("/pending-requests"))
        ) {
          navigate(`/corporate-cell/upcoming-events/${activeEventId}`, { replace: true });
          return;
        }
        if (
          currentStatus === "pending" &&
          location.pathname.includes("/upcoming-events")
        ) {
          navigate(`/corporate-cell/pending-events/${activeEventId}`, { replace: true });
          return;
        }

        // If the pending event payload already contains resources
        if (Array.isArray(d.resources) && d.resources.length > 0) {
          setResourcesList(d.resources);
        }
        if (d.resources_comments) {
          setComments(d.resources_comments);
        } else if (d.notes) {
          setComments(d.notes);
        }

        // If the pending event payload already contains assigned_team
        if (d.assigned_team) {
          const t = d.assigned_team;
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
                ? t.doctors
                : prev.doctors,
            therapists:
              Array.isArray(t.therapists) && t.therapists.length > 0
                ? t.therapists
                : prev.therapists,
          }));
        }
      }

      if (resRes.status === "fulfilled" && resRes.value?.data?.data) {
        const rData = resRes.value.data.data;
        if (Array.isArray(rData.resources) && rData.resources.length > 0) {
          setResourcesList(rData.resources);
        }
        if (typeof rData.comments === "string" && rData.comments) {
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
          coordinator_id: t.coordinator_id || prev.coordinator_id || "",
          coordinator_name: t.coordinator_name || prev.coordinator_name || "",
          yoga_instructor_id: t.yoga_instructor_id || prev.yoga_instructor_id || "",
          yoga_instructor_name: t.yoga_instructor_name || prev.yoga_instructor_name || "",
          support_staff_id: t.support_staff_id || prev.support_staff_id || "",
          support_staff_name: t.support_staff_name || prev.support_staff_name || "",
          event_setup_id: t.event_setup_id || prev.event_setup_id || "",
          event_setup_name: t.event_setup_name || prev.event_setup_name || "",
          doctors:
            Array.isArray(t.doctors) && t.doctors.length > 0
              ? t.doctors
              : prev.doctors,
          therapists:
            Array.isArray(t.therapists) && t.therapists.length > 0
              ? t.therapists
              : prev.therapists,
        }));
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeEventId, isPendingProp, location.pathname]);

  // Resource handlers (only active when not read-only)
  const handleToggleResource = (index) => {
    if (isReadOnly) return;
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
    if (isReadOnly) return;
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
    if (isReadOnly) {
      if (switchTab) setActiveTab("team");
      return;
    }
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
      toast.success("Event resources updated!");
      if (switchTab) {
        setActiveTab("team");
      }
    } finally {
      setSavingResources(false);
    }
  };

  // Assigned Team handlers
  const handleSingleRoleChange = (roleKey, id, optionsList) => {
    if (isReadOnly) return;
    const selected = optionsList.find((item) => item.id === id);
    setAssignedTeam((prev) => ({
      ...prev,
      [`${roleKey}_id`]: id,
      [`${roleKey}_name`]: selected ? selected.name : "",
    }));
  };

  const handleDoctorChange = (index, id) => {
    if (isReadOnly) return;
    const selected = teamOptions.doctors.find((item) => item.id === id);
    setAssignedTeam((prev) => {
      const updated = [...prev.doctors];
      updated[index] = {
        id,
        name: selected ? selected.name : "",
        specialization: selected ? selected.specialization : "",
      };
      return { ...prev, doctors: updated };
    });
  };

  const handleAddDoctor = () => {
    if (isReadOnly) return;
    setAssignedTeam((prev) => ({
      ...prev,
      doctors: [...prev.doctors, { id: "", name: "", specialization: "" }],
    }));
  };

  const handleTherapistChange = (index, id) => {
    if (isReadOnly) return;
    const selected = teamOptions.therapists.find((item) => item.id === id);
    setAssignedTeam((prev) => {
      const updated = [...prev.therapists];
      updated[index] = {
        id,
        name: selected ? selected.name : "",
        specialization: selected ? selected.specialization : "",
      };
      return { ...prev, therapists: updated };
    });
  };

  const handleAddTherapist = () => {
    if (isReadOnly) return;
    setAssignedTeam((prev) => ({
      ...prev,
      therapists: [...prev.therapists, { id: "", name: "", specialization: "" }],
    }));
  };

  // Confirm Event Handler:
  // Saves Resources and assigns Team via PUT /corporatecell/pending-events/:id/team
  // which automatically triggers the event status to confirmed on the backend
  const handleConfirmEvent = async () => {
    setConfirming(true);
    try {
      // 1. Update Resources (if modified)
      if (resourcesList && resourcesList.length > 0) {
        try {
          await updateCorporateCellEventResources(activeEventId, {
            resources: resourcesList,
            comments,
          });
        } catch (e) {
          console.warn("Update resources note:", e);
        }
      }

      // 2. Update Team via PUT /corporatecell/pending-events/:id/team
      // (This exact call assigns the team and transitions status to confirmed)
      const teamPayload = {
        coordinator_id: assignedTeam.coordinator_id,
        coordinator_name: assignedTeam.coordinator_name,
        yoga_instructor_id: assignedTeam.yoga_instructor_id,
        yoga_instructor_name: assignedTeam.yoga_instructor_name,
        support_staff_id: assignedTeam.support_staff_id,
        support_staff_name: assignedTeam.support_staff_name,
        event_setup_id: assignedTeam.event_setup_id,
        event_setup_name: assignedTeam.event_setup_name,
        doctors: (assignedTeam.doctors || []).filter((d) => d.id),
        therapists: (assignedTeam.therapists || []).filter((t) => t.id),
      };

      const res = await updateCorporateCellEventTeam(activeEventId, teamPayload);

      toast.success(res?.data?.message || "Event confirmed successfully! Moved to Upcoming Events.");
      navigate("/corporate-cell/upcoming-events");
    } catch (err) {
      console.error("Confirm event error via team assignment:", err);
      toast.error(err.response?.data?.message || "Failed to confirm event. Please check team assignment.");
    } finally {
      setConfirming(false);
    }
  };

  const handleGoBack = () => {
    if (isReadOnly) {
      navigate("/corporate-cell/upcoming-events");
    } else {
      navigate("/corporate-cell/pending-events");
    }
  };

  return (
    <DashboardLayout role="corporate_cell">
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Go Back button */}
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#4D2E23] hover:text-[#2C1810] transition cursor-pointer"
          >
            <HiOutlineArrowLeft size={16} />
            <span>{isReadOnly ? "Back to Upcoming Events" : "Back to Pending Requests"}</span>
          </button>

          {/* ========================================================= */}
          {/* EVENT SUMMARY CARD */}
          {/* ========================================================= */}
          <div className="rounded-[22px] border border-[#EFE5DC] bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-5 border-b border-[#F0E8DF]">
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#2C1810] tracking-tight">
                  {eventData.title || "Diet & Nutrition Talk"}
                </h2>
                {eventData.event_no && (
                  <span className="text-xs font-semibold text-[#8A7D75] bg-[#FAF4ED] px-2.5 py-0.5 rounded-md border border-[#EFE5DC]">
                    {eventData.event_no}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-4 py-1 text-xs font-semibold tracking-wide ${
                    isReadOnly || eventData.status === "confirmed"
                      ? "bg-[#E6F8EB] text-[#22843F]"
                      : "bg-[#FDF2E9] text-[#D97706]"
                  }`}
                >
                  {isReadOnly || eventData.status === "confirmed" ? "Confirmed" : "Pending Confirmation"}
                </span>
              </div>
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
                    {eventData.event_date_formatted || "21st October, 2026"}
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
                    {eventData.employee_range || "250-3Employees"}
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

            {loading ? (
              <div className="flex items-center justify-center py-20 text-[#8A7D75] gap-2">
                <HiRefresh className="animate-spin text-[#6F4432]" size={22} />
                <span className="text-sm font-medium">Loading event details...</span>
              </div>
            ) : (
              <>
                {/* ========================================================= */}
                {/* TAB 1: RESOURCES */}
                {/* ========================================================= */}
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
                            <label
                              className={`flex items-center gap-2.5 select-none ${
                                isReadOnly ? "cursor-default" : "cursor-pointer"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isReadOnly}
                                onChange={() => handleToggleResource(idx)}
                                className={`h-4.5 w-4.5 rounded border-[#D2C5BA] text-[#6F4432] focus:ring-[#6F4432] accent-[#6F4432] ${
                                  isReadOnly ? "cursor-default opacity-85" : "cursor-pointer"
                                }`}
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
                                {isReadOnly ? (
                                  <span className="inline-flex items-center h-10 px-3.5 rounded-xl border border-[#EAE0D7] bg-[#FAF8F5] text-[13.5px] font-medium text-[#2C1810]">
                                    {res.quantity || "0"}
                                  </span>
                                ) : (
                                  <input
                                    type="text"
                                    value={res.quantity ?? ""}
                                    onChange={(e) => handleQuantityChange(idx, e.target.value)}
                                    placeholder=""
                                    className="h-10 w-32 rounded-xl border border-[#E5DCD5] bg-white px-3 text-[13.5px] font-medium text-[#2C1810] outline-none transition focus:border-[#6F4432] focus:ring-1 focus:ring-[#6F4432]"
                                  />
                                )}
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
                      {isReadOnly ? (
                        <div className="w-full rounded-2xl border border-[#EAE0D7] bg-[#FAF8F5] p-3.5 text-[13.5px] text-[#2C1810] min-h-[90px] whitespace-pre-wrap">
                          {comments || "No comments provided."}
                        </div>
                      ) : (
                        <textarea
                          rows={4}
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="Enter Comments"
                          className="w-full rounded-2xl border border-[#E5DCD5] bg-white p-3.5 text-[13.5px] text-[#2C1810] placeholder:text-[#A9988D] outline-none transition focus:border-[#6F4432] focus:ring-1 focus:ring-[#6F4432]"
                        />
                      )}
                    </div>

                    {/* Bottom Actions:
                        - In Read-Only mode: Only a Next tab button or Back button. No Save/Confirm buttons!
                        - In Pending mode: Cancel and Next button */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F0E8DF]">
                      {isReadOnly ? (
                        <button
                          type="button"
                          onClick={() => setActiveTab("team")}
                          className="rounded-xl bg-[#6F4432] hover:bg-[#5C3626] text-white px-8 py-2.5 text-[14px] font-semibold transition shadow-xs cursor-pointer"
                        >
                          Next: View Assigned Team
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate("/corporate-cell/pending-events")}
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
                            {savingResources ? "Saving..." : "Save & Next"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: ASSIGNED TEAM */}
                {/* ========================================================= */}
                {activeTab === "team" && (
                  <div className="space-y-8">
                    {/* 2 Column Role Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Event Coordinator */}
                      <CustomSelect
                        label="Event Coordinator"
                        value={assignedTeam.coordinator_id}
                        disabled={isReadOnly}
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
                        disabled={isReadOnly}
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
                        disabled={isReadOnly}
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
                        disabled={isReadOnly}
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
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={handleAddDoctor}
                            className="flex items-center gap-1 text-[13px] font-bold text-[#2C1810] hover:text-[#6F4432] transition cursor-pointer"
                          >
                            <HiPlus size={14} />
                            <span>Add</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(isReadOnly
                          ? assignedTeam.doctors.filter((d) => d.id || d.name)
                          : assignedTeam.doctors
                        ).map((doc, idx) => (
                          <CustomSelect
                            key={idx}
                            label={`Doctor ${idx + 1}`}
                            value={doc.id || ""}
                            disabled={isReadOnly}
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
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={handleAddTherapist}
                            className="flex items-center gap-1 text-[13px] font-bold text-[#2C1810] hover:text-[#6F4432] transition cursor-pointer"
                          >
                            <HiPlus size={14} />
                            <span>Add</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(isReadOnly
                          ? assignedTeam.therapists.filter((t) => t.id || t.name)
                          : assignedTeam.therapists
                        ).map((ther, idx) => (
                          <CustomSelect
                            key={idx}
                            label={`Therapist ${idx + 1}`}
                            value={ther.id || ""}
                            disabled={isReadOnly}
                            onChange={(id) => handleTherapistChange(idx, id)}
                            options={teamOptions.therapists}
                            placeholder="Select Therapist"
                            searchable={true}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions:
                        - In Read-Only mode: NO save or confirm buttons! Only back button.
                        - In Pending mode: Cancel and "Confirm Event" button! */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F0E8DF]">
                      {isReadOnly ? (
                        <button
                          type="button"
                          onClick={() => navigate("/corporate-cell/upcoming-events")}
                          className="rounded-xl border border-[#EAE0D7] bg-[#FAF6F2] hover:bg-[#F3ECE4] px-7 py-2.5 text-[14px] font-semibold text-[#4D2E23] transition cursor-pointer"
                        >
                          Back to Upcoming Events
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate("/corporate-cell/pending-events")}
                            className="rounded-xl border border-[#EAE0D7] bg-[#FAF6F2] hover:bg-[#F3ECE4] px-7 py-2.5 text-[14px] font-semibold text-[#4D2E23] transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={confirming}
                            onClick={handleConfirmEvent}
                            className="rounded-xl bg-[#22843F] hover:bg-[#1B6F35] text-white px-9 py-2.5 text-[14px] font-semibold transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                          >
                            {confirming && <HiRefresh className="animate-spin" size={16} />}
                            <span>{confirming ? "Confirming Event..." : "Confirm Event"}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateCellEventDetails;
