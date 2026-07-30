import { createSlice } from "@reduxjs/toolkit";
import { getAppointments } from "./appointmentThunk";

const initialState = {
  loading: false,
  patientLoading: false,
  appointments: [],

  inPerson: [],

  video: [],

  homeVisits: [],

  error: null,
};

const appointmentSlice = createSlice({
  name: "appointment",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;

        state.inPerson = action.payload.in_person?.list || [];

        state.video = action.payload.video?.list || [];

        state.homeVisits =
          action.payload.home_visits?.list || [];

        state.appointments = [
          ...state.inPerson,
          ...state.video,
          ...state.homeVisits,
        ];
        
      })

      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });

      
  },
  
});

export default appointmentSlice.reducer;