import { getVisitations, postVisitations } from '@/actions/ProductivityActions';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { visitationListResponse } from '@/interfaces';
import { payloadPostType } from '@/interfaces';

type paramType = {
  month: number;
  year: number;
};

type errorType = {
  success: boolean;
  error: {
    status: number;
    code: string;
    message: string;
  };
};

export const getVisitationsList = createAsyncThunk<
  visitationListResponse[],
  paramType,
  {
    rejectValue: errorType;
  }
>(
  'productivityFlow/getVisitations',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const { data } = await getVisitations({ month, year });
      if (data.error) throw data as errorType;
      return data.data as visitationListResponse[];
    } catch (error) {
      console.log(error, 'error at', 'productivityFlow/getVisitations');
      return rejectWithValue(error as errorType);
    }
  }
);

export const postVisitation = createAsyncThunk<
  any,
  { payload: payloadPostType },
  {
    rejectValue: errorType;
  }
>(
  'productivityFlow/postVisitation',
  async ({ payload }, { rejectWithValue }) => {
    try {
      const { data } = await postVisitations({ payload });
      console.log('====================================');
      console.log(data);
      console.log('==================================== postVisitation');
      if (data.error) throw data as errorType;
      return data.data;
    } catch (error) {
      console.log(error, 'error at', 'productivityFlow/getVisitations');
      return rejectWithValue(error as errorType);
    }
  }
);
