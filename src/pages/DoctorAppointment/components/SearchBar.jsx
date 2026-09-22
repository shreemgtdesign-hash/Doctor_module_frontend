import { HiOutlineSearch } from "react-icons/hi";


const SearchBar = ({
    value = "",
    onChange,
}) => {

    return (
        <div className="relative mt-5">

            <HiOutlineSearch
                className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-[#A28B80]
                "
                size={22}
            />

            <input
                type="text"
                value={value}
                onChange={(e) =>
                    onChange?.(
                        e.target.value
                    )
                }
                placeholder="Search patient..."
                className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-[#ECE3DC]
                    bg-[#F8F6F5]
                    pl-14
                    pr-4
                    outline-none
                    focus:border-[#8B573D]
                    focus:bg-white
                "
            />

        </div>
    );
};


export default SearchBar;