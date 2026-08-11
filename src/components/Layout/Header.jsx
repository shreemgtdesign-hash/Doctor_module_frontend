import {
    HiOutlineBell,
    HiOutlineChevronRight,
} from "react-icons/hi";

const Header = ({ setSidebarOpen, role }) => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <header className="flex h-24 items-center justify-between bg-[#FFF8F4] pr-5 shadow-sm">

            {/* Left */}
            <div className="flex items-center gap-5">

                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-r-3xl bg-[#FFEAD8]"
                >
                    <HiOutlineChevronRight size={28} />
                </button>

                <div className="flex items-center gap-4">

                    {/* Profile */}
                    <div className="h-14 w-14 rounded-full bg-[#FFEAD8]" />

                    <div>

                        <p className="text-xs uppercase tracking-[3px] text-gray-500">
                            Shree Ayurveda Hospital
                        </p>

                        <h1
                            className="text-3xl"
                            style={{
                                fontFamily: "Playfair Display",
                            }}
                        >
                            Namaste {user?.name || "User"}
                        </h1>

                    </div>

                </div>

            </div>

            {/* Notification */}
            <div className="flex items-center justify-center">

                <button
                    type="button"
                    className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#FFEAD8]"
                >
                    <HiOutlineBell
                        size={24}
                        className="text-[#6A3F2D]"
                    />

                    <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-[#FFEAD8] bg-red-500" />
                </button>

            </div>

        </header>
    );
};

export default Header;