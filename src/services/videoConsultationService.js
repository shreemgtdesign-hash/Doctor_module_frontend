// Change this import path to your existing Axios instance.
import api from "../api/axios";

export const fetchAppointmentVideoToken = async (appointmentId) => {
  if (!appointmentId) {
    throw new Error("Appointment ID is required");
  }

  const response = await api.get(
    `/agora/consultations/${encodeURIComponent(appointmentId)}/token`
  );

  if (!response.data?.success || !response.data?.data?.token) {
    throw new Error(
      response.data?.message || "Unable to get Agora token"
    );
  }

  return response.data.data;
};


export const initiateVideoCall = async (appointmentNo) => {
  const response = await api.post("/agora/call/initiate", {
    appointment_no: appointmentNo,
  });

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Failed to initiate video call"
    );
  }

  return response.data.data;
};