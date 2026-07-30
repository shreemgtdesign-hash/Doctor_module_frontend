import {
  HiOutlineBell,
  HiOutlineChevronRight,
} from "react-icons/hi";

const Header = ({ setSidebarOpen }) => {
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  return (
    <header className="bg-[#FFF8F4] h-24 shadow-sm flex items-center justify-between pr-5">
      <div className="flex items-center gap-5">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-14 h-14 rounded-r-3xl bg-[#FFEAD8] flex items-center justify-center"
        >
          <HiOutlineChevronRight size={28} />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#FFEAD8]" />

          <div>
            <p className="text-xs tracking-[3px] text-gray-500 uppercase">
              Shree Ayurveda Hospital
            </p>

            <h1
              className="text-3xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              Namaste {doctor?.name || "Doctor"}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#FFEAD8]">
          <HiOutlineBell size={24} className="text-[#6A3F2D]" />
          <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full border-2 border-[#FFEAD8] bg-red-500"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;