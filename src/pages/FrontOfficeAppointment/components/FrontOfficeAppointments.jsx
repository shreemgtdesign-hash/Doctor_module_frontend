import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";


import {confirmFrontOfficeAppointment} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";

import {clearFrontOfficeAppointmentMessage} from "../../../redux/frontOffice/frontOfficeAppointmentSlice";
import DashboardLayout from "../../../components/Layout/DashboardLayout";


const FrontOfficeAppointments = () => {

  const dispatch = useDispatch();

  const {
    appointment,
    loading,
    error,
    success,
    message,
  } = useSelector(
    (state) =>
      state.frontOfficeAppointment
  );


  const [
    form,
    setForm,
  ] = useState({

    slot_time: "",

    patient_id: "",

    appointment_id: "",

  });


  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({

      ...prev,

      [name]: value,

    }));

  };


  const handleConfirm = async (e) => {

    e.preventDefault();

    if (
      !form.slot_time ||
      !form.patient_id ||
      !form.appointment_id
    ) {

      return;

    }

    dispatch(
      confirmFrontOfficeAppointment(
        form
      )
    );

  };


  useEffect(() => {

    if (!success) {
      return;
    }

    const timer =
      setTimeout(() => {

        dispatch(
          clearFrontOfficeAppointmentMessage()
        );

      }, 3000);

    return () =>
      clearTimeout(timer);

  }, [
    success,
    dispatch,
  ]);


  return (

    <DashboardLayout
      role="frontoffice"
    >

      <div
        className="
          min-h-screen
          bg-[#F7F7F7]
          p-6
        "
      >

        {/* HEADER */}

        <div className="mb-6">

          <h1
            className="
              text-[28px]
              font-bold
              text-[#4D2E23]
            "
          >
            Front Office Appointments
          </h1>

          <p
            className="
              mt-1
              text-[#8B7A70]
            "
          >
            Confirm patient appointment
            slots and manage appointments.
          </p>

        </div>


        {/* MESSAGE */}

        {message && (

          <div
            className="
              mb-5
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-5
              py-3
              text-green-700
            "
          >
            {message}
          </div>

        )}


        {/* ERROR */}

        {error && (

          <div
            className="
              mb-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-5
              py-3
              text-red-600
            "
          >
            {typeof error === "string"
              ? error
              : error?.message ||
                "Something went wrong."}
          </div>

        )}


        <div
          className="
            max-w-2xl
            rounded-[22px]
            border
            border-[#E7DBD3]
            bg-white
            p-6
            shadow-sm
          "
        >

          <h2
            className="
              text-[20px]
              font-semibold
              text-[#4D2E23]
            "
          >
            Confirm Appointment
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-[#8B7A70]
            "
          >
            Enter the appointment details
            to confirm the selected slot.
          </p>


          <form
            onSubmit={handleConfirm}
            className="mt-6 space-y-5"
          >

            {/* SLOT */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#4D2E23]
                "
              >
                Slot Time
              </label>

              <input
                type="text"
                name="slot_time"
                value={form.slot_time}
                onChange={handleChange}
                placeholder="9:30 AM"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#E2D5CE]
                  px-4
                  outline-none
                  focus:border-[#8A4F32]
                "
              />

            </div>


            {/* PATIENT */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#4D2E23]
                "
              >
                Patient ID
              </label>

              <input
                type="text"
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
                placeholder="Patient ID"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#E2D5CE]
                  px-4
                  outline-none
                  focus:border-[#8A4F32]
                "
              />

            </div>


            {/* APPOINTMENT */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#4D2E23]
                "
              >
                Appointment ID
              </label>

              <input
                type="text"
                name="appointment_id"
                value={
                  form.appointment_id
                }
                onChange={handleChange}
                placeholder="Appointment ID"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#E2D5CE]
                  px-4
                  outline-none
                  focus:border-[#8A4F32]
                "
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-[#8A4F32]
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#6A3F2D]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Confirming..."
                : "Confirm Appointment"}
            </button>

          </form>


          {/* RESULT */}

          {appointment && (

            <div
              className="
                mt-6
                rounded-xl
                bg-[#FFF8F3]
                p-4
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#4D2E23]
                "
              >
                Appointment Confirmed
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-[#7C6A61]
                "
              >
                Slot:{" "}
                {appointment.slot_time}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-[#7C6A61]
                "
              >
                Status:{" "}
                {appointment.status}
              </p>

            </div>

          )}

        </div>


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
            Processing...
          </div>

        )}

      </div>

    </DashboardLayout>

  );

};


export default FrontOfficeAppointments;