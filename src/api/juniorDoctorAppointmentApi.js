import api from "./axios";


export const getJuniorDoctorAppointments = async (
    period = "today",
    status = ""
) => {
    const params = {
        period,
    };

    if (status && status !== "all") {
        params.status = status;
    }

    // For IPD patients, directly query /appointments as specified
    if (status === "ipd") {
        try {
            const res = await api.get("/appointments", { params });
            if (res?.data) {
                return res;
            }
        } catch {
            // fallback to /junior-doctor/appointments
        }
    }

    try {
        return await api.get(
            "/junior-doctor/appointments",
            {
                params,
            }
        );
    } catch (err) {
        if (status === "ipd" || status) {
            try {
                return await api.get("/appointments", { params });
            } catch {
                // throw original error
            }
        }
        throw err;
    }
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