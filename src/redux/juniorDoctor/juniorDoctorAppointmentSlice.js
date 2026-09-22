import { createSlice } from "@reduxjs/toolkit";
import { finishJuniorDoctorConsultation, loadJuniorDoctorAppointments } from "./JuniorDoctorAppointmentThunk";



const initialState = {
    finishConsultationLoading: false,

    finishConsultationError: null,

    finishConsultationSuccess: false,

    finishConsultationMessage: "",

    finishConsultationData: null,

    appointments: {
        today: null,
        week: null,
        month: null,
    },

    appointmentsLoading: false,

    appointmentsError: null,
};


const juniorDoctorAppointmentSlice =
    createSlice({

        name: "juniorDoctorAppointment",

        initialState,

        reducers: {

            clearJuniorDoctorAppointments: (
                state
            ) => {

                state.appointments = {
                    today: null,
                    week: null,
                    month: null,
                };

                state.appointmentsError =
                    null;
            },

        },


        extraReducers: (builder) => {

            builder

                // =========================================
                // PENDING
                // =========================================

                .addCase(
                    loadJuniorDoctorAppointments.pending,
                    (state) => {

                        state.appointmentsLoading =
                            true;

                        state.appointmentsError =
                            null;
                    }
                )


                // =========================================
                // SUCCESS
                // =========================================

                .addCase(
                    loadJuniorDoctorAppointments.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.appointmentsLoading =
                            false;

                        const period =
                            action.meta.arg ||
                            "today";

                        state.appointments[
                            period
                        ] =
                            action.payload || null;
                    }
                )


                // =========================================
                // ERROR
                // =========================================

                .addCase(
                    loadJuniorDoctorAppointments.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.appointmentsLoading =
                            false;

                        state.appointmentsError =
                            action.payload ||
                            action.error?.message ||
                            "Failed to load appointments.";
                    }
                )
                // =========================================
                // FINISH CONSULTATION
                // =========================================

                .addCase(
                    finishJuniorDoctorConsultation.pending,
                    (state) => {

                        state.finishConsultationLoading =
                            true;

                        state.finishConsultationError =
                            null;

                        state.finishConsultationSuccess =
                            false;

                        state.finishConsultationMessage =
                            "";

                        state.finishConsultationData =
                            null;

                    }
                )


                .addCase(
                    finishJuniorDoctorConsultation.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        state.finishConsultationLoading =
                            false;

                        state.finishConsultationSuccess =
                            true;

                        state.finishConsultationMessage =
                            action.payload?.message ||
                            "Consultation completed successfully.";

                        state.finishConsultationData =
                            action.payload?.data ||
                            null;

                    }
                )


                .addCase(
                    finishJuniorDoctorConsultation.rejected,
                    (
                        state,
                        action
                    ) => {

                        state.finishConsultationLoading =
                            false;

                        state.finishConsultationSuccess =
                            false;

                        state.finishConsultationError =
                            action.payload ||
                            action.error?.message ||
                            "Failed to finish consultation.";

                    }
                )

        },

    });


export const {
    clearJuniorDoctorAppointments,
} =
    juniorDoctorAppointmentSlice.actions;


export default juniorDoctorAppointmentSlice.reducer;