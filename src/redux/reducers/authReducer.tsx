import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UserModel } from '@/models/User';

interface LoginCredential {
  phoneNumber: string;
}

interface AuthState {
  userData: UserModel.DataSuccessLogin | null;
  loginCredential: LoginCredential;
  isLoading: boolean;
  isSignout: boolean;
  hunterScreen: boolean;
  remote_config: {
    enable_appointment: boolean;
    enable_create_schedule: boolean;
    enable_customer_detail: boolean;
    enable_deposit: boolean;
    enable_hunter_farmer: boolean;
    enable_po: boolean;
    enable_price_menu: boolean;
    enable_profile_menu: boolean;
    enable_sph: boolean;
    enable_transaction_menu: boolean;
    enable_visitation: boolean;
    force_update: { min_version: string; is_forced: boolean };
  };
}

const initialState: AuthState = {
  userData: null,
  loginCredential: {
    phoneNumber: '',
  },
  isLoading: true,
  isSignout: false,
  hunterScreen: false,
  remote_config: {
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
  },
};

export const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        loginCredential: {
          ...state.loginCredential,
          phoneNumber: action.payload,
        },
      };
    },
    setUserData: (state, action: PayloadAction<any>) => {
      if (action.payload.remoteConfig) {
        return {
          ...state,
          userData: action.payload.userData,
          remote_config: {
            ...state.remote_config,
            enable_appointment: action.payload.remoteConfig.enable_appointment,
            enable_create_schedule:
              action.payload.remoteConfig.enable_create_schedule,
            enable_customer_detail:
              action.payload.remoteConfig.enable_customer_detail,
            enable_deposit: action.payload.remoteConfig.enable_deposit,
            enable_hunter_farmer:
              action.payload.remoteConfig.enable_hunter_farmer,
            enable_po: action.payload.remoteConfig.enable_po,
            enable_price_menu: action.payload.remoteConfig.enable_price_menu,
            enable_profile_menu:
              action.payload.remoteConfig.enable_profile_menu,
            enable_sph: action.payload.remoteConfig.enable_sph,
            enable_transaction_menu:
              action.payload.remoteConfig.enable_transaction_menu,
            enable_visitation: action.payload.remoteConfig.enable_visitation,
            force_update: action.payload.remoteConfig.force_update,
          },
          isSignout: false,
          isLoading: false,
        };
      } else {
        return {
          ...state,
          userData: action.payload.userData,
          isSignout: false,
          isLoading: false,
        };
      }
    },
    setIsLoading: (state, action: PayloadAction<any>) => {
      if (action.payload.remoteConfig) {
        return {
          ...state,
          remote_config: {
            ...state.remote_config,
            enable_appointment: action.payload.remoteConfig.enable_appointment,
            enable_create_schedule:
              action.payload.remoteConfig.enable_create_schedule,
            enable_customer_detail:
              action.payload.remoteConfig.enable_customer_detail,
            enable_deposit: action.payload.remoteConfig.enable_deposit,
            enable_hunter_farmer:
              action.payload.remoteConfig.enable_hunter_farmer,
            enable_po: action.payload.remoteConfig.enable_po,
            enable_price_menu: action.payload.remoteConfig.enable_price_menu,
            enable_profile_menu:
              action.payload.remoteConfig.enable_profile_menu,
            enable_sph: action.payload.remoteConfig.enable_sph,
            enable_transaction_menu:
              action.payload.remoteConfig.enable_transaction_menu,
            enable_visitation: action.payload.remoteConfig.enable_visitation,
            force_update: action.payload.remoteConfig.force_update,
          },
          isLoading: action.payload.loading,
        };
      } else {
        return {
          ...state,
          isLoading: action.payload.loading,
        };
      }
    },
    signout: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        userData: null,
        isLoading: action.payload,
        isSignout: true,
      };
    },
    toggleHunterScreen: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        hunterScreen: action.payload,
      };
    },
  },
});

export const {
  setPhoneNumber,
  setUserData,
  setIsLoading,
  signout,
  toggleHunterScreen,
} = authSlice.actions;

export default authSlice.reducer;
