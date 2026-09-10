import {
    getTherapiesPerformed,
    getTherapistAilments,
    getTherapistPatients,
    getTherapistScheduleOverview,
} from "../api/therapistDashboardApi";


// ==========================================
// FULL DASHBOARD
// ==========================================

export const fetchTherapistDashboard = async () => {

    const [
        therapies,
        ailments,
        patients,
    ] = await Promise.all([

        getTherapiesPerformed(),

        getTherapistAilments(),

        getTherapistPatients(),

    ]);

    return {

        therapies:
            therapies.data.data,

        ailments:
            ailments.data.data,

        patients:
            patients.data.data,

    };

};


// ==========================================
// THERAPIES PERFORMED
// ==========================================

export const fetchTherapiesPerformedDashboard =
    async (
        period = "week"
    ) => {

        const response =
            await getTherapiesPerformed(
                period
            );

        console.log(
            "THERAPIES PERFORMED API:",
            response.data
        );

        return (
            response.data?.data || {
                total: 0,
                growth_percentage: "0%",
                comparison_label: "",
                breakdown: {},
                categories: [],
            }
        );

    };


// ==========================================
// AILMENTS
// ==========================================

export const fetchTherapistAilmentsDashboard =
    async (
        period = "week"
    ) => {

        const response =
            await getTherapistAilments(
                period
            );

        return (
            response.data?.data || []
        );

    };


// ==========================================
// PATIENTS
// ==========================================

export const fetchTherapistPatientsDashboard =
    async () => {

        const response =
            await getTherapistPatients();

        return (
            response.data?.data || {}
        );

    };


// ==========================================
// SCHEDULE OVERVIEW
// ==========================================

export const fetchTherapistScheduleOverview =
    async (
        period = "today"
    ) => {

        const response =
            await getTherapistScheduleOverview(
                period
            );

        console.log(
            "THERAPIST SCHEDULE OVERVIEW:",
            response.data
        );


        const data =
            response.data?.data || {};


        return {

            period:
                response.data?.period ||
                period,

            total_patients:
                data?.total_patients ?? 0,

            men:
                data?.men ?? 0,

            women:
                data?.women ?? 0,

            children:
                data?.children ?? 0,

        };

    };