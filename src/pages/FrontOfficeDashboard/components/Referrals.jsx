import {
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import {
  useSelector,
} from "react-redux";

import DashboardCard
  from "../../../components/Dashboard/DashboardCard";
import { useNavigate } from "react-router-dom";


const Referrals = () => {
  const navigate = useNavigate()
  const referrals =
    useSelector(
      (state) =>
        state.frontOfficeDashboard
          .referrals
    );


  return (

    <DashboardCard
      className="
        px-5
        pt-5
        pb-5
      "
       onClick={()=> navigate('/frontoffice/insurance-list')}
      
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
          Referrals
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

          Till Date

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
          {referrals?.total_referrals ?? 0}
        </h1>

        <p
          className="
            text-[12px]
            text-[#7D726B]
          "
        >
          Total Referrals
        </p>

      </div>

    </DashboardCard>

  );
};


export default Referrals;