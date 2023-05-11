import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { bStorage } from '@/actions';
import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { storageKey } from '@/constants';
import { Api } from '@/models';
import { UserModel } from '@/models/User';
import { signout } from '@/redux/reducers/authReducer';
import { openSnackbar } from '@/redux/reducers/snackbarReducer';
import { getSuccessMsgFromAPI } from '@/utils/generalFunc';

const URL_PRODUCTIVITY =
  Platform.OS === 'android'
    ? Config.API_URL_PRODUCTIVITY
    : __DEV__
    ? Config.API_URL_PRODUCTIVITY
    : Config.API_URL_PRODUCTIVITY_PROD;
const URL_ORDER =
  Platform.OS === 'android'
    ? Config.API_URL_ORDER
    : __DEV__
    ? Config.API_URL_ORDER
    : Config.API_URL_ORDER_PROD;
const URL_COMMON =
  Platform.OS === 'android'
    ? Config.API_URL_COMMON
    : __DEV__
    ? Config.API_URL_COMMON
    : Config.API_URL_COMMON_PROD;

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

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
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

    options.timeoutInterval = timeout;
    return options;
  } catch (error) {
    console.log(error, 'error/getOptions');
  }
};

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
      if (res?.status) metric?.setHttpResponseCode(res?.status);
      try {
        const authorization = config?.headers?.get('Authorization');
        if (authorization && authorization !== null) {
          metric?.setResponseContentType(authorization);
        }
        const contentType = config?.headers?.get('Content-Type');
        if (contentType && contentType !== null) {
          metric?.setResponseContentType(contentType);
        }
        let contentLength = config?.headers?.get('Content-Length');
        if (contentLength && contentLength !== null) {
          if (typeof contentLength === 'string') {
            contentLength = parseInt(contentLength, 10);
          }
          metric?.setResponsePayloadSize(contentLength);
        }
      } catch (err) {
        console.log(err);
      }
    }
    await metric?.stop();
    metric = undefined;

    if (!data.success) {
      // automatic logout
      if (data.error?.code === 'TKN001' || data.error?.code === 'TKN003') {
        bStorage.clearItem();
        store.dispatch(signout(false));
        crashlytics().setUserId('');
        analytics().setUserId('');
        return Promise.resolve(res);
      }

      if (data.error?.code === 'TKN008') {
        const responseRefreshToken = await instance.post<any, AxiosResponse<Api.Response, any>>(
          BrikApiCommon.getRefreshToken(),
          {}
        );

        const { data: dataRefreshToken } = responseRefreshToken;
        const resultRefreshToken = dataRefreshToken.data as UserModel.DataSuccessLogin;

        const newAccToken = resultRefreshToken?.accessToken;
        bStorage.setItem(storageKey.userToken, newAccToken);
        // const decoded = jwtDecode<JwtPayload>(newAccToken);

        // store.dispatch(setUserData({ userData: decoded }));

        config.headers.Authorization = `Bearer ${newAccToken}`;
        const finalResponse = await instance(config);
        return Promise.resolve(finalResponse);
      }
    } else if (config.method !== 'get' && config.method !== 'put') {
      let { url } = config;
      if (url) {
        if (url[url?.length - 1] === '/') {
          url = setCharAt(url, url?.length - 1, '');
        }
      }
      const urlArray: string[] = url?.split('/');
      const respMethod = config.method;
      const endpoint = urlArray[urlArray?.length - 1] || '';
      const postVisitationUrl = `${URL_PRODUCTIVITY}/productivity/m/flow/visitation/`;
      const postSphUrl = `${URL_ORDER}/order/m/flow/quotation/`;
      if (
        endpoint !== 'refresh' &&
        endpoint !== 'suggestion' &&
        endpoint !== 'places' &&
        endpoint !== 'verify-auth' &&
        endpoint !== 'project_sph' &&
        url !== postVisitationUrl &&
        url !== postSphUrl
      ) {
        const successMsg = getSuccessMsgFromAPI(
          respMethod,
          urlArray && urlArray.length > 1 ? urlArray[2] : '',
          config.url,
          endpoint
        );

        if (successMsg && successMsg !== '') {
          store.dispatch(openSnackbar({ snackBarText: successMsg, isSuccess: true }));
        }
      }
    }
    return Promise.resolve(res);
  },
  (error: AxiosError<Api.Response, any>) => {
    let errorMessage = "There's something wrong";
    let errorStatus = 500;
    const errorMethod = error.config?.method;

    if (errorMethod !== 'get') {
      if (error.response) {
        if (error.response.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        errorStatus = error.response.status;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      const postVisitationUrl = `${URL_PRODUCTIVITY}/productivity/m/flow/visitation/`;
      const postVisitationBookUrl = `${URL_PRODUCTIVITY}/productivity/m/flow/visitation-book/`;
      const postDepositUrl = `${URL_ORDER}/order/m/deposit/`;
      const postScheduleUrl = `${URL_ORDER}/order/m/schedule/`;
      const postPO = `${URL_ORDER}/order/m/purchase-order/`;
      const postSOSigned = `${URL_ORDER}/order/m/purchase-order/docs/`;
      const refreshToken = `${URL_COMMON}/common/m/auth/refresh/`;

      if (error?.config?.url === refreshToken && errorStatus === 500) {
        bStorage.clearItem();
        store.dispatch(signout(false));
        crashlytics().setUserId('');
        analytics().setUserId('');
      } else if (
        error?.config?.url !== postVisitationUrl &&
        error?.config?.url !== postVisitationBookUrl &&
        error?.config?.url !== postDepositUrl &&
        error?.config?.url !== postScheduleUrl &&
        error?.config?.url !== postPO &&
        error?.config?.url !== postSOSigned
      ) {
        store.dispatch(
          openSnackbar({
            snackBarText: `${errorMessage} code: ${errorStatus}`,
            isSuccess: false,
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

export const request = instance;
