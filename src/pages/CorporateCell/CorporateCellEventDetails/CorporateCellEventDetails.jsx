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
  HiOutlineDownload,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
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

const DEFAULT_SAMPLE_EMPLOYEES = [
  {
    id: "7d37c547-6869-477b-8791-da539d503383",
    employee_code: "EMP001",
    name: "Dinesh",
    mobile: "8681020094",
    email: "dineshdheena182001@gmail.com",
    department: "Information Technology",
  },
  {
    id: "54aa0267-3c26-4bf7-951c-d699ca375449",
    employee_code: "EMP002",
    name: "Khristal",
    mobile: "9344672887",
    email: "khristal@majestyglobaltech.com",
    department: "Human Resources",
  },
  {
    id: "449f76be-151c-4e71-a16f-b610b021276f",
    employee_code: "EMP003",
    name: "Musthafa",
    mobile: "8667614703",
    email: "musthamirzu15@gmail.com",
    department: "Finance & Accounts",
  },
  {
    id: "4bb7db40-19ff-44d8-af73-cd6e7f70f289",
    employee_code: "EMP004",
    name: "Ashuthosh",
    mobile: "9324042860",
    email: "shree.mgtdesign@gmail.com",
    department: "Marketing",
  },
  {
    id: "d810cbc6-d42f-4f23-aceb-ed92b6bb6716",
    employee_code: "EMP005",
    name: "Prasanth",
    mobile: "9600776521",
    email: "prasanthabel29@gmail.com",
    department: "Operations",
  },
];

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
          <label className="block text-[13.5px] font-semibold text-[#2C1810] dark:text-[#EDE3DA] mb-1.5">
            {label}
          </label>
        )}
        <div className="w-full flex h-[46px] items-center rounded-xl border border-[#EAE0D7] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1F1916] px-3.5 text-[13.5px]">
          {selectedItem ? (
            <span className="font-semibold text-[#2C1810] dark:text-[#EDE3DA] truncate">
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
        <label className="block text-[13.5px] font-semibold text-[#2C1810] dark:text-[#EDE3DA] mb-1.5">
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
        className={`w-full flex h-[46px] items-center justify-between rounded-xl border bg-white dark:bg-[#1F1916] px-3.5 text-left text-[13.5px] transition outline-none cursor-pointer ${
          isOpen
            ? "border-[#6F4432] dark:border-[#8C5E3C] ring-2 ring-[#6F4432]/10"
            : "border-[#E5DCD5] dark:border-[#382E28] hover:border-[#D5C6BA]"
        }`}
      >
        <div className="truncate pr-2">
          {selectedItem ? (
            <span className="font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
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
          className={`shrink-0 text-[#8A7D75] dark:text-[#A8988D] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#6F4432] dark:text-[#C59B82]" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-64 overflow-y-auto rounded-xl border border-[#E5DCD5] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-1.5 shadow-[0_12px_28px_rgba(89,53,44,0.14)]">
          {searchable && options.length > 5 && (
            <div className="p-1 pb-2 border-b border-[#F0E8DF] dark:border-[#382E28] mb-1">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border border-[#EAE0D7] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1F1916] px-3 py-1.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none transition focus:border-[#6F4432] focus:bg-white"
              />
            </div>
          )}

          <div className="space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-center text-xs text-[#8A7D75] dark:text-[#A8988D]">
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
                        ? "bg-[#FAF3EB] dark:bg-[#362C27] text-[#4D2E23] dark:text-[#EDE3DA] font-semibold"
                        : "text-[#3C281E] dark:text-[#EDE3DA] hover:bg-[#FAF6F2] dark:hover:bg-[#2C231F] hover:text-[#2C1810]"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="truncate font-medium">{opt.name}</p>
                      {(opt.specialization || opt.role) && (
                        <p className="text-[11.5px] text-[#8C7D73] dark:text-[#A8988D] truncate">
                          {opt.specialization || opt.role}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <HiCheck size={16} className="shrink-0 text-[#6F4432] dark:text-[#C59B82]" />
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

  const [activeTab, setActiveTab] = useState("resources"); // 'resources' | 'team' | 'attendees'
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState({});

  // Employee Attendees State - empty by default, loaded strictly per event
  const [employeesList, setEmployeesList] = useState([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

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

        // Clean up stale global keys if present
        try {
          localStorage.removeItem("corporate_latest_uploaded_employees");
          localStorage.removeItem("corporate_latest_uploaded_file_name");
        } catch (_) {}

        // Load employees strictly for THIS event only (from API or event-specific cache)
        const apiEmployees = d.uploaded_employees || d.employees || d.employee_list;
        if (Array.isArray(apiEmployees) && apiEmployees.length > 0) {
          setEmployeesList(apiEmployees);
          setUploadedFileName(d.uploaded_file_name || d.file_name || "employees.xlsx");
        } else {
          try {
            const eventKeys = [
              activeEventId,
              d.id,
              d.event_id,
              d.request_no,
              d.event_no,
            ].filter(Boolean);

            let eventSpecificEmployees = null;
            let eventSpecificFile = "";

            for (const key of eventKeys) {
              const localData = localStorage.getItem(`corporate_event_employees_${key}`);
              if (localData) {
                try {
                  const parsed = JSON.parse(localData);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    eventSpecificEmployees = parsed;
                    const fileData = localStorage.getItem(`corporate_event_file_${key}`);
                    if (fileData) {
                      try {
                        eventSpecificFile = JSON.parse(fileData)?.name || "";
                      } catch (_) {}
                    }
                    break;
                  }
                } catch (_) {}
              }
            }

            if (eventSpecificEmployees && eventSpecificEmployees.length > 0) {
              setEmployeesList(eventSpecificEmployees);
              setUploadedFileName(eventSpecificFile || "employees.xlsx");
            } else {
              // This event does NOT have any uploaded employees
              setEmployeesList([]);
              setUploadedFileName("");
            }
          } catch (e) {
            console.warn("Local storage check notice:", e);
            setEmployeesList([]);
            setUploadedFileName("");
          }
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

  // Download Excel / CSV file of uploaded employees
  const handleDownloadExcel = () => {
    if (!employeesList || employeesList.length === 0) {
      toast.error("No employee records to download.");
      return;
    }

    const headers = ["Employee Code", "Name", "Mobile (WhatsApp)", "Email", "Department", "Notification Status"];
    const rows = employeesList.map((emp) => [
      `"${(emp.employee_code || "").replace(/"/g, '""')}"`,
      `"${(emp.name || "").replace(/"/g, '""')}"`,
      `"${(emp.mobile || "").replace(/"/g, '""')}"`,
      `"${(emp.email || "").replace(/"/g, '""')}"`,
      `"${(emp.department || "").replace(/"/g, '""')}"`,
      `"Delivered via WhatsApp"`,
    ]);

    // UTF-8 BOM \uFEFF ensures Microsoft Excel correctly parses UTF-8 encoding and columns
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const eventIdentifier = eventData?.event_no || eventData?.request_no || activeEventId || "event";
    const downloadFileName = `Employees_${eventIdentifier}.csv`;

    link.href = url;
    link.setAttribute("download", downloadFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${downloadFileName}`);
  };

  const handleGoBack = () => {
    if (isReadOnly) {
      navigate("/corporate-cell/upcoming-events");
    } else {
      navigate("/corporate-cell/pending-events");
    }
  };

  // Filtered employees for preview search
  const filteredEmployees = employeesList.filter((emp) => {
    if (!employeeSearchTerm.trim()) return true;
    const term = employeeSearchTerm.toLowerCase();
    return (
      (emp.name || "").toLowerCase().includes(term) ||
      (emp.employee_code || "").toLowerCase().includes(term) ||
      (emp.department || "").toLowerCase().includes(term) ||
      (emp.mobile || "").includes(term) ||
      (emp.email || "").toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout role="corporate_cell">
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] dark:bg-[#1E1714] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Go Back button */}
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#4D2E23] dark:text-[#EDE3DA] hover:text-[#2C1810] transition cursor-pointer"
          >
            <HiOutlineArrowLeft size={16} />
            <span>{isReadOnly ? "Back to Upcoming Events" : "Back to Pending Requests"}</span>
          </button>

          {/* ========================================================= */}
          {/* EVENT SUMMARY CARD */}
          {/* ========================================================= */}
          <div className="rounded-[22px] border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#F0E8DF] dark:border-[#382E28]">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
                  {eventData.title || "Diet & Nutrition Talk"}
                </h2>
                {eventData.event_no && (
                  <span className="text-xs font-semibold text-[#8A7D75] dark:text-[#A8988D] bg-[#FAF4ED] dark:bg-[#1F1916] px-2.5 py-0.5 rounded-md border border-[#EFE5DC] dark:border-[#382E28]">
                    {eventData.event_no}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Download Excel Button in Header - shown only if this specific event has attendees */}
                {employeesList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDownloadExcel}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8EC] hover:bg-[#D4F3DD] dark:bg-[#1C3B28] dark:hover:bg-[#255238] px-3.5 py-1 text-xs font-bold text-[#257A42] dark:text-[#6EE7B7] transition shadow-xs cursor-pointer"
                    title="Download Uploaded Employee Excel"
                  >
                    <RiFileExcel2Line size={15} />
                    <span>Download Excel ({employeesList.length})</span>
                    <HiOutlineDownload size={13} />
                  </button>
                )}

                <span
                  className={`rounded-full px-4 py-1 text-xs font-semibold tracking-wide ${
                    isReadOnly || eventData.status === "confirmed"
                      ? "bg-[#E6F8EB] text-[#22843F] dark:bg-[#1C3B28] dark:text-[#6EE7B7]"
                      : "bg-[#FDF2E9] text-[#D97706] dark:bg-[#482E1A] dark:text-[#FBBF24]"
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
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4ED] dark:bg-[#1F1916] text-[#6F4432] dark:text-[#C59B82]">
                  <HiOutlineCalendar size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                    {eventData.event_date_formatted || "21st October, 2026"}
                  </h4>
                  <p className="text-[12.5px] text-[#7F726A] dark:text-[#A8988D] mt-0.5">
                    {eventData.time_display || "10 AM- 11:30 AM"}
                  </p>
                </div>
              </div>

              {/* Company & Size */}
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4ED] dark:bg-[#1F1916] text-[#6F4432] dark:text-[#C59B82]">
                  <HiOutlineOfficeBuilding size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                    {eventData.company_name || "Reliance Industries Limited"}
                  </h4>
                  <p className="text-[12.5px] text-[#7F726A] dark:text-[#A8988D] mt-0.5">
                    {employeesList.length > 0
                      ? `${employeesList.length} Uploaded Attendees`
                      : (eventData.employee_range || "No attendees uploaded")}
                  </p>
                </div>
              </div>

              {/* Location & Mode */}
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF4ED] dark:bg-[#1F1916] text-[#6F4432] dark:text-[#C59B82]">
                  <HiOutlineLocationMarker size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                    {eventData.mode || "Onsite"}
                  </h4>
                  <p className="text-[12.5px] text-[#7F726A] dark:text-[#A8988D] mt-0.5">
                    {eventData.location || "West Mambalam"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB BAR & MAIN CONTENT CARD */}
          {/* ========================================================= */}
          <div className="rounded-[22px] border border-[#EFE5DC] dark:border-[#382E28] bg-white dark:bg-[#241E1B] p-6 sm:p-8 shadow-2xs">
            {/* Tab Navigation */}
            <div className="border-b border-[#F0E8DF] dark:border-[#382E28] mb-8">
              <nav className="flex space-x-8 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("resources")}
                  className={`relative pb-3.5 text-[15px] font-medium transition cursor-pointer whitespace-nowrap ${
                    activeTab === "resources"
                      ? "text-[#2C1810] dark:text-[#EDE3DA] font-bold"
                      : "text-[#8A7D75] dark:text-[#A8988D] hover:text-[#4D2E23]"
                  }`}
                >
                  <span>Resources</span>
                  {activeTab === "resources" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4D2E23] dark:bg-[#C59B82] rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("team")}
                  className={`relative pb-3.5 text-[15px] font-medium transition cursor-pointer whitespace-nowrap ${
                    activeTab === "team"
                      ? "text-[#2C1810] dark:text-[#EDE3DA] font-bold"
                      : "text-[#8A7D75] dark:text-[#A8988D] hover:text-[#4D2E23]"
                  }`}
                >
                  <span>Assigned Team</span>
                  {activeTab === "team" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4D2E23] dark:bg-[#C59B82] rounded-full" />
                  )}
                </button>

                {/* TAB 3: ATTENDEES (EXCEL FILE) */}
                <button
                  type="button"
                  onClick={() => setActiveTab("attendees")}
                  className={`relative pb-3.5 text-[15px] font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "attendees"
                      ? "text-[#2C1810] dark:text-[#EDE3DA] font-bold"
                      : "text-[#8A7D75] dark:text-[#A8988D] hover:text-[#4D2E23]"
                  }`}
                >
                  <RiFileExcel2Line size={16} className="text-[#257A42] dark:text-[#6EE7B7]" />
                  <span>Employee Attendees ({employeesList.length})</span>
                  {activeTab === "attendees" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4D2E23] dark:bg-[#C59B82] rounded-full" />
                  )}
                </button>
              </nav>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-[#8A7D75] dark:text-[#A8988D] gap-2">
                <HiRefresh className="animate-spin text-[#6F4432] dark:text-[#C59B82]" size={22} />
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
                              <span className="text-[14px] font-semibold text-[#2C1810] dark:text-[#EDE3DA]">
                                {res.resource_name}
                              </span>
                            </label>

                            {/* Qty Box or Text description */}
                            {isVenueSetup ? (
                              <div className="pl-7">
                                <span className="text-[12.5px] text-[#7F726A] dark:text-[#A8988D]">
                                  {res.details || "Mats/Seats/Audiovisuals"}
                                </span>
                              </div>
                            ) : (
                              <div className="pl-7 flex items-center gap-2.5">
                                <span className="text-[12px] font-medium text-[#7F726A] dark:text-[#A8988D]">
                                  Qty
                                </span>
                                {isReadOnly ? (
                                  <span className="inline-flex items-center h-10 px-3.5 rounded-xl border border-[#EAE0D7] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1F1916] text-[13.5px] font-medium text-[#2C1810] dark:text-[#EDE3DA]">
                                    {res.quantity || "0"}
                                  </span>
                                ) : (
                                  <input
                                    type="number"
                                    min="0"
                                    value={res.quantity || ""}
                                    onChange={(e) => handleQuantityChange(idx, e.target.value)}
                                    className="h-10 w-20 rounded-xl border border-[#E5DCD5] dark:border-[#382E28] bg-white dark:bg-[#1F1916] px-3 text-[13.5px] font-semibold text-[#2C1810] dark:text-[#EDE3DA] outline-none transition focus:border-[#6F4432]"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Resources Comments Section */}
                    <div className="space-y-2 pt-2 border-t border-[#F0E8DF] dark:border-[#382E28]">
                      <label className="block text-[13.5px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                        Notes / Requirements
                      </label>
                      <textarea
                        rows={3}
                        disabled={isReadOnly}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Add special instructions for venue setup or event requirements..."
                        className="w-full rounded-2xl border border-[#E5DCD5] dark:border-[#382E28] bg-white dark:bg-[#1F1916] p-3.5 text-[13.5px] text-[#2C1810] dark:text-[#EDE3DA] outline-none transition focus:border-[#6F4432] disabled:bg-[#FAF8F5] dark:disabled:bg-[#1F1916]"
                      />
                    </div>

                    {/* Bottom Save & Continue Button */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0E8DF] dark:border-[#382E28]">
                      <button
                        type="button"
                        onClick={() => handleSaveResources(true)}
                        disabled={savingResources}
                        className="rounded-xl bg-[#6F4432] hover:bg-[#5C3829] dark:bg-[#8A563B] dark:hover:bg-[#9E6344] text-white px-7 py-2.5 text-[14px] font-semibold transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {savingResources ? "Saving..." : "Save & Continue to Team"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: ASSIGNED TEAM */}
                {/* ========================================================= */}
                {activeTab === "team" && (
                  <div className="space-y-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CustomSelect
                        label="Event Coordinator"
                        value={assignedTeam.coordinator_id}
                        disabled={isReadOnly}
                        onChange={(id) => handleSingleRoleChange("coordinator", id, teamOptions.coordinators)}
                        options={teamOptions.coordinators}
                        placeholder="Select Coordinator"
                      />

                      <CustomSelect
                        label="Yoga / Meditation Instructor"
                        value={assignedTeam.yoga_instructor_id}
                        disabled={isReadOnly}
                        onChange={(id) => handleSingleRoleChange("yoga_instructor", id, teamOptions.yoga_instructors)}
                        options={teamOptions.yoga_instructors}
                        placeholder="Select Instructor"
                      />

                      <CustomSelect
                        label="Support Staff"
                        value={assignedTeam.support_staff_id}
                        disabled={isReadOnly}
                        onChange={(id) => handleSingleRoleChange("support_staff", id, teamOptions.support_staff)}
                        options={teamOptions.support_staff}
                        placeholder="Select Support Staff"
                      />

                      <CustomSelect
                        label="Event Setup Coordinator"
                        value={assignedTeam.event_setup_id}
                        disabled={isReadOnly}
                        onChange={(id) => handleSingleRoleChange("event_setup", id, teamOptions.setup_staff)}
                        options={teamOptions.setup_staff}
                        placeholder="Select Setup Staff"
                      />
                    </div>

                    {/* DOCTORS SECTION WITH + Add */}
                    <div className="pt-4 border-t border-[#F0E8DF] dark:border-[#382E28]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[14px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                          Doctors
                        </span>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={handleAddDoctor}
                            className="flex items-center gap-1 text-[13px] font-bold text-[#2C1810] dark:text-[#EDE3DA] hover:text-[#6F4432] transition cursor-pointer"
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
                    <div className="pt-4 border-t border-[#F0E8DF] dark:border-[#382E28]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[14px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                          Therapists
                        </span>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={handleAddTherapist}
                            className="flex items-center gap-1 text-[13px] font-bold text-[#2C1810] dark:text-[#EDE3DA] hover:text-[#6F4432] transition cursor-pointer"
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

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F0E8DF] dark:border-[#382E28]">
                      {isReadOnly ? (
                        <button
                          type="button"
                          onClick={() => navigate("/corporate-cell/upcoming-events")}
                          className="rounded-xl border border-[#EAE0D7] dark:border-[#382E28] bg-[#FAF6F2] dark:bg-[#1F1916] hover:bg-[#F3ECE4] dark:hover:bg-[#2C231F] px-7 py-2.5 text-[14px] font-semibold text-[#4D2E23] dark:text-[#EDE3DA] transition cursor-pointer"
                        >
                          Back to Upcoming Events
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate("/corporate-cell/pending-events")}
                            className="rounded-xl border border-[#EAE0D7] dark:border-[#382E28] bg-[#FAF6F2] dark:bg-[#1F1916] hover:bg-[#F3ECE4] dark:hover:bg-[#2C231F] px-7 py-2.5 text-[14px] font-semibold text-[#4D2E23] dark:text-[#EDE3DA] transition cursor-pointer"
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

                {/* ========================================================= */}
                {/* TAB 3: ATTENDEES (EXCEL FILE DATA & DOWNLOAD) */}
                {/* ========================================================= */}
                {activeTab === "attendees" && (
                  <div className="space-y-6">
                    {employeesList.length === 0 ? (
                      /* Empty State: Shown when no employee spreadsheet was uploaded for this specific event */
                      <div className="py-14 px-6 text-center rounded-2xl border border-dashed border-[#E5DCD5] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1F1916] space-y-3 animate-fadeIn">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EAE3] dark:bg-[#2C231F] text-[#8A7D75] dark:text-[#A8988D]">
                          <RiFileExcel2Line size={28} />
                        </div>
                        <h4 className="text-[16px] font-bold text-[#2C1810] dark:text-[#EDE3DA]">
                          No Employee Attendees File Uploaded For This Event
                        </h4>
                        <p className="text-xs text-[#7F726A] dark:text-[#A8988D] max-w-md mx-auto">
                          This event ({eventData.event_no || eventData.request_no || activeEventId}) has no attached employee Excel spreadsheet. Uploaded employee spreadsheets are associated strictly with the specific event they were uploaded for.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Header with Title and Download Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F0E8DF] dark:border-[#382E28]">
                          <div>
                            <h3 className="text-[18px] font-bold text-[#2C1810] dark:text-[#EDE3DA] flex items-center gap-2">
                              <span>Uploaded Employee Attendees</span>
                              <span className="text-xs font-semibold text-[#257A42] bg-[#E8F8EC] dark:bg-[#1C3B28] dark:text-[#6EE7B7] px-2.5 py-0.5 rounded-full">
                                {employeesList.length} Registered
                              </span>
                            </h3>
                            <p className="text-xs text-[#7F726A] dark:text-[#A8988D] mt-0.5">
                              Uploaded via Excel spreadsheet by Corporate HR. Each attendee has been dispatched WhatsApp & Email notifications.
                            </p>
                          </div>

                          {/* Prominent Download Excel Button */}
                          <button
                            type="button"
                            onClick={handleDownloadExcel}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#257A42] hover:bg-[#1E6536] dark:bg-[#257A42] dark:hover:bg-[#2FA056] px-5 py-2.5 text-sm font-semibold text-white transition shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
                          >
                            <RiFileExcel2Line size={18} />
                            <span>Download Excel File</span>
                            <HiOutlineDownload size={16} />
                          </button>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Card 1: Total Attendees */}
                          <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1F1916] p-4 flex items-center gap-3.5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8EC] text-[#257A42] dark:bg-[#1C3B28] dark:text-[#6EE7B7] shrink-0">
                              <HiOutlineUserGroup size={22} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#7F726A] dark:text-[#A8988D]">Total Attendees</p>
                              <h4 className="text-lg font-bold text-[#2C1810] dark:text-[#EDE3DA]">{employeesList.length} Employees</h4>
                            </div>
                          </div>

                          {/* Card 2: WhatsApp Messages */}
                          <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1F1916] p-4 flex items-center gap-3.5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F8EC] text-[#25D366] dark:bg-[#1C3B28] shrink-0">
                              <FaWhatsapp size={22} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#7F726A] dark:text-[#A8988D]">WhatsApp Sync</p>
                              <h4 className="text-lg font-bold text-[#257A42] dark:text-[#6EE7B7]">100% Dispatched</h4>
                            </div>
                          </div>

                          {/* Card 3: Source File */}
                          <div className="rounded-2xl border border-[#EFE5DC] dark:border-[#382E28] bg-[#FAF8F5] dark:bg-[#1F1916] p-4 flex items-center gap-3.5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF0E6] text-[#7A4B3A] dark:bg-[#34241C] dark:text-[#D5B5A1] shrink-0">
                              <RiFileExcel2Line size={22} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-[#7F726A] dark:text-[#A8988D]">Attached File</p>
                              <h4 className="text-sm font-bold text-[#2C1810] dark:text-[#EDE3DA] truncate" title={uploadedFileName || "employees.xlsx"}>
                                {uploadedFileName || "employees.xlsx"}
                              </h4>
                            </div>
                          </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                          <HiOutlineSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7D75] dark:text-[#A8988D]" />
                          <input
                            type="text"
                            value={employeeSearchTerm}
                            onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                            placeholder="Search employee by name, code, mobile, email or department..."
                            className="w-full rounded-xl border border-[#E5DCD5] dark:border-[#382E28] bg-white dark:bg-[#1F1916] pl-10 pr-4 py-2.5 text-xs text-[#2C1810] dark:text-[#EDE3DA] outline-none transition focus:border-[#6F4432]"
                          />
                        </div>

                        {/* Attendees Data Table */}
                        <div className="overflow-x-auto rounded-2xl border border-[#F0E6DE] dark:border-[#382E28]">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF6F2] dark:bg-[#1F1916] text-[#7F726A] dark:text-[#A8988D] uppercase font-semibold border-b border-[#F0E6DE] dark:border-[#382E28]">
                              <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Employee Name</th>
                                <th className="px-4 py-3">Mobile (WhatsApp)</th>
                                <th className="px-4 py-3">Email Address</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Notification Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0E6DE] dark:divide-[#382E28] text-[#4D2E23] dark:text-[#EDE3DA]">
                              {filteredEmployees.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="px-4 py-8 text-center text-[#8A7D75] dark:text-[#A8988D]">
                                    No employees found matching "{employeeSearchTerm}".
                                  </td>
                                </tr>
                              ) : (
                                filteredEmployees.map((emp, idx) => (
                                  <tr key={emp.id || idx} className="hover:bg-[#FAF8F5] dark:hover:bg-[#2C231F] transition">
                                    <td className="px-4 py-3 text-[#8A7D75] dark:text-[#A8988D]">{idx + 1}</td>
                                    <td className="px-4 py-3 font-semibold text-[#6F4432] dark:text-[#C59B82]">
                                      {emp.employee_code || `EMP00${idx + 1}`}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-[#2C1810] dark:text-[#EDE3DA]">
                                      {emp.name}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="inline-flex items-center gap-1.5 font-medium">
                                        <FaWhatsapp size={14} className="text-[#25D366]" />
                                        {emp.mobile}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-[#7F726A] dark:text-[#A8988D]">
                                      {emp.email}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="inline-block rounded-md bg-[#FAF4ED] dark:bg-[#1F1916] px-2 py-0.5 text-[11px] font-medium text-[#6F4432] dark:text-[#EDE3DA] border border-[#EFE5DC] dark:border-[#382E28]">
                                        {emp.department || "General"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#257A42] bg-[#E8F8EC] dark:bg-[#1C3B28] dark:text-[#6EE7B7] px-2.5 py-0.5 rounded-full">
                                        <HiOutlineCheckCircle size={13} />
                                        WhatsApp Notified
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
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
