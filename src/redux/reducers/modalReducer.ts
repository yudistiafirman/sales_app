import { createSlice } from '@reduxjs/toolkit';
import { getAllProject } from '../async-thunks/commonThunks';

type popUpOptions = {
  isRenderActions?: boolean;
  popUpType?: 'success' | 'error' | 'none' | 'loading';
  popUpText: string;
  highlightedText?: string;
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
  highlightedText: '',
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
      state.isPopUpVisible = !state.isPopUpVisible;
    },
    openPopUp: (state, { payload }: { payload: popUpOptions }) => {
      state.isPopUpVisible = true;
      if (payload.isRenderActions) {
        state.popUpOptions.isRenderActions = payload.isRenderActions;
      }
      if (payload.popUpText) {
        state.popUpOptions.popUpText = payload.popUpText;
      }
      if (payload.highlightedText) {
        state.popUpOptions.highlightedText = payload.highlightedText;
      }
      if (payload.popUpType) {
        state.popUpOptions.popUpType = payload.popUpType;
      } else {
        state.popUpOptions.popUpType = 'success';
      }
      if (typeof payload.outsideClickClosePopUp === 'boolean') {
        state.popUpOptions.outsideClickClosePopUp =
          payload.outsideClickClosePopUp;
      }
    },
    closePopUp: (state) => {
      state.isPopUpVisible = false;
      state.popUpOptions = initialPopupData;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProject.rejected, (state) => {
      state.isPopUpVisible = !state.isPopUpVisible;
      state.popUpOptions.popUpType = 'error';
      state.popUpOptions.popUpText = 'getAllProject error';
    });
  },
});

export const { setIsPopUpVisible, openPopUp, closePopUp } = modalSlice.actions;

export default modalSlice.reducer;
