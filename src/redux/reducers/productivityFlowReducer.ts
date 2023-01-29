import { createSlice } from '@reduxjs/toolkit';
import {
  getVisitationsList,
  postVisitation,
} from '../async-thunks/productivityFlowThunks';
import moment from 'moment';
import { visitationListResponse, customerDataInterface } from '@/interfaces';

type initialStateType = {
  visitationList: visitationListResponse[];
  isVisitationLoading: boolean;
  visitationCalendarMapped: { [key: string]: customerDataInterface[] };
  isPostVisitationLoading: boolean;
};

const initialState: initialStateType = {
  visitationList: [],
  isVisitationLoading: false,
  visitationCalendarMapped: {},
  isPostVisitationLoading: false,
};

export const productivityFlowSlice = createSlice({
  name: 'productivityFlow',
  initialState,
  reducers: {
    resetStates: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getVisitationsList.pending, (state) => {
      state.isVisitationLoading = true;
    });
    builder.addCase(getVisitationsList.fulfilled, (state, { payload }) => {
      if (payload) {
        state.visitationCalendarMapped = payload.reduce(
          (
            acc: { [key: string]: customerDataInterface[] },
            obj: visitationListResponse
          ) => {
            const formatedDate = moment(obj.date_visit).format('yyyy-MM-DD');
            if (!acc[formatedDate]) {
              acc[formatedDate] = [];
            }
            acc[formatedDate].push({
              display_name: obj.display_name,
              name: obj.name,
              email: obj.email,
              phone: obj.phone,
              position: obj.position,
              type: obj.type,
            });
            return acc;
          },
          {}
        );
        state.visitationList = payload;
      }
      state.isVisitationLoading = false;
    });
    builder.addCase(getVisitationsList.rejected, (state, { payload }) => {
      state.isVisitationLoading = false;
      console.log(payload, 'error at', 'getVisitationsList.rejected');
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
  },
});

export const { resetStates } = productivityFlowSlice.actions;

export default productivityFlowSlice.reducer;
