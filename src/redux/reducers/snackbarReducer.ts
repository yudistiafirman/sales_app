import { createSlice } from '@reduxjs/toolkit';

type SnackbarOptionsType = {
  isRenderAction?: boolean;
  snackBarText?: string;
  isSuccess?: boolean;
};

type InitialStateType = {
  isSnackbarVisible: boolean;
  snackBarOptions: SnackbarOptionsType;
};

const initialSnackbarOptions: SnackbarOptionsType = {
  isRenderAction: false,
};
const initialState: InitialStateType = {
  isSnackbarVisible: false,
  snackBarOptions: {
    isRenderAction: false,
    snackBarText: '',
    isSuccess: false,
  },
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (state, { payload }: { payload: SnackbarOptionsType }) => {
      state.isSnackbarVisible = true;
      if (typeof payload.isRenderAction === 'boolean') {
        state.snackBarOptions.isRenderAction = payload.isRenderAction;
      }
      if (typeof payload.isSuccess === 'boolean') {
        state.snackBarOptions.isSuccess = payload.isSuccess;
      }
      if (typeof payload.snackBarText === 'string') {
        state.snackBarOptions.snackBarText = payload.snackBarText;
      }
      //   setTimeout(() => {
      //     state.isSnackbarVisible = false;
      //   }, 3000);
    },
    closeSnackbar: state => {
      state.isSnackbarVisible = false;
      state.snackBarOptions = initialSnackbarOptions;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
