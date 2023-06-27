import axios, {
    AxiosError,
    AxiosResponse,
    GenericAbortSignal,
    InternalAxiosRequestConfig
} from "axios";
import BrikApiCommon from "@/brikApi/BrikApiCommon";
import UserModel from "@/models/User";
import bStorage from "@/actions";
import { storageKey } from "@/constants";
import { setUserData, signout } from "@/redux/reducers/authReducer";
import { getSuccessMsgFromAPI } from "@/utils/generalFunc";
import { openSnackbar } from "@/redux/reducers/snackbarReducer";
import Config from "react-native-config";
import { Platform } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import analytics from "@react-native-firebase/analytics";
import perf from "@react-native-firebase/perf";
import Api from "@/models";
import jwtDecode from "jwt-decode";

const URL_PRODUCTIVITY =
    Platform.OS === "android"
        ? Config.API_URL_PRODUCTIVITY
        : __DEV__
        ? Config.API_URL_PRODUCTIVITY
        : Config.API_URL_PRODUCTIVITY_PROD;
const URL_ORDER =
    Platform.OS === "android"
        ? Config.API_URL_ORDER
        : __DEV__
        ? Config.API_URL_ORDER
        : Config.API_URL_ORDER_PROD;
const URL_COMMON =
    Platform.OS === "android"
        ? Config.API_URL_COMMON
        : __DEV__
        ? Config.API_URL_COMMON
        : Config.API_URL_COMMON_PROD;
const URL_FINANCE =
    Platform.OS === "android"
        ? Config.API_URL_FINANCE
        : __DEV__
        ? Config.API_URL_FINANCE
        : Config.API_URL_FINANCE_PROD;

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
    method: "GET" | "POST" | "DELETE" | "PUT";
    headers: Record<string, string>;
    data?: Record<string, string> | FormDataValue;
    timeoutInterval?: number;
    signal?: GenericAbortSignal;
}

function setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

function getContentType<T>(dataToReceived: T) {
    let contentType = "application/json";
    if (typeof dataToReceived === "string") {
        contentType = "application/x-www-form-urlencoded";
    }
    if (dataToReceived instanceof FormData) {
        contentType = "multipart/form-data";
    }
    return contentType;
}

export const getOptions = async (
    method: "GET" | "POST" | "DELETE" | "PUT",
    data?: Record<string, string> | FormDataValue,
    withToken?: boolean,
    signal?: GenericAbortSignal,
    timeout = 10000
) => {
    try {
        const options = {} as RequestInfo;
        const token = await bStorage.getItem(storageKey.userToken);
        options.method = method;
        options.headers = {
            Accept: "application/json",
            "Content-Type": getContentType(data),
            ...(withToken && {
                Authorization: `Bearer ${token}`
            })
        };

        if (data) {
            options.data = data;
        }

        if (signal) options.signal = signal;

        options.timeoutInterval = timeout;
        return options;
    } catch (error) {
        console.log(error, "error/getOptions");
        return undefined;
    }
};

const instance = axios.create({
    withCredentials: true
});

export const customRequest = async (
    request: any,
    method: "GET" | "POST" | "DELETE" | "PUT",
    data?: Record<string, string> | FormDataValue,
    withToken?: boolean,
    signal?: GenericAbortSignal
) => {
    // performance API log
    metric = await perf().newHttpMetric(request, method);
    await metric.start();

    return instance(request, await getOptions(method, data, withToken, signal));
};

export const injectStore = (_store: any) => {
    store = _store;
};

export const doLogout = () => {
    bStorage.clearItem();
    crashlytics().setUserId("");
    analytics().setUserId("");
    store.dispatch(signout(false));
};

export const doRefreshToken = async (
    configs: InternalAxiosRequestConfig<any>
): Promise<AxiosResponse<any, any>> => {
    const config = configs;
    const responseRefreshToken = await customRequest(
        BrikApiCommon.getRefreshToken(),
        "POST"
    );

    const newAccToken = responseRefreshToken?.data?.data?.accessToken;
    const decoded = jwtDecode<UserModel.DataSuccessLogin>(newAccToken);
    await bStorage.setItem(storageKey.userToken, newAccToken);
    store.dispatch(setUserData({ userData: decoded }));

    config.headers.Authorization = `Bearer ${newAccToken}`;
    const finalResponse = await instance(config);
    return finalResponse;
};

export const showErrorMsg = (
    url: string | undefined,
    errMsg: string,
    errStatus: number
) => {
    const postVisitationUrl = `${URL_PRODUCTIVITY}/productivity/m/flow/visitation/`;
    const postVisitationBookUrl = `${URL_PRODUCTIVITY}/productivity/m/flow/visitation-book/`;
    const postDepositUrl = `${URL_ORDER}/order/m/deposit/`;
    const postPaymentUrl = `${URL_FINANCE}/finance/m/payment/`;
    const postScheduleUrl = `${URL_ORDER}/order/m/schedule/`;
    const postPO = `${URL_ORDER}/order/m/purchase-order/`;
    const postSOSigned = `${URL_ORDER}/order/m/purchase-order/docs/`;

    if (
        url !== postVisitationUrl &&
        url !== postVisitationBookUrl &&
        url !== postDepositUrl &&
        url !== postPaymentUrl &&
        url !== postScheduleUrl &&
        url !== postPO &&
        url !== postSOSigned &&
        errMsg !== "canceled"
    ) {
        store.dispatch(
            openSnackbar({
                snackBarText: `${errMsg} code: ${errStatus}`,
                isSuccess: false
            })
        );
    }
};

instance.interceptors.response.use(
    async (res: AxiosResponse<Api.Response, any>) => {
        const { data, config } = res;

        // performance API logs
        if (config?.url) {
            if (res?.status) metric?.setHttpResponseCode(res?.status);
            try {
                const authorization = config?.headers?.get("Authorization");
                if (authorization && authorization !== null) {
                    metric?.setResponseContentType(authorization);
                }
                const contentType = config?.headers?.get("Content-Type");
                if (contentType && contentType !== null) {
                    metric?.setResponseContentType(contentType);
                }
                let contentLength = config?.headers?.get("Content-Length");
                if (contentLength && contentLength !== null) {
                    if (typeof contentLength === "string") {
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

        if (data?.success && data?.success !== true) {
            // automatic logout
            let errorMessage = `There's something wrong`;
            let errorStatus = 500;

            if (data?.error?.status) {
                errorStatus = data?.error?.status;
            }

            if (data?.error?.message) {
                errorMessage = data?.error?.message;
            } else if (data?.message) {
                errorMessage = data?.message;
            }

            if (
                data?.error?.code === "TKN001" ||
                data?.error?.code === "TKN002" ||
                data?.error?.code === "TKN005"
            ) {
                doLogout();
                return Promise.resolve(res);
            }

            if (
                data?.error?.code === "TKN003" ||
                data?.error?.code === "TKN004" ||
                data?.error?.code === "TKN008"
            ) {
                const finalResponse = doRefreshToken(config);
                return Promise.resolve(finalResponse);
            }

            showErrorMsg(config?.url, errorMessage, errorStatus);
        } else if (config?.method !== "get" && config?.method !== "put") {
            let { url } = config;
            if (url) {
                if (url?.length > 0 && url[url.length - 1] === "/") {
                    url = setCharAt(url, url.length - 1, "");
                }
            }
            const urlArray: string[] | undefined = url?.split("/");
            const respMethod: string | undefined = config?.method;
            const endpoint =
                (url &&
                    url?.length > 0 &&
                    urlArray &&
                    urlArray[(urlArray?.length || 0) - 1]) ||
                "";
            const postVisitationUrl = `${URL_PRODUCTIVITY}/productivity/m/flow/visitation/`;
            const postSphUrl = `${URL_ORDER}/order/m/flow/quotation/`;
            if (
                endpoint !== "refresh" &&
                endpoint !== "suggestion" &&
                endpoint !== "places" &&
                endpoint !== "verify-auth" &&
                endpoint !== "project_sph" &&
                url !== postVisitationUrl &&
                url !== postSphUrl
            ) {
                const successMsg = getSuccessMsgFromAPI(
                    respMethod,
                    urlArray && urlArray?.length > 1 ? urlArray[2] : "",
                    config?.url,
                    endpoint
                );

                if (successMsg && successMsg !== "")
                    store.dispatch(
                        openSnackbar({
                            snackBarText: successMsg,
                            isSuccess: true
                        })
                    );
            }
        }
        return Promise.resolve(res);
    },
    (error: AxiosError<Api.Response, any>) => {
        let errorMessage = `There's something wrong`;
        let errorStatus = 500;

        if (error?.response?.status) {
            errorStatus = error?.response?.status;
        }

        if (error?.response?.data?.message) {
            errorMessage = error?.response?.data?.message;
        } else if (error?.response?.data?.error) {
            errorMessage = error?.response?.data?.error?.message;
        } else if (error?.message) {
            errorMessage = error?.message;
        }

        if (
            error?.response?.data?.code === "TKN001" ||
            error?.response?.data?.code === "TKN002" ||
            error?.response?.data?.code === "TKN005"
        ) {
            doLogout();
        } else if (
            error?.response?.data?.code === "TKN003" ||
            error?.response?.data?.code === "TKN004" ||
            error?.response?.data?.code === "TKN008"
        ) {
            if (error?.config) {
                const finalResponse = doRefreshToken(error?.config);
                return Promise.resolve(finalResponse);
            }
        }

        showErrorMsg(error?.config?.url, errorMessage, errorStatus);
        return Promise.reject(error);
    }
);

export const request = instance;
