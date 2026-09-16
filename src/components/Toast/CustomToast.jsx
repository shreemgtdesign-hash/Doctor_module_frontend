import toast from "react-hot-toast";

import {
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineExclamationTriangle,
    HiOutlineInformationCircle,
    HiOutlineClock,
} from "react-icons/hi2";

import {
    FiLoader,
    FiCheckCircle,
} from "react-icons/fi";


const toastThemes = {

    success: {
        title: "Success",
        icon: HiOutlineCheck,

        card:
            "from-[#F0FFF5] via-white to-[#E8FFF0]",

        border:
            "border-[#BDEDCB]",

        iconOuter:
            "bg-[#D9FFE4]",

        iconInner:
            "bg-gradient-to-br from-[#35D66D] via-[#16B957] to-[#07843F]",

        iconColor:
            "text-white",

        badge:
            "bg-[#DDF9E5] text-[#149447] border-[#B9EBC8]",

        progress:
            "from-[#35D66D] via-[#16B957] to-[#07843F]",

        titleColor:
            "text-[#145A2C]",

        glow:
            "bg-[#8AF5AA]/30",
    },


    error: {
        title: "Error",
        icon: HiOutlineXMark,

        card:
            "from-[#FFF2F3] via-white to-[#FFE9EC]",

        border:
            "border-[#F5C4CB]",

        iconOuter:
            "bg-[#FFE0E4]",

        iconInner:
            "bg-gradient-to-br from-[#FF5C68] via-[#E63C4B] to-[#B91C2C]",

        iconColor:
            "text-white",

        badge:
            "bg-[#FFE4E7] text-[#D72D3D] border-[#F4BEC5]",

        progress:
            "from-[#FF6974] via-[#E63C4B] to-[#B91C2C]",

        titleColor:
            "text-[#8F1D2B]",

        glow:
            "bg-[#FF8F9A]/25",
    },


    warning: {
        title: "Warning",
        icon: HiOutlineExclamationTriangle,

        card:
            "from-[#FFF9EA] via-white to-[#FFF3D5]",

        border:
            "border-[#F4D99B]",

        iconOuter:
            "bg-[#FFF0C9]",

        iconInner:
            "bg-gradient-to-br from-[#FFB52E] via-[#F59E0B] to-[#D97706]",

        iconColor:
            "text-white",

        badge:
            "bg-[#FFF0C9] text-[#D98208] border-[#F4D99B]",

        progress:
            "from-[#FFB52E] via-[#F59E0B] to-[#D97706]",

        titleColor:
            "text-[#9A5A00]",

        glow:
            "bg-[#FFD56A]/30",
    },


    info: {
        title: "Information",
        icon: HiOutlineInformationCircle,

        card:
            "from-[#EFF8FF] via-white to-[#E7F4FF]",

        border:
            "border-[#BBDDF8]",

        iconOuter:
            "bg-[#DCEFFF]",

        iconInner:
            "bg-gradient-to-br from-[#42A5F5] via-[#1688E8] to-[#0969C7]",

        iconColor:
            "text-white",

        badge:
            "bg-[#DDEFFF] text-[#0876D1] border-[#BBDDF8]",

        progress:
            "from-[#42A5F5] via-[#1688E8] to-[#0969C7]",

        titleColor:
            "text-[#075A9D]",

        glow:
            "bg-[#72C5FF]/25",
    },


    loading: {
        title: "Please Wait",
        icon: FiLoader,

        card:
            "from-[#F5F0FF] via-white to-[#F0EAFF]",

        border:
            "border-[#D8C9FF]",

        iconOuter:
            "bg-[#EDE5FF]",

        iconInner:
            "bg-gradient-to-br from-[#A78BFA] via-[#7C3AED] to-[#5B21B6]",

        iconColor:
            "text-white",

        badge:
            "bg-[#EDE5FF] text-[#7040D6] border-[#D8C9FF]",

        progress:
            "from-[#A78BFA] via-[#7C3AED] to-[#5B21B6]",

        titleColor:
            "text-[#52239B]",

        glow:
            "bg-[#BFA3FF]/25",
    },


    completion: {
        title: "Completed",
        icon: FiCheckCircle,

        card:
            "from-[#ECFFFF] via-white to-[#E9FFF8]",

        border:
            "border-[#B5EDE5]",

        iconOuter:
            "bg-[#D8FFF8]",

        iconInner:
            "bg-gradient-to-br from-[#34D5C4] via-[#13BBA9] to-[#079681]",

        iconColor:
            "text-white",

        badge:
            "bg-[#D8FFF3] text-[#069B86] border-[#AFE8DC]",

        progress:
            "from-[#34D5C4] via-[#13BBA9] to-[#079681]",

        titleColor:
            "text-[#087565]",

        glow:
            "bg-[#69E9D7]/25",
    },

};


const CustomToast = ({
    t,
    title,
    message,
    type = "success",
}) => {

    const theme =
        toastThemes[type] ||
        toastThemes.success;

    const Icon =
        theme.icon;


    return (
        <div
            className={`
                relative
                flex
                w-[720px]
                max-w-[calc(100vw-32px)]
                items-center
                gap-5
                overflow-hidden
                rounded-[28px]
                border
                ${theme.border}

                bg-gradient-to-br
                ${theme.card}

                px-6
                py-5

                shadow-[0_22px_65px_rgba(40,25,20,0.18)]

                backdrop-blur-xl

                transition-all
                duration-500

                ${
                    t.visible
                        ? "translate-y-0 scale-100 opacity-100"
                        : "-translate-y-5 scale-[0.96] opacity-0"
                }
            `}
        >

            {/* ========================================= */}
            {/* DECORATIVE GLOW */}
            {/* ========================================= */}

            <div
                className={`
                    pointer-events-none
                    absolute
                    -left-16
                    -top-20
                    h-[190px]
                    w-[190px]
                    rounded-full
                    blur-[60px]
                    ${theme.glow}
                `}
            />

            <div
                className={`
                    pointer-events-none
                    absolute
                    -bottom-24
                    right-0
                    h-[180px]
                    w-[180px]
                    rounded-full
                    blur-[65px]
                    ${theme.glow}
                `}
            />


            {/* ========================================= */}
            {/* TOP GLASS SHINE */}
            {/* ========================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-[8%]
                    right-[8%]
                    top-0
                    h-[2px]
                    rounded-full
                    bg-gradient-to-r
                    from-transparent
                    via-white
                    to-transparent
                "
            />


            {/* ========================================= */}
            {/* ICON */}
            {/* ========================================= */}

            <div
                className={`
                    relative
                    flex
                    h-[76px]
                    w-[76px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${theme.iconOuter}
                `}
            >

                <div
                    className={`
                        flex
                        h-[56px]
                        w-[56px]
                        items-center
                        justify-center
                        rounded-full
                        shadow-[0_8px_22px_rgba(0,0,0,0.14)]
                        ${theme.iconInner}
                    `}
                >

                    <Icon
                        size={32}
                        strokeWidth={2.8}
                        className={
                            theme.iconColor
                        }
                    />

                </div>

            </div>


            {/* ========================================= */}
            {/* CONTENT */}
            {/* ========================================= */}

            <div
                className="
                    relative
                    min-w-0
                    flex-1
                "
            >

                {/* TITLE + BADGE */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2.5
                    "
                >

                    <h3
                        className={`
                            text-[21px]
                            font-bold
                            leading-tight
                            tracking-[-0.3px]
                            ${theme.titleColor}
                        `}
                    >
                        {title}
                    </h3>


                    <span
                        className={`
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[1px]
                            ${theme.badge}
                        `}
                    >
                        {theme.title}
                    </span>

                </div>


                {/* MESSAGE */}

                <p
                    className="
                        mt-2.5
                        max-w-[570px]
                        text-[14px]
                        font-medium
                        leading-6
                        text-[#3F3733]
                    "
                >
                    {message}
                </p>


                {/* ================================= */}
                {/* PROGRESS BAR */}
                {/* ================================= */}

                <div
                    className="
                        mt-4
                        h-[3px]
                        w-full
                        overflow-hidden
                        rounded-full
                        bg-black/[0.06]
                    "
                >

                    <div
                        className={`
                            h-full
                            w-full
                            origin-left
                            rounded-full
                            bg-gradient-to-r
                            ${theme.progress}
                            animate-[toastProgress_5s_linear_forwards]
                        `}
                    />

                </div>

            </div>


            {/* ========================================= */}
            {/* CLOSE */}
            {/* ========================================= */}

            <button
                type="button"
                onClick={() =>
                    toast.dismiss(t.id)
                }
                className="
                    relative
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-[#604940]
                    transition-all
                    duration-200
                    hover:bg-black/[0.05]
                    hover:scale-105
                "
            >

                <HiOutlineXMark
                    size={22}
                />

            </button>

        </div>
    );
};


export default CustomToast;