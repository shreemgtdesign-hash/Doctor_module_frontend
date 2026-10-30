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
  loadHomeVisitDoctors,
  loadHomeServiceAvailableSlots,
  bookHomeService,
  updatePatientAddress,
} from "./patientThunk";
import {
  DEFAULT_PATIENT_PROFILE,
  DEFAULT_TREATMENTS,
  DEFAULT_SLOTS,
  DEFAULT_DOCTORS,
  DEFAULT_DOCTOR_SLOTS,
  DEFAULT_HOME_VISIT_DOCTORS,
  DEFAULT_HOME_SERVICE_SLOTS,
  DEFAULT_PATIENT_ADDRESS,
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

  // ==========================================
  // HOME VISIT STATE
  // ==========================================
  homeVisitDoctors: DEFAULT_HOME_VISIT_DOCTORS,
  homeVisitDoctorsLoading: false,
  homeVisitDoctorsError: null,

  selectedHomeVisitDoctor: null,

  homeVisitDoctorSlots: DEFAULT_HOME_SERVICE_SLOTS,
  homeVisitDoctorSlotsLoading: false,
  homeVisitDoctorSlotsError: null,

  selectedHomeVisitDate: new Date().toISOString().split("T")[0],
  selectedHomeVisitSlot: "17:00",

  homeVisitBookingResult: null,
  homeVisitBookingLoading: false,
  homeVisitBookingError: null,

  patientAddress: DEFAULT_PATIENT_ADDRESS,
  addressUpdating: false,
  addressUpdateError: null,
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

    // Home Visit Reducers
    setSelectedHomeVisitDoctor: (state, action) => {
      state.selectedHomeVisitDoctor = action.payload;
    },
    setSelectedHomeVisitDate: (state, action) => {
      state.selectedHomeVisitDate = action.payload;
    },
    setSelectedHomeVisitSlot: (state, action) => {
      state.selectedHomeVisitSlot = action.payload;
    },
    clearHomeVisitBookingResult: (state) => {
      state.homeVisitBookingResult = null;
      state.homeVisitBookingError = null;
    },
    setPatientAddress: (state, action) => {
      state.patientAddress = {
        ...state.patientAddress,
        ...action.payload,
      };
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
        if (action.payload) {
          state.patientAddress = {
            name: `${action.payload.name || ""} ${action.payload.last_name || ""}`.trim() || state.patientAddress.name,
            address: action.payload.address || state.patientAddress.address,
            area: action.payload.area || state.patientAddress.area,
            landmark: action.payload.landmark || state.patientAddress.landmark,
            city: action.payload.city || state.patientAddress.city,
            district: action.payload.district || state.patientAddress.district,
            state: action.payload.state || state.patientAddress.state,
            pincode: action.payload.pincode || state.patientAddress.pincode,
            zip: action.payload.zip || action.payload.pincode || state.patientAddress.zip,
          };
        }
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

    // Home Visit Doctors
    builder
      .addCase(loadHomeVisitDoctors.pending, (state) => {
        state.homeVisitDoctorsLoading = true;
        state.homeVisitDoctorsError = null;
      })
      .addCase(loadHomeVisitDoctors.fulfilled, (state, action) => {
        state.homeVisitDoctorsLoading = false;
        state.homeVisitDoctors = action.payload;
      })
      .addCase(loadHomeVisitDoctors.rejected, (state, action) => {
        state.homeVisitDoctorsLoading = false;
        state.homeVisitDoctorsError = action.payload;
      });

    // Home Service Slots
    builder
      .addCase(loadHomeServiceAvailableSlots.pending, (state) => {
        state.homeVisitDoctorSlotsLoading = true;
        state.homeVisitDoctorSlotsError = null;
      })
      .addCase(loadHomeServiceAvailableSlots.fulfilled, (state, action) => {
        state.homeVisitDoctorSlotsLoading = false;
        state.homeVisitDoctorSlots = action.payload;
      })
      .addCase(loadHomeServiceAvailableSlots.rejected, (state, action) => {
        state.homeVisitDoctorSlotsLoading = false;
        state.homeVisitDoctorSlotsError = action.payload;
      });

    // Book Home Service
    builder
      .addCase(bookHomeService.pending, (state) => {
        state.homeVisitBookingLoading = true;
        state.homeVisitBookingError = null;
      })
      .addCase(bookHomeService.fulfilled, (state, action) => {
        state.homeVisitBookingLoading = false;
        state.homeVisitBookingResult = action.payload;
      })
      .addCase(bookHomeService.rejected, (state, action) => {
        state.homeVisitBookingLoading = false;
        state.homeVisitBookingError = action.payload;
      });

    // Update Address
    builder
      .addCase(updatePatientAddress.pending, (state) => {
        state.addressUpdating = true;
        state.addressUpdateError = null;
      })
      .addCase(updatePatientAddress.fulfilled, (state, action) => {
        state.addressUpdating = false;
        if (action.meta?.arg) {
          state.patientAddress = {
            ...state.patientAddress,
            ...action.meta.arg,
          };
        }
      })
      .addCase(updatePatientAddress.rejected, (state, action) => {
        state.addressUpdating = false;
        state.addressUpdateError = action.payload;
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
  setSelectedHomeVisitDoctor,
  setSelectedHomeVisitDate,
  setSelectedHomeVisitSlot,
  clearHomeVisitBookingResult,
  setPatientAddress,
} = patientSlice.actions;

export default patientSlice.reducer;
