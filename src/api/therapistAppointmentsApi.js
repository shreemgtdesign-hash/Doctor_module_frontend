import api from "./axios";

export const getTherapistAppointments = () => {
    return api.get("/therapist/appointments");
};

export const completeTherapistAppointments = (
    bookingIds,
    notes,
    
) =>
    api.put(
        "/therapist/appointments/notes",
        {
            booking_ids: bookingIds,
            notes,
           
        }
    );

    export const updateTherapistAppointmentStatus = (
    bookingIds,
    status
) =>
    api.post(
        "/therapist/appointments/status",
        {
            booking_ids: bookingIds,
            status,
        }
    );