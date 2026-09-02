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
        sales,
    ] = await Promise.all([

        getTherapiesPerformed(),

        getTherapistAilments(),

        getTherapistPatients(),

        getTherapistSales(),

    ]);

    return {

        therapies:
            therapies.data.data,

        ailments:
            ailments.data.data,

        patients:
            patients.data.data,

        sales:
            sales.data.data,

    };
};


// ==========================================
// INDIVIDUAL APIs
// ==========================================

export const fetchTherapiesPerformedDashboard = async (
    period = "week"
) => {

    const response = await api.get(
        `/therapist/dashboard/therapies-performed?period=${period}`
    );

    console.log(
        "THERAPIES PERFORMED API:",
        response.data
    );

    // Return only the actual dashboard data
    return response.data?.data || {
        total: 0,
        growth_percentage: "0%",
        comparison_label: "",
        breakdown: {},
        categories: [],
    };
};


export const fetchTherapistAilmentsDashboard =
    async () => {

        const response =
            await getTherapistAilments();

        return response.data.data;
    };


export const fetchTherapistPatientsDashboard =
    async () => {

        const response =
            await getTherapistPatients();

        return response.data.data;
    };

export const fetchTherapistScheduleOverview = async (
    period = "today"
) => {

    const response =
        await getTherapistScheduleOverview(period);

    return {
        period: response.data.period,

        data: {
            total_patients:
                response.data.data?.total_patients ?? 0,

            men:
                response.data.data?.men ?? 0,

            women:
                response.data.data?.women ?? 0,

            children:
                response.data.data?.children ?? 0,
        },
    };
};
