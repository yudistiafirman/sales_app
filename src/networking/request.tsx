import axios, { AxiosError, AxiosResponse } from 'axios';
import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { Api } from '@/models';
import { UserModel } from '@/models/User';
import { bStorage } from '@/actions';
import { storageKey } from '@/constants';
import { setUserData } from '@/redux/reducers/authReducer';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { customLog } from '@/utils/generalFunc';
import perf from '@react-native-firebase/perf';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';

const production = false;
let store: any;
let metric: any;
let retryCount = 0;

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

    if (production) {
      options.timeoutInterval = timeout;
    } else {
      options.timeoutInterval = timeout;
    }
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
    const response = await fetch(config.url);
    if (response?.status) metric?.setHttpResponseCode(response?.status);
    try {
      metric?.setResponseContentType(response?.headers?.get('Content-Type'));
      metric?.setResponsePayloadSize(response?.headers?.get('Content-Length'));
    } catch (err) {
      customLog(err);
    }
    await metric?.stop();
    metric = undefined;

    if (!data.success) {
      // automatic logout
      if (data.error?.code === 'TKN001' || data.error?.code === 'TKN003') {
        await bStorage.deleteItem(storageKey.userToken);
        store.dispatch(setUserData(null));
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
        const decoded = jwtDecode<JwtPayload>(newAccToken);

        store.dispatch(setUserData(decoded));

        config.headers.Authorization = `Bearer ${newAccToken}`;
        const finalResponse = await instance(config);
        return Promise.resolve(finalResponse);
      }

      console.log(data, 'backenderror');
    }
    return Promise.resolve(res);
  },
  (error: AxiosError<Api.Response, any>) => {
    let errorMessage = `There's something wrong`;
    let errorStatus = 500;
    let errorMethod = error.config?.method;
    let responseSuccess;

    if (errorMethod === 'get') {
      if (error.response) {
        if (error.response.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        errorStatus = error.response.status;
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(errorMessage, errorStatus, 'messageerror');
      // console.log(JSON.stringify(error.response), 'responseerror163');
      store.dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: errorMessage,
          outsideClickClosePopUp: true,
          popUpTitle:
            'Error code' +
            ' ' +
            errorStatus +
            ' ' +
            `Retrycount: ${retryCount}`,
          isRenderActions: true,
          outlineBtnAction: () => {
            store.dispatch(closePopUp());
          },
          outlineBtnTitle: 'Tutup',
          primaryBtnAction: async () => {
            try {
              retryCount++;
              store.dispatch(
                openPopUp({
                  popUpType: 'loading',
                  popUpTitle: `Retrycount: ${retryCount}`,
                  isPrimaryButtonLoading: true,
                  outsideClickClosePopUp: false,
                })
              );

              const retryResponse = await instance({ ...error.config });
              // Promise.resolve(retryResponse);
              responseSuccess = retryResponse;
              store.dispatch(
                openPopUp({
                  popUpType: 'success',
                  isPrimaryButtonLoading: false,
                })
              );
              // store.dispatch(closePopUp());
            } catch (err) {
              store.dispatch(
                openPopUp({
                  popUpType: 'error',
                  isPrimaryButtonLoading: false,
                })
              );
              console.log(err);
            }
          },
          primaryBtnTitle: 'Retry request',
        })
      );
    }
    if (responseSuccess) {
      return Promise.resolve(responseSuccess);
    }
    return Promise.reject(error);
  }
);

export const request = instance;
