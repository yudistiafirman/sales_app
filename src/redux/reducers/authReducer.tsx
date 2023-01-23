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
}

const initialState: AuthState = {
  userData: null,
  loginCredential: {
    phoneNumber: '',
  },
  isLoading: false,
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
      };
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
});

export const { setPhoneNumber, setUserData, setIsLoading } = authSlice.actions;

export default authSlice.reducer;
