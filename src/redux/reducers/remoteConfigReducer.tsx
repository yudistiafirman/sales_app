import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  force_update: { min_version: '0.0.1', isForced: false },
  enable_hunter_farmer: true,
};

export const remoteConfigSlice = createSlice({
  name: 'remoteConfig',
  initialState,
  reducers: {
    setFetchedConfig: (state, { payload }) => {
      state.enable_hunter_farmer = payload.enable_hunter_farmer;
      state.force_update = payload.force_update;
    },
  },
});

export const { setFetchedConfig } = remoteConfigSlice.actions;

export default remoteConfigSlice.reducer;
