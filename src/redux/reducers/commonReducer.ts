//postUploadFiles
import { createSlice } from '@reduxjs/toolkit';
import { postUploadFiles } from '../async-thunks/commonThunks';

type initialStateType = {
  isUploadLoading: boolean;
  isPostVisitationLoading: boolean;
  // uploadedFilesResponse: any[];
};

const initialState: initialStateType = {
  isUploadLoading: false,
  isPostVisitationLoading: false,
  // uploadedFilesResponse: [],
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
    });
    builder.addCase(postUploadFiles.rejected, (state) => {
      state.isUploadLoading = false;
    });
  },
});

export const { resetStates } = commonSlice.actions;
export default commonSlice.reducer;
