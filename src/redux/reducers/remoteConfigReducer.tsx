import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  enable_appointment: true,
  enable_create_schedule: true,
  enable_customer_detail: true,
  enable_deposit: true,
  enable_hunter_farmer: true,
  enable_po: true,
  enable_price_menu: true,
  enable_profile_menu: true,
  enable_sph: true,
  enable_transaction_menu: true,
  enable_visitation: true,
  force_update: { min_version: '1.0.0', is_forced: false },
};

export const remoteConfigSlice = createSlice({
  name: 'remoteConfig',
  initialState,
  reducers: {
    setFetchedConfig: (state, { payload }) => {
      state.enable_appointment = payload.enable_appointment;
      state.enable_create_schedule = payload.enable_create_schedule;
      state.enable_customer_detail = payload.enable_customer_detail;
      state.enable_deposit = payload.enable_deposit;
      state.enable_hunter_farmer = payload.enable_hunter_farmer;
      state.enable_po = payload.enable_po;
      state.enable_price_menu = payload.enable_price_menu;
      state.enable_profile_menu = payload.enable_profile_menu;
      state.enable_sph = payload.enable_sph;
      state.enable_transaction_menu = payload.enable_transaction_menu;
      state.enable_visitation = payload.enable_visitation;
      state.force_update = payload.force_update;
    },
  },
});

export const { setFetchedConfig } = remoteConfigSlice.actions;

export default remoteConfigSlice.reducer;
