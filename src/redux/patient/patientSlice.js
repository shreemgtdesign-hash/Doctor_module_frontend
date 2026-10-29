import { createSlice } from "@reduxjs/toolkit";
import {
  loadPatientProfile,
  loadTreatments,
  loadAvailableSlots,
  bookTherapySession,
  loadDoctors,
  loadDoctorById,
  loadDoctorAvailableSlots,
  bookDoctorAppointment,
} from "./patientThunk";
import {
  DEFAULT_PATIENT_PROFILE,
  DEFAULT_TREATMENTS,
  DEFAULT_SLOTS,
  DEFAULT_DOCTORS,
  DEFAULT_DOCTOR_SLOTS,
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

  // Available Slots for Chosen Date (Therapy)
  availableSlots: DEFAULT_SLOTS,
  slotsLoading: false,
  slotsError: null,
  selectedDate: new Date().toISOString().split("T")[0],
  selectedSlotTime: "",

  // Booking result (Therapy)
  bookingResult: null,
  bookingLoading: false,
  bookingError: null,

  // Doctors / Practitioners Catalog
  doctors: DEFAULT_DOCTORS,
  doctorsLoading: false,
  doctorsError: null,

  // Selected Doctor for Consultation Details & Booking
  selectedDoctor: null,
  selectedDoctorLoading: false,
  selectedDoctorError: null,

  // Available Slots for Chosen Doctor, Date & Branch
  doctorSlots: DEFAULT_DOCTOR_SLOTS,
  doctorSlotsLoading: false,
  doctorSlotsError: null,
  selectedAppointmentDate: new Date().toISOString().split("T")[0],
  selectedAppointmentSlot: null,
  selectedBranch: "West Mambalam",

  // Appointment Booking result
  appointmentBookingResult: null,
  appointmentBookingLoading: false,
  appointmentBookingError: null,
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
    // Doctor Appointment Reducers
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    setSelectedAppointmentDate: (state, action) => {
      state.selectedAppointmentDate = action.payload;
    },
    setSelectedAppointmentSlot: (state, action) => {
      state.selectedAppointmentSlot = action.payload;
    },
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
    clearAppointmentBookingResult: (state) => {
      state.appointmentBookingResult = null;
      state.appointmentBookingError = null;
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

    // Slots (Therapy)
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

    // Doctors Catalog
    builder
      .addCase(loadDoctors.pending, (state) => {
        state.doctorsLoading = true;
        state.doctorsError = null;
      })
      .addCase(loadDoctors.fulfilled, (state, action) => {
        state.doctorsLoading = false;
        state.doctors = action.payload;
      })
      .addCase(loadDoctors.rejected, (state, action) => {
        state.doctorsLoading = false;
        state.doctorsError = action.payload;
      });

    // Doctor by ID
    builder
      .addCase(loadDoctorById.pending, (state) => {
        state.selectedDoctorLoading = true;
        state.selectedDoctorError = null;
      })
      .addCase(loadDoctorById.fulfilled, (state, action) => {
        state.selectedDoctorLoading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(loadDoctorById.rejected, (state, action) => {
        state.selectedDoctorLoading = false;
        state.selectedDoctorError = action.payload;
      });

    // Doctor Available Slots
    builder
      .addCase(loadDoctorAvailableSlots.pending, (state) => {
        state.doctorSlotsLoading = true;
        state.doctorSlotsError = null;
      })
      .addCase(loadDoctorAvailableSlots.fulfilled, (state, action) => {
        state.doctorSlotsLoading = false;
        state.doctorSlots = action.payload;
      })
      .addCase(loadDoctorAvailableSlots.rejected, (state, action) => {
        state.doctorSlotsLoading = false;
        state.doctorSlotsError = action.payload;
      });

    // Book Doctor Appointment
    builder
      .addCase(bookDoctorAppointment.pending, (state) => {
        state.appointmentBookingLoading = true;
        state.appointmentBookingError = null;
      })
      .addCase(bookDoctorAppointment.fulfilled, (state, action) => {
        state.appointmentBookingLoading = false;
        state.appointmentBookingResult = action.payload;
      })
      .addCase(bookDoctorAppointment.rejected, (state, action) => {
        state.appointmentBookingLoading = false;
        state.appointmentBookingError = action.payload;
      });
  },
});

export const {
  setSelectedTreatment,
  setSelectedDate,
  setSelectedSlotTime,
  clearBookingResult,
  setSelectedDoctor,
  setSelectedAppointmentDate,
  setSelectedAppointmentSlot,
  setSelectedBranch,
  clearAppointmentBookingResult,
} = patientSlice.actions;

export default patientSlice.reducer;


