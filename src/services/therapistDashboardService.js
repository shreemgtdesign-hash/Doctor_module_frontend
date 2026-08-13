import {
    getTherapiesPerformed,
    getTherapistAilments,
    getTherapistPatients,
    getTherapistSales,
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

export const fetchTherapiesPerformedDashboard =
    async () => {

        const response =
            await getTherapiesPerformed();

        return response.data.data;
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


export const fetchTherapistSalesDashboard =
    async () => {

        const response =
            await getTherapistSales();

        return response.data.data;
    };