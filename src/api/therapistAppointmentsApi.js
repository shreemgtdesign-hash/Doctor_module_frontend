import api from "./axios";

export const getTherapistAppointments = () => {
    return api.get("/therapist/appointments");
};

export const completeTherapistAppointments = (
    bookingIds,
    notes,
    status = "completed"
) =>
    api.put(
        "/therapist/appointments/complete",
        {
            booking_ids: bookingIds,
            notes,
            status,
        }
    );