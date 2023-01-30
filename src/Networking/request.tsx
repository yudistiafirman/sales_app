import { production } from '../../app.json';
import axios, { AxiosResponse } from 'axios';
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
    };

interface RequestInfo {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  headers: Record<string, string>;
  data?: Record<string, string> | FormDataValue;
  timeoutInterval?: number;
}

interface Response {
  success: boolean;
  message: string;
  data?: any;
  error?: {
    code: string;
    message: string;
    status: number;
  };
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
  options.headers = {
    Accept: 'application/json',
    'Content-Type': getContentType(data),
    authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImViYmRlMjYwLTkxNDktNDQzZC1iNGU3LWIwYThlYzZjZTI0OCIsImVtYWlsIjoic2l0YW1wYW5AZ21haWwuY29tIiwicGhvbmUiOiIxMjMxMjMxMjMiLCJ0eXBlIjoiQURNSU4iLCJpYXQiOjE2NzUwNTU0NzAsImV4cCI6MTY3NTA1OTA3MH0.D0kn5M_Xi-cRUgQvmx_KJyoDWq5P3eO7EKprYjFmNRw',
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

const instance = axios.create({
  withCredentials: true,
});

instance.interceptors.response.use(
  async (res: AxiosResponse<Response, any>) => {
    // console.log(JSON.stringify(res, null, 2), 'res??><><><><><><><>');
    const { data } = res;
    console.log(data, 'data 1');
    console.log(data.message === 'invalid access token', 'data 1');
    if (!data.success && data?.error?.message === 'invalid access token') {
      console.log('data 2');
      const { data } = await instance.post(BrikApiCommon.getRefreshToken(), {});
      console.log(data, 'data 2');
      //       const response = await axios.post(BrikApiCommon.getRefreshToken(), {
      //   refresh_token: refreshToken,
      // });
      // return response.data.data.accessToken;
    }
    return Promise.resolve(res);
  },
  (err: any) => {
    console.log(err, 'ini apa??><><><><><><><>');
    let { response } = err;
  }
);

export const request = instance;

// const requestRefresh: TokenRefreshRequest = async (
//   refreshToken: string
// ): Promise<string> => {
//   const response = await axios.post(BrikApiCommon.getRefreshToken(), {
//     refresh_token: refreshToken,
//   });
//   return response.data.data.accessToken;
// };

// applyAuthTokenInterceptor(axios, { requestRefresh });
