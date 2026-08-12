import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";

import {
    setSelectedPatient,
} from "../../../redux/consultation/consultationSlice";

import {
    loadPatientDetails,
    loadAppointments,
} from "../../../redux/consultation/consultationThunk";

import AppointmentCard from "./AppointmentCard";

const AppointmentList = ({
    height,
    period,
}) => {

    const dispatch = useDispatch();

    const {
        appointments,
        loading,
        selectedPatient,
    } = useSelector(
        (state) => state.consultation
    );

    const doctor = useSelector(
        (state) => state.auth.user
    );

    const totalPatients =
        appointments.length;


    // ==========================================
    // PERIOD LABEL
    // ==========================================

    const getPeriodLabel = () => {

        switch (period) {

            case "week":
                return "Weekly Appointments";

            case "month":
                return "Monthly Appointments";

            case "today":
            default:
                return "Today's Appointments";

        }

    };


    // ==========================================
    // SELECT PATIENT
    // ==========================================

    const handleSelectPatient = (patient) => {

        console.log(
            "Selected patient:",
            patient
        );

        if (
            selectedPatient?.id === patient.id
        ) {
            return;
        }

        dispatch(
            setSelectedPatient(patient)
        );

        dispatch(
            loadPatientDetails(
                patient.patient_id
            )
        );

    };


    // ==========================================
    // LOAD APPOINTMENTS WHEN PERIOD CHANGES
    // ==========================================

    useEffect(() => {

        if (!doctor?.id) {
            return;
        }

        dispatch(
            loadAppointments({
                doctorId:
                    doctor.doctor_id ||
                    doctor.id,

                period,

                status: "",
            })
        );

    }, [
        dispatch,
        doctor?.doctor_id,
        doctor?.id,
        period,
    ]);


    // ==========================================
    // AUTO SELECT FIRST PATIENT
    // ==========================================

    useEffect(() => {

        if (
            appointments.length > 0
        ) {

            // If selected patient doesn't
            // exist in the new period,
            // select the first patient.

            const selectedStillExists =
                appointments.some(
                    (patient) =>
                        patient.id ===
                        selectedPatient?.id
                );

            if (
                !selectedStillExists
            ) {

                handleSelectPatient(
                    appointments[0]
                );

            }

        }

    }, [
        appointments,
    ]);


    return (

        <div
            style={{ height }}
            className="
                flex
                flex-col
                rounded-[30px]
                border
                border-[#E7DBD3]
                bg-white
                p-6
            "
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="
                        text-[24px]
                        font-bold
                        text-[#4D2E23]
                    ">
                        {getPeriodLabel()}
                    </h2>

                    <p className="
                        mt-1
                        text-[#8A756B]
                    ">
                        {totalPatients}{" "}
                        Patient
                        {totalPatients !== 1
                            ? "s"
                            : ""}
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* SEARCH */}
            {/* ================================= */}

            <SearchBar />


            {/* ================================= */}
            {/* FILTER */}
            {/* ================================= */}

            <FilterTabs />


            {/* ================================= */}
            {/* APPOINTMENT LIST */}
            {/* ================================= */}

            <div className="
                mt-5
                flex-1
                overflow-y-auto
                pr-2
                hide-scrollbar
            ">

                {loading ? (

                    <div className="
                        flex
                        h-full
                        items-center
                        justify-center
                        text-[#8B7A70]
                    ">
                        Loading appointments...
                    </div>

                ) : appointments.length > 0 ? (

                    appointments.map(
                        (patient) => (

                            <AppointmentCard
                                key={patient.id}
                                patient={patient}
                                selected={
                                    selectedPatient?.id ===
                                    patient.id
                                }
                                onClick={() =>
                                    handleSelectPatient(
                                        patient
                                    )
                                }
                            />

                        )
                    )

                ) : (

                    <div className="
                        flex
                        h-full
                        items-center
                        justify-center
                        text-gray-500
                    ">
                        No appointments found
                    </div>

                )}

            </div>

        </div>

    );
};

export default AppointmentList;