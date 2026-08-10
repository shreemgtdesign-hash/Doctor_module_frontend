import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    loadPharmacistPatients,
    loadPrescriptionItems,
} from "../../../redux/pharmacist/pharmacistThunk";

import {
    setSelectedPharmacistPatient,
} from "../../../redux/pharmacist/pharmacistSlice";

import PharmacistPatientList
    from "./components/PharmacistPatientList";

import PharmacistPatientHeader
    from "./components/PharmacistPatientHeader";

import PrescriptionTable
    from "./components/PrescriptionTable";

import DashboardLayout
    from "../../../components/Layout/DashboardLayout";


const PharmacistAppointments = () => {

    const dispatch = useDispatch();

    const {
        patients,
        selectedPatient,
        prescription,
        prescriptionLoading,
    } = useSelector(
        (state) => state.pharmacist
    );


    // ==========================================
    // Load Patients
    // ==========================================

    useEffect(() => {

        dispatch(
            loadPharmacistPatients()
        );

    }, [dispatch]);


    // ==========================================
    // Load Prescription
    // Whenever selected patient changes
    // ==========================================

    useEffect(() => {

        if (!selectedPatient?.consultation_id) {
            return;
        }

        dispatch(
            loadPrescriptionItems(
                selectedPatient.consultation_id
            )
        );

    }, [
        dispatch,
        selectedPatient?.consultation_id,
    ]);


    // ==========================================
    // Select Patient
    // ==========================================

    const handleSelectPatient = (patient) => {

        dispatch(
            setSelectedPharmacistPatient(
                patient
            )
        );

    };


    return (

        <DashboardLayout role="pharmacist">

            <div className="flex m-5 h-[calc(100vh-138px)] gap-5">


                {/* ===================================== */}
                {/* LEFT - PATIENT LIST */}
                {/* ===================================== */}

                <div className="w-[300px] shrink-0">

                    <PharmacistPatientList
                        patients={patients}
                        selectedPatient={selectedPatient}
                        onSelectPatient={
                            handleSelectPatient
                        }
                    />

                </div>


                {/* ===================================== */}
                {/* RIGHT - PRESCRIPTION */}
                {/* ===================================== */}

                <div className="min-w-0 flex-1">


                    {!selectedPatient ? (

                        /* ================================= */
                        /* No Patient Selected */
                        /* ================================= */

                        <div
                            className="
                                flex
                                h-full
                                items-center
                                justify-center
                                rounded-[30px]
                                border
                                border-[#EFE4DC]
                                bg-white
                            "
                        >

                            <p className="text-[16px] text-[#8B7A70]">
                                Select a patient to view prescription
                            </p>

                        </div>

                    ) : (

                        /* ================================= */
                        /* Selected Patient */
                        /* ================================= */

                        <div
                            className="
                                h-full
                                overflow-y-auto
                                rounded-[30px]
                                border
                                border-[#EFE4DC]
                                bg-white
                                p-6
                            "
                        >

                            {/* Patient Header */}

                            <PharmacistPatientHeader
                                patient={selectedPatient}
                            />


                            {/* Prescription */}

                            <PrescriptionTable
                                patient={selectedPatient}
                                items={
                                    prescription?.items || []
                                }
                                loading={
                                    prescriptionLoading
                                }
                            />

                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>

    );
};


export default PharmacistAppointments;