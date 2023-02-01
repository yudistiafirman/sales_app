import { createSlice } from '@reduxjs/toolkit';

type popUpOptions = {
  isRenderActions?: boolean;
  popUpType: 'success' | 'error' | 'none';
  popUpText?: string;
  outsideClickClosePopUp?: boolean;
};

type initialStateType = {
  isPopUpVisible: boolean;
  popUpOptions: popUpOptions;
};

const initialPopupData: popUpOptions = {
  isRenderActions: false,
  popUpType: 'none',
  popUpText: '',
  outsideClickClosePopUp: true,
};

const initialState: initialStateType = {
  isPopUpVisible: false,
  popUpOptions: {
    isRenderActions: false,
    popUpType: 'none',
    popUpText: '',
    outsideClickClosePopUp: true,
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
    openPopUp: (state, { payload }: { payload: popUpOptions }) => {
      state.isPopUpVisible = !state.isPopUpVisible;
      if (payload.isRenderActions) {
        state.popUpOptions.isRenderActions = payload.isRenderActions;
      }
      if (payload.popUpText) {
        state.popUpOptions.popUpText = payload.popUpText;
      }
      if (payload.popUpType) {
        state.popUpOptions.popUpType = payload.popUpType;
      }
      if (payload.outsideClickClosePopUp) {
        state.popUpOptions.outsideClickClosePopUp =
          payload.outsideClickClosePopUp;
      }
    },
    closePopUp: (state) => {
      state.isPopUpVisible = !state.isPopUpVisible;
      state.popUpOptions = initialPopupData;
    },
  },
});

export const { setIsPopUpVisible } = modalSlice.actions;

export default modalSlice.reducer;
