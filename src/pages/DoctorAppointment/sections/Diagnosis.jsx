import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  HiOutlinePlus,
  HiOutlineArrowLeft,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

import {
  loadDiagnosis,
  saveDiagnosisThunk,
  loadAssociateDoctors,
  loadDoctorsList,
  addAssociateDoctorThunk,
  deleteAssociateDoctorThunk,
} from "../../../redux/consultation/consultationThunk";

import { searchDiagnosisCategoriesThunk } from "../../../redux/appointment/appointmentThunk";

const Diagnosis = ({
  appointmentId,
  onContinue,
  onBack,
}) => {
  const dispatch = useDispatch();

  // =========================================================
  // Diagnosis state
  // =========================================================

  const [search, setSearch] = useState("");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);
  const [notes, setNotes] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Original values loaded from backend.
  // Used to detect unsaved changes.
  const [initialDiagnosis, setInitialDiagnosis] =
    useState([]);

  const [initialNotes, setInitialNotes] =
    useState("");

  // =========================================================
  // Modal / saving states
  // =========================================================

  const [showUnsavedModal, setShowUnsavedModal] =
    useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    diagnosis: "",
    notes: "",
  });
  // =========================================================
  // Associate doctor state
  // =========================================================

  const [showDoctorModal, setShowDoctorModal] =
    useState(false);

  const [doctorSearch, setDoctorSearch] =
    useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  // =========================================================
  // Redux
  // =========================================================

  const {
    diagnosis,
    diagnosisCategories,
    associateDoctors = [],
    doctorsList = [],
    loading,
  } = useSelector(
    (state) => state.consultation
  );

  // =========================================================
  // Load Diagnosis
  // =========================================================

  useEffect(() => {
    if (!appointmentId) return;

    setSearch("");
    setSelectedDiagnosis([]);
    setNotes("");
    setInitialDiagnosis([]);
    setInitialNotes("");
    setShowDropdown(false);

    dispatch(searchDiagnosisCategoriesThunk());
    dispatch(loadDiagnosis(appointmentId));
    dispatch(loadAssociateDoctors(appointmentId));
    dispatch(loadDoctorsList());
  }, [appointmentId, dispatch]);

  // =========================================================
  // Set diagnosis from backend
  // =========================================================

  useEffect(() => {
    if (!diagnosis) return;

    const diagnosisCategory = diagnosis.category
      ? [diagnosis.category]
      : [];

    const diagnosisNotes =
      diagnosis.diagnosis || "";

    setSelectedDiagnosis(diagnosisCategory);
    setNotes(diagnosisNotes);

    // Store original backend values
    setInitialDiagnosis(diagnosisCategory);
    setInitialNotes(diagnosisNotes);
  }, [diagnosis]);

  // =========================================================
  // Diagnosis search
  // =========================================================

  const filteredDiagnosis =
    (diagnosisCategories || []).filter(
      (item) =>
        item
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        !selectedDiagnosis.includes(item)
    );

  // =========================================================
  // Select diagnosis
  // =========================================================

  const handleSelectDiagnosis = (item) => {
    setSelectedDiagnosis((prev) => [
      ...prev,
      item,
    ]);

    setSearch("");
    setShowDropdown(false);
  };

  // =========================================================
  // Remove diagnosis
  // =========================================================

  const handleRemoveDiagnosis = (item) => {
    setSelectedDiagnosis((prev) =>
      prev.filter((x) => x !== item)
    );
  };

  // =========================================================
  // Check unsaved changes
  // =========================================================

  const hasUnsavedChanges = () => {
    const currentDiagnosis =
      [...selectedDiagnosis].sort();

    const savedDiagnosis =
      [...initialDiagnosis].sort();

    const diagnosisChanged =
      JSON.stringify(currentDiagnosis) !==
      JSON.stringify(savedDiagnosis);

    const notesChanged =
      notes !== initialNotes;

    return (
      diagnosisChanged ||
      notesChanged
    );
  };

  // =========================================================
  // Save Diagnosis
  // =========================================================
  const validateForm = () => {
    const errors = {
      diagnosis: "",
      notes: "",
    };

    // Diagnosis mandatory
    if (selectedDiagnosis.length === 0) {
      errors.diagnosis = "Please select a diagnosis.";
    }

    // Diagnosis notes mandatory
    if (!notes.trim()) {
      errors.notes = "Diagnosis notes are required.";
    }

    setValidationErrors(errors);

    return !errors.diagnosis && !errors.notes;
  };
  const saveChanges = async () => {
    if (!appointmentId) return false;

    try {
      setIsSaving(true);

      const payload = {
        diagnosis: notes,

        // Keeping your existing backend contract:
        // first selected diagnosis is sent as category.
        category:
          selectedDiagnosis[0] || "",
      };

      console.log(
        "Saving Diagnosis:",
        payload
      );

      await dispatch(
        saveDiagnosisThunk({
          appointmentId,
          payload,
        })
      ).unwrap();

      // Update original values only after successful save
      setInitialDiagnosis([
        ...selectedDiagnosis,
      ]);

      setInitialNotes(notes);

      return true;
    } catch (error) {
      console.error(
        "Failed to save diagnosis:",
        error
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // BACK
  // =========================================================

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedModal(true);
      return;
    }

    // No changes
    onBack?.();
  };

  // =========================================================
  // DISCARD CHANGES
  // =========================================================

  const handleDiscardAndGoBack = () => {
    // Restore original values
    setSelectedDiagnosis([
      ...initialDiagnosis,
    ]);

    setNotes(initialNotes);

    setSearch("");
    setShowDropdown(false);

    setShowUnsavedModal(false);

    onBack?.();
  };

  // =========================================================
  // SAVE FROM POPUP
  // =========================================================

  const handleSaveFromModal = async () => {
    const success = await saveChanges();

    if (!success) return;

    setShowUnsavedModal(false);

    onBack?.();
  };

  // =========================================================
  // SAVE AND CONTINUE
  // =========================================================

  const handleSaveAndContinue = async () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const success = await saveChanges();

    if (!success) {
      return;
    }

    onContinue?.();
  };

  // =========================================================
  // Associate Doctors
  // =========================================================

  const enrichedAssociateDoctors =
    associateDoctors.map(
      (associateDoctor) => {
        const doctorDetails =
          doctorsList.find(
            (doctor) =>
              doctor.doctor_id ===
              associateDoctor.doctor_id
          );

        return {
          ...doctorDetails,
          ...associateDoctor,

          doctor_name:
            associateDoctor.doctor_name ||
            doctorDetails?.doctor_name ||
            doctorDetails?.name ||
            "",

          profile_image:
            associateDoctor.profile_image ||
            doctorDetails?.profile_image ||
            "",

          specialization:
            associateDoctor.specialization ||
            doctorDetails?.specialization ||
            "",
        };
      }
    );

  // =========================================================
  // Add Associate Doctor
  // =========================================================

  const handleAddDoctor = async () => {
    if (!selectedDoctor) return;

    try {
      await dispatch(
        addAssociateDoctorThunk({
          appointmentId,

          payload: {
            doctor_id:
              selectedDoctor.doctor_id,

            doctor_name:
              selectedDoctor.name,

            profile_image:
              selectedDoctor.profile_image,

            role_label:
              selectedDoctor.specialization,
          },
        })
      ).unwrap();

      dispatch(
        loadAssociateDoctors(
          appointmentId
        )
      );

      setShowDoctorModal(false);
      setSelectedDoctor(null);
      setDoctorSearch("");
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================================
  // Delete Associate Doctor
  // =========================================================

  const handleDeleteDoctor = async (
    associateDoctorId
  ) => {
    try {
      await dispatch(
        deleteAssociateDoctorThunk(
          associateDoctorId
        )
      ).unwrap();

      dispatch(
        loadAssociateDoctors(
          appointmentId
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <>
      <div className="mt-8">

        {/* ================================================= */}
        {/* Header */}
        {/* ================================================= */}

        <div>
          <h2 className="text-[24px] font-bold text-[#4D2E23]">
            Diagnosis
            <span className="ml-1 text-red-500">*</span>
          </h2>

          <p className="mt-1 text-[18px] text-[#6F625A]">
            Add diagnosis details
          </p>
        </div>

        {/* ================================================= */}
        {/* Diagnosis Search */}
        {/* ================================================= */}

        <div className="relative mt-8">

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Search Diagnosis"
            className="
              h-16
              w-full
              rounded-[22px]
              border
              border-[#DDD0C8]
              bg-white
              px-5
              text-[17px]
              text-[#4D2E23]
              outline-none
              focus:border-[#8B573D]
            "
          />

          {/* Dropdown */}

          {showDropdown &&
            search &&
            filteredDiagnosis.length > 0 && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-[70px]
                  z-50
                  max-h-72
                  overflow-y-auto
                  rounded-2xl
                  border
                  border-[#EFE4DC]
                  bg-white
                  shadow-xl
                "
              >
                {filteredDiagnosis.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        handleSelectDiagnosis(
                          item
                        )
                      }
                      className="
                        block
                        w-full
                        border-b
                        border-[#EFE4DC]
                        px-5
                        py-4
                        text-left
                        hover:bg-[#FFF6F0]
                      "
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            )}
        </div>

        {/* ================================================= */}
        {/* Selected Diagnosis */}
        {/* ================================================= */}

        <div className="mt-5 flex flex-wrap gap-3">

          {selectedDiagnosis.map((item) => (
            <div
              key={item}
              className="
               flex
               items-center
               gap-2
               rounded-xl
              bg-[#FFEAD8]
               px-4
               py-2
               text-[#4D2E23]
             "
            >
              <span>{item}</span>

              <button
                type="button"
                onClick={() => {
                  handleRemoveDiagnosis(item);

                  setValidationErrors((prev) => ({
                    ...prev,
                    diagnosis: "",
                  }));
                }}
                className="
          rounded-full
          px-1
          hover:bg-[#F7D8C4]
        "
              >
                ✕
              </button>
            </div>
          ))}

        </div>

        {validationErrors.diagnosis && (
          <p className="text-sm font-medium text-red-500">
            {validationErrors.diagnosis}
          </p>
        )}

        {/* ================================================= */}
        {/* Diagnosis Notes */}
        {/* ================================================= */}

        <div className="mt-8">

          <label
            className="
              mb-3
              block
              text-[20px]
              font-semibold
              text-[#4D2E23]
            "
          >
            Diagnosis Notes
            <span className="ml-1 text-red-500">*</span>
          </label>

          <textarea
            rows={6}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);

              if (e.target.value.trim()) {
                setValidationErrors((prev) => ({
                  ...prev,
                  notes: "",
                }));
              }
            }}
            placeholder="Enter diagnosis notes..."
            className={`
    w-full
    resize-none
    rounded-[22px]
    border
    bg-white
    p-5
    text-[16px]
    text-[#4D2E23]
    outline-none
    placeholder:text-[#8B7A70]

    ${validationErrors.notes
                ? "border-red-500 focus:border-red-500"
                : "border-[#DDD0C8] focus:border-[#8B573D]"
              }
  `}
          />

          {validationErrors.notes && (
            <p className="mt-2 text-sm font-medium text-red-500">
              {validationErrors.notes}
            </p>
          )}

        </div>

        {/* ================================================= */}
        {/* Associate Doctors */}
        {/* ================================================= */}

        <hr className="my-8 border-[#EFE4DC]" />

        <div>

          <div className="mb-6 flex items-center justify-between">

            <h3
              className="
                text-[30px]
                font-semibold
                text-[#4D2E23]
              "
            >
              Associate Doctor
            </h3>

            <button
              type="button"
              onClick={() =>
                setShowDoctorModal(true)
              }
              className="
                flex
                items-center
                gap-2
                text-[#8B573D]
                hover:text-[#6F4632]
              "
            >
              <HiOutlinePlus size={18} />

              Add
            </button>

          </div>

          {/* Doctors */}

          <div className="grid grid-cols-3 gap-8">

            {enrichedAssociateDoctors.length >
              0 ? (
              enrichedAssociateDoctors.map(
                (doctor) => (
                  <div
                    key={doctor.id}
                    className="
                      relative
                      rounded-2xl
                      border
                      border-[#EFE4DC]
                      bg-white
                      p-6
                      text-center
                    "
                  >

                    {/* Profile */}

                    <div
                      className="
                        mx-auto
                        h-16
                        w-16
                        overflow-hidden
                        rounded-full
                        bg-[#F7EEE8]
                      "
                    >

                      {doctor.profile_image ? (
                        <img
                          src={
                            doctor.profile_image
                          }
                          alt={
                            doctor.doctor_name ||
                            "Doctor"
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            text-2xl
                            font-bold
                            text-[#8B573D]
                          "
                        >
                          {(
                            doctor.doctor_name ||
                            "D"
                          ).charAt(0)}
                        </div>
                      )}

                    </div>

                    {/* Name */}

                    <h4
                      className="
                        mt-4
                        text-lg
                        font-semibold
                        text-[#4D2E23]
                      "
                    >
                      {doctor.doctor_name}
                    </h4>

                    {/* Role */}

                    <p
                      className="
                        mt-1
                        text-sm
                        text-[#8B7A70]
                      "
                    >
                      {doctor.role_label ||
                        doctor.specialization ||
                        "Associate Doctor"}
                    </p>

                    {/* Remove */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteDoctor(
                          doctor.id
                        )
                      }
                      className="
                        mt-5
                        rounded-xl
                        bg-red-50
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-red-600
                        hover:bg-red-100
                      "
                    >
                      Remove
                    </button>

                  </div>
                )
              )
            ) : (
              <p
                className="
                  col-span-3
                  text-center
                  text-[#8B7A70]
                "
              >
                No associate doctors added.
              </p>
            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* Bottom Navigation */}
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

            Back
          </button>

          {/* Save and Continue */}

          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSaving || loading}
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

            {isSaving
              ? "Saving..."
              : "Save and Continue"}

          </button>

        </div>

      </div>

      {/* =================================================== */}
      {/* UNSAVED CHANGES MODAL */}
      {/* =================================================== */}

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
                If you go back, your changes
                will not be saved.
              </p>

            </div>

            {/* Buttons */}

            <div className="mt-10 grid grid-cols-2 gap-5">

              {/* Go Back */}

              <button
                type="button"
                onClick={
                  handleDiscardAndGoBack
                }
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
                onClick={
                  handleSaveFromModal
                }
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

      {/* =================================================== */}
      {/* ASSOCIATE DOCTOR MODAL */}
      {/* =================================================== */}

      {showDoctorModal && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-[760px]
              rounded-[30px]
              bg-white
              p-8
              shadow-2xl
            "
          >

            {/* Header */}

            <h2
              className="
                text-[28px]
                font-bold
                text-[#4D2E23]
              "
            >
              Associate Doctors
            </h2>

            <p className="mt-2 text-[#8B7A70]">
              Select a doctor
            </p>

            {/* Doctor Search */}

            <input
              value={doctorSearch}
              onChange={(e) =>
                setDoctorSearch(
                  e.target.value
                )
              }
              placeholder="Search doctor..."
              className="
                mt-6
                h-12
                w-full
                rounded-xl
                border
                border-[#E8DDD5]
                px-4
                outline-none
                focus:border-[#8B573D]
              "
            />

            {/* Doctors List */}

            <div
              className="
                mt-6
                max-h-[420px]
                overflow-y-auto
                pr-2
              "
            >

              <div className="grid grid-cols-2 gap-4">

                {doctorsList
                  .filter((doctor) =>
                    doctor.name
                      ?.toLowerCase()
                      .includes(
                        doctorSearch.toLowerCase()
                      )
                  )
                  .map((doctor) => (

                    <button
                      key={
                        doctor.doctor_id
                      }
                      type="button"
                      onClick={() =>
                        setSelectedDoctor(
                          doctor
                        )
                      }
                      className={`
                        rounded-2xl
                        border
                        p-5
                        text-left
                        transition-all
                        duration-200

                        ${selectedDoctor?.doctor_id ===
                          doctor.doctor_id
                          ? "border-[#8B573D] bg-[#FFF5EF] shadow-md"
                          : "border-[#E8DDD5] hover:border-[#8B573D] hover:bg-[#FFF9F5]"
                        }
                      `}
                    >

                      <div className="flex items-center gap-4">

                        {/* Image */}

                        <div
                          className="
                            h-14
                            w-14
                            shrink-0
                            overflow-hidden
                            rounded-full
                            bg-[#F8EEE7]
                          "
                        >

                          {doctor.profile_image ? (
                            <img
                              src={
                                doctor.profile_image
                              }
                              alt={
                                doctor.name ||
                                "Doctor"
                              }
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                                text-xl
                                font-bold
                                text-[#8B573D]
                              "
                            >
                              {doctor.name?.charAt(
                                0
                              )}
                            </div>
                          )}

                        </div>

                        {/* Details */}

                        <div className="min-w-0">

                          <h3
                            className="
                              truncate
                              text-[17px]
                              font-semibold
                              text-[#4D2E23]
                            "
                          >
                            {doctor.name}
                          </h3>

                          <p
                            className="
                              mt-1
                              text-sm
                              text-[#8B7A70]
                            "
                          >
                            {
                              doctor.specialization
                            }
                          </p>

                        </div>

                      </div>

                    </button>

                  ))}

              </div>

            </div>

            {/* Footer */}

            <div
              className="
                mt-8
                flex
                justify-end
                gap-4
                border-t
                border-[#EFE4DC]
                pt-6
              "
            >

              <button
                type="button"
                onClick={() => {
                  setShowDoctorModal(false);
                  setSelectedDoctor(null);
                  setDoctorSearch("");
                }}
                className="
                  rounded-xl
                  border
                  border-[#DDD]
                  px-7
                  py-3
                  font-medium
                  transition
                  hover:bg-gray-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddDoctor}
                disabled={!selectedDoctor}
                className="
                  rounded-xl
                  bg-[#8B573D]
                  px-8
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-[#74442F]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Add Doctor
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Diagnosis;