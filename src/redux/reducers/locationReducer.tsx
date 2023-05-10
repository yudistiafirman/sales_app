import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Dimensions } from 'react-native';
import { Address } from '@/interfaces';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface LocationState {
  region: Address;
}

const initialState: LocationState = {
  region: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA,
    postalId: 0,
  },
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateRegion: (state, action: PayloadAction<Location>) => ({ ...state, region: { ...state.region, ...action.payload } }),
    resetRegion: (state) => {
      state.region = initialState.region;
    },
  },
});

export const { updateRegion, resetRegion } = locationSlice.actions;
export default locationSlice.reducer;
