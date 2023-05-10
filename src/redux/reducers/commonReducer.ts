// postUploadFiles
import { createSlice } from '@reduxjs/toolkit';
import { postUploadFiles, getAllProject } from '../async-thunks/commonThunks';

type initialStateType = {
  isUploadLoading: boolean;
  isPostVisitationLoading: boolean;
  isProjectLoading: boolean;
  errorGettingProject: boolean;
  errorGettingProjectMessage: string | unknown;
  projects: any[];
};

const initialState: initialStateType = {
  isUploadLoading: false,
  isPostVisitationLoading: false,
  isProjectLoading: false,
  errorGettingProject: false,
  errorGettingProjectMessage: '',
  projects: [],
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    resetStates: () => initialState,
    retrying: state => ({
      ...state,
      isProjectLoading: true,
      errorGettingProject: false,
      errorGettingProjectMessage: '',
    }),
  },
  extraReducers: builder => {
    builder.addCase(postUploadFiles.pending, state => {
      state.isUploadLoading = true;
    });
    builder.addCase(postUploadFiles.fulfilled, state => {
      state.isUploadLoading = false;
    });
    builder.addCase(postUploadFiles.rejected, state => {
      state.isUploadLoading = false;
    });
    builder.addCase(getAllProject.pending, state => {
      state.isProjectLoading = true;
    });
    builder.addCase(getAllProject.fulfilled, (state, { payload }) => {
      state.errorGettingProject = false;
      if (payload) {
        state.projects = payload;
      }
      state.isProjectLoading = false;
    });
    builder.addCase(getAllProject.rejected, (state, { payload }) => ({
      ...state,
      isProjectLoading: false,
      errorGettingProjectMessage: payload,
      errorGettingProject: true,
    }));
  },
});

export const { resetStates, retrying } = commonSlice.actions;
export default commonSlice.reducer;
