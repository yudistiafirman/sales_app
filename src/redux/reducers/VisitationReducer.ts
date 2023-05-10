import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address, Competitor, PIC } from '@/interfaces';

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
  typeProject?:
  | 'INFRASTRUKTUR'
  | 'HIGH-RISE'
  | 'RUMAH'
  | 'KOMERSIAL'
  | 'INDUSTRIAL';
  products: any[];
  estimationDate: {
    estimationWeek: number | null;
    estimationMonth: number | null;
  };
  competitors: Competitor[];
  currentCompetitor: Competitor;
  paymentType?: 'CBD' | 'CREDIT';
  notes: string;
  selectedDate: any;
  images: any[];
  kategoriAlasan?: 'FINISHED' | 'MOU_COMPETITOR';
  alasanPenolakan: string;
  existingVisitationId: string | null;
  stepOneVisitationFinished: boolean;
  stepTwoVisitationFinished: boolean;
  stepThreeVisitationFinished: boolean;
  stepperVisitationShouldNotFocused: boolean;
  isSearchProject: boolean;
  searchQuery: string;
  useSearchedAddress: boolean;
  searchedAddress: string;
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
  currentCompetitor: {
    name: '',
    mou: '',
    exclusive: '',
    hope: '',
    problem: '',
  },
  existingLocationId: '',
  companyName: '',
  location: {},
  competitors: [],
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
  images: [{ file: null }],
  kategoriAlasan: undefined,
  alasanPenolakan: '',
  existingVisitationId: null,
  stepOneVisitationFinished: false,
  stepTwoVisitationFinished: false,
  stepThreeVisitationFinished: false,
  stepperVisitationShouldNotFocused: false,
  isSearchProject: false,
  searchQuery: '',
  useSearchedAddress: false,
  searchedAddress: '',
};

export const visitationSlice = createSlice({
  name: 'visitation',
  initialState,
  reducers: {
    resetVisitationState: () => initialState,
    resetFocusedStepperFlag: (state) => {
      state.stepperVisitationShouldNotFocused = false;
    },
    setStepperFocused: (state, { payload }) => {
      state.stepperVisitationShouldNotFocused = true;
      switch (payload) {
        case 1:
          state.stepOneVisitationFinished = true;
          break;
        case 2:
          state.stepTwoVisitationFinished = true;
          break;
        case 3:
          state.stepThreeVisitationFinished = true;
          break;
      }
    },
    resetAllStepperFocused: (state) => {
      state.stepperVisitationShouldNotFocused = true;
      state.stepOneVisitationFinished = false;
      state.stepTwoVisitationFinished = false;
      state.stepThreeVisitationFinished = false;
    },
    resetStepperFocused: (state, { payload }) => {
      state.stepperVisitationShouldNotFocused = true;
      switch (payload) {
        case 1:
          state.stepOneVisitationFinished = false;
          break;
        case 2:
          state.stepTwoVisitationFinished = false;
          break;
        case 3:
          state.stepThreeVisitationFinished = false;
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
    setSearchProject: (state, { payload }) => {
      state.isSearchProject = payload;
    },
    setSearchQuery: (state, { payload }) => {
      state.searchQuery = payload;
    },
    deleteImagesVisitation: (
      state,
      actions: PayloadAction<{ value: number }>,
    ) => {
      const filteredImages = state.images.filter(
        (v, i) => i !== actions.payload.value,
      );
      state.images = filteredImages;
    },
    setUseSearchedAddress: (
      state,
      actions: PayloadAction<{ value: boolean }>,
    ) => {
      state.useSearchedAddress = actions.payload.value;
    },
    setSearchedAddress: (state, actions: PayloadAction<{ value: string }>) => {
      state.searchedAddress = actions.payload.value;
    },
    updateDataVisitation: (
      state,
      { payload }: { payload: { type: any; value: any } },
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
        case 'competitors':
          state.competitors = payload.value;
          break;
        case 'currentCompetitor':
          state.currentCompetitor = payload.value;
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
        case 'typeProject':
          state.typeProject = payload.value;
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
  },
});

export const {
  resetVisitationState,
  updateShouldScrollView,
  updateExistingVisitationID,
  updateCurrentStep,
  updateDataVisitation,
  resetFocusedStepperFlag,
  setStepperFocused,
  resetStepperFocused,
  resetAllStepperFocused,
  setSearchProject,
  setSearchQuery,
  deleteImagesVisitation,
  setSearchedAddress,
  setUseSearchedAddress,
} = visitationSlice.actions;
export default visitationSlice.reducer;
