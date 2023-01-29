//postUploadFiles
import { createSlice } from '@reduxjs/toolkit';
import { postUploadFiles } from '../async-thunks/commonThunks';
import { postVisitation } from '../async-thunks/productivityFlowThunks';

type initialStateType = {
  isUploadLoading: boolean;
  isPostVisitationLoading: boolean;
  uploadedFilesResponse: any[];
};

const initialState: initialStateType = {
  isUploadLoading: false,
  isPostVisitationLoading: false,
  uploadedFilesResponse: [],
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    resetStates: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postUploadFiles.pending, (state) => {
      state.isUploadLoading = true;
    });
    builder.addCase(postUploadFiles.fulfilled, (state, { payload }) => {
      state.isUploadLoading = false;
      state.uploadedFilesResponse = payload;
    });
    builder.addCase(postUploadFiles.rejected, (state) => {
      state.isUploadLoading = false;
    });

    builder.addCase(postVisitation.fulfilled, (state) => {
      state.uploadedFilesResponse = [];
    });
  },
});

export const { resetStates } = commonSlice.actions;
export default commonSlice.reducer;
