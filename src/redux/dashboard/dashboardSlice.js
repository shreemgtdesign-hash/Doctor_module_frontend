import { createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "./dashboardThunk";

const initialState = {
  loading: false,

  overview: {},
  schedule: {},
  consultation: {},
  ailments: [],
  therapies: {},
  medicines: {},

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

            .addCase(getDashboard.fulfilled, (state, action) => {
  console.log(action.payload);

  state.loading = false;

  state.overview = action.payload.overview;
  state.schedule = action.payload.schedule;
  state.consultation = action.payload.consultation;
  state.ailments = action.payload.ailments;
  state.therapies = action.payload.therapies;
  state.medicines = action.payload.medicines;
})

            .addCase(getDashboard.rejected, (state) => {

                state.loading = false;

            });
            



    },

});

export default dashboardSlice.reducer;