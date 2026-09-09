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

import PainBodySelector
    from "./PainBodySelector";
import { loadDutyDoctorPatientQueue, submitDutyDoctorPainAssessment } from "../../../redux/dutyDoctor/dutyDoctorThunk";




const CHARACTER_OPTIONS = [

    "Throbbing",
    "Shooting",
    "Stabbing",
    "Sharp",
    "Cramping",
    "Pressure",
    "Tender",
    "Numbness",
    "Burning",
    "Aching",

];


const TYPE_OPTIONS = [

    "Nociceptive",
    "Neuropathic",
    "Mixed",
    "Unknown",

];


const FREQUENCY_OPTIONS = [

    "Constant",
    "Frequent",
    "Infrequent",
    "Unknown",

];


const ONSET_OPTIONS = [

    "Acute (<6 weeks)",
    "Chronic (>6 weeks)",

];


const RELIEVES_OPTIONS = [

    "Opioids",
    "Non Opioids",
    "Cold",
    "Heat",
    "Exercise",
    "Eating",
    "Massage",
    "Relaxation",
    "Rest",
    "Repositioning",

];


const PLAN_OPTIONS = [

    "Rehab Referral",
    "Non-med Intervention",
    "Medication",
    "Spiritual Counseling",

];


const EFFECT_OPTIONS = [

    "Nausea",
    "Sleep",
    "Appetite",
    "Physical Activity",
    "Emotions",
    "Concentration",
    "Others",

];


const PainAssessmentForm = ({
    assessment,
    type,
}) => {

    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();


    const {
        submittingAssessment,
        submitError,
        submitSuccess,
    } = useSelector(
        (state) =>
            state.dutyDoctor
    );


    const patient =
        assessment?.patient_info;





    const isPost = type === "post";

const [selectedLocations, setSelectedLocations] = useState([]);
const [painLocation, setPainLocation] = useState("");
const [characterOfPain, setCharacterOfPain] = useState([]);
const [typeOfPain, setTypeOfPain] = useState([]);
const [frequencyOfPain, setFrequencyOfPain] = useState([]);
const [onsetOfPain, setOnsetOfPain] = useState([]);
const [relievesPain, setRelievesPain] = useState([]);
const [painScore, setPainScore] = useState("");
const [planOfAddressingPain, setPlanOfAddressingPain] = useState([]);
const [effectsOfPain, setEffectsOfPain] = useState([]);
const [painDetailsBefore, setPainDetailsBefore] = useState("");
const [painDetailsAfter, setPainDetailsAfter] = useState("");
const [otherComments, setOtherComments] = useState("");

useEffect(() => {
    if (!assessment) return;

    const before = assessment?.before_treatment_form;
    const after = assessment?.after_treatment_form;

    if (type === "post") {
        // ============================
        // POST FORM
        // ============================
        // Keep the complete assessment UI visible and
        // repopulate the PRE-treatment values so they
        // remain available while recording POST values.

        setSelectedLocations(
            before?.location_of_pain ??
            []
        );

        setPainLocation(
            before?.pain_location ??
            ""
        );

        setCharacterOfPain(
            before?.character_of_pain ??
            []
        );

        setTypeOfPain(
            before?.type_of_pain ??
            []
        );

        setFrequencyOfPain(
            before?.frequency_of_pain ??
            []
        );

        setOnsetOfPain(
            before?.onset_of_pain ??
            []
        );

        setRelievesPain(
            before?.relieves_pain ??
            []
        );

        setPlanOfAddressingPain(
            before?.plan_of_addressing_pain ??
            []
        );

        setEffectsOfPain(
            before?.effects_of_pain ??
            []
        );

        setPainScore(
            after?.pain_score ??
            ""
        );

        setPainDetailsBefore(
            before?.pain_details_before ??
            ""
        );

        setPainDetailsAfter(
            after?.pain_details_after ??
            ""
        );

        setOtherComments(
            after?.other_comments ??
            ""
        );

    } else {
        // ============================
        // PRE FORM
        // ============================

        setSelectedLocations(
            before?.location_of_pain ??
            []
    );

        setPainLocation(
            before?.pain_location ??
            ""
        );

        setCharacterOfPain(
            before?.character_of_pain ??
            []
    );

        setTypeOfPain(
            before?.type_of_pain ??
            []
        );

        setFrequencyOfPain(
            before?.frequency_of_pain ??
            []
    );

        setOnsetOfPain(
            before?.onset_of_pain ??
            []
    );

        setRelievesPain(
            before?.relieves_pain ??
            []
    );

        setPainScore(
            before?.pain_score ??
            ""
    );

        setPlanOfAddressingPain(
            before?.plan_of_addressing_pain ??
            []
    );

        setEffectsOfPain(
            before?.effects_of_pain ??
            []
    );

        setPainDetailsBefore(
            before?.pain_details_before ??
        ""
    );

        setPainDetailsAfter(
            before?.pain_details_after ??
            ""
        );

        setOtherComments(
            before?.other_comments ??
            ""
        );
    }
}, [assessment, type]);
    /**
     * ==========================================
     * POST FORM
     *
     * Post API only needs:
     * booking_id
     * assessment_type
     * patient_id
     * patient_name
     * pain_score
     * pain_details_before
     * pain_details_after
     * other_comments
     * ==========================================
     */

   


    /**
     * ==========================================
     * MULTI SELECT
     * ==========================================
     */

    const toggleArrayValue = (
        value,
        current,
        setter
    ) => {

        if (
            current.includes(value)
        ) {

            setter(
                current.filter(
                    (item) =>
                        item !== value
                )
            );

        } else {

            setter([
                ...current,
                value,
            ]);

        }

    };


    /**
     * ==========================================
     * SUBMIT
     * ==========================================
     */

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        if (!patient?.booking_id) {

            return;

        }


        if (
            painScore === "" ||
            painScore === null
        ) {

            alert(
                "Please enter pain score"
            );

            return;

        }


        let payload;


        /**
         * ======================================
         * POST
         * ======================================
         */

        if (isPost) {

            payload = {

                booking_id:
                    patient.booking_id,

                assessment_type:
                    "post",

                patient_id:
                    patient.patient_id,

                patient_name:
                    patient.patient_name,

                pain_score:
                    Number(painScore),

                pain_details_before:
                    painDetailsBefore ||
                    null,

                pain_details_after:
                    painDetailsAfter ||
                    null,

                other_comments:
                    otherComments ||
                    null,

            };

        }


        /**
         * ======================================
         * PRE
         * ======================================
         */

        else {

            payload = {

                booking_id:
                    patient.booking_id,

                assessment_type:
                    "pre",

                patient_id:
                    patient.patient_id,

                patient_name:
                    patient.patient_name,

                age:
                    Number(patient.age),

                gender:
                    patient.gender,

                doctor_name:
                    patient.doctor_name,

                assessment_date:
                    patient.assessment_date
                        ?.split("T")[0] ||
                    new Date()
                        .toISOString()
                        .split("T")[0],

                assessment_time:
                    patient.assessment_time ||
                    "00:00:00",

                location_of_pain:
                    selectedLocations,

                pain_location:
                    painLocation,

                character_of_pain:
                    characterOfPain,

                type_of_pain:
                    typeOfPain,

                frequency_of_pain:
                    frequencyOfPain,

                onset_of_pain:
                    onsetOfPain,

                relieves_pain:
                    relievesPain,

                pain_score:
                    Number(painScore),

                plan_of_addressing_pain:
                    planOfAddressingPain,

                effects_of_pain:
                    effectsOfPain,

                pain_details_before:
                    painDetailsBefore,

                pain_details_after:
                    painDetailsAfter,

                other_comments:
                    otherComments,

            };

        }


        try {

            await dispatch(
                submitDutyDoctorPainAssessment(
                    payload
                )
            ).unwrap();


            /**
             * Refresh queue so status
             * becomes Start Post / Completed
             */

            await dispatch(
                loadDutyDoctorPatientQueue()
            );


            /**
             * Return to dashboard
             */

            navigate(
                "/duty-doctor/dashboard"
            );


        } catch (error) {

            console.error(
                "Assessment submission failed:",
                error
            );

        }

    };


    /**
     * ==========================================
     * RENDER
     * ==========================================
     */

    if (!patient) {

        return null;

    }


    return (

        <form
            onSubmit={handleSubmit}
            className="
                min-h-screen
                bg-[#F8F6F3]
                px-5
                py-6
            "
        >


            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="
                mb-5
                flex
                items-center
                justify-between
            ">

                <div>

                    <h1 className="
                        text-[24px]
                        font-semibold
                        text-[#292929]
                    ">
                        {
                            isPost
                                ? "Treatment Assessment"
                                : "Initial Pain Assessment"
                        }
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-[#777]
                    ">
                        {
                            isPost
                                ? "Assess and record patient's condition after treatment."
                                : "Assess and record patient's pain details before starting therapy."
                        }
                    </p>

                </div>


                <div className="
                    flex
                    gap-3
                ">

                    <div>

                        <p className="
                            mb-1
                            text-xs
                            font-medium
                            text-[#4D2E23]
                        ">
                            Date
                        </p>

                        <div className="
                            rounded-xl
                            border
                            border-[#E6D8CC]
                            bg-white
                            px-4
                            py-2
                            text-sm
                            text-[#4D2E23]
                        ">
                            {
                                patient.assessment_date
                                    ?.split("T")[0] ||
                                "-"
                            }
                        </div>

                    </div>


                    <div>

                        <p className="
                            mb-1
                            text-xs
                            font-medium
                            text-[#4D2E23]
                        ">
                            Time
                        </p>

                        <div className="
                            rounded-xl
                            border
                            border-[#E6D8CC]
                            bg-white
                            px-4
                            py-2
                            text-sm
                            text-[#4D2E23]
                        ">
                            {
                                patient.assessment_time ||
                                "-"
                            }
                        </div>

                    </div>

                </div>

            </div>


            {/* ================================= */}
            {/* PATIENT INFO */}
            {/* ================================= */}

            <div className="
                rounded-2xl
                border
                border-[#E7DCD4]
                bg-white
                p-5
            ">

                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-3
                ">

                    <ReadOnlyField
                        label="Patient Name"
                        value={
                            patient.patient_name
                        }
                    />

                    <ReadOnlyField
                        label="Age"
                        value={
                            patient.age
                        }
                    />

                    <ReadOnlyField
                        label="Gender"
                        value={
                            patient.gender
                        }
                    />

                    <ReadOnlyField
                        label="Doctor Name"
                        value={
                            patient.doctor_name
                        }
                    />

                    <ReadOnlyField
                        label="Patient ID"
                        value={
                            patient.patient_id
                        }
                    />

                    <ReadOnlyField
                        label="Therapy"
                        value={
                            patient.therapy_name
                        }
                    />
                    <ReadOnlyField
                        label="Category"
                        value={
                            patient.category
                        }
                    />

                </div>

            </div>


            {/* ================================= */}
            {/* ASSESSMENT FORM */}
            {/* ================================= */}

            <>


                <div className="mt-5">

                    <PainBodySelector
                        value={
                            selectedLocations
                        }
                        onChange={
                            setSelectedLocations
                        }
                    />

                </div>


                <FormInput
                    label="Pain Location"
                    value={
                        painLocation
                    }
                    onChange={
                        setPainLocation
                    }
                    placeholder="Enter Pain Location"
                />


                <CheckboxSection
                    title="Character of Pain"
                    options={
                        CHARACTER_OPTIONS
                    }
                    value={
                        characterOfPain
                    }
                    onChange={(value) =>
                        toggleArrayValue(
                            value,
                            characterOfPain,
                            setCharacterOfPain
                        )
                    }
                />


                <CheckboxSection
                    title="Type of Pain"
                    options={
                        TYPE_OPTIONS
                    }
                    value={
                        typeOfPain
                    }
                    onChange={(value) =>
                        toggleArrayValue(
                            value,
                            typeOfPain,
                            setTypeOfPain
                        )
                    }
                />


                <CheckboxSection
                    title="Frequency of Pain"
                    options={
                        FREQUENCY_OPTIONS
                    }
                    value={
                        frequencyOfPain
                    }
                    onChange={(value) =>
                        toggleArrayValue(
                            value,
                            frequencyOfPain,
                            setFrequencyOfPain
                        )
                    }
                />


                <CheckboxSection
                    title="Onset of Pain"
                    options={
                        ONSET_OPTIONS
                    }
                    value={
                        onsetOfPain
                    }
                    onChange={(value) =>
                        toggleArrayValue(
                            value,
                            onsetOfPain,
                            setOnsetOfPain
                        )
                    }
                />


                <CheckboxSection
                    title="What Relieves the Pain"
                    options={
                        RELIEVES_OPTIONS
                    }
                    value={
                        relievesPain
                    }
                    onChange={(value) =>
                        toggleArrayValue(
                            value,
                            relievesPain,
                            setRelievesPain
                        )
                    }
                />


                <PainScore
                    value={
                        painScore
                    }
                    onChange={
                        setPainScore
                    }
                />


                <CheckboxSection
                    title="Plan of Addressing Pain"
                    options={
                        PLAN_OPTIONS
                    }
                    value={
                        planOfAddressingPain
                    }
                    onChange={(value) =>
                        toggleArrayValue(
                            value,
                            planOfAddressingPain,
                            setPlanOfAddressingPain
                        )
                    }
                />


                <CheckboxSection
                    title="Effects of Pain"
                    options={
                        EFFECT_OPTIONS
                    }
                    value={
                        effectsOfPain
                    }
                    onChange={(value) =>
                        toggleArrayValue(
                            value,
                            effectsOfPain,
                            setEffectsOfPain
                        )
                    }
                />


                <div className="
                    mt-5
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                ">

                    <TextAreaField
                        label="Pain Details Before"
                        value={
                            painDetailsBefore
                        }
                        onChange={
                            setPainDetailsBefore
                        }
                        placeholder="Enter comments"
                    />

                    <TextAreaField
                        label="Pain Details After"
                        value={
                            painDetailsAfter
                        }
                        onChange={
                            setPainDetailsAfter
                        }
                        placeholder="Enter pain details"
                    />

                </div>


                <TextAreaField
                    label="Other Comments"
                    value={
                        otherComments
                    }
                    onChange={
                        setOtherComments
                    }
                    placeholder="Enter comments"
                />

            </>


            {/* ================================= */}
            {/* ERROR */}
            {/* ================================= */}

            {submitError && (

                <div className="
                    mt-5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    p-4
                    text-sm
                    text-red-600
                ">
                    {submitError}
                </div>

            )}


            {/* ================================= */}
            {/* SUBMIT */}
            {/* ================================= */}

            <div className="
                mt-8
                flex
                justify-end
                gap-3
                border-t
                border-[#E7DCD4]
                pt-5
            ">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/duty-doctor/dashboard"
                        )
                    }
                    className="
                        rounded-xl
                        border
                        border-[#E2D4C8]
                        bg-white
                        px-7
                        py-3
                        font-semibold
                        text-[#4D2E23]
                    "
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={
                        submittingAssessment
                    }
                    className="
                        rounded-xl
                        bg-[#4D2E23]
                        px-8
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#653D2F]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {submittingAssessment
                        ? "Submitting..."
                        : isPost
                            ? "Submit Treatment Assessment"
                            : "Submit Initial Assessment"}

                </button>

            </div>

        </form>

    );

};


/**
 * ==========================================
 * POST ASSESSMENT
 * ==========================================
 */

const PostAssessmentFields = ({
    painScore,
    setPainScore,
    painDetailsBefore,
    setPainDetailsBefore,
    painDetailsAfter,
    setPainDetailsAfter,
    otherComments,
    setOtherComments,
}) => {

    return (

        <>

            <PainScore
                value={
                    painScore
                }
                onChange={
                    setPainScore
                }
            />


            <div className="
                mt-5
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
            ">

                <TextAreaField
                    label="Pain Details Before"
                    value={
                        painDetailsBefore
                    }
                    onChange={
                        setPainDetailsBefore
                    }
                    placeholder="Initial pain details"
                />


                <TextAreaField
                    label="Pain Details After"
                    value={
                        painDetailsAfter
                    }
                    onChange={
                        setPainDetailsAfter
                    }
                    placeholder="Enter pain details after treatment"
                />

            </div>


            <TextAreaField
                label="Other Comments"
                value={
                    otherComments
                }
                onChange={
                    setOtherComments
                }
                placeholder="Enter comments"
            />

        </>

    );

};


/**
 * ==========================================
 * PAIN SCORE
 * ==========================================
 */

const PainScore = ({
    value,
    onChange,
}) => {

    return (

        <div className="
            mt-5
            rounded-2xl
            border
            border-[#E7DCD4]
            bg-white
            p-5
        ">

            <div className="
                flex
                items-center
                gap-3
            ">

                <label className="
                    font-semibold
                    text-[#4D2E23]
                ">
                    Pain score:
                </label>


                <input
                    type="number"
                    min="0"
                    max="10"
                    value={value}
                    onChange={(e) => {

                        const next =
                            e.target.value;

                        if (
                            next === "" ||
                            (
                                Number(next) >= 0 &&
                                Number(next) <= 10
                            )
                        ) {

                            onChange(
                                next
                            );

                        }

                    }}
                    className="
                        w-16
                        rounded-xl
                        border
                        border-[#E5D6CA]
                        px-3
                        py-2
                        text-center
                        outline-none
                        focus:border-[#8B4A38]
                    "
                />

                <span>
                    / 10
                </span>

            </div>


            {/* SCALE */}

            <div className="
                mt-6
                flex
                items-center
                justify-between
            ">

                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    .map(
                        (score) => {

                            const active =
                                Number(value) ===
                                score;


                            return (

                                <button
                                    type="button"
                                    key={score}
                                    onClick={() =>
                                        onChange(
                                            score
                                        )
                                    }
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        gap-1
                                    "
                                >

                                    <span className={`
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        text-xs
                                        ${
                                            active
                                                ? "border-[#8B4A38] bg-[#F4D8C7]"
                                                : "border-[#C8B6A8] bg-white"
                                        }
                                    `}>
                                        {score}
                                    </span>

                                </button>

                            );

                        }
                    )}

            </div>

        </div>

    );

};


/**
 * ==========================================
 * CHECKBOX SECTION
 * ==========================================
 */

const CheckboxSection = ({
    title,
    options,
    value,
    onChange,
}) => {

    return (

        <div className="
            mt-5
            rounded-2xl
            border
            border-[#E7DCD4]
            bg-white
            p-5
        ">

            <h3 className="
                mb-5
                font-semibold
                text-[#4D2E23]
            ">
                {title}
                <span className="
                    ml-2
                    text-xs
                    font-normal
                    text-[#888]
                ">
                    (Select all that apply)
                </span>
            </h3>


            <div className="
                grid
                grid-cols-2
                gap-x-8
                gap-y-5
                md:grid-cols-4
            ">

                {options.map(
                    (option) => {

                        const checked =
                            value.includes(
                                option
                            );


                        return (

                            <label
                                key={option}
                                className="
                                    flex
                                    cursor-pointer
                                    items-center
                                    gap-3
                                    text-sm
                                    text-[#4D2E23]
                                "
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        checked
                                    }
                                    onChange={() =>
                                        onChange(
                                            option
                                        )
                                    }
                                    className="
                                        h-4
                                        w-4
                                        accent-[#4D2E23]
                                    "
                                />

                                {option}

                            </label>

                        );

                    }
                )}

            </div>

        </div>

    );

};


/**
 * ==========================================
 * READ ONLY FIELD
 * ==========================================
 */

const ReadOnlyField = ({
    label,
    value,
}) => {

    return (

        <div>

            <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#4D2E23]
            ">
                {label}
            </label>

            <div className="
                rounded-xl
                border
                border-[#E7DCD4]
                bg-white
                px-4
                py-3
                text-sm
                text-[#4D2E23]
            ">
                {value || "-"}
            </div>

        </div>

    );

};


/**
 * ==========================================
 * INPUT
 * ==========================================
 */

const FormInput = ({
    label,
    value,
    onChange,
    placeholder,
}) => {

    return (

        <div className="
            mt-5
            rounded-2xl
            border
            border-[#E7DCD4]
            bg-white
            p-5
        ">

            <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#4D2E23]
            ">
                {label}
            </label>

            <input
                value={value}
                onChange={(e) =>
                    onChange(
                        e.target.value
                    )
                }
                placeholder={
                    placeholder
                }
                className="
                    w-full
                    rounded-xl
                    border
                    border-[#E7DCD4]
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-[#8B4A38]
                "
            />

        </div>

    );

};


/**
 * ==========================================
 * TEXTAREA
 * ==========================================
 */

const TextAreaField = ({
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
}) => {

    return (

        <div className="
            mt-5
        ">

            <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#4D2E23]
            ">
                {label}
            </label>

            <textarea
                value={value}
                onChange={(e) =>
                    onChange?.(
                        e.target.value
                    )
                }
                disabled={
                    disabled
                }
                placeholder={
                    placeholder
                }
                rows={3}
                className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-[#E7DCD4]
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-[#8B4A38]
                    disabled:bg-[#F7F5F2]
                "
            />

        </div>

    );

};


export default PainAssessmentForm;