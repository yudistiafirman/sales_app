import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { requiredDocType } from "@/interfaces";
import LocalFileType from "@/interfaces/LocalFileType";
import {
    CREATE_DEPOSIT,
    CREATE_SCHEDULE,
    CREATE_VISITATION
} from "@/navigation/ScreenNames";
import { postUploadFiles } from "../async-thunks/commonThunks";

type FileResponse = {
    id: string;
    type: "COVER" | "GALLERY";
};

export interface CameraGlobalState {
    localURLs: LocalFileType[];
    visitationPhotoURLs: LocalFileType[];
    createDepositPhotoURLs: LocalFileType[];
    createSchedulePhotoURLs: LocalFileType[];
    uploadedFilesResponse: FileResponse[];
    uploadedRequiredDocsResponse: requiredDocType[];
}

const initialState: CameraGlobalState = {
    localURLs: [],
    visitationPhotoURLs: [],
    createDepositPhotoURLs: [],
    createSchedulePhotoURLs: [],
    uploadedFilesResponse: [],
    uploadedRequiredDocsResponse: []
};

export const cameraSlice = createSlice({
    name: "camera",
    initialState,
    reducers: {
        setImageURLS: (
            state,
            action: PayloadAction<{ file: LocalFileType; source?: string }>
        ) => {
            switch (action.payload.source) {
                case CREATE_VISITATION:
                    return {
                        ...state,
                        visitationPhotoURLs: [
                            ...state.visitationPhotoURLs,
                            action.payload.file
                        ]
                    };
                case CREATE_DEPOSIT:
                    return {
                        ...state,
                        createDepositPhotoURLs: [
                            ...state.createDepositPhotoURLs,
                            action.payload.file
                        ]
                    };
                case CREATE_SCHEDULE:
                    return {
                        ...state,
                        createSchedulePhotoURLs: [
                            ...state.createSchedulePhotoURLs,
                            action.payload.file
                        ]
                    };
                default:
                    return {
                        ...state,
                        localURLs: [...state.localURLs, action.payload.file]
                    };
            }
        },
        resetImageURLS: (state, action: PayloadAction<{ source: string }>) => {
            switch (action.payload.source) {
                case CREATE_VISITATION:
                    return {
                        ...state,
                        visitationPhotoURLs: []
                    };
                case CREATE_DEPOSIT:
                    return {
                        ...state,
                        createDepositPhotoURLs: []
                    };
                case CREATE_SCHEDULE:
                    return {
                        ...state,
                        createSchedulePhotoURLs: []
                    };
                default:
                    return {
                        ...state,
                        localURLs: []
                    };
            }
        },
        deleteImage: (
            state,
            action: PayloadAction<{ pos: number; source: string }>
        ) => {
            let currentImages;
            switch (action.payload.source) {
                case CREATE_VISITATION:
                    currentImages = state.visitationPhotoURLs;
                    currentImages.splice(action.payload.pos, 1);
                    return {
                        ...state,
                        visitationPhotoURLs: [...currentImages]
                    };
                case CREATE_DEPOSIT:
                    currentImages = state.createDepositPhotoURLs;
                    currentImages.splice(action.payload.pos, 1);
                    return {
                        ...state,
                        createDepositPhotoURLs: [...currentImages]
                    };
                case CREATE_SCHEDULE:
                    currentImages = state.createSchedulePhotoURLs;
                    currentImages.splice(action.payload.pos, 1);
                    return {
                        ...state,
                        createSchedulePhotoURLs: [...currentImages]
                    };
                default:
                    currentImages = state.localURLs;
                    currentImages.splice(action.payload.pos, 1);
                    return {
                        ...state,
                        localURLs: [...currentImages]
                    };
            }
        },
        setuploadedFilesResponse: (state, action) => ({
            ...state,
            uploadedRequiredDocsResponse: action.payload
        })
    },
    extraReducers: (builder) => {
        builder.addCase(postUploadFiles.fulfilled, (state, { payload }) => {});
    }
});

export const {
    setImageURLS,
    resetImageURLS,
    deleteImage,
    setuploadedFilesResponse
} = cameraSlice.actions;

export default cameraSlice.reducer;
