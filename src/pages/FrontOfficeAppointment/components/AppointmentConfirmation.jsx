import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import DashboardLayout
  from "../../../components/Layout/DashboardLayout";

import {
  confirmFrontOfficeAppointment,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import {
  clearFrontOfficeAppointmentMessage,
} from "../../../redux/frontOffice/frontOfficeAppointmentSlice";


const AppointmentConfirmation = () => {

  const dispatch = useDispatch();

  /*
   * Doctor ID
   *
   * Later this can come from route params.
   * For now the API you provided uses D_2.
   */
  const doctorId = "D_2";


  const {
    confirmation,
    loading,
    error,
    message,
  } =
    useSelector(
      (state) =>
        state.frontOfficeAppointment
    );


  /*
   * Currently selected conflict slot
   */
  const [selectedSlot, setSelectedSlot] =
    useState(null);


  /*
   * Currently selected patient/request
   */
  const [selectedRequest, setSelectedRequest] =
    useState(null);


  /*
   * Expanded conflict slots
   */
  const [expandedSlots, setExpandedSlots] =
    useState({});


  /*
   * Load appointment confirmation data
   */
  useEffect(() => {

    dispatch(
      confirmFrontOfficeAppointment({
        doctor_id: doctorId,
      })
    );

    return () => {

      dispatch(
        clearFrontOfficeAppointmentMessage()
      );

    };

  }, [dispatch]);


  /*
   * API data
   */
  const doctor =
    confirmation?.doctor;

  const schedule =
    confirmation?.schedule_overview
      ?.schedule_slots || [];

  const history =
    confirmation?.patient_history_with_doctor ||
    [];


  /*
   * First conflict slot
   *
   * This makes the screen immediately
   * useful when opening the page.
   */
  useEffect(() => {

    if (
      schedule.length > 0 &&
      !selectedSlot
    ) {

      const firstConflict =
        schedule.find(
          (slot) =>
            slot.status === "conflict" &&
            slot.requests?.length > 0
        );

      if (firstConflict) {

        setSelectedSlot(
          firstConflict
        );

        setSelectedRequest(
          firstConflict.requests[0]
        );

        setExpandedSlots({
          [firstConflict.time]: true,
        });

      }

    }

  }, [
    schedule,
    selectedSlot,
  ]);


  /*
   * Number of patients/requests
   */
  const pendingPatientCount =
    useMemo(() => {

      return schedule.reduce(
        (total, slot) => {

          if (
            slot.status === "conflict"
          ) {

            return (
              total +
              (slot.requests?.length || 0)
            );

          }

          return total;

        },
        0
      );

    }, [schedule]);


  /*
   * Toggle conflict slot
   */
  const handleToggleSlot = (
    slot
  ) => {

    const isExpanded =
      expandedSlots[slot.time];

    setExpandedSlots(
      (previous) => ({
        ...previous,
        [slot.time]: !isExpanded,
      })
    );


    /*
     * Select this conflict slot
     */
    if (
      slot.status === "conflict"
    ) {

      setSelectedSlot(slot);

      setSelectedRequest(
        slot.requests?.[0] || null
      );

    }

  };


  /*
   * Select patient/request
   */
  const handleSelectRequest = (
    request
  ) => {

    setSelectedRequest(request);

  };


  /*
   * Confirm appointment
   */
  const handleConfirm = async () => {

    if (
      !selectedRequest ||
      !selectedSlot
    ) {

      return;

    }


    try {

      await dispatch(
        confirmFrontOfficeAppointment({
          doctor_id: doctorId,
          appointment_id:
            selectedRequest.appointment_id,
        })
      ).unwrap();


      /*
       * Reload the confirmation screen
       * after successful confirmation.
       */
      dispatch(
        confirmFrontOfficeAppointment({
          doctor_id: doctorId,
        })
      );

    } catch (err) {

      console.error(
        "Appointment confirmation failed:",
        err
      );

    }

  };


  /*
   * Status helpers
   */
  const getStatusLabel = (
    status
  ) => {

    if (status === "booked") {
      return "Confirmed";
    }

    if (status === "waiting") {
      return "Pending";
    }

    if (status === "conflict") {
      return "Conflict";
    }

    return status || "Pending";

  };


  return (

    <DashboardLayout
      role="frontoffice"
    >

      <div
        className="
          min-h-screen
          bg-[#F7F7F7]
          px-6
          py-5
        "
      >

        {/* ========================================= */}
        {/* SUCCESS MESSAGE */}
        {/* ========================================= */}

        {message && (

          <div
            className="
              mb-4
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-3
              text-sm
              text-green-700
            "
          >
            {message}
          </div>

        )}


        {/* ========================================= */}
        {/* ERROR */}
        {/* ========================================= */}

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
              : "Failed to load appointment confirmation."}
          </div>

        )}


        {/* ========================================= */}
        {/* PAGE HEADER */}
        {/* ========================================= */}

        <div
          className="
            mb-3
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-[21px]
                font-semibold
                text-[#2F2926]
              "
            >
              Appointment Confirmation
            </h1>

            <div
              className="
                mt-1
                flex
                items-center
                gap-2
                text-[13px]
                text-[#634238]
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#4B2E2A]
                "
              />

              {pendingPatientCount} Patients

            </div>

          </div>

        </div>


        {/* ========================================= */}
        {/* DOCTOR INFORMATION */}
        {/* ========================================= */}

        {doctor && (

          <div
            className="
              mb-5
              flex
              items-center
              border-b
              border-[#E8DDD6]
              pb-4
            "
          >

            {/* Doctor */}

            <div
              className="
                flex
                min-w-[250px]
                items-center
                gap-3
              "
            >

              <div
                className="
                  h-[58px]
                  w-[58px]
                  overflow-hidden
                  rounded-full
                  border
                  border-[#E8DDD6]
                  bg-[#FFF7F1]
                "
              >

                {doctor.profile_image ? (

                  <img
                    src={doctor.profile_image}
                    alt={doctor.doctor_name}
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
                      text-lg
                      font-semibold
                      text-[#8A4F32]
                    "
                  >
                    D
                  </div>

                )}

              </div>


              <div>

                <h2
                  className="
                    text-[15px]
                    font-semibold
                    text-[#2F2926]
                  "
                >
                  {doctor.doctor_name}
                </h2>

                <p
                  className="
                    text-[12px]
                    text-[#159A9C]
                  "
                >
                  {doctor.specialization}
                </p>

                <p
                  className="
                    mt-1
                    text-[11px]
                    text-[#8A817B]
                  "
                >
                  🎓 {doctor.qualification}
                </p>

              </div>

            </div>


            {/* Consultation type */}

            <div
              className="
                min-w-[190px]
                border-l
                border-[#E8DDD6]
                px-5
              "
            >

              <p
                className="
                  text-[11px]
                  text-[#7D726B]
                "
              >
                Consultation Type
              </p>

              <p
                className="
                  mt-1
                  text-[14px]
                  font-semibold
                  text-[#4B2E2A]
                "
              >
                {doctor.consultation_type}
              </p>

            </div>


            {/* Fees */}

            <div
              className="
                min-w-[150px]
                border-l
                border-[#E8DDD6]
                px-5
              "
            >

              <p
                className="
                  text-[11px]
                  text-[#7D726B]
                "
              >
                Consultation Fees
              </p>

              <p
                className="
                  mt-1
                  text-[14px]
                  font-semibold
                  text-[#4B2E2A]
                "
              >
                {doctor.formatted_fees ||
                  `₹${doctor.consultation_fees}`}
              </p>

            </div>


            {/* Available slots */}

            <div
              className="
                min-w-[130px]
                border-l
                border-[#E8DDD6]
                px-5
              "
            >

              <p
                className="
                  text-[11px]
                  text-[#7D726B]
                "
              >
                Available Slots
              </p>

              <p
                className="
                  mt-1
                  text-[14px]
                  font-semibold
                  text-[#4B2E2A]
                "
              >
                {String(
                  doctor.available_slots
                ).padStart(2, "0")}
              </p>

            </div>


            {/* Working hours */}

            <div
              className="
                border-l
                border-[#E8DDD6]
                px-5
              "
            >

              <p
                className="
                  text-[11px]
                  text-[#7D726B]
                "
              >
                Working Hours
              </p>

              <p
                className="
                  mt-1
                  whitespace-nowrap
                  text-[14px]
                  font-semibold
                  text-[#4B2E2A]
                "
              >
                {doctor.working_hours}
              </p>

            </div>

          </div>

        )}


        {/* ========================================= */}
        {/* MAIN CONTENT */}
        {/* ========================================= */}

        <div
          className="
            grid
            grid-cols-[1.65fr_1fr]
            gap-4
          "
        >


          {/* ======================================= */}
          {/* LEFT - SCHEDULE */}
          {/* ======================================= */}

          <div
            className="
              overflow-hidden
              rounded-[15px]
              border
              border-[#E8DDD6]
              bg-white
            "
          >

            {/* Header */}

            <div
              className="
                grid
                grid-cols-[108px_1fr]
                border-b
                border-[#E8DDD6]
                bg-[#FFF9F4]
                text-[11px]
                font-medium
                text-[#4B2E2A]
              "
            >

              <div
                className="
                  px-5
                  py-3
                  text-center
                "
              >
                Time
              </div>

              <div
                className="
                  border-l
                  border-[#E8DDD6]
                  px-5
                  py-3
                "
              >
                Schedule
              </div>

            </div>


            {/* Schedule rows */}

            <div>

              {schedule.map(
                (slot, index) => {

                  const isConflict =
                    slot.status ===
                    "conflict";

                  const isSelected =
                    selectedSlot?.time ===
                    slot.time;

                  const isExpanded =
                    expandedSlots[slot.time];


                  return (

                    <div
                      key={
                        slot.appointment_id ||
                        `${slot.time}-${index}`
                      }
                      className="
                        grid
                        grid-cols-[108px_1fr]
                        border-b
                        border-[#EEE4DD]
                        last:border-b-0
                      "
                    >

                      {/* Time */}

                      <div
                        className="
                          flex
                          items-start
                          justify-center
                          px-3
                          py-5
                          text-[12px]
                          font-medium
                          text-[#4B2E2A]
                        "
                      >
                        {slot.time}
                      </div>


                      {/* Schedule */}

                      <div
                        className="
                          border-l
                          border-[#EEE4DD]
                          p-3
                        "
                      >

                        {isConflict ? (

                          <div
                            className={`
                              rounded-xl
                              border
                              border-dashed
                              border-red-300
                              bg-[#FFF9F8]
                              p-3
                              ${
                                isSelected
                                  ? "ring-1 ring-[#D9776A]"
                                  : ""
                              }
                            `}
                          >

                            {/* Conflict header */}

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                              "
                            >

                              <div>

                                <p
                                  className="
                                    text-[12px]
                                    font-medium
                                    text-red-600
                                  "
                                >
                                  {slot.time}
                                  {" - "}
                                  {slot.time}
                                </p>

                                <div
                                  className="
                                    mt-1
                                    flex
                                    items-center
                                    gap-1
                                    text-[11px]
                                    text-red-600
                                  "
                                >

                                  <HiOutlineExclamationCircle
                                    size={14}
                                  />

                                  Multiple bookings
                                  for this slot

                                </div>

                              </div>


                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleSlot(
                                    slot
                                  )
                                }
                                className="
                                  flex
                                  items-center
                                  gap-1
                                  text-[11px]
                                  font-medium
                                  text-[#4B2E2A]
                                "
                              >

                                View Requests
                                {" "}
                                ({slot.requests?.length || 0})

                                {isExpanded ? (

                                  <HiOutlineChevronUp
                                    size={14}
                                  />

                                ) : (

                                  <HiOutlineChevronDown
                                    size={14}
                                  />

                                )}

                              </button>

                            </div>


                            {/* Requests */}

                            {isExpanded && (

                              <div
                                className="
                                  mt-3
                                  space-y-2
                                "
                              >

                                {slot.requests?.map(
                                  (request) => (

                                    <button
                                      key={
                                        request.appointment_id
                                      }
                                      type="button"
                                      onClick={() => {

                                        setSelectedSlot(
                                          slot
                                        );

                                        handleSelectRequest(
                                          request
                                        );

                                      }}
                                      className={`
                                        w-full
                                        rounded-xl
                                        border
                                        p-3
                                        text-left
                                        transition
                                        ${
                                          selectedRequest
                                            ?.appointment_id ===
                                          request.appointment_id
                                            ? "border-[#8A4F32] bg-[#FFF2E9]"
                                            : "border-[#EBDDD5] bg-white"
                                        }
                                      `}
                                    >

                                      <div
                                        className="
                                          flex
                                          items-center
                                          justify-between
                                        "
                                      >

                                        <div>

                                          <p
                                            className="
                                              text-[12px]
                                              font-medium
                                              text-[#4B2E2A]
                                            "
                                          >
                                            {request.patient_name}

                                            {selectedRequest
                                              ?.appointment_id ===
                                              request.appointment_id && (
                                              <span className="ml-1">
                                                (Selected)
                                              </span>
                                            )}

                                          </p>

                                          <p
                                            className="
                                              mt-1
                                              text-[10px]
                                              text-[#81756E]
                                            "
                                          >
                                            Patient ID:{" "}
                                            {request.patient_code}
                                            {" | "}
                                            Requested at{" "}
                                            {request.requested_at}
                                          </p>

                                        </div>


                                        <span
                                          className="
                                            text-[10px]
                                            text-[#5D4A42]
                                          "
                                        >
                                          {request.type}
                                        </span>

                                      </div>

                                    </button>

                                  )
                                )}

                              </div>

                            )}

                          </div>

                        ) : (

                          <div
                            className={`
                              flex
                              items-center
                              justify-between
                              rounded-xl
                              border
                              px-3
                              py-2.5
                              ${
                                slot.status === "booked"
                                  ? "border-green-200 bg-[#EEFFF1]"
                                  : "border-[#F1DDC9] bg-[#FFF8ED]"
                              }
                            `}
                          >

                            <div>

                              <p
                                className={`
                                  text-[12px]
                                  font-medium
                                  ${
                                    slot.status ===
                                    "booked"
                                      ? "text-[#1B5D2B]"
                                      : "text-[#684331]"
                                  }
                                `}
                              >
                                {slot.slot_range}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-[11px]
                                  text-[#4B2E2A]
                                "
                              >
                                {slot.patient_name}

                                {slot.type && (
                                  <>
                                    {" "}
                                    ({slot.type})
                                  </>
                                )}

                              </p>

                            </div>


                            <div
                              className="
                                flex
                                items-center
                                gap-1
                                text-[10px]
                              "
                            >

                              <span>
                                {getStatusLabel(
                                  slot.status
                                )}
                              </span>

                              {slot.status ===
                              "booked" ? (

                                <HiOutlineCheckCircle
                                  size={15}
                                  className="
                                    text-green-700
                                  "
                                />

                              ) : (

                                <HiOutlineClock
                                  size={15}
                                  className="
                                    text-[#8A4F32]
                                  "
                                />

                              )}

                            </div>

                          </div>

                        )}

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          </div>


          {/* ======================================= */}
          {/* RIGHT SIDE */}
          {/* ======================================= */}

          <div
            className="
              space-y-4
            "
          >


            {/* ===================================== */}
            {/* SELECT PATIENT */}
            {/* ===================================== */}

            <div
              className="
                rounded-[15px]
                border
                border-[#E8DDD6]
                bg-white
                p-4
              "
            >

              {selectedSlot ? (

                <>

                  {/* Alert */}

                  <div
                    className="
                      rounded-lg
                      border
                      border-red-100
                      bg-[#FFF5F3]
                      px-3
                      py-3
                      text-[11px]
                      leading-4
                      text-red-600
                    "
                  >

                    <div
                      className="
                        flex
                        gap-2
                      "
                    >

                      <HiOutlineExclamationCircle
                        size={15}
                        className="
                          mt-[1px]
                          shrink-0
                        "
                      />

                      <span>
                        {selectedSlot.alert_message ||
                          `This time slot has ${
                            selectedSlot.requests?.length ||
                            0
                          } booking requests. Please select one patient to confirm the appointment.`}
                      </span>

                    </div>

                  </div>


                  {/* Heading */}

                  <h3
                    className="
                      mt-5
                      border-b
                      border-[#EEE4DD]
                      pb-3
                      text-[13px]
                      font-medium
                      text-[#4B2E2A]
                    "
                  >
                    Select Patient to Confirm
                  </h3>


                  {/* Patient requests */}

                  <div>

                    {selectedSlot.requests?.map(
                      (request) => {

                        const selected =
                          selectedRequest
                            ?.appointment_id ===
                          request.appointment_id;


                        return (

                          <button
                            key={
                              request.appointment_id
                            }
                            type="button"
                            onClick={() =>
                              handleSelectRequest(
                                request
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              border-b
                              border-[#EEE4DD]
                              py-3
                              text-left
                            "
                          >

                            {/* Radio */}

                            <span
                              className={`
                                flex
                                h-[19px]
                                w-[19px]
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                ${
                                  selected
                                    ? "border-[#4B2E2A]"
                                    : "border-[#4B2E2A]"
                                }
                              `}
                            >

                              {selected && (

                                <span
                                  className="
                                    h-[9px]
                                    w-[9px]
                                    rounded-full
                                    bg-[#4B2E2A]
                                  "
                                />

                              )}

                            </span>


                            {/* Patient */}

                            <div
                              className="
                                flex-1
                              "
                            >

                              <p
                                className="
                                  text-[12px]
                                  font-medium
                                  text-[#4B2E2A]
                                "
                              >
                                {request.patient_name}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-[10px]
                                  text-[#81756E]
                                "
                              >
                                Patient ID:{" "}
                                {request.patient_code}
                              </p>

                            </div>


                            {/* Requested */}

                            <span
                              className="
                                rounded-lg
                                border
                                border-green-200
                                bg-green-50
                                px-2
                                py-1
                                text-[9px]
                                text-green-700
                              "
                            >
                              Requested at{" "}
                              {request.requested_at}
                            </span>

                          </button>

                        );

                      }
                    )}

                  </div>


                  {/* Confirm */}

                  <button
                    type="button"
                    disabled={
                      !selectedRequest ||
                      loading
                    }
                    onClick={
                      handleConfirm
                    }
                    className="
                      mt-5
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#8A4F32]
                      py-3
                      text-[12px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#6F3E29]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {loading
                      ? "Confirming..."
                      : "Confirm Appointment"}

                    <HiOutlineArrowRight
                      size={16}
                    />

                  </button>


                  {/* Notification text */}

                  <div
                    className="
                      mt-3
                      rounded-lg
                      bg-[#FFF5E8]
                      px-3
                      py-3
                      text-[10px]
                      leading-4
                      text-[#684331]
                    "
                  >
                    Once confirmed, the patient will
                    receive a notification with the
                    appointment details.
                  </div>

                </>

              ) : (

                <div
                  className="
                    py-10
                    text-center
                    text-sm
                    text-[#8A817B]
                  "
                >
                  Select a conflict slot to view
                  booking requests.
                </div>

              )}

            </div>


            {/* ===================================== */}
            {/* APPOINTMENT HISTORY */}
            {/* ===================================== */}

            <div
              className="
                overflow-hidden
                rounded-[15px]
                border
                border-[#E8DDD6]
                bg-white
              "
            >

              <div
                className="
                  border-b
                  border-[#EEE4DD]
                  px-4
                  py-4
                "
              >

                <h3
                  className="
                    text-[13px]
                    font-semibold
                    text-[#4B2E2A]
                  "
                >
                  Appointment History with Doctor
                </h3>

              </div>


              <div>

                {history.length === 0 ? (

                  <div
                    className="
                      px-4
                      py-8
                      text-center
                      text-[11px]
                      text-[#8A817B]
                    "
                  >
                    No appointment history found.
                  </div>

                ) : (

                  history
                    .slice(0, 5)
                    .map(
                      (item) => (

                        <div
                          key={
                            item.appointment_id
                          }
                          className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-[#EEE4DD]
                            px-4
                            py-4
                            last:border-b-0
                          "
                        >

                          <div>

                            <p
                              className="
                                text-[12px]
                                font-medium
                                text-[#4B2E2A]
                              "
                            >
                              {item.patient_name}
                            </p>

                            <p
                              className="
                                mt-1
                                text-[10px]
                                text-[#81756E]
                              "
                            >
                              (Patient ID:{" "}
                              {item.patient_code})
                            </p>

                          </div>


                          <div
                            className="
                              text-right
                            "
                          >

                            <p
                              className="
                                text-[10px]
                                text-[#6D625C]
                              "
                            >
                              {item.date}
                            </p>

                            <p
                              className="
                                mt-1
                                text-[10px]
                                text-[#6D625C]
                              "
                            >
                              {item.time}
                            </p>

                          </div>

                        </div>

                      )
                    )

                )}

              </div>


              {history.length > 5 && (

                <button
                  type="button"
                  className="
                    w-full
                    border-t
                    border-[#EEE4DD]
                    px-4
                    py-4
                    text-right
                    text-[10px]
                    font-medium
                    text-[#4B2E2A]
                  "
                >
                  View Details
                  {" "}
                  <HiOutlineArrowRight
                    className="
                      inline
                    "
                    size={13}
                  />
                </button>

              )}

            </div>

          </div>

        </div>


        {/* ========================================= */}
        {/* LOADING */}
        {/* ========================================= */}

        {loading && (

          <div
            className="
              fixed
              bottom-5
              right-5
              rounded-xl
              bg-[#6A3F2D]
              px-5
              py-3
              text-sm
              font-medium
              text-white
              shadow-lg
            "
          >
            Loading...
          </div>

        )}

      </div>

    </DashboardLayout>

  );

};


export default AppointmentConfirmation;