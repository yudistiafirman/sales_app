import { createSlice } from "@reduxjs/toolkit";

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
    isRenderAction: false
};
const initialState: InitialStateType = {
    isSnackbarVisible: false,
    snackBarOptions: {
        isRenderAction: false,
        snackBarText: "",
        isSuccess: false
    }
};

export const snackbarSlice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        openSnackbar: (
            state,
            { payload }: { payload: SnackbarOptionsType }
        ) => {
            let { isRenderAction, isSuccess, snackBarText } =
                state.snackBarOptions;
            if (typeof payload.isRenderAction === "boolean") {
                isRenderAction = payload.isRenderAction;
            }
            if (typeof payload.isSuccess === "boolean") {
                isSuccess = payload.isSuccess;
            }
            if (typeof payload.snackBarText === "string") {
                snackBarText = payload.snackBarText;
            }
            return {
                ...state,
                isSnackbarVisible: true,
                snackBarOptions: {
                    ...state.snackBarOptions,
                    isRenderAction,
                    isSuccess,
                    snackBarText
                }
            };
        },
        closeSnackbar: (state) => ({
            ...state,
            isSnackbarVisible: false,
            snackBarOptions: initialSnackbarOptions
        })
    }
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
