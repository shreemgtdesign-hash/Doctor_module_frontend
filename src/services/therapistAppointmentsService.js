import { getAppointmentConfirmationList } from "../api/frontOfficeAppoinntmentApi";
import {
    completeTherapistAppointments,
    getTherapistAppointments,
    updateTherapistAppointmentStatus,
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
        
    }) => {

        const response =
            await completeTherapistAppointments(
                bookingIds,
                notes,
                
            );

        return response.data;
    };

    export const updateTherapistAppointmentsStatus =
    async ({
        bookingIds,
        status,
    }) => {

        const response =
            await updateTherapistAppointmentStatus(
                bookingIds,
                status
            );

        return response.data;
    };

    // ==========================================
// APPOINTMENT CONFIRMATION LIST
// ==========================================

export const fetchAppointmentConfirmationList = async () => {

    const response =
        await getAppointmentConfirmationList();

    return response.data;
};