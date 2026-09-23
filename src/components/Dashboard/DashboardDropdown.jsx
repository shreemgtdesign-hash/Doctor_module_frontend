import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    HiOutlineCalendar,
    HiChevronDown,
} from "react-icons/hi";


const DashboardDropdown = ({
    value,
    options = [],
    onChange,
}) => {

    const [open, setOpen] =
        useState(false);

    const dropdownRef =
        useRef(null);


    // ==========================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ==========================================

    useEffect(() => {

        const handleClickOutside =
            (event) => {

                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(
                        event.target
                    )
                ) {
                    setOpen(false);
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
    // SELECTED OPTION
    // ==========================================

    const selectedOption =
        options.find(
            (item) =>
                item.value === value
        );


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div
            ref={dropdownRef}
            className="
                relative
                inline-flex
            "
            onClick={(event) =>
                event.stopPropagation()
            }
        >

            {/* ================================= */}
            {/* DROPDOWN BUTTON */}
            {/* ================================= */}

            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (previous) =>
                            !previous
                    )
                }
                className="
                    flex
                    h-[40px]
                    min-w-[145px]
                    items-center
                    justify-between
                    gap-2

                    rounded-[12px]

                    border
                    border-[#E7D8CC]

                    bg-[#FFFCF9]

                    px-4

                    text-[13px]
                    font-medium
                    text-[#59352C]

                    shadow-sm

                    outline-none

                    transition

                    hover:bg-[#FFF6EE]
                "
            >

                {/* Calendar */}

                <span
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <HiOutlineCalendar
                        size={16}
                        className="
                            text-[#705247]
                        "
                    />

                    <span>
                        {
                            selectedOption?.label ||
                            "Select Period"
                        }
                    </span>

                </span>


                {/* Arrow */}

                <HiChevronDown
                    size={16}
                    className={`
                        text-[#705247]
                        transition-transform
                        duration-200
                        ${
                            open
                                ? "rotate-180"
                                : ""
                        }
                    `}
                />

            </button>


            {/* ================================= */}
            {/* CUSTOM OPTION LIST */}
            {/* ================================= */}

            {open && (

                <div
                    className="
                        absolute
                        right-0
                        top-[46px]

                        z-[100]

                        w-[145px]

                        overflow-hidden

                        rounded-[12px]

                        border
                        border-[#E7D8CC]

                        bg-white

                        shadow-[0_8px_20px_rgba(89,53,44,0.12)]
                    "
                >

                    {options.map(
                        (item) => {

                            const isActive =
                                item.value ===
                                value;


                            return (

                                <button
                                    key={
                                        item.value
                                    }
                                    type="button"
                                    onClick={() => {

                                        onChange(
                                            item.value
                                        );

                                        setOpen(
                                            false
                                        );

                                    }}
                                    className={`
                                        block
                                        w-full

                                        px-4
                                        py-3

                                        text-left
                                        text-[13px]

                                        transition

                                        ${
                                            isActive
                                                ? `
                                                    bg-[#FFF0E2]
                                                    font-semibold
                                                    text-[#59352C]
                                                `
                                                : `
                                                    bg-white
                                                    font-normal
                                                    text-[#555555]
                                                    hover:bg-[#FFF8F3]
                                                `
                                        }
                                    `}
                                >

                                    {
                                        item.label
                                    }

                                </button>

                            );

                        }
                    )}

                </div>

            )}

        </div>

    );
};


export default DashboardDropdown;