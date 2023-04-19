import { createSlice } from '@reduxjs/toolkit';
import {
  getVisitationsList,
  postVisitation,
  putVisitationFlow,
} from '../async-thunks/productivityFlowThunks';
import { visitationListResponse, customerDataInterface } from '@/interfaces';
import { MarkedDates } from 'react-native-calendars/src/types';

type initialStateType = {
  visitationList: visitationListResponse[];
  isVisitationLoading: boolean;
  visitationCalendarMapped: { [key: string]: customerDataInterface[] };
  isPostVisitationLoading: boolean;
  markedDate: MarkedDates;
};

const initialState: initialStateType = {
  visitationList: [],
  isVisitationLoading: false,
  visitationCalendarMapped: {},
  isPostVisitationLoading: false,
  markedDate: {},
};

export const productivityFlowSlice = createSlice({
  name: 'productivityFlow',
  initialState,
  reducers: {
    resetStates: () => {
      return initialState;
    },
    setVisitationMapped: (state, { payload }) => {
      state.visitationCalendarMapped = payload;
    },
    setMarkedData: (state, { payload }) => {
      state.markedDate = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getVisitationsList.pending, (state) => {
      state.isVisitationLoading = true;
    });
    builder.addCase(getVisitationsList.fulfilled, (state, { payload }) => {
      state.isVisitationLoading = false;
    });
    builder.addCase(getVisitationsList.rejected, (state, { payload }) => {
      state.isVisitationLoading = false;
      //   state.visitationList = [];
    });
    builder.addCase(postVisitation.pending, (state) => {
      state.isPostVisitationLoading = true;
    });
    builder.addCase(postVisitation.fulfilled, (state) => {
      state.isPostVisitationLoading = false;
    });
    builder.addCase(postVisitation.rejected, (state) => {
      state.isPostVisitationLoading = false;
    });
    builder.addCase(putVisitationFlow.pending, (state) => {
      state.isPostVisitationLoading = true;
    });
    builder.addCase(putVisitationFlow.fulfilled, (state) => {
      state.isPostVisitationLoading = false;
    });
    builder.addCase(putVisitationFlow.rejected, (state) => {
      state.isPostVisitationLoading = false;
    });
  },
});

export const { resetStates, setVisitationMapped, setMarkedData } =
  productivityFlowSlice.actions;

export default productivityFlowSlice.reducer;
