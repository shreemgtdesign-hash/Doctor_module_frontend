import api from "./axios";

// ======================================================
// SCHEDULE OVERVIEW
// ======================================================

export const getJuniorDoctorScheduleOverview = (period = "today") => {
    return api.get(
        "/junior-doctor/dashboard/schedule-overview",
        {
            params: {
                period,
            },
        }
    );
};


// ======================================================
// CONSULTATIONS HISTORY
// ======================================================

export const getJuniorDoctorConsultationsHistory = (
    period = "today"
) => {
    return api.get(
        "/junior-doctor/dashboard/consultations-history",
        {
            params: {
                period,
            },
        }
    );
};


// ======================================================
// WELLNESS SUMMARY
// ======================================================

export const getJuniorDoctorWellnessSummary = (
    period = "week"
) => {
    return api.get(
        "/junior-doctor/dashboard/wellness-summary",
        {
            params: {
                period,
            },
        }
    );
};


// ======================================================
// BEAUTY SUMMARY
// ======================================================

export const getJuniorDoctorBeautySummary = (
    period = "today"
) => {
    return api.get(
        "/junior-doctor/dashboard/beauty-summary",
        {
            params: {
                period,
            },
        }
    );
};


// ======================================================
// AILMENTS ADDRESSED
// ======================================================

export const getJuniorDoctorAilmentsAddressed = (
    period = "today"
) => {
    return api.get(
        "/junior-doctor/dashboard/ailments-addressed",
        {
            params: {
                period,
            },
        }
    );
};