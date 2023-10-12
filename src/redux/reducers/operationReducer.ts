import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LocalFileType from "@/interfaces/LocalFileType";
import { OperationsDeliveryOrderFileResponse } from "@/interfaces/Operation";

interface InputsValue {
    recepientName: string;
    recepientPhoneNumber: string;
    truckMixCondition: string;
    truckMixHaveLoad: boolean;
    weightBridge: string;
}

export interface OperationProjectDetails {
    deliveryOrderId: string;
    projectName: string;
    address?: string;
    lonlat: { longitude: number; latitude: number };
    requestedQuantity: number;
    deliveryTime: string;
    doNumber: string;
}

export interface OperationInitState {
    photoFiles: LocalFileType[];
    videoFiles: LocalFileType[];
    inputsValue: InputsValue;
    projectDetails: OperationProjectDetails;
    isLoading: boolean;
    existingFiles: OperationsDeliveryOrderFileResponse[];
}

const initialState: OperationInitState = {
    photoFiles: [],
    videoFiles: [],
    inputsValue: {
        recepientName: "",
        recepientPhoneNumber: "",
        truckMixCondition: "",
        weightBridge: "",
        truckMixHaveLoad: false
    },
    projectDetails: {
        deliveryOrderId: "",
        projectName: "",
        doNumber: "",
        address: "",
        lonlat: { longitude: 0, latitude: 0 },
        requestedQuantity: 0,
        deliveryTime: ""
    },
    isLoading: false,
    existingFiles: []
};
export const operationSlice = createSlice({
    name: "operationState",
    initialState,
    reducers: {
        resetOperationState: () => initialState,
        resetInputsValue: (state) => ({
            ...state,
            inputsValue: {
                ...state.inputsValue,
                recepientName: "",
                recepientPhoneNumber: "",
                truckMixCondition: "",
                weightBridge: "",
                truckMixHaveLoad: false
            }
        }),
        onChangeInputValue: (
            state,
            actions: PayloadAction<{
                inputType: keyof InputsValue;
                value: string;
            }>
        ) => {
            if (actions.payload?.inputType) {
                return {
                    ...state,
                    inputsValue: {
                        ...state.inputsValue,
                        [actions.payload.inputType]: actions.payload?.value
                    }
                };
            }
            return {
                ...state,
                inputsValue: {
                    ...state.inputsValue
                }
            };
        },
        onChangeProjectDetails: (
            state,
            actions: PayloadAction<{ projectDetails: OperationProjectDetails }>
        ) => ({
            ...state,
            projectDetails: actions.payload?.projectDetails
        }),
        setOperationVideo: (
            state,
            actions: PayloadAction<{
                file: LocalFileType;
                withoutAddButton: boolean;
            }>
        ) => {
            let currentVideos = [...state.videoFiles];
            if (actions.payload?.withoutAddButton)
                currentVideos = currentVideos?.filter(
                    (it) => it?.file !== null
                );
            currentVideos?.push(actions.payload?.file);
            return {
                ...state,
                videoFiles: [...currentVideos]
            };
        },
        setAllOperationVideo: (
            state,
            actions: PayloadAction<{ file: LocalFileType[] }>
        ) => {
            if (actions.payload?.file) {
                return {
                    ...state,
                    videoFiles: [...actions.payload.file]
                };
            }
            return {
                ...state
            };
        },
        setOperationPhoto: (
            state,
            actions: PayloadAction<{
                file: LocalFileType;
                withoutAddButton: boolean;
            }>
        ) => {
            let currentImages = [...state.photoFiles];
            if (actions.payload?.withoutAddButton)
                currentImages = currentImages?.filter(
                    (it) => it?.file !== null
                );
            currentImages?.push(actions.payload?.file);
            return {
                ...state,
                photoFiles: [...currentImages]
            };
        },
        setAllOperationPhoto: (
            state,
            actions: PayloadAction<{ file: LocalFileType[] }>
        ) => {
            if (actions.payload?.file) {
                return {
                    ...state,
                    photoFiles: [...actions.payload.file]
                };
            }
            return {
                ...state
            };
        },
        removeOperationPhoto: (
            state,
            actions: PayloadAction<{ index: number }>
        ) => {
            let currentImages = [...state.photoFiles];
            currentImages = currentImages?.filter((it) => it?.file !== null);
            currentImages?.splice(actions.payload?.index, 1);
            currentImages?.unshift({ file: null });
            return {
                ...state,
                photoFiles: [...currentImages]
            };
        },
        removeOperationVideo: (
            state,
            actions: PayloadAction<{ index: number }>
        ) => {
            let currentVideos = [...state.videoFiles];
            currentVideos = currentVideos?.filter((it) => it?.file !== null);
            currentVideos?.splice(actions.payload?.index, 1);
            currentVideos?.unshift({ file: null });
            return {
                ...state,
                videoFiles: [...currentVideos]
            };
        },
        setExistingFiles: (
            state,
            actions: PayloadAction<{
                files: OperationsDeliveryOrderFileResponse[];
            }>
        ) => {
            let tempState = state.existingFiles;
            if (actions.payload?.files) tempState = actions.payload?.files;
            return {
                ...state,
                existingFiles: [...tempState]
            };
        },
        removeDriverPhoto: (
            state,
            actions: PayloadAction<{ index: number; attachType: string }>
        ) => {
            const newPhotoFiles: LocalFileType[] = [];
            state?.photoFiles?.forEach((item) => {
                let selectedItem: LocalFileType | undefined = { ...item };
                if (selectedItem?.attachType === actions.payload?.attachType) {
                    selectedItem = {
                        file: null,
                        attachType: actions.payload?.attachType
                    };
                }

                if (selectedItem) newPhotoFiles?.push(selectedItem);
            });
            return {
                ...state,
                photoFiles: [...newPhotoFiles]
            };
        },
        removeDriverVideo: (
            state,
            actions: PayloadAction<{ index: number; attachType: string }>
        ) => {
            const newVideoFiles: LocalFileType[] = [];
            state?.videoFiles?.forEach((item) => {
                let selectedItem: LocalFileType | undefined = { ...item };
                if (selectedItem?.attachType === actions.payload?.attachType) {
                    selectedItem = {
                        file: null,
                        attachType: actions.payload?.attachType
                    };
                }

                if (selectedItem) newVideoFiles?.push(selectedItem);
            });
            return {
                ...state,
                videoFiles: [...newVideoFiles]
            };
        }
    }
});

export const {
    resetOperationState,
    resetInputsValue,
    onChangeInputValue,
    onChangeProjectDetails,
    setOperationPhoto,
    setOperationVideo,
    setAllOperationPhoto,
    removeOperationPhoto,
    setAllOperationVideo,
    removeOperationVideo,
    removeDriverPhoto,
    removeDriverVideo,
    setExistingFiles
} = operationSlice.actions;

export default operationSlice.reducer;
