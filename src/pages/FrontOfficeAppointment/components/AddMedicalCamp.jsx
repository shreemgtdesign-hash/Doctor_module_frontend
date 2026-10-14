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
    Plus,
    Trash2,
} from "lucide-react";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

import toast from "react-hot-toast";

import {
    createFrontOfficeMedicalCamp,
} from "../../../redux/frontOffice/frontOfficeAppointmentThunk";


const initialDoctor = {
    full_name: "",
    phone: "",
    email: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    about_doctor: "",
};


const AddMedicalCamp = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // ==========================================
    // REDUX
    // ==========================================

    const {
        medicalCampCreating = false,
        medicalCampCreateSuccess = false,
        medicalCampCreateError = null,
    } = useSelector(
        (state) =>
            state.frontOfficeAppointment || {}
    );


    // ==========================================
    // FORM STATE
    // ==========================================

    const [
        campData,
        setCampData,
    ] = useState({
        camp_name: "",
        category: "",
        branch: "",
        timings: "",
        camp_date: "",
        camp_id: "",
        camp_type: "",
    });

    const [
        doctors,
        setDoctors,
    ] = useState([
        { ...initialDoctor },
    ]);


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

    const campTypeOptions = [
        "General Camp",
        "Specialty Camp",
        "Screening Camp",
        "Corporate Camp",
    ];

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

            toast.success(
                "Medical camp created successfully!"
            );

            navigate(
                "/frontoffice/medcamp-calender"
            );

        }

    }, [
        medicalCampCreateSuccess,
        navigate,
    ]);


    // ==========================================
    // CAMP DATA HANDLERS
    // ==========================================

    const handleCampChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setCampData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };

    const handleCampDropdownSelect = (
        field,
        value
    ) => {

        setCampData(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );

        setOpenDropdown(null);

    };


    // ==========================================
    // DOCTORS HANDLERS
    // ==========================================

    const handleDoctorChange = (
        index,
        field,
        value
    ) => {

        setDoctors(
            (previous) => {
                const next = [
                    ...previous,
                ];
                next[index] = {
                    ...next[index],
                    [field]: value,
                };
                return next;
            }
        );

    };

    const isPreviousDoctorFilled = Boolean(
        doctors.length > 0 &&
            doctors[doctors.length - 1].full_name?.trim() &&
            doctors[doctors.length - 1].phone?.trim() &&
            doctors[doctors.length - 1].email?.trim()
    );

    const handleAddDoctor = () => {

        if (doctors.length > 0) {
            const previousIndex = doctors.length - 1;
            const previousDoctor = doctors[previousIndex];
            const doctorLabel =
                doctors.length > 1
                    ? `Doctor ${previousIndex + 1}`
                    : "Doctor";

            const hasAnyData = Boolean(
                previousDoctor.full_name?.trim() ||
                previousDoctor.phone?.trim() ||
                previousDoctor.email?.trim() ||
                previousDoctor.qualification?.trim() ||
                previousDoctor.specialization?.trim() ||
                previousDoctor.experience_years ||
                previousDoctor.about_doctor?.trim()
            );

            if (!hasAnyData) {
                toast.error(
                    `Please fill in ${doctorLabel}'s details before adding another doctor.`
                );
                return;
            }

            if (!previousDoctor.full_name?.trim()) {
                toast.error(
                    `Please enter full name for ${doctorLabel} before adding another doctor.`
                );
                return;
            }

            if (!previousDoctor.phone?.trim()) {
                toast.error(
                    `Please enter phone number for ${doctorLabel} before adding another doctor.`
                );
                return;
            }

            if (!previousDoctor.email?.trim()) {
                toast.error(
                    `Please enter email ID for ${doctorLabel} before adding another doctor.`
                );
                return;
            }
        }

        setDoctors(
            (previous) => [
                ...previous,
                { ...initialDoctor },
            ]
        );

    };

    const handleRemoveDoctor = (
        indexToRemove
    ) => {

        if (doctors.length <= 1) {
            return;
        }

        setDoctors(
            (previous) =>
                previous.filter(
                    (_, idx) =>
                        idx !== indexToRemove
                )
        );

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
                campData.camp_name.trim(),

            category:
                campData.category,

            branch:
                campData.branch,

            timings:
                campData.timings,

            camp_date:
                campData.camp_date,

            ...(campData.camp_id?.trim()
                ? {
                      camp_id:
                          campData.camp_id.trim(),
                  }
                : {}),

            ...(campData.camp_type
                ? {
                      camp_type:
                          campData.camp_type,
                  }
                : {}),

            doctors: doctors.map(
                (doc) => ({
                    full_name:
                        doc.full_name?.trim() ||
                        "",
                    email:
                        doc.email?.trim() ||
                        "",
                    phone:
                        doc.phone?.trim() ||
                        "",
                    qualification:
                        doc.qualification ||
                        "",
                    specialization:
                        doc.specialization ||
                        "",
                    experience_years:
                        doc.experience_years
                            ? Number(
                                  doc.experience_years
                              )
                            : 0,
                    about_doctor:
                        doc.about_doctor?.trim() ||
                        "",
                })
            ),

            // Backward compatibility for endpoints expecting first doctor at root level
            full_name:
                doctors[0]?.full_name?.trim() ||
                "",
            email:
                doctors[0]?.email?.trim() ||
                "",
            phone:
                doctors[0]?.phone?.trim() ||
                "",
            qualification:
                doctors[0]?.qualification ||
                "",
            specialization:
                doctors[0]?.specialization ||
                "",
            experience_years:
                doctors[0]?.experience_years
                    ? Number(
                          doctors[0]
                              .experience_years
                      )
                    : 0,
            about_doctor:
                doctors[0]?.about_doctor?.trim() ||
                "",
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
        onSelect,
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
                                        onClick={() => {
                                            if (
                                                onSelect
                                            ) {
                                                onSelect(
                                                    option
                                                );
                                            } else {
                                                handleCampDropdownSelect(
                                                    field,
                                                    option
                                                );
                                            }
                                            setOpenDropdown(
                                                null
                                            );
                                        }}
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

                    <div className="flex items-center justify-between">

                        <h2 className="text-[19px] font-semibold text-[#2F2F2F]">
                            Camp Information
                        </h2>

                        <div className="w-[170px]">

                            <CustomDropdown
                                field="camp_type"
                                value={
                                    campData.camp_type
                                }
                                options={
                                    campTypeOptions
                                }
                                placeholder="Type of Camp"
                            />

                        </div>

                    </div>


                    <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-7">

                        {/* Camp Name */}

                        <FormField
                            label="Camp Name"
                            name="camp_name"
                            value={
                                campData.camp_name
                            }
                            onChange={
                                handleCampChange
                            }
                            placeholder="Enter camp name"
                        />


                        {/* Category */}

                        <FieldGroup label="Category">

                            <CustomDropdown
                                field="category"
                                value={
                                    campData.category
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
                                    campData.branch
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
                                    campData.timings
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
                                        campData.camp_date
                                    }
                                    onChange={
                                        handleCampChange
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

                        <FormField
                            label="Camp ID"
                            name="camp_id"
                            value={
                                campData.camp_id
                            }
                            onChange={
                                handleCampChange
                            }
                            placeholder="CAMP12345"
                        />

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

                    <div className="flex items-center justify-between">

                        <h2 className="text-[19px] font-semibold text-[#2F2F2F]">
                            Doctor Details
                        </h2>

                        <button
                            type="button"
                            onClick={handleAddDoctor}
                            className={`
                                flex
                                items-center
                                gap-1.5
                                text-[14px]
                                font-semibold
                                transition
                                cursor-pointer
                                ${
                                    isPreviousDoctorFilled
                                        ? "text-[#4B2E2A] hover:text-[#7A4B3A]"
                                        : "text-[#9E8B83] hover:text-[#4B2E2A]"
                                }
                            `}
                        >
                            <Plus size={16} />
                            <span>Add Doctor</span>
                        </button>

                    </div>


                    {/* LIST OF DOCTORS */}

                    <div className="mt-6 flex flex-col gap-8">

                        {doctors.map(
                            (doctor, index) => (

                                <div
                                    key={index}
                                    className={`
                                        rounded-2xl
                                        ${
                                            doctors.length > 1
                                                ? "border border-[#E8DDD6] bg-[#FCFAF8] p-6 shadow-sm"
                                                : ""
                                        }
                                    `}
                                >

                                    {/* Multi-doctor card header */}

                                    {doctors.length > 1 && (

                                        <div className="
                                            mb-6
                                            flex
                                            items-center
                                            justify-between
                                            border-b
                                            border-[#E8DDD6]
                                            pb-3
                                        ">

                                            <span className="
                                                rounded-full
                                                bg-[#EFE6DF]
                                                px-3.5
                                                py-1
                                                text-[13px]
                                                font-semibold
                                                text-[#4B2E2A]
                                            ">
                                                Doctor {index + 1}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveDoctor(
                                                        index
                                                    )
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                    text-[13px]
                                                    font-medium
                                                    text-red-600
                                                    hover:text-red-700
                                                    transition
                                                    cursor-pointer
                                                "
                                            >
                                                <Trash2 size={15} />
                                                <span>
                                                    Remove Doctor
                                                </span>
                                            </button>

                                        </div>

                                    )}


                                    <div className="grid grid-cols-3 gap-x-4 gap-y-7">

                                        {/* Full Name */}

                                        <FormField
                                            label="Full Name"
                                            name="full_name"
                                            value={
                                                doctor.full_name
                                            }
                                            onChange={(e) =>
                                                handleDoctorChange(
                                                    index,
                                                    "full_name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter doctor name"
                                        />


                                        {/* Phone */}

                                        <FormField
                                            label="Phone"
                                            name="phone"
                                            value={
                                                doctor.phone
                                            }
                                            onChange={(e) =>
                                                handleDoctorChange(
                                                    index,
                                                    "phone",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="+91"
                                            type="tel"
                                        />


                                        {/* Email */}

                                        <FormField
                                            label="Email ID"
                                            name="email"
                                            value={
                                                doctor.email
                                            }
                                            onChange={(e) =>
                                                handleDoctorChange(
                                                    index,
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter email"
                                            type="email"
                                        />


                                        {/* Qualification */}

                                        <FieldGroup label="Qualification">

                                            <CustomDropdown
                                                field={`doctor_${index}_qualification`}
                                                value={
                                                    doctor.qualification
                                                }
                                                options={
                                                    qualificationOptions
                                                }
                                                placeholder="Select qualification"
                                                onSelect={(
                                                    val
                                                ) =>
                                                    handleDoctorChange(
                                                        index,
                                                        "qualification",
                                                        val
                                                    )
                                                }
                                            />

                                        </FieldGroup>


                                        {/* Specialization */}

                                        <FieldGroup label="Specialization">

                                            <CustomDropdown
                                                field={`doctor_${index}_specialization`}
                                                value={
                                                    doctor.specialization
                                                }
                                                options={
                                                    specializationOptions
                                                }
                                                placeholder="Select specialization"
                                                onSelect={(
                                                    val
                                                ) =>
                                                    handleDoctorChange(
                                                        index,
                                                        "specialization",
                                                        val
                                                    )
                                                }
                                            />

                                        </FieldGroup>


                                        {/* Experience */}

                                        <FormField
                                            label="Experience (Years)"
                                            name="experience_years"
                                            value={
                                                doctor.experience_years
                                            }
                                            onChange={(e) =>
                                                handleDoctorChange(
                                                    index,
                                                    "experience_years",
                                                    e.target.value
                                                )
                                            }
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
                                                doctor.about_doctor
                                            }
                                            onChange={(e) =>
                                                handleDoctorChange(
                                                    index,
                                                    "about_doctor",
                                                    e.target.value
                                                )
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

                                </div>

                            )
                        )}

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
                    pt-6
                ">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/frontoffice/medcamp-calender"
                            )
                        }
                        className="
                            min-w-[170px]
                            rounded-full
                            border
                            border-[#E5D4C5]
                            bg-[#FFFDF9]
                            px-8
                            py-3
                            text-[13px]
                            font-semibold
                            text-[#4B2E2A]
                            transition
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
                            rounded-full
                            bg-[#704332]
                            px-8
                            py-3
                            text-[13px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#5C3627]
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