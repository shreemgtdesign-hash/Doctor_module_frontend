const PharmacistPatientCard = ({
    patient,
    selected,
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            className={`
                w-full rounded-2xl border p-4 text-left
                transition-all duration-200
                ${
                    selected
                        ? "border-[#4D2E23] bg-[#FFF9F5] shadow-sm"
                        : "border-[#EFE4DC] bg-white hover:border-[#C9B0A0]"
                }
            `}
        >

            <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                    <h3 className="truncate text-[17px] font-semibold text-[#4D2E23]">
                        {patient.patient_name}
                    </h3>

                    <p className="mt-1 text-sm text-[#6F625A]">
                        {patient.ailment}
                    </p>

                    <p className="mt-1 text-xs text-[#8B7A70]">
                        {patient.doctor_name}
                    </p>

                </div>


                <span className="shrink-0 rounded-lg bg-[#FFF3E8] px-3 py-1 text-xs font-medium text-[#4D2E23]">
                    {patient.patient_code}
                </span>

            </div>


            <div className="mt-4 flex items-center justify-between">

                <span
                    className={`
                        rounded-full px-3 py-1 text-xs font-medium
                        ${
                            patient.visit_type === "New"
                                ? "bg-[#E8F8ED] text-green-700"
                                : "bg-[#FFF3E8] text-[#8B573D]"
                        }
                    `}
                >
                    {patient.visit_type}
                </span>


                <span className="text-xs text-[#6F625A]">
                    {patient.dispensed_items}/
                    {patient.total_items}
                </span>

            </div>

        </button>

    );
};


export default PharmacistPatientCard;