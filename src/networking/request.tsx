import axios, { AxiosResponse } from 'axios';
import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { Api } from '@/models';
import { UserModel } from '@/models/User';
import { bStorage } from '@/actions';
import { storageKey } from '@/constants';
import { setUserData } from '@/redux/reducers/authReducer';
import jwtDecode, { JwtPayload } from 'jwt-decode';
const production = false;
let store: any;

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
  try {
    const options = {} as RequestInfo;
    const token = await bStorage.getItem(storageKey.userToken);
    options.method = method;
    options.headers = {
      Accept: 'application/json',
      'Content-Type': getContentType(data),
      ...(withToken && {
        Authorization: `Bearer ${token}`,
      }),
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
  } catch (error) {
    console.log('====================================');
    console.log(error, 'error/getOptions');
    console.log('====================================');
  }
};

const instance = axios.create({
  withCredentials: true,
});
export const injectStore = (_store: any) => {
  store = _store;
};

instance.interceptors.response.use(
  async (res: AxiosResponse<Api.Response, any>) => {
    const { data, config } = res;
    // console.log(JSON.stringify(res, null, 2), 'ini apa suuuuuu??');
    if (!data.success) {
      // automatic logout
      if (data.error?.code === 'TKN001' || data.error?.code === 'TKN003') {
        await bStorage.deleteItem(storageKey.userToken);
        store.dispatch(setUserData(null));
        // console.log('stop');
        return Promise.resolve(res);
      }

      // console.log('gajalan');
      if (data.error?.code === 'TKN008') {
        const responseRefreshToken = await instance.post<
          any,
          AxiosResponse<Api.Response, any>
        >(BrikApiCommon.getRefreshToken(), {});

        const { data: dataRefreshToken } = responseRefreshToken;
        const resultRefreshToken =
          dataRefreshToken.data as UserModel.DataSuccessLogin;

        const newAccToken = resultRefreshToken?.accessToken;
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
    // console.log(JSON.stringify(err, null, 2), 'ini apa??><><><><><><><>');
    return Promise.reject(err);
  }
);

export const request = instance;
