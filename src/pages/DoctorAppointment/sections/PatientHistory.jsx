import {
  HiOutlineCalendarDays,
  HiOutlineUserCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentText,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const visits = [
  {
    id: 1,
    date: "21 Jul 2026",
    doctor: "Dr. Jayashree",
    diagnosis: "Viral Fever",
    prescription: "Paracetamol, Vitamin C",
    notes: "Patient advised complete bed rest and hydration.",
  },
  {
    id: 2,
    date: "12 Jun 2026",
    doctor: "Dr. Jayashree",
    diagnosis: "Gastritis",
    prescription: "Pantoprazole",
    notes: "Avoid spicy food for one week.",
  },
  {
    id: 3,
    date: "08 Apr 2026",
    doctor: "Dr. Jayashree",
    diagnosis: "Migraine",
    prescription: "Sumatriptan",
    notes: "Follow-up after 15 days.",
  },
];

const PatientHistory = () => {
  return (
    <div className="mt-6">
      {/* Header */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#4D2E23]">
          Patient History
        </h2>

        <p className="mt-1 text-[#8B7A70]">
          Previous consultations and treatment history.
        </p>
      </div>

      {/* Timeline */}

      <div className="relative border-l-2 border-[#E6DAD3] ml-5 space-y-8">
        {visits.map((visit) => (
          <div key={visit.id} className="relative pl-10">
            {/* Timeline Dot */}

            <div className="absolute -left-[11px] top-2 h-5 w-5 rounded-full border-4 border-white bg-[#6A3F2D]" />

            <div className="rounded-2xl border border-[#E6DAD3] bg-white p-6 shadow-sm">
              {/* Top */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#6A3F2D]">
                  <HiOutlineCalendarDays />

                  <span className="font-semibold">
                    {visit.date}
                  </span>
                </div>

                <button className="rounded-lg p-2 hover:bg-[#FFF5EF]">
                  <HiOutlineChevronRight />
                </button>
              </div>

              {/* Doctor */}

              <div className="mt-5 flex items-center gap-2">
                <HiOutlineUserCircle
                  size={22}
                  className="text-[#6A3F2D]"
                />

                <span className="font-medium text-[#4D2E23]">
                  {visit.doctor}
                </span>
              </div>

              {/* Diagnosis */}

              <div className="mt-5 flex items-start gap-3">
                <HiOutlineClipboardDocumentList
                  size={22}
                  className="mt-1 text-[#6A3F2D]"
                />

                <div>
                  <h4 className="font-semibold text-[#4D2E23]">
                    Diagnosis
                  </h4>

                  <p className="text-[#8B7A70]">
                    {visit.diagnosis}
                  </p>
                </div>
              </div>

              {/* Prescription */}

              <div className="mt-5 flex items-start gap-3">
                <HiOutlineDocumentText
                  size={22}
                  className="mt-1 text-[#6A3F2D]"
                />

                <div>
                  <h4 className="font-semibold text-[#4D2E23]">
                    Prescription
                  </h4>

                  <p className="text-[#8B7A70]">
                    {visit.prescription}
                  </p>
                </div>
              </div>

              {/* Notes */}

              <div className="mt-5 rounded-xl bg-[#FFF8F3] p-4">
                <h4 className="font-semibold text-[#4D2E23]">
                  Doctor Notes
                </h4>

                <p className="mt-2 text-[#7C6A61]">
                  {visit.notes}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientHistory;