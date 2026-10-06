import { Maximize2 } from "lucide-react";

const PharmacistPatientHeader = ({
    patient,
    onExpand,
}) => {
    if (!patient) return null;

    const initials =
        patient.patient_name
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "P";

    const patientId =
        patient.patient_id ||
        patient.patient_code ||
        patient.id ||
        "1234567";

    const doctorName =
        patient.doctor_name
            ? (patient.doctor_name.startsWith("Dr.") ? patient.doctor_name : `Dr. ${patient.doctor_name}`)
            : "Dr. Jayasree";

    const ailment = patient.ailment || "Digestion issue";
    const duration = patient.duration || patient.visit_type || "15 Days";

    return (
        <div className="border-b border-[#EFE4DC] pb-5">
            <div className="flex items-center justify-between">
                {/* Left: Avatar + Details */}
                <div className="flex items-center gap-3.5">
                    {patient.image || patient.avatar || patient.photo ? (
                        <img
                            src={patient.image || patient.avatar || patient.photo}
                            alt={patient.patient_name}
                            className="h-12 w-12 rounded-full object-cover border border-[#EFE4DC] shadow-sm"
                        />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EBDCCF] text-[16px] font-bold text-[#6D4233] border border-[#DFC5B2] shadow-sm">
                            {initials}
                        </div>
                    )}

                    <div>
                        <h2 className="text-[20px] font-bold text-[#4B2E2A] leading-tight">
                            {patient.patient_name || "Patient"}
                        </h2>

                        <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-[#7D726B]">
                            <span>Patient ID: {patientId}</span>
                            <span className="text-[#C8B8AC]">|</span>
                            <span>{doctorName}</span>
                            <span className="text-[#C8B8AC]">|</span>
                            <span>{ailment}</span>
                            <span className="text-[#C8B8AC]">|</span>
                            <span>{duration}</span>
                        </p>
                    </div>
                </div>

                {/* Right: Expand Button */}
                <button
                    type="button"
                    onClick={onExpand}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EFE4DC] bg-[#FDFAF7] text-[#6F625A] hover:bg-[#FFF4EB] hover:text-[#4B2E2A] transition shadow-sm"
                    title="Expand View"
                >
                    <Maximize2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default PharmacistPatientHeader;