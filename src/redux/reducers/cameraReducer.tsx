import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { postUploadFiles } from '../async-thunks/commonThunks';
import { requiredDocType } from '@/interfaces';
import {
  CREATE_DEPOSIT,
  CREATE_SCHEDULE,
  CREATE_VISITATION,
} from '@/navigation/ScreenNames';

interface photoType {
  photo: {
    uri: string;
    type: string;
    name: string;
  };
  type: 'COVER' | 'GALLERY';
}

type fileResponse = {
  id: string;
  type: 'COVER' | 'GALLERY';
};

export interface MainState {
  photoURLs: photoType[];
  visitationPhotoURLs: photoType[];
  createDepositPhotoURLs: photoType[];
  createSchedulePhotoURLs: photoType[];
  operationPhotoURLs: photoType[];
  uploadedFilesResponse: fileResponse[];
  uploadedRequiredDocsResponse: requiredDocType[];
}

const initialState: MainState = {
  photoURLs: [],
  visitationPhotoURLs: [],
  createDepositPhotoURLs: [],
  createSchedulePhotoURLs: [],
  operationPhotoURLs: [],
  uploadedFilesResponse: [],
  uploadedRequiredDocsResponse: [],
};

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setImageURLS: (
      state,
      action: PayloadAction<{ photo: photoType; source?: string }>
    ) => {
      switch (action.payload.source) {
        case CREATE_VISITATION:
          state.visitationPhotoURLs = [
            ...state.visitationPhotoURLs,
            action.payload.photo,
          ];
          return;
        case CREATE_DEPOSIT:
          state.createDepositPhotoURLs = [
            ...state.createDepositPhotoURLs,
            action.payload.photo,
          ];
          return;
        case CREATE_SCHEDULE:
          state.createSchedulePhotoURLs = [
            ...state.createSchedulePhotoURLs,
            action.payload.photo,
          ];
          return;
        default:
          state.photoURLs = [...state.photoURLs, action.payload.photo];
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
          state.photoURLs = [];
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
          currentImages = state.photoURLs;
          currentImages.splice(action.payload.pos, 1);
          state.photoURLs = [...currentImages];
          return;
      }
    },
    setuploadedFilesResponse: (state, action) => {
      state.uploadedRequiredDocsResponse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postUploadFiles.fulfilled, (state, { payload }) => {});
  },
});

export const {
  setImageURLS,
  resetImageURLS,
  deleteImage,
  setuploadedFilesResponse,
} = cameraSlice.actions;

export default cameraSlice.reducer;
