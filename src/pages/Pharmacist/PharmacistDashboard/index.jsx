import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
    loadMedicinesDispensed,
    loadPharmacistAilments,
    loadPatientsTended,
    loadPharmacistSales,
} from "../../../redux/pharmacist/pharmacistThunk";

import MedicinesDispensed from "./components/MedicinesDispensed";
import AilmentsAddressed from "./components/AilmentsAddressed";
import PatientsTended from "./components/PatientsTended";
import Sales from "./components/Sales";

import DashboardLayout from "../../../components/Layout/DashboardLayout";

const PharmacistDashboard = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(loadMedicinesDispensed());
        dispatch(loadPharmacistAilments());
        dispatch(loadPatientsTended());
        dispatch(loadPharmacistSales());

    }, [dispatch]);


    return (

        <DashboardLayout role="pharmacist">

            {/* Dashboard Container */}

            <div className="w-full px-1 py-1">

                {/* ========================================= */}
                {/* TOP CARD */}
                {/* ========================================= */}

                <div className="mb-6">

                    <MedicinesDispensed />

                </div>


                {/* ========================================= */}
                {/* BOTTOM GRID */}
                {/* ========================================= */}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {/* ===================================== */}
                    {/* LEFT */}
                    {/* ===================================== */}

                    <div className="min-w-0">

                        <AilmentsAddressed />

                    </div>


                    {/* ===================================== */}
                    {/* RIGHT */}
                    {/* ===================================== */}

                    <div className="min-w-0 space-y-6">

                        <PatientsTended />

                        <Sales />

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
};

export default PharmacistDashboard;