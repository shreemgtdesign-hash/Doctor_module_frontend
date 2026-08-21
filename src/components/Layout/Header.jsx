import {
    HiOutlineBell,
    HiOutlineChevronRight,
} from "react-icons/hi";

const Header = ({ setSidebarOpen }) => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <header className="flex h-24 items-center justify-between bg-[#FFF8F4] pr-5 shadow-sm">

            {/* ================================= */}
            {/* LEFT */}
            {/* ================================= */}

            <div className="flex items-center gap-5">

                {/* Sidebar Button */}

                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-r-3xl
                        bg-[#FFEAD8]
                    "
                >
                    <HiOutlineChevronRight size={28} />
                </button>


                {/* ================================= */}
                {/* PROFILE + HEADER */}
                {/* ================================= */}

                <div className="flex items-center gap-4">

                    {/* Profile Image */}

                    <div
                        className="
                            h-16
                            w-16
                            shrink-0
                            overflow-hidden
                            rounded-full
                            border-2
                            border-[#E7D5C8]
                            bg-[#FFEAD8]
                        "
                    >

                        {user?.profile_image ? (

                            <img
                                src={user.profile_image}
                                alt={user?.name || "Doctor"}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />

                        ) : (

                            <div
                                className="
                                    flex
                                    h-full
                                    w-full
                                    items-center
                                    justify-center
                                    text-lg
                                    font-semibold
                                    text-[#6A3F2D]
                                "
                            >
                                {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </div>

                        )}

                    </div>


                    {/* Header Text */}

                    <div>

                        <p
                            className="
                                text-xs
                                uppercase
                                tracking-[3px]
                                text-gray-500
                            "
                        >
                            Shree Ayurvedic group
                        </p>

                        <h1
                            className="text-3xl"
                            style={{
                                fontFamily: "Playfair Display",
                            }}
                        >
                            Dhanwantaraye Namaha{" "}
                            {user?.name || "User"}
                        </h1>

                    </div>

                </div>

            </div>


            {/* ================================= */}
            {/* NOTIFICATION */}
            {/* ================================= */}

            <div className="flex items-center justify-center">

                <button
                    type="button"
                    className="
                        relative
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FFEAD8]
                    "
                >

                    <HiOutlineBell
                        size={24}
                        className="text-[#6A3F2D]"
                    />

                    <span
                        className="
                            absolute
                            right-3
                            top-3
                            h-2.5
                            w-2.5
                            rounded-full
                            border-2
                            border-[#FFEAD8]
                            bg-red-500
                        "
                    />

                </button>

            </div>

        </header>
    );
};

export default Header;