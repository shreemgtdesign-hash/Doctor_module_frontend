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
} from "react-router-dom";

import {
    ChevronDown,
    CalendarDays,
} from "lucide-react";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import {
    createFrontOfficeMedicalCamp,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const AddMedicalCamp = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // ==========================================
    // REDUX
    // ==========================================

    const {
        medicalCampCreating = false,
        medicalCampCreateSuccess = false,
        medicalCampCreateMessage = "",
        medicalCampCreateError = null,
    } = useSelector(
        (state) =>
            state.frontOfficeAppointment || {}
    );


    // ==========================================
    // FORM
    // ==========================================

    const [
        formData,
        setFormData,
    ] = useState({
        camp_name: "",
        category: "",
        branch: "",
        timings: "",
        camp_date: "",
        camp_id: "",

        full_name: "",
        phone: "",
        email: "",
        qualification: "",
        specialization: "",
        experience_years: "",
        about_doctor: "",
    });


    // ==========================================
    // DROPDOWN STATE
    // ==========================================

    const [
        openDropdown,
        setOpenDropdown,
    ] = useState(null);


    // ==========================================
    // OPTIONS
    // ==========================================

    const categoryOptions = [
        "Healthcare",
        "Specialty Care",
        "General Health",
        "Preventive Care",
    ];

    const branchOptions = [
        "West Mambalam",
        "Anna Nagar",
        "Coimbatore",
        "Chennai",
    ];

    const timingOptions = [
        "9:00 AM - 6:00 PM",
        "10:00 AM - 5:00 PM",
        "9:00 AM - 1:00 PM",
        "2:00 PM - 6:00 PM",
    ];

    const qualificationOptions = [
        "BAMS",
        "BAMS, MD",
        "MD (Ayurveda)",
        "MD",
        "MBBS",
    ];

    const specializationOptions = [
        "Diabetology",
        "General Medicine",
        "Senior Cardiologist",
        "Pediatrics",
        "Clinical Outreach",
    ];


    // ==========================================
    // OUTSIDE CLICK
    // ==========================================

    useEffect(() => {

        const handleClickOutside = (
            event
        ) => {

            if (
                !event.target.closest(
                    "[data-camp-dropdown]"
                )
            ) {
                setOpenDropdown(null);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);


    // ==========================================
    // SUCCESS
    // ==========================================

    useEffect(() => {

        if (
            medicalCampCreateSuccess
        ) {

            navigate(
                "/frontoffice/medcamp-calender"
            );

        }

    }, [
        medicalCampCreateSuccess,
        navigate,
    ]);


    // ==========================================
    // CHANGE
    // ==========================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    // ==========================================
    // DROPDOWN SELECT
    // ==========================================

    const handleDropdownSelect = (
        field,
        value
    ) => {

        setFormData(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );

        setOpenDropdown(null);

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        const payload = {
            camp_name:
                formData.camp_name.trim(),

            category:
                formData.category,

            branch:
                formData.branch,

            timings:
                formData.timings,

            camp_date:
                formData.camp_date,

            camp_id:
                formData.camp_id.trim(),

            full_name:
                formData.full_name.trim(),

            phone:
                formData.phone.trim(),

            email:
                formData.email.trim(),

            qualification:
                formData.qualification,

            specialization:
                formData.specialization,

            experience_years:
                Number(
                    formData.experience_years
                ),

            about_doctor:
                formData.about_doctor.trim(),
        };


        try {

            await dispatch(
                createFrontOfficeMedicalCamp(
                    payload
                )
            ).unwrap();

        } catch (error) {

            console.error(
                "Create medical camp failed:",
                error
            );

        }

    };


    // ==========================================
    // DROPDOWN COMPONENT
    // ==========================================

    const CustomDropdown = ({
        field,
        value,
        options,
        placeholder,
        width = "w-full",
    }) => {

        const isOpen =
            openDropdown === field;

        return (
            <div
                className={`relative ${width}`}
                data-camp-dropdown
            >

                <button
                    type="button"
                    onClick={() =>
                        setOpenDropdown(
                            isOpen
                                ? null
                                : field
                        )
                    }
                    className="
                        flex
                        h-[54px]
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-[#E8D9CF]
                        bg-white
                        px-4
                        text-left
                        text-[13px]
                        font-medium
                        text-[#4B2E2A]
                        shadow-sm
                        transition
                        hover:border-[#CBB5A5]
                    "
                >

                    <span className="truncate">
                        {value ||
                            placeholder}
                    </span>

                    <ChevronDown
                        size={16}
                        className={`
                            ml-2
                            flex-shrink-0
                            text-[#633A2B]
                            transition-transform
                            ${
                                isOpen
                                    ? "rotate-180"
                                    : ""
                            }
                        `}
                    />

                </button>


                {isOpen && (

                    <div
                        className="
                            absolute
                            left-0
                            right-0
                            top-[60px]
                            z-[100]
                            max-h-[240px]
                            overflow-y-auto
                            rounded-xl
                            border
                            border-[#E8D9CF]
                            bg-white
                            shadow-xl
                        "
                    >

                        {options.map(
                            (option) => {

                                const selected =
                                    value === option;

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() =>
                                            handleDropdownSelect(
                                                field,
                                                option
                                            )
                                        }
                                        className={`
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            border-b
                                            border-[#F1E7E0]
                                            px-4
                                            py-3
                                            text-left
                                            text-[12px]
                                            last:border-b-0
                                            hover:bg-[#FFF7F0]
                                            ${
                                                selected
                                                    ? "bg-[#FFF7F0] font-semibold text-[#4B2E2A]"
                                                    : "text-[#6F625B]"
                                            }
                                        `}
                                    >

                                        <span>
                                            {option}
                                        </span>

                                        {selected && (
                                            <span className="text-[#8A5038]">
                                                ✓
                                            </span>
                                        )}

                                    </button>
                                );

                            }
                        )}

                    </div>

                )}

            </div>
        );

    };


    return (

        <DashboardLayout role="frontoffice">

            <form
                onSubmit={handleSubmit}
                className="
                    min-h-screen
                    bg-white
                    px-6
                    py-6
                    text-[#4B2E2A]
                "
            >

                {/* ========================================== */}
                {/* HEADER */}
                {/* ========================================== */}

                <div className="border-b border-[#E8DDD6] pb-6">

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/frontoffice/medcamp-calender"
                                )
                            }
                            className="
                                text-[20px]
                                font-semibold
                                text-[#2F2F2F]
                                hover:text-[#8A4F32]
                            "
                        >
                            Medical Camp
                        </button>

                        <span className="text-[26px] text-[#8A817B]">
                            ›
                        </span>

                        <h1 className="text-[20px] font-semibold text-[#2F2F2F]">
                            Add Camp
                        </h1>

                    </div>

                    <p className="mt-2 text-[13px] text-[#765E55]">
                        Manage and track all medical camps.
                    </p>

                </div>


                {/* ========================================== */}
                {/* CAMP INFORMATION */}
                {/* ========================================== */}

                <section className="pt-7">

                    <h2 className="text-[19px] font-semibold text-[#2F2F2F]">
                        Camp Information
                    </h2>


                    <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-7">

                        {/* Camp Name */}

                        <FormField
                            label="Camp Name"
                            name="camp_name"
                            value={formData.camp_name}
                            onChange={handleChange}
                            placeholder="Enter camp name"
                        />


                        {/* Category */}

                        <FieldGroup label="Category">

                            <CustomDropdown
                                field="category"
                                value={
                                    formData.category
                                }
                                options={
                                    categoryOptions
                                }
                                placeholder="Select category"
                            />

                        </FieldGroup>


                        {/* Branch */}

                        <FieldGroup label="Branch">

                            <CustomDropdown
                                field="branch"
                                value={
                                    formData.branch
                                }
                                options={
                                    branchOptions
                                }
                                placeholder="Select branch"
                            />

                        </FieldGroup>


                        {/* Timings */}

                        <FieldGroup label="Timings">

                            <CustomDropdown
                                field="timings"
                                value={
                                    formData.timings
                                }
                                options={
                                    timingOptions
                                }
                                placeholder="Select timings"
                            />

                        </FieldGroup>


                        {/* Date */}

                        <FieldGroup label="Date">

                            <div className="
                                relative
                                flex
                                h-[54px]
                                items-center
                                rounded-xl
                                border
                                border-[#E8D9CF]
                                bg-white
                            ">

                                <input
                                    type="date"
                                    name="camp_date"
                                    value={
                                        formData.camp_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="
                                        h-full
                                        w-full
                                        rounded-xl
                                        bg-transparent
                                        px-4
                                        pr-12
                                        text-[13px]
                                        font-medium
                                        text-[#4B2E2A]
                                        outline-none
                                    "
                                />

                                <CalendarDays
                                    size={17}
                                    className="
                                        pointer-events-none
                                        absolute
                                        right-4
                                        text-[#633A2B]
                                    "
                                />

                            </div>

                        </FieldGroup>


                        {/* Camp ID */}



                    </div>

                </section>


                {/* ========================================== */}
                {/* DOCTOR DETAILS */}
                {/* ========================================== */}

                <section className="
                    mt-8
                    border-t
                    border-[#E8DDD6]
                    pt-7
                ">

                    <h2 className="text-[19px] font-semibold text-[#2F2F2F]">
                        Doctor Details
                    </h2>


                    <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-7">

                        {/* Full Name */}

                        <FormField
                            label="Full Name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Enter doctor name"
                        />


                        {/* Phone */}

                        <FormField
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91"
                            type="tel"
                        />


                        {/* Email */}

                        <FormField
                            label="Email ID"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            type="email"
                        />


                        {/* Qualification */}

                        <FieldGroup label="Qualification">

                            <CustomDropdown
                                field="qualification"
                                value={
                                    formData.qualification
                                }
                                options={
                                    qualificationOptions
                                }
                                placeholder="Select qualification"
                            />

                        </FieldGroup>


                        {/* Specialization */}

                        <FieldGroup label="Specialization">

                            <CustomDropdown
                                field="specialization"
                                value={
                                    formData.specialization
                                }
                                options={
                                    specializationOptions
                                }
                                placeholder="Select specialization"
                            />

                        </FieldGroup>


                        {/* Experience */}

                        <FormField
                            label="Experience (Years)"
                            name="experience_years"
                            value={
                                formData.experience_years
                            }
                            onChange={handleChange}
                            placeholder="Enter experience"
                            type="number"
                        />

                    </div>


                    {/* About Doctor */}

                    <div className="mt-7">

                        <label className="mb-2 block text-[13px] font-medium text-[#4B2E2A]">
                            About Doctor (Optional)
                        </label>

                        <textarea
                            name="about_doctor"
                            value={
                                formData.about_doctor
                            }
                            onChange={
                                handleChange
                            }
                            rows={4}
                            placeholder="Enter details"
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-[#E8D9CF]
                                bg-white
                                px-4
                                py-3
                                text-[13px]
                                text-[#4B2E2A]
                                outline-none
                                placeholder:text-[#9A8D84]
                                focus:border-[#BDA18F]
                            "
                        />

                    </div>

                </section>


                {/* ========================================== */}
                {/* ERROR */}
                {/* ========================================== */}

                {medicalCampCreateError && (

                    <div className="
                        mt-5
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-[12px]
                        text-red-600
                    ">
                        {typeof medicalCampCreateError ===
                        "string"
                            ? medicalCampCreateError
                            : "Failed to create medical camp."}
                    </div>

                )}


                {/* ========================================== */}
                {/* FOOTER */}
                {/* ========================================== */}

                <div className="
                    mt-8
                    flex
                    justify-end
                    gap-4
                    border-t
                    border-[#E8DDD6]
                    pt-5
                ">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/frontoffice/medcamp-calender"
                            )
                        }
                        className="
                            min-w-[180px]
                            rounded-xl
                            border
                            border-[#E5D4C5]
                            bg-[#FFFDF9]
                            px-6
                            py-3
                            text-[12px]
                            font-semibold
                            text-[#4B2E2A]
                            hover:bg-[#FFF7F0]
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={
                            medicalCampCreating
                        }
                        className="
                            min-w-[190px]
                            rounded-xl
                            bg-[#8B533A]
                            px-6
                            py-3
                            text-[12px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#77432F]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {medicalCampCreating
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </DashboardLayout>
    );
};


// =====================================================
// FORM FIELD
// =====================================================

const FormField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
}) => {

    return (

        <FieldGroup label={label}>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                    h-[54px]
                    w-full
                    rounded-xl
                    border
                    border-[#E8D9CF]
                    bg-white
                    px-4
                    text-[13px]
                    font-medium
                    text-[#4B2E2A]
                    outline-none
                    placeholder:text-[#9A8D84]
                    focus:border-[#BDA18F]
                "
            />

        </FieldGroup>

    );
};


// =====================================================
// FIELD GROUP
// =====================================================

const FieldGroup = ({
    label,
    children,
}) => {

    return (

        <div>

            <label className="
                mb-2
                block
                text-[13px]
                font-medium
                text-[#4B2E2A]
            ">
                {label}
            </label>

            {children}

        </div>

    );
};


export default AddMedicalCamp;