// ======================================================
// Firebase Messaging Service Worker
// public/firebase-messaging-sw.js
// ======================================================

// ======================================================
// FIREBASE SDK
// ======================================================

importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// ======================================================
// FIREBASE CONFIG
// ======================================================

firebase.initializeApp({
    apiKey: "AIzaSyAXZUNfcdWhKpUOsaMVIV4GLb3xJLzib8",
    authDomain: "sadop-ayurveda-hospital.firebaseapp.com",
    projectId: "sadop-ayurveda-hospital",
    storageBucket: "sadop-ayurveda-hospital.firebasestorage.app",
    messagingSenderId: "515672104681",
    appId: "1:515672104681:web:d5a50d56a4d2442b01da78",
    measurementId: "G-RDNRM72EH3",
});

// ======================================================
// FIREBASE MESSAGING
// ======================================================

const messaging = firebase.messaging();

// ======================================================
// ROLE CACHE & INDEXEDDB READER
// Allows the service worker to filter background messages
// so only the active logged-in role receives notifications.
// ======================================================

let cachedActiveRole = null;
let cachedUserId = null;

const DB_NAME = "hospital_fcm_db";
const STORE_NAME = "auth";

function getActiveRoleFromIDB() {
    return new Promise((resolve) => {
        try {
            const request = indexedDB.open(DB_NAME, 1);
            request.onerror = () => resolve(null);
            request.onsuccess = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    return resolve(null);
                }
                const tx = db.transaction(STORE_NAME, "readonly");
                const store = tx.objectStore(STORE_NAME);
                const getReq = store.get("current_user");
                getReq.onsuccess = () => resolve(getReq.result || null);
                getReq.onerror = () => resolve(null);
            };
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            };
        } catch {
            resolve(null);
        }
    });
}

// Listen to messages from the web client (NotificationListener)
self.addEventListener("message", (event) => {
    if (event.data?.type === "SET_ACTIVE_ROLE") {
        cachedActiveRole = event.data.role || null;
        cachedUserId = event.data.userId || null;
        console.log(
            "[firebase-messaging-sw.js] Active role updated to:",
            cachedActiveRole
        );
    } else if (event.data?.type === "CLEAR_ACTIVE_ROLE") {
        cachedActiveRole = null;
        cachedUserId = null;
        console.log(
            "[firebase-messaging-sw.js] Active role cleared (logged out)"
        );
    }
});

// ======================================================
// SW-SIDE ROLE NORMALIZER & FILTER
// ======================================================

function normalizeRoleSW(r) {
    if (!r) return "";
    const clean = String(r)
        .toLowerCase()
        .trim()
        .replace(/[\s_-]/g, "");

    if (
        clean === "frontoffice" ||
        clean === "front_office" ||
        clean === "reception" ||
        clean === "receptionist"
    ) {
        return "frontoffice";
    }
    if (clean === "pharmacist" || clean === "pharmacy") {
        return "pharmacist";
    }
    if (clean === "doctor" || clean === "physician") {
        return "doctor";
    }
    if (
        clean === "dutydoctor" ||
        clean === "duty_doctor" ||
        clean === "triage"
    ) {
        return "dutydoctor";
    }
    if (
        clean === "therapist" ||
        clean === "headtherapist" ||
        clean === "therapy"
    ) {
        return "therapist";
    }
    return clean;
}

const SW_TYPE_ROLE_MAP = {
    // Front Office
    appointment: ["frontoffice"],
    appointments: ["frontoffice"],
    new_appointment: ["frontoffice", "doctor"],
    appointment_booked: ["frontoffice"],
    appointment_created: ["frontoffice"],
    appointment_confirmed: ["frontoffice"],
    appointment_cancelled: ["frontoffice"],
    appointment_rescheduled: ["frontoffice"],
    walk_in: ["frontoffice"],
    walkin: ["frontoffice"],
    walk_in_registered: ["frontoffice"],
    direct_walk_in: ["frontoffice"],
    direct_walkin: ["frontoffice"],
    payment: ["frontoffice"],
    payment_received: ["frontoffice"],
    payment_pending: ["frontoffice"],
    billing: ["frontoffice"],
    billing_update: ["frontoffice"],
    invoice: ["frontoffice"],
    home_visit: ["frontoffice"],
    homevisit: ["frontoffice"],
    home_visit_requested: ["frontoffice"],
    home_visit_confirmed: ["frontoffice"],
    home_visit_cancelled: ["frontoffice"],
    package: ["frontoffice"],
    packages: ["frontoffice"],
    package_subscribed: ["frontoffice"],
    insurance: ["frontoffice"],
    insurance_update: ["frontoffice"],
    medical_camp: ["frontoffice"],
    medical_camp_update: ["frontoffice"],
    med_camp: ["frontoffice"],
    camp: ["frontoffice"],
    referral: ["frontoffice"],
    referrals: ["frontoffice"],
    doctor_payout: ["frontoffice"],
    visiting_doctor_payout: ["frontoffice"],
    associate_doctor_payout: ["frontoffice"],

    // Pharmacist
    prescription_to_dispense: ["pharmacist"],
    prescription_dispense: ["pharmacist"],
    dispense_prescription: ["pharmacist"],
    medicines_to_dispense: ["pharmacist"],
    medicine_dispensed: ["pharmacist"],
    dispense_medicine: ["pharmacist"],
    dispense: ["pharmacist"],
    prescription_created: ["pharmacist"],
    prescription_sent: ["pharmacist", "doctor"],
    medicine_stock_low: ["pharmacist"],
    stock_low: ["pharmacist"],
    low_stock: ["pharmacist"],
    stock_alert: ["pharmacist"],
    out_of_stock: ["pharmacist"],
    pharmacy_order: ["pharmacist"],
    online_delivery_order: ["pharmacist"],
    online_purchase: ["pharmacist"],
    employee_purchase: ["pharmacist"],

    // Doctor
    doctor_appointment: ["doctor"],
    doctor_consultation: ["doctor"],
    consultation_due: ["doctor"],
    consultation_reminder: ["doctor"],
    patient_arrived: ["doctor"],
    patient_in_doctor_queue: ["doctor"],
    prescription_saved: ["doctor"],
    prescription_update: ["doctor"],
    therapy_prescribed: ["doctor"],
    doctor_alert: ["doctor"],

    // Therapist
    therapy_assigned: ["therapist"],
    therapy_session_scheduled: ["therapist"],
    therapy_reminder: ["therapist"],
    therapy_updated: ["therapist"],
    room_assigned: ["therapist"],
    therapist_assigned: ["therapist"],
    therapy_completed: ["therapist"],

    // Duty Doctor
    patient_in_queue: ["dutydoctor"],
    pain_assessment: ["dutydoctor"],
    pain_assessment_due: ["dutydoctor"],
    triage_update: ["dutydoctor"],
    triage: ["dutydoctor"],
    duty_doctor_alert: ["dutydoctor"],
};

function isNotificationForRoleSW(role, title = "", body = "", data = {}) {
    const normRole = normalizeRoleSW(role);
    if (!normRole) return false;

    let payloadData = { ...(data || {}) };
    if (typeof payloadData.data === "string") {
        try {
            const inner = JSON.parse(payloadData.data);
            if (typeof inner === "object" && inner !== null) {
                payloadData = { ...payloadData, ...inner };
            }
        } catch {
            // ignore
        }
    }

    const text = `${title || ""} ${body || ""}`.toLowerCase();

    // Check 1: Target URL module check
    const targetUrl = (payloadData?.url || payloadData?.link || "").toLowerCase();
    if (targetUrl) {
        if (targetUrl.includes("/frontoffice") && normRole !== "frontoffice") return false;
        if (targetUrl.includes("/pharmacist") && normRole !== "pharmacist") return false;
        if (targetUrl.includes("/doctor") && normRole !== "doctor") return false;
        if (targetUrl.includes("/duty-doctor") && normRole !== "dutydoctor") return false;
        if (targetUrl.includes("/therapist") && normRole !== "therapist") return false;
    }

    // Check 2: Explicit role in data payload
    const rawTargetRole =
        payloadData?.target_role ||
        payloadData?.targetRole ||
        payloadData?.target_roles ||
        payloadData?.recipient_role ||
        payloadData?.module ||
        payloadData?.role ||
        payloadData?.roles;

    if (rawTargetRole) {
        let targetRoles = [];
        if (Array.isArray(rawTargetRole)) {
            targetRoles = rawTargetRole.map(normalizeRoleSW);
        } else if (typeof rawTargetRole === "string") {
            const str = rawTargetRole.trim();
            if (str.startsWith("[") && str.endsWith("]")) {
                try {
                    const arr = JSON.parse(str);
                    targetRoles = arr.map(normalizeRoleSW);
                } catch {
                    targetRoles = str
                        .replace(/[\[\]"']/g, "")
                        .split(",")
                        .map(normalizeRoleSW);
                }
            } else {
                targetRoles = str.split(",").map(normalizeRoleSW);
            }
        }

        targetRoles = targetRoles.filter(Boolean);
        if (targetRoles.length > 0) {
            if (targetRoles.includes("all")) return true;
            return targetRoles.includes(normRole);
        }
    }

    // Check 3: Explicit type
    const rawType =
        payloadData?.type ||
        payloadData?.notification_type ||
        payloadData?.event ||
        "";
    const notifType = String(rawType).toLowerCase().trim().replace(/[\s-]/g, "_");

    if (notifType && SW_TYPE_ROLE_MAP[notifType]) {
        const allowed = SW_TYPE_ROLE_MAP[notifType].map(normalizeRoleSW);
        return allowed.includes(normRole);
    }

    // Check 4: Content signals
    const isPharmacistSignal =
        text.includes("dispense") ||
        text.includes("dispensed") ||
        text.includes("dispensing") ||
        text.includes("prescription to dispense") ||
        text.includes("medicines to dispense") ||
        text.includes("medicine stock") ||
        text.includes("stock low") ||
        text.includes("out of stock") ||
        text.includes("low stock alert") ||
        text.includes("pharmacy order") ||
        text.includes("online delivery order") ||
        text.includes("employee purchase");

    const isDutyDoctorSignal =
        text.includes("pain assessment") ||
        text.includes("duty doctor") ||
        text.includes("triage") ||
        text.includes("patient in queue for assessment") ||
        text.includes("duty doctor alert") ||
        text.includes("assessment due");

    const isTherapistSignal =
        text.includes("therapy assigned") ||
        text.includes("therapist assigned") ||
        text.includes("therapy session") ||
        text.includes("therapy reminder") ||
        text.includes("treatment assigned") ||
        text.includes("room assigned for therapy");

    const isDoctorSignal =
        text.includes("patient arrived for consultation") ||
        text.includes("consultation call") ||
        text.includes("consultation due") ||
        text.includes("scheduled consultation with dr") ||
        text.includes("consultation with dr") ||
        text.includes("patient waiting in consultation");

    const isFrontOfficeSignal =
        text.includes("appointment booked") ||
        text.includes("appointment confirmed") ||
        text.includes("appointment cancelled") ||
        text.includes("new appointment") ||
        text.includes("walk-in") ||
        text.includes("walk in") ||
        text.includes("direct walk-in") ||
        text.includes("home visit") ||
        text.includes("homevisit") ||
        text.includes("payment received") ||
        text.includes("payment pending") ||
        text.includes("billing") ||
        text.includes("invoice") ||
        text.includes("medical camp") ||
        text.includes("med camp") ||
        text.includes("insurance") ||
        text.includes("package subscribed") ||
        text.includes("referral") ||
        text.includes("visiting doctor payout") ||
        text.includes("associate doctor payout") ||
        text.includes("booked successfully") ||
        text.includes("assigned successfully");

    switch (normRole) {
        case "pharmacist":
            return isPharmacistSignal;

        case "therapist":
            return isTherapistSignal;

        case "dutydoctor":
            return isDutyDoctorSignal;

        case "doctor":
            return isDoctorSignal;

        case "frontoffice":
            if (isPharmacistSignal && !isFrontOfficeSignal) return false;
            if (isDutyDoctorSignal) return false;
            if (isTherapistSignal && !isFrontOfficeSignal) return false;
            return isFrontOfficeSignal;

        default:
            return false;
    }
}

// ======================================================
// BACKGROUND MESSAGE HANDLER
// ======================================================

messaging.onBackgroundMessage(async (payload) => {
    console.log(
        "[firebase-messaging-sw.js] Background message received:",
        payload
    );

    // Resolve active role from memory or IndexedDB
    let activeRole = cachedActiveRole;
    if (!activeRole) {
        const stored = await getActiveRoleFromIDB();
        if (stored?.role) {
            activeRole = stored.role;
            cachedActiveRole = stored.role;
            cachedUserId = stored.userId || null;
        }
    }

    const notificationTitle =
        payload?.notification?.title ||
        payload?.data?.title ||
        "New Notification";

    const notificationBody =
        payload?.notification?.body ||
        payload?.data?.body ||
        "You have a new notification.";

    // If no user is logged in on this browser, do NOT display notification
    if (!activeRole) {
        console.log(
            "[firebase-messaging-sw.js] No active logged-in role found. Silencing background notification:",
            notificationTitle
        );
        return;
    }

    // Role-based filter check
    const isRelevant = isNotificationForRoleSW(
        activeRole,
        notificationTitle,
        notificationBody,
        payload?.data
    );

    if (!isRelevant) {
        console.log(
            `[firebase-messaging-sw.js] Dropped background notification for role "${activeRole}": "${notificationTitle}"`
        );
        return;
    }

    const appointmentId =
        payload?.data?.appointment_id ||
        payload?.data?.appointmentId ||
        "";

    const notificationOptions = {
        body: notificationBody,
        tag: appointmentId ? `apt_${appointmentId}` : `notif_${Date.now()}`,
        renotify: true,
        data: {
            appointment_id: appointmentId,
            type: payload?.data?.type || "",
            url: payload?.data?.url || "",
            role: payload?.data?.role || activeRole,
        },
    };

    console.log(
        `[firebase-messaging-sw.js] Showing background notification for role "${activeRole}": "${notificationTitle}"`
    );

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});

// ======================================================
// NOTIFICATION CLICK
// ======================================================

self.addEventListener("notificationclick", (event) => {
    console.log("[firebase-messaging-sw.js] Notification clicked");

    event.notification.close();

    const notificationData = event.notification?.data || {};
    const appointmentId = notificationData.appointment_id;
    const role = (notificationData.role || cachedActiveRole || "").toLowerCase();

    let targetUrl = notificationData.url || "";

    if (!targetUrl) {
        if (role === "doctor") {
            targetUrl = "/doctor/appointments";
        } else if (role === "duty_doctor" || role === "dutydoctor") {
            targetUrl = "/duty-doctor/dashboard";
        } else if (role === "pharmacist") {
            targetUrl = "/pharmacist/appointments";
        } else if (role === "therapist") {
            targetUrl = "/therapist/appointments";
        } else if (appointmentId) {
            targetUrl = `/frontoffice/upcoming-appointments/${appointmentId}`;
        } else {
            targetUrl = "/frontoffice/dashboard";
        }
    }

    // Focus existing matching tab or open a new window
    event.waitUntil(
        clients
            .matchAll({
                type: "window",
                includeUncontrolled: true,
            })
            .then((clientList) => {
                for (const client of clientList) {
                    let finalUrl = targetUrl;
                    if (!notificationData.url) {
                        if (client.url.includes("/doctor")) {
                            finalUrl = "/doctor/appointments";
                        } else if (client.url.includes("/duty-doctor")) {
                            finalUrl = "/duty-doctor/dashboard";
                        } else if (client.url.includes("/pharmacist")) {
                            finalUrl = "/pharmacist/appointments";
                        } else if (client.url.includes("/therapist")) {
                            finalUrl = "/therapist/appointments";
                        } else if (
                            client.url.includes("/frontoffice") &&
                            appointmentId
                        ) {
                            finalUrl = `/frontoffice/upcoming-appointments/${appointmentId}`;
                        }
                    }

                    if ("focus" in client) {
                        client.navigate(finalUrl);
                        return client.focus();
                    }
                }

                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }

                return undefined;
            })
    );
});