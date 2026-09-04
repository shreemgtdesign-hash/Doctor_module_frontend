import {
  useEffect,
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
} from "lucide-react";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
  loadFrontOfficePatientProfile,
} from "../../../redux/frontOffice/frontOfficePatientThunk";

import {
  clearFrontOfficePatientProfile,
} from "../../../redux/frontOffice/frontOfficePatientSlice";


// =====================================================
// VIEW PATIENT PROFILE
// =====================================================

const ViewPatientProfile = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { id } =
    useParams();


  // =====================================================
  // REDUX
  // =====================================================

  const {
    selectedPatient = null,
    patientProfileLoading = false,
    patientProfileError = null,
  } = useSelector(
    (state) =>
      state.frontOfficePatient || {}
  );


  // =====================================================
  // LOAD PROFILE
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
  // CLEAR WHEN LEAVING
  // =====================================================

  useEffect(() => {

    return () => {

      dispatch(
        clearFrontOfficePatientProfile()
      );

    };

  }, [dispatch]);


  // =====================================================
  // DATA
  // =====================================================

  const profile =
    selectedPatient?.profile ||
    {};

  const visitHistory =
    Array.isArray(
      selectedPatient?.visit_history
    )
      ? selectedPatient.visit_history
      : [];


  // =====================================================
  // VALUE HELPER
  // =====================================================

  const getValue = (
    value
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return value;
  };


  // =====================================================
  // PACKAGE
  // =====================================================

  const packageHolder =
    profile.packageholder ||
    profile.package_name ||
    "-";

  const packageSub =
    profile.package_sub ||
    profile.package_tier ||
    "";


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
          pt-8
        "
      >

        {/* =====================================================
            GO BACK
        ===================================================== */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
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


        {/* =====================================================
            LOADING
        ===================================================== */}

        {patientProfileLoading && (

          <div
            className="
              flex
              min-h-[500px]
              items-center
              justify-center
              text-[14px]
              text-[#8B7A70]
            "
          >
            Loading patient profile...
          </div>

        )}


        {/* =====================================================
            ERROR
        ===================================================== */}

        {!patientProfileLoading &&
          patientProfileError && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-[#E8D9CF]
                bg-[#FFF8F3]
                p-6
                text-center
                text-[#8A5038]
              "
            >
              {
                typeof patientProfileError ===
                "string"
                  ? patientProfileError
                  : patientProfileError?.message ||
                    "Failed to load patient profile."
              }
            </div>

          )}


        {/* =====================================================
            CONTENT
        ===================================================== */}

        {!patientProfileLoading &&
          !patientProfileError &&
          selectedPatient && (

            <div
              className="
                mt-8
                grid
                grid-cols-[1.02fr_0.98fr]
                gap-5
                items-start
              "
            >

              {/* =================================================
                  LEFT PROFILE CARD
              ================================================= */}

              <div
                className="
                  rounded-[20px]
                  border
                  border-[#DED2CA]
                  bg-white
                  p-5
                "
              >

                {/* PROFILE TOP */}

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    pb-7
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      flex
                      h-[104px]
                      w-[92px]
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-[18px]
                      bg-[#EAEAEA]
                      shadow-sm
                    "
                  >

                    {profile.profile_image ? (

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
                          object-cover
                        "
                      />

                    ) : null}

                  </div>


                  <div>

                    <h1
                      className="
                        text-[21px]
                        font-bold
                        text-[#2F2926]
                      "
                    >
                      {
                        getValue(
                          profile.full_name ||
                          profile.name
                        )
                      }
                    </h1>

                    <p
                      className="
                        mt-1
                        text-[16px]
                        text-[#8A817C]
                      "
                    >
                      {
                        profile.age_gender ||
                        `${getValue(profile.age)}/${getValue(profile.gender)}`
                      }
                    </p>

                  </div>

                </div>


                <div
                  className="
                    border-t
                    border-[#ECE5E0]
                  "
                >

                  <ProfileRow
                    label="Patient ID"
                    value={
                      profile.patient_id ||
                      profile.patient_code
                    }
                  />

                  <ProfileRow
                    label="Date of Joining"
                    value={
                      profile.date_of_joining
                    }
                  />

                  <ProfileRow
                    label="Email"
                    value={
                      profile.email
                    }
                  />

                  <ProfileRow
                    label="Phone"
                    value={
                      profile.phone ||
                      profile.mobile
                    }
                  />

                  <ProfileRow
                    label="Registration No."
                    value={
                      profile.registration_no
                    }
                  />

                  <ProfileRow
                    label="Packageholder"
                    value={
                      packageHolder
                    }
                    subValue={
                      packageSub
                    }
                  />

                  <ProfileRow
                    label="Insurance holder"
                    value={
                      profile.insurance_holder ||
                      profile.insurance
                    }
                    last
                  />

                </div>

              </div>


              {/* =================================================
                  VISIT HISTORY
              ================================================= */}

              <div
                className="
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-[#DED2CA]
                  bg-white
                "
              >

                {/* HEADER */}

                <div
                  className="
                    grid
                    grid-cols-[1.05fr_1fr_1fr]
                    bg-[#FFF9F5]
                  "
                >

                  <div
                    className="
                      border-r
                      border-[#E8DED7]
                      px-5
                      py-5
                      text-[13px]
                      font-medium
                      text-[#4D2E23]
                    "
                  >
                    Doctor Name
                  </div>

                  <div
                    className="
                      border-r
                      border-[#E8DED7]
                      px-5
                      py-5
                      text-[13px]
                      font-medium
                      text-[#4D2E23]
                    "
                  >
                    Date and Time
                  </div>

                  <div
                    className="
                      px-5
                      py-5
                      text-[13px]
                      font-medium
                      text-[#4D2E23]
                    "
                  >
                    Visit Type
                  </div>

                </div>


                {/* ROWS */}

                {visitHistory.length > 0 ? (

                  visitHistory.map(
                    (visit) => {

                      const {
                        date,
                        time,
                      } =
                        splitDateTime(
                          visit.date_and_time
                        );

                      return (

                        <div
                          key={
                            visit.id
                          }
                          className="
                            grid
                            min-h-[84px]
                            grid-cols-[1.05fr_1fr_1fr]
                          "
                        >

                          {/* DOCTOR */}

                          <div
                            className="
                              flex
                              items-center
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
                                getValue(
                                  visit.doctor_name
                                )
                              }
                            </p>

                          </div>


                          {/* DATE */}

                          <div
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
                              {date}
                            </p>

                            {time && (

                              <p
                                className="
                                  mt-1
                                  text-[12px]
                                  text-[#8A817C]
                                "
                              >
                                {time}
                              </p>

                            )}

                          </div>


                          {/* TYPE */}

                          <div
                            className="
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
                                getValue(
                                  visit.visit_type
                                )
                              }
                            </p>

                            {visit.sub_type && (

                              <p
                                className="
                                  mt-1
                                  text-[12px]
                                  text-[#8A817C]
                                "
                              >
                                {
                                  visit.sub_type
                                }
                              </p>

                            )}

                          </div>

                        </div>

                      );

                    }
                  )

                ) : (

                  <div
                    className="
                      flex
                      h-[250px]
                      items-center
                      justify-center
                      text-[14px]
                      text-[#8A817C]
                    "
                  >
                    No visit history found.
                  </div>

                )}

              </div>

            </div>

          )}

      </div>

    </DashboardLayout>

  );
};


// =====================================================
// PROFILE ROW
// =====================================================

const ProfileRow = ({
  label,
  value,
  subValue,
  last = false,
}) => {

  const displayValue =
    value === null ||
    value === undefined ||
    value === ""
      ? "-"
      : value;

  return (

    <div
      className={`
        grid
        grid-cols-[1fr_1.05fr]
        gap-6
        py-[17px]
        ${
          !last
            ? "border-b border-[#ECE5E0]"
            : ""
        }
      `}
    >

      <p
        className="
          text-[13px]
          text-[#77706C]
        "
      >
        {label}
      </p>


      <div>

        <p
          className="
            break-words
            text-[14px]
            font-medium
            text-[#4D2E23]
          "
        >
          {displayValue}
        </p>

        {subValue && (
          <p
            className="
              mt-1
              text-[12px]
              text-[#77706C]
            "
          >
            {subValue}
          </p>
        )}

      </div>

    </div>

  );
};


// =====================================================
// SPLIT DATE + TIME
// =====================================================

const splitDateTime = (
  value
) => {

  if (!value) {
    return {
      date: "-",
      time: "",
    };
  }

  /*
   * Backend example:
   * 21st Aug, 2026 4:30 PM
   */

  const match =
    value.match(
      /^(.*\d{4})\s+(\d{1,2}:\d{2}\s*[AP]M)$/i
    );

  if (!match) {

    return {
      date: value,
      time: "",
    };

  }

  return {
    date: match[1],
    time: match[2],
  };

};


export default ViewPatientProfile;