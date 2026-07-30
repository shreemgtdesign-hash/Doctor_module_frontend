import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";

import { setSelectedPatient } from "../../../redux/consultation/consultationSlice";
import { loadPatientDetails } from "../../../redux/consultation/consultationThunk";
import AppointmentCard from "./AppointmentCard";

const AppointmentList = ({height}) => {
  const dispatch = useDispatch();

  const {
    appointments,
    loading,
    selectedPatient,
  } = useSelector((state) => state.consultation);

  const totalPatients = appointments.length;
   
  const handleSelectPatient = (patient) => {
    console.log(patient,"patient");
  if (selectedPatient?.id === patient.id) return;

  dispatch(setSelectedPatient(patient));
  dispatch(loadPatientDetails(patient.patient_id));
};

useEffect(() => {
  if (
    appointments.length > 0 &&
    !selectedPatient
  ) {
    handleSelectPatient(appointments[0]);
  }
}, [appointments, selectedPatient]);
  

  return (
   <div
  style={{height}}
  className="bg-white rounded-[30px] border border-[#E7DBD3] p-6 flex flex-col">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-bold text-[#4D2E23]">
            Today's Appointments
          </h2>

          <p className="text-[#8A756B] mt-1">
            {totalPatients} Patient{totalPatients !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <SearchBar />

      <FilterTabs />

      <div className="mt-5 flex-1 overflow-y-auto hide-scrollbar pr-2">
        {appointments.length > 0 ? (
          appointments.map((patient) => (
            <AppointmentCard
              key={patient.id}
              patient={patient}
              selected={selectedPatient?.id === patient.id}
              onClick={() => handleSelectPatient(patient)}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No appointments found
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;