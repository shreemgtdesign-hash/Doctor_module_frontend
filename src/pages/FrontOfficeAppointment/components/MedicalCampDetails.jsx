import { useEffect, useMemo, useState } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {

  Copy,
  MoreVertical,
  Send,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";

import {
  loadMedicalCampDetails,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import DashboardLayout from "../../../components/Layout/DashboardLayout";
import RegisterPatient from "./Registerpatient";


const MedicalCampDetails = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const { id: routeCampId } = useParams();
  const [showRegisterPatient, setShowRegisterPatient] =
    useState(false);

  // =========================================================
  // CAMP ID
  // =========================================================

  const campId =
    location.state?.campId ||
    location.state?.camp_id ||
    routeCampId ||
    null;


  // =========================================================
  // REDUX
  // =========================================================

  const {
    medicalCampDetails = null,
    medicalCampDetailsLoading = false,
    medicalCampDetailsError = null,
  } = useSelector(
    (state) =>
      state.frontOfficeAppointment || {}
  );


  // =========================================================
  // LOCAL STATE
  // =========================================================

  const [activeTab, setActiveTab] =
    useState("today");

  const [copied, setCopied] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const patientsPerPage = 10;


  // =========================================================
  // LOAD MEDICAL CAMP DETAILS
  // =========================================================

  useEffect(() => {

    if (!campId) {
      return;
    }

    dispatch(
      loadMedicalCampDetails(campId)
    );

  }, [
    dispatch,
    campId,
  ]);


  // =========================================================
  // CAMP DATA
  // =========================================================

  const camp =
    medicalCampDetails?.data ||
    medicalCampDetails || {};

  const doctor =
    camp.doctor || {};


  // =========================================================
  // REGISTERED PATIENTS
  // =========================================================

  const registeredPatients =
    Array.isArray(
      camp.registered_patients
    )
      ? camp.registered_patients
      : [];


  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPatients =
    registeredPatients.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalPatients /
        patientsPerPage
      )
    );


  const paginatedPatients =
    useMemo(() => {

      const startIndex =
        (currentPage - 1) *
        patientsPerPage;

      const endIndex =
        startIndex +
        patientsPerPage;

      return registeredPatients.slice(
        startIndex,
        endIndex
      );

    }, [
      registeredPatients,
      currentPage,
    ]);


  useEffect(() => {

    setCurrentPage(1);

  }, [
    campId,
    registeredPatients.length,
  ]);


  // =========================================================
  // COPY SHARE LINK
  // =========================================================

  const handleCopyLink = async () => {

    if (!camp.share_link) {
      return;
    }

    try {

      await navigator.clipboard.writeText(
        camp.share_link
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {

      console.error(
        "Failed to copy link:",
        error
      );

    }

  };


  // =========================================================
  // SEND REMINDER
  // =========================================================

  const handleSendReminder = () => {

    console.log(
      "Send reminder for camp:",
      camp.id
    );

  };


  // =========================================================
  // BACK TO CAMP CALENDAR
  // =========================================================

  const handleBack = () => {

    navigate(
      "/frontoffice/medcamp"
    );

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (
    medicalCampDetailsLoading
  ) {

    return (

      <DashboardLayout role="frontoffice">

        <div className="w-full px-5 py-5 lg:px-6">

          <div className="flex min-h-[500px] items-center justify-center">

            <p className="text-sm text-gray-500">
              Loading medical camp details...
            </p>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (
    medicalCampDetailsError
  ) {

    return (

      <DashboardLayout>

        <div className="w-full px-5 py-5 lg:px-6">

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <p className="text-sm text-red-600">

              {typeof medicalCampDetailsError ===
                "string"
                ? medicalCampDetailsError
                : "Failed to load medical camp details"}

            </p>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  // =========================================================
  // NO DATA
  // =========================================================

  if (
    !medicalCampDetails
  ) {

    return (

      <DashboardLayout>

        <div className="w-full px-5 py-5 lg:px-6">

          <div className="flex min-h-[500px] items-center justify-center">

            <p className="text-sm text-gray-500">
              Medical camp details not found.
            </p>

          </div>

        </div>

      </DashboardLayout>

    );

  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (

    <DashboardLayout role={"frontoffice"}>

      <div className="w-full px-5 py-5 lg:px-6">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-4 flex items-start justify-between">

          <div>

            <h2 className="text-xl font-semibold text-[#2f2522]">
              Medical Camp
            </h2>

            <p className="mt-1 text-sm text-[#694b3e]">
              Manage and track all medical camps.
            </p>

          </div>


          <button
            type="button"
            onClick={() => {

              const currentCampId =
                camp?.id ||
                campId ||
                null;

              console.log(
                "ADD PATIENT CAMP ID:",
                currentCampId
              );

              if (!currentCampId) {
                alert(
                  "Medical camp ID is missing."
                );
                return;
              }

              setShowRegisterPatient(true);

            }}
            className="rounded-xl bg-[#8a5238] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#75432e]"
          >
            + Add Patient
          </button>

        </div>


        {/* =====================================================
            TABS
        ===================================================== */}

     

        {/* =====================================================
            CAMP SUMMARY
        ===================================================== */}

        <div className="mb-5 rounded-2xl border border-[#ead9ce] bg-white">

          <div className="grid grid-cols-1 items-center lg:grid-cols-[1.25fr_1.2fr_0.7fr_0.9fr]">

            {/* DOCTOR */}

            <div className="flex items-center gap-3 px-4 py-3">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#eee4dd] bg-[#f5f1ee]">

                {doctor.image ? (

                  <img
                    src={doctor.image}
                    alt={
                      doctor.name ||
                      "Doctor"
                    }
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <div className="text-lg font-semibold text-[#8a5238]">

                    {doctor.name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "D"}

                  </div>

                )}

              </div>


              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-[#2f2522]">
                  {doctor.name ||
                    "—"}
                </p>

                <p className="mt-0.5 truncate text-xs font-medium text-[#168d8b]">
                  {doctor.specialty ||
                    "—"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  🎓 BAMS • 9y exp.
                </p>

              </div>

            </div>


            {/* CAMP */}

            <div className="border-t border-[#eee4dd] px-5 py-3 lg:border-l lg:border-t-0">

              <p className="text-xs text-[#60483d]">
                {camp.camp_name ||
                  "—"}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#4d2e24]">
                Camp ID:{" "}
                {camp.camp_code ||
                  "—"}
              </p>

            </div>


            {/* REGISTRATIONS */}

            <div className="border-t border-[#eee4dd] px-5 py-3 lg:border-l lg:border-t-0">

              <p className="text-xs text-[#60483d]">
                Registrations
              </p>

              <p className="mt-1 text-sm font-semibold text-[#4d2e24]">
                {camp.registrations_count ??
                  0}
              </p>

            </div>


            {/* WORKING HOURS */}

            <div className="border-t border-[#eee4dd] px-5 py-3 lg:border-l lg:border-t-0">

              <p className="text-xs text-[#60483d]">
                Working Hours
              </p>

              <p className="mt-1 text-sm font-semibold text-[#4d2e24]">
                {camp.working_hours ||
                  "—"}
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            SHARE + REMINDER CARD
        ===================================================== */}

        <div className="mb-5 rounded-2xl border border-[#ead9ce] bg-white p-5">

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_0.8fr]">

            {/* SHARE REGISTRATION LINK */}

            <div>

              <h3 className="text-sm font-semibold text-[#302522]">
                Share Registration Link
              </h3>

              <p className="mt-1 text-sm text-[#694b3e]">
                Share this link to register patients for this camp.
              </p>


              <div className="mt-4 flex h-11 overflow-hidden rounded-xl border border-[#eadfd7]">

                <input
                  type="text"
                  readOnly
                  value={
                    camp.share_link ||
                    ""
                  }
                  className="min-w-0 flex-1 bg-white px-4 text-sm text-gray-600 outline-none"
                />


                <button
                  type="button"
                  onClick={
                    handleCopyLink
                  }
                  className="flex w-24 items-center justify-center gap-2 bg-[#8a5238] text-sm font-semibold text-white transition hover:bg-[#75432e]"
                >

                  <Copy
                    size={15}
                  />

                  {copied
                    ? "Copied"
                    : "Copy"}

                </button>

              </div>

            </div>


            {/* SOCIAL MEDIA */}

            <div className="border-t border-[#eee4dd] pt-4 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">

              <h3 className="text-sm font-semibold text-[#302522]">
                Share on Social Media
              </h3>


              <div className="mt-4 flex items-start gap-5">

                {/* WHATSAPP */}

                {camp.social_share
                  ?.whatsapp && (

                    <a
                      href={
                        camp.social_share.whatsapp
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1"
                      title="WhatsApp"
                    >

                      <FaWhatsapp
                        size={36}
                        className="text-[#25D366]"
                      />

                      <span className="text-[11px] text-[#4d2e24]">
                        WhatsApp
                      </span>

                    </a>

                  )}


                {/* INSTAGRAM */}

                {camp.social_share
                  ?.instagram && (

                    <a
                      href={
                        camp.social_share.instagram
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1"
                      title="Instagram"
                    >

                      <FaInstagram
                        size={36}
                        className="text-[#E4405F]"
                      />

                      <span className="text-[11px] text-[#4d2e24]">
                        Instagram
                      </span>

                    </a>

                  )}


                {/* FACEBOOK */}

                {camp.social_share
                  ?.facebook && (

                    <a
                      href={
                        camp.social_share.facebook
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1"
                      title="Facebook"
                    >

                      <FaFacebook
                        size={36}
                        className="text-[#1877F2]"
                      />

                      <span className="text-[11px] text-[#4d2e24]">
                        Facebook
                      </span>

                    </a>

                  )}


                {/* TWITTER */}

                {camp.social_share
                  ?.twitter && (

                    <a
                      href={
                        camp.social_share.twitter
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1"
                      title="Twitter"
                    >

                      <FaTwitter
                        size={36}
                        className="text-[#1DA1F2]"
                      />

                      <span className="text-[11px] text-[#4d2e24]">
                        Twitter
                      </span>

                    </a>

                  )}

              </div>

            </div>

          </div>


          {/* ===================================================
              SEND REMINDER
          =================================================== */}

          <div className="mt-5 flex items-center justify-between border-t border-[#eee4dd] pt-4">

            <div>

              <h3 className="text-sm font-semibold text-[#302522]">
                Send Reminders
              </h3>

              <p className="mt-1 text-sm text-[#694b3e]">
                Send SMS/WhatsApp reminders to registered patients
              </p>

            </div>


            <button
              type="button"
              onClick={
                handleSendReminder
              }
              className="flex items-center gap-2 rounded-xl border border-[#e6d8ce] bg-white px-5 py-2.5 text-sm font-semibold text-[#5d382b] transition hover:bg-[#faf6f2]"
            >

              <Send
                size={15}
              />

              Send Reminder

            </button>

          </div>

        </div>


        {/* =====================================================
            PATIENT PAGINATION TOP
        ===================================================== */}

        <div className="mb-2 flex items-center justify-end gap-4">

          <span className="text-xs text-gray-500">

            Showing Patients{" "}

            {totalPatients === 0
              ? 0
              : (currentPage - 1) *
              patientsPerPage +
              1}

            {" - "}

            {Math.min(
              currentPage *
              patientsPerPage,
              totalPatients
            )}

            {" "}of{" "}

            {totalPatients}

          </span>


          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      1,
                      prev - 1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#b5a49d] transition hover:bg-[#f7f1ed] disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronLeft
                size={17}
              />

            </button>


            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      totalPages,
                      prev + 1
                    )
                )
              }
              disabled={
                currentPage >=
                totalPages
              }
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#5d382b] transition hover:bg-[#f7f1ed] disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronRight
                size={17}
              />

            </button>

          </div>

        </div>


        {/* =====================================================
            REGISTERED PATIENTS TABLE
        ===================================================== */}

        <div className="overflow-hidden rounded-2xl border border-[#eadfd7] bg-white">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] table-fixed">

              <thead>

                <tr className="border-b border-[#eadfd7] bg-[#fdf9f5]">

                  <th className="w-[24%] px-4 py-3 text-left text-[11px] font-semibold text-[#5d382b]">
                    Patient Details
                  </th>

                  <th className="w-[14%] px-4 py-3 text-left text-[11px] font-semibold text-[#5d382b]">
                    Age/Gender
                  </th>

                  <th className="w-[18%] px-4 py-3 text-left text-[11px] font-semibold text-[#5d382b]">
                    Registered on
                  </th>

                  <th className="w-[23%] px-4 py-3 text-left text-[11px] font-semibold text-[#5d382b]">
                    Contact
                  </th>

                  <th className="w-[10%] px-4 py-3 text-center text-[11px] font-semibold text-[#5d382b]">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {paginatedPatients.length >
                  0 ? (

                  paginatedPatients.map(
                    (patient) => (

                      <tr
                        key={
                          patient.id
                        }
                        className="border-b border-[#f0e9e4] last:border-b-0"
                      >

                        {/* PATIENT DETAILS */}

                        <td className="px-4 py-3">

                          <div>

                            <p className="text-sm font-semibold text-[#57362c]">
                              {patient.patient_name ||
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">

                              Patient ID:{" "}

                              {patient.patient_id ||
                                patient.patient_code ||
                                patient.patient_camp_id ||
                                "—"}

                            </p>

                          </div>

                        </td>


                        {/* AGE / GENDER */}

                        <td className="px-4 py-3">

                          <p className="text-sm font-semibold text-[#57362c]">

                            {patient.age_gender_text ||
                              (
                                patient.age !==
                                  undefined &&
                                  patient.gender
                                  ? `${patient.age} / ${patient.gender}`
                                  : "—"
                              )}

                          </p>

                        </td>


                        {/* REGISTERED ON */}

                        <td className="px-4 py-3">

                          <p className="text-sm font-semibold text-[#57362c]">

                            {patient.formatted_registered_on ||
                              patient.registered_on ||
                              "—"}

                          </p>

                        </td>


                        {/* CONTACT */}

                        <td className="px-4 py-3">

                          <div className="space-y-1">

                            {patient.mobile && (

                              <div className="flex items-center gap-2">

                                <Phone
                                  size={13}
                                  className="shrink-0 text-gray-500"
                                />

                                <span className="text-xs text-gray-600">
                                  {patient.mobile}
                                </span>

                              </div>

                            )}


                            {patient.email && (

                              <div className="flex items-center gap-2">

                                <Mail
                                  size={13}
                                  className="shrink-0 text-gray-500"
                                />

                                <span className="truncate text-xs text-gray-600">
                                  {patient.email}
                                </span>

                              </div>

                            )}


                            {!patient.mobile &&
                              !patient.email && (
                                <span className="text-xs text-gray-500">
                                  —
                                </span>
                              )}

                          </div>

                        </td>


                        {/* ACTION */}

                        <td className="px-4 py-3 text-center">

                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5d382b] transition hover:bg-[#f7f1ed]"
                            title="More actions"
                          >

                            <MoreVertical
                              size={17}
                            />

                          </button>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      No registered patients found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
      {showRegisterPatient && (
  <RegisterPatient
    campId={
      camp?.id ||
      campId
    }

    onClose={() => {
      setShowRegisterPatient(false);
    }}

    onRegistered={() => {

      setShowRegisterPatient(false);

      // Refresh details after registration
      if (camp?.id || campId) {
        dispatch(
          loadMedicalCampDetails(
            camp?.id || campId
          )
        );
      }

    }}
  />
)}
    </DashboardLayout>

  );

};


export default MedicalCampDetails;