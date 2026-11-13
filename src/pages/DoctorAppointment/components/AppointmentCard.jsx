const formatStatus = (status) => {
  if (!status) return "--";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatTime = (time) => {
  if (!time || typeof time !== "string") return "--";
  const clean = time.trim();
  if (
    !clean ||
    clean === "null" ||
    clean === "undefined" ||
    clean === "Invalid Date"
  ) {
    return "--";
  }

  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(clean)) {
    return clean.toUpperCase();
  }

  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(clean)) {
    const [hour, minute] = clean.split(":");
    const h = Number(hour);
    const m = Number(minute);
    if (!isNaN(h) && !isNaN(m) && h >= 0 && h < 24 && m >= 0 && m < 60) {
      const displayH = h % 12 || 12;
      const ampm = h >= 12 ? "PM" : "AM";
      const displayM = String(m).padStart(2, "0");
      return `${displayH}:${displayM} ${ampm}`;
    }
  }

  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      return "--";
    }
    const date = new Date(clean);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  } catch {
    // fallback
  }

  return "--";
};

const isIpdPatient = (patient) => {
  if (!patient) return false;
  const status = patient.status?.toLowerCase() || "";
  const patientType = (
    patient.patient_type ||
    patient.type ||
    patient.appointment_type ||
    ""
  ).toLowerCase();

  return (
    Boolean(patient.is_ipd) ||
    patientType === "ipd" ||
    patientType === "inpatient" ||
    Boolean(patient.admission_id) ||
    Boolean(patient.admission_no) ||
    Boolean(patient.room_number) ||
    Boolean(patient.room_no) ||
    Boolean(patient.ward) ||
    status === "admitted" ||
    status === "admission" ||
    status === "inpatient"
  );
};

const getAppointmentTimeDisplay = (patient) => {
  if (!patient) return "--";

  if (isIpdPatient(patient)) {
    const room = patient.room_number || patient.room_no;
    if (room) {
      return String(room).toLowerCase().startsWith("rm")
        ? String(room)
        : `Rm ${room}`;
    }
    return "IPD";
  }

  const slot = patient.slot_time || patient.appointment_time || patient.time;
  return formatTime(slot);
};

const AppointmentCard = ({
  patient,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`mt-4 cursor-pointer rounded-[24px] border-2 transition-all p-5
        ${
          selected
            ? "border-[#4D2E23] bg-[#FFF9F5]"
            : "border-[#E7DBD3] bg-white hover:border-[#4D2E23]"
        }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-[20px] font-bold text-[#2F2623] leading-none">
            {patient.patient_name}
          </h2>

          <p className="mt-3 text-[13px] text-[#5B3B31]">
            {patient.age ?? "--"} Years • {patient.gender ?? "--"}
          </p>
        </div>

        <div className="rounded-xl bg-[#FFF4ED] px-3 py-2">
          <span className="text-[16px] font-bold text-[#4D2E23]">
            #
            {patient.token_no ??
              patient.token ??
              
              "--"}
          </span>
        </div>
      </div>

      {/* Reason */}
      <p className="mt-5 text-[13px] text-[#7A756F] leading-5">
        Last treated for{" "}
        <span className="font-medium">
          {patient.reason || "--"}
        </span>
      </p>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full bg-[#DDF6E5] px-4 py-2 text-[12px] font-medium text-[#1E6A41]">
          {formatStatus(patient.status)}
        </span>

        <span className="text-[16px] font-semibold text-[#2F2623]">
          {getAppointmentTimeDisplay(patient)}
        </span>
      </div>
    </div>
  );
};

export default AppointmentCard;