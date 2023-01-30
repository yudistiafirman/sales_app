import { production } from '../../app.json';
import axios, { AxiosResponse } from 'axios';
import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { Api } from '@/models';
import { UserModel } from '@/models/User';
import { bStorage } from '@/actions';
import { storageKey } from '@/constants';
import { store } from '@/redux/store';
import { setUserData } from '@/redux/reducers/authReducer';
import jwtDecode, { JwtPayload } from 'jwt-decode';

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

export const getOptions = async (
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  data?: Record<string, string> | FormDataValue,
  withToken?: boolean,
  timeout = 10000
) => {
  const options = {} as RequestInfo;
  const token = await bStorage.getItem(storageKey.userToken);
  console.log(token, 'ini token');
  options.method = method;
  options.headers = {
    Accept: 'application/json',
    'Content-Type': getContentType(data),
    ...(withToken && {
      Authorization: `Bearer ${token}`,
    }),
  };

  console.log(options.headers, 'ini apa?');

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
  async (res: AxiosResponse<Api.Response, any>) => {
    const { data, config } = res;
    if (!data.success) {
      // automatic logout
      // if (data.error?.message === 'invalid access token') {
      //   bStorage.deleteItem(storageKey.phone);
      //   store.dispatch(setUserData(null));
      // }

      if (data.error?.message === 'invalid access token') {
        console.log('masuk refresh token', config.headers);
        const responseRefreshToken = await instance.post<
          any,
          AxiosResponse<Api.Response, any>
        >(BrikApiCommon.getRefreshToken(), {});

        const { data: dataRefreshToken } = responseRefreshToken;
        const resultRefreshToken =
          dataRefreshToken.data as UserModel.DataSuccessLogin;

        const newAccToken = resultRefreshToken.accessToken;
        bStorage.setItem(storageKey.userToken, newAccToken);
        const decoded = jwtDecode<JwtPayload>(newAccToken);

        store.dispatch(setUserData(decoded));

        config.headers.Authorization = `Bearer ${newAccToken}`;
        const finalResponse = await instance(config);
        return Promise.resolve(finalResponse);
      }
    }
    return Promise.resolve(res);
  },
  (err: any) => {
    console.log(err, 'ini apa??><><><><><><><>');
    return Promise.reject(err);
  }
);

export const request = instance;
