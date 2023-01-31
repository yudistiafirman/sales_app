import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadFile } from '@/actions/CommonActions';

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
  { files: any[] },
  {
    rejectValue: errorType;
  }
>('common/postUploadFiles', async ({ files }, { rejectWithValue }) => {
  try {
    const { data } = await uploadFile(files);
    if (data.error) throw data as errorType;
    console.log(data, 'common/postUploadFiles');

    return data.data;
  } catch (error) {
    console.log(error, 'error at', 'common/postUploadFiles');
    return rejectWithValue(error as errorType);
  }
});
