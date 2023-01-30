import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MainState {
  photoURLs: string[];
}

const initialState: MainState = {
  photoURLs: [],
};

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setImageURLS: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        photoURLs: [...state.photoURLs, action.payload],
      };
    },
    resetImageURLS: (state) => {
      return {
        ...state,
        photoURLs: [],
      };
    },
  },
});

export const { setImageURLS, resetImageURLS } = cameraSlice.actions;

export default cameraSlice.reducer;
