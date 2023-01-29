import { createSlice } from '@reduxjs/toolkit';

type initialStateType = {
  isPopUpVisible: boolean;
  popUpOptions: {
    isRenderActions: boolean;
    popUpType: 'success' | 'error' | 'none';
    popUpText: string;
    outsideClickClosePopUp: boolean;
    // continueMethod: () => void;
    // backMethod: () => void;
  };
};

const initialState: initialStateType = {
  isPopUpVisible: false,
  popUpOptions: {
    isRenderActions: false,
    popUpType: 'none',
    popUpText: '',
    outsideClickClosePopUp: true,
    // continueMethod: () => {},
    // backMethod: () => {},
  },
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIsPopUpVisible: (state) => {
      return {
        ...state,
        isPopUpVisible: !state.isPopUpVisible,
      };
    },
    // resetState: () => {
    //   return initialState;
    // },
  },
});

export const { setIsPopUpVisible } = modalSlice.actions;

export default modalSlice.reducer;
