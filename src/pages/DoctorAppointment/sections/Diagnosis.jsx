import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineArchiveBox,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

import {
  loadDiagnosis,
  saveDiagnosisThunk,
  loadAssociateDoctors,
} from "../../../redux/consultation/consultationThunk";

const Diagnosis = ({ appointmentId, onContinue }) => {
  const dispatch = useDispatch();

  const {
    diagnosis,
    associateDoctors = [],
    loading,
  } = useSelector((state) => state.consultation);

  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!appointmentId) return;

    dispatch(loadDiagnosis(appointmentId));
    dispatch(loadAssociateDoctors(appointmentId));
  }, [appointmentId, dispatch]);

  useEffect(() => {
    setNotes(diagnosis || "");
  }, [diagnosis]);

 const handleSaveAndContinue = async () => {
  try {
    await dispatch(
      saveDiagnosisThunk({
        appointmentId,
        payload: {
          diagnosis: notes,
        },
      })
    ).unwrap();

    onContinue?.();
  } catch (error) {
    console.error(error);
  }
};

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
      <div className="mt-8">
        <textarea
          rows={7}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter Diagnosis Notes..."
          className="w-full resize-none rounded-[24px] border border-[#DDD0C8] bg-white p-5 outline-none focus:border-[#8B573D]"
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
        onClick={handleSaveAndContinue}

        className="mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-[22px] bg-[#8B573D] text-lg font-semibold text-white hover:bg-[#74442F]"
      >
        <HiOutlineArrowRightOnRectangle size={22} />
        Save and Continue
      </button>
    </div>
  );
};

export default Diagnosis;