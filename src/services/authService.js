import api from "../api/axios";

export const unifiedLogin = async (credentials) => {
    const response = await api.post(
        "/auth/login",
        credentials
    );

    return {
        token: response.data.token,
        role: response.data.role,
        user:
            response.data.user ||
            response.data.patient,
    };
};