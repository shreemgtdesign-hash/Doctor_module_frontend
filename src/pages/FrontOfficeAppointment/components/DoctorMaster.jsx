import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  HiOutlinePlus,
  HiOutlineArrowUpTray,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineNoSymbol,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";

import {
  loadFrontOfficeDoctors,
  createFrontOfficeDoctor,
  updateFrontOfficeDoctor,
  toggleFrontOfficeDoctorStatus,
  deleteFrontOfficeDoctor,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";


const emptyDoctor = {
  name: "",
  specialization: "",
  qualification: "",
  registration_no: "",
  languages: "",
  consultation_fee: "",
  bio: "",
};


const DoctorMaster = () => {

  const dispatch = useDispatch();


  // ==========================================
  // REDUX
  // ==========================================

  const {
    doctors = [],
    loadingDoctors = false,
    creatingDoctor = false,
    updatingDoctor = false,
    togglingDoctor = false,
    deletingDoctor = false,
    error = null,
    message = "",
  } = useSelector(
    (state) =>
      state.frontOfficeAppointment || {}
  );
  const navigate = useNavigate();


  // ==========================================
  // LOCAL STATE
  // ==========================================

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    editingDoctor,
    setEditingDoctor,
  ] = useState(null);

  const [
    selectedDoctor,
    setSelectedDoctor,
  ] = useState(null);

  const [
    openMenuId,
    setOpenMenuId,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    form,
    setForm,
  ] = useState(emptyDoctor);


  // ==========================================
  // LOAD DOCTORS
  // ==========================================

  useEffect(() => {

    dispatch(
      loadFrontOfficeDoctors()
    );

  }, [dispatch]);


  // ==========================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {

    const handleClick = () => {
      setOpenMenuId(null);
    };

    document.addEventListener(
      "click",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClick
      );
    };

  }, []);


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredDoctors =
    doctors.filter(
      (doctor) => {

        const value =
          search
            .trim()
            .toLowerCase();

        if (!value) {
          return true;
        }

        const languagesStr =
          Array.isArray(doctor.languages)
            ? doctor.languages.join(" ")
            : typeof doctor.languages === "string"
            ? doctor.languages
            : "";

        return (
          doctor.name
            ?.toLowerCase()
            .includes(value) ||

          doctor.specialization
            ?.toLowerCase()
            .includes(value) ||

          doctor.qualification
            ?.toLowerCase()
            .includes(value) ||

          languagesStr
            ?.toLowerCase()
            .includes(value) ||

          doctor.contact?.phone
            ?.toLowerCase()
            .includes(value) ||

          doctor.contact?.email
            ?.toLowerCase()
            .includes(value)
        );

      }
    );


  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );

  };


  // ==========================================
  // OPEN ADD
  // ==========================================

  const handleAddDoctor = () => {

    setEditingDoctor(null);

    setForm(
      emptyDoctor
    );

    setShowModal(true);

  };


  // ==========================================
  // OPEN EDIT
  // ==========================================

  const handleEditDoctor = (
    doctor
  ) => {

    setEditingDoctor(
      doctor
    );

    const languagesVal =
      Array.isArray(doctor.languages)
        ? doctor.languages.join(", ")
        : typeof doctor.languages === "string"
        ? doctor.languages
        : "";

    setForm({

      name:
        doctor.name || "",

      specialization:
        doctor.specialization || "",

      qualification:
        doctor.qualification || "",

      registration_no:
        doctor.registration_no || "",

      languages:
        languagesVal,

      consultation_fee:
        doctor.consultation_fee !== undefined && doctor.consultation_fee !== null
          ? doctor.consultation_fee
          : doctor.fee_in_person !== undefined && doctor.fee_in_person !== null
          ? doctor.fee_in_person
          : "",

      bio:
        doctor.bio || doctor.about || "",

    });

    setOpenMenuId(
      null
    );

    setShowModal(true);

  };


  // ==========================================
  // SUBMIT DOCTOR
  // ==========================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    if (editingDoctor) {

      const doctorId =
        editingDoctor.id ||
        editingDoctor._id ||
        editingDoctor.doctor_id;

      // Matches PUT /frontoffice/doctors/:id
      const payload = {

        name:
          form.name?.trim() || editingDoctor.name,

        doctor_code:
          editingDoctor.doctor_code || editingDoctor.code,

        email:
          editingDoctor.email || editingDoctor.contact?.email,

        phone:
          editingDoctor.phone || editingDoctor.contact?.phone,

        dob:
          editingDoctor.dob,

        gender:
          editingDoctor.gender,

        qualification:
          form.qualification?.trim() || editingDoctor.qualification,

        specialization:
          form.specialization?.trim() || editingDoctor.specialization,

        experience_years:
          editingDoctor.experience_years !== undefined
            ? Number(editingDoctor.experience_years)
            : editingDoctor.experience
            ? parseInt(editingDoctor.experience) || 0
            : undefined,

        registration_no:
          form.registration_no?.trim() || editingDoctor.registration_no,

        department:
          editingDoctor.department,

        employment_type:
          editingDoctor.employment_type,

        languages:
          form.languages?.trim() || "",

        about:
          form.bio?.trim() ||
          editingDoctor.about ||
          editingDoctor.bio ||
          "",

        fee_in_person:
          editingDoctor.fee_in_person !== undefined
            ? Number(editingDoctor.fee_in_person)
            : form.consultation_fee
            ? Number(form.consultation_fee)
            : undefined,

        fee_video_call:
          editingDoctor.fee_video_call !== undefined
            ? Number(editingDoctor.fee_video_call)
            : undefined,

        fee_home_visit:
          editingDoctor.fee_home_visit !== undefined
            ? Number(editingDoctor.fee_home_visit)
            : undefined,

        shift_timings:
          editingDoctor.shift_timings,

        working_days:
          editingDoctor.working_days,

        consultation_fee:
          form.consultation_fee
            ? Number(form.consultation_fee)
            : editingDoctor.consultation_fee !== undefined
            ? Number(editingDoctor.consultation_fee)
            : undefined,

      };

      // Remove undefined properties for clean JSON payload
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      const result =
        await dispatch(
          updateFrontOfficeDoctor({
            doctorId,
            data: payload,
          })
        );

      if (
        !result.error
      ) {

        setShowModal(
          false
        );

        setEditingDoctor(
          null
        );

        setForm(
          emptyDoctor
        );

        dispatch(
          loadFrontOfficeDoctors()
        );

      }

    } else {

      // Matches POST /frontoffice/doctors
      const payload = {

        name:
          form.name?.trim(),

        specialization:
          form.specialization?.trim(),

        qualification:
          form.qualification?.trim(),

        registration_no:
          form.registration_no?.trim(),

        languages:
          form.languages?.trim() || "",

        consultation_fee:
          form.consultation_fee
            ? Number(
                form.consultation_fee
              )
            : 0,

        bio:
          form.bio?.trim() || "",

      };

      const result =
        await dispatch(
          createFrontOfficeDoctor(
            payload
          )
        );

      if (
        !result.error
      ) {

        setShowModal(
          false
        );

        setForm(
          emptyDoctor
        );

        dispatch(
          loadFrontOfficeDoctors()
        );

      }

    }

  };


  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  const handleToggleStatus = async (
    doctor
  ) => {

    setOpenMenuId(
      null
    );

    await dispatch(
      toggleFrontOfficeDoctorStatus(
        doctor.id
      )
    );

    dispatch(
      loadFrontOfficeDoctors()
    );

  };


  // ==========================================
  // DELETE DOCTOR
  // ==========================================

  const handleDeleteDoctor = async (
    doctor
  ) => {

    setOpenMenuId(
      null
    );

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${doctor.name}?`
      );

    if (!confirmed) {
      return;
    }

    await dispatch(
      deleteFrontOfficeDoctor(
        doctor.id
      )
    );

    dispatch(
      loadFrontOfficeDoctors()
    );

  };



  const handleViewProfile = (
    doctor
  ) => {

    setOpenMenuId(
      null
    );

    setSelectedDoctor(
      doctor
    );

  };


  // ==========================================
  // LOADING STATE
  // ==========================================

  const isSaving =
    creatingDoctor ||
    updatingDoctor;


  return (

    <DashboardLayout
      role="frontoffice"
    >
     
      <div
        className="
          min-h-screen
          bg-[#FDFBF9]
          dark:bg-[#1A1412]
          px-6
          py-6
        "
      >
        

        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="flex items-center justify-between">
          <div
            className="
              mb-5
              flex
              items-start
              justify-between
            "
          >
            <div className="flex items-start gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/frontoffice/dashboard")
                }
                className="
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E7DBD3]
                  dark:border-[#382D25]
                  bg-white
                  dark:bg-[#251E1A]
                  text-[#4B2E2A]
                  dark:text-[#EDE3DA]
                  transition
                  hover:bg-[#F9F5F1]
                  dark:hover:bg-[#2E241F]
                "
              >
                <HiOutlineArrowLeft
                  size={17}
                />
              </button>

              <div>

                <h1
                  className="
                    text-[24px]
                    font-semibold
                    text-[#292929]
                    dark:text-[#EDE3DA]
                  "
                >
                  Doctor Master
                </h1>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-2
                    text-[14px]
                    text-[#4D2E23]
                    dark:text-[#C5B4A8]
                  "
                >
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-[#4D2E23]
                      dark:bg-[#C5B4A8]
                    "
                  />

                  {doctors.length} Doctors
                </div>

              </div>

            </div>

          </div>


          {/* HEADER BUTTONS */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <button
              type="button"
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                border
                border-[#E7D8CC]
                dark:border-[#382D25]
                bg-white
                dark:bg-[#251E1A]
                px-7
                text-[14px]
                font-semibold
                text-[#4D2E23]
                dark:text-[#EDE3DA]
                transition
                hover:bg-[#FFF8F3]
                dark:hover:bg-[#2E241F]
              "
            >

              <HiOutlineArrowUpTray
                size={18}
              />

              Import Doctor

            </button>


            <button
              type="button"
              onClick={
                handleAddDoctor
              }
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                bg-[#8A5035]
                px-7
                text-[14px]
                font-semibold
                text-white
                transition
                hover:bg-[#70402B]
              "
            >

              <HiOutlinePlus
                size={19}
              />

              Add Doctor

            </button>

          </div>

        </div>

        {/* ==========================================
            SEARCH
        ========================================== */}

        <div
          className="
            mb-4
            flex
            justify-end
          "
        >

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search doctor..."
            className="
              h-10
              w-[280px]
              rounded-xl
              border
              border-[#E7D8CC]
              dark:border-[#382D25]
              bg-white
              dark:bg-[#251E1A]
              px-4
              text-sm
              text-[#4D2E23]
              dark:text-[#EDE3DA]
              outline-none
              focus:border-[#8A5035]
              placeholder:text-[#8B7A70]/60
            "
          />

        </div>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

          <div
            className="
              mb-4
              rounded-xl
              border
              border-red-200
              dark:border-red-900/50
              bg-red-50
              dark:bg-red-950/20
              px-4
              py-3
              text-sm
              text-red-600
              dark:text-red-400
            "
          >

            {typeof error === "string"
              ? error
              : error?.message ||
                "Failed to load doctors."}

          </div>

        )}


        {/* ==========================================
            TABLE
        ========================================== */}

        <div
          className="
            overflow-visible
            rounded-2xl
            border
            border-[#E8D9CD]
            dark:border-[#382D25]
            bg-white
            dark:bg-[#241E1B]
          "
        >

          {/* TABLE HEADER */}

          <div
            className="
              grid
              grid-cols-[2.2fr_1.4fr_1fr_1.55fr_2fr_68px]
              border-b
              border-[#E8D9CD]
              dark:border-[#382D25]
              bg-[#FFF9F4]
              dark:bg-[#2D231E]
            "
          >

            {[
              "Doctor Details",
              "Specialization",
              "Experience",
              "Consultation Type",
              "Contact",
              "Actions",
            ].map(
              (heading) => (

                <div
                  key={heading}
                  className="
                    border-r
                    border-[#E8D9CD]
                    dark:border-[#382D25]
                    px-4
                    py-4
                    text-[13px]
                    font-medium
                    text-[#4D2E23]
                    dark:text-[#EDE3DA]
                    last:border-r-0
                  "
                >
                  {heading}
                </div>

              )
            )}

          </div>


          {/* LOADING */}

          {loadingDoctors ? (

            <div
              className="
                px-6
                py-16
                text-center
                text-[14px]
                text-[#8B7A70]
                dark:text-[#A8988E]
              "
            >
              Loading doctors...
            </div>

          ) : filteredDoctors.length ===
            0 ? (

            <div
              className="
                px-6
                py-16
                text-center
                text-[14px]
                text-[#8B7A70]
                dark:text-[#A8988E]
              "
            >
              No doctors found.
            </div>

          ) : (

            filteredDoctors.map(
              (doctor) => (

                <div
                  key={
                    doctor.id
                  }
                  className="
                    relative
                    grid
                    min-h-[86px]
                    grid-cols-[2.2fr_1.4fr_1fr_1.55fr_2fr_68px]
                    border-b
                    border-[#EFE4DC]
                    dark:border-[#382D25]
                    hover:bg-[#FFFDFB]
                    dark:hover:bg-[#2A221E]
                    transition
                    last:border-b-0
                  "
                >

                  {/* =================================
                      DOCTOR DETAILS
                  ================================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      border-r
                      border-[#EFE4DC]
                      dark:border-[#382D25]
                      px-4
                      py-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F0EBE7]
                        dark:bg-[#382D25]
                        text-[14px]
                        font-semibold
                        text-[#8A5035]
                        dark:text-[#D5A794]
                      "
                    >

                      {doctor.name
                        ?.charAt(
                          0
                        )
                        ?.toUpperCase() ||
                        "D"}

                    </div>


                    <div
                      className="
                        min-w-0
                      "
                    >

                      <p
                        className="
                          truncate
                          text-[14px]
                          font-semibold
                          text-[#4D2E23]
                          dark:text-[#EDE3DA]
                        "
                      >
                        {doctor.name ||
                          "N/A"}
                      </p>


                      <p
                        className="
                          mt-1
                          truncate
                          text-[12px]
                          text-[#8B7A70]
                          dark:text-[#A8988E]
                        "
                      >
                        {doctor.qualification ||
                          "Qualification not available"}
                        {doctor.languages
                          ? ` • ${
                              Array.isArray(doctor.languages)
                                ? doctor.languages.join(", ")
                                : doctor.languages
                            }`
                          : ""}
                      </p>

                    </div>

                  </div>


                  {/* =================================
                      SPECIALIZATION
                  ================================= */}

                  <div
                    className="
                      flex
                      items-center
                      border-r
                      border-[#EFE4DC]
                      dark:border-[#382D25]
                      px-4
                      py-3
                    "
                  >

                    <span
                      className="
                        text-[14px]
                        font-semibold
                        text-[#4D2E23]
                        dark:text-[#EDE3DA]
                      "
                    >
                      {doctor.specialization ||
                        "N/A"}
                    </span>

                  </div>


                  {/* =================================
                      EXPERIENCE
                  ================================= */}

                  <div
                    className="
                      flex
                      items-center
                      border-r
                      border-[#EFE4DC]
                      dark:border-[#382D25]
                      px-4
                      py-3
                    "
                  >

                    <span
                      className="
                        text-[14px]
                        font-semibold
                        text-[#4D2E23]
                        dark:text-[#EDE3DA]
                      "
                    >
                      {doctor.experience ||
                        (doctor.experience_years ? `${doctor.experience_years} yrs` : "N/A")}
                    </span>

                  </div>


                  {/* =================================
                      CONSULTATION TYPE
                  ================================= */}

                  <div
                    className="
                      flex
                      items-center
                      border-r
                      border-[#EFE4DC]
                      dark:border-[#382D25]
                      px-4
                      py-3
                    "
                  >

                    <span
                      className="
                        text-[14px]
                        font-semibold
                        leading-5
                        text-[#4D2E23]
                        dark:text-[#EDE3DA]
                      "
                    >
                      {doctor.consultation_type ||
                        "N/A"}
                    </span>

                  </div>


                  {/* =================================
                      CONTACT
                  ================================= */}

                  <div
                    className="
                      flex
                      min-w-0
                      flex-col
                      justify-center
                      border-r
                      border-[#EFE4DC]
                      dark:border-[#382D25]
                      px-4
                      py-3
                    "
                  >

                    <span
                      className="
                        truncate
                        text-[14px]
                        font-semibold
                        text-[#4D2E23]
                        dark:text-[#EDE3DA]
                      "
                    >
                      {doctor.contact?.phone ||
                        doctor.phone ||
                        "N/A"}
                    </span>


                    <span
                      className="
                        mt-1
                        truncate
                        text-[12px]
                        text-[#8B7A70]
                        dark:text-[#A8988E]
                      "
                    >
                      {doctor.contact?.email ||
                        doctor.email ||
                        "N/A"}
                    </span>

                  </div>


                  {/* =================================
                      ACTIONS
                  ================================= */}

                  <div
                    className="
                      relative
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <button
                      type="button"
                      onClick={(
                        e
                      ) => {

                        e.stopPropagation();

                        setOpenMenuId(
                          openMenuId ===
                            doctor.id
                            ? null
                            : doctor.id
                        );

                      }}
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        text-[22px]
                        font-bold
                        text-[#4D2E23]
                        dark:text-[#EDE3DA]
                        hover:bg-[#FFF4EC]
                        dark:hover:bg-[#342923]
                        transition
                      "
                    >
                      ⋮
                    </button>


                    {/* ACTION MENU */}

                    {openMenuId ===
                      doctor.id && (

                      <div
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className="
                          absolute
                          right-3
                          top-[52px]
                          z-50
                          w-[230px]
                          overflow-hidden
                          rounded-2xl
                          border
                          border-[#E7D8CC]
                          dark:border-[#3D322B]
                          bg-white
                          dark:bg-[#261E1A]
                          shadow-lg
                        "
                      >

                        {/* VIEW PROFILE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleViewProfile(
                              doctor
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            px-5
                            py-4
                            text-left
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                            dark:text-[#EDE3DA]
                            hover:bg-[#FFF8F3]
                            dark:hover:bg-[#342923]
                            transition
                          "
                        >

                          <HiOutlineEye
                            size={20}
                          />

                          View Profile

                        </button>


                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            handleEditDoctor(
                              doctor
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            px-5
                            py-4
                            text-left
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                            dark:text-[#EDE3DA]
                            hover:bg-[#FFF8F3]
                            dark:hover:bg-[#342923]
                            transition
                          "
                        >

                          <HiOutlinePencilSquare
                            size={20}
                          />

                          Edit Doctor Details

                        </button>


                        {/* STATUS */}

                        <button
                          type="button"
                          disabled={
                            togglingDoctor
                          }
                          onClick={() =>
                            handleToggleStatus(
                              doctor
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            px-5
                            py-4
                            text-left
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                            dark:text-[#EDE3DA]
                            hover:bg-[#FFF8F3]
                            dark:hover:bg-[#342923]
                            transition
                            disabled:opacity-50
                          "
                        >

                          <HiOutlineNoSymbol
                            size={20}
                          />

                          {doctor.is_active
                            ? "Deactivate"
                            : "Activate"}

                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          disabled={
                            deletingDoctor
                          }
                          onClick={() =>
                            handleDeleteDoctor(
                              doctor
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            px-5
                            py-4
                            text-left
                            text-[14px]
                            font-semibold
                            text-red-600
                            dark:text-red-400
                            hover:bg-red-50
                            dark:hover:bg-red-950/30
                            transition
                            disabled:opacity-50
                          "
                        >

                          <HiOutlineTrash
                            size={20}
                          />

                          Delete Doctor

                        </button>

                      </div>

                    )}

                  </div>

                </div>

              )
            )

          )}

        </div>


        {/* ==========================================
            PROFILE MODAL
        ========================================== */}

        {selectedDoctor && (

          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/30
              px-4
            "
            onClick={() =>
              setSelectedDoctor(
                null
              )
            }
          >

            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                w-full
                max-w-[540px]
                rounded-2xl
                bg-white
                dark:bg-[#241E1B]
                border
                border-transparent
                dark:border-[#382D25]
                p-6
                shadow-xl
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <h2
                  className="
                    text-[20px]
                    font-bold
                    text-[#4D2E23]
                    dark:text-[#EDE3DA]
                  "
                >
                  Doctor Profile
                </h2>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedDoctor(
                      null
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    text-[#4D2E23]
                    dark:text-[#EDE3DA]
                    hover:bg-[#FFF4F0]
                    dark:hover:bg-[#342923]
                  "
                >

                  <HiOutlineXMark
                    size={22}
                  />

                </button>

              </div>


              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F0EBE7]
                    dark:bg-[#382D25]
                    text-xl
                    font-semibold
                    text-[#8A5035]
                    dark:text-[#D5A794]
                  "
                >

                  {selectedDoctor.name
                    ?.charAt(
                      0
                    )
                    ?.toUpperCase() ||
                    "D"}

                </div>


                <div>

                  <h3
                    className="
                      text-[17px]
                      font-bold
                      text-[#4D2E23]
                      dark:text-[#EDE3DA]
                    "
                  >
                    {selectedDoctor.name}
                  </h3>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-[#8B7A70]
                      dark:text-[#A8988E]
                    "
                  >
                    {selectedDoctor.specialization}
                  </p>

                </div>

              </div>


              <div
                className="
                  mt-6
                  grid
                  grid-cols-2
                  gap-4
                "
              >

                <div>
                  <p className="text-xs text-[#8B7A70] dark:text-[#A8988E]">
                    Qualification
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA]">
                    {selectedDoctor.qualification ||
                      "N/A"}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-[#8B7A70] dark:text-[#A8988E]">
                    Experience
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA]">
                    {selectedDoctor.experience ||
                      (selectedDoctor.experience_years ? `${selectedDoctor.experience_years} years` : "N/A")}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-[#8B7A70] dark:text-[#A8988E]">
                    Languages
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA]">
                    {Array.isArray(selectedDoctor.languages)
                      ? selectedDoctor.languages.join(", ")
                      : selectedDoctor.languages || "N/A"}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-[#8B7A70] dark:text-[#A8988E]">
                    Registration No
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA]">
                    {selectedDoctor.registration_no || "N/A"}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-[#8B7A70] dark:text-[#A8988E]">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA]">
                    {selectedDoctor.contact?.phone ||
                      selectedDoctor.phone ||
                      "N/A"}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-[#8B7A70] dark:text-[#A8988E]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-[#4D2E23] dark:text-[#EDE3DA]">
                    {selectedDoctor.contact?.email ||
                      selectedDoctor.email ||
                      "N/A"}
                  </p>
                </div>


                {(selectedDoctor.bio || selectedDoctor.about) && (
                  <div className="col-span-2">
                    <p className="text-xs text-[#8B7A70] dark:text-[#A8988E]">
                      Doctor Bio / About
                    </p>

                    <p className="mt-1 text-sm text-[#4D2E23] dark:text-[#EDE3DA]">
                      {selectedDoctor.bio || selectedDoctor.about}
                    </p>
                  </div>
                )}

              </div>


              <div
                className="
                  mt-6
                  flex
                  justify-end
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setSelectedDoctor(
                      null
                    )
                  }
                  className="
                    rounded-xl
                    bg-[#8A5035]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-[#70402B]
                    transition
                  "
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}


        {/* ==========================================
            ADD / EDIT MODAL
        ========================================== */}

        {showModal && (

          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/30
              px-4
            "
            onClick={() =>
              setShowModal(
                false
              )
            }
          >

            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                max-h-[90vh]
                w-full
                max-w-[650px]
                overflow-y-auto
                rounded-2xl
                bg-white
                dark:bg-[#241E1B]
                border
                border-transparent
                dark:border-[#382D25]
                p-6
                shadow-xl
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <h2
                  className="
                    text-[20px]
                    font-bold
                    text-[#4D2E23]
                    dark:text-[#EDE3DA]
                  "
                >
                  {editingDoctor
                    ? "Edit Doctor"
                    : "Add Doctor"}
                </h2>


                <button
                  type="button"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    text-[#4D2E23]
                    dark:text-[#EDE3DA]
                    hover:bg-[#FFF4F0]
                    dark:hover:bg-[#342923]
                  "
                >

                  <HiOutlineXMark
                    size={22}
                  />

                </button>

              </div>


              <form
                onSubmit={
                  handleSubmit
                }
                className="
                  mt-6
                  grid
                  grid-cols-2
                  gap-4
                "
              >

                {/* NAME */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#4D2E23]
                      dark:text-[#D5C2B6]
                    "
                  >
                    Doctor Name
                  </label>

                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="e.g. Dr. Rajkumar V"
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      bg-white
                      px-4
                      text-sm
                      text-[#4D2E23]
                      outline-none
                      transition
                      focus:border-[#8A5035]
                      dark:border-[#3D322B]
                      dark:bg-[#1A1412]
                      dark:text-[#EDE3DA]
                    "
                  />

                </div>


                {/* SPECIALIZATION */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#4D2E23]
                      dark:text-[#D5C2B6]
                    "
                  >
                    Specialization
                  </label>

                  <input
                    name="specialization"
                    value={
                      form.specialization
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="e.g. Kayachikitsa & General Medicine"
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      bg-white
                      px-4
                      text-sm
                      text-[#4D2E23]
                      outline-none
                      transition
                      focus:border-[#8A5035]
                      dark:border-[#3D322B]
                      dark:bg-[#1A1412]
                      dark:text-[#EDE3DA]
                    "
                  />

                </div>


                {/* QUALIFICATION */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#4D2E23]
                      dark:text-[#D5C2B6]
                    "
                  >
                    Qualification
                  </label>

                  <input
                    name="qualification"
                    value={
                      form.qualification
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="e.g. BAMS, MD"
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      bg-white
                      px-4
                      text-sm
                      text-[#4D2E23]
                      outline-none
                      transition
                      focus:border-[#8A5035]
                      dark:border-[#3D322B]
                      dark:bg-[#1A1412]
                      dark:text-[#EDE3DA]
                    "
                  />

                </div>


                {/* REGISTRATION */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#4D2E23]
                      dark:text-[#D5C2B6]
                    "
                  >
                    Registration Number
                  </label>

                  <input
                    name="registration_no"
                    value={
                      form.registration_no
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. AYU-2026-8941"
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      bg-white
                      px-4
                      text-sm
                      text-[#4D2E23]
                      outline-none
                      transition
                      focus:border-[#8A5035]
                      dark:border-[#3D322B]
                      dark:bg-[#1A1412]
                      dark:text-[#EDE3DA]
                    "
                  />

                </div>


                {/* LANGUAGES */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#4D2E23]
                      dark:text-[#D5C2B6]
                    "
                  >
                    Languages
                  </label>

                  <input
                    name="languages"
                    value={
                      form.languages
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. English, Hindi, Sanskrit"
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      bg-white
                      px-4
                      text-sm
                      text-[#4D2E23]
                      outline-none
                      transition
                      focus:border-[#8A5035]
                      dark:border-[#3D322B]
                      dark:bg-[#1A1412]
                      dark:text-[#EDE3DA]
                    "
                  />

                </div>


                {/* FEE */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#4D2E23]
                      dark:text-[#D5C2B6]
                    "
                  >
                    Consultation Fee
                  </label>

                  <input
                    type="number"
                    name="consultation_fee"
                    value={
                      form.consultation_fee
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="e.g. 600"
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      bg-white
                      px-4
                      text-sm
                      text-[#4D2E23]
                      outline-none
                      transition
                      focus:border-[#8A5035]
                      dark:border-[#3D322B]
                      dark:bg-[#1A1412]
                      dark:text-[#EDE3DA]
                    "
                  />

                </div>


                {/* BIO */}

                <div
                  className="
                    col-span-2
                  "
                >

                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#4D2E23]
                      dark:text-[#D5C2B6]
                    "
                  >
                    Doctor Bio
                  </label>

                  <textarea
                    name="bio"
                    value={
                      form.bio
                    }
                    onChange={
                      handleChange
                    }
                    rows={4}
                    placeholder="Senior Ayurvedic Physician with 10+ years experience in Panchakarma."
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-[#4D2E23]
                      outline-none
                      transition
                      focus:border-[#8A5035]
                      dark:border-[#3D322B]
                      dark:bg-[#1A1412]
                      dark:text-[#EDE3DA]
                    "
                  />

                </div>


                {/* BUTTONS */}

                <div
                  className="
                    col-span-2
                    flex
                    justify-end
                    gap-3
                    pt-2
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(
                        false
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      dark:border-[#3D322B]
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-[#4D2E23]
                      dark:text-[#EDE3DA]
                      hover:bg-[#FFF8F3]
                      dark:hover:bg-[#2E241F]
                      transition
                    "
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    disabled={
                      isSaving
                    }
                    className="
                      rounded-xl
                      bg-[#8A5035]
                      px-7
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      disabled:opacity-50
                      hover:bg-[#70402B]
                      transition
                    "
                  >

                    {isSaving
                      ? "Saving..."
                      : editingDoctor
                        ? "Update Doctor"
                        : "Add Doctor"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>

  );
};


export default DoctorMaster;