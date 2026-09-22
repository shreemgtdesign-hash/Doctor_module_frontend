import { useRef } from "react";


const tabs = [
    {
        label: "All",
        value: "",
    },
    {
        label: "Waiting",
        value: "waiting",
    },
    {
        label: "Checked In",
        value: "checked_in",
    },
    {
        label: "Diagnosis Completed",
        value: "basic_diagous_complete",
    },
];


const FilterTabs = ({
    value = "",
    onChange,
}) => {

    const tabRefs = useRef([]);


    return (
        <div className="mt-5 overflow-x-auto hide-scrollbar">

            <div className="flex w-max gap-3 pr-8">

                {tabs.map((tab, index) => {

                    const isActive =
                        value === tab.value;


                    return (
                        <button
                            key={
                                tab.value ||
                                "all"
                            }
                            ref={(el) => {
                                tabRefs.current[index] =
                                    el;
                            }}
                            type="button"
                            onClick={() => {

                                onChange?.(
                                    tab.value
                                );

                            }}
                            onMouseEnter={() =>
                                tabRefs.current[
                                    index
                                ]?.scrollIntoView({
                                    behavior:
                                        "smooth",
                                    inline:
                                        "center",
                                    block:
                                        "nearest",
                                })
                            }
                            className={`
                                h-12
                                whitespace-nowrap
                                rounded-[16px]
                                border
                                px-6
                                text-[16px]
                                font-medium
                                transition-all

                                ${
                                    isActive
                                        ? "border-[#5A3224] bg-[#FDEEDC] text-[#5A3224]"
                                        : "border-[#5A3224] bg-white text-[#5A3224] hover:bg-[#FDEEDC]"
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    );

                })}

            </div>

        </div>
    );
};


export default FilterTabs;