import { LocalFileType } from '@/interfaces/LocalFileType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface inputsValue {
  recepientName: string;
  recepientPhoneNumber: string;
  truckMixCondition: string;
  truckMixHaveLoad: boolean;
  weightBridge: string;
}

export interface OperationProjectDetails {
  deliveryOrderId: string;
  projectName: string;
  address?: string;
  lonlat: { longitude: number; latitude: number };
  requestedQuantity: number;
  deliveryTime: string;
  doNumber: string;
}

export interface operationInitState {
  photoFiles: LocalFileType[];
  inputsValue: inputsValue;
  projectDetails: OperationProjectDetails;
  isLoading: boolean;
}

const initialState: operationInitState = {
  photoFiles: [],
  inputsValue: {
    recepientName: '',
    recepientPhoneNumber: '',
    truckMixCondition: '',
    weightBridge: '',
    truckMixHaveLoad: false,
  },
  projectDetails: {
    deliveryOrderId: '',
    projectName: '',
    doNumber: '',
    address: '',
    lonlat: { longitude: 0, latitude: 0 },
    requestedQuantity: 0,
    deliveryTime: '',
  },
  isLoading: false,
};
export const operationSlice = createSlice({
  name: 'operationState',
  initialState,
  reducers: {
    resetOperationState: () => {
      return initialState;
    },
    resetInputsValue: (state) => {
      state.inputsValue = {
        recepientName: '',
        recepientPhoneNumber: '',
        truckMixCondition: '',
        weightBridge: '',
        truckMixHaveLoad: false,
      };
    },
    onChangeInputValue: (
      state,
      actions: PayloadAction<{ inputType: keyof inputsValue; value: string }>
    ) => {
      state.inputsValue = {
        ...state.inputsValue,
        [actions.payload.inputType]: actions.payload.value,
      };
    },
    onChangeProjectDetails: (
      state,
      actions: PayloadAction<{ projectDetails: OperationProjectDetails }>
    ) => {
      state.projectDetails = actions.payload.projectDetails;
    },
    setOperationPhoto: (
      state,
      actions: PayloadAction<{ file: LocalFileType; withoutAddButton: boolean }>
    ) => {
      let currentImages = [...state.photoFiles];
      if (actions.payload.withoutAddButton)
        currentImages = currentImages.filter((it) => it.file !== null);
      currentImages.push(actions.payload.file);
      state.photoFiles = [...currentImages];
    },
    setAllOperationPhoto: (
      state,
      actions: PayloadAction<{ file: LocalFileType[] }>
    ) => {
      state.photoFiles = [...actions.payload.file];
    },
    removeOperationPhoto: (
      state,
      actions: PayloadAction<{ index: number }>
    ) => {
      let currentImages = state.photoFiles.filter((it) => it.file !== null);
      currentImages.splice(actions.payload.index, 1);
      currentImages.unshift({ file: null });
      state.photoFiles = [...currentImages];
    },
  },
});

export const {
  resetOperationState,
  resetInputsValue,
  onChangeInputValue,
  onChangeProjectDetails,
  setOperationPhoto,
  setAllOperationPhoto,
  removeOperationPhoto,
} = operationSlice.actions;

export default operationSlice.reducer;
