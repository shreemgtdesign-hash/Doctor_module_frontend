import api from "./axios";

export const getTherapistAppointments = () => {
    return api.get("/therapist/appointments");
};

export const completeTherapistAppointments = (bookingIds) =>
    api.put(
        "/therapist/appointments/complete",
        {
            booking_ids: bookingIds,
        }
    );