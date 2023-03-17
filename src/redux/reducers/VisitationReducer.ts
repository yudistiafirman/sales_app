import {
  Address,
  CreateVisitationFirstStep,
  CreateVisitationFourthStep,
  CreateVisitationSecondStep,
  CreateVisitationThirdStep,
  PIC,
} from '@/interfaces';
import { createSlice } from '@reduxjs/toolkit';

export interface VisitationGlobalState {
  step: number;
  shouldScrollView: boolean;
  createdLocation: Address;
  locationAddress: Address;
  existingLocationId?: string;
  companyName: string;
  customerType?: 'INDIVIDU' | 'COMPANY';
  projectName: string;
  projectId?: string;
  location: { [key: string]: any };
  pics: PIC[];
  options: {
    loading: boolean;
    items: { title: string; id: string }[] | null;
  };
  visitationId?: string;
  existingOrderNum?: number;
  stageProject?: 'LAND_PREP' | 'FOUNDATION' | 'FORMWORK' | 'FINISHING';
  products: any[];
  estimationDate: {
    estimationWeek: number | null;
    estimationMonth: number | null;
  };
  paymentType?: 'CBD' | 'CREDIT';
  notes: string;
  selectedDate: any;
  images: any[];
  kategoriAlasan?: 'FINISHED' | 'MOU_COMPETITOR';
  alasanPenolakan: string;
  existingVisitationId: string | null;
  stepOneFinished: boolean;
  stepTwoFinished: boolean;
  stepThreeFinished: boolean;
  stepperShouldNotFocused: boolean;
}

const initialState: VisitationGlobalState = {
  step: 0,
  shouldScrollView: true,
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
  companyName: '',
  location: {},
  pics: [],
  projectName: '',
  options: {
    items: null,
    loading: false,
  },
  projectId: '',
  estimationDate: {
    estimationMonth: null,
    estimationWeek: null,
  },
  notes: '',
  products: [],
  selectedDate: null,
  images: [],
  kategoriAlasan: null,
  alasanPenolakan: '',
  existingVisitationId: null,
  stepOneFinished: false,
  stepTwoFinished: false,
  stepThreeFinished: false,
  stepperShouldNotFocused: false,
};

export const visitationSlice = createSlice({
  name: 'visitation',
  initialState,
  reducers: {
    resetVisitationState: () => {
      return initialState;
    },
    resetFocusedStepperFlag: (state) => {
      state.stepperShouldNotFocused = false;
    },
    setStepperFocused: (state, { payload }) => {
      state.stepperShouldNotFocused = true;
      switch (payload) {
        case 1:
          state.stepOneFinished = true;
          break;
        case 2:
          state.stepTwoFinished = true;
          break;
        case 3:
          state.stepThreeFinished = true;
          break;
      }
    },
    resetStepperFocused: (state, { payload }) => {
      state.stepperShouldNotFocused = true;
      switch (payload) {
        case 1:
          state.stepOneFinished = false;
          break;
        case 2:
          state.stepTwoFinished = false;
          break;
        case 3:
          state.stepThreeFinished = false;
          break;
      }
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
    updateDataVisitation: (
      state,
      { payload }: { payload: { type: any; value: any } }
    ) => {
      switch (payload.type) {
        case 'createdLocation':
          state.createdLocation = payload.value;
          break;
        case 'locationAddress':
          state.locationAddress = payload.value;
          break;
        case 'existingLocationId':
          state.existingLocationId = payload.value;
          break;
        case 'companyName':
          state.companyName = payload.value;
          break;
        case 'customerType':
          state.customerType = payload.value;
          break;
        case 'projectName':
          state.projectName = payload.value;
          break;
        case 'projectId':
          state.projectId = payload.value;
          break;
        case 'location':
          state.location = payload.value;
          break;
        case 'pics':
          state.pics = payload.value;
          break;
        case 'options':
          state.options = payload.value;
          break;
        case 'visitationId':
          state.visitationId = payload.value;
          break;
        case 'existingOrderNum':
          state.existingOrderNum = payload.value;
          break;
        case 'stageProject':
          state.stageProject = payload.value;
          break;
        case 'products':
          state.products = payload.value;
          break;
        case 'estimationDate':
          state.estimationDate = payload.value;
          break;
        case 'paymentType':
          state.paymentType = payload.value;
          break;
        case 'notes':
          state.notes = payload.value;
          break;
        case 'selectedDate':
          state.selectedDate = payload.value;
          break;
        case 'images':
          state.images = payload.value;
          break;
        case 'kategoriAlasan':
          state.kategoriAlasan = payload.value;
          break;
        case 'alasanPenolakan':
          state.alasanPenolakan = payload.value;
          break;
      }
    },
    // updateStepOne: (
    //   state,
    //   { payload }: { payload: CreateVisitationFirstStep }
    // ) => {
    //   state.stepOne = payload;
    // },
    // updateStepTwo: (
    //   state,
    //   { payload }: { payload: CreateVisitationSecondStep }
    // ) => {
    //   state.stepTwo = payload;
    // },
    // updateStepThree: (
    //   state,
    //   { payload }: { payload: CreateVisitationThirdStep }
    // ) => {
    //   state.stepThree = payload;
    // },
    // updateStepFour: (
    //   state,
    //   { payload }: { payload: CreateVisitationFourthStep }
    // ) => {
    //   state.stepFour = payload;
    // },
  },
});

export const {
  resetVisitationState,
  updateShouldScrollView,
  updateExistingVisitationID,
  updateCurrentStep,
  // updateStepOne,
  // updateStepTwo,
  // updateStepThree,
  // updateStepFour,
  updateDataVisitation,
  resetFocusedStepperFlag,
  setStepperFocused,
  resetStepperFocused,
} = visitationSlice.actions;
export default visitationSlice.reducer;
