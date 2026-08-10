import { useState } from "react";

import {
    HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

import PharmacistPatientCard
    from "./PharmacistPatientCard";


const PharmacistPatientList = ({
    patients,
    selectedPatient,
    onSelectPatient,
}) => {

    const [search, setSearch] = useState("");


    const filteredPatients =
        patients.filter((patient) => {

            const value =
                search.toLowerCase();

            return (
                patient.patient_name
                    ?.toLowerCase()
                    .includes(value) ||

                patient.patient_code
                    ?.toLowerCase()
                    .includes(value)
            );

        });


    return (

        <div className="flex h-full flex-col rounded-3xl border border-[#EFE4DC] bg-white p-5">

            {/* Header */}

            <div>

                <h2 className="text-[22px] font-bold text-[#4D2E23]">
                    Patients
                </h2>

                <p className="mt-1 text-sm text-[#8B7A70]">
                    • {patients.length} Patients
                </p>

            </div>


            {/* Search */}

            <div className="relative mt-5">

                <HiOutlineMagnifyingGlass
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7A70]"
                />

                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search patient..."
                    className="h-12 w-full rounded-xl border border-[#E8DDD5] bg-[#FFFCF9] pl-11 pr-4 text-sm outline-none focus:border-[#8B573D]"
                />

            </div>


            {/* Filters */}

            <div className="mt-4 flex gap-2">

                <button
                    className="rounded-lg bg-[#FFF0E3] px-4 py-2 text-sm font-semibold text-[#4D2E23]"
                >
                    All
                </button>

                <button
                    className="rounded-lg border border-[#E8DDD5] px-4 py-2 text-sm text-[#6F625A]"
                >
                    Follow-up
                </button>

                <button
                    className="rounded-lg border border-[#E8DDD5] px-4 py-2 text-sm text-[#6F625A]"
                >
                    New
                </button>

            </div>


            {/* Patients */}

            <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">

                {filteredPatients.length > 0 ? (

                    filteredPatients.map(
                        (patient) => (

                            <PharmacistPatientCard
                                key={
                                    patient.consultation_id
                                }
                                patient={patient}
                                selected={
                                    selectedPatient
                                        ?.consultation_id ===
                                    patient.consultation_id
                                }
                                onClick={() =>
                                    onSelectPatient(
                                        patient
                                    )
                                }
                            />

                        )
                    )

                ) : (

                    <div className="py-10 text-center text-sm text-[#8B7A70]">
                        No patients found
                    </div>

                )}

            </div>

        </div>

    );
};


export default PharmacistPatientList;