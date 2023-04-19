import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { postUploadFiles } from '../async-thunks/commonThunks';
import { requiredDocType } from '@/interfaces';
import {
  CREATE_DEPOSIT,
  CREATE_SCHEDULE,
  CREATE_VISITATION,
} from '@/navigation/ScreenNames';
import { LocalFileType } from '@/interfaces/LocalFileType';

type fileResponse = {
  id: string;
  type: 'COVER' | 'GALLERY';
};


export interface CameraGlobalState {
  localURLs: LocalFileType[];
  visitationPhotoURLs: LocalFileType[];
  createDepositPhotoURLs: LocalFileType[];
  createSchedulePhotoURLs: LocalFileType[];
  uploadedFilesResponse: fileResponse[];
  uploadedRequiredDocsResponse: requiredDocType[];
}

const initialState: CameraGlobalState = {
  localURLs: [],
  visitationPhotoURLs: [],
  createDepositPhotoURLs: [],
  createSchedulePhotoURLs: [],
  uploadedFilesResponse: [],
  uploadedRequiredDocsResponse: [],
};

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setImageURLS: (
      state,
      action: PayloadAction<{ file: LocalFileType; source?: string }>
    ) => {
      switch (action.payload.source) {
        case CREATE_VISITATION:
          state.visitationPhotoURLs = [
            ...state.visitationPhotoURLs,
            action.payload.file,
          ];
          return;
        case CREATE_DEPOSIT:
          state.createDepositPhotoURLs = [
            ...state.createDepositPhotoURLs,
            action.payload.file,
          ];
          return;
        case CREATE_SCHEDULE:
          state.createSchedulePhotoURLs = [
            ...state.createSchedulePhotoURLs,
            action.payload.file,
          ];
          return;
        default:
          state.localURLs = [...state.localURLs, action.payload.file];
          return;
      }
    },
    resetImageURLS: (state, action: PayloadAction<{ source: string }>) => {
      switch (action.payload.source) {
        case CREATE_VISITATION:
          state.visitationPhotoURLs = [];
          return;
        case CREATE_DEPOSIT:
          state.createDepositPhotoURLs = [];
          return;
        case CREATE_SCHEDULE:
          state.createSchedulePhotoURLs = [];
          return;
        default:
          state.localURLs = [];
          return;
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
          state.visitationPhotoURLs = [...currentImages];
          return;
        case CREATE_DEPOSIT:
          currentImages = state.createDepositPhotoURLs;
          currentImages.splice(action.payload.pos, 1);
          state.createDepositPhotoURLs = [...currentImages];
          return;
        case CREATE_SCHEDULE:
          currentImages = state.createSchedulePhotoURLs;
          currentImages.splice(action.payload.pos, 1);
          state.createSchedulePhotoURLs = [...currentImages];
          return;
        default:
          currentImages = state.localURLs;
          currentImages.splice(action.payload.pos, 1);
          state.localURLs = [...currentImages];
          return;
      }
    },
    setuploadedFilesResponse: (state, action) => {
      state.uploadedRequiredDocsResponse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postUploadFiles.fulfilled, (state, { payload }) => { });
  },
});

export const {
  setImageURLS,
  resetImageURLS,
  deleteImage,
  setuploadedFilesResponse,
} = cameraSlice.actions;

export default cameraSlice.reducer;
