import api from "./axios";


export const getJuniorDoctorAppointments = (
    period = "today"
) => {
    return api.get(
        "/junior-doctor/appointments",
        {
            params: {
                period,
            },
        }
    );
};

export const finishJuniorDoctorConsultation = (
    appointmentId
) => {

    return api.put(
        `/junior-doctor/appointments/${appointmentId}/status`,
        {
            status: "basic_diagous_complete",
        }
    );

};