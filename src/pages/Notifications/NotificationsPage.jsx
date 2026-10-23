import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiX, HiOutlineBell, HiRefresh } from "react-icons/hi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";
import { getNotificationRedirectUrl, resolveCorporateEventNotificationUrl, getActiveRole } from "../../utils/notificationFilter";

const DEFAULT_TABS = [
  { key: "all", label: "All" },
  { key: "events", label: "Corporate Events" },
  { key: "appointments", label: "Appointments" },
  { key: "therapies", label: "Therapies" },
  { key: "home_services", label: "Home Services" },
  { key: "online_orders", label: "Online Orders" },
  { key: "payments", label: "Payments" },
];

const FALLBACK_NOTIFICATIONS = [
  {
    id: "notif-1",
    category: "Appointments",
    title: "Appointment Booked",
    body: "Meera Iyer has been scheduled for an In-Person Consultation with Dr. Jayasree Iyer [ID:IP002]",
    icon_type: "success",
    time_ago: "2 min",
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    category: "Therapies",
    title: "Therapy Request",
    body: "Meera Iyer has Requested for a Shirodhara therapy. [ID:IP002]",
    icon_type: "success",
    time_ago: "4 min",
    is_read: false,
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    category: "Online Orders",
    title: "Online Order Placed",
    body: "Meera Iyer has Placed an order for Anuthailam [ID:IP002]",
    icon_type: "success",
    time_ago: "7 min",
    is_read: false,
    created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-4",
    category: "Payments",
    title: "Payment Successful",
    body: "Payment of Rs.5670 for Meera Iyer was successful [ID:IP002]",
    icon_type: "success",
    time_ago: "11 min",
    is_read: false,
    created_at: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-5",
    category: "Payments",
    title: "Payment Failed",
    body: "Payment of Rs.5670 for Meera Iyer has failed [ID:IP002]",
    icon_type: "failed",
    time_ago: "12 min",
    is_read: false,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-6",
    category: "Appointments",
    title: "Appointment Booked",
    body: "Meera Iyer has been scheduled for an In-Person Consultation with Dr. Jayasree Iyer [ID:IP002]",
    icon_type: "success",
    time_ago: "14 min",
    is_read: true,
    created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-7",
    category: "Therapies",
    title: "Therapy Request",
    body: "Meera Iyer has Requested for a Shirodhara therapy. [ID:IP002]",
    icon_type: "success",
    time_ago: "27 min",
    is_read: true,
    created_at: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-8",
    category: "Events",
    title: "New Corporate Event Request",
    body: "Reliance Industries Limited requested a Yoga & Meditation session [ID:EVT-261022-708]",
    icon_type: "success",
    time_ago: "5 min",
    is_read: false,
    event_id: "EVT-261022-708",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [filterTabs, setFilterTabs] = useState(DEFAULT_TABS);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotificationList = async (filterKey) => {
    setLoading(true);
    try {
      const res = await getNotifications({ filter: filterKey });
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setNotifications(res.data.data);
        if (Array.isArray(res.data?.filters) && res.data.filters.length > 0) {
          setFilterTabs(
            res.data.filters.map((f) => ({
              key: f.key,
              label: f.label,
              count: f.count,
            }))
          );
        }
        if (typeof res.data?.unread_count === "number") {
          setUnreadCount(res.data.unread_count);
        }
      } else {
        // Fallback filter
        const filteredFallback =
          filterKey === "all"
            ? FALLBACK_NOTIFICATIONS
            : FALLBACK_NOTIFICATIONS.filter((item) => {
                const cat = (item.category || "").toLowerCase().replace(/\s+/g, "_");
                return cat === filterKey;
              });
        setNotifications(filteredFallback);
      }
    } catch (err) {
      console.warn("Notifications API request failed, using fallback:", err);
      const filteredFallback =
        filterKey === "all"
          ? FALLBACK_NOTIFICATIONS
          : FALLBACK_NOTIFICATIONS.filter((item) => {
              const cat = (item.category || "").toLowerCase().replace(/\s+/g, "_");
              return cat === filterKey;
            });
      setNotifications(filteredFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationList(selectedFilter);
  }, [selectedFilter]);

  const handleTabClick = (key) => {
    setSelectedFilter(key);
  };

  const handleNotificationClick = async (notif) => {
    if (!notif?.is_read && notif?.id) {
      try {
        await markNotificationAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (e) {
        console.warn("Could not mark notification as read:", e);
      }
    }

    // Role-aware navigation & status validation:
    // - If already confirmed -> /corporate-cell/upcoming-events/:id
    // - If under pending confirmation -> /corporate-cell/pending-events/:id
    const currentRole = getActiveRole(null, localStorage.getItem("role"));
    const redirectUrl = await resolveCorporateEventNotificationUrl(notif, currentRole);
    if (redirectUrl && redirectUrl !== "/") {
      navigate(redirectUrl);
      return;
    }

    // Direct url navigation
    const targetUrl = notif?.data?.url || notif?.url;
    if (targetUrl) {
      navigate(targetUrl);
      return;
    }

    const appointmentId =
      notif?.data?.appointment_id || notif?.appointment_id;
    if (appointmentId) {
      const userRole = (currentRole || localStorage.getItem("role") || "").toLowerCase();
      if (userRole === "doctor") {
        navigate("/doctor/appointments");
      } else if (userRole.includes("duty")) {
        navigate("/duty-doctor/dashboard");
      } else if (userRole.includes("pharmacist")) {
        navigate("/pharmacist/appointments");
      } else if (userRole.includes("therapist")) {
        navigate("/therapist/appointments");
      } else {
        navigate(`/frontoffice/upcoming-appointments/${appointmentId}`);
      }
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.warn("Could not mark all as read:", e);
    }
  };

  // Helper to format display time if time_ago is not provided
  const formatTime = (timeAgo, createdAt) => {
    if (timeAgo) return timeAgo;
    if (!createdAt) return "";
    try {
      const diff = Date.now() - new Date(createdAt).getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hr`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} d`;
      return new Date(createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const isFailedNotification = (notif) => {
    const iconType = (notif.icon_type || "").toLowerCase();
    const title = (notif.title || "").toLowerCase();
    const body = (notif.body || "").toLowerCase();
    return (
      iconType === "failed" ||
      iconType === "error" ||
      title.includes("failed") ||
      title.includes("cancelled") ||
      title.includes("declined") ||
      body.includes("failed")
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-88px)] w-full bg-[#FAF7F2] px-4 py-6 sm:px-8 sm:py-8 font-sans">
        {/* Header container */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6">
            <div>
              <h1 className="text-[26px] font-bold text-[#2C1810] tracking-tight">
                Notifications
              </h1>
              <p className="mt-1 text-[14px] text-[#7F726A]">
                View and manage your notifications here.
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="self-start sm:self-auto text-xs font-semibold text-[#6F4432] hover:text-[#4D2E23] bg-white border border-[#E4D9C5] px-3.5 py-1.5 rounded-lg shadow-2xs hover:bg-[#F8F1EB] transition"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs Navigation */}
          <div className="border-b border-[#E8DEC9] overflow-x-auto no-scrollbar">
            <nav className="flex space-x-6 sm:space-x-8 min-w-max pb-px">
              {filterTabs.map((tab) => {
                const isActive = selectedFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabClick(tab.key)}
                    className={`relative pb-3 text-[14.5px] font-medium transition-colors ${
                      isActive
                        ? "text-[#2C1810] font-bold"
                        : "text-[#8A7D75] hover:text-[#4D2E23]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4D2E23] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Notification List Content */}
          <div className="mt-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-[#EFE5DC] shadow-2xs overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-[#8A7D75] gap-2">
                <HiRefresh className="animate-spin text-[#6F4432]" size={22} />
                <span className="text-sm font-medium">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3ECE4] text-[#8A7D75] mb-3">
                  <HiOutlineBell size={26} />
                </div>
                <p className="text-[15px] font-semibold text-[#2C1810]">
                  No notifications yet
                </p>
                <p className="text-xs text-[#8A7D75] mt-1">
                  You are all caught up for this section.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[#F1E8DE]">
                {notifications.map((notif) => {
                  const isFailed = isFailedNotification(notif);
                  return (
                    <li
                      key={notif.id || `${notif.title}-${notif.created_at}`}
                      onClick={() => handleNotificationClick(notif)}
                      className={`group flex items-start justify-between gap-4 px-5 py-4 transition-colors cursor-pointer hover:bg-[#FAF4EE] ${
                        !notif.is_read ? "bg-[#FFFDFC]" : "bg-transparent"
                      }`}
                    >
                      {/* Left: Status Icon and Details */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* Circle Status Icon */}
                        <div className="mt-0.5 shrink-0">
                          {isFailed ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-[1.8px] border-[#DC2626] text-[#DC2626]">
                              <HiX size={14} className="stroke-[1.5]" />
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-[1.8px] border-[#16A34A] text-[#16A34A]">
                              <HiCheck size={14} className="stroke-[1.5]" />
                            </div>
                          )}
                        </div>

                        {/* Text: Title and Body */}
                        <div className="min-w-0">
                          <h4
                            className={`text-[14.5px] font-semibold leading-snug tracking-tight ${
                              isFailed ? "text-[#991B1B]" : "text-[#237839]"
                            }`}
                          >
                            {notif.title || notif.category || "Notification"}
                          </h4>
                          <p className="mt-0.5 text-[13.5px] text-[#4A4540] leading-relaxed break-words">
                            {notif.body || notif.message || notif.description || ""}
                          </p>
                        </div>
                      </div>

                      {/* Right: Time ago */}
                      <div className="shrink-0 text-right pt-0.5">
                        <span className="text-[13px] text-[#8F847C] whitespace-nowrap">
                          {formatTime(notif.time_ago, notif.created_at)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;

