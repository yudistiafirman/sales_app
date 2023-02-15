import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { JwtPayload } from 'jwt-decode';

interface LoginCredential {
  phoneNumber: string;
}

interface AuthState {
  userData: JwtPayload | null;
  loginCredential: LoginCredential;
  isLoading: boolean;
  isSignout: boolean;
  hunterScreen: boolean;
}

const initialState: AuthState = {
  userData: null,
  loginCredential: {
    phoneNumber: '',
  },
  isLoading: false,
  isSignout: false,
  hunterScreen: true,
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
    setUserData: (state, action: PayloadAction<JwtPayload | null>) => {
      return {
        ...state,
        userData: action.payload,
        isSignout: false,
      };
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLoading: action.payload,
      };
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
