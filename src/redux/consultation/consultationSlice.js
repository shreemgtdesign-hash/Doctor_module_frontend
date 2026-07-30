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
} from "./consultationThunk";

const initialState = {
    loading: false,

    chiefComplaints: {
        tags: [],
        notes: "",
    },
    diagnosis: "",
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
                state.diagnosis =
                    action.payload?.diagnosis || "";
            })

            .addCase(saveDiagnosisThunk.fulfilled, (state, action) => {
                state.diagnosis =
                    action.meta.arg.payload.diagnosis;
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

    const data = action.payload || {};

    state.prescription = {
        items: data.items || [],
        total: data.total || 0,
        specialInstructions:
            data.special_instructions || "",
        reviewDate:
            data.review_date || "",
    };
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

.addCase(
  loadTherapies.fulfilled,
  (state, action) => {
    state.therapy = {
      items: action.payload.items || [],
      total: action.payload.total || 0,
    };
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