import {
    finishJuniorDoctorConsultation,
    getJuniorDoctorAppointments,
} from "../api/juniorDoctorAppointmentApi";


export const fetchJuniorDoctorAppointments = async (
    period = "today"
) => {

    const response =
        await getJuniorDoctorAppointments(
            period
        );

    return response.data;
};

export const finishJuniorDoctorConsultationService =
    async (
        appointmentId
    ) => {

        const response =
            await finishJuniorDoctorConsultation(
                appointmentId
            );

        return response.data;

    };