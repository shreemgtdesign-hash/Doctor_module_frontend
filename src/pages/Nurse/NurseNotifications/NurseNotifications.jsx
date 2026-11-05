import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiCheck, HiOutlineBell } from "react-icons/hi2";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import {
  loadNurseNotifications,
  readNurseNotification,
  readAllNurseNotifications,
} from "../../../redux/nurse/nurseThunk";
import {
  selectNurseNotifications,
  selectNurseNotificationTabs,
  selectNurseUnreadCount,
  selectNurseNotificationsLoading,
  selectNurseNotificationsError,
} from "../../../redux/nurse/nurseSlice";

const DEFAULT_TABS = [
  "All",
  "Admissions",
  "Meals",
  "Activities",
  "Medicines",
  "Discharges",
];

const NurseNotifications = () => {
  const dispatch = useDispatch();

  const notifications = useSelector(selectNurseNotifications);
  const serverTabs = useSelector(selectNurseNotificationTabs);
  const unreadCount = useSelector(selectNurseUnreadCount);
  const loading = useSelector(selectNurseNotificationsLoading);
  const error = useSelector(selectNurseNotificationsError);

  const [activeTab, setActiveTab] = useState("All");

  const tabs = serverTabs && serverTabs.length > 0 ? serverTabs : DEFAULT_TABS;

  useEffect(() => {
    dispatch(
      loadNurseNotifications({
        tab: activeTab.toLowerCase(),
      })
    );
  }, [dispatch, activeTab]);

  const handleMarkAsRead = async (item) => {
    if (!item.is_read) {
      await dispatch(readNurseNotification(item.id));
    }
  };

  const handleMarkAllRead = async () => {
    await dispatch(readAllNurseNotifications());
    toast.success("All notifications marked as read");
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "All") return true;
    if (!item.category) return true;
    const cat = String(item.category || "").toLowerCase();
    return cat === activeTab.toLowerCase();
  });

  return (
    <DashboardLayout role="nurse">
      <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#1A1412] px-6 py-6 font-sans space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2C1810] dark:text-[#EDE3DA] tracking-tight">
              Notifications
            </h1>
            <p className="text-xs font-medium text-[#7D726B] dark:text-[#A8988D] mt-1">
              You&apos;ll be notified here whenever a patient is admitted.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-[#8A5035] dark:text-[#D5A794] hover:underline cursor-pointer self-start sm:self-auto"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-[#E7DBD3] dark:border-[#382D25] overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab.toLowerCase() === tab.toLowerCase();
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-b-2 border-[#542F1E] dark:border-[#D5A794] text-[#2C1810] dark:text-[#EDE3DA] font-bold"
                    : "text-[#7D726B] dark:text-[#A8988D] hover:text-[#2C1810] dark:hover:text-[#EDE3DA] font-medium"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-16 rounded-xl bg-white dark:bg-[#241E1B] border border-[#E7DBD3] dark:border-[#382D25] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-6 text-center text-sm text-red-600 dark:text-red-400">
            {typeof error === "string" ? error : "Failed to load notifications."}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E7DBD3] dark:border-[#382D25] bg-white/50 dark:bg-[#201A17]/50 p-16 text-center">
            <HiOutlineBell className="mx-auto text-3xl text-[#B3A499] mb-3" />
            <h4 className="text-sm font-bold text-[#4B2E2A] dark:text-[#EDE3DA]">
              No notifications
            </h4>
            <p className="text-xs text-[#7D726B] dark:text-[#A8988D] mt-1">
              There are no new notifications in the &quot;{activeTab}&quot; category.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F2E8E1] dark:divide-[#382D25]">
            {filteredNotifications.map((item) => {
              const title = item.title || "Notification";
              const message = item.body || item.message || "";
              const timeAgo = item.time_ago || "Just now";

              return (
                <div
                  key={item.id}
                  onClick={() => handleMarkAsRead(item)}
                  className={`py-4 flex items-start gap-4 transition-colors px-2 rounded-xl cursor-pointer ${
                    !item.is_read
                      ? "bg-[#FAF4ED]/50 dark:bg-[#261E1A]/60"
                      : "hover:bg-[#FAF6F2]/40 dark:hover:bg-[#221B17]/40"
                  }`}
                >
                  {/* Status Circle Icon */}
                  <div className="h-5 w-5 rounded-full border-2 border-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                    <HiCheck className="text-[#16A34A] text-xs font-bold" />
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[14px] font-bold text-[#2C1810] dark:text-[#EDE3DA] truncate">
                        {title}
                      </h3>
                      <span className="text-[12px] font-medium text-[#A8988D] shrink-0">
                        {timeAgo}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#7D726B] dark:text-[#A8988D] mt-0.5 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NurseNotifications;

