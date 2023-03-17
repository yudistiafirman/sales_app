import {
  billingAddressType,
  chosenProductType,
  PIC,
  requiredDocType,
  selectedCompanyInterface,
  SphStateInterface,
} from '@/interfaces';
import { createSlice } from '@reduxjs/toolkit';

type updateBillAddressType = Pick<
  billingAddressType,
  'name' | 'phone' | 'fullAddress'
>;

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
  useHighway: false,
  uploadedAndMappedRequiredDocs: [],
  stepSPHOneFinished: false,
  stepSPHTwoFinished: false,
  stepSPHThreeFinished: false,
  stepSPHFourFinished: false,
  stepperSPHShouldNotFocused: false,
};

export const sphSlice = createSlice({
  name: 'sphstate',
  initialState,
  reducers: {
    resetFocusedStepperFlag: (state) => {
      state.stepperSPHShouldNotFocused = false;
    },
    resetSPHState: () => {
      return initialState;
    },
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
    updateSelectedCompany: (
      state,
      { payload }: { payload: selectedCompanyInterface }
    ) => {
      state.selectedCompany = payload;
    },
    updateSelectedCompanyPicList: (state, { payload }: { payload: PIC[] }) => {
      if (state.selectedCompany) {
        if (payload.length === 1) {
          payload[0].isSelected = true;
        }
        state.selectedCompany.PIC = payload;
      }
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
      {
        payload,
      }: { payload: { value: string; key: keyof updateBillAddressType } }
    ) => {
      const { value, key } = payload;
      state.billingAddress[key] = value;
    },
    updateBillingAddressAutoComplete: (
      state,
      { payload }: { payload: { [key: string]: any } }
    ) => {
      state.billingAddress.addressAutoComplete = payload;
    },
    updateDistanceFromLegok: (state, { payload }: { payload: number }) => {
      state.distanceFromLegok = payload;
    },
    updatePaymentType: (state, { payload }: { payload: 'CBD' | 'CREDIT' }) => {
      state.paymentType = payload;
    },
    updateRequiredDocuments: (
      state,
      { payload }: { payload: { [key: string]: any } }
    ) => {
      state.paymentRequiredDocuments = payload;
    },
    updatePaymentBankGuarantee: (state, { payload }: { payload: boolean }) => {
      if (typeof payload === 'boolean') {
        state.paymentBankGuarantee = payload;
      }
    },
    updateChosenProducts: (
      state,
      { payload }: { payload: chosenProductType[] }
    ) => {
      state.chosenProducts = payload;
    },
    updateUseHighway: (state, { payload }: { payload: boolean }) => {
      state.useHighway = payload;
    },
    updateUploadedAndMappedRequiredDocs: (
      state,
      { payload }: { payload: requiredDocType[] }
    ) => {
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
} = sphSlice.actions;
export default sphSlice.reducer;
