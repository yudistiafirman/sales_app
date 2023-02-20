import { createAsyncThunk } from '@reduxjs/toolkit';
import { postSph } from '@/actions/OrderActions';
import { postSphResponseType, sphOrderPayloadType } from '@/interfaces';
import { customLog } from '@/utils/generalFunc';

type errorType = {
  success: boolean;
  error: {
    status: number;
    code: string;
    message: string;
  };
};

export const postOrderSph = createAsyncThunk<
  { sph: postSphResponseType },
  { payload: sphOrderPayloadType }
>('order/postOrderSph', async ({ payload }, { rejectWithValue }) => {
  try {
    const response = await postSph(payload);
    const { data } = response;

    if (data.error) throw data as errorType;

    return data.data;
  } catch (error) {
    customLog(error, 'plainerrorpostOrderSph');

    customLog(error.message, 'erroratpostOrderSph');

    customLog(error?.response?.data, 'error at', 'common/postOrderSph');
    return rejectWithValue(error.message);
  }
});
