import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { postUploadFiles } from '../async-thunks/commonThunks';
import { requiredDocType } from '@/interfaces';

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
  uploadedFilesResponse: fileResponse[];
  uploadedRequiredDocsResponse: requiredDocType[];
}

const initialState: MainState = {
  photoURLs: [],
  uploadedFilesResponse: [],
  uploadedRequiredDocsResponse: [],
};

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setImageURLS: (state, action: PayloadAction<photoType>) => {
      return {
        ...state,
        photoURLs: [...state.photoURLs, action.payload],
      };
    },
    resetImageURLS: (state) => {
      state.photoURLs = [];
    },
    deleteImage: (state, action: PayloadAction<{ pos: number }>) => {
      const currentImages = state.photoURLs;
      currentImages.splice(action.payload.pos, 1);
      state.photoURLs = [...currentImages];
    },
    // setRequiredDocsResponse: (
    //   state,
    //   action: PayloadAction<{ uploadedResponse: requiredDocType[] }>
    // ) => {
    //   state.uploadedRequiredDocsResponse = action.payload.uploadedResponse;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(postUploadFiles.fulfilled, (state, { payload }) => {
      if (payload) {
        state.uploadedFilesResponse = payload.map((photo) => {
          const photoName = `${photo.name}.${photo.type}`;
          const foundObject = state.photoURLs.find(
            (obj) => obj.photo.name === photoName
          );
          if (foundObject) {
            return {
              id: photo.id,
              type: foundObject.type,
            };
          }
        });
      }
    });
  },
});

export const { setImageURLS, resetImageURLS, deleteImage } =
  cameraSlice.actions;

export default cameraSlice.reducer;
