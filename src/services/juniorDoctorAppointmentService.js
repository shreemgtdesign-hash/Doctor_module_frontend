import {
    finishJuniorDoctorConsultation,
    getJuniorDoctorAppointments,
} from "../api/juniorDoctorAppointmentApi";


export const fetchJuniorDoctorAppointments = async (
    period = "today",
    status = ""
) => {

    const response =
        await getJuniorDoctorAppointments(
            period,
            status
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