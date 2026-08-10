const PharmacistPatientHeader = ({
    patient,
}) => {

    const initials =
        patient.patient_name
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();


    return (

        <div className="border-b border-[#EFE4DC] pb-5">

            <div className="flex items-center gap-4">

                {/* Avatar */}

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0E4DA] text-lg font-bold text-[#8B573D]">
                    {initials || "P"}
                </div>


                {/* Patient */}

                <div className="flex-1">

                    <div className="flex items-center gap-3">

                        <h2 className="text-[22px] font-bold text-[#4D2E23]">
                            {patient.patient_name}
                        </h2>

                        <span className="rounded-lg bg-[#FFF0E3] px-3 py-1 text-xs text-[#6F625A]">
                            {patient.patient_code}
                        </span>

                    </div>


                    <p className="mt-1 text-sm text-[#8B7A70]">

                        {patient.doctor_name}

                        {"  |  "}

                        {patient.ailment}

                        {"  |  "}

                        {patient.visit_type}

                    </p>

                </div>

            </div>

        </div>

    );
};


export default PharmacistPatientHeader;