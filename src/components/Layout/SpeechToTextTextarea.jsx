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
    const valueRef = useRef(value);

    const [isListening, setIsListening] =
        useState(false);

    const [isSupported, setIsSupported] =
        useState(true);


    // Keep latest value without recreating recognition
    useEffect(() => {
        valueRef.current = value;
    }, [value]);


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
        recognition.interimResults = false;
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

                if (
                    event.results[i].isFinal
                ) {

                    finalText +=
                        event.results[i][0].transcript;

                }

            }


            if (finalText.trim()) {

                const currentValue =
                    valueRef.current?.trim() || "";

                const newValue =
                    currentValue
                        ? `${currentValue} ${finalText.trim()}`
                        : finalText.trim();


                valueRef.current =
                    newValue;


                // IMPORTANT:
                // return string, not event object
                onChange?.(newValue);

            }

        };


        // ======================================
        // END
        // ======================================

        recognition.onend = () => {

            setIsListening(false);

        };


        // ======================================
        // ERROR
        // ======================================

        recognition.onerror = (event) => {

            console.error(
                "Speech recognition error:",
                event.error
            );

            setIsListening(false);

        };


        recognitionRef.current =
            recognition;


        return () => {

            recognition.stop();

            recognitionRef.current =
                null;

        };

    }, []);


    // ==========================================
    // TOGGLE
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
                "Speech recognition start error:",
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
                onChange={(e) =>
                    onChange?.(e.target.value)
                }
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