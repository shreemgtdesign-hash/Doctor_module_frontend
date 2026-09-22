import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    HiOutlineChevronRight,
} from "react-icons/hi2";

import {
    loadPatientWellness,
} from "../../../redux/consultation/consultationThunk";


const fields = [
    {
        key: "bp",
        label: "BP",
        unit: "mmHg",
    },
    {
        key: "sugar",
        label: "Sugar",
        unit: "mg/dL",
    },
    {
        key: "pulse",
        label: "Pulse",
        unit: "bpm",
    },
    {
        key: "spo2",
        label: "SpO2",
        unit: "%",
    },
    {
        key: "temperature",
        label: "Temp.",
        unit: "C",
    },
    {
        key: "toxicity",
        label: "Toxicity",
        unit: "%",
    },
];


const JuniorVitals = ({
    patientId,
}) => {

    const dispatch =
        useDispatch();


    const {
        patientWellness,
    } = useSelector(
        (state) =>
            state.consultation
    );


    const [
        values,
        setValues,
    ] = useState({});


    // =====================================================
    // LOAD WELLNESS
    // =====================================================

    useEffect(() => {

        if (!patientId) {
            return;
        }

        dispatch(
            loadPatientWellness({
                patientId,
                period: "today",
            })
        );

    }, [
        dispatch,
        patientId,
    ]);


    // =====================================================
    // SET VALUES
    // =====================================================

    useEffect(() => {

        const vitals =
            patientWellness?.today ||
            patientWellness ||
            {};

        setValues({

            bp:
                vitals.bp ??
                "",

            sugar:
                vitals.sugar ??
                "",

            pulse:
                vitals.pulse ??
                "",

            spo2:
                vitals.spo2 ??
                "",

            temperature:
                vitals.temperature ??
                vitals.temp ??
                "",

            toxicity:
                vitals.toxicity ??
                vitals.body_toxicity ??
                "",

        });

    }, [
        patientWellness,
    ]);


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (
        key,
        value
    ) => {

        setValues(
            (prev) => ({
                ...prev,
                [key]: value,
            })
        );

    };


    // =====================================================
    // AYURVEDIC BODY TYPE
    // =====================================================

    const bodyType =
        patientWellness?.today?.ayurvedic_body_type ||
        patientWellness?.today?.body_type ||
        patientWellness?.today?.ayurvedic_type ||
        patientWellness?.ayurvedic_body_type ||
        patientWellness?.body_type ||
        patientWellness?.ayurvedic_type ||
        "--";


    return (

        <div
            className="
                overflow-hidden
                rounded-[16px]
                border
                border-[#E8DDD4]
                bg-white
            "
        >

            {/* ================================================= */}
            {/* VITALS GRID */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    grid-cols-[138px_1fr_1fr_1fr]
                "
            >

                {/* ============================================= */}
                {/* AYURVEDIC BODY TYPE */}
                {/* ============================================= */}

                <div
                    className="
                        row-span-2
                        flex
                        flex-col
                        items-center
                        justify-center
                        border-r
                        border-[#E8DDD4]
                        bg-[#FFFBF7]
                        px-4
                        py-5
                    "
                >

                    <p
                        className="
                            text-center
                            text-[14px]
                            font-semibold
                            leading-[18px]
                            text-[#4D2E23]
                        "
                    >
                        Ayurvedic
                        <br />
                        Body Type
                    </p>


                    <p
                        className="
                            mt-7
                            text-[18px]
                            font-semibold
                            text-[#2F2521]
                        "
                    >
                        {bodyType}
                    </p>


                    {/* Decorative leaf */}
                    <div
                        className="
                            mt-5
                            text-[#DDBA91]
                            opacity-70
                        "
                    >

                        <svg
                            width="58"
                            height="45"
                            viewBox="0 0 58 45"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >

                            <path
                                d="M8 39C18 28 28 18 51 7"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinecap="round"
                            />

                            <path
                                d="M15 31C13 25 14 20 18 17"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />

                            <path
                                d="M21 27C20 20 22 15 27 12"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />

                            <path
                                d="M29 22C29 16 32 11 37 9"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />

                            <path
                                d="M36 18C38 13 42 10 47 8"
                                stroke="currentColor"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />

                        </svg>

                    </div>

                </div>


                {/* ================================================= */}
                {/* SIX VITALS */}
                {/* ================================================= */}

                {fields.map(
                    (field, index) => {

                        const isTopRow =
                            index < 3;

                        const isLastColumn =
                            index === 2 ||
                            index === 5;

                        return (

                            <div
                                key={
                                    field.key
                                }
                                className={`
                                    flex
                                    min-h-[105px]
                                    flex-col
                                    items-center
                                    justify-center
                                    px-3
                                    py-4

                                    ${
                                        !isLastColumn
                                            ? "border-r border-[#E8DDD4]"
                                            : ""
                                    }

                                    ${
                                        isTopRow
                                            ? "border-b border-[#E8DDD4]"
                                            : ""
                                    }
                                `}
                            >

                                {/* Label */}

                                <p
                                    className="
                                        w-full
                                        text-left
                                        text-[13px]
                                        font-semibold
                                        text-[#4D2E23]
                                    "
                                >
                                    {
                                        field.label
                                    }
                                </p>


                                {/* Value */}

                                <input
                                    type="text"
                                    value={
                                        values[
                                            field.key
                                        ] ?? ""
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        handleChange(
                                            field.key,
                                            e.target.value
                                        )
                                    }
                                    placeholder="--"
                                    className="
                                        mt-2
                                        w-full
                                        border-0
                                        bg-transparent
                                        text-center
                                        text-[20px]
                                        font-semibold
                                        leading-none
                                        text-[#2F2521]
                                        outline-none
                                        placeholder:text-[#9AA0AE]
                                    "
                                />


                                {/* Unit */}

                                <p
                                    className="
                                        mt-2
                                        text-[12px]
                                        text-[#8B7A70]
                                    "
                                >
                                    {
                                        field.unit
                                    }
                                </p>

                            </div>

                        );

                    }
                )}

            </div>


            {/* ================================================= */}
            {/* VIEW PAST VITALS */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-end
                    border-t
                    border-[#E8DDD4]
                    px-4
                    py-3
                "
            >

                <button
                    type="button"
                    className="
                        flex
                        items-center
                        gap-1
                        text-[12px]
                        font-semibold
                        text-[#4D2E23]
                        transition
                        hover:text-[#8A563B]
                    "
                >

                    <span>
                        View Past Vitals
                    </span>

                    <HiOutlineChevronRight
                        size={15}
                    />

                </button>

            </div>

        </div>

    );

};


export default JuniorVitals;