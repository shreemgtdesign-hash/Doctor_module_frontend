import { getBeautySummaryList, getMedicinesPrescribedList, getWellnessSummaryList } from "../api/doctorAppointmentApi";
import {
    getScheduleOverview,
    getTodaySchedule,
    getConsultationHistory,
    getAilments,
    getAilmentsList,
    getTherapies,
    getMedicines,
    getWellnessSummary,
    getBeautySummary,
    getTherapyAppointments,
} from "../api/doctorDashboardApi";

export const fetchDashboard = async (
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

        getScheduleOverview(period),

        getTodaySchedule(period),

        getConsultationHistory(period),

        getAilments(period),

        getTherapies(period),

        getMedicines(period),

        getWellnessSummary(period),

        getBeautySummary(period),

    ]);

    return {

        overview:
            overview.data.data,

        schedule:
            schedule.data.data,

        consultation:
            consultation.data.data,

        ailments:
            ailments.data.data,

        therapies:
            therapies.data.data,

        medicines:
            medicines.data.data,

        wellness:
            wellness.data.data,

        beauty:
            beauty.data.data,

    };
};
export const fetchOverview = async (
    period
) => {

    const response =
        await getScheduleOverview(
            period
        );

    return response.data.data;
};

export const fetchConsultation = async (period) => {
    const response = await getConsultationHistory(period);
    return response.data.data;
};

export const fetchAilments = async (period) => {
    const response = await getAilments(period);
    return response.data.data;
};

export const fetchTherapiesDashboard = async (period) => {
    const response = await getTherapies(period);
    return response.data.data;
};

export const fetchMedicines = async (period) => {
    const response = await getMedicines(period);
    return response.data.data;
};

export const fetchWellness = async (period) => {
    const response = await getWellnessSummary(period);
    return response.data.data;
};
export const fetchBeauty = async (period) => {
    const response = await getBeautySummary(period);
    return response.data.data;
};
export const fetchTherapyAppointments = async () => {

    const response =
        await getTherapyAppointments();

    return response.data;

};

export const fetchAilmentsList = async (period) => {
  const response = await getAilmentsList(period);

  return response.data;
};

// ============================
// Medicines Prescribed List
// ============================

export const fetchMedicinesPrescribedList = async (
  period = "today"
) => {
  const response =
    await getMedicinesPrescribedList(period);

  return response.data;
};

// ============================
// Wellness Summary List
// ============================

export const fetchWellnessSummaryList = async (
  period = "today"
) => {

  const response =
    await getWellnessSummaryList(
      period
    );

  return response.data;
};


// ============================
// Beauty Summary List
// ============================

export const fetchBeautySummaryList = async (
  period = "today"
) => {

  const response =
    await getBeautySummaryList(
      period
    );

  return response.data;
};