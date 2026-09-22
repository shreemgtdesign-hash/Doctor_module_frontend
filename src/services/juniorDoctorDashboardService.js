import {
    getJuniorDoctorScheduleOverview,
    getJuniorDoctorConsultationsHistory,
    getJuniorDoctorWellnessSummary,
    getJuniorDoctorBeautySummary,
    getJuniorDoctorAilmentsAddressed,
} from "../api/juniorDoctorDashboardApi";


// ======================================================
// SCHEDULE OVERVIEW
// ======================================================

export const fetchJuniorDoctorScheduleOverview =
    async (period = "today") => {

        const response =
            await getJuniorDoctorScheduleOverview(
                period
            );

        return response.data;
    };


// ======================================================
// CONSULTATIONS HISTORY
// ======================================================

export const fetchJuniorDoctorConsultationsHistory =
    async (period = "today") => {

        const response =
            await getJuniorDoctorConsultationsHistory(
                period
            );

        return response.data;
    };


// ======================================================
// WELLNESS
// ======================================================

export const fetchJuniorDoctorWellnessSummary =
    async (period = "week") => {

        const response =
            await getJuniorDoctorWellnessSummary(
                period
            );

        return response.data;
    };


// ======================================================
// BEAUTY
// ======================================================

export const fetchJuniorDoctorBeautySummary =
    async (period = "today") => {

        const response =
            await getJuniorDoctorBeautySummary(
                period
            );

        return response.data;
    };


// ======================================================
// AILMENTS
// ======================================================

export const fetchJuniorDoctorAilmentsAddressed =
    async (period = "today") => {

        const response =
            await getJuniorDoctorAilmentsAddressed(
                period
            );

        return response.data;
    };