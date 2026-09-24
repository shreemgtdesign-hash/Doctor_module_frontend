import {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  loadCorporateDashboard,
} from "../../../redux/corporate/corporateDashboardThunk";

import CorporateHero from "./components/CorporateHero";
import UpcomingEvents from "./components/UpcomingEvents";


const CorporateDashboard = () => {

  const dispatch = useDispatch();


  const {
    loading,
    error,
  } = useSelector(
    (state) =>
      state.corporateDashboard
  );


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {

    dispatch(
      loadCorporateDashboard()
    );

  }, [dispatch]);


  return (
    <div
      className="
        min-h-screen
        bg-white
        px-5
        py-5
      "
    >

      {/* HERO */}

      <CorporateHero />


      {/* ERROR */}

      {error && (
        <div
          className="
            mt-5
            rounded-xl
            bg-red-50
            p-4
            text-sm
            text-red-600
          "
        >
          {typeof error === "string"
            ? error
            : "Failed to load corporate dashboard."}
        </div>
      )}


      {/* UPCOMING EVENTS */}

      <UpcomingEvents />

    </div>
  );
};


export default CorporateDashboard;