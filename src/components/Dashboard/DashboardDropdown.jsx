import { HiOutlineCalendar } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";


const DashboardDropdown = ({
  value,
  options = [],
  onChange,
}) => {
  
  return (
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()} // <-- Prevent parent click
    >
      <select
        value={value}
        onClick={(e) => e.stopPropagation()} // <-- Prevent click bubbling
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value);
        }}
        className="
          appearance-none
          rounded-full
          border
          border-[#E7DBD3]
          bg-white
          pl-10
          pr-10
          py-2
          text-[15px]
          text-[#4B2E2A]
          outline-none
          cursor-pointer
        "
      >
        {options.map((item) => (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>

      <HiOutlineCalendar
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-[#8D6C61]
        "
      />

      <HiChevronDown
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-[#8D6C61]
        "
      />
    </div>
  );
};

export default DashboardDropdown;