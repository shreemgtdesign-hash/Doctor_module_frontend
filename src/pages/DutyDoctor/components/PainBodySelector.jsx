

import bodyFront
    from "../../../assets/b1.png";

import bodySideLeft
    from "../../../assets/b2.png";

import bodyBack
    from "../../../assets/b3.png";

import bodySideRight
    from "../../../assets/b4.png";

import headParts
    from "../../../assets/b5.png";


const BODY_POINTS = {

    front: [

        {
            id: "front-head",
            label: "Head / Scalp",
            top: "7%",
            left: "50%",
        },

        {
            id: "front-left-shoulder",
            label: "Left Shoulder / Deltoid",
            top: "20%",
            left: "30%",
        },

        {
            id: "front-right-shoulder",
            label: "Right Shoulder / Deltoid",
            top: "20%",
            left: "70%",
        },

        {
            id: "front-chest",
            label: "Chest / Thoracic",
            top: "38%",
            left: "50%",
        },

        {
            id: "front-left-arm",
            label: "Left Arm",
            top: "40%",
            left: "27%",
        },

        {
            id: "front-right-arm",
            label: "Right Arm",
            top: "40%",
            left: "73%",
        },

        {
            id: "front-left-knee",
            label: "Left Knee",
            top: "69%",
            left: "42%",
        },

        {
            id: "front-right-knee",
            label: "Right Knee",
            top: "69%",
            left: "58%",
        },

        {
            id: "front-left-foot",
            label: "Left Foot",
            top: "88%",
            left: "42%",
        },

        {
            id: "front-right-foot",
            label: "Right Foot",
            top: "88%",
            left: "58%",
        },

    ],


    sideLeft: [

        {
            id: "side-left-head",
            label: "Left Head",
            top: "9%",
            left: "54%",
        },

        {
            id: "side-left-neck",
            label: "Left Neck / Cervical Spine",
            top: "25%",
            left: "50%",
        },

        {
            id: "side-left-shoulder",
            label: "Left Shoulder",
            top: "34%",
            left: "56%",
        },

        {
            id: "side-left-knee",
            label: "Left Knee",
            top: "70%",
            left: "55%",
        },

        {
            id: "side-left-foot",
            label: "Left Foot",
            top: "89%",
            left: "55%",
        },

    ],


    sideRight: [

        {
            id: "side-right-head",
            label: "Right Head",
            top: "9%",
            left: "46%",
        },

        {
            id: "side-right-neck",
            label: "Right Neck / Cervical Spine",
            top: "25%",
            left: "50%",
        },

        {
            id: "side-right-shoulder",
            label: "Right Shoulder",
            top: "34%",
            left: "44%",
        },

        {
            id: "side-right-knee",
            label: "Right Knee",
            top: "70%",
            left: "45%",
        },

        {
            id: "side-right-foot",
            label: "Right Foot",
            top: "89%",
            left: "45%",
        },

    ],


    back: [

        {
            id: "back-head",
            label: "Back of Head",
            top: "8%",
            left: "50%",
        },

        {
            id: "back-neck",
            label: "Neck / Cervical Spine",
            top: "23%",
            left: "50%",
        },

        {
            id: "back-upper",
            label: "Upper Back / Thoracic Spine",
            top: "35%",
            left: "50%",
        },

        {
            id: "back-lower",
            label: "Lower Back / Lumbar Spine",
            top: "48%",
            left: "50%",
        },

        {
            id: "back-left-knee",
            label: "Left Knee",
            top: "70%",
            left: "42%",
        },

        {
            id: "back-right-knee",
            label: "Right Knee",
            top: "70%",
            left: "58%",
        },

    ],

};


const PainBodySelector = ({
    value = [],
    onChange,
}) => {

    const selectedLocations =
        value;


    const toggleLocation = (
        label
    ) => {

        const exists =
            selectedLocations.includes(
                label
            );


        if (exists) {

            onChange(
                selectedLocations.filter(
                    (item) =>
                        item !== label
                )
            );

        } else {

            onChange([
                ...selectedLocations,
                label,
            ]);

        }

    };


    return (

        <div className="
            rounded-2xl
            border
            border-[#E8DDD5]
            bg-white
            p-5
        ">


            <h3 className="
                mb-5
                text-[16px]
                font-semibold
                text-[#4D2E23]
            ">
                Location of Pain
            </h3>


            <div className="
                grid
                grid-cols-2
                gap-4
                lg:grid-cols-5
            ">


                <BodyImage
                    image={bodyFront}
                    points={
                        BODY_POINTS.front
                    }
                    selected={
                        selectedLocations
                    }
                    onToggle={
                        toggleLocation
                    }
                />


                <BodyImage
                    image={
                        bodySideLeft
                    }
                    points={
                        BODY_POINTS.sideLeft
                    }
                    selected={
                        selectedLocations
                    }
                    onToggle={
                        toggleLocation
                    }
                />


                <BodyImage
                    image={
                        bodyBack
                    }
                    points={
                        BODY_POINTS.back
                    }
                    selected={
                        selectedLocations
                    }
                    onToggle={
                        toggleLocation
                    }
                />


                <BodyImage
                    image={
                        bodySideRight
                    }
                    points={
                        BODY_POINTS.sideRight
                    }
                    selected={
                        selectedLocations
                    }
                    onToggle={
                        toggleLocation
                    }
                />


                <BodyImage
                    image={
                        headParts
                    }
                    points={[]}
                    selected={
                        selectedLocations
                    }
                    onToggle={
                        toggleLocation
                    }
                />

            </div>


            {/* SELECTED LOCATIONS */}

            {selectedLocations.length >
                0 && (

                <div className="mt-4">

                    <p className="
                        text-sm
                        font-medium
                        text-[#4D2E23]
                    ">
                        Selected:
                    </p>

                    <div className="
                        mt-2
                        flex
                        flex-wrap
                        gap-2
                    ">

                        {selectedLocations.map(
                            (location) => (

                                <span
                                    key={location}
                                    className="
                                        rounded-full
                                        bg-[#FFF0E3]
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        text-[#6B4031]
                                    "
                                >
                                    {location}
                                </span>

                            )
                        )}

                    </div>

                </div>

            )}

        </div>

    );

};


/**
 * ==========================================
 * BODY IMAGE
 * ==========================================
 */

const BodyImage = ({
    image,
    points,
    selected,
    onToggle,
}) => {

    return (

        <div className="
            relative
            overflow-hidden
            rounded-xl
            border
            border-[#E8DDD5]
            bg-[#FCFCFC]
        ">

            <img
                src={image}
                alt="Pain location body"
                className="
                    block
                    h-full
                    w-full
                    object-contain
                "
            />


            {points.map(
                (point) => {

                    const active =
                        selected.includes(
                            point.label
                        );


                    return (

                        <button
                            key={
                                point.id
                            }
                            type="button"
                            title={
                                point.label
                            }
                            onClick={() =>
                                onToggle(
                                    point.label
                                )
                            }
                            style={{
                                top:
                                    point.top,
                                left:
                                    point.left,
                            }}
                            className={`
                                absolute
                                h-8
                                w-8
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                border-[3px]
                                transition-all
                                duration-200

                                ${
                                    active
                                        ? "border-[#8B4A38] bg-[#8B4A38]"
                                        : "border-[#F2C18D] bg-[#FFFBD5]"
                                }
                            `}
                        />

                    );

                }

            )}

        </div>

    );

};


export default PainBodySelector;