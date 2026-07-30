const formatStatus = (status) => {
  if (!status) return "--";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatTime = (time) => {
  if (!time) return "--";

  const [hour, minute] = time.split(":");
  const h = Number(hour);

  return `${((h + 11) % 12) + 1}:${minute} ${h >= 12 ? "PM" : "AM"}`;
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
            #{patient.token_no ?? "--"}
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
          {formatTime(patient.slot_time)}
        </span>
      </div>
    </div>
  );
};

export default AppointmentCard;