import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  billingAddressType,
  chosenProductType,
  PIC,
  requiredDocType,
  selectedCompanyInterface,
  SphStateInterface,
} from '@/interfaces';

type updateBillAddressType = Pick<billingAddressType, 'name' | 'phone' | 'fullAddress'>;

const initialState: SphStateInterface = {
  selectedCompany: null,
  selectedPic: null,
  projectAddress: null,
  isBillingAddressSame: false,
  billingAddress: {
    name: '',
    phone: '',
    addressAutoComplete: {},
    fullAddress: '',
  },
  distanceFromLegok: null,
  paymentType: '',
  paymentRequiredDocuments: {},
  paymentDocumentsFullfilled: false,
  paymentBankGuarantee: false,
  chosenProducts: [],
  useHighway: true,
  uploadedAndMappedRequiredDocs: [],
  stepSPHOneFinished: false,
  stepSPHTwoFinished: false,
  stepSPHThreeFinished: false,
  stepSPHFourFinished: false,
  stepperSPHShouldNotFocused: false,
  useSearchAddress: false,
  searchedAddress: '',
  searchedBillingAddress: '',
  useSearchedBillingAddress: false,
};

export const sphSlice = createSlice({
  name: 'sphstate',
  initialState,
  reducers: {
    resetFocusedStepperFlag: state => {
      state.stepperSPHShouldNotFocused = false;
    },
    setUseSearchAddress: (state, actions: PayloadAction<{ value: boolean }>) => {
      state.useSearchAddress = actions.payload.value;
    },
    setSearchAddress: (state, actions: PayloadAction<{ value: string }>) => {
      state.searchedAddress = actions.payload.value;
    },
    setUseBillingAddress: (state, actions: PayloadAction<{ value: boolean }>) => {
      state.useSearchedBillingAddress = actions.payload.value;
    },
    setSearchedBillingAddress: (state, actions: PayloadAction<{ value: string }>) => {
      state.searchedBillingAddress = actions.payload.value;
    },
    resetSPHState: () => initialState,
    setStepperFocused: (state, { payload }) => {
      state.stepperSPHShouldNotFocused = true;
      switch (payload) {
        case 1:
          state.stepSPHOneFinished = true;
          break;
        case 2:
          state.stepSPHTwoFinished = true;
          break;
        case 3:
          state.stepSPHThreeFinished = true;
          break;
        case 4:
          state.stepSPHFourFinished = true;
          break;
      }
    },
    resetStepperFocused: (state, { payload }) => {
      state.stepperSPHShouldNotFocused = true;
      switch (payload) {
        case 1:
          state.stepSPHOneFinished = false;
          break;
        case 2:
          state.stepSPHTwoFinished = false;
          break;
        case 3:
          state.stepSPHThreeFinished = false;
          break;
        case 4:
          state.stepSPHFourFinished = false;
          break;
      }
    },
    updateProjectAddress: (state, { payload }) => {
      state.projectAddress = payload;
    },
    updateSelectedCompany: (state, { payload }: { payload: selectedCompanyInterface }) => {
      console.log(payload);
      console.log(payload?.Pic, 'c');
      console.log(payload?.Pics, 'cs');
      state.selectedCompany = payload;
    },
    updateSelectedCompanyPicList: (state, { payload }: { payload: PIC[] }) => {
      state.selectedCompany = {
        ...state.selectedCompany,
        Pics: payload,
      };
    },
    updateSelectedPic: (state, { payload }: { payload: PIC }) => {
      state.selectedPic = payload;
    },
    updateIsBillingAddressSame: (state, { payload }: { payload: boolean }) => {
      if (typeof payload === 'boolean') {
        state.isBillingAddressSame = payload;
      }
    },
    updateBillingAddressOptions: (
      state,
      { payload }: { payload: { value: string; key: keyof updateBillAddressType } }
    ) => {
      const { value, key } = payload;
      state.billingAddress[key] = value;
    },
    updateBillingAddressAutoComplete: (state, { payload }: { payload: { [key: string]: any } }) => {
      state.billingAddress.addressAutoComplete = payload;
    },
    updateDistanceFromLegok: (state, { payload }: { payload: number }) => {
      state.distanceFromLegok = payload;
    },
    updatePaymentType: (state, { payload }: { payload: 'CBD' | 'CREDIT' }) => {
      state.paymentType = payload;
    },
    updateRequiredDocuments: (state, { payload }: { payload: { [key: string]: any } }) => {
      state.paymentRequiredDocuments = payload;
    },
    updatePaymentBankGuarantee: (state, { payload }: { payload: boolean }) => {
      if (typeof payload === 'boolean') {
        state.paymentBankGuarantee = payload;
      }
    },
    updateChosenProducts: (state, { payload }: { payload: chosenProductType[] }) => {
      state.chosenProducts = payload;
    },
    updateUseHighway: (state, { payload }: { payload: boolean }) => {
      state.useHighway = payload;
    },
    updateUploadedAndMappedRequiredDocs: (state, { payload }: { payload: requiredDocType[] }) => {
      state.uploadedAndMappedRequiredDocs = payload;
    },
  },
});

export const {
  updateSelectedCompany,
  updateProjectAddress,
  updateSelectedCompanyPicList,
  updateSelectedPic,
  updateIsBillingAddressSame,
  updateBillingAddressOptions,
  updateBillingAddressAutoComplete,
  updateDistanceFromLegok,
  updatePaymentType,
  updateRequiredDocuments,
  updatePaymentBankGuarantee,
  updateChosenProducts,
  updateUseHighway,
  updateUploadedAndMappedRequiredDocs,
  resetSPHState,
  setStepperFocused,
  resetStepperFocused,
  resetFocusedStepperFlag,
  setUseSearchAddress,
  setSearchAddress,
  setUseBillingAddress,
  setSearchedBillingAddress,
  onChangeMethod,
} = sphSlice.actions;
export default sphSlice.reducer;
