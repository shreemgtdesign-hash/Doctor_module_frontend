import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronRight, Clock3, CalendarDays } from "lucide-react";


import {
  loadFrontOfficeDoctors,
  loadFrontOfficeDoctorTimeSlots,
  createFrontOfficeDirectWalkInPatient,
  createFrontOfficeDirectWalkInMedicinePurchase,
  createFrontOfficeDirectWalkInTherapyBooking,
  loadFrontOfficeTherapies,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";
import {
  selectFrontOfficeDoctors,
  selectDoctorTimeSlots,
  selectDoctorSlotsLoading,
  selectWalkInCreating,
  selectWalkInSuccess,
  selectWalkInMessage,
  selectWalkInError,



  selectFrontOfficeTherapies,
  selectFrontOfficeTherapiesLoading,
 
} from "../../../redux/frontOffice/frontOfficeAppointmentSlice";
import DashboardLayout from "../../../components/Layout/DashboardLayout";

const DirectWalkIn = () => {
  const dispatch = useDispatch();
  const therapies = useSelector(
  selectFrontOfficeTherapies
);

const therapiesLoading = useSelector(
  selectFrontOfficeTherapiesLoading
);
  const doctors = useSelector(selectFrontOfficeDoctors);
  const doctorSlots = useSelector(selectDoctorTimeSlots);
  const slotsLoading = useSelector(selectDoctorSlotsLoading);

  const walkInCreating = useSelector(selectWalkInCreating);
  const walkInSuccess = useSelector(selectWalkInSuccess);
  const walkInMessage = useSelector(selectWalkInMessage);
  const walkInError = useSelector(selectWalkInError);

  const [formType, setFormType] = useState("appointment");

  const [form, setForm] = useState({
    therapy_id: "",
    patient_appointment_date: "",
    patient_slot_time: "",
    patient_name: "",
    age: "",
    gender: "Female",
    mobile: "",
    email: "",
    reason_for_visit: "",
    referral_code: "",
    patient_code: "",

    address: "",
    country: "",
    city: "",
    postal_code: "",

    allergies: "",

    bp: "",
    sugar: "",
    pulse: "",
    spo2: "",
    temperature: "",
    body_toxicity: "",
    ayurvedic_body_type: "",
    patient_reason_for_visit: "",
    doctor_id: "",
    appointment_type: "In-person",
    appointment_date: new Date()
      .toISOString()
      .split("T")[0],
    slot_time: "",

    comments: "",
  });

  useEffect(() => {
    dispatch(
      loadFrontOfficeDoctors({
        active: true,
      })
    );
  }, [dispatch]);
  useEffect(() => {
    if (formType === "therapy") {
      dispatch(loadFrontOfficeTherapies());
    }
  }, [dispatch, formType]);

  useEffect(() => {
    if (!form.doctor_id || !form.appointment_date) {
      return;
    }

    dispatch(
      loadFrontOfficeDoctorTimeSlots({
        doctorId: form.doctor_id,
        date: form.appointment_date,
      })
    );

    setForm((prev) => ({
      ...prev,
      slot_time: "",
    }));
  }, [
    dispatch,
    form.doctor_id,
    form.appointment_date,
  ]);

  useEffect(() => {
    if (walkInSuccess) {
      setForm((prev) => ({
        ...prev,
        patient_name: "",
        age: "",
        mobile: "",
        email: "",
        referral_code: "",
        address: "",
        country: "",
        city: "",
        postal_code: "",
        allergies: "",
        bp: "",
        sugar: "",
        pulse: "",
        spo2: "",
        temperature: "",
        body_toxicity: "",
        ayurvedic_body_type: "",
        doctor_id: "",
        slot_time: "",
        patient_slot_time:"",
        reason_for_visit: "",
        patient_reason_for_visit: "",

        comments: "",
      }));
    }
  }, [walkInSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmitMedicinePurchase = async (e) => {
    e.preventDefault();

    const payload = {
      reason_for_visit: "Medicine purchase",

      appointment_date: form.appointment_date,
      slot_time: form.slot_time,
      patient_slot_time: form.patient_slot_time,


      patient_name: form.patient_name,
      age: Number(form.age),
      gender: form.gender,
      mobile: form.mobile,
      email: form.email,

      patient_code: form.patient_code || "",
      referral_code: form.referral_code || "",

      address: form.address,
      country: form.country,
      city: form.city,
      postal_code: form.postal_code,
    };

    try {
      await dispatch(
        createFrontOfficeDirectWalkInMedicinePurchase(payload)
      ).unwrap();
    } catch (error) {
      console.error(
        "Walk-in medicine purchase error:",
        error
      );
    }
  };

  const handleGender = (gender) => {
    setForm((prev) => ({
      ...prev,
      gender,
    }));
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();

    const allergies = form.allergies
      ? form.allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
      : [];

    const payload = {
      patient_name: form.patient_name,
      age: Number(form.age),
      gender: form.gender,
      mobile: form.mobile,
      email: form.email,

      ...(form.referral_code && {
        referral_code: form.referral_code,
      }),

      address: form.address,
      country: form.country,
      city: form.city,
      postal_code: form.postal_code,

      allergies,

      bp: form.bp,
      sugar: form.sugar,
      pulse: form.pulse,
      spo2: form.spo2,
      temperature: form.temperature,
      body_toxicity: form.body_toxicity,
      ayurvedic_body_type: form.ayurvedic_body_type,

      doctor_id: form.doctor_id,
      appointment_type: form.appointment_type,
      appointment_date: form.appointment_date,
      slot_time: form.slot_time,
      reason_for_visit: form.reason_for_visit,
      patient_reason_for_visit: form.patient_reason_for_visit,
      comments: form.comments,
    };

    try {
      await dispatch(
        createFrontOfficeDirectWalkInPatient(payload)
      ).unwrap();
    } catch (error) {
      console.error("Walk-in appointment error:", error);
    }
  };

  const selectedDoctor = doctors?.find(
    (doctor) => doctor.id === form.doctor_id
  );

  const handleSubmitTherapyBooking = async (e) => {
    e.preventDefault();

    const allergies = form.allergies
      ? form.allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
      : [];

    const selectedTherapy = therapies?.find(
      (therapy) =>
        therapy.id === form.therapy_id
    );

    const payload = {
      reason_for_visit: "Therapy booking",

      appointment_date: form.appointment_date,
      slot_time: form.slot_time,

      patient_name: form.patient_name,
      age: Number(form.age),
      gender: form.gender,
      mobile: form.mobile,
      email: form.email,

      patient_code: form.patient_code || "",
      referral_code: form.referral_code || "",

      address: form.address,
      country: form.country,
      city: form.city,
      postal_code: form.postal_code,

      allergies,

      bp: form.bp,
      sugar: form.sugar,
      pulse: form.pulse,
      spo2: form.spo2,
      temperature: form.temperature,
      body_toxicity: form.body_toxicity,
      ayurvedic_body_type: form.ayurvedic_body_type,

      therapy: selectedTherapy?.name || "",

      patient_appointment_date:
        form.patient_appointment_date,

      patient_slot_time:
        form.patient_slot_time,

      patient_reason_for_visit:
        form.patient_reason_for_visit,

      comments: form.comments,
    };

    try {
      await dispatch(
        createFrontOfficeDirectWalkInTherapyBooking(payload)
      ).unwrap();
    } catch (error) {
      console.error(
        "Walk-in therapy booking error:",
        error
      );
    }
  };

  return (
    <DashboardLayout role="frontoffice">
      <div className="min-h-full bg-white text-[#4B2418]">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="flex items-start justify-between border-b border-[#F0E3D9] px-4 py-5">
          <div>
            <h2 className="text-[15px] font-semibold text-[#292929]">
              Patient Information
            </h2>

            <p className="mt-1 text-[11px] text-gray-500">
              Record patient&apos;s details.
            </p>
          </div>

          <div className="flex items-end gap-7">

            <div>
              <label className="mb-1.5 block text-[11px]">
                Reason for visit
              </label>

              <div className="relative">
                <select
                  value={formType}
                  onChange={(e) => {
                    setFormType(e.target.value);
                  }}
                  className="h-[40px] w-[145px] appearance-none rounded-lg border border-[#E8D9CF] bg-white px-3 pr-8 text-[11px] outline-none"
                >
                  <option value="appointment">
                    Appointment Booking
                  </option>

                  <option value="medicine">
                    Medicine purchase
                  </option>
                  <option value="therapy">
                    Therapy Booking
                  </option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-3 text-[#633A2B]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px]">
                Date
              </label>

              <div className="flex h-[40px] items-center gap-2 rounded-lg border border-[#E8D9CF] px-3 text-[11px]">
                <CalendarDays size={13} />
                <span>
                  {new Date(
                    `${form.appointment_date}T00:00:00`
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px]">
                Time
              </label>

              <div className="flex h-[40px] min-w-[94px] items-center gap-2 rounded-lg border border-[#E8D9CF] px-3 text-[11px]">
                <Clock3 size={13} />

                <span>
                  {form.slot_time
                    ? formatTime(form.slot_time)
                    : "--:--"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* APPOINTMENT BOOKING */}
        {/* ========================================= */}

        {formType === "appointment" && (
          <form onSubmit={handleSubmitAppointment}>

            <div className="px-4">

              {/* Patient details */}

              <Section title="">

                <div className="grid grid-cols-12 gap-x-7 gap-y-5">

                  <Field
                    label="Patient Name"
                    name="patient_name"
                    value={form.patient_name}
                    onChange={handleChange}
                    span="col-span-4"
                  />

                  <Field
                    label="Age"
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    span="col-span-4"
                  />

                  <div className="col-span-4">
                    <label className="mb-2 block text-[11px]">
                      Gender
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleGender("Female")
                        }
                        className={`h-[39px] rounded-xl border px-4 text-[11px] ${form.gender === "Female"
                          ? "border-[#603325] bg-[#FFF9F5] font-medium"
                          : "border-[#E8D9CF]"
                          }`}
                      >
                        ♀ Female
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleGender("Male")
                        }
                        className={`h-[39px] rounded-xl border px-5 text-[11px] ${form.gender === "Male"
                          ? "border-[#603325] bg-[#FFF9F5] font-medium"
                          : "border-[#E8D9CF]"
                          }`}
                      >
                        ♂ Male
                      </button>
                    </div>
                  </div>

                  <Field
                    label="Mobile Number"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    span="col-span-5"
                  />

                  <Field
                    label="Email ID"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    span="col-span-7"
                  />



                  <Field
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter Address"
                    span="col-span-12"
                  />

                  <Field
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Enter Country"
                    span="col-span-4"
                  />

                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter City"
                    span="col-span-4"
                  />

                  <Field
                    label="Postal Code"
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    placeholder="Enter Postal Code"
                    span="col-span-4"
                  />

                  <Field
                    label="Known Allergies/Conditions"
                    name="allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    placeholder="Enter allergies"
                    span="col-span-12"
                  />

                </div>

              </Section>

              {/* ========================================= */}
              {/* VITALS */}
              {/* ========================================= */}

              <Section title="Vitals">

                <div className="grid grid-cols-5 gap-7">

                  <Field
                    label="BP"
                    name="bp"
                    value={form.bp}
                    onChange={handleChange}
                    placeholder="Enter Value"
                  />

                  <Field
                    label="Sugar"
                    name="sugar"
                    value={form.sugar}
                    onChange={handleChange}
                    placeholder="Enter Value"
                  />

                  <Field
                    label="Pulse"
                    name="pulse"
                    value={form.pulse}
                    onChange={handleChange}
                    placeholder="Enter Value"
                  />

                  <Field
                    label="SpO2"
                    name="spo2"
                    value={form.spo2}
                    onChange={handleChange}
                    placeholder="Enter Value"
                  />

                  <Field
                    label="Temperature"
                    name="temperature"
                    value={form.temperature}
                    onChange={handleChange}
                    placeholder="Enter Value"
                  />

                </div>

                <div className="mt-6 grid grid-cols-2 gap-7">

                  <Field
                    label="Body Toxicity"
                    name="body_toxicity"
                    value={form.body_toxicity}
                    onChange={handleChange}
                    placeholder="Enter Value"
                  />

                  <SelectField
                    label="Ayurvedic Body Type"
                    name="ayurvedic_body_type"
                    value={form.ayurvedic_body_type}
                    onChange={handleChange}
                    options={[
                      "Vata",
                      "Pitta",
                      "Kapha",
                      "Vata-Pitta",
                      "Pitta-Kapha",
                      "Vata-Kapha",
                      "Tridosha",
                    ]}
                  />

                </div>

              </Section>

              {/* ========================================= */}
              {/* APPOINTMENT DETAILS */}
              {/* ========================================= */}

              <Section title="Appointment Details">

                <div className="grid grid-cols-12 gap-x-7 gap-y-6">

                  {/* Doctor */}

                  <div className="col-span-4">
                    <SelectField
                      label="Doctor"
                      name="doctor_id"
                      value={form.doctor_id}
                      onChange={handleChange}
                      placeholder="Select Doctor"
                      options={doctors || []}
                      optionValue="id"
                      optionLabel="name"
                    />

                    {selectedDoctor && (
                      <p className="mt-1 text-[9px] text-gray-500">
                        {selectedDoctor.specialization}
                      </p>
                    )}
                  </div>

                  <SelectField
                    label="Appointment Type"
                    name="appointment_type"
                    value={form.appointment_type}
                    onChange={handleChange}
                    options={[
                      "In-person",
                      "Video call",
                      "Home visit",
                    ]}
                    span="col-span-4"
                  />

                  <Field
                    label="Date"
                    name="appointment_date"
                    type="date"
                    value={form.appointment_date}
                    onChange={handleChange}
                    span="col-span-4"
                  />

                  {/* TIME SLOT */}

                  <div className="col-span-4">
                    <label className="mb-2 block text-[11px]">
                      Time
                    </label>

                    <div className="relative">
                      <select
                        name="slot_time"
                        value={form.slot_time}
                        onChange={handleChange}
                        disabled={
                          !form.doctor_id ||
                          !form.appointment_date ||
                          slotsLoading
                        }
                        className="h-[39px] w-full appearance-none rounded-lg border border-[#E8D9CF] bg-white px-3 pr-8 text-[11px] outline-none disabled:bg-gray-50"
                      >
                        <option value="">
                          {slotsLoading
                            ? "Loading slots..."
                            : "Select Slot"}
                        </option>

                        {doctorSlots
                          .filter(
                            (slot) =>
                              slot.is_available
                          )
                          .map((slot) => (
                            <option
                              key={slot.slot_time}
                              value={slot.slot_time}
                            >
                              {slot.formatted_time}
                            </option>
                          ))}
                      </select>

                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-3"
                      />
                    </div>

                    {!slotsLoading &&
                      form.doctor_id &&
                      doctorSlots.length > 0 && (
                        <p className="mt-1 text-[9px] text-gray-500">
                          {
                            doctorSlots.filter(
                              (slot) =>
                                slot.is_available
                            ).length
                          }{" "}
                          slots available
                        </p>
                      )}
                  </div>

                  <Field
                    label="Reason for visit"
                    name="patient_reason_for_visit"
                    value={form.patient_reason_for_visit}
                    onChange={handleChange}
                    placeholder="Enter details"
                    span="col-span-8"
                  />

                  <div className="col-span-12">
                    <label className="mb-2 block text-[11px]">
                      Other Comments (Optional)
                    </label>

                    <textarea
                      name="comments"
                      value={form.comments}
                      onChange={handleChange}
                      placeholder="Enter comments"
                      rows={2}
                      className="w-full resize-none rounded-xl border border-[#E8D9CF] px-3 py-3 text-[11px] outline-none"
                    />
                  </div>

                </div>

              </Section>

            </div>

            {/* ========================================= */}
            {/* SUCCESS / ERROR */}
            {/* ========================================= */}

            {walkInSuccess && (
              <div className="mx-4 mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[11px] text-green-700">
                {walkInMessage}
              </div>
            )}

            {walkInError && (
              <div className="mx-4 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[11px] text-red-700">
                {typeof walkInError === "string"
                  ? walkInError
                  : walkInError?.message ||
                  "Failed to create appointment."}
              </div>
            )}

            {/* ========================================= */}
            {/* FOOTER */}
            {/* ========================================= */}

            <div className="sticky bottom-0 flex justify-end gap-4 border-t border-[#EEE3DC] bg-white px-4 py-4">

              <button
                type="button"
                className="h-[40px] w-[178px] rounded-xl border border-[#E8D9CF] bg-[#FFF9F5] text-[11px] font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={walkInCreating}
                className="flex h-[40px] w-[178px] items-center justify-center gap-2 rounded-xl bg-[#8A5038] text-[11px] font-medium text-white disabled:opacity-60"
              >
                {walkInCreating
                  ? "Creating..."
                  : "Confirm Appointment"}

                {!walkInCreating && (
                  <ChevronRight size={15} />
                )}
              </button>

            </div>

          </form>
        )}

        {/* ========================================= */}
        {/* MEDICINE PURCHASE */}
        {/* ========================================= */}

        {formType === "medicine" && (
          <MedicinePurchaseForm
            form={form}
            handleChange={handleChange}
            handleGender={handleGender}
             handleSubmitMedicinePurchase={
      handleSubmitMedicinePurchase
    } />
        )}

        {/* ========================================= */}
{/* THERAPY BOOKING */}
{/* ========================================= */}

{formType === "therapy" && (
  <TherapyBookingForm
    form={form}
    handleChange={handleChange}
    handleGender={handleGender}
    handleSubmitTherapyBooking={
      handleSubmitTherapyBooking
    }
    therapies={therapies}
    therapiesLoading={therapiesLoading}
 
  />
)}

      </div>
    </DashboardLayout>
  );
};


// =====================================================
// FIELD
// =====================================================

const Field = ({
  label,
  name,
  value = "",
  onChange,
  placeholder = "",
  type = "text",
  disabled = false,
  span = "",
}) => {
  return (
    <div className={span}>
      <label className="mb-2 block text-[11px]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="h-[39px] w-full rounded-lg border border-[#E8D9CF] px-3 text-[11px] outline-none placeholder:text-gray-400 disabled:bg-[#FAF7F4]"
      />
    </div>
  );
};


// =====================================================
// SELECT FIELD
// =====================================================

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  optionValue,
  optionLabel,
  span = "",
}) => {
  return (
    <div className={span}>
      <label className="mb-2 block text-[11px]">
        {label}
      </label>

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-[39px] w-full appearance-none rounded-lg border border-[#E8D9CF] bg-white px-3 pr-8 text-[11px] outline-none"
        >
          <option value="">
            {placeholder}
          </option>

          {options.map((option) => {
            const valueKey = optionValue
              ? option[optionValue]
              : option;

            const labelValue = optionLabel
              ? option[optionLabel]
              : option;

            return (
              <option
                key={valueKey}
                value={valueKey}
              >
                {labelValue}
              </option>
            );
          })}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-3"
        />
      </div>
    </div>
  );
};


// =====================================================
// SECTION
// =====================================================

const Section = ({ title, children }) => {
  return (
    <div className="border-b border-[#F0E5DE] py-5">
      {title && (
        <h3 className="mb-5 text-[13px] font-semibold">
          {title}
        </h3>
      )}

      {children}
    </div>
  );
};


// =====================================================
// MEDICINE PURCHASE
// =====================================================

// =====================================================
// MEDICINE PURCHASE
// =====================================================

const MedicinePurchaseForm = ({
  form,
  handleChange,
  handleGender,
  handleSubmitMedicinePurchase,
  medicinePurchaseCreating,
  medicinePurchaseSuccess,
  medicinePurchaseMessage,
  medicinePurchaseError,
}) => {
  return (
    <form onSubmit={handleSubmitMedicinePurchase}>
      <div className="px-4">

        {/* ========================================= */}
        {/* PATIENT DETAILS */}
        {/* ========================================= */}

        <Section title="">

          <div className="grid grid-cols-12 gap-x-7 gap-y-5">

            {/* Patient Name */}

            <Field
              label="Patient Name"
              name="patient_name"
              value={form.patient_name}
              onChange={handleChange}
              placeholder="Enter patient name"
              span="col-span-4"
            />

            {/* Age */}

            <Field
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter age"
              span="col-span-4"
            />

            {/* Gender */}

            <div className="col-span-4">

              <label className="mb-2 block text-[11px]">
                Gender
              </label>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    handleGender("Female")
                  }
                  className={`
                    h-[39px]
                    rounded-xl
                    border
                    px-4
                    text-[11px]
                    ${
                      form.gender === "Female"
                        ? "border-[#603325] bg-[#FFF9F5] font-medium"
                        : "border-[#E8D9CF] bg-white"
                    }
                  `}
                >
                  ♀ Female
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleGender("Male")
                  }
                  className={`
                    h-[39px]
                    rounded-xl
                    border
                    px-5
                    text-[11px]
                    ${
                      form.gender === "Male"
                        ? "border-[#603325] bg-[#FFF9F5] font-medium"
                        : "border-[#E8D9CF] bg-white"
                    }
                  `}
                >
                  ♂ Male
                </button>

              </div>

            </div>

            {/* Mobile Number */}

            <Field
              label="Mobile Number"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              span="col-span-6"
            />

            {/* Email ID */}

            <Field
              label="Email ID"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              span="col-span-6"
            />

            {/* Patient ID */}

           

            {/* Address */}

            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter Address"
              span="col-span-12"
            />

            {/* Country */}

            <Field
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Enter Country"
              span="col-span-4"
            />

            {/* City */}

            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter City"
              span="col-span-4"
            />

            {/* Postal Code */}

            <Field
              label="Postal Code"
              name="postal_code"
              value={form.postal_code}
              onChange={handleChange}
              placeholder="Enter Postal Code"
              span="col-span-4"
            />

          </div>

        </Section>


        {/* ========================================= */}
        {/* PURCHASE DETAILS */}
        {/* ========================================= */}

        <Section title="Purchase Details">

          <div className="grid grid-cols-12 gap-x-7 gap-y-5">

            {/* Date */}

            <Field
              label="Date"
              name="appointment_date"
              type="date"
              value={form.appointment_date}
              onChange={handleChange}
              span="col-span-6"
            />

            {/* Time */}

            <Field
              label="Time"
              name="patient_slot_time"
              type="time"
              value={form.patient_slot_time}
              onChange={handleChange}
              span="col-span-6"
            />

            {/* Reason */}

            <Field
              label="Reason for Visit"
              name="reason_for_visit"
              value="Medicine purchase"
              onChange={handleChange}
              disabled
              span="col-span-12"
            />

          </div>

        </Section>


        {/* ========================================= */}
        {/* SUCCESS / ERROR */}
        {/* ========================================= */}

        {medicinePurchaseSuccess && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[11px] text-green-700">
            {medicinePurchaseMessage}
          </div>
        )}

        {medicinePurchaseError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[11px] text-red-700">
            {typeof medicinePurchaseError === "string"
              ? medicinePurchaseError
              : medicinePurchaseError?.message ||
                "Failed to create medicine purchase."}
          </div>
        )}


        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <div
          className="
            sticky
            bottom-0
            flex
            justify-end
            gap-4
            border-t
            border-[#EEE3DC]
            bg-white
            px-4
            py-4
          "
        >

          <button
            type="button"
            className="
              h-[40px]
              w-[178px]
              rounded-xl
              border
              border-[#E8D9CF]
              bg-[#FFF9F5]
              text-[11px]
              font-medium
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={medicinePurchaseCreating}
            className="
              flex
              h-[40px]
              w-[178px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#8A5038]
              text-[11px]
              font-medium
              text-white
              disabled:opacity-60
            "
          >
            {medicinePurchaseCreating
              ? "Creating..."
              : "Confirm Purchase"}

            {!medicinePurchaseCreating && (
              <ChevronRight size={15} />
            )}
          </button>

        </div>

      </div>
    </form>
  );
};

// =====================================================
// TIME FORMATTER
// =====================================================

const formatTime = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0
  );

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

// =====================================================
// THERAPY BOOKING
// =====================================================

const TherapyBookingForm = ({
  form,
  handleChange,
  handleGender,
  handleSubmitTherapyBooking,
  therapies,
  therapiesLoading,
  therapyBookingCreating,
  therapyBookingSuccess,
  therapyBookingMessage,
  therapyBookingError,
}) => {
  return (
    <form onSubmit={handleSubmitTherapyBooking}>
      <div className="px-4">

        {/* ========================================= */}
        {/* PATIENT DETAILS */}
        {/* ========================================= */}

        <Section title="">

          <div className="grid grid-cols-12 gap-x-7 gap-y-5">

            {/* Patient Name */}

            <Field
              label="Patient Name"
              name="patient_name"
              value={form.patient_name}
              onChange={handleChange}
              placeholder="Enter patient name"
              span="col-span-4"
            />

            {/* Age */}

            <Field
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter age"
              span="col-span-4"
            />

            {/* Gender */}

            <div className="col-span-4">

              <label className="mb-2 block text-[11px]">
                Gender
              </label>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    handleGender("Female")
                  }
                  className={`
                    h-[39px]
                    rounded-xl
                    border
                    px-4
                    text-[11px]
                    ${
                      form.gender === "Female"
                        ? "border-[#603325] bg-[#FFF9F5] font-medium"
                        : "border-[#E8D9CF] bg-white"
                    }
                  `}
                >
                  ♀ Female
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleGender("Male")
                  }
                  className={`
                    h-[39px]
                    rounded-xl
                    border
                    px-5
                    text-[11px]
                    ${
                      form.gender === "Male"
                        ? "border-[#603325] bg-[#FFF9F5] font-medium"
                        : "border-[#E8D9CF] bg-white"
                    }
                  `}
                >
                  ♂ Male
                </button>

              </div>

            </div>

            {/* Mobile Number */}

            <Field
              label="Mobile Number"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              span="col-span-5"
            />

            {/* Email ID */}

            <Field
              label="Email ID"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              span="col-span-7"
            />

            {/* Patient ID */}

          

            {/* Address */}

            <Field
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter Address"
              span="col-span-12"
            />

            {/* Country */}

            <Field
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Enter Country"
              span="col-span-4"
            />

            {/* City */}

            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter City"
              span="col-span-4"
            />

            {/* Postal Code */}

            <Field
              label="Postal Code"
              name="postal_code"
              value={form.postal_code}
              onChange={handleChange}
              placeholder="Enter Postal Code"
              span="col-span-4"
            />

            {/* Known Allergies */}

            <Field
              label="Known Allergies/Conditions"
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="Enter allergies"
              span="col-span-12"
            />

          </div>

        </Section>


        {/* ========================================= */}
        {/* VITALS */}
        {/* ========================================= */}

        <Section title="Vitals">

          <div className="grid grid-cols-5 gap-7">

            <Field
              label="BP"
              name="bp"
              value={form.bp}
              onChange={handleChange}
              placeholder="Enter Value"
            />

            <Field
              label="Sugar"
              name="sugar"
              value={form.sugar}
              onChange={handleChange}
              placeholder="Enter Value"
            />

            <Field
              label="Pulse"
              name="pulse"
              value={form.pulse}
              onChange={handleChange}
              placeholder="Enter Value"
            />

            <Field
              label="SpO2"
              name="spo2"
              value={form.spo2}
              onChange={handleChange}
              placeholder="Enter Value"
            />

            <Field
              label="Temperature"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              placeholder="Enter Value"
            />

          </div>

          <div className="mt-6 grid grid-cols-2 gap-7">

            <Field
              label="Body Toxicity"
              name="body_toxicity"
              value={form.body_toxicity}
              onChange={handleChange}
              placeholder="Enter Value"
            />

            <SelectField
              label="Ayurvedic Body Type"
              name="ayurvedic_body_type"
              value={form.ayurvedic_body_type}
              onChange={handleChange}
              options={[
                "Vata",
                "Pitta",
                "Kapha",
                "Vata-Pitta",
                "Pitta-Kapha",
                "Vata-Kapha",
                "Tridosha",
              ]}
            />

          </div>

        </Section>


        {/* ========================================= */}
        {/* THERAPY DETAILS */}
        {/* ========================================= */}

        <Section title="Therapy Details">

          <div className="grid grid-cols-12 gap-x-7 gap-y-6">

            {/* Therapy */}

            <div className="col-span-6">

              <SelectField
                label="Therapy"
                name="therapy_id"
                value={form.therapy_id}
                onChange={handleChange}
                placeholder={
                  therapiesLoading
                    ? "Loading therapies..."
                    : "Select Therapy"
                }
                options={therapies || []}
                optionValue="id"
                optionLabel="name"
              />

              {form.therapy_id && (
                <p className="mt-1 text-[9px] text-gray-500">
                  {
                    therapies?.find(
                      (therapy) =>
                        therapy.id === form.therapy_id
                    )?.duration_minutes
                  }{" "}
                  minutes
                  {" • "}
                  ₹
                  {
                    therapies?.find(
                      (therapy) =>
                        therapy.id === form.therapy_id
                    )?.price
                  }
                </p>
              )}

            </div>


            {/* Therapy Appointment Date */}

            <Field
              label="Date"
              name="patient_appointment_date"
              type="date"
              value={form.patient_appointment_date}
              onChange={handleChange}
              span="col-span-3"
            />


            {/* Therapy Appointment Time */}

            <Field
              label="Time"
              name="patient_slot_time"
              type="time"
              value={form.patient_slot_time}
              onChange={handleChange}
              span="col-span-3"
            />


            {/* Reason for Visit */}

            <Field
              label="Reason for visit"
              name="patient_reason_for_visit"
              value={form.patient_reason_for_visit}
              onChange={handleChange}
              placeholder="Enter details"
              span="col-span-12"
            />


            {/* Comments */}

            <div className="col-span-12">

              <label className="mb-2 block text-[11px]">
                Other Comments (Optional)
              </label>

              <textarea
                name="comments"
                value={form.comments}
                onChange={handleChange}
                placeholder="Enter comments"
                rows={2}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#E8D9CF]
                  px-3
                  py-3
                  text-[11px]
                  outline-none
                "
              />

            </div>

          </div>

        </Section>


        {/* ========================================= */}
        {/* SUCCESS / ERROR */}
        {/* ========================================= */}

        {therapyBookingSuccess && (
          <div className="
            mx-4
            mb-4
            rounded-lg
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-[11px]
            text-green-700
          ">
            {therapyBookingMessage}
          </div>
        )}

        {therapyBookingError && (
          <div className="
            mx-4
            mb-4
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-[11px]
            text-red-700
          ">
            {typeof therapyBookingError === "string"
              ? therapyBookingError
              : therapyBookingError?.message ||
                "Failed to create therapy booking."}
          </div>
        )}


        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <div
          className="
            sticky
            bottom-0
            flex
            justify-end
            gap-4
            border-t
            border-[#EEE3DC]
            bg-white
            px-4
            py-4
          "
        >

          <button
            type="button"
            className="
              h-[40px]
              w-[178px]
              rounded-xl
              border
              border-[#E8D9CF]
              bg-[#FFF9F5]
              text-[11px]
              font-medium
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              therapyBookingCreating ||
              therapiesLoading
            }
            className="
              flex
              h-[40px]
              w-[210px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#8A5038]
              text-[11px]
              font-medium
              text-white
              disabled:opacity-60
            "
          >

            {therapyBookingCreating
              ? "Creating..."
              : "Confirm Therapy Booking"}

            {!therapyBookingCreating && (
              <ChevronRight size={15} />
            )}

          </button>

        </div>

      </div>
    </form>
  );
};

export default DirectWalkIn;