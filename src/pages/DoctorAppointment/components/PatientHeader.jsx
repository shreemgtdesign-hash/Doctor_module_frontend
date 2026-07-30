import {
  HiOutlinePhone,
  HiOutlineArrowsPointingOut,
} from "react-icons/hi2";

const PatientHeader = ({
  patient,
  appointment,
}) => {
  if (!patient) return null;


  return (
    <>
      <div className="flex items-start justify-between">
        {/* Left */}

        <div className="flex items-center">
          <img
            src={
              patient?.avatar ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(patient?.name || "Patient")
            }
            alt={patient?.name}
            className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
          />

          <div className="ml-5">
            <h2 className="text-[28px] font-bold text-[#4D2E23]">
              {patient?.name}
            </h2>

            <p className="mt-1 text-[#8B7A70]">
              {patient?.age} Years • {patient?.gender}
            </p>

            <div className="mt-3 flex items-center text-[#8B7A70] text-sm flex-wrap gap-y-2">
              <HiOutlinePhone className="mr-2" />

              <span>{patient?.mobile}</span>

              <span className="mx-3">|</span>

              <span>
                Patient ID : {patient?.patient_code}
              </span>

              {appointment?.token_no && (
                <>
                  <span className="mx-3">|</span>

                  <span>
                    Token : {appointment.token_no}
                  </span>
                </>
              )}
            </div>

            <div className="mt-4 flex gap-3 flex-wrap">
              <span className="rounded-full bg-[#FFEAD8] px-4 py-2 text-sm font-medium text-[#6A3F2D]">
                {patient?.blood_group || "--"}
              </span>

              <span className="rounded-full bg-[#FFEAD8] px-4 py-2 text-sm font-medium text-[#6A3F2D]">
                {patient?.allergies?.length
                  ? patient.allergies.join(", ")
                  : "No Allergies"}
              </span>

              {appointment?.status && (
                <span className="rounded-full bg-[#E9F8EF] px-4 py-2 text-sm font-medium text-[#18794E] capitalize">
                  {appointment.status.replace("_", " ")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand */}

        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E6DAD3] bg-[#FFF9F5] hover:bg-[#FFF2EA] transition">
          <HiOutlineArrowsPointingOut
            size={20}
            className="text-[#6A3F2D]"
          />
        </button>
      </div>

      <div className="my-7 border-b border-[#ECE3DC]" />
    </>
  );
};

export default PatientHeader;