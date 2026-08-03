import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    HiOutlineMagnifyingGlass,
    HiOutlineMicrophone,
    HiOutlineXMark,
    HiOutlinePencilSquare,
    HiOutlineArchiveBox,
    HiOutlineArrowRightOnRectangle,
    HiOutlineArrowLeft,
} from "react-icons/hi2";
import {
    loadChiefComplaints,

    saveChiefComplaintsThunk,
} from "../../../redux/consultation/consultationThunk";

const symptoms = [
    "Fever",
    "Headache",
    "Body Pain",
    "Cold",
    "Cough",
    "Vomiting",
    "Fatigue",
    "Joint Pain",
    "Back Ache",
    "Muscle Pain",
    "Weakness",
];

const ChiefComplaints = ({ appointmentId, setActiveSection }) => {
    const dispatch = useDispatch();

    const { chiefComplaints, loading } = useSelector(
        (state) => state.consultation
    );

    const [search, setSearch] = useState("");
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [notes, setNotes] = useState("");

    const filteredSymptoms = symptoms.filter(
  (item) =>
    item.toLowerCase().includes(search.toLowerCase()) &&
    !selectedSymptoms.includes(item)
);
    useEffect(() => {
        if (appointmentId) {
            dispatch(loadChiefComplaints(appointmentId));
        }
    }, [appointmentId, dispatch]);

    useEffect(() => {
        setSelectedSymptoms(chiefComplaints?.tags || []);
        setNotes(chiefComplaints?.notes || "");
    }, [chiefComplaints]);

    const toggleSymptom = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms((prev) =>
                prev.filter((item) => item !== symptom)
            );
        } else {
            setSelectedSymptoms((prev) => [...prev, symptom]);
        }
    };

  const handleSave = async () => {
  const payload = {
    tags: selectedSymptoms,
    notes,
  };

  console.log("Saving payload:", payload);

  await dispatch(
    saveChiefComplaintsThunk({
      appointmentId,
      payload,
    })
  ).unwrap();
};

    return (
        <div className="mt-6">
  {/* Heading */}

  <div>
    <h2 className="text-[34px] font-bold text-[#4D2E23]">
      Chief Complaints
    </h2>

    <p className="mt-1 text-[18px] text-[#6F625A]">
      Add and manage patient chief complaints
    </p>
  </div>

  {/* Search */}

<div className="relative mt-8">
  <HiOutlineMagnifyingGlass
    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5B3428]"
    size={22}
  />

  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by complaints"
    className="h-16 w-full rounded-[22px] border border-[#D9C8BE] bg-white pl-14 pr-14 text-lg text-[#4D2E23] outline-none placeholder:text-[#8F8F8F]"
  />

  <HiOutlineMicrophone
    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5B3428]"
    size={22}
  />

  {/* Search Suggestions */}
  {search.trim() && filteredSymptoms.length > 0 && (
    <div className="absolute left-0 right-0 top-[72px] z-50 max-h-72 overflow-y-auto rounded-[22px] border border-[#E7DBD3] bg-white shadow-2xl">
      {filteredSymptoms.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => {
            toggleSymptom(item);
            setSearch("");
          }}
          className="flex w-full items-center border-b border-[#F3E8E1] px-5 py-4 text-left text-[17px] font-medium text-[#4D2E23] transition hover:bg-[#FFF3EC] last:border-b-0"
        >
          {item}
        </button>
      ))}
    </div>
  )}
</div>

  {/* Selected Complaints */}

  <div className="mt-6 flex flex-wrap gap-3">
    {selectedSymptoms.map((item) => (
      <div
        key={item}
        className="flex h-12 items-center gap-3 rounded-xl bg-[#FFEAD8] px-5 text-base font-medium text-[#4D2E23]"
      >
        <span>{item}</span>

        <button
          type="button"
          onClick={() => toggleSymptom(item)}
          className="flex items-center justify-center rounded-full hover:bg-[#F7D8C4]"
        >
          <HiOutlineXMark size={18} />
        </button>
      </div>
    ))}
  </div>

  {/* Notes */}

  <div className="mt-10">
    <label className="mb-3 block text-xl font-semibold text-[#4D2E23]">
      Complaints Notes
    </label>

    <textarea 
      rows={5}
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Enter Complaints"
      className="w-full resize-none rounded-[22px] border border-[#D9C8BE] p-5 text-base outline-none placeholder:text-[#8E8E8E] focus:border-[#8B573D]"
    />
  </div>

  {/* Action Buttons */}

  <div className="mt-5 flex justify-end gap-8">
    <button
      type="button"
      className="flex items-center gap-2 text-[#B8AAA2] transition hover:text-[#8B573D]"
    >
      <HiOutlinePencilSquare size={18} />
      <span className="text-lg font-semibold">
        Edit
      </span>
    </button>

    <button
      type="button"
      onClick={handleSave}
      className="flex items-center gap-2 text-[#4D2E23] transition hover:text-[#8B573D]"
    >
      <HiOutlineArchiveBox size={18} />
      <span className="text-lg font-semibold">
        Save
      </span>
    </button>
  </div>



 <button
  type="button"
  onClick={async () => {
    await handleSave();
    setActiveSection("overview");
  }}
  className="mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-[22px] bg-[#8B573D] text-xl font-semibold text-white transition hover:bg-[#764733]"
>
  <HiOutlineArrowLeft size={22} />
  Save & Go Back
</button>
</div>
    );
};

export default ChiefComplaints;