import {
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
} from "react-redux";

import DashboardLayout
    from "../../components/Layout/DashboardLayout";

import { getTherapistDashboard } from "../../redux/therapist/therapistThunk";
import TherapiesPerformed from "./components/TherapistPerformed";
import AilmentsAddressed from "./components/AilmentsAddressed";
import PatientsTended from "./components/PatientsTended";
import Sales from "./components/Sales";


const TherapistDashboard = () => {

    const dispatch = useDispatch();


    const [period, setPeriod] =
        useState("week");


    useEffect(() => {

        dispatch(
            getTherapistDashboard()
        );

    }, [dispatch]);


    return (

        <DashboardLayout role="therapist">

            <div className="
                min-h-screen
                bg-[#F7F7F7]
                p-5
            ">

                {/* ============================= */}
                {/* TOP */}
                {/* ============================= */}

                <TherapiesPerformed
                    period={period}
                    setPeriod={setPeriod}
                />


                {/* ============================= */}
                {/* MAIN GRID */}
                {/* ============================= */}

                <div className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-5
                ">

                    {/* LEFT */}

                    <AilmentsAddressed
                        period={period}
                        setPeriod={setPeriod}
                    />


                    {/* RIGHT */}

                    <div className="space-y-5">

                        <PatientsTended
                            period={period}
                            setPeriod={setPeriod}
                        />

                        <Sales
                            period={period}
                            setPeriod={setPeriod}
                        />

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
};


export default TherapistDashboard;