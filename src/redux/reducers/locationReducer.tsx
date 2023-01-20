import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Dimensions } from 'react-native';
import { Location } from '@/interfaces';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface LocationState {
  region: Location;
}

const initialState: LocationState = {
  region: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA,
  },
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateRegion: (state, action: PayloadAction<Location>) => {
      return { ...state, region: { ...state.region, ...action.payload } };
    },
  },
});

export const { updateRegion } = locationSlice.actions;
export default locationSlice.reducer;
