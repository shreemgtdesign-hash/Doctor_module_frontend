import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineArchiveBox,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

import {
  loadDiagnosis,
  saveDiagnosisThunk,
  loadAssociateDoctors,
} from "../../../redux/consultation/consultationThunk";
import { searchDiagnosisCategoriesThunk } from "../../../redux/appointment/appointmentThunk";

const Diagnosis = ({ appointmentId, onContinue, onBack, }) => {

  const [search, setSearch] = useState("");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const handleSaveAndGoBack = async () => {
    try {
      await dispatch(
        saveDiagnosisThunk({
          appointmentId,
          payload: {
            diagnosis: notes,
            category: selectedDiagnosis[0] || "",
          },
        })
      ).unwrap();

      onBack?.();
    } catch (error) {
      console.error(error);
    }
  };
  const {
    diagnosis,
    diagnosisCategories,
    associateDoctors = [],
    loading,
  } = useSelector((state) => state.consultation);

  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!appointmentId) return;
    setSearch("");
  setSelectedDiagnosis([]);
  setNotes("");
  setShowDropdown(false);
    dispatch(searchDiagnosisCategoriesThunk());
    dispatch(loadDiagnosis(appointmentId));
    dispatch(loadAssociateDoctors(appointmentId));
  }, [appointmentId, dispatch]);

  useEffect(() => {
    if (!diagnosis) return;

    setNotes(diagnosis.diagnosis || "");

    if (diagnosis.category) {
      setSelectedDiagnosis([diagnosis.category]);
    }
  }, [diagnosis]);

  const handleSaveAndContinue = async () => {
    try {
      await dispatch(
        saveDiagnosisThunk({
          appointmentId,
          payload: {
            diagnosis: notes,
            category: selectedDiagnosis[0] || "",
          },
        })
      ).unwrap();

      onContinue?.();
    } catch (error) {
      console.error(error);
    }
  };
  const filteredDiagnosis = diagnosisCategories.filter(item =>
    item.toLowerCase().includes(search.toLowerCase()) &&
    !selectedDiagnosis.includes(item)
  );
  return (
    <div className="mt-8">
      {/* Header */}
      <div>
        <h2 className="text-[34px] font-bold text-[#4D2E23]">
          Diagnosis
        </h2>

        <p className="mt-1 text-[18px] text-[#6F625A]">
          Add diagnosis details
        </p>
      </div>

      {/* Notes */}
      <div className="relative mt-8">

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Search Diagnosis"
          className="h-16 w-full rounded-[22px] border border-[#DDD0C8] px-5 outline-none"
        />

        {showDropdown && search && filteredDiagnosis.length > 0 && (
          <div className="absolute left-0 right-0 top-[70px] z-50 max-h-72 overflow-y-auto rounded-2xl border border-[#EFE4DC] bg-white shadow-xl">

            {filteredDiagnosis.map((item) => (

              <button
                key={item}
                type="button"
                onClick={() => {
                  setSelectedDiagnosis(prev => [...prev, item]);
                  setSearch("");
                  setShowDropdown(false);
                }}
                className="block w-full border-b border-[#EFE4DC] px-5 py-4 text-left hover:bg-[#FFF6F0]"
              >
                {item}
              </button>

            ))}

          </div>
        )}

      </div>

      <div className="mt-5 flex flex-wrap gap-3">

        {selectedDiagnosis.map(item => (

          <div
            key={item}
            className="flex items-center gap-2 rounded-xl bg-[#FFEAD8] px-4 py-2"
          >
            <span>{item}</span>

            <button
              onClick={() =>
                setSelectedDiagnosis(prev =>
                  prev.filter(x => x !== item)
                )
              }
            >
              ✕
            </button>

          </div>

        ))}

      </div>
      {/* Diagnosis Notes */}

      <div className="mt-8">
        <label className="mb-3 block text-[20px] font-semibold text-[#4D2E23]">
          Diagnosis Notes
        </label>

        <textarea
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter diagnosis notes..."
          className="w-full resize-none rounded-[22px] border border-[#DDD0C8] bg-white p-5 text-[16px] text-[#4D2E23] outline-none placeholder:text-[#8B7A70] focus:border-[#8B573D]"
        />
      </div>

      {/* Actions */}
      <div className="mt-5 flex justify-end gap-8">
        <button className="flex items-center gap-2 text-[#B9AAA1]">
          <HiOutlinePencilSquare size={20} />
          Edit
        </button>

        <button
          onClick={handleSaveAndContinue}
          disabled={loading}
          className="flex items-center gap-2 text-[#4D2E23]"
        >
          <HiOutlineArchiveBox size={20} />
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <hr className="my-8 border-[#EFE4DC]" />

      {/* Associate Doctors */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-[30px] font-semibold text-[#4D2E23]">
            Associate Doctor
          </h3>

          <button className="flex items-center gap-2 text-[#B9AAA1]">
            <HiOutlinePlus size={18} />
            Add
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {associateDoctors.length > 0 ? (
            associateDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="rounded-2xl border border-[#EFE4DC] bg-white p-6 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7EEE8] text-2xl font-bold text-[#8B573D]">
                  {doctor.name?.charAt(0)}
                </div>

                <h4 className="mt-4 text-lg font-semibold text-[#4D2E23]">
                  {doctor.name}
                </h4>

                <p className="text-sm text-[#8B7A70]">
                  {doctor.role_label}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-[#8B7A70]">
              No associate doctors added.
            </p>
          )}
        </div>
      </div>

      {/* Save & Continue */}
      <button
        onClick={handleSaveAndGoBack}
        className="mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-[22px] bg-[#8B573D] text-lg font-semibold text-white hover:bg-[#74442F]"
      >
        <HiOutlineArrowLeft size={22} />
        Save & Go Back
      </button>
    </div>
  );
};

export default Diagnosis;