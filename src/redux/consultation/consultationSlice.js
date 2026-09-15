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
    loadDoctorsList,
    deleteAssociateDoctorThunk,
    deleteTherapyThunk,
    finishConsultationThunk,
    loadPatientHistory,
    loadPatientConsultationReport,
    markReportReviewedThunk,
    loadReportById,
    loadPatientReports,
    loadPatientWellness,
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
    appointments: [],

    selectedPatient: null,
    activeFilter: "",


    patientProfile: null,
    patientLoading: false,
    patientWellness: null,
    prescriptionRequestId: null,
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
    therapyDeleteLoading: false,
    diagnosisCategories: [],

    associateDoctors: [],

    doctorsList: [],
    finishLoading: false,
    finishSuccess: false,

    patientHistory: [],
    patientHistoryLoading: false,
    patientHistoryError: null,

    consultationReport: null,
    consultationReportLoading: false,
    consultationReportError: null,
    // ========================================
    // PATIENT REPORTS
    // ========================================

    patientReports: [],
    patientReportsCount: 0,
    patientReportsLoading: false,
    patientReportsError: null,

    selectedReport: null,
    selectedReportLoading: false,
    selectedReportError: null,

    reportReviewLoading: false,
    reportReviewSuccess: false,
    reportReviewMessage: "",
    reportReviewError: null,
};

const consultationSlice = createSlice({
    name: "consultation",

    initialState,

    reducers: {

        clearSelectedReport: (state) => {

            state.selectedReport = null;

            state.selectedReportLoading = false;

            state.selectedReportError = null;
        },


        clearReportMessage: (state) => {

            state.reportReviewSuccess = false;

            state.reportReviewMessage = "";

            state.reportReviewError = null;
        },
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
            state.prescriptionRequestId = null;



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
                    differential_diagnosis:
                        action.payload?.differential_diagnosis || "",
                };
            })

            .addCase(saveDiagnosisThunk.fulfilled, (state, action) => {
                state.diagnosis = {
                    diagnosis: action.meta.arg.payload.diagnosis,
                    category: action.meta.arg.payload.category,
                    differential_diagnosis:
                        action.payload?.data?.differential_diagnosis ||
                        action.meta.arg.payload.differential_diagnosis ||
                        "",


                };
            })
            .addCase(loadAssociateDoctors.fulfilled, (state, action) => {
                state.associateDoctors = action.payload || [];
            })


            .addCase(
                searchPrescriptionProductsThunk.fulfilled,
                (state, action) => {
                    state.prescriptionSearch =
                        action.payload || [];
                }
            )
            // ========================================
            // LOAD PRESCRIPTION
            // ========================================

            .addCase(loadPrescription.pending, (state, action) => {

                state.loading = true;

                // Store the request ID of the CURRENT request
                state.prescriptionRequestId = action.meta.requestId;

                // Immediately clear previous patient's data
                state.prescription = {
                    consultation_id: action.meta.arg,
                    items: [],
                    total: 0,
                    specialInstructions: "",
                    reviewDate: "",
                };

                state.allergies = [];
            })


            .addCase(loadPrescription.fulfilled, (state, action) => {

                // ========================================
                // IMPORTANT
                // Ignore old/stale API responses
                // ========================================

                if (
                    state.prescriptionRequestId !==
                    action.meta.requestId
                ) {
                    return;
                }

                state.loading = false;

                const data = action.payload || {};

                state.prescription = {

                    consultation_id:
                        data.consultation_id ||
                        action.meta.arg,

                    items:
                        data.items || [],

                    total:
                        data.total || 0,

                    specialInstructions:
                        data.special_instructions || "",

                    reviewDate:
                        data.review_date || "",
                };

                state.allergies =
                    data.items?.[0]?.patient_allergies || [];
            })


            .addCase(loadPrescription.rejected, (state, action) => {

                // Ignore stale rejected requests too
                if (
                    state.prescriptionRequestId !==
                    action.meta.requestId
                ) {
                    return;
                }

                state.loading = false;

                state.prescription = {
                    consultation_id: null,
                    items: [],
                    total: 0,
                    specialInstructions: "",
                    reviewDate: "",
                };

                state.allergies = [];

                state.prescriptionRequestId = null;
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
                loadDoctorsList.fulfilled,
                (state, action) => {

                    state.doctorsList =
                        action.payload || [];

                }
            )
            .addCase(addAssociateDoctorThunk.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload?.data) {
                    state.associateDoctors.push(action.payload.data);
                }
            })

            .addCase(deleteAssociateDoctorThunk.fulfilled, (state, action) => {
                state.loading = false;

                const associateDoctorId = action.meta.arg;

                state.associateDoctors =
                    state.associateDoctors.filter(
                        (doctor) => doctor.id !== associateDoctorId
                    );
            })

            .addCase(
                deleteTherapyThunk.pending,
                (state) => {
                    state.therapyDeleteLoading = true;
                    state.error = null;
                }
            )

            .addCase(
                deleteTherapyThunk.fulfilled,
                (state, action) => {

                    state.therapyDeleteLoading = false;

                    const therapyId = action.meta.arg;

                    state.therapy.items =
                        state.therapy.items.filter(
                            (item) =>
                                item.id !== therapyId
                        );

                    state.therapy.total =
                        state.therapy.items.reduce(
                            (sum, item) =>
                                sum + Number(item.amount || 0),
                            0
                        );
                }
            )

            .addCase(
                deleteTherapyThunk.rejected,
                (state, action) => {

                    state.therapyDeleteLoading = false;
                    state.error = action.payload;
                }
            )

            .addCase(
                finishConsultationThunk.pending,
                (state) => {
                    state.finishLoading = true;
                    state.finishSuccess = false;
                    state.error = null;
                }
            )

            .addCase(
                finishConsultationThunk.fulfilled,
                (state) => {
                    state.finishLoading = false;
                    state.finishSuccess = true;
                }
            )

            .addCase(
                finishConsultationThunk.rejected,
                (state, action) => {
                    state.finishLoading = false;
                    state.finishSuccess = false;
                    state.error = action.payload;
                }
            )

            .addCase(
                loadPatientHistory.pending,
                (state) => {
                    state.patientHistoryLoading = true;
                    state.patientHistoryError = null;
                }
            )

            .addCase(
                loadPatientHistory.fulfilled,
                (state, action) => {
                    state.patientHistoryLoading = false;
                    state.patientHistory =
                        action.payload || [];
                }
            )

            .addCase(
                loadPatientHistory.rejected,
                (state, action) => {
                    state.patientHistoryLoading = false;
                    state.patientHistoryError =
                        action.payload ||
                        "Failed to load patient history";
                }
            )
            .addCase(
                loadPatientConsultationReport.pending,
                (state) => {
                    state.consultationReportLoading = true;
                    state.consultationReportError = null;
                }
            )

            .addCase(
                loadPatientConsultationReport.fulfilled,
                (state, action) => {
                    state.consultationReportLoading = false;
                    state.consultationReport = action.payload;
                }
            )

            .addCase(
                loadPatientConsultationReport.rejected,
                (state, action) => {
                    state.consultationReportLoading = false;
                    state.consultationReportError =
                        action.payload;
                }
            )

            // ========================================
            // PATIENT REPORTS
            // ========================================

            .addCase(
                loadPatientReports.pending,
                (state) => {

                    state.patientReportsLoading = true;

                    state.patientReportsError = null;
                }
            )

            .addCase(
                loadPatientReports.fulfilled,
                (state, action) => {

                    state.patientReportsLoading = false;

                    const response =
                        action.payload || {};

                    state.patientReports =
                        response.data || [];

                    state.patientReportsCount =
                        response.count ??
                        state.patientReports.length;
                }
            )

            .addCase(
                loadPatientReports.rejected,
                (state, action) => {

                    state.patientReportsLoading = false;

                    state.patientReportsError =
                        action.payload;
                }
            )


            // ========================================
            // SINGLE REPORT
            // ========================================

            .addCase(
                loadReportById.pending,
                (state) => {

                    state.selectedReportLoading = true;

                    state.selectedReportError = null;
                }
            )

            .addCase(
                loadReportById.fulfilled,
                (state, action) => {

                    state.selectedReportLoading = false;

                    state.selectedReport =
                        action.payload;
                }
            )

            .addCase(
                loadReportById.rejected,
                (state, action) => {

                    state.selectedReportLoading = false;

                    state.selectedReportError =
                        action.payload;
                }
            )


            // ========================================
            // MARK REPORT REVIEWED
            // ========================================

            .addCase(
                markReportReviewedThunk.pending,
                (state) => {

                    state.reportReviewLoading = true;

                    state.reportReviewSuccess = false;

                    state.reportReviewMessage = "";

                    state.reportReviewError = null;
                }
            )

            .addCase(
                markReportReviewedThunk.fulfilled,
                (state, action) => {

                    state.reportReviewLoading = false;

                    state.reportReviewSuccess = true;

                    state.reportReviewMessage =
                        action.payload?.message ||
                        "Report marked as reviewed";


                    const updatedReport =
                        action.payload?.data;


                    // Update selected report
                    if (
                        state.selectedReport &&
                        updatedReport
                    ) {

                        state.selectedReport = {
                            ...state.selectedReport,
                            ...updatedReport,
                        };
                    }


                    // Update report in list
                    if (updatedReport?.id) {

                        state.patientReports =
                            state.patientReports.map(
                                (report) =>
                                    report.id ===
                                        updatedReport.id
                                        ? {
                                            ...report,
                                            ...updatedReport,
                                        }
                                        : report
                            );
                    }
                }
            )

            .addCase(
                markReportReviewedThunk.rejected,
                (state, action) => {

                    state.reportReviewLoading = false;

                    state.reportReviewSuccess = false;

                    state.reportReviewError =
                        action.payload;
                }
            )
            // ========================================
            // PATIENT WELLNESS / VITALS
            // ========================================

            .addCase(
                loadPatientWellness.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                loadPatientWellness.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.patientWellness =
                        action.payload;

                    state.error = null;

                }
            )

            .addCase(
                loadPatientWellness.rejected,
                (state, action) => {

                    
                    state.loading = false;

                    state.error =
                        action.payload;

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
// ========================================
// REPORT SELECTORS
// ========================================

export const selectPatientReports =
    (state) =>
        state.consultation?.patientReports ||
        [];


export const selectPatientReportsCount =
    (state) =>
        state.consultation?.patientReportsCount ||
        0;


export const selectPatientReportsLoading =
    (state) =>
        state.consultation?.patientReportsLoading ||
        false;


export const selectPatientReportsError =
    (state) =>
        state.consultation?.patientReportsError ||
        null;


export const selectSelectedReport =
    (state) =>
        state.consultation?.selectedReport ||
        null;


export const selectSelectedReportLoading =
    (state) =>
        state.consultation?.selectedReportLoading ||
        false;


export const selectSelectedReportError =
    (state) =>
        state.consultation?.selectedReportError ||
        null;


export const selectReportReviewLoading =
    (state) =>
        state.consultation?.reportReviewLoading ||
        false;


export const selectReportReviewSuccess =
    (state) =>
        state.consultation?.reportReviewSuccess ||
        false;


export const selectReportReviewMessage =
    (state) =>
        state.consultation?.reportReviewMessage ||
        "";


export const selectReportReviewError =
    (state) =>
        state.consultation?.reportReviewError ||
        null;
export const {
    setSelectedPatient,
    clearSelectedPatient,
    setActiveFilter,

    clearSelectedReport,
    clearReportMessage,

} = consultationSlice.actions;

export default consultationSlice.reducer;