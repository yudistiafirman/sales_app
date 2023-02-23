import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  allVisitationGetAction,
  uploadFileImage,
  projectByUserGetAction,
  projectGetOneById,
  getSphDocuments,
  getAddressSuggestion,
  postProjectDoc,
} from '@/actions/CommonActions';
import { projectResponseType } from '@/interfaces';
import { customLog } from '@/utils/generalFunc';

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
    customLog(error.message, 'errormsgcommon/postUploadFiles');

    customLog(error?.response?.data, 'error at', 'common/postUploadFiles');
    let errorData = error.message;
    if (error?.response?.data) {
      errorData = error?.response?.data;
    }
    return rejectWithValue(errorData);
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
      customLog(error, 'errorPlain/getAllProject');

      customLog(error.message, 'message/getAllProject');

      customLog(error?.response?.data, 'error at', 'common/getAllProject');
      return rejectWithValue(error.message);
    }
  }
);

export const getProjectsByUserThunk = createAsyncThunk<
  projectResponseType,
  { search?: string }
>('common/getProjectsByUserThunk', async ({ search }, { rejectWithValue }) => {
  // projectByUserGetAction
  try {
    const response = await projectByUserGetAction(search);
    const { data } = response;
    if (data.error) throw data as errorType;

    return data;
  } catch (error) {
    customLog(error.message, 'message/getProjectsByUserThunk');
    return rejectWithValue(error.message);
  }
});
//projectGetOneById
export const getOneProjectById = createAsyncThunk<any, { projectId: string }>(
  'common/getOneProjectById',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const response = await projectGetOneById(projectId);
      const { data } = response;
      if (data.error) throw data as errorType;

      return data;
    } catch (error) {
      customLog(error.message, 'message/getProjectsByUserThunk');
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSphDocuments = createAsyncThunk(
  'common/fetchSphDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSphDocuments();
      const { data } = response;
      if (data.error) throw data as errorType;
      return data;
    } catch (error) {
      customLog(error.message, 'message/fetchSphDocuments');
      return rejectWithValue(error.message);
    }
  }
);
export const fetchAddressSuggestion = createAsyncThunk<
  any,
  { search: string; page: number }
>(
  'common/fetchAddressSuggestion',
  async ({ search, page }, { rejectWithValue }) => {
    try {
      const response = await getAddressSuggestion(search, page);
      const { data } = response;
      if (data.error) throw data as errorType;
      return data;
    } catch (error) {
      customLog(error.message, 'message/fetchAddressSuggestion');
      return rejectWithValue(error.message);
    }
  }
);
export const postProjectDocByprojectId = createAsyncThunk<
  any,
  {
    payload: {
      projectId: string;
      documentId: string;
      fileId: string;
    };
  }
>(
  'common/postProjectDocByprojectId',
  async ({ payload }, { rejectWithValue }) => {
    try {
      const response = await postProjectDoc(payload);
      const { data } = response;
      if (data.error) throw data as errorType;
      return data;
    } catch (error) {
      customLog(error.message, 'message/postProjectDocByprojectId');
      customLog(error?.response, 'message/postProjectDocByprojectId149');
      let errorData = error.message;
      if (error?.response?.data) {
        errorData = error?.response?.data;
      }
      return rejectWithValue(errorData);
    }
  }
);
