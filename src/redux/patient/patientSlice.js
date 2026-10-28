import { createSlice } from "@reduxjs/toolkit";
import {
  loadPatientProfile,
  loadTreatments,
  loadAvailableSlots,
  bookTherapySession,
} from "./patientThunk";
import {
  DEFAULT_PATIENT_PROFILE,
  DEFAULT_TREATMENTS,
  DEFAULT_SLOTS,
} from "../../services/patientService";

const initialState = {
  // Patient Profile & Vitals
  profile: DEFAULT_PATIENT_PROFILE,
  profileLoading: false,
  profileError: null,

  // Treatments Catalog
  treatments: DEFAULT_TREATMENTS,
  treatmentsLoading: false,
  treatmentsError: null,

  // Selected Treatment for Details & Booking
  selectedTreatment: null,

  // Available Slots for Chosen Date
  availableSlots: DEFAULT_SLOTS,
  slotsLoading: false,
  slotsError: null,
  selectedDate: new Date().toISOString().split("T")[0],
  selectedSlotTime: "",

  // Booking result
  bookingResult: null,
  bookingLoading: false,
  bookingError: null,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setSelectedTreatment: (state, action) => {
      state.selectedTreatment = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedSlotTime: (state, action) => {
      state.selectedSlotTime = action.payload;
    },
    clearBookingResult: (state) => {
      state.bookingResult = null;
      state.bookingError = null;
    },
  },
  extraReducers: (builder) => {
    // Profile
    builder
      .addCase(loadPatientProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(loadPatientProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(loadPatientProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    // Treatments
    builder
      .addCase(loadTreatments.pending, (state) => {
        state.treatmentsLoading = true;
        state.treatmentsError = null;
      })
      .addCase(loadTreatments.fulfilled, (state, action) => {
        state.treatmentsLoading = false;
        state.treatments = action.payload;
      })
      .addCase(loadTreatments.rejected, (state, action) => {
        state.treatmentsLoading = false;
        state.treatmentsError = action.payload;
      });

    // Slots
    builder
      .addCase(loadAvailableSlots.pending, (state) => {
        state.slotsLoading = true;
        state.slotsError = null;
      })
      .addCase(loadAvailableSlots.fulfilled, (state, action) => {
        state.slotsLoading = false;
        state.availableSlots = action.payload;
      })
      .addCase(loadAvailableSlots.rejected, (state, action) => {
        state.slotsLoading = false;
        state.slotsError = action.payload;
      });

    // Book Therapy
    builder
      .addCase(bookTherapySession.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(bookTherapySession.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookingResult = action.payload;
      })
      .addCase(bookTherapySession.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      });
  },
});

export const {
  setSelectedTreatment,
  setSelectedDate,
  setSelectedSlotTime,
  clearBookingResult,
} = patientSlice.actions;

export default patientSlice.reducer;

