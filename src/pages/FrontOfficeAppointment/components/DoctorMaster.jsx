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


const emptyDoctor = {
  name: "",
  specialization: "",
  qualification: "",
  registration_no: "",
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

    setForm({

      name:
        doctor.name || "",

      specialization:
        doctor.specialization || "",

      qualification:
        doctor.qualification || "",

      registration_no:
        doctor.registration_no || "",

      consultation_fee:
        doctor.consultation_fee || "",

      bio:
        doctor.bio || "",

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

    const payload = {

      ...form,

      consultation_fee:
        form.consultation_fee
          ? Number(
              form.consultation_fee
            )
          : 0,

    };


    if (editingDoctor) {

      const result =
        await dispatch(
          updateFrontOfficeDoctor({
            doctorId:
              editingDoctor.id,

            data:
              payload,

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


  // ==========================================
  // VIEW PROFILE
  // ==========================================

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
          bg-[#F7F7F7]
          px-6
          py-6
        "
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <div
          className="
            mb-5
            flex
            items-start
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-[20px]
                font-bold
                text-[#292929]
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
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#4D2E23]
                "
              />

              {doctors.length} Doctors

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
                bg-white
                px-7
                text-[14px]
                font-semibold
                text-[#4D2E23]
                transition
                hover:bg-[#FFF8F3]
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
              bg-white
              px-4
              text-sm
              text-[#4D2E23]
              outline-none
              focus:border-[#8A5035]
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
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
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
            bg-white
          "
        >

          {/* TABLE HEADER */}

          <div
            className="
              grid
              grid-cols-[2.2fr_1.4fr_1fr_1.55fr_2fr_68px]
              border-b
              border-[#E8D9CD]
              bg-[#FFF9F4]
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
                    px-4
                    py-4
                    text-[13px]
                    font-medium
                    text-[#4D2E23]
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
                        text-[14px]
                        font-semibold
                        text-[#8A5035]
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
                        "
                      >
                        {doctor.qualification ||
                          "Qualification not available"}
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
                      px-4
                      py-3
                    "
                  >

                    <span
                      className="
                        text-[14px]
                        font-semibold
                        text-[#4D2E23]
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
                      px-4
                      py-3
                    "
                  >

                    <span
                      className="
                        text-[14px]
                        font-semibold
                        text-[#4D2E23]
                      "
                    >
                      {doctor.experience ||
                        "N/A"}
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
                      "
                    >
                      {doctor.contact?.phone ||
                        "N/A"}
                    </span>


                    <span
                      className="
                        mt-1
                        truncate
                        text-[12px]
                        text-[#8B7A70]
                      "
                    >
                      {doctor.contact?.email ||
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
                        hover:bg-[#FFF4EC]
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
                          bg-white
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
                            hover:bg-[#FFF8F3]
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
                            hover:bg-[#FFF8F3]
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
                            hover:bg-[#FFF8F3]
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
                            hover:bg-red-50
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
                max-w-[520px]
                rounded-2xl
                bg-white
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
                    hover:bg-[#FFF4F0]
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
                    text-xl
                    font-semibold
                    text-[#8A5035]
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
                    "
                  >
                    {selectedDoctor.name}
                  </h3>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-[#8B7A70]
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
                  <p className="text-xs text-[#8B7A70]">
                    Qualification
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#4D2E23]">
                    {selectedDoctor.qualification ||
                      "N/A"}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-[#8B7A70]">
                    Experience
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#4D2E23]">
                    {selectedDoctor.experience ||
                      "N/A"}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-[#8B7A70]">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#4D2E23]">
                    {selectedDoctor.contact?.phone ||
                      "N/A"}
                  </p>
                </div>


                <div>
                  <p className="text-xs text-[#8B7A70]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-[#4D2E23]">
                    {selectedDoctor.contact?.email ||
                      "N/A"}
                  </p>
                </div>

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
                    hover:bg-[#FFF4F0]
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
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      px-4
                      text-sm
                      outline-none
                      focus:border-[#8A5035]
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
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      px-4
                      text-sm
                      outline-none
                      focus:border-[#8A5035]
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
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      px-4
                      text-sm
                      outline-none
                      focus:border-[#8A5035]
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
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      px-4
                      text-sm
                      outline-none
                      focus:border-[#8A5035]
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
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      px-4
                      text-sm
                      outline-none
                      focus:border-[#8A5035]
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
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#E1D5CD]
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-[#8A5035]
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
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-[#4D2E23]
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