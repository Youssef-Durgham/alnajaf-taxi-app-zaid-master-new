import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  origin: null,
  destination: null,
  travelTimeInformation: null,
};

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setOrigin: (state, {payload}) => {
      state.origin = payload;
    },
    setDestination: (state, {payload}) => {
      state.destination = payload;
    },
    setTravelTimeInformation: (state, {payload}) => {
      state.travelTimeInformation = payload;
    },
  },
});

export const {setDestination, setOrigin, setTravelTimeInformation} =
  navSlice.actions;

/* Selectors */
export const selectOrigin = state => state.nav.origin;
export const selectDestination = state => state.nav.destination;
export const selectTravelTimeInformation = state =>
  state.nav.travelTimeInformation;

export default navSlice.reducer;
