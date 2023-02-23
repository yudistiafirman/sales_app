import { createSlice } from '@reduxjs/toolkit';
import { getAllProject } from '../async-thunks/commonThunks';

type popUpOptions = {
  isRenderActions?: boolean;
  popUpType?: 'success' | 'error' | 'none' | 'loading';
  popUpText?: string;
  highlightedText?: string;
  outsideClickClosePopUp?: boolean;
  popUpTitle?: string;
  outlineBtnTitle?: string;
  primaryBtnTitle?: string;
  outlineBtnAction?: () => void;
  primaryBtnAction?: () => void;
};

type initialStateType = {
  isPopUpVisible: boolean;
  popUpOptions: popUpOptions;
};

const initialPopupData: popUpOptions = {
  isRenderActions: false,
  popUpType: 'none',
  popUpText: '',
  popUpTitle: '',
  outlineBtnAction: undefined,
  primaryBtnAction: undefined,
  outlineBtnTitle: '',
  primaryBtnTitle: '',
  outsideClickClosePopUp: true,
  highlightedText: '',
};

const initialState: initialStateType = {
  isPopUpVisible: false,
  popUpOptions: {
    isRenderActions: false,
    popUpType: 'none',
    popUpTitle: '',
    popUpText: '',
    outsideClickClosePopUp: true,
    outlineBtnAction: undefined,
    primaryBtnAction: undefined,
    outlineBtnTitle: '',
    primaryBtnTitle: '',
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
      if (payload.popUpTitle) {
        state.popUpOptions.popUpTitle = payload.popUpTitle;
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
      if (payload.outlineBtnTitle) {
        state.popUpOptions.outlineBtnTitle = payload.outlineBtnTitle;
      }
      if (payload.primaryBtnTitle) {
        state.popUpOptions.primaryBtnTitle = payload.primaryBtnTitle;
      }
      if (payload.outlineBtnAction) {
        state.popUpOptions.outlineBtnAction = payload.outlineBtnAction;
      }
      if (payload.primaryBtnAction) {
        state.popUpOptions.primaryBtnAction = payload.primaryBtnAction;
      }
    },
    closePopUp: (state) => {
      state.isPopUpVisible = false;
      state.popUpOptions = initialPopupData;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getAllProject.rejected, (state) => {
  //     state.isPopUpVisible = !state.isPopUpVisible;
  //     state.popUpOptions.popUpType = 'error';
  //     state.popUpOptions.popUpText = 'getAllProject error';
  //   });
  // },
});

export const { setIsPopUpVisible, openPopUp, closePopUp } = modalSlice.actions;

export default modalSlice.reducer;
