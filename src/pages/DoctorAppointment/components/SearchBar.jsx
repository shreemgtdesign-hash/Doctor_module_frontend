import { HiOutlineSearch } from "react-icons/hi";

const SearchBar = () => {
  return (
    <div className="relative mt-5">
      <HiOutlineSearch
        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A28B80]"
        size={22}
      />

      <input
        type="text"
        placeholder="Search patient..."
        className="w-full h-14 rounded-2xl bg-[#F8F6F5] border border-[#ECE3DC] pl-14 pr-4 outline-none"
      />
    </div>
  );
};

export default SearchBar;