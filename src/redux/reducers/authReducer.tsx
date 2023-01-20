import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { act } from 'react-test-renderer';

interface UserData {
  accessToken: string;
  userId: string;
  email: string;
  phone: string;
  userType: string;
}

interface LoginCredential {
  phoneNumber: string;
}

interface AuthState {
  userData: UserData;
  loginCredential: LoginCredential;
  isSignin: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  userData: {
    accessToken: '',
    userId: '',
    email: '',
    phone: '',
    userType: '',
  },
  loginCredential: {
    phoneNumber: '',
  },
  isSignin: false,
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
    setUserData: (state, action: PayloadAction<UserData>) => {
      console.log(action.payload.accessToken)
      return {
        ...state,
        userData: action.payload,
      };
    },
    setSignin: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isSignin: action.payload,
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

export const { setPhoneNumber, setUserData, setSignin, setIsLoading } =
  authSlice.actions;

export default authSlice.reducer;
