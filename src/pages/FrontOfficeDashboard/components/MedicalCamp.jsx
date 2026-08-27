import {
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import {
  useSelector,
} from "react-redux";
import DashboardCard from "../../../components/Dashboard/DashboardCard";
import { useNavigate } from "react-router-dom";

const MedicalCamp = () => {
  const navigate = useNavigate()
  const medicalCamp =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
          .medicalCamp
    );


  return (

    <DashboardCard
      className="
        px-5
        pt-5
        pb-5
      "
       onClick={()=> navigate('/frontoffice/medcamp-calender')}
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h2
          className="
            text-[17px]
            font-semibold
            text-[#4B2E2A]
          "
        >
          Medical Camp
        </h2>

        <button
          type="button"
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-[#E7DBD3]
            px-3
            py-2
            text-[12px]
            text-[#4B2E2A]
          "
        >

          <HiOutlineCalendarDays
            size={14}
          />

          This Week

          <span>⌄</span>

        </button>

      </div>


      <div className="mt-4">

        <h1
          className="
            text-[26px]
            font-bold
            text-[#4B2E2A]
          "
        >
          {medicalCamp?.total_registrations ?? 0}
        </h1>

        <p
          className="
            text-[12px]
            text-[#7D726B]
          "
        >
          Total Registrations
        </p>

      </div>

    </DashboardCard>

  );
};


export default MedicalCamp;