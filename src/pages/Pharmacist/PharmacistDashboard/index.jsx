import {
    useEffect,
} from "react";

import {
    useDispatch,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    HiOutlinePlus,
} from "react-icons/hi2";

import {
    loadMedicinesDispensed,
    loadPharmacistAilments,
    loadPatientsTended,
    loadPharmacistSales,
} from "../../../redux/pharmacist/pharmacistThunk";

import MedicinesDispensed
    from "./components/MedicinesDispensed";

import AilmentsAddressed
    from "./components/AilmentsAddressed";

import PatientsTended
    from "./components/PatientsTended";

import Sales
    from "./components/Sales";

import DashboardCard
    from "../../../components/Dashboard/DashboardCard";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";


const PharmacistDashboard = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        dispatch(
            loadMedicinesDispensed( "week")
        );

        dispatch(
            loadPharmacistAilments( "week")
        );

        dispatch(
            loadPatientsTended( "week")
        );

        dispatch(
            loadPharmacistSales(
                "week"
            )
        );

    }, [dispatch]);


    // ==========================================
    // ADD EMPLOYEE PURCHASE
    // ==========================================

    const handleAddPurchase = () => {

        navigate(
            "/pharmacist/employee-purchases/add"
        );

    };


    return (

        <DashboardLayout
            role="pharmacist"
        >

            <div className="
                w-full
                px-2
                py-2
            ">


                {/* ================================================= */}
                {/* TOP ROW */}
                {/* ================================================= */}

                <div className="
                    mb-5
                    grid
                    grid-cols-1
                    gap-5
                    xl:grid-cols-[minmax(0,1fr)_240px]
                ">


                    {/* ============================================= */}
                    {/* MEDICINES DISPENSED */}
                    {/* ============================================= */}

                    <div className="
                        min-w-0
                    ">

                        <MedicinesDispensed />

                    </div>


                    {/* ============================================= */}
                    {/* EMPLOYEE PURCHASE */}
                    {/* ============================================= */}

                    <DashboardCard
                        className="
                            flex
                            h-full
                            min-h-[202px]
                            flex-col
                            justify-between
                            p-4
                        "
                    >

                        <div>

                            <h2 className="
                                text-[17px]
                                font-semibold
                                text-[#4B2E2A]
                            ">
                                Employee Purchase
                            </h2>


                            <p className="
                                mt-4
                                text-[12px]
                                leading-5
                                text-[#5F4A42]
                            ">
                                Quickly add an employee
                                purchase.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleAddPurchase
                            }
                            className="
                                mt-4
                                flex
                                h-[50px]
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-[15px]
                                bg-[#8B533A]
                                px-3
                                text-[12px]
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#77432F]
                            "
                        >

                            <HiOutlinePlus
                                size={18}
                            />

                            Add Purchase

                        </button>

                    </DashboardCard>

                </div>


                {/* ================================================= */}
                {/* LOWER ROW */}
                {/* ================================================= */}

                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    xl:grid-cols-2
                ">


                    {/* ============================================= */}
                    {/* LEFT */}
                    {/* ============================================= */}

                    <div className="
                        min-w-0
                    ">

                        <AilmentsAddressed />

                    </div>


                    {/* ============================================= */}
                    {/* RIGHT */}
                    {/* ============================================= */}

                    <div className="
                        min-w-0
                        space-y-5
                    ">

                        <PatientsTended />

                        <Sales />

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
};


export default PharmacistDashboard;