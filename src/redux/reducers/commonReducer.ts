// postUploadFiles
import { createSlice } from "@reduxjs/toolkit";
import { postUploadFiles, getAllProject } from "../async-thunks/commonThunks";

type InitialStateType = {
    isUploadLoading: boolean;
    isPostVisitationLoading: boolean;
    isProjectLoading: boolean;
    errorGettingProject: boolean;
    errorGettingProjectMessage: string | unknown;
    projects: any[];
};

const initialState: InitialStateType = {
    isUploadLoading: false,
    isPostVisitationLoading: false,
    isProjectLoading: false,
    errorGettingProject: false,
    errorGettingProjectMessage: "",
    projects: []
};

export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        resetStates: () => initialState,
        retrying: (state) => ({
            ...state,
            isProjectLoading: true,
            errorGettingProject: false,
            errorGettingProjectMessage: ""
        })
    },
    extraReducers: (builder) => {
        builder.addCase(postUploadFiles.pending, (state) => ({
            ...state,
            isUploadLoading: true
        }));
        builder.addCase(postUploadFiles.fulfilled, (state) => ({
            ...state,
            isUploadLoading: false
        }));
        builder.addCase(postUploadFiles.rejected, (state) => ({
            ...state,
            isUploadLoading: false
        }));
        builder.addCase(getAllProject.pending, (state) => ({
            ...state,
            isProjectLoading: true
        }));
        builder.addCase(getAllProject.fulfilled, (state, { payload }) => ({
            ...state,
            errorGettingProject: false,
            projects: payload || state.projects,
            isProjectLoading: false
        }));
        builder.addCase(getAllProject.rejected, (state, { payload }) => ({
            ...state,
            isProjectLoading: false,
            errorGettingProjectMessage: payload,
            errorGettingProject: true
        }));
    }
});

export const { resetStates, retrying } = commonSlice.actions;
export default commonSlice.reducer;
