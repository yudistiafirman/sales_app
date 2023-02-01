import { createAsyncThunk } from '@reduxjs/toolkit';
import { allVisitationGet, uploadFileImage } from '@/actions/CommonActions';

type errorType = {
  success: boolean;
  error: {
    status: number;
    code: string;
    message: string;
  };
};

export const postUploadFiles = createAsyncThunk<
  any,
  { files: any[]; from: string },
  {
    rejectValue: string;
  }
>('common/postUploadFiles', async ({ files, from }, { rejectWithValue }) => {
  try {
    const response = await uploadFileImage(files, from);

    const { data } = response;
    if (data.error) throw data as errorType;

    return data.data;
  } catch (error) {
    console.log(error?.response?.data, 'error at', 'common/postUploadFiles');
    return rejectWithValue(error.message);
  }
});

export const getAllProject = createAsyncThunk(
  'common/getAllProject',
  async (search?: string) => {
    try {
      const response = await allVisitationGet(search);
      const { data } = response;
      if (data.error) throw data as errorType;

      return data.data;
    } catch (error) {
      console.log(error?.response?.data, 'error at', 'common/postUploadFiles');
      return rejectWithValue(error.message);
    }
  }
);
