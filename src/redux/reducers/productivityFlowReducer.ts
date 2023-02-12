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
      // if (payload) {
      //   state.visitationCalendarMapped = payload.reduce(
      //     (
      //       acc: { [key: string]: customerDataInterface[] },
      //       obj: visitationListResponse
      //     ) => {
      //       const formatedDate = moment(obj.dateVisit).format('yyyy-MM-DD');
      //       console.log(formatedDate, obj.dateVisit, 'dateVisit77');

      //       if (!acc[formatedDate]) {
      //         acc[formatedDate] = [];
      //       }
      //       acc[formatedDate].push({
      //         display_name: obj.project?.company?.displayName,
      //         name: obj.project?.name,
      //         // location: obj.project.locationAddress.district,
      //         email: obj.project?.pic?.email,
      //         phone: obj.project?.pic?.phone,
      //         position: obj.project?.pic?.position,
      //         type: obj.project?.pic?.type,
      //       });
      //       return acc;
      //     },
      //     {}
      //   );
      //   state.visitationList = payload;
      // }
      state.isVisitationLoading = false;
    });
    builder.addCase(getVisitationsList.rejected, (state, { payload }) => {
      state.isVisitationLoading = false;
      console.log(payload, 'error at reducer', 'getVisitationsList.rejected');
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
