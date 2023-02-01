//postUploadFiles
import { createSlice } from '@reduxjs/toolkit';
import { postUploadFiles, getAllProject } from '../async-thunks/commonThunks';

type initialStateType = {
  isUploadLoading: boolean;
  isPostVisitationLoading: boolean;
  isProjectLoading: boolean;
  projects: any[];
};

const initialState: initialStateType = {
  isUploadLoading: false,
  isPostVisitationLoading: false,
  isProjectLoading: false,
  projects: [],
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
    builder.addCase(getAllProject.pending, (state) => {
      state.isProjectLoading = true;
    });
    builder.addCase(getAllProject.fulfilled, (state, { payload }) => {
      state.projects = payload;
      state.isProjectLoading = false;
    });
    builder.addCase(getAllProject.rejected, (state) => {
      state.isProjectLoading = true;
    });
  },
});

export const { resetStates } = commonSlice.actions;
export default commonSlice.reducer;
