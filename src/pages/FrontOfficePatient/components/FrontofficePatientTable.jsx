import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  Plus,
} from "lucide-react";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadFrontOfficePatients,
  deleteFrontOfficePatient,
} from "../../../redux/frontOffice/frontOfficePatientThunk";


// =====================================================
// FRONT OFFICE PATIENT TABLE
// =====================================================

const FrontofficePatientTable = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =====================================================
  // REDUX
  // =====================================================

  const {
    patients = [],
    totalPatients = 0,
    page = 1,
    limit = 10,
    totalPages = 0,
    showingText = "",
    patientsLoading = false,
    patientsError = null,
    deletingPatient = false,
  } = useSelector(
    (state) =>
      state.frontOfficePatient || {}
  );


  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [sort, setSort] =
    useState("a-z");

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [openMenuId, setOpenMenuId] =
    useState(null);

  const menuRef = useRef(null);


  // =====================================================
  // LOAD PATIENTS
  // =====================================================

  useEffect(() => {

    dispatch(
      loadFrontOfficePatients({
        sort,
        search,
        page: currentPage,
        limit: 10,
      })
    );

  }, [
    dispatch,
    sort,
    search,
    currentPage,
  ]);


  // =====================================================
  // CLOSE ACTION MENU
  // =====================================================

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setOpenMenuId(null);
      }

    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };

  }, []);


  // =====================================================
  // SORT
  // =====================================================

  const handleSortChange = (event) => {

    setSort(
      event.target.value
    );

    setCurrentPage(1);
  };


  // =====================================================
  // VIEW PROFILE
  // =====================================================

  const handleViewProfile = (patient) => {
  setOpenMenuId(null);

  navigate(`/frontoffice/patient/view/${patient.id}`, {
    
  });
};


  // =====================================================
  // EDIT PATIENT
  // =====================================================

  const handleEditPatient = (patient) => {
  setOpenMenuId(null);

  navigate(`/frontoffice/patient/edit/${patient.id}`, {
    state: {
      patientId: patient.id,
    },
  });
};


  // =====================================================
  // DELETE PATIENT
  // =====================================================

  const handleDeletePatient = async (
    patient
  ) => {

    setOpenMenuId(null);

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${patient.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {

      await dispatch(
        deleteFrontOfficePatient(
          patient.id
        )
      ).unwrap();


      /*
       * Reload table because backend
       * pagination/count may have changed.
       */

      await dispatch(
        loadFrontOfficePatients({
          sort,
          search,
          page: currentPage,
          limit: 10,
        })
      );

    } catch (error) {

      console.error(
        "Delete patient error:",
        error
      );

    }

  };


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  const handlePreviousPage = () => {

    if (currentPage <= 1) {
      return;
    }

    setOpenMenuId(null);

    setCurrentPage(
      (previous) =>
        previous - 1
    );

  };


  // =====================================================
  // NEXT PAGE
  // =====================================================

  const handleNextPage = () => {

    if (
      currentPage >= totalPages
    ) {
      return;
    }

    setOpenMenuId(null);

    setCurrentPage(
      (previous) =>
        previous + 1
    );

  };


  // =====================================================
  // ADD PATIENT
  // =====================================================

  const handleAddPatient = () => {

    navigate(
      "/frontoffice/direct-walk-in"
    );

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <DashboardLayout role="frontoffice">

      <div
        className="
          min-h-full
          bg-white
          px-7
          pb-8
          pt-7
        "
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex
            items-start
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-[24px]
                font-bold
                text-[#2F2926]
              "
            >
              Patients
            </h1>

            <div
              className="
                mt-2
                flex
                items-center
                gap-2
                text-[15px]
                text-[#5A3B30]
              "
            >

              <span
                className="
                  h-[7px]
                  w-[7px]
                  rounded-full
                  bg-[#5A3024]
                "
              />

              <span>
                {totalPatients.toLocaleString()} Patients
              </span>

            </div>

          </div>


          <button
            type="button"
            onClick={
              handleAddPatient
            }
            className="
              flex
              h-[50px]
              min-w-[210px]
              items-center
              justify-center
              gap-2
              rounded-[18px]
              bg-[#8A5038]
              px-7
              text-[15px]
              font-medium
              text-white
              transition
              hover:opacity-90
            "
          >

            <Plus
              size={19}
            />

            Add Patient

          </button>

        </div>


        {/* =====================================================
            CONTROLS
        ===================================================== */}

        <div
          className="
            mt-8
            flex
            items-center
            justify-between
          "
        >

          {/* SORT */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <span
              className="
                text-[13px]
                text-[#3F302A]
              "
            >
              Sort
            </span>

            <select
              value={sort}
              onChange={
                handleSortChange
              }
              className="
                h-[38px]
                rounded-[12px]
                border
                border-[#E5DDD7]
                bg-white
                px-4
                pr-9
                text-[13px]
                text-[#3F302A]
                outline-none
                cursor-pointer
              "
            >

              <option value="a-z">
                A-Z
              </option>

              <option value="z-a">
                Z-A
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

            </select>

          </div>


          {/* PAGINATION */}

          <div
            className="
              flex
              items-center
              gap-5
            "
          >

            <span
              className="
                text-[13px]
                text-[#655C57]
              "
            >
              {
                showingText ||
                `Showing Patients 0 - 0 of ${totalPatients}`
              }
            </span>


            <button
              type="button"
              onClick={
                handlePreviousPage
              }
              disabled={
                currentPage <= 1 ||
                patientsLoading
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                text-[#5A3024]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <ChevronLeft
                size={20}
              />
            </button>


            <button
              type="button"
              onClick={
                handleNextPage
              }
              disabled={
                currentPage >=
                  totalPages ||
                patientsLoading
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                text-[#5A3024]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <ChevronRight
                size={20}
              />
            </button>

          </div>

        </div>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {patientsError && (

          <div
            className="
              mt-5
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
              typeof patientsError ===
              "string"
                ? patientsError
                : patientsError?.message ||
                  "Failed to load patients."
            }
          </div>

        )}


        {/* =====================================================
            TABLE
        ===================================================== */}

        <div
          className="
            mt-5
            overflow-visible
            rounded-[20px]
            border
            border-[#E9DFD8]
            bg-white
          "
        >

          <table
            className="
              w-full
              table-fixed
              border-collapse
            "
          >

            <thead>

              <tr
                className="
                  bg-[#FFF9F5]
                  text-left
                "
              >

                <th
                  className="
                    w-[20%]
                    border-r
                    border-[#E9DFD8]
                    px-5
                    py-5
                    text-[13px]
                    font-medium
                    text-[#3D2C26]
                  "
                >
                  Patient Details
                </th>


                <th
                  className="
                    w-[14%]
                    border-r
                    border-[#E9DFD8]
                    px-5
                    py-5
                    text-[13px]
                    font-medium
                    text-[#3D2C26]
                  "
                >
                  Age/Gender
                </th>


                <th
                  className="
                    w-[15%]
                    border-r
                    border-[#E9DFD8]
                    px-5
                    py-5
                    text-[13px]
                    font-medium
                    text-[#3D2C26]
                  "
                >
                  Last Visit Date
                </th>


                <th
                  className="
                    w-[20%]
                    border-r
                    border-[#E9DFD8]
                    px-5
                    py-5
                    text-[13px]
                    font-medium
                    text-[#3D2C26]
                  "
                >
                  Reason for visit
                </th>


                <th
                  className="
                    w-[22%]
                    border-r
                    border-[#E9DFD8]
                    px-5
                    py-5
                    text-[13px]
                    font-medium
                    text-[#3D2C26]
                  "
                >
                  Contact
                </th>


                <th
                  className="
                    w-[9%]
                    px-4
                    py-5
                    text-center
                    text-[13px]
                    font-medium
                    text-[#3D2C26]
                  "
                >
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {/* LOADING */}

              {patientsLoading && (

                <tr>

                  <td
                    colSpan={6}
                    className="
                      h-[300px]
                      text-center
                      text-[14px]
                      text-[#8B7A70]
                    "
                  >
                    Loading patients...
                  </td>

                </tr>

              )}


              {/* EMPTY */}

              {!patientsLoading &&
                patients.length === 0 && (

                  <tr>

                    <td
                      colSpan={6}
                      className="
                        h-[300px]
                        text-center
                        text-[14px]
                        text-[#8B7A70]
                      "
                    >
                      No patients found.
                    </td>

                  </tr>

                )}


              {/* DATA */}

              {!patientsLoading &&
                patients.map(
                  (patient) => (

                    <tr
                      key={
                        patient.id
                      }
                      className="
                        align-top
                      "
                    >

                      {/* PATIENT DETAILS */}

                      <td
                        className="
                          border-r
                          border-[#EEE6E1]
                          px-5
                          py-4
                        "
                      >

                        <p
                          className="
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                          "
                        >
                          {
                            patient.name ||
                            patient.full_name ||
                            "-"
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-[12px]
                            text-[#8A817C]
                          "
                        >
                          Patient ID:{" "}
                          {
                            patient.patient_code ||
                            patient.patient_id ||
                            "-"
                          }
                        </p>

                      </td>


                      {/* AGE / GENDER */}

                      <td
                        className="
                          border-r
                          border-[#EEE6E1]
                          px-5
                          py-4
                        "
                      >

                        <p
                          className="
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                          "
                        >
                          {
                            patient.age_gender ||
                            `${patient.age || "-"} / ${patient.gender || "-"}`
                          }
                        </p>

                      </td>


                      {/* LAST VISIT */}

                      <td
                        className="
                          border-r
                          border-[#EEE6E1]
                          px-5
                          py-4
                        "
                      >

                        <p
                          className="
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                          "
                        >
                          {
                            patient.last_visit_date ||
                            "-"
                          }
                        </p>

                      </td>


                      {/* REASON */}

                      <td
                        className="
                          border-r
                          border-[#EEE6E1]
                          px-5
                          py-4
                        "
                      >

                        <p
                          className="
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                          "
                        >
                          {
                            patient.reason_for_visit ||
                            "-"
                          }
                        </p>

                        {patient.doctor_name && (

                          <p
                            className="
                              mt-1
                              text-[12px]
                              text-[#8A817C]
                            "
                          >
                            {
                              patient.doctor_name
                            }
                          </p>

                        )}

                      </td>


                      {/* CONTACT */}

                      <td
                        className="
                          border-r
                          border-[#EEE6E1]
                          px-5
                          py-4
                        "
                      >

                        <p
                          className="
                            text-[14px]
                            font-semibold
                            text-[#4D2E23]
                          "
                        >
                          {
                            patient.phone ||
                            patient.contact?.phone ||
                            "-"
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            truncate
                            text-[12px]
                            text-[#8A817C]
                          "
                          title={
                            patient.email ||
                            patient.contact?.email
                          }
                        >
                          {
                            patient.email ||
                            patient.contact?.email ||
                            "-"
                          }
                        </p>

                      </td>


                      {/* ACTION */}

                      <td
                        className="
                          relative
                          px-4
                          py-4
                          text-center
                        "
                      >

                        <button
                          type="button"
                          onClick={(event) => {

                            event.stopPropagation();

                            setOpenMenuId(
                              openMenuId ===
                                patient.id
                                ? null
                                : patient.id
                            );

                          }}
                          className="
                            inline-flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            text-[#4D2E23]
                            hover:bg-[#FFF4ED]
                          "
                        >
                          <MoreVertical
                            size={19}
                          />
                        </button>


                        {/* MENU */}

                        {openMenuId ===
                          patient.id && (

                          <div
                            ref={menuRef}
                            className="
                              absolute
                              right-[35px]
                              top-[45px]
                              z-50
                              w-[230px]
                              overflow-hidden
                              rounded-[18px]
                              border
                              border-[#EAE2DC]
                              bg-white
                              py-2
                              text-left
                              shadow-[0_6px_22px_rgba(60,40,30,0.12)]
                            "
                          >

                            <button
                              type="button"
                              onClick={() =>
                                handleViewProfile(
                                  patient
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-4
                                px-5
                                py-3
                                text-[14px]
                                font-medium
                                text-[#4D2E23]
                                hover:bg-[#FFF8F3]
                              "
                            >

                              <Eye
                                size={19}
                              />

                              View Profile

                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleEditPatient(
                                  patient
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-4
                                px-5
                                py-3
                                text-[14px]
                                font-medium
                                text-[#4D2E23]
                                hover:bg-[#FFF8F3]
                              "
                            >

                              <Pencil
                                size={18}
                              />

                              Edit Patient Details

                            </button>


                            <button
                              type="button"
                              disabled={
                                deletingPatient
                              }
                              onClick={() =>
                                handleDeletePatient(
                                  patient
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-4
                                px-5
                                py-3
                                text-[14px]
                                font-medium
                                text-[#4D2E23]
                                hover:bg-[#FFF8F3]
                                disabled:opacity-50
                              "
                            >

                              <Trash2
                                size={18}
                              />

                              Delete Patient

                            </button>

                          </div>

                        )}

                      </td>

                    </tr>

                  )
                )}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>

  );
};

export default FrontofficePatientTable;