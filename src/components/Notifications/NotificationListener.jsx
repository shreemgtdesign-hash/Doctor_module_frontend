import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onMessage } from "firebase/messaging";
import { messaging, generateToken } from "../../firebase/firebase";
import {
  registerDeviceFCMToken,
  loadNotifications,
} from "../../redux/notifications/notificationThiunk";
import { showSuccessToast } from "../../../utils/showToast";
import { isNotificationForRole } from "../../utils/notificationFilter";

// ======================================================
// Helpers
// ======================================================

const normalizeRole = (r) =>
  (r || "").toLowerCase().trim().replace(/[\s_-]/g, "");

const NotificationListener = () => {
  const dispatch = useDispatch();

  // Read role directly from Redux (now stored in authSlice)
  const { token, role: reduxRole, user } = useSelector(
    (state) => state.auth
  );
  const authToken = token || localStorage.getItem("token");

  // ------------------------------------------------------------------
  // Resolve the active role: Redux > localStorage
  // ------------------------------------------------------------------
  const getActiveRole = () =>
    reduxRole ||
    localStorage.getItem("role") ||
    user?.role ||
    "";

  // Track last registered token+role pair to skip redundant API calls
  const registeredTokenRef = useRef(null);

  // Track recently shown notification events for deduplication
  // Key: eventKey (appointment ID or text hash), Value: { timestamp, count }
  const recentEventsRef = useRef(new Map());

  useEffect(() => {
    if (!authToken) {
      registeredTokenRef.current = null;
      return;
    }

    let unsubscribe = null;
    let isSubscribed = true;

    const setupFCM = async () => {
      try {
        // ============================================================
        // STEP 1: Generate FCM device token
        // ============================================================
        const fcmToken = await generateToken();
        if (!isSubscribed) return;
        if (!fcmToken) {
          console.warn("[FCM] Token generation failed or permission denied.");
          return;
        }

        // ============================================================
        // STEP 2: Register device token with backend (include role)
        // ============================================================
        const currentRole = getActiveRole();
        const tokenKey = `${fcmToken}::${currentRole}`;

        if (registeredTokenRef.current !== tokenKey) {
          console.log(`[FCM] Registering token for role: "${currentRole}"`);

          try {
            await dispatch(
              registerDeviceFCMToken({
                token: fcmToken,
                role: currentRole,
              })
            ).unwrap();
            registeredTokenRef.current = tokenKey;
            console.log(`[FCM] Token registered successfully for role: "${currentRole}"`);
          } catch (err) {
            console.error("[FCM] Token registration failed:", err);
          }
        }

        // ============================================================
        // STEP 3: Foreground notification listener
        // ============================================================
        if (!messaging) return;

        unsubscribe = onMessage(messaging, (payload) => {
          console.log("[FCM] Foreground message received:", payload);

          const title =
            payload?.notification?.title ||
            payload?.data?.title ||
            "New Notification";

          const body =
            payload?.notification?.body ||
            payload?.data?.body ||
            "You have a new notification.";

          const data = payload?.data || {};

          // ----------------------------------------------------------
          // STEP 4: Role-based filter
          // ----------------------------------------------------------
          const activeRole = getActiveRole();
          const normRole = normalizeRole(activeRole);

          console.log(`[FCM] Active role: "${normRole}", checking notification: "${title}"`);

          const isRelevant = isNotificationForRole(
            activeRole,
            title,
            body,
            data,
            user
          );

          // Always refresh notification badge in background
          dispatch(loadNotifications());

          if (!isRelevant) {
            console.log(
              `[FCM] Notification filtered out for role "${normRole}": "${title}"`
            );
            return;
          }

          // ----------------------------------------------------------
          // STEP 5: Deduplication — prevent the same event from showing
          // multiple toasts within 3 seconds
          // ----------------------------------------------------------
          const appointmentId =
            data.appointment_id ||
            data.appointmentId ||
            data.booking_id ||
            "";

          // Build a stable event key
          const patientIdMatch = `${title} ${body}`.match(/\[ID:[^\]]+\]/i);
          const patientKey = patientIdMatch ? patientIdMatch[0] : "";

          const contentKey =
            appointmentId
              ? `apt::${appointmentId}`
              : patientKey
              ? `pat::${patientKey}`
              : `txt::${normalizeRole(title).slice(0, 30)}`;

          // Include role in key so different roles on same device don't conflict
          const eventKey = `${normRole}::${contentKey}`;

          const now = Date.now();
          const lastEvent = recentEventsRef.current.get(eventKey);

          if (lastEvent && now - lastEvent.timestamp < 3000) {
            console.log(
              `[FCM] Deduplicated notification (${now - lastEvent.timestamp}ms since last): "${title}"`
            );
            return;
          }

          recentEventsRef.current.set(eventKey, { timestamp: now });

          // Prune stale entries
          if (recentEventsRef.current.size > 100) {
            for (const [k, v] of recentEventsRef.current.entries()) {
              if (now - v.timestamp > 15000) {
                recentEventsRef.current.delete(k);
              }
            }
          }

          // ----------------------------------------------------------
          // STEP 6: Show toast with unique ID (prevents duplicate cards)
          // ----------------------------------------------------------
          const toastId = `fcm::${eventKey}`;
          console.log(`[FCM] Showing toast for role "${normRole}": "${title}"`);
          showSuccessToast(title, body, toastId);

          // Emit event so active pages can refresh their data tables
          window.dispatchEvent(
            new CustomEvent("fcm_notification", { detail: payload })
          );
        });
      } catch (error) {
        console.error("[FCM] Setup error:", error);
      }
    };

    setupFCM();

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  // Re-run whenever auth changes (login/logout/role switch)
  }, [authToken, reduxRole, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default NotificationListener;
