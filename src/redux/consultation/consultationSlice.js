import { createSlice } from "@reduxjs/toolkit";
import {
    loadAppointments,
    loadChiefComplaints,
    loadPatientDetails,
    saveChiefComplaintsThunk,
    loadDiagnosis,
    saveDiagnosisThunk,
    loadAssociateDoctors,
    addAssociateDoctorThunk,
    searchPrescriptionProductsThunk,
    loadPrescription,
    savePrescriptionThunk,
    savePrescriptionNotesThunk,
    savePatientAllergiesThunk,
    searchTherapiesThunk,
    loadTherapies,
    saveTherapyThunk,
    updateTherapyThunk,
    updatePrescriptionThunk,
    updatePrescriptionItemThunk,
} from "./consultationThunk";
import { searchDiagnosisCategoriesThunk } from "../appointment/appointmentThunk";

const initialState = {
    loading: false,

    chiefComplaints: {
        tags: [],
        notes: "",
    },
    diagnosis: {
        diagnosis: "",
        category: "",
    },
    associateDoctors: [],
    appointments: [],

    selectedPatient: null,
    activeFilter: "",


    patientProfile: null,
    patientLoading: false,
    patientWellness: null,

    error: null,
    prescriptionSearch: [],

    prescription: {
        items: [],
        total: 0,
        specialInstructions: "",
        reviewDate: "",
    },

    allergies: [],

    therapySearch: [],

    therapy: {
        items: [],
        total: 0,
    },
    diagnosisCategories: [],
};

const consultationSlice = createSlice({
    name: "consultation",

    initialState,

    reducers: {
        setSelectedPatient: (state, action) => {
            state.selectedPatient = action.payload;
        },
        setActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
        },

        clearSelectedPatient: (state) => {
            state.selectedPatient = null;
            state.patientProfile = null;
            state.patientWellness = null;
            state.activeFilter = "";
            state.chiefComplaints = {
                tags: [],
                notes: "",
            };
            state.diagnosis = "";

            state.associateDoctors = [];
            state.prescriptionSearch = [];

            state.prescription = {
                items: [],
                total: 0,
                specialInstructions: "",
                reviewDate: "",
            };

            state.allergies = [];


        },
    },

    extraReducers: (builder) => {
        builder

            // Appointments

            .addCase(loadAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loadAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })

            .addCase(loadAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Patient Details

            .addCase(loadPatientDetails.pending, (state) => {
                state.loading = true;
            })

            .addCase(loadPatientDetails.fulfilled, (state, action) => {
                state.loading = false;

                state.patientProfile = action.payload.profile;
                state.patientWellness = action.payload.wellness;
            })

            .addCase(loadPatientDetails.rejected, (state) => {
                state.loading = false;
            })
            .addCase(loadChiefComplaints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loadChiefComplaints.fulfilled, (state, action) => {
                state.loading = false;
                state.chiefComplaints = action.payload;
            })

            .addCase(loadChiefComplaints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(saveChiefComplaintsThunk.fulfilled, (state, action) => {
                state.chiefComplaints = action.meta.arg.payload;
            })
            .addCase(loadDiagnosis.fulfilled, (state, action) => {
                state.diagnosis = {
                    diagnosis: action.payload?.diagnosis || "",
                    category: action.payload?.category || "",
                };
            })

            .addCase(saveDiagnosisThunk.fulfilled, (state, action) => {
                state.diagnosis = {
                    diagnosis: action.meta.arg.payload.diagnosis,
                    category: action.meta.arg.payload.category,
                };
            })
            .addCase(loadAssociateDoctors.fulfilled, (state, action) => {
                state.associateDoctors = action.payload || [];
            })

            .addCase(addAssociateDoctorThunk.fulfilled, (state, action) => {
                state.associateDoctors = action.payload || [];
            })
            .addCase(
                searchPrescriptionProductsThunk.fulfilled,
                (state, action) => {
                    state.prescriptionSearch =
                        action.payload || [];
                }
            )
            .addCase(loadPrescription.pending, (state) => {
                state.loading = true;

                state.prescription = {
                    items: [],
                    total: 0,
                    specialInstructions: "",
                    reviewDate: "",
                };
            })

            .addCase(loadPrescription.fulfilled, (state, action) => {
                state.loading = false;

                const data = action.payload;

                state.prescription = {
                    items: data.items || [],
                    total: data.total || 0,
                    specialInstructions: data.special_instructions || "",
                    reviewDate: data.review_date || "",
                };

                state.allergies =
                    data.items?.[0]?.patient_allergies || [];
            })

            .addCase(loadPrescription.rejected, (state) => {
                state.loading = false;

                state.prescription = {
                    items: [],
                    total: 0,
                    specialInstructions: "",
                    reviewDate: "",
                };
            })

            .addCase(
                savePrescriptionThunk.fulfilled,
                (state, action) => {
                    const payload = action.meta.arg;

                    state.prescription.items = payload.items || [];

                    state.prescription.total = (payload.items || []).reduce(
                        (total, item) =>
                            total +
                            (Number(item.quantity || 0) *
                                Number(item.unit_rate || item.price || 0)),
                        0
                    );
                }
            )

            .addCase(
                savePrescriptionNotesThunk.fulfilled,
                (state, action) => {

                    state.prescription.specialInstructions =
                        action.meta.arg.payload.special_instructions;

                    state.prescription.reviewDate =
                        action.meta.arg.payload.review_date;
                }
            )

            .addCase(updatePrescriptionThunk.pending, (state) => {
                state.loading = true;
            })

            .addCase(updatePrescriptionThunk.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(updatePrescriptionThunk.rejected, (state) => {
                state.loading = false;
            })

               .addCase(updatePrescriptionItemThunk.pending, (state) => {
                state.loading = true;
            })

            .addCase(updatePrescriptionItemThunk.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(updatePrescriptionItemThunk.rejected, (state) => {
                state.loading = false;
            })
            .addCase(
                savePatientAllergiesThunk.fulfilled,
                (state, action) => {
                    state.allergies =
                        action.meta.arg.payload.allergies;
                }
            )
            .addCase(
                searchTherapiesThunk.fulfilled,
                (state, action) => {
                    state.therapySearch = action.payload || [];
                }
            )

            .addCase(loadTherapies.fulfilled, (state, action) => {
                const items = action.payload;

                state.therapy.items = items;
                state.therapy.total = items.reduce(
                    (sum, item) => sum + Number(item.amount || 0),
                    0
                );
            })

            .addCase(
                searchDiagnosisCategoriesThunk.fulfilled,
                (state, action) => {
                    state.diagnosisCategories = action.payload || [];
                }
            )

            .addCase(
                saveTherapyThunk.fulfilled,
                (state) => {
                    // Reload therapies after adding
                }
            )

            .addCase(
                updateTherapyThunk.fulfilled,
                (state) => {
                    // Reload therapies after updating
                }
            )

    },
});

export const {
    setSelectedPatient,
    clearSelectedPatient,
    setActiveFilter,

} = consultationSlice.actions;

export default consultationSlice.reducer;