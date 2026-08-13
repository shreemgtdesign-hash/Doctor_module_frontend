import { createSlice } from "@reduxjs/toolkit";
import { getDashboard, loadAilmentsList, loadAilments, loadConsultation, loadConsultationHistoryList, loadMedicines, loadMedicinesPrescribedList, loadOverview, loadTherapiesDashboard, loadBeauty, loadWellness, loadTherapyAppointments } from "./dashboardThunk";


const initialState = {

    loading: false,

    overview: {},

    schedule: {},

    consultation: {},

    ailments: [],
    ailmentsHistory: [],

    // Dashboard therapy card
    therapies: {},

    // Therapy prescribed table
    therapyAppointments: [],

    therapyAppointmentsCount: 0,

    therapyAppointmentsLoading: false,

    therapyAppointmentsError: null,

    medicines: {},

    wellness: {},

    beauty: {},

    consultationHistoryList: [],

    medicinesPrescribedList: [],

    error: null,
};

const dashboardSlice = createSlice({

    name: "dashboard",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(getDashboard.pending, (state) => {

                state.loading = true;

            })
            .addCase(
                loadConsultationHistoryList.fulfilled,
                (state, action) => {
                    state.consultationHistoryList =
                        action.payload.history || [];
                }
            )

            .addCase(
                loadMedicinesPrescribedList.fulfilled,
                (state, action) => {
                    state.medicinesPrescribedList =
                        action.payload.prescribed_medicines || [];
                }
            )

            .addCase(getDashboard.fulfilled, (state, action) => {
                console.log(action.payload);

                state.loading = false;

                state.overview = action.payload.overview;
                state.schedule = action.payload.schedule;
                state.consultation = action.payload.consultation;
                state.ailments = action.payload.ailments;
                state.therapies = action.payload.therapies;
                state.medicines = action.payload.medicines;
                state.wellness = action.payload.wellness;
                state.beauty = action.payload.beauty;
            })

            .addCase(loadOverview.fulfilled, (state, action) => {
                state.overview = action.payload;
            })

            .addCase(loadConsultation.fulfilled, (state, action) => {
                state.consultation = action.payload;
            })

            .addCase(loadMedicines.fulfilled, (state, action) => {
                state.medicines = action.payload;
            })

            .addCase(loadTherapiesDashboard.fulfilled, (state, action) => {
                state.therapies = action.payload;
            })

            .addCase(loadAilments.fulfilled, (state, action) => {
                state.ailments = action.payload;
            })

            .addCase(loadWellness.fulfilled, (state, action) => {
                state.wellness = action.payload;
            })

            .addCase(loadBeauty.fulfilled, (state, action) => {
                state.beauty = action.payload;
            })
            .addCase(getDashboard.rejected, (state) => {

                state.loading = false;

            })

            .addCase(
                loadTherapyAppointments.pending,
                (state) => {

                    state.therapyAppointmentsLoading = true;

                    state.therapyAppointmentsError = null;

                    // Clear old data while loading
                    state.therapyAppointments = [];

                    state.therapyAppointmentsCount = 0;
                }
            )

            .addCase(
                loadTherapyAppointments.fulfilled,
                (state, action) => {

                    state.therapyAppointmentsLoading = false;

                    state.therapyAppointments =
                        action.payload?.data || [];

                    state.therapyAppointmentsCount =
                        action.payload?.count || 0;
                }
            )

            .addCase(
                loadTherapyAppointments.rejected,
                (state, action) => {

                    state.therapyAppointmentsLoading = false;

                    state.therapyAppointments = [];

                    state.therapyAppointmentsCount = 0;

                    state.therapyAppointmentsError =
                        action.payload ||
                        "Failed to load therapy appointments";
                }
            )
            .addCase(
                loadAilmentsList.fulfilled,
                (state, action) => {
                    state.ailmentsHistory =
                        action.payload?.ailments_history || [];
                }
            )




    },

});

export default dashboardSlice.reducer;