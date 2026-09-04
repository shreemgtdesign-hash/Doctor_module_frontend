import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Camera,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadFrontOfficePatientProfile,
  updateFrontOfficePatient,
} from "../../../redux/frontOffice/frontOfficePatientThunk";

import {
  loadPackages,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


// =====================================================
// EDIT PATIENT
// =====================================================

const EditPatient = () => {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const { id } =
    useParams();


  // =====================================================
  // PATIENT REDUX
  // =====================================================

  const {
    selectedPatient = null,
    patientProfileLoading = false,
    patientProfileError = null,
    updatingPatient = false,
    updatePatientError = null,
  } = useSelector(
    (state) =>
      state.frontOfficePatient || {}
  );


  // =====================================================
  // PACKAGE REDUX
  // =====================================================

  const {
    packages = [],
    packagesLoading = false,
  } = useSelector(
    (state) =>
      state.frontOfficeAppointment ||
      {}
  );


  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] =
    useState({

      full_name: "",

      patient_id: "",

      email: "",

      mobile: "",

      dob: "",

      gender: "",

      package_name: "",

      insurance: "",

    });


  // =====================================================
  // LOAD PATIENT
  // =====================================================

  useEffect(() => {

    if (!id) {
      return;
    }

    dispatch(
      loadFrontOfficePatientProfile(
        id
      )
    );

  }, [
    dispatch,
    id,
  ]);


  // =====================================================
  // LOAD PACKAGES
  // =====================================================

  useEffect(() => {

    dispatch(
      loadPackages({})
    );

  }, [dispatch]);


  // =====================================================
  // PROFILE
  // =====================================================

  const profile =
    selectedPatient?.profile ||
    {};


  // =====================================================
  // POPULATE FORM
  // =====================================================

  useEffect(() => {

    if (
      !selectedPatient?.profile
    ) {
      return;
    }

    const patient =
      selectedPatient.profile;


    setForm({

      full_name:
        patient.full_name ||
        patient.name ||
        "",

      patient_id:
        patient.patient_id ||
        patient.patient_code ||
        "",

      email:
        patient.email ||
        "",

      mobile:
        patient.mobile ||
        patient.phone ||
        "",

      dob:
        formatDateForInput(
          patient.dob_raw,
          patient.dob
        ),

      gender:
        patient.gender ||
        "",

      package_name:
        patient.package_name ||
        "",

      insurance:
        patient.insurance ||
        patient.insurance_holder ||
        "No",

    });

  }, [selectedPatient]);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } =
      event.target;


    setForm(
      (previous) => ({
        ...previous,

        [name]:
          value,
      })
    );

  };


  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    if (!id) {
      return;
    }


    const payload = {

      full_name:
        form.full_name.trim(),

      email:
        form.email.trim(),

      mobile:
        form.mobile.trim(),

      dob:
        form.dob,

      gender:
        form.gender,

      package_name:
        form.package_name,

      insurance:
        form.insurance,

    };


    try {

      await dispatch(
        updateFrontOfficePatient({
          patientId: id,
          data: payload,
        })
      ).unwrap();


      navigate(
        `/frontoffice/patients/${id}`
      );

    } catch (error) {

      console.error(
        "Update patient error:",
        error
      );

    }

  };


  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {

    navigate(
      `/frontoffice/patients/${id}`
    );

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <DashboardLayout role="frontoffice">

      <div
        className="
          flex
          min-h-full
          flex-col
          bg-white
        "
      >

        <div
          className="
            flex-1
            px-7
            pb-8
            pt-8
          "
        >

          {/* =================================================
              BACK
          ================================================= */}

          <button
            type="button"
            onClick={
              handleCancel
            }
            className="
              flex
              items-center
              gap-3
              text-[14px]
              font-semibold
              text-[#4D2E23]
            "
          >

            <ArrowLeft
              size={21}
            />

            Go Back

          </button>


          {/* =================================================
              TITLE
          ================================================= */}

          <h1
            className="
              mt-9
              text-[24px]
              font-bold
              text-[#2F2926]
            "
          >
            Personal Information
          </h1>


          {/* =================================================
              LOADING
          ================================================= */}

          {patientProfileLoading && (

            <div
              className="
                flex
                min-h-[400px]
                items-center
                justify-center
                text-[14px]
                text-[#8A817C]
              "
            >
              Loading patient details...
            </div>

          )}


          {/* =================================================
              LOAD ERROR
          ================================================= */}

          {!patientProfileLoading &&
            patientProfileError && (

              <div
                className="
                  mt-8
                  rounded-xl
                  border
                  border-[#E8D9CF]
                  bg-[#FFF8F3]
                  p-5
                  text-center
                  text-[#8A5038]
                "
              >
                {
                  typeof patientProfileError ===
                  "string"
                    ? patientProfileError
                    : patientProfileError?.message ||
                      "Failed to load patient."
                }
              </div>

            )}


          {/* =================================================
              FORM
          ================================================= */}

          {!patientProfileLoading &&
            !patientProfileError &&
            selectedPatient && (

              <div
                className="
                  mt-8
                  grid
                  grid-cols-[160px_1fr]
                  gap-7
                "
              >

                {/* =============================================
                    IMAGE
                ============================================= */}

                <div
                  className="
                    relative
                    mt-1
                    h-[180px]
                    w-[160px]
                    overflow-visible
                    rounded-[28px]
                    bg-[#EAEAEA]
                  "
                >

                  {profile.profile_image && (

                    <img
                      src={
                        profile.profile_image
                      }
                      alt={
                        profile.full_name ||
                        "Patient"
                      }
                      className="
                        h-full
                        w-full
                        rounded-[28px]
                        object-cover
                      "
                    />

                  )}


                  <button
                    type="button"
                    className="
                      absolute
                      -bottom-[2px]
                      -right-[2px]
                      flex
                      h-[40px]
                      w-[40px]
                      items-center
                      justify-center
                      rounded-[10px]
                      bg-[#FFF8F3]
                      text-[#4D2E23]
                    "
                  >
                    <Camera
                      size={19}
                    />
                  </button>

                </div>


                {/* =============================================
                    FIELDS
                ============================================= */}

                <div
                  className="
                    grid
                    grid-cols-3
                    gap-x-5
                    gap-y-9
                  "
                >

                  {/* FULL NAME */}

                  <FieldWrapper
                    label="Full Name"
                  >

                    <input
                      type="text"
                      name="full_name"
                      value={
                        form.full_name
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                    />

                  </FieldWrapper>


                  {/* PATIENT ID */}

                  <FieldWrapper
                    label="Patient ID"
                  >

                    <input
                      type="text"
                      value={
                        form.patient_id
                      }
                      readOnly
                      className={`
                        ${inputClass}
                        cursor-not-allowed
                      `}
                    />

                  </FieldWrapper>


                  {/* EMAIL */}

                  <FieldWrapper
                    label="Email ID"
                  >

                    <input
                      type="email"
                      name="email"
                      value={
                        form.email
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                    />

                  </FieldWrapper>


                  {/* PHONE */}

                  <FieldWrapper
                    label="Phone"
                  >

                    <input
                      type="text"
                      name="mobile"
                      value={
                        form.mobile
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                    />

                  </FieldWrapper>


                  {/* DOB */}

                  <FieldWrapper
                    label="Date of Birth"
                  >

                    <div
                      className="
                        relative
                      "
                    >

                      <input
                        type="date"
                        name="dob"
                        value={
                          form.dob
                        }
                        onChange={
                          handleChange
                        }
                        className={`
                          ${inputClass}
                          pr-12
                        `}
                      />

                    </div>

                  </FieldWrapper>


                  {/* GENDER */}

                  <FieldWrapper
                    label="Gender"
                  >

                    <div
                      className="
                        relative
                      "
                    >

                      <select
                        name="gender"
                        value={
                          form.gender
                        }
                        onChange={
                          handleChange
                        }
                        className={`
                          ${inputClass}
                          appearance-none
                          pr-12
                          cursor-pointer
                        `}
                      >

                        <option value="">
                          Select Gender
                        </option>

                        <option value="Male">
                          Male
                        </option>

                        <option value="Female">
                          Female
                        </option>

                        <option value="Other">
                          Other
                        </option>

                      </select>


                      <ChevronDown
                        size={17}
                        className="
                          pointer-events-none
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-[#4D2E23]
                        "
                      />

                    </div>

                  </FieldWrapper>

                </div>

              </div>

            )}


          {/* =================================================
              PACKAGE + INSURANCE
          ================================================= */}

          {!patientProfileLoading &&
            !patientProfileError &&
            selectedPatient && (

              <div
                className="
                  mt-[80px]
                  grid
                  grid-cols-2
                  gap-8
                "
              >

                {/* PACKAGE */}

                <FieldWrapper
                  label="Package"
                >

                  <div
                    className="
                      relative
                    "
                  >

                    <select
                      name="package_name"
                      value={
                        form.package_name
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        packagesLoading
                      }
                      className={`
                        ${inputClass}
                        appearance-none
                        pr-12
                        cursor-pointer
                      `}
                    >

                      <option value="">
                        {
                          packagesLoading
                            ? "Loading packages..."
                            : "Select Package"
                        }
                      </option>


                      {/* Keep currently selected package visible
                          even if it isn't returned in the list */}

                      {form.package_name &&
                        !packages.some(
                          (item) =>
                            getPackageName(
                              item
                            ) ===
                            form.package_name
                        ) && (

                          <option
                            value={
                              form.package_name
                            }
                          >
                            {
                              form.package_name
                            }
                          </option>

                        )}


                      {packages.map(
                        (item) => {

                          const name =
                            getPackageName(
                              item
                            );

                          if (!name) {
                            return null;
                          }

                          return (

                            <option
                              key={
                                item.id ||
                                item.package_id ||
                                name
                              }
                              value={
                                name
                              }
                            >
                              {name}
                            </option>

                          );

                        }
                      )}

                    </select>


                    <ChevronDown
                      size={17}
                      className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-[#4D2E23]
                      "
                    />

                  </div>

                </FieldWrapper>


                {/* INSURANCE */}

                <FieldWrapper
                  label="Insurance"
                >

                  <div
                    className="
                      relative
                    "
                  >

                    <select
                      name="insurance"
                      value={
                        form.insurance
                      }
                      onChange={
                        handleChange
                      }
                      className={`
                        ${inputClass}
                        appearance-none
                        pr-12
                        cursor-pointer
                      `}
                    >

                      <option value="No">
                        No
                      </option>

                      <option value="Yes">
                        Yes
                      </option>

                    </select>


                    <ChevronDown
                      size={17}
                      className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-[#4D2E23]
                      "
                    />

                  </div>

                </FieldWrapper>

              </div>

            )}


          {/* =================================================
              UPDATE ERROR
          ================================================= */}

          {updatePatientError && (

            <div
              className="
                mt-6
                rounded-xl
                border
                border-[#E8D9CF]
                bg-[#FFF8F3]
                px-5
                py-4
                text-[14px]
                text-[#8A5038]
              "
            >
              {
                typeof updatePatientError ===
                "string"
                  ? updatePatientError
                  : updatePatientError?.message ||
                    "Failed to update patient."
              }
            </div>

          )}

        </div>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        {!patientProfileLoading &&
          !patientProfileError &&
          selectedPatient && (

            <div
              className="
                flex
                justify-end
                gap-5
                border-t
                border-[#EEE5DF]
                bg-white
                px-7
                py-5
              "
            >

              <button
                type="button"
                onClick={
                  handleCancel
                }
                disabled={
                  updatingPatient
                }
                className="
                  h-[52px]
                  w-[290px]
                  rounded-[17px]
                  border
                  border-[#E5D5C8]
                  bg-[#FFF9F5]
                  text-[14px]
                  font-semibold
                  text-[#4D2E23]
                  disabled:opacity-50
                "
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  updatingPatient
                }
                className="
                  h-[52px]
                  w-[290px]
                  rounded-[17px]
                  bg-[#8A5038]
                  text-[14px]
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {
                  updatingPatient
                    ? "Saving..."
                    : "Save Changes"
                }
              </button>

            </div>

          )}

      </div>

    </DashboardLayout>

  );
};


// =====================================================
// FIELD WRAPPER
// =====================================================

const FieldWrapper = ({
  label,
  children,
}) => {

  return (

    <div>

      <label
        className="
          mb-3
          block
          text-[16px]
          font-medium
          text-[#4D2E23]
        "
      >
        {label}
      </label>

      {children}

    </div>

  );

};


// =====================================================
// INPUT STYLE
// =====================================================

const inputClass = `
  h-[62px]
  w-full
  rounded-[15px]
  border
  border-[#E3D6CD]
  bg-white
  px-5
  text-[14px]
  font-medium
  text-[#4D2E23]
  outline-none
  transition
  focus:border-[#9A654B]
`;


// =====================================================
// DOB FORMATTER
// =====================================================

const formatDateForInput = (
  rawDate,
  formattedDate
) => {

  /*
   * Prefer dob_raw:
   *
   * 1984-04-11T18:30:00.000Z
   * ->
   * 1984-04-11
   */

  if (rawDate) {

    return String(
      rawDate
    ).slice(
      0,
      10
    );

  }


  /*
   * Fallback API format:
   *
   * 12/04/1984
   * ->
   * 1984-04-12
   */

  if (
    formattedDate &&
    formattedDate.includes("/")
  ) {

    const [
      day,
      month,
      year,
    ] =
      formattedDate.split("/");


    if (
      day &&
      month &&
      year
    ) {

      return `${year}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(
        2,
        "0"
      )}`;

    }

  }

  return "";

};


// =====================================================
// PACKAGE NAME
// =====================================================

const getPackageName = (
  item
) => {

  if (!item) {
    return "";
  }

  if (
    typeof item ===
    "string"
  ) {
    return item;
  }

  return (
    item.package_name ||
    item.name ||
    item.title ||
    ""
  );

};


export default EditPatient;