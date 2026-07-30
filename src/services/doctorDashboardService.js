import {
    getScheduleOverview,
    getTodaySchedule,
    getConsultationHistory,
    getAilments,
    getTherapies,
    getMedicines,
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

    };

};