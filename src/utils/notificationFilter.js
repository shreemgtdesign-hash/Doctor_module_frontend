// ======================================================
// Notification Filter Utility
// src/utils/notificationFilter.js
// ======================================================

/**
 * Normalizes a role string or object for strict comparison.
 * Maps any variant to one of:
 * - "frontoffice"
 * - "pharmacist"
 * - "doctor"
 * - "dutydoctor"
 * - "therapist"
 */
export const normalizeRole = (r) => {
  if (!r) return "";
  if (typeof r === "object") {
    r = r.name || r.role || r.slug || r.title || "";
  }
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
  if (
    clean === "corporatecell" ||
    clean === "corporate_cell" ||
    clean === "corporate-cell" ||
    clean === "corporateshell" ||
    clean === "corporate_shell" ||
    clean === "corporate-shell"
  ) {
    return "corporate_cell";
  }
  if (clean === "corporate") {
    return "corporate";
  }
  return clean;
};

/**
 * Resolves the currently active user role with fallback layers:
 * 1. Explicit reduxRole parameter
 * 2. localStorage "role"
 * 3. User object in Redux or localStorage
 * 4. Current URL pathname (URL-based portal detection)
 */
export const getActiveRole = (user = null, reduxRole = null) => {
  if (reduxRole) {
    const r = normalizeRole(reduxRole);
    if (r) return r;
  }

  const storedRole = localStorage.getItem("role");
  if (storedRole) {
    const r = normalizeRole(storedRole);
    if (r) return r;
  }

  const u =
    user ||
    (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        return {};
      }
    })();

  if (u?.role) {
    const r = normalizeRole(u.role);
    if (r) return r;
  }
  if (u?.role_name || u?.user_type || u?.type) {
    const r = normalizeRole(u.role_name || u.user_type || u.type);
    if (r) return r;
  }

  // Fallback: Infer from current URL route
  if (typeof window !== "undefined" && window.location?.pathname) {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith("/corporate-cell")) return "corporate_cell";
    if (path.startsWith("/corporate")) return "corporate";
    if (path.startsWith("/pharmacist")) return "pharmacist";
    if (path.startsWith("/frontoffice")) return "frontoffice";
    if (path.startsWith("/doctor") || path.startsWith("/doctordashboard"))
      return "doctor";
    if (path.startsWith("/duty-doctor")) return "dutydoctor";
    if (path.startsWith("/therapist")) return "therapist";
  }

  return "";
};

/**
 * Comprehensive NOTIFICATION TYPE → ALLOWED ROLES MAP
 */
export const TYPE_ROLE_MAP = {
  // Front Office types
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
  front_office: ["frontoffice"],
  frontoffice: ["frontoffice"],

  // Pharmacist types
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
  pharmacy: ["pharmacist"],
  pharmacist: ["pharmacist"],

  // Doctor types
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
  doctor: ["doctor"],

  // Therapist types
  therapy_assigned: ["therapist"],
  therapy_session_scheduled: ["therapist"],
  therapy_reminder: ["therapist"],
  therapy_updated: ["therapist"],
  room_assigned: ["therapist"],
  therapist_assigned: ["therapist"],
  therapy_completed: ["therapist"],
  therapist: ["therapist"],
  headtherapist: ["therapist"],

  // Duty Doctor types
  patient_in_queue: ["dutydoctor"],
  pain_assessment: ["dutydoctor"],
  pain_assessment_due: ["dutydoctor"],
  triage_update: ["dutydoctor"],
  triage: ["dutydoctor"],
  duty_doctor_alert: ["dutydoctor"],
  duty_doctor: ["dutydoctor"],
  dutydoctor: ["dutydoctor"],

  // Corporate Cell / Corporate Shell types
  corporate_event: ["corporate_cell", "corporate"],
  corporate_event_request: ["corporate_cell"],
  corporate_event_requested: ["corporate_cell"],
  corporate_request: ["corporate_cell"],
  event_request: ["corporate_cell"],
  new_event_request: ["corporate_cell"],
  corporate_pending_request: ["corporate_cell"],
  corporate_cell: ["corporate_cell"],
  corporate_shell: ["corporate_cell"],
};

/**
 * Safely parse notification payload data object.
 * Handles nested JSON strings if backend stringified fields.
 */
export const parsePayloadData = (raw) => {
  if (!raw || typeof raw !== "object") return {};
  let parsed = { ...raw };

  if (typeof parsed.data === "string") {
    try {
      const inner = JSON.parse(parsed.data);
      if (typeof inner === "object" && inner !== null) {
        parsed = { ...parsed, ...inner };
      }
    } catch {
      // ignore
    }
  }

  if (typeof parsed.payload === "string") {
    try {
      const inner = JSON.parse(parsed.payload);
      if (typeof inner === "object" && inner !== null) {
        parsed = { ...parsed, ...inner };
      }
    } catch {
      // ignore
    }
  }

  return parsed;
};

/**
 * Main role-based notification filter.
 * Returns true ONLY if the notification strictly belongs to `role`.
 *
 * Rules:
 * 1. Unknown or unauthenticated role -> return false (NEVER leak to other roles).
 * 2. Explicit recipient user ID mismatch -> return false.
 * 3. URL path mismatch -> return false (e.g. /frontoffice/ URL on a pharmacist tab).
 * 4. Explicit target role -> strict membership check.
 * 5. Explicit notification type -> strict TYPE_ROLE_MAP check.
 * 6. Content signal check -> mutually exclusive signals.
 * 7. Default -> return false.
 */
export const isNotificationForRole = (
  role,
  title = "",
  body = "",
  rawData = {},
  user = null
) => {
  const normRole = normalizeRole(role);
  if (!normRole) {
    console.log("[FCM Filter] Dropped — unknown or missing role:", role);
    return false;
  }

  const data = parsePayloadData(rawData);
  const text = `${title || ""} ${body || ""}`.toLowerCase();

  // ------------------------------------------------------------------
  // CHECK 1: EXPLICIT TARGET USER ID (if specific recipient is tagged)
  // ------------------------------------------------------------------
  const targetedRecipientId =
    data?.recipient_id ||
    data?.recipientId ||
    data?.recipient_user_id ||
    data?.target_user_id ||
    data?.targetUserId;

  const currentUserId = user?.id || user?._id || user?.user_id;

  if (targetedRecipientId && currentUserId) {
    if (String(targetedRecipientId) !== String(currentUserId)) {
      console.log(
        `[FCM Filter] Dropped — targeted to user ${targetedRecipientId}, current user is ${currentUserId}`
      );
      return false;
    }
  }

  // ------------------------------------------------------------------
  // CHECK 2: EXPLICIT DESTINATION URL
  // If the payload specifies a URL path for a specific module,
  // it must match the current role's module.
  // ------------------------------------------------------------------
  const targetUrl = (data?.url || data?.link || "").toLowerCase();
  if (targetUrl) {
    if (targetUrl.includes("/frontoffice") && normRole !== "frontoffice") {
      console.log(
        `[FCM Filter] Dropped — URL is frontoffice (${targetUrl}), user role is ${normRole}`
      );
      return false;
    }
    if (targetUrl.includes("/pharmacist") && normRole !== "pharmacist") {
      console.log(
        `[FCM Filter] Dropped — URL is pharmacist (${targetUrl}), user role is ${normRole}`
      );
      return false;
    }
    if (targetUrl.includes("/doctor") && normRole !== "doctor") {
      console.log(
        `[FCM Filter] Dropped — URL is doctor (${targetUrl}), user role is ${normRole}`
      );
      return false;
    }
    if (targetUrl.includes("/duty-doctor") && normRole !== "dutydoctor") {
      console.log(
        `[FCM Filter] Dropped — URL is duty-doctor (${targetUrl}), user role is ${normRole}`
      );
      return false;
    }
    if (targetUrl.includes("/therapist") && normRole !== "therapist") {
      console.log(
        `[FCM Filter] Dropped — URL is therapist (${targetUrl}), user role is ${normRole}`
      );
      return false;
    }
    if (targetUrl.includes("/corporate-cell") && normRole !== "corporate_cell") {
      console.log(
        `[FCM Filter] Dropped — URL is corporate-cell (${targetUrl}), user role is ${normRole}`
      );
      return false;
    }
  }

  // ------------------------------------------------------------------
  // CHECK 3: EXPLICIT TARGET ROLE(S) IN PAYLOAD
  // Backend role field: role, target_role, roles, module, etc.
  // ------------------------------------------------------------------
  const rawTargetRole =
    data?.target_role ||
    data?.targetRole ||
    data?.target_roles ||
    data?.targetRoles ||
    data?.recipient_role ||
    data?.recipientRole ||
    data?.intended_for ||
    data?.for ||
    data?.module ||
    data?.role ||
    data?.roles;

  if (rawTargetRole) {
    let targetRoles = [];
    if (Array.isArray(rawTargetRole)) {
      targetRoles = rawTargetRole.map(normalizeRole);
    } else if (typeof rawTargetRole === "string") {
      let str = rawTargetRole.trim();
      if (str.startsWith("[") && str.endsWith("]")) {
        try {
          const arr = JSON.parse(str);
          if (Array.isArray(arr)) {
            targetRoles = arr.map(normalizeRole);
          }
        } catch {
          targetRoles = str
            .replace(/[\[\]"']/g, "")
            .split(",")
            .map(normalizeRole);
        }
      } else {
        targetRoles = str.split(",").map(normalizeRole);
      }
    }

    targetRoles = targetRoles.filter(Boolean);

    if (targetRoles.length > 0) {
      if (targetRoles.includes("all")) {
        return true;
      }
      const match = targetRoles.includes(normRole);
      if (!match) {
        console.log(
          `[FCM Filter] Dropped — payload target roles [${targetRoles.join(
            ", "
          )}], current role is "${normRole}"`
        );
      }
      return match;
    }
  }

  // ------------------------------------------------------------------
  // CHECK 4: NOTIFICATION TYPE LOOKUP
  // ------------------------------------------------------------------
  const rawType =
    data?.type ||
    data?.notification_type ||
    data?.event_type ||
    data?.event ||
    data?.category ||
    "";
  const notifType = String(rawType).toLowerCase().trim().replace(/[\s-]/g, "_");

  if (notifType && TYPE_ROLE_MAP[notifType]) {
    const allowedRoles = TYPE_ROLE_MAP[notifType].map(normalizeRole);
    const match = allowedRoles.includes(normRole);
    if (!match) {
      console.log(
        `[FCM Filter] Dropped — type "${notifType}" is only for [${allowedRoles.join(
          ", "
        )}], current role is "${normRole}"`
      );
    }
    return match;
  }

  // ------------------------------------------------------------------
  // CHECK 5: MUTUALLY EXCLUSIVE CONTENT CLASSIFICATION
  // When no role/type metadata was sent by the backend.
  // ------------------------------------------------------------------
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
    text.includes("room assigned for therapy") ||
    (text.includes("assigned to you") && text.includes("therapy"));

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

  const isCorporateCellSignal =
    text.includes("corporate") ||
    text.includes("event request") ||
    text.includes("requested an event") ||
    text.includes("request an event") ||
    text.includes("wellness event") ||
    text.includes("corporate cell") ||
    text.includes("corporate shell") ||
    text.includes("pending request") ||
    text.includes("evt-") ||
    text.includes("req-evt") ||
    Boolean(extractCorporateEventId({ title, body, data: rawData }));

  switch (normRole) {
    case "corporate_cell":
      if (!isCorporateCellSignal) {
        console.log(
          `[FCM Filter] Dropped for corporate cell — no corporate event signal in: "${title}"`
        );
        return false;
      }
      return true;

    case "corporate":
      return isCorporateCellSignal;

    case "pharmacist":
      // Pharmacist ONLY receives pure pharmacy / dispensing notifications
      if (!isPharmacistSignal) {
        console.log(
          `[FCM Filter] Dropped for pharmacist — no pharmacy signal in: "${title}"`
        );
        return false;
      }
      return true;

    case "therapist":
      if (!isTherapistSignal) {
        console.log(
          `[FCM Filter] Dropped for therapist — no therapist signal in: "${title}"`
        );
        return false;
      }
      return true;

    case "dutydoctor":
      if (!isDutyDoctorSignal) {
        console.log(
          `[FCM Filter] Dropped for duty doctor — no duty doctor signal in: "${title}"`
        );
        return false;
      }
      return true;

    case "doctor":
      if (!isDoctorSignal) {
        console.log(
          `[FCM Filter] Dropped for doctor — no doctor consultation signal in: "${title}"`
        );
        return false;
      }
      return true;

    case "frontoffice":
      // Front office receives appointments, billing, home visits, camps, etc.
      // But NEVER receives pure pharmacy dispensing or duty-doctor triage alerts.
      if (isPharmacistSignal && !isFrontOfficeSignal) {
        console.log(
          `[FCM Filter] Dropped for front office — pure pharmacy signal: "${title}"`
        );
        return false;
      }
      if (isDutyDoctorSignal) {
        console.log(
          `[FCM Filter] Dropped for front office — duty doctor signal: "${title}"`
        );
        return false;
      }
      if (isTherapistSignal && !isFrontOfficeSignal) {
        console.log(
          `[FCM Filter] Dropped for front office — pure therapist signal: "${title}"`
        );
        return false;
      }
      if (!isFrontOfficeSignal) {
        console.log(
          `[FCM Filter] Dropped for front office — no front office signal in: "${title}"`
        );
        return false;
      }
      return true;

    default:
      // STRICT: unknown role never receives notifications
      console.log(
        `[FCM Filter] Dropped — role "${normRole}" has no matching rules for: "${title}"`
      );
      return false;
  }
};

/**
 * Extracts a clinical / front office appointment ID from a notification object or string.
 */
export const extractAppointmentId = (notification) => {
  if (!notification) return null;
  const data = parsePayloadData(notification.data || notification);

  const explicitId =
    data.appointment_id ||
    data.appointmentId ||
    notification.appointment_id ||
    notification.appointmentId;

  if (explicitId && typeof explicitId === "string" && explicitId.trim()) {
    return explicitId.trim();
  }

  // Check URL
  const rawUrl = data.url || data.link || notification.url || "";
  if (rawUrl && typeof rawUrl === "string") {
    const urlMatch = rawUrl.match(/\/upcoming-appointments\/([^\/?#]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }
  }

  // Check bracket pattern [ID:IP002] or [ID:APP-xxx] that is NOT a corporate event
  const text = `${notification.title || ""} ${notification.body || ""} ${data.title || ""} ${data.body || ""}`;
  const bracketMatch = text.match(/\[ID:\s*([A-Za-z0-9_-]+)\]/i);
  if (
    bracketMatch &&
    bracketMatch[1] &&
    !bracketMatch[1].startsWith("EVT") &&
    !bracketMatch[1].startsWith("REQ-EVT") &&
    !bracketMatch[1].startsWith("ce_evt")
  ) {
    return bracketMatch[1];
  }

  return null;
};

/**
 * Extracts a corporate event ID or request ID from a notification object or string.
 * Strictly avoids non-corporate IDs like [ID:IP002].
 */
export const extractCorporateEventId = (notification) => {
  if (!notification) return null;
  const data = parsePayloadData(notification.data || notification);

  // 1. Check direct fields in data or notification
  const explicitId =
    data.event_no ||
    data.event_id ||
    data.eventId ||
    data.request_no ||
    data.request_id ||
    data.requestId ||
    notification.event_no ||
    notification.event_id;

  if (explicitId && typeof explicitId === "string" && explicitId.trim()) {
    const cleanId = explicitId.trim();
    if (
      cleanId.startsWith("EVT") ||
      cleanId.startsWith("REQ-EVT") ||
      cleanId.startsWith("ce_evt") ||
      cleanId.includes("-")
    ) {
      return cleanId;
    }
  }

  // 2. Check direct URL for event ID
  const rawUrl = data.url || data.link || notification.url || "";
  if (rawUrl && typeof rawUrl === "string") {
    const urlMatch = rawUrl.match(/\/corporate-cell\/(?:pending-events|pending-requests|events|upcoming-events)\/([^\/?#]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }
  }

  // 3. Search title and body ONLY for explicit corporate event ID patterns
  const text = `${notification.title || ""} ${notification.body || ""} ${data.title || ""} ${data.body || ""}`;

  // Pattern [ID:EVT-xxxx] or [ID:REQ-EVT-xxxx]
  const bracketMatch = text.match(/\[ID:\s*(EVT[A-Za-z0-9_-]*|REQ-EVT-[A-Za-z0-9_-]+|ce_evt_[A-Za-z0-9_]+)\]/i);
  if (bracketMatch && bracketMatch[1]) {
    return bracketMatch[1];
  }

  // Pattern EVT-xxxxxx-xxx or EVTxxxxxx
  const evtMatch = text.match(/\b(EVT(?:-[0-9]{4,8}-[A-Za-z0-9]+|[0-9]{6,12}[A-Za-z0-9]*))\b/i);
  if (evtMatch && evtMatch[1]) {
    return evtMatch[1];
  }

  // Pattern REQ-EVT-xxxxxx-xxx
  const reqMatch = text.match(/\b(REQ-EVT-[A-Za-z0-9-]+)\b/i);
  if (reqMatch && reqMatch[1]) {
    return reqMatch[1];
  }

  // Pattern ce_evt_xxxx
  const ceMatch = text.match(/\b(ce_evt_[A-Za-z0-9_]+)\b/i);
  if (ceMatch && ceMatch[1]) {
    return ceMatch[1];
  }

  return null;
};

/**
 * Resolves the target redirect URL for any given notification and role.
 * Ensures each role (Front Office, Doctor, Corporate Cell, etc.) navigates
 * strictly to their own respective portal tabs and detailed views.
 */
export const getNotificationRedirectUrl = (notification, activeRole) => {
  if (!notification) return "/";

  const normRole = normalizeRole(activeRole || localStorage.getItem("role"));
  const data = parsePayloadData(notification.data || notification);
  const directUrl = data.url || data.link || notification.url;

  // 1. If explicit valid internal URL is provided
  if (directUrl && typeof directUrl === "string" && directUrl.startsWith("/")) {
    // If user is front office, don't follow accidental corporate-cell URLs
    if (normRole === "frontoffice" && directUrl.startsWith("/corporate-cell")) {
      // Proceed to front office role routing below
    } else {
      return directUrl;
    }
  }

  const category = (notification.category || data.category || "").toLowerCase().replace(/\s+/g, "_");
  const type = (notification.type || data.type || "").toLowerCase().replace(/\s+/g, "_");
  const text = `${notification.title || ""} ${notification.body || ""} ${data.title || ""} ${data.body || ""}`.toLowerCase();
  const appointmentId = extractAppointmentId(notification);
  const eventId = extractCorporateEventId(notification);
  const orderId = data.order_id || data.orderId || notification.order_id;

  // ========================================================
  // 1. CORPORATE CELL / CORPORATE SHELL ROLE
  // ========================================================
  if (normRole === "corporate_cell") {
    const statusInPayload = (
      data.status ||
      data.event_status ||
      data.confirmation_status ||
      notification.status ||
      ""
    ).toLowerCase();

    const isConfirmed =
      statusInPayload === "confirmed" ||
      statusInPayload === "upcoming" ||
      text.includes("event confirmed") ||
      text.includes("confirmed event");

    if (isConfirmed) {
      return eventId
        ? `/corporate-cell/upcoming-events/${eventId}`
        : "/corporate-cell/upcoming-events";
    }

    if (eventId) {
      return `/corporate-cell/pending-events/${eventId}`;
    }
    return "/corporate-cell/pending-events";
  }

  // ========================================================
  // 2. FRONT OFFICE ROLE
  // Navigate to respective front office tabs and views
  // ========================================================
  if (normRole === "frontoffice") {
    // A. THERAPIES
    if (
      category.includes("Pending payments") ||
      text.includes("Payment Pending") 

    ) {
      return "/frontoffice/billing/pending-payments/:id";
    }

    // B. HOME SERVICES / HOME VISIT
    if (
      category.includes("home") ||
      type.includes("home") ||
      text.includes("home service") ||
      text.includes("home visit")
    ) {
      return "/frontoffice/pending-actions/home-visit-confirmations";
    }

    // C. ONLINE ORDERS
    if (
      category.includes("order") ||
      type.includes("order") ||
      text.includes("online order") ||
      text.includes("order placed") ||
      text.includes("medicine purchase")
    ) {
      return orderId
        ? `/frontoffice/pending-actions/online-orders/${orderId}`
        : "/frontoffice/pending-actions/online-orders";
    }

    // D. PAYMENTS & BILLING
    if (
      category.includes("payment") ||
      category.includes("billing") ||
      type.includes("payment") ||
      type.includes("billing") ||
      text.includes("payment") ||
      text.includes("billing") ||
      text.includes("paid") ||
      text.includes("invoice")
    ) {
      return appointmentId
        ? `/frontoffice/billing/pending-payments/${appointmentId}`
        : "/frontoffice/billing/pending-payments";
    }

    // E. MEDICAL CAMPS
    if (
      category.includes("camp") ||
      type.includes("camp") ||
      text.includes("camp") ||
      text.includes("medcamp")
    ) {
      return "/frontoffice/medcamp-calender";
    }

    // F. PACKAGES
    if (category.includes("package") || type.includes("package") || text.includes("package")) {
      return "/frontoffice/packages-list";
    }

    // G. INSURANCE
    if (category.includes("insurance") || type.includes("insurance") || text.includes("insurance")) {
      return "/frontoffice/insurance-list";
    }

    // H. REFERRALS
    if (category.includes("referral") || type.includes("referral") || text.includes("referral")) {
      return "/frontoffice/referral-list";
    }

    // I. PATIENTS
    if (category.includes("patient") || text.includes("patient registered") || text.includes("new patient")) {
      return "/frontoffice/patients-table";
    }

    // J. APPOINTMENTS (Booked, Pending, Request, In-Person, etc.)
    if (
      category.includes("appointment") ||
      type.includes("appointment") ||
      text.includes("appointment") ||
      text.includes("consultation") ||
      text.includes("in-person") ||
      text.includes("check-in") ||
      Boolean(appointmentId)
    ) {
      const isPendingConfirmation =
        text.includes("pending confirmation") ||
        text.includes("requested an appointment") ||
        text.includes("appointment request");

      if (isPendingConfirmation) {
        return "/frontoffice/pending-actions/appointment-confirmations";
      }

      return appointmentId
        ? `/frontoffice/upcoming-appointments/${appointmentId}`
        : "/frontoffice/upcoming-appointments";
    }

    return "/frontoffice/dashboard";
  }

  // ========================================================
  // 3. CLINICAL & OTHER ROLES
  // ========================================================
  if (normRole === "doctor") {
    return "/doctor/appointments";
  }

  if (normRole === "dutydoctor") {
    return "/duty-doctor/dashboard";
  }

  if (normRole === "pharmacist") {
    return "/pharmacist/appointments";
  }

  if (normRole === "therapist") {
    return "/therapist/appointments";
  }

  if (normRole === "corporate") {
    return "/corporate/dashboard";
  }

  // Default fallback if appointmentId exists
  if (appointmentId) {
    return `/frontoffice/upcoming-appointments/${appointmentId}`;
  }

  return "/";
};

/**
 * Validates the event confirmation status for Corporate Cell via backend check,
 * and accurately delegates other roles directly to their appropriate portal tabs.
 */
export const resolveCorporateEventNotificationUrl = async (notification, activeRole) => {
  const normRole = normalizeRole(activeRole || localStorage.getItem("role"));

  // Only perform dynamic Corporate Cell API verification if the user is corporate_cell
  if (normRole === "corporate_cell") {
    const eventId = extractCorporateEventId(notification);
    if (eventId) {
      const data = parsePayloadData(notification?.data || notification);
      const statusInPayload = (
        data.status ||
        data.event_status ||
        data.confirmation_status ||
        notification?.status ||
        ""
      ).toLowerCase();

      if (statusInPayload === "confirmed" || statusInPayload === "upcoming") {
        return `/corporate-cell/upcoming-events/${eventId}`;
      }
      if (statusInPayload === "pending" || statusInPayload.includes("pending")) {
        return `/corporate-cell/pending-events/${eventId}`;
      }

      // Check backend API dynamically
      const token =
        typeof localStorage !== "undefined" && typeof localStorage.getItem === "function"
          ? localStorage.getItem("token") || ""
          : "";
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };

      try {
        const res = await fetch(`/api/corporatecell/upcoming-events/${eventId}`, { headers });
        if (res.ok) {
          const json = await res.json();
          const st = (json?.data?.status || "").toLowerCase();
          if (st === "confirmed" || st === "upcoming" || json?.success) {
            return `/corporate-cell/upcoming-events/${eventId}`;
          }
        }
      } catch (_) {}

      try {
        const pRes = await fetch(`/api/corporatecell/pending-events/${eventId}`, { headers });
        if (pRes.ok) {
          const pJson = await pRes.json();
          const pSt = (pJson?.data?.status || "").toLowerCase();
          if (pSt === "confirmed" || pSt === "upcoming") {
            return `/corporate-cell/upcoming-events/${eventId}`;
          }
          return `/corporate-cell/pending-events/${eventId}`;
        }
      } catch (_) {}

      return `/corporate-cell/pending-events/${eventId}`;
    }
  }

  // For all other roles (frontoffice, doctor, etc.), synchronously resolve the accurate role portal route
  return getNotificationRedirectUrl(notification, activeRole);
};

// ======================================================
// SERVICE WORKER & INDEXEDDB SYNC
// Allows background worker in public/firebase-messaging-sw.js
// to know which role is currently logged in and filter
// background push notifications too.
// ======================================================

const DB_NAME = "hospital_fcm_db";
const STORE_NAME = "auth";

const openIDB = () => {
  return new Promise((resolve) => {
    if (typeof indexedDB === "undefined") {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onerror = () => resolve(null);
      request.onsuccess = (e) => resolve(e.target.result);
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
};

export const syncActiveRoleToSW = async (role, userId = null) => {
  const normRole = normalizeRole(role);
  if (!normRole) return;

  // 1. Post to active ServiceWorker controller if available
  if (
    typeof navigator !== "undefined" &&
    navigator.serviceWorker &&
    navigator.serviceWorker.controller
  ) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: "SET_ACTIVE_ROLE",
        role: normRole,
        userId: userId || null,
      });
    } catch (e) {
      console.warn("[FCM Filter] Failed to post role to ServiceWorker:", e);
    }
  }

  // 2. Persist to IndexedDB so SW can read it on wake-up
  try {
    const db = await openIDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put({
        id: "current_user",
        role: normRole,
        userId: userId || null,
        updatedAt: Date.now(),
      });
    }
  } catch (e) {
    console.warn("[FCM Filter] Failed to persist role to IndexedDB:", e);
  }
};

export const clearActiveRoleFromSW = async () => {
  if (
    typeof navigator !== "undefined" &&
    navigator.serviceWorker &&
    navigator.serviceWorker.controller
  ) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_ACTIVE_ROLE",
      });
    } catch {
      // ignore
    }
  }

  try {
    const db = await openIDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete("current_user");
    }
  } catch {
    // ignore
  }
};
