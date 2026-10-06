import {
    useEffect,
} from "react";

import {
    useDispatch,
} from "react-redux";

import DashboardLayout
    from "../../components/Layout/DashboardLayout";

import {
    getTherapistDashboard,
    loadTherapistScheduleOverview,
} from "../../redux/therapist/therapistThunk";

import TherapiesPerformed
    from "./components/TherapistPerformed";

import AilmentsAddressed
    from "./components/AilmentsAddressed";

import PatientsTended
    from "./components/PatientsTended";

import ScheduleOverview
    from "./components/ScheduleOverview";


const TherapistDashboard = () => {

    const dispatch = useDispatch();


    // ==========================================
    // INITIAL DASHBOARD LOAD (ALL INITIALIZED TO TODAY)
    // ==========================================

    useEffect(() => {

        dispatch(
            getTherapistDashboard("today")
        );

        dispatch(
            loadTherapistScheduleOverview("today")
        );

    }, [dispatch]);


    return (

        <DashboardLayout role="therapist">

            <div className="
                min-h-screen
                bg-[#F7F7F7]
                p-5
            ">

                {/* =================================
                    TOP: THERAPIES PERFORMED
                ================================= */}

                <TherapiesPerformed />


                {/* =================================
                    MAIN GRID
                ================================= */}

                <div className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-5
                ">

                    {/* =================================
                        LEFT: AILMENTS ADDRESSED
                    ================================= */}

                    <AilmentsAddressed />


                    {/* =================================
                        RIGHT: PATIENTS TENDED & SCHEDULE
                    ================================= */}

                    <div className="space-y-5">

                        <PatientsTended />

                        <ScheduleOverview />

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
};


export default TherapistDashboard;