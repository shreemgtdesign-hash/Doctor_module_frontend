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
import WalkInMedicinePurchase from "./components/WalkInMedicinePurchase";


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
    const isWalkInPatient =
        selectedPatient &&
        !selectedPatient.consultation_id;


    // ==========================================
    // LOAD PATIENTS
    // ==========================================

    useEffect(() => {

        dispatch(
            loadPharmacistPatients()
        );

    }, [dispatch]);


    // ==========================================
    // LOAD PRESCRIPTION
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
    // SELECT PATIENT
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

            {/* ==========================================
                MAIN CONTENT
            ========================================== */}

            <div
                className="
                    w-full
                    px-5
                    py-5
                    md:px-6
                    md:py-6
                "
            >

                <div
                    className="
                        flex
                        h-[calc(100vh-138px)]
                        min-h-[600px]
                        w-full
                        gap-5
                    "
                >

                    {/* =====================================
                        LEFT - PATIENTS
                    ===================================== */}

                    <div
                        className="
                            w-[390px]
                            shrink-0
                            overflow-hidden
                            rounded-[30px]
                            border
                            border-[#EFE4DC]
                            bg-white
                            shadow-[0_2px_8px_rgba(89,53,44,0.04)]
                        "
                    >

                        <div
                            className="
                                h-full
                                overflow-y-auto
                                scrollbar-thin
                                scrollbar-thumb-[#E7D8CE]
                                scrollbar-track-transparent
                            "
                        >

                            <PharmacistPatientList
                                patients={patients}
                                selectedPatient={
                                    selectedPatient
                                }
                                onSelectPatient={
                                    handleSelectPatient
                                }
                            />

                        </div>

                    </div>


                    {/* =====================================
                        RIGHT - PRESCRIPTION
                    ===================================== */}

                    <div
                        className="
                            min-w-0
                            flex-1
                            overflow-hidden
                            rounded-[30px]
                            border
                            border-[#EFE4DC]
                            bg-white
                            shadow-[0_2px_8px_rgba(89,53,44,0.04)]
                        "
                    >

                        {!selectedPatient ? (

                            /* =================================
                               EMPTY STATE
                            ================================= */

                            <div
                                className="
                                    flex
                                    h-full
                                    flex-col
                                    items-center
                                    justify-center
                                    px-6
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        mb-5
                                        flex
                                        h-16
                                        w-16
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#FFF1E4]
                                        text-[#59352C]
                                    "
                                >
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        <path
                                            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        />
                                    </svg>
                                </div>


                                <h2
                                    className="
                                        text-[20px]
                                        font-semibold
                                        text-[#59352C]
                                    "
                                >
                                    Select a patient
                                </h2>


                                <p
                                    className="
                                        mt-2
                                        max-w-[320px]
                                        text-[14px]
                                        leading-6
                                        text-[#8B7A70]
                                    "
                                >
                                    Select a patient from the list
                                    to view their prescription
                                    details.
                                </p>

                            </div>

                        ) : (

                            /* =================================
                               SELECTED PATIENT
                            ================================= */

                            <div
                                className="
                                    flex
                                    h-full
                                    min-h-0
                                    flex-col
                                "
                            >

                                {/* =================================
                                    PATIENT HEADER
                                ================================= */}

                                <div
                                    className="
                                        shrink-0
                                        px-7
                                        pt-7
                                    "
                                >

                                    <PharmacistPatientHeader
                                        patient={
                                            selectedPatient
                                        }
                                    />

                                </div>


                                {/* =================================
                                    PRESCRIPTION CONTENT
                                ================================= */}

                                <div
                                    className="
                                        min-h-0
                                        flex-1
                                        overflow-y-auto
                                        px-7
                                        pb-7
                                        scrollbar-thin
                                        scrollbar-thumb-[#E7D8CE]
                                        scrollbar-track-transparent
                                    "
                                >
                                    {isWalkInPatient ? (

                                        <WalkInMedicinePurchase
                                            patient={selectedPatient}
                                        />

                                    ) : (

                                        <PrescriptionTable
                                            patient={selectedPatient}
                                            items={prescription?.items || []}
                                            loading={prescriptionLoading}
                                        />

                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};


export default PharmacistAppointments;