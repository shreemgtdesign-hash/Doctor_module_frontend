import { useEffect, useRef, useState } from "react";
import { HiOutlineMicrophone } from "react-icons/hi2";

const SpeechToTextTextarea = ({
    value = "",
    onChange,
    placeholder = "Enter notes...",
    rows = 4,
    className = "",
}) => {

    const recognitionRef = useRef(null);

    const [isListening, setIsListening] =
        useState(false);

    const [isSupported, setIsSupported] =
        useState(true);


    // ==========================================
    // SPEECH RECOGNITION SETUP
    // ==========================================

    useEffect(() => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        const recognition =
            new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;

        // Change this if you need Tamil
        recognition.lang = "en-IN";


        // ======================================
        // RESULT
        // ======================================

        recognition.onresult = (event) => {

            let finalText = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const transcript =
                    event.results[i][0].transcript;

                if (
                    event.results[i].isFinal
                ) {
                    finalText += transcript;
                }
            }

            if (finalText.trim()) {

                const newValue =
                    value
                        ? `${value.trim()} ${finalText.trim()}`
                        : finalText.trim();

                onChange({
                    target: {
                        value: newValue,
                    },
                });
            }
        };


        // ======================================
        // END
        // ======================================

        recognition.onend = () => {
            setIsListening(false);
        };


        recognition.onerror = () => {
            setIsListening(false);
        };


        recognitionRef.current =
            recognition;


        return () => {

            recognition.stop();

            recognitionRef.current =
                null;

        };

    }, [value, onChange]);


    // ==========================================
    // TOGGLE MICROPHONE
    // ==========================================

    const toggleListening = () => {

        if (!isSupported) {
            alert(
                "Speech recognition is not supported in this browser."
            );
            return;
        }

        if (isListening) {

            recognitionRef.current?.stop();

            setIsListening(false);

            return;
        }


        try {

            recognitionRef.current?.start();

            setIsListening(true);

        } catch (error) {

            console.error(
                "Speech recognition error:",
                error
            );

        }
    };


    return (

        <div
            className={`
                relative
                ${className}
            `}
        >

            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-[#E7DBD3]
                    bg-white
                    px-4
                    py-3
                    pr-12
                    text-sm
                    text-[#4B2E2A]
                    outline-none
                    transition
                    focus:border-[#A65E10]
                    focus:ring-1
                    focus:ring-[#A65E10]
                "
            />


            {/* ======================================
                MICROPHONE BUTTON
            ====================================== */}

            {isSupported && (

                <button
                    type="button"
                    onClick={toggleListening}
                    title={
                        isListening
                            ? "Stop speaking"
                            : "Speak to text"
                    }
                    className={`
                        absolute
                        right-3
                        bottom-3
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        transition

                        ${
                            isListening
                                ? `
                                    bg-[#A65E10]
                                    text-white
                                  `
                                : `
                                    bg-[#FFF3E8]
                                    text-[#A65E10]
                                    hover:bg-[#FCE4D1]
                                  `
                        }
                    `}
                >

                    <HiOutlineMicrophone
                        size={18}
                    />

                </button>

            )}

        </div>

    );
};

export default SpeechToTextTextarea;