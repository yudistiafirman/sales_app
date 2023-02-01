import { production } from '../../app.json';
import axios from 'axios';
import {
  applyAuthTokenInterceptor,
  TokenRefreshRequest,
} from './applyInterceptorConfig';
import BrikApiCommon from '@/brikApi/BrikApiCommon';

type FormDataValue =
  | string
  | {
      name?: string | undefined;
      type?: string | undefined;
      uri: string;
    }
  | {
      photos?: {
        name?: string | undefined;
        type?: string | undefined;
        uri: string;
      };
      name: string;
    };

interface RequestInfo {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  headers: Record<string, string>;
  data?: Record<string, string> | FormDataValue;
  timeoutInterval?: number;
}

function getContentType<T>(dataToReceived: T) {
  let contentType = 'application/json';
  if (typeof dataToReceived === 'string') {
    contentType = 'application/x-www-form-urlencoded';
  }
  if (dataToReceived instanceof FormData) {
    contentType = 'multipart/form-data';
  }
  return contentType;
}

export const getOptions = (
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  data?: Record<string, string> | FormDataValue,
  timeout = 10000
) => {
  const options = {} as RequestInfo;
  options.method = method;
  // const tokenDummy =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImViYmRlMjYwLTkxNDktNDQzZC1iNGU3LWIwYThlYzZjZTI0OCIsImVtYWlsIjoic2l0YW1wYW5AZ21haWwuY29tIiwicGhvbmUiOiIxMjMxMjMxMjMiLCJ0eXBlIjoiQURNSU4iLCJpYXQiOjE2NzUxNDg0MDEsImV4cCI6MTY3NTE1MjAwMX0.zG8Oe_B4fCAi4l6-SLkT84Rh1rFuvhpcBPRMh9JqkVE';
  options.headers = {
    Accept: 'application/json',
    'Content-Type': getContentType(data),
    // authorization: `Bearer ${tokenDummy}`,
  };

  if (data) {
    options.data = data;
  }

  if (production) {
    options.timeoutInterval = timeout;
  } else {
    options.timeoutInterval = timeout;
  }
  return options;
};

export const request = axios;

// const requestRefresh: TokenRefreshRequest = async (
//   refreshToken: string
// ): Promise<string> => {
//   const response = await axios.post(BrikApiCommon.getRefreshToken(), {
//     refresh_token: refreshToken,
//   });
//   return response.data.data.accessToken;
// };

// applyAuthTokenInterceptor(axios, { requestRefresh });
