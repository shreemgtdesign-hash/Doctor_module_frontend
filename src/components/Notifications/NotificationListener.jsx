import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onMessage } from "firebase/messaging";
import { messaging, generateToken } from "../../firebase/firebase";
import {
  registerDeviceFCMToken,
  loadNotifications,
} from "../../redux/notifications/notificationThiunk";
import { showSuccessToast } from "../../../utils/showToast";
import {
  isNotificationForRole,
  getActiveRole,
  normalizeRole,
  syncActiveRoleToSW,
  clearActiveRoleFromSW,
} from "../../utils/notificationFilter";

const NotificationListener = () => {
  const dispatch = useDispatch();

  // Read auth state directly from Redux
  const { token, role: reduxRole, user } = useSelector(
    (state) => state.auth
  );
  const authToken = token || localStorage.getItem("token");

  // Track last registered token+role pair to skip redundant API calls
  const registeredTokenRef = useRef(null);

  // Track recently shown notification events for deduplication
  const recentEventsRef = useRef(new Map());

  useEffect(() => {
    // If not authenticated, clear role from SW and reset state
    if (!authToken) {
      registeredTokenRef.current = null;
      clearActiveRoleFromSW();
      return;
    }

    const currentRole = getActiveRole(user, reduxRole);
    const normRole = normalizeRole(currentRole);

    // Sync active role to Service Worker and IndexedDB for background filtering
    if (normRole) {
      syncActiveRoleToSW(normRole, user?.id || user?._id);
    }

    let unsubscribe = null;
    let isSubscribed = true;

    const setupFCM = async () => {
      try {
        // STEP 1: Generate or retrieve FCM device token
        const fcmToken = await generateToken();
        if (!isSubscribed) return;
        if (!fcmToken) {
          console.warn("[FCM] Token generation failed or permission not granted.");
          return;
        }

        // STEP 2: Register device token with backend for this role
        const tokenKey = `${fcmToken}::${normRole}`;
        if (registeredTokenRef.current !== tokenKey && normRole) {
          console.log(`[FCM] Registering device token for role: "${normRole}"`);

          try {
            await dispatch(
              registerDeviceFCMToken({
                token: fcmToken,
                role: normRole,
              })
            ).unwrap();
            registeredTokenRef.current = tokenKey;
            console.log(
              `[FCM] Token registered successfully for role: "${normRole}"`
            );
          } catch (err) {
            console.error("[FCM] Token registration failed:", err);
          }
        }

        // STEP 3: Foreground notification listener
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

          // Resolve active role at moment of notification arrival
          const activeRoleNow = getActiveRole(user, reduxRole);
          const activeNormRole = normalizeRole(activeRoleNow);

          console.log(
            `[FCM] Active role: "${activeNormRole}", evaluating notification: "${title}"`
          );

          // STEP 4: Strict role filter
          const isRelevant = isNotificationForRole(
            activeNormRole,
            title,
            body,
            data,
            user
          );

          if (!isRelevant) {
            console.log(
              `[FCM] Notification filtered out for role "${activeNormRole}": "${title}"`
            );
            return;
          }

          // STEP 5: Only refresh notifications for the relevant role
          dispatch(loadNotifications());

          // STEP 6: Deduplication — prevent duplicate toasts within 3 seconds
          const appointmentId =
            data.appointment_id ||
            data.appointmentId ||
            data.booking_id ||
            "";

          const patientIdMatch = `${title} ${body}`.match(/\[ID:[^\]]+\]/i);
          const patientKey = patientIdMatch ? patientIdMatch[0] : "";

          const contentKey = appointmentId
            ? `apt::${appointmentId}`
            : patientKey
            ? `pat::${patientKey}`
            : `txt::${normalizeRole(title).slice(0, 30)}`;

          const eventKey = `${activeNormRole}::${contentKey}`;
          const now = Date.now();
          const lastEvent = recentEventsRef.current.get(eventKey);

          if (lastEvent && now - lastEvent.timestamp < 3000) {
            console.log(
              `[FCM] Deduplicated foreground notification (${now - lastEvent.timestamp}ms): "${title}"`
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

          // STEP 7: Show UI Toast
          const toastId = `fcm::${eventKey}`;
          console.log(
            `[FCM] Showing toast for role "${activeNormRole}": "${title}"`
          );
          showSuccessToast(title, body, toastId);

          // STEP 8: Emit custom event so active role pages can refresh tables
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
  }, [authToken, reduxRole, user, dispatch]);

  return null;
};

export default NotificationListener;
