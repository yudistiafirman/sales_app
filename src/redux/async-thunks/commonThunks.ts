import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  allVisitationGetAction,
  uploadFileImage,
} from '@/Actions/CommonActions';

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
  { files: any[]; from: string }
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

export const getAllProject = createAsyncThunk<any, { search?: string }>(
  'common/getAllProject',
  async ({ search }, { rejectWithValue }) => {
    try {
      const response = await allVisitationGetAction(search);
      const { data } = response;
      if (data.error) throw data as errorType;

      return data;
    } catch (error) {
      console.log(error, 'errorPlain/getAllProject');

      console.log(error.message, 'message/getAllProject');

      console.log(error?.response?.data, 'error at', 'common/getAllProject');
      return rejectWithValue(error.message);
    }
  }
);

// export const getProjectsByUserThunk = createAsyncThunk(
//   'common/getProjectsByUserThunk',
//   async (search?: string, { rejectWithValue }) => {
//     // projectByUserGetAction
//     try {
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
