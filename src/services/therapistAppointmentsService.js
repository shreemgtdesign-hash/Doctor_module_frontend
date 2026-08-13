import {
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