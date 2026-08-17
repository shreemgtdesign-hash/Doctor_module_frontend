import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineMicrophone,
  HiOutlineXMark,
  HiOutlineArrowLeft,
  HiOutlineArrowRightOnRectangle,
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

const ChiefComplaints = ({
  appointmentId,
  setActiveSection,
}) => {
  const dispatch = useDispatch();

  const { chiefComplaints, loading } = useSelector(
    (state) => state.consultation
  );

  const [search, setSearch] = useState("");

  const [selectedSymptoms, setSelectedSymptoms] =
    useState([]);

  const [notes, setNotes] = useState("");

  // Store the original values loaded from backend.
  // This is used to detect unsaved changes.
  const [initialSymptoms, setInitialSymptoms] =
    useState([]);

  const [initialNotes, setInitialNotes] =
    useState("");

  // Popup state
  const [showUnsavedModal, setShowUnsavedModal] =
    useState(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // =========================================================
  // Load Chief Complaints
  // =========================================================

  useEffect(() => {
    if (!appointmentId) return;

    dispatch(loadChiefComplaints(appointmentId));
  }, [appointmentId, dispatch]);

  // =========================================================
  // Set backend data into local state
  // =========================================================

  useEffect(() => {
    if (!chiefComplaints) return;

    const complaints =
      chiefComplaints?.complaint_tags || [];

    const complaintNotes =
      chiefComplaints?.complaint_notes || "";

    setSelectedSymptoms(complaints);
    setNotes(complaintNotes);

    // Save original state for dirty checking
    setInitialSymptoms(complaints);
    setInitialNotes(complaintNotes);
  }, [chiefComplaints]);

  // =========================================================
  // Search
  // =========================================================

  const filteredSymptoms = symptoms.filter(
    (item) =>
      item
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      !selectedSymptoms.includes(item)
  );

  // =========================================================
  // Toggle symptom
  // =========================================================

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms((prev) =>
        prev.filter((item) => item !== symptom)
      );
    } else {
      setSelectedSymptoms((prev) => [
        ...prev,
        symptom,
      ]);
    }
  };

  // =========================================================
  // Check whether user changed anything
  // =========================================================

  const hasUnsavedChanges = () => {
    const currentSymptoms = [...selectedSymptoms].sort();
    const savedSymptoms = [...initialSymptoms].sort();

    const symptomsChanged =
      JSON.stringify(currentSymptoms) !==
      JSON.stringify(savedSymptoms);

    const notesChanged =
      notes !== initialNotes;

    return symptomsChanged || notesChanged;
  };

  // =========================================================
  // Save
  // =========================================================

  const saveChanges = async () => {
    if (!appointmentId) return false;

    try {
      setIsSaving(true);

      const payload = {
        complaint_tags: selectedSymptoms,
        complaint_notes: notes,
      };

      console.log(
        "Saving Chief Complaints:",
        payload
      );

      await dispatch(
        saveChiefComplaintsThunk({
          appointmentId,
          payload,
        })
      ).unwrap();

      // Update original values after successful save
      setInitialSymptoms([...selectedSymptoms]);
      setInitialNotes(notes);

      return true;
    } catch (error) {
      console.error(
        "Failed to save chief complaints:",
        error
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // BACK BUTTON
  // =========================================================

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedModal(true);
      return;
    }

    // No changes → directly go back
    setActiveSection("overview");
  };

  // =========================================================
  // DISCARD AND GO BACK
  // =========================================================

  const handleDiscardAndGoBack = () => {
    // Restore original values
    setSelectedSymptoms([...initialSymptoms]);
    setNotes(initialNotes);

    setShowUnsavedModal(false);

    // Go back
    setActiveSection("overview");
  };

  // =========================================================
  // SAVE FROM POPUP AND GO BACK
  // =========================================================

  const handleSaveFromModal = async () => {
    const success = await saveChanges();

    if (!success) return;

    setShowUnsavedModal(false);

    setActiveSection("overview");
  };

  // =========================================================
  // SAVE AND CONTINUE
  // =========================================================

  const handleSaveAndContinue = async () => {
    const success = await saveChanges();

    if (!success) return;

    // Go to next section only after successful save
    setActiveSection("diagnosis");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <div className="mt-6">
        {/* ================================================= */}
        {/* Heading */}
        {/* ================================================= */}

        <div>
          <h2 className="text-[34px] font-bold text-[#4D2E23]">
            Chief Complaints
          </h2>

          <p className="mt-1 text-[18px] text-[#6F625A]">
            Add and manage patient chief complaints
          </p>
        </div>

        {/* ================================================= */}
        {/* Search */}
        {/* ================================================= */}

        <div className="relative mt-8">
          <HiOutlineMagnifyingGlass
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5B3428]"
            size={22}
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by complaints"
            className="
              h-16
              w-full
              rounded-[22px]
              border
              border-[#D9C8BE]
              bg-white
              pl-14
              pr-14
              text-lg
              text-[#4D2E23]
              outline-none
              placeholder:text-[#8F8F8F]
            "
          />

          <HiOutlineMicrophone
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5B3428]"
            size={22}
          />

          {/* Search Suggestions */}

          {search.trim() &&
            filteredSymptoms.length > 0 && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-[72px]
                  z-50
                  max-h-72
                  overflow-y-auto
                  rounded-[22px]
                  border
                  border-[#E7DBD3]
                  bg-white
                  shadow-2xl
                "
              >
                {filteredSymptoms.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      toggleSymptom(item);
                      setSearch("");
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      border-b
                      border-[#F3E8E1]
                      px-5
                      py-4
                      text-left
                      text-[17px]
                      font-medium
                      text-[#4D2E23]
                      transition
                      hover:bg-[#FFF3EC]
                      last:border-b-0
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* ================================================= */}
        {/* Selected Complaints */}
        {/* ================================================= */}

        <div className="mt-6 flex flex-wrap gap-3">
          {selectedSymptoms.map((item) => (
            <div
              key={item}
              className="
                flex
                h-12
                items-center
                gap-3
                rounded-xl
                bg-[#FFEAD8]
                px-5
                text-base
                font-medium
                text-[#4D2E23]
              "
            >
              <span>{item}</span>

              <button
                type="button"
                onClick={() =>
                  toggleSymptom(item)
                }
                className="
                  flex
                  items-center
                  justify-center
                  rounded-full
                  hover:bg-[#F7D8C4]
                "
              >
                <HiOutlineXMark size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* ================================================= */}
        {/* Notes */}
        {/* ================================================= */}

        <div className="mt-10">
          <label
            className="
              mb-3
              block
              text-xl
              font-semibold
              text-[#4D2E23]
            "
          >
            Complaints Notes
          </label>

          <textarea
            rows={5}
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Enter Complaints"
            className="
              w-full
              resize-none
              rounded-[22px]
              border
              border-[#D9C8BE]
              p-5
              text-base
              outline-none
              placeholder:text-[#8E8E8E]
              focus:border-[#8B573D]
            "
          />
        </div>

        {/* ================================================= */}
        {/* Bottom Actions */}
        {/* ================================================= */}

        <div
          className="
            mt-10
            flex
            items-center
            justify-between
            gap-6
            rounded-[28px]
            border
            border-[#E7DBD3]
            bg-white
            px-8
            py-6
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
          "
        >
          {/* Back */}

          <button
            type="button"
            onClick={handleBack}
            disabled={isSaving}
            className="
              flex
              h-[72px]
              flex-1
              items-center
              justify-center
              gap-3
              rounded-[24px]
              border
              border-[#E5D3C5]
              bg-[#FFFBF7]
              text-[20px]
              font-semibold
              text-[#4D2E23]
              shadow-[0_2px_5px_rgba(0,0,0,0.05)]
              transition
              hover:bg-[#FFF5ED]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <HiOutlineArrowLeft size={28} />

            <span>Back</span>
          </button>

          {/* Save and Continue */}

          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSaving}
            className="
              flex
              h-[72px]
              flex-1
              items-center
              justify-center
              gap-3
              rounded-[24px]
              bg-[#8B573D]
              text-[20px]
              font-semibold
              text-white
              shadow-[0_4px_10px_rgba(139,87,61,0.18)]
              transition
              hover:bg-[#764733]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <HiOutlineArrowRightOnRectangle
              size={28}
            />

            <span>
              {isSaving
                ? "Saving..."
                : "Save and Continue"}
            </span>
          </button>
        </div>
      </div>

      {/* ===================================================== */}
      {/* UNSAVED CHANGES MODAL */}
      {/* ===================================================== */}

      {showUnsavedModal && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/45
            px-4
            backdrop-blur-[2px]
          "
        >
          {/* Modal */}

          <div
            className="
              w-full
              max-w-[540px]
              rounded-[24px]
              bg-white
              px-8
              pb-8
              pt-9
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            "
          >
            {/* Title */}

            <div className="text-center">
              <h2
                className="
                  text-[22px]
                  font-bold
                  text-[#4D2E23]
                "
              >
                Unsaved Changes
              </h2>

              <p
                className="
                  mx-auto
                  mt-7
                  max-w-[430px]
                  text-[18px]
                  leading-[1.45]
                  text-[#4D2E23]
                "
              >
                You have unsaved changes.
                <br />
                If you go back, your changes will
                not be saved.
              </p>
            </div>

            {/* Modal Buttons */}

            <div className="mt-10 grid grid-cols-2 gap-5">
              {/* Go Back */}

              <button
                type="button"
                onClick={handleDiscardAndGoBack}
                disabled={isSaving}
                className="
                  h-[62px]
                  rounded-[18px]
                  border
                  border-[#E5D3C5]
                  bg-[#FFFBF7]
                  text-[18px]
                  font-semibold
                  text-[#4D2E23]
                  shadow-[0_2px_5px_rgba(0,0,0,0.05)]
                  transition
                  hover:bg-[#FFF3E8]
                  disabled:opacity-50
                "
              >
                Go back
              </button>

              {/* Save Changes */}

              <button
                type="button"
                onClick={handleSaveFromModal}
                disabled={isSaving}
                className="
                  h-[62px]
                  rounded-[18px]
                  bg-[#8B573D]
                  text-[18px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#764733]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChiefComplaints;