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
    HiOutlineArrowLeft,
    HiOutlineCloudArrowUp,
} from "react-icons/hi2";

import {
    loadFrontOfficeUpcomingAppointmentDetails,
    saveFrontOfficeUpcomingAppointmentDetailsThunk,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const PatientAppointmentDetails = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        appointmentId,
    } = useParams();


    // ==========================================
    // REDUX
    // ==========================================

    const saving =
        useSelector(
            (state) =>
                state.frontOfficeAppointment
                    ?.upcomingAppointmentDetailsSaving ||
                state.frontOfficeAppointment
                    ?.saving ||
                false
        );


    // ==========================================
    // API DETAILS
    // ==========================================

    const [
        appointmentDetails,
        setAppointmentDetails,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState(null);


    // ==========================================
    // VITALS FORM ONLY
    // ==========================================

    const [
        form,
        setForm,
    ] = useState({

        bp: "",
        sugar: "",
        pulse: "",
        spo2: "",
        temperature: "",
        body_toxicity: "",
        ayurvedic_body_type: "",

    });


    const [
        savingVitals,
        setSavingVitals,
    ] = useState(false);


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    // ==========================================
    // LOAD DETAILS
    // ==========================================

    useEffect(() => {

        const loadDetails = async () => {

            if (!appointmentId) {
                setLoading(false);
                return;
            }


            setLoading(true);
            setError(null);


            try {

                const response =
                    await dispatch(
                        loadFrontOfficeUpcomingAppointmentDetails(
                            appointmentId
                        )
                    ).unwrap();


                console.log(
                    "Upcoming Appointment Details API:",
                    response
                );


                /*
                 * API response:
                 *
                 * {
                 *   success: true,
                 *   data: {
                 *      personal_information: {},
                 *      vitals: {},
                 *      appointment_details: {}
                 *   }
                 * }
                 */


                const data =
                    response?.data ||
                    response ||
                    null;


                setAppointmentDetails(
                    data
                );


                // ======================================
                // SET VITALS
                // ======================================

                const apiVitals =
                    data?.vitals ||
                    {};


                setForm({

                    bp:
                        apiVitals.bp ||
                        "",

                    sugar:
                        apiVitals.sugar ||
                        "",

                    pulse:
                        apiVitals.pulse ||
                        "",

                    spo2:
                        apiVitals.spo2 ||
                        "",

                    temperature:
                        apiVitals.temperature ||
                        "",

                    body_toxicity:
                        apiVitals.body_toxicity ||
                        "",

                    ayurvedic_body_type:
                        apiVitals.ayurvedic_body_type ||
                        "",

                });

            } catch (loadError) {

                console.error(
                    "Failed to load appointment details:",
                    loadError
                );


                setError(
                    loadError
                );

            } finally {

                setLoading(false);

            }

        };


        loadDetails();

    }, [
        dispatch,
        appointmentId,
    ]);


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    // ==========================================
    // SAVE VITALS
    // ==========================================

    const handleSave = async () => {

        if (!appointmentId) {
            return;
        }


        setSuccessMessage("");
        setSavingVitals(true);


        try {

            /*
             * Only send VITALS.
             *
             * Patient information and appointment
             * information are read-only.
             */

            const payload = {

                bp:
                    form.bp,

                sugar:
                    form.sugar,

                pulse:
                    form.pulse,

                spo2:
                    form.spo2,

                temperature:
                    form.temperature,

                body_toxicity:
                    form.body_toxicity,

                ayurvedic_body_type:
                    form.ayurvedic_body_type,

            };


            await dispatch(
                saveFrontOfficeUpcomingAppointmentDetailsThunk({
                    appointmentId,
                    payload,
                })
            ).unwrap();


            setSuccessMessage(
                "Vitals saved successfully."
            );


            // ======================================
            // RELOAD LATEST DATA
            // ======================================

            const response =
                await dispatch(
                    loadFrontOfficeUpcomingAppointmentDetails(
                        appointmentId
                    )
                ).unwrap();


            const latestData =
                response?.data ||
                response ||
                null;


            setAppointmentDetails(
                latestData
            );


            const latestVitals =
                latestData?.vitals ||
                {};


            setForm({

                bp:
                    latestVitals.bp ||
                    "",

                sugar:
                    latestVitals.sugar ||
                    "",

                pulse:
                    latestVitals.pulse ||
                    "",

                spo2:
                    latestVitals.spo2 ||
                    "",

                temperature:
                    latestVitals.temperature ||
                    "",

                body_toxicity:
                    latestVitals.body_toxicity ||
                    "",

                ayurvedic_body_type:
                    latestVitals.ayurvedic_body_type ||
                    "",

            });

        } catch (saveError) {

            console.error(
                "Failed to save vitals:",
                saveError
            );


            setError(
                saveError
            );

        } finally {

            setSavingVitals(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div
                className="
                    min-h-screen
                    bg-[#FFFCF9]
                    px-6
                    py-8
                "
            >

                <div
                    className="
                        flex
                        min-h-[500px]
                        items-center
                        justify-center
                        text-[13px]
                        text-[#81756E]
                    "
                >
                    Loading appointment details...
                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !appointmentDetails) {

        const errorMessage =
            typeof error === "string"
                ? error
                : error?.message ||
                  error?.error ||
                  "Failed to load appointment details.";


        return (

            <div
                className="
                    min-h-screen
                    bg-[#FFFCF9]
                    px-6
                    py-8
                "
            >

                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="
                        mb-5
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#E7DBD3]
                        bg-white
                        text-[#4B2E2A]
                    "
                >

                    <HiOutlineArrowLeft
                        size={17}
                    />

                </button>


                <div
                    className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-5
                        py-4
                        text-[13px]
                        text-red-600
                    "
                >
                    {errorMessage}
                </div>

            </div>

        );

    }


    // ==========================================
    // API DATA
    // ==========================================

    const personal =
        appointmentDetails
            ?.personal_information ||
        {};


    const appointment =
        appointmentDetails
            ?.appointment_details ||
        {};


    const vitals =
        appointmentDetails
            ?.vitals ||
        {};


    // ==========================================
    // PATIENT DOB
    // ==========================================

    const patientDob =
        personal.date_of_birth ||
        (
            personal.dob
                ? personal.dob.slice(0, 10)
                : "-"
        );


    // ==========================================
    // APPOINTMENT PRICE
    // ==========================================

    const appointmentPrice =
        appointment.price !== undefined
            ? appointment.price
            : appointment.fee;


    // ==========================================
    // APPOINTMENT NUMBER
    // ==========================================

    const appointmentNumber =
        appointment.appointment_no ||
        appointmentDetails?.appointment_no ||
        "-";


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div
            className="
                min-h-screen
                bg-[#FFFCF9]
                px-6
                py-5
            "
        >

            {/* ====================================== */}
            {/* HEADER */}
            {/* ====================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#E8DDD6]
                    pb-5
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    {/* BACK BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#E7DBD3]
                            bg-white
                            text-[#4B2E2A]
                            transition
                            hover:bg-[#F9F5F1]
                        "
                    >

                        <HiOutlineArrowLeft
                            size={17}
                        />

                    </button>


                    {/* BREADCRUMB / TITLE */}

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <h1
                                className="
                                    text-[20px]
                                    font-semibold
                                    text-[#2F2926]
                                "
                            >
                                Upcoming Appointments
                            </h1>


                            <span
                                className="
                                    text-[20px]
                                    text-[#6F4A3A]
                                "
                            >
                                ›
                            </span>


                            <h2
                                className="
                                    text-[18px]
                                    font-semibold
                                    text-[#2F2926]
                                "
                            >
                                {personal.full_name ||
                                    personal.name ||
                                    "-"}
                            </h2>

                        </div>


                        <p
                            className="
                                mt-1
                                text-[11px]
                                text-[#81756E]
                            "
                        >
                            Appointment No:{" "}
                            {appointmentNumber}
                        </p>

                    </div>

                </div>


                {/* SAVE */}

                <button
                    type="button"
                    disabled={
                        saving ||
                        savingVitals
                    }
                    onClick={
                        handleSave
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-[#8A5038]
                        px-6
                        py-2.5
                        text-[12px]
                        font-medium
                        text-white
                        transition
                        hover:bg-[#75432F]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    <HiOutlineCloudArrowUp
                        size={16}
                    />

                    {saving ||
                    savingVitals
                        ? "Saving..."
                        : "Save Changes"}

                </button>

            </div>


            {/* ====================================== */}
            {/* SUCCESS */}
            {/* ====================================== */}

            {successMessage && (

                <div
                    className="
                        mt-4
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                        text-[12px]
                        text-green-700
                    "
                >
                    {successMessage}
                </div>

            )}


            {/* ====================================== */}
            {/* PERSONAL INFORMATION */}
            {/* ====================================== */}

            <Section
                title="Personal Information"
            >

                <div
                    className="
                        grid
                        grid-cols-3
                        gap-x-5
                        gap-y-5
                    "
                >

                    <ReadOnlyField
                        label="Full Name"
                        value={
                            personal.full_name ||
                            personal.name
                        }
                    />


                    <ReadOnlyField
                        label="Patient ID"
                        value={
                            personal.patient_id
                        }
                    />


                    <ReadOnlyField
                        label="Email ID"
                        value={
                            personal.email ||
                            personal.email_id
                        }
                    />


                    <ReadOnlyField
                        label="Phone"
                        value={
                            personal.mobile ||
                            personal.phone
                        }
                    />


                    <ReadOnlyField
                        label="Date of Birth"
                        value={
                            patientDob
                        }
                    />


                    <ReadOnlyField
                        label="Gender"
                        value={
                            personal.gender
                        }
                    />

                </div>

            </Section>


            {/* ====================================== */}
            {/* VITALS */}
            {/* ====================================== */}

            <Section
                title="Vitals"
            >

                <div
                    className="
                        grid
                        grid-cols-5
                        gap-5
                    "
                >

                    <Input
                        label="BP"
                        name="bp"
                        placeholder="Enter Value"
                        value={
                            form.bp
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <Input
                        label="Sugar"
                        name="sugar"
                        placeholder="Enter Value"
                        value={
                            form.sugar
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <Input
                        label="Pulse"
                        name="pulse"
                        placeholder="Enter Value"
                        value={
                            form.pulse
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <Input
                        label="SpO2"
                        name="spo2"
                        placeholder="Enter Value"
                        value={
                            form.spo2
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <Input
                        label="Temperature"
                        name="temperature"
                        placeholder="Enter Value"
                        value={
                            form.temperature
                        }
                        onChange={
                            handleChange
                        }
                    />

                </div>


                <div
                    className="
                        mt-5
                        grid
                        grid-cols-3
                        gap-5
                    "
                >

                    <Input
                        label="Body Toxicity"
                        name="body_toxicity"
                        placeholder="Enter Value"
                        value={
                            form.body_toxicity
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <Select
                        label="Ayurvedic Body Type"
                        name="ayurvedic_body_type"
                        value={
                            form.ayurvedic_body_type
                        }
                        onChange={
                            handleChange
                        }
                        options={[
                            {
                                label: "Vata",
                                value: "Vata",
                            },
                            {
                                label: "Pitta",
                                value: "Pitta",
                            },
                            {
                                label: "Kapha",
                                value: "Kapha",
                            },
                        ]}
                    />

                </div>

            </Section>


            {/* ====================================== */}
            {/* APPOINTMENT DETAILS */}
            {/* ====================================== */}

            <Section
                title="Appointment Details"
            >

                <div
                    className="
                        grid
                        grid-cols-3
                        gap-x-5
                        gap-y-5
                    "
                >

                    <ReadOnlyField
                        label="Doctor"
                        value={
                            appointment.doctor_name ||
                            appointment.doctor_id
                        }
                    />


                    <ReadOnlyField
                        label="Appointment Type"
                        value={
                            appointment.appointment_type
                        }
                    />


                    <ReadOnlyField
                        label="Date"
                        value={
                            appointment.formatted_date ||
                            appointment.date
                        }
                    />


                    <ReadOnlyField
                        label="Time"
                        value={
                            appointment.time ||
                            appointment.slot_time
                        }
                    />


                    <div
                        className="
                            col-span-2
                        "
                    >

                        <ReadOnlyField
                            label="Reason for Visit"
                            value={
                                appointment.reason_for_visit
                            }
                        />

                    </div>


                    <ReadOnlyField
                        label="Fee"
                        value={
                            appointmentPrice !== undefined &&
                            appointmentPrice !== null
                                ? `₹${appointmentPrice}`
                                : "-"
                        }
                    />

                </div>

            </Section>

        </div>

    );
};


// ==========================================
// SECTION
// ==========================================

const Section = ({
    title,
    children,
}) => {

    return (

        <section
            className="
                mt-5
                border-b
                border-[#E8DDD6]
                pb-5
            "
        >

            <h2
                className="
                    mb-5
                    text-[15px]
                    font-semibold
                    text-[#4B2E2A]
                "
            >
                {title}
            </h2>


            {children}

        </section>

    );
};


// ==========================================
// INPUT
// ==========================================

const Input = ({
    label,
    name,
    type = "text",
    value,
    placeholder,
    onChange,
}) => {

    return (

        <div>

            <label
                className="
                    mb-2
                    block
                    text-[12px]
                    font-medium
                    text-[#4B2E2A]
                "
            >
                {label}
            </label>


            <input
                type={type}
                name={name}
                value={value || ""}
                placeholder={placeholder}
                onChange={onChange}
                className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-[#E7DBD3]
                    bg-white
                    px-3
                    text-[12px]
                    text-[#4B2E2A]
                    outline-none
                    transition
                    placeholder:text-[#8C817B]
                    focus:border-[#B99B88]
                    focus:ring-1
                    focus:ring-[#E9DCD2]
                "
            />

        </div>

    );

};


// ==========================================
// SELECT
// ==========================================

const Select = ({
    label,
    name,
    value,
    onChange,
    options,
}) => {

    return (

        <div>

            <label
                className="
                    mb-2
                    block
                    text-[12px]
                    font-medium
                    text-[#4B2E2A]
                "
            >
                {label}
            </label>


            <select
                name={name}
                value={value || ""}
                onChange={onChange}
                className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-[#E7DBD3]
                    bg-white
                    px-3
                    text-[12px]
                    text-[#4B2E2A]
                    outline-none
                    focus:border-[#B99B88]
                    focus:ring-1
                    focus:ring-[#E9DCD2]
                "
            >

                <option value="">
                    Select
                </option>


                {options.map(
                    (option) => (

                        <option
                            key={
                                option.value
                            }
                            value={
                                option.value
                            }
                        >
                            {option.label}
                        </option>

                    )
                )}

            </select>

        </div>

    );

};


// ==========================================
// READ ONLY FIELD
// ==========================================

const ReadOnlyField = ({
    label,
    value,
}) => {

    return (

        <div>

            <label
                className="
                    mb-2
                    block
                    text-[12px]
                    font-medium
                    text-[#4B2E2A]
                "
            >
                {label}
            </label>


            <div
                className="
                    flex
                    min-h-11
                    items-center
                    rounded-lg
                    border
                    border-[#E7DBD3]
                    bg-[#FDFBF9]
                    px-3
                    text-[12px]
                    text-[#4B2E2A]
                "
            >
                {value || "-"}
            </div>

        </div>

    );

};


export default PatientAppointmentDetails;