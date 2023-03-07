import {
  CreateVisitationFirstStep,
  CreateVisitationFourthStep,
  CreateVisitationSecondStep,
  CreateVisitationThirdStep,
} from '@/interfaces';
import { createSlice } from '@reduxjs/toolkit';

export interface VisitationGlobalState {
  step: number;
  shouldScrollView: boolean;
  stepOne: CreateVisitationFirstStep;
  stepTwo: CreateVisitationSecondStep;
  stepThree: CreateVisitationThirdStep;
  stepFour: CreateVisitationFourthStep;
  existingVisitationId: string | null;
}

const initialState: VisitationGlobalState = {
  step: 0,
  shouldScrollView: true,
  stepOne: {
    createdLocation: {
      lat: 0,
      lon: 0,
      postalId: undefined,
      formattedAddress: '',
    },
    locationAddress: {
      lat: 0,
      lon: 0,
      postalId: undefined,
      formattedAddress: '',
      line2: '',
    },
    existingLocationId: '',
  },
  stepTwo: {
    companyName: '',
    location: {},
    pics: [],
    projectName: '',
    options: {
      items: null,
      loading: false,
    },
    projectId: '',
  },
  stepThree: {
    estimationDate: {
      estimationMonth: null,
      estimationWeek: null,
    },
    notes: '',
    products: [],
  },
  stepFour: {
    selectedDate: null,
    images: [],
    kategoriAlasan: null,
    alasanPenolakan: '',
  },
  existingVisitationId: null,
};

export const visitationSlice = createSlice({
  name: 'visitation',
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    updateShouldScrollView: (state, { payload }: { payload: boolean }) => {
      state.shouldScrollView = payload;
    },
    updateExistingVisitationID: (state, { payload }: { payload: string }) => {
      state.existingVisitationId = payload;
    },
    updateCurrentStep: (state, { payload }) => {
      state.step = payload;
    },
    updateStepOne: (
      state,
      { payload }: { payload: CreateVisitationFirstStep }
    ) => {
      state.stepOne = payload;
    },
    updateStepTwo: (
      state,
      { payload }: { payload: CreateVisitationSecondStep }
    ) => {
      state.stepTwo = payload;
    },
    updateStepThree: (
      state,
      { payload }: { payload: CreateVisitationThirdStep }
    ) => {
      state.stepThree = payload;
    },
    updateStepFour: (
      state,
      { payload }: { payload: CreateVisitationFourthStep }
    ) => {
      state.stepFour = payload;
    },
  },
});

export const {
  resetState,
  updateShouldScrollView,
  updateExistingVisitationID,
  updateCurrentStep,
  updateStepOne,
  updateStepTwo,
  updateStepThree,
  updateStepFour,
} = visitationSlice.actions;
export default visitationSlice.reducer;
