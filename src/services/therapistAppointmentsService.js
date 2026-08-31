import {
    completeTherapistAppointments,
    getTherapistAppointments,
} from "../api/therapistAppointmentsApi";

export const fetchTherapistAppointments = async () => {

    const response =
        await getTherapistAppointments();

    return {
        count: response.data.count,
        data: response.data.data,
    };
};

export const markTherapistAppointmentsComplete =
    async ({
        bookingIds,
        notes,
        status = "completed",
    }) => {

        const response =
            await completeTherapistAppointments(
                bookingIds,
                notes,
                status
            );

        return response.data;
    };