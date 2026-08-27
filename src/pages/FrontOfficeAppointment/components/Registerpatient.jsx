import { useEffect, useState } from "react";

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
    CalendarDays,
    Clock3,
    Pencil,
    Save,
    ArrowRight,
    X,
} from "lucide-react";

import {
    loadMedicalCampDetails,
    registerFrontOfficeMedicalCampPatient,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const RegisterPatient = ({
    campId: propCampId,
    onClose,
    onRegistered,
}) => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    const { campId: routeCampId } = useParams();


    // =========================================================
    // CAMP ID
    // =========================================================
    // Priority:
    // 1. Parent component prop
    // 2. Route parameter
    // 3. Location state
    // =========================================================

    const campId =
        propCampId ||
        routeCampId ||
        location.state?.campId ||
        location.state?.camp_id ||
        null;


    // =========================================================
    // REDUX
    // =========================================================

    const {
        medicalCampDetails,
        medicalCampDetailsLoading,
        registerPatientLoading,
        registerPatientError,
    } = useSelector(
        (state) =>
            state.frontOfficeAppointment || {}
    );


    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] = useState({
        patient_name: "",
        age: "",
        gender: "Female",
        mobile: "",
        email: "",
        patient_camp_id: "",
        address: "",
        country: "",
        city: "",
        postal_code: "",
        allergies: "",
        comments: "",
    });


    const [campDate, setCampDate] =
        useState("");

    const [campTime, setCampTime] =
        useState("");


    // =========================================================
    // LOAD CAMP DETAILS
    // =========================================================

    useEffect(() => {

        if (!campId) {
            return;
        }

        dispatch(
            loadMedicalCampDetails
        );

    }, [
        dispatch,
        campId,
    ]);


    // =========================================================
    // GET CAMP DATE / TIME
    // =========================================================

    useEffect(() => {

        const camp =
            medicalCampDetails?.data ||
            medicalCampDetails;

        if (!camp) {
            return;
        }


        // -----------------------------------------------------
        // CAMP DATE
        // -----------------------------------------------------

        if (camp.formatted_camp_date) {

            setCampDate(
                camp.formatted_camp_date
            );

        } else if (camp.camp_date) {

            const date =
                new Date(camp.camp_date);

            if (
                !Number.isNaN(
                    date.getTime()
                )
            ) {

                setCampDate(
                    date.toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        }
                    )
                );

            }

        }


        // -----------------------------------------------------
        // WORKING HOURS
        // -----------------------------------------------------

        if (camp.working_hours) {

            const firstTime =
                camp.working_hours
                    .split("-")[0]
                    ?.trim();

            setCampTime(
                firstTime || ""
            );

        }

    }, [
        medicalCampDetails,
    ]);


    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // =========================================================
    // HANDLE GENDER
    // =========================================================

    const handleGenderChange = (
        gender
    ) => {

        setFormData((prev) => ({
            ...prev,
            gender,
        }));

    };


    // =========================================================
    // CLOSE POPUP
    // =========================================================

    const handleClose = () => {

        if (onClose) {
            onClose();
            return;
        }

        if (campId) {

            navigate(
                `/frontoffice/medicalcamp-details/${campId}`
            );

            return;
        }

        navigate(-1);

    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // -----------------------------------------------------
        // CAMP ID VALIDATION
        // -----------------------------------------------------

        if (!campId) {

            alert(
                "Medical camp ID is missing."
            );

            return;
        }


        // -----------------------------------------------------
        // EXACT API PAYLOAD
        // -----------------------------------------------------

        const payload = {

            camp_id:
                campId,

            patient_name:
                formData.patient_name.trim(),

            age:
                Number(formData.age),

            gender:
                formData.gender,

            mobile:
                formData.mobile.trim(),

            email:
                formData.email.trim(),

            patient_camp_id:
                formData.patient_camp_id.trim(),

            address:
                formData.address.trim(),

            country:
                formData.country.trim(),

            city:
                formData.city.trim(),

            postal_code:
                formData.postal_code.trim(),

            allergies:
                formData.allergies.trim(),

            comments:
                formData.comments.trim(),

        };


        try {

            const result =
                await dispatch(
                    registerFrontOfficeMedicalCampPatient(
                        payload
                    )
                ).unwrap();


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (
                result?.success !== false
            ) {

                alert(
                    result?.message ||
                    "Patient registered for medical camp successfully!"
                );


                // ---------------------------------------------
                // POPUP MODE
                // ---------------------------------------------

                if (onRegistered) {

                    onRegistered();

                    return;
                }


                // ---------------------------------------------
                // NORMAL PAGE MODE
                // ---------------------------------------------

                navigate(
                    `/frontoffice/medicalcamp-details/${campId}`
                );

            }

        } catch (error) {

            console.error(
                "Register patient error:",
                error
            );


            alert(
                error?.message ||
                error?.error ||
                "Failed to register patient."
            );

        }

    };


    // =========================================================
    // LOADING
    // =========================================================

    const isSubmitting =
        registerPatientLoading;


    // =========================================================
    // POPUP UI
    // =========================================================

    return (

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
                py-6
            "
            onMouseDown={(e) => {

                if (
                    e.target === e.currentTarget &&
                    !isSubmitting
                ) {
                    handleClose();
                }

            }}
        >

            <div
                className="
                    relative
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-[1100px]
                    flex-col
                    overflow-hidden
                    rounded-[12px]
                    bg-white
                    shadow-2xl
                "
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >

                {/* ==================================================
                    CLOSE BUTTON
                ================================================== */}

                <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="
                        absolute
                        right-5
                        top-5
                        z-20
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#e5d7c9]
                        bg-white
                        text-[#5d3930]
                        transition
                        hover:bg-[#fff8f3]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <X size={18} />
                </button>


                {/* ==================================================
                    SCROLLABLE CONTENT
                ================================================== */}

                <div className="overflow-y-auto">

                    <div className="w-full bg-white">

                        {/* ==================================================
                            MAIN CONTENT
                        ================================================== */}

                        <div className="px-6 py-6 lg:px-8">

                            {/* ==================================================
                                HEADER
                            ================================================== */}

                            <div className="flex items-start justify-between border-b border-[#eee3d8] pb-5">

                                <div>

                                    <h1
                                        className="
                                            text-[20px]
                                            font-semibold
                                            text-[#2f211d]
                                        "
                                    >
                                        Patient Information
                                    </h1>

                                    <p
                                        className="
                                            mt-2
                                            text-[14px]
                                            text-[#766c68]
                                        "
                                    >
                                        Record patient’s details.
                                    </p>

                                </div>


                                {/* DATE + TIME */}

                                <div className="mr-12 flex items-end gap-9">

                                    {/* DATE */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            Date
                                        </label>

                                        <div
                                            className="
                                                flex
                                                h-[38px]
                                                min-w-[160px]
                                                items-center
                                                gap-2
                                                rounded-[10px]
                                                border
                                                border-[#e5d7c9]
                                                bg-white
                                                px-3
                                                text-[14px]
                                                text-[#5d3930]
                                            "
                                        >

                                            <CalendarDays
                                                size={14}
                                                strokeWidth={1.7}
                                            />

                                            <span>
                                                {
                                                    campDate ||
                                                    "--"
                                                }
                                            </span>

                                        </div>

                                    </div>


                                    {/* TIME */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            Time
                                        </label>

                                        <div
                                            className="
                                                flex
                                                h-[38px]
                                                min-w-[125px]
                                                items-center
                                                gap-2
                                                rounded-[10px]
                                                border
                                                border-[#e5d7c9]
                                                bg-white
                                                px-3
                                                text-[14px]
                                                text-[#5d3930]
                                            "
                                        >

                                            <Clock3
                                                size={14}
                                                strokeWidth={1.7}
                                            />

                                            <span>
                                                {
                                                    campTime ||
                                                    "--"
                                                }
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* ==================================================
                                FORM
                            ================================================== */}

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="pt-5"
                            >

                                {/* ==================================================
                                    ROW 1
                                ================================================== */}

                                <div className="grid grid-cols-12 gap-x-9 gap-y-5">

                                    {/* PATIENT NAME */}

                                    <div className="col-span-4">

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            Patient Name
                                        </label>

                                        <input
                                            type="text"
                                            name="patient_name"
                                            value={
                                                formData.patient_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter Patient Name"
                                            required
                                            className="
                                                h-[48px]
                                                w-full
                                                rounded-[10px]
                                                border
                                                border-[#e5d7c9]
                                                bg-white
                                                px-4
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                                outline-none
                                                transition
                                                focus:border-[#875238]
                                            "
                                        />

                                    </div>


                                    {/* AGE */}

                                    <div className="col-span-4">

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            Age
                                        </label>

                                        <input
                                            type="number"
                                            name="age"
                                            min="0"
                                            value={
                                                formData.age
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter Age"
                                            required
                                            className="
                                                h-[48px]
                                                w-full
                                                rounded-[10px]
                                                border
                                                border-[#e5d7c9]
                                                bg-white
                                                px-4
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                                outline-none
                                                transition
                                                focus:border-[#875238]
                                            "
                                        />

                                    </div>


                                    {/* GENDER */}

                                    <div className="col-span-4">

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            Gender
                                        </label>

                                        <div className="flex gap-3">

                                            {/* FEMALE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleGenderChange(
                                                        "Female"
                                                    )
                                                }
                                                className={`
                                                    flex
                                                    h-[48px]
                                                    min-w-[105px]
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-[12px]
                                                    border
                                                    px-5
                                                    text-[14px]
                                                    font-medium
                                                    transition
                                                    ${
                                                        formData.gender ===
                                                        "Female"
                                                            ? "border-[#542f23] bg-[#fffaf6] text-[#4d3026] shadow-[0_0_0_1px_#542f23]"
                                                            : "border-[#e5d7c9] bg-white text-[#5d3930]"
                                                    }
                                                `}
                                            >
                                                <span className="text-[18px]">
                                                    ♀
                                                </span>

                                                Female
                                            </button>


                                            {/* MALE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleGenderChange(
                                                        "Male"
                                                    )
                                                }
                                                className={`
                                                    flex
                                                    h-[48px]
                                                    min-w-[105px]
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-[12px]
                                                    border
                                                    px-5
                                                    text-[14px]
                                                    font-medium
                                                    transition
                                                    ${
                                                        formData.gender ===
                                                        "Male"
                                                            ? "border-[#542f23] bg-[#fffaf6] text-[#4d3026] shadow-[0_0_0_1px_#542f23]"
                                                            : "border-[#e5d7c9] bg-white text-[#5d3930]"
                                                    }
                                                `}
                                            >
                                                <span className="text-[18px]">
                                                    ♂
                                                </span>

                                                Male
                                            </button>

                                        </div>

                                    </div>

                                </div>


                                {/* ==================================================
                                    ROW 2
                                ================================================== */}

                                <div className="mt-5 grid grid-cols-2 gap-x-9">

                                    {/* MOBILE */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            Mobile Number
                                        </label>

                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={
                                                formData.mobile
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter Mobile Number"
                                            required
                                            className="
                                                h-[48px]
                                                w-full
                                                rounded-[10px]
                                                border
                                                border-[#e5d7c9]
                                                bg-white
                                                px-4
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                                outline-none
                                                focus:border-[#875238]
                                            "
                                        />

                                    </div>


                                    {/* EMAIL */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            Email ID
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter Email ID"
                                            required
                                            className="
                                                h-[48px]
                                                w-full
                                                rounded-[10px]
                                                border
                                                border-[#e5d7c9]
                                                bg-white
                                                px-4
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                                outline-none
                                                focus:border-[#875238]
                                            "
                                        />

                                    </div>

                                </div>


                                {/* ==================================================
                                    PATIENT CAMP ID
                                ================================================== */}

                                <div className="mt-5">

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[14px]
                                            font-medium
                                            text-[#4d3026]
                                        "
                                    >
                                        Patient Camp ID
                                    </label>

                                    <input
                                        type="text"
                                        name="patient_camp_id"
                                        value={
                                            formData.patient_camp_id
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter Patient Camp ID"
                                        required
                                        className="
                                            h-[48px]
                                            w-full
                                            rounded-[10px]
                                            border
                                            border-[#e5d7c9]
                                            bg-white
                                            px-4
                                            text-[14px]
                                            font-medium
                                            text-[#4d3026]
                                            outline-none
                                            focus:border-[#875238]
                                        "
                                    />

                                </div>


                                {/* ==================================================
                                    ADDRESS
                                ================================================== */}

                                <div className="mt-5">

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[14px]
                                            font-medium
                                            text-[#4d3026]
                                        "
                                    >
                                        Address
                                    </label>

                                    <input
                                        type="text"
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter Address"
                                        required
                                        className="
                                            h-[48px]
                                            w-full
                                            rounded-[10px]
                                            border
                                            border-[#e5d7c9]
                                            bg-white
                                            px-4
                                            text-[14px]
                                            text-[#5d3930]
                                            outline-none
                                            focus:border-[#875238]
                                        "
                                    />

                                </div>


                                {/* ==================================================
                                    COUNTRY / CITY / POSTAL CODE
                                ================================================== */}

                                <div className="mt-5 grid grid-cols-3 gap-x-9">

                                    {/* COUNTRY */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            Country
                                        </label>

                                        <input
                                            type="text"
                                            name="country"
                                            value={
                                                formData.country
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter Country"
                                            required
                                            className="
                                                h-[48px]
                                                w-full
                                                rounded-[10px]
                                                border
                                                border-[#e5d7c9]
                                                bg-white
                                                px-4
                                                text-[14px]
                                                text-[#5d3930]
                                                outline-none
                                                focus:border-[#875238]
                                            "
                                        />

                                    </div>


                                    {/* CITY */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            value={
                                                formData.city
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter City"
                                            required
                                            className="
                                                h-[48px]
                                                w-full
                                                rounded-[10px]
                                                border
                                                border-[#e5d7c9]
                                                bg-white
                                                px-4
                                                text-[14px]
                                                text-[#5d3930]
                                                outline-none
                                                focus:border-[#875238]
                                            "
                                        />

                                    </div>


                                    {/* POSTAL CODE */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-[14px]
                                                font-medium
                                                text-[#4d3026]
                                            "
                                        >
                                            Postal Code
                                        </label>

                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={
                                                formData.postal_code
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter Postal Code"
                                            required
                                            className="
                                                h-[48px]
                                                w-full
                                                rounded-[10px]
                                                border
                                                border-[#e5d7c9]
                                                bg-white
                                                px-4
                                                text-[14px]
                                                text-[#5d3930]
                                                outline-none
                                                focus:border-[#875238]
                                            "
                                        />

                                    </div>

                                </div>


                                {/* ==================================================
                                    ALLERGIES
                                ================================================== */}

                                <div className="mt-5">

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[14px]
                                            font-medium
                                            text-[#4d3026]
                                        "
                                    >
                                        Known Allergies/Conditions
                                    </label>

                                    <input
                                        type="text"
                                        name="allergies"
                                        value={
                                            formData.allergies
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter allergies"
                                        className="
                                            h-[48px]
                                            w-full
                                            rounded-[10px]
                                            border
                                            border-[#e5d7c9]
                                            bg-white
                                            px-4
                                            text-[14px]
                                            text-[#5d3930]
                                            outline-none
                                            focus:border-[#875238]
                                        "
                                    />

                                </div>


                                {/* ==================================================
                                    COMMENTS
                                ================================================== */}

                                <div className="mt-5">

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-[14px]
                                            font-medium
                                            text-[#4d3026]
                                        "
                                    >
                                        Other Comments (Optional)
                                    </label>

                                    <textarea
                                        name="comments"
                                        value={
                                            formData.comments
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter comments"
                                        rows={2}
                                        className="
                                            w-full
                                            resize-none
                                            rounded-[10px]
                                            border
                                            border-[#e5d7c9]
                                            bg-white
                                            px-4
                                            py-3
                                            text-[14px]
                                            text-[#5d3930]
                                            outline-none
                                            focus:border-[#875238]
                                        "
                                    />

                                </div>


                                {/* ==================================================
                                    EDIT / SAVE
                                ================================================== */}

                                <div className="mt-3 flex justify-end gap-5">

                                    <button
                                        type="button"
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-[13px]
                                            text-[#b5a6a0]
                                        "
                                    >
                                        <Pencil size={13} />
                                        Edit
                                    </button>


                                    <button
                                        type="button"
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-[13px]
                                            font-medium
                                            text-[#4d3026]
                                        "
                                    >
                                        <Save size={13} />
                                        Save
                                    </button>

                                </div>


                                {/* ==================================================
                                    ERROR
                                ================================================== */}

                                {registerPatientError && (

                                    <div
                                        className="
                                            mt-3
                                            rounded-[8px]
                                            border
                                            border-red-200
                                            bg-red-50
                                            px-4
                                            py-3
                                            text-[13px]
                                            text-red-600
                                        "
                                    >
                                        {
                                            typeof registerPatientError ===
                                            "string"
                                                ? registerPatientError
                                                : registerPatientError?.message ||
                                                  registerPatientError?.error ||
                                                  "Unable to register patient."
                                        }
                                    </div>

                                )}


                                {/* ==================================================
                                    BOTTOM ACTION BAR
                                ================================================== */}

                                <div
                                    className="
                                        mt-6
                                        flex
                                        justify-end
                                        gap-5
                                        border-t
                                        border-[#eee3d8]
                                        pt-4
                                    "
                                >

                                    {/* CANCEL */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleClose
                                        }
                                        disabled={
                                            isSubmitting
                                        }
                                        className="
                                            h-[44px]
                                            w-[235px]
                                            rounded-[12px]
                                            border
                                            border-[#e5d7c9]
                                            bg-[#fffaf6]
                                            text-[14px]
                                            font-semibold
                                            text-[#4d3026]
                                            transition
                                            hover:bg-[#fdf3eb]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        Cancel
                                    </button>


                                    {/* REGISTER */}

                                    <button
                                        type="submit"
                                        disabled={
                                            isSubmitting ||
                                            medicalCampDetailsLoading
                                        }
                                        className="
                                            flex
                                            h-[44px]
                                            w-[235px]
                                            items-center
                                            justify-center
                                            gap-3
                                            rounded-[12px]
                                            bg-[#875238]
                                            text-[14px]
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-[#75452f]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    >

                                        {
                                            isSubmitting
                                                ? "Registering..."
                                                : "Register"
                                        }

                                        {!isSubmitting && (
                                            <ArrowRight
                                                size={17}
                                            />
                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default RegisterPatient;