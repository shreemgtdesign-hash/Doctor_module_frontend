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
    async (bookingIds) => {

        const response =
            await completeTherapistAppointments(
                bookingIds
            );

        return response.data;
    };