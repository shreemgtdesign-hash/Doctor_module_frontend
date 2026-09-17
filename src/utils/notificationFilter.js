// ======================================================
// Notification Filter Utility
// src/utils/notificationFilter.js
// ======================================================

/**
 * Normalizes a role string for comparison.
 * e.g. "Front Office" -> "frontoffice", "duty_doctor" -> "dutydoctor"
 */
export const normalizeRole = (r) =>
  (r || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_-]/g, "");


/**
 * NOTIFICATION TYPE → ALLOWED ROLES MAP
 *
 * Every notification type the backend sends must be listed here
 * with the array of roles that are allowed to see it.
 *
 * This is the PRIMARY and most reliable filter.
 * If the backend sends `type` in the FCM data payload, this table
 * decides who sees it.
 */
const TYPE_ROLE_MAP = {
  // Front Office types
  appointment_booked:          ["frontoffice", "front_office"],
  appointment_confirmed:       ["frontoffice", "front_office"],
  appointment_cancelled:       ["frontoffice", "front_office"],
  walk_in_registered:          ["frontoffice", "front_office"],
  payment_received:            ["frontoffice", "front_office"],
  payment_pending:             ["frontoffice", "front_office"],
  billing_update:              ["frontoffice", "front_office"],
  home_visit_requested:        ["frontoffice", "front_office"],
  home_visit_confirmed:        ["frontoffice", "front_office"],
  package_subscribed:          ["frontoffice", "front_office"],
  insurance_update:            ["frontoffice", "front_office"],
  medical_camp_update:         ["frontoffice", "front_office"],

  // Doctor types
  new_appointment:             ["doctor"],
  consultation_due:            ["doctor"],
  patient_arrived:             ["doctor"],
  prescription_sent:           ["doctor"],
  prescription_update:         ["doctor"],
  therapy_prescribed:          ["doctor"],

  // Therapist types
  therapy_assigned:            ["therapist"],
  therapy_session_scheduled:   ["therapist"],
  therapy_reminder:            ["therapist"],
  therapy_updated:             ["therapist"],
  room_assigned:               ["therapist"],
  therapist_assigned:          ["therapist"],

  // Pharmacist types
  prescription_to_dispense:    ["pharmacist"],
  medicine_dispensed:          ["pharmacist"],
  medicine_stock_low:          ["pharmacist"],
  pharmacy_order:              ["pharmacist"],

  // Duty Doctor types
  patient_in_queue:            ["dutydoctor", "duty_doctor"],
  pain_assessment_due:         ["dutydoctor", "duty_doctor"],
  triage_update:               ["dutydoctor", "duty_doctor"],
  duty_doctor_alert:           ["dutydoctor", "duty_doctor"],
};


/**
 * Main filter function.
 * Returns true if the notification should be shown to this role.
 *
 * Priority order:
 * 1. Explicit recipient user ID match (most specific)
 * 2. Explicit target_role in payload (backend-controlled)
 * 3. Notification type lookup in TYPE_ROLE_MAP
 * 4. Strict text-based role classification (last resort)
 */
export const isNotificationForRole = (
  role,
  title = "",
  body = "",
  data = {},
  user = null
) => {
  const normRole = normalizeRole(role);
  if (!normRole) return true; // unknown role — let it through

  const text = `${title || ""} ${body || ""}`.toLowerCase();

  // ------------------------------------------------------------------
  // PRIORITY 1 — EXPLICIT USER ID
  // If the payload targets a specific user, only show to that user.
  // ------------------------------------------------------------------
  const recipientUserId =
    data?.user_id ||
    data?.userId ||
    data?.recipient_id ||
    data?.recipientId ||
    data?.receiver_id;
  const currentUserId = user?.id || user?._id || user?.user_id;

  if (recipientUserId && currentUserId) {
    const match = String(recipientUserId) === String(currentUserId);
    if (!match) {
      console.log(`[FCM Filter] Dropped — targeted to user ${recipientUserId}, current user is ${currentUserId}`);
    }
    return match;
  }

  // ------------------------------------------------------------------
  // PRIORITY 2 — EXPLICIT TARGET ROLE FROM BACKEND
  // The backend should set data.target_role or data.role in FCM payload.
  // ------------------------------------------------------------------
  const rawTargetRole =
    data?.target_role ||
    data?.targetRole ||
    data?.recipient_role ||
    data?.recipientRole ||
    data?.for ||
    data?.role;         // "role" is what the backend most likely sends

  if (rawTargetRole) {
    const targetRole = normalizeRole(rawTargetRole);
    const match = normRole === targetRole;
    if (!match) {
      console.log(`[FCM Filter] Dropped — notification is for role "${targetRole}", current role is "${normRole}"`);
    }
    return match;
  }

  // ------------------------------------------------------------------
  // PRIORITY 3 — NOTIFICATION TYPE LOOKUP
  // ------------------------------------------------------------------
  const notifType = (data?.type || "").toLowerCase().trim().replace(/[\s-]/g, "_");

  if (notifType && TYPE_ROLE_MAP[notifType]) {
    const allowedRoles = TYPE_ROLE_MAP[notifType].map(normalizeRole);
    const match = allowedRoles.includes(normRole);
    if (!match) {
      console.log(`[FCM Filter] Dropped — type "${notifType}" is for roles [${allowedRoles.join(", ")}], current role is "${normRole}"`);
    }
    return match;
  }

  // ------------------------------------------------------------------
  // PRIORITY 4 — STRICT TEXT-BASED ROLE CLASSIFICATION (LAST RESORT)
  // Only applied when the backend hasn't provided type/role fields.
  // ------------------------------------------------------------------

  // --- Content signal groups ---
  const isTherapistSignal =
    text.includes("has been assigned") && (text.includes("therapy") || text.includes("counselling") || text.includes("treatment")) ||
    text.includes("therapy assigned") ||
    text.includes("therapist assigned") ||
    text.includes("therapy session scheduled") ||
    text.includes("assigned to you") && text.includes("therapy") ||
    text.includes("room has been assigned");

  const isDoctorSignal =
    text.includes("patient booked an appointment with you") ||
    text.includes("new appointment with you") ||
    text.includes("scheduled with you") ||
    text.includes("you have a consultation") ||
    text.includes("new therapy prescribed") ||
    (text.includes("prescribed") && (text.includes("by dr.") || text.includes("by dr ")));

  const isPharmacistSignal =
    text.includes("prescription to dispense") ||
    text.includes("medicines to dispense") ||
    text.includes("dispense") ||
    text.includes("medicine stock") ||
    text.includes("pharmacy order");

  const isDutyDoctorSignal =
    text.includes("pain assessment") ||
    text.includes("patient in queue") ||
    text.includes("triage") ||
    text.includes("duty doctor alert");

  const isFrontOfficeConfirmation =
    text.includes("you assigned") ||
    text.includes("you booked") ||
    text.includes("assigned successfully") ||
    text.includes("booked successfully") ||
    text.includes("room confirmed") ||
    text.includes("walk-in registered") ||
    text.includes("payment received");

  // --- Apply strict per-role rules ---
  switch (normRole) {
    case "therapist":
    case "headtherapist":
      if (!isTherapistSignal) {
        console.log(`[FCM Filter][Fallback] Dropped for therapist — no therapist signal in: "${title}"`);
        return false;
      }
      return true;

    case "doctor":
      if (!isDoctorSignal) {
        console.log(`[FCM Filter][Fallback] Dropped for doctor — no doctor signal in: "${title}"`);
        return false;
      }
      return true;

    case "pharmacist":
      if (!isPharmacistSignal) {
        console.log(`[FCM Filter][Fallback] Dropped for pharmacist — no pharmacist signal in: "${title}"`);
        return false;
      }
      return true;

    case "dutydoctor":
    case "duty_doctor":
      if (!isDutyDoctorSignal) {
        console.log(`[FCM Filter][Fallback] Dropped for duty doctor — no duty doctor signal in: "${title}"`);
        return false;
      }
      return true;

    case "frontoffice":
    case "front_office":
      // Front Office sees its own confirmations, booking alerts, billing, etc.
      // Exclude purely-therapist execution alerts and pure doctor prescription alerts.
      if (isTherapistSignal && !isFrontOfficeConfirmation) {
        console.log(`[FCM Filter][Fallback] Dropped for front office — therapist execution alert: "${title}"`);
        return false;
      }
      if (isDoctorSignal && !isFrontOfficeConfirmation) {
        console.log(`[FCM Filter][Fallback] Dropped for front office — doctor signal: "${title}"`);
        return false;
      }
      if (isPharmacistSignal) {
        console.log(`[FCM Filter][Fallback] Dropped for front office — pharmacy signal: "${title}"`);
        return false;
      }
      if (isDutyDoctorSignal) {
        console.log(`[FCM Filter][Fallback] Dropped for front office — duty doctor signal: "${title}"`);
        return false;
      }
      return true;

    default:
      return true;
  }
};
