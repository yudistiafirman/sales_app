import { createSlice } from "@reduxjs/toolkit";

type PopUpOptions = {
    isRenderActions?: boolean;
    popUpType?: "success" | "error" | "none" | "loading";
    popUpText?: string;
    highlightedText?: string;
    outsideClickClosePopUp?: boolean;
    popUpTitle?: string;
    outlineBtnTitle?: string;
    primaryBtnTitle?: string;
    outlineBtnAction?: () => void;
    primaryBtnAction?: () => void;
    isPrimaryButtonLoading?: boolean;
    isOutlineButtonLoading?: boolean;
    unRenderBackButton?: boolean;
};

type InitialStateType = {
    isPopUpVisible: boolean;
    popUpOptions: PopUpOptions;
};

const initialPopupData: PopUpOptions = {
    isRenderActions: false,
    popUpType: "none",
    popUpText: "",
    popUpTitle: "",
    outlineBtnAction: undefined,
    primaryBtnAction: undefined,
    outlineBtnTitle: "",
    primaryBtnTitle: "",
    outsideClickClosePopUp: true,
    highlightedText: "",
    isPrimaryButtonLoading: false,
    isOutlineButtonLoading: false,
    unRenderBackButton: false
};

const initialState: InitialStateType = {
    isPopUpVisible: false,
    popUpOptions: {
        isRenderActions: false,
        popUpType: "none",
        popUpTitle: "",
        popUpText: "",
        outsideClickClosePopUp: true,
        outlineBtnAction: undefined,
        primaryBtnAction: undefined,
        outlineBtnTitle: "",
        primaryBtnTitle: "",
        isPrimaryButtonLoading: false,
        isOutlineButtonLoading: false,
        unRenderBackButton: false
    }
};

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setIsPopUpVisible: (state) => ({
            ...state,
            isPopUpVisible: !state.isPopUpVisible
        }),
        openPopUp: (state, { payload }: { payload: PopUpOptions }) => {
            let { isRenderActions } = state.popUpOptions;
            let { popUpTitle } = state.popUpOptions;
            let { popUpText } = state.popUpOptions;
            let { highlightedText } = state.popUpOptions;
            let { popUpType } = state.popUpOptions;
            let { outsideClickClosePopUp } = state.popUpOptions;
            let { outlineBtnTitle } = state.popUpOptions;
            let { primaryBtnTitle } = state.popUpOptions;
            let { outlineBtnAction } = state.popUpOptions;
            let { primaryBtnAction } = state.popUpOptions;
            let { unRenderBackButton } = state.popUpOptions;
            let { isPrimaryButtonLoading } = state.popUpOptions;
            let { isOutlineButtonLoading } = state.popUpOptions;
            if (payload.isRenderActions) {
                isRenderActions = payload.isRenderActions;
            }
            if (payload.popUpTitle) {
                popUpTitle = payload.popUpTitle;
            }
            if (payload.popUpText) {
                popUpText = payload.popUpText;
            }
            if (payload.highlightedText) {
                highlightedText = payload.highlightedText;
            }
            if (payload.popUpType) {
                popUpType = payload.popUpType;
            } else {
                popUpType = "success";
            }
            if (typeof payload.outsideClickClosePopUp === "boolean") {
                outsideClickClosePopUp = payload.outsideClickClosePopUp;
            }
            if (payload.outlineBtnTitle) {
                outlineBtnTitle = payload.outlineBtnTitle;
            }
            if (payload.primaryBtnTitle) {
                primaryBtnTitle = payload.primaryBtnTitle;
            }
            if (payload.outlineBtnAction) {
                outlineBtnAction = payload.outlineBtnAction;
            }
            if (payload.primaryBtnAction) {
                primaryBtnAction = payload.primaryBtnAction;
            }
            if (payload.unRenderBackButton) {
                unRenderBackButton = payload.unRenderBackButton;
            }
            if (typeof payload.isPrimaryButtonLoading === "boolean") {
                isPrimaryButtonLoading = payload.isPrimaryButtonLoading;
            }
            if (typeof payload.isOutlineButtonLoading === "boolean") {
                isOutlineButtonLoading = payload.isOutlineButtonLoading;
            }

            return {
                ...state,
                isPopUpVisible: true,
                popUpOptions: {
                    ...state.popUpOptions,
                    isRenderActions,
                    popUpTitle,
                    popUpText,
                    highlightedText,
                    popUpType,
                    outsideClickClosePopUp,
                    outlineBtnTitle,
                    primaryBtnTitle,
                    outlineBtnAction,
                    primaryBtnAction,
                    unRenderBackButton,
                    isPrimaryButtonLoading,
                    isOutlineButtonLoading
                }
            };
        },
        closePopUp: (state) => ({
            ...state,
            isPopUpVisible: false,
            popUpOptions: initialPopupData
        })
    }
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
