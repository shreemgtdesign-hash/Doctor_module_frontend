import { useDispatch, useSelector } from "react-redux";
import { loadAppointments } from "../../../redux/consultation/consultationThunk";
import { setActiveFilter } from "../../../redux/consultation/consultationSlice";
import { useRef } from "react";

const tabs = [
  { label: "All", value: "" },
  { label: "Waiting", value: "waiting" },
  { label: "Checked In", value: "checked_in" },
  { label: "Completed", value: "completed" },
];

const FilterTabs = () => {
  const dispatch = useDispatch();

  const doctor = useSelector((state) => state.auth.user);

  const activeTab = useSelector(
    (state) => state.consultation.activeFilter
  );

  // ✅ Hook belongs here
  const tabRefs = useRef([]);

  const handleTabClick = (tab) => {
    dispatch(setActiveFilter(tab.value));

    dispatch(
      loadAppointments({
        doctorId: doctor.id,
        date: new Date().toISOString().split("T")[0],
        status: tab.value,
      })
    );
  };

  return (
    <div className="mt-5 overflow-x-auto hide-scrollbar">
      <div className="flex w-max gap-3 pr-8">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            ref={(el) => (tabRefs.current[index] = el)}
            onMouseEnter={() =>
              tabRefs.current[index]?.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
              })
            }
            onClick={() => handleTabClick(tab)}
            className={`h-12 whitespace-nowrap rounded-[16px] border px-6 text-[16px] font-medium transition-all ${
              activeTab === tab.value
                ? "border-[#5A3224] bg-[#FDEEDC] text-[#5A3224]"
                : "border-[#5A3224] bg-white text-[#5A3224] hover:bg-[#FDEEDC]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;