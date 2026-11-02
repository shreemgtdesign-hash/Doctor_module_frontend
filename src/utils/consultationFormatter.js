/**
 * Safely format consultation types from various backend response formats:
 * - String: "In-person, Video call, Home visit"
 * - Object: { "In-person": 800, "Video Call": 600, "Home Visit": 1200 }
 * - Object: { "In-person": true, "Video Call": false, ... }
 * - Array: ["In-person", "Video Call"]
 * - JSON string: '{"In-person": true}'
 */
export const formatConsultationType = (
  ct,
  fallback = "In-person, Video call, Home visit"
) => {
  if (ct === null || ct === undefined || ct === "") {
    return fallback;
  }

  const formatKey = (key) => {
    if (!key) return "";
    const k = String(key).trim();
    const lower = k.toLowerCase().replace(/[-_ ]+/g, " ");
    if (lower === "in person" || lower === "inperson") return "In-person";
    if (lower === "video call" || lower === "video" || lower === "videocall") return "Video Call";
    if (lower === "home visit" || lower === "home" || lower === "homevisit") return "Home Visit";
    return k;
  };

  if (typeof ct === "string") {
    const trimmed = ct.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        return formatConsultationType(parsed, fallback);
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }

  if (Array.isArray(ct)) {
    const list = ct.map(formatKey).filter(Boolean);
    return list.length > 0 ? [...new Set(list)].join(", ") : fallback;
  }

  if (typeof ct === "object") {
    const activeTypes = Object.entries(ct)
      .filter(([_, val]) => {
        if (val === true) return true;
        if (typeof val === "number" && !isNaN(val) && val > 0) return true;
        if (typeof val === "string") {
          const s = val.trim().toLowerCase();
          return (
            s !== "" &&
            s !== "false" &&
            s !== "0" &&
            s !== "null" &&
            s !== "undefined"
          );
        }
        return Boolean(val);
      })
      .map(([key]) => formatKey(key))
      .filter(Boolean);

    if (activeTypes.length > 0) {
      return [...new Set(activeTypes)].join(", ");
    }

    const allKeys = Object.keys(ct)
      .map(formatKey)
      .filter(Boolean);
    if (allKeys.length > 0) {
      return [...new Set(allKeys)].join(", ");
    }
  }

  return String(ct) || fallback;
};

