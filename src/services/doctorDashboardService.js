import {
    getScheduleOverview,
    getTodaySchedule,
    getConsultationHistory,
    getAilments,
    getTherapies,
    getMedicines,
    getWellnessSummary,
    getBeautySummary,
} from "../api/doctorDashboardApi";

export const fetchDashboard = async (
    doctorId,
    period
) => {

    const [
        overview,
        schedule,
        consultation,
        ailments,
        therapies,
        medicines,
        wellness,
        beauty,
    ] = await Promise.all([

        getScheduleOverview(doctorId, period),

        getTodaySchedule(doctorId),

        getConsultationHistory(
            doctorId,
            period
        ),

        getAilments(
            doctorId,
            period
        ),

        getTherapies(
            doctorId,
            period
        ),

        getMedicines(
            doctorId,
            period
        ),
        getWellnessSummary(doctorId, period),
        getBeautySummary(doctorId, period),

    ]);

    return {

        overview: overview.data.data,

        schedule: schedule.data.data,

        consultation:
            consultation.data.data,

        ailments:
            ailments.data.data,

        therapies:
            therapies.data.data,

        medicines:
            medicines.data.data,
        wellness: wellness.data.data,
        beauty: beauty.data.data,

    };

};

export const fetchOverview = async (doctorId, period) => {
    const response = await getScheduleOverview(doctorId, period);
    return response.data.data;
};

export const fetchConsultation = async (doctorId, period) => {
    const response = await getConsultationHistory(doctorId, period);
    return response.data.data;
};

export const fetchAilments = async (doctorId, period) => {
    const response = await getAilments(doctorId, period);
    return response.data.data;
};

export const fetchTherapiesDashboard = async (doctorId, period) => {
    const response = await getTherapies(doctorId, period);
    return response.data.data;
};

export const fetchMedicines = async (doctorId, period) => {
    const response = await getMedicines(doctorId, period);
    return response.data.data;
};

export const fetchWellness = async (doctorId, period) => {
    const response = await getWellnessSummary(doctorId, period);
    return response.data.data;
};
export const fetchBeauty = async (doctorId, period) => {
    const response = await getBeautySummary(doctorId, period);
    return response.data.data;
};