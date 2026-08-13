import api from "./axios";

export const getTherapistAppointments = () => {
    return api.get("/therapist/appointments");
};