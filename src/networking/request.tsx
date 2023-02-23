import axios, { AxiosResponse } from 'axios';
import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { Api } from '@/models';
import { UserModel } from '@/models/User';
import { bStorage } from '@/actions';
import { storageKey } from '@/constants';
import { signout } from '@/redux/reducers/authReducer';
import { customLog } from '@/utils/generalFunc';
import perf from '@react-native-firebase/perf';

let store: any;
let metric: any;

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

export const customRequest = async (
  request: any,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  data?: Record<string, string> | FormDataValue,
  withToken?: boolean
) => {
  // performance API log
  metric = await perf().newHttpMetric(request, method);
  await metric.start();

  return instance(request, await getOptions(method, data, withToken));
};

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

    options.timeoutInterval = timeout;
    return options;
  } catch (error) {
    customLog('====================================');
    customLog(error, 'error/getOptions');
    customLog('====================================');
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

    // performance API logs
    if (config.url) {
      const response = await fetch(config.url);
      if (response?.status) metric?.setHttpResponseCode(response?.status);
      try {
        metric?.setResponseContentType(response?.headers?.get('Content-Type'));
        let contentLength = null;
        if (
          response?.headers?.get('Content-Length') !== undefined &&
          response?.headers?.get('Content-Length') !== null
        ) {
          contentLength = parseInt(
            response?.headers?.get('Content-Length'),
            10
          );
        }
        metric?.setResponsePayloadSize(contentLength);
      } catch (err) {
        customLog(err);
      }
    }
    await metric?.stop();
    metric = undefined;

    if (!data.success) {
      // automatic logout
      if (data.error?.code === 'TKN001' || data.error?.code === 'TKN003') {
        await bStorage.deleteItem(storageKey.userToken);
        store.dispatch(signout(false));
        return Promise.resolve(res);
      }

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
        // const decoded = jwtDecode<JwtPayload>(newAccToken);

        // store.dispatch(setUserData({ userData: decoded }));

        config.headers.Authorization = `Bearer ${newAccToken}`;
        const finalResponse = await instance(config);
        return Promise.resolve(finalResponse);
      }
    }
    return Promise.resolve(res);
  },
  (err: any) => {
    return Promise.reject(err);
  }
);

export const request = instance;
