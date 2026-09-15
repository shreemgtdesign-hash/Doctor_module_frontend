import toast from "react-hot-toast";
import {
    HiOutlineCheck,
    HiOutlineXMark,
} from "react-icons/hi2";


const CustomToast = ({
    t,
    title,
    message,
}) => {

    return (
        <div
            className={`
                flex
                w-[700px]
                max-w-[calc(100vw-32px)]
                items-center
                gap-6
                rounded-[30px]
                border
                border-[#E8E2D9]
                bg-gradient-to-r
                from-[#F1FFF4]
                via-white
                to-white
                px-8
                py-7
                shadow-[0_12px_30px_rgba(0,0,0,0.15)]
                transition-all
                duration-300
                ${
                    t.visible
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-4 opacity-0"
                }
            `}
        >

            {/* ================================= */}
            {/* SUCCESS ICON */}
            {/* ================================= */}

            <div
                className="
                    flex
                    h-[88px]
                    w-[88px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-[6px]
                    border-[#19A84A]
                    bg-white
                "
            >

                <HiOutlineCheck
                    size={52}
                    strokeWidth={3}
                    className="
                        text-[#19A84A]
                    "
                />

            </div>


            {/* ================================= */}
            {/* CONTENT */}
            {/* ================================= */}

            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                <h3
                    className="
                        text-[27px]
                        font-semibold
                        leading-tight
                        text-[#225B32]
                    "
                >
                    {title}
                </h3>


                <p
                    className="
                        mt-5
                        text-[19px]
                        font-medium
                        leading-7
                        text-[#292929]
                    "
                >
                    {message}
                </p>

            </div>


            {/* ================================= */}
            {/* CLOSE */}
            {/* ================================= */}

            <button
                type="button"
                onClick={() => {
                    toast.dismiss(t.id);
                }}
                className="
                    self-start
                    rounded-full
                    p-1
                    text-[#59352C]
                    transition
                    hover:bg-[#F5EEE8]
                "
            >

                <HiOutlineXMark
                    size={30}
                />

            </button>

        </div>
    );
};


export default CustomToast;