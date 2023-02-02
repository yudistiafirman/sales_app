import jwtDecode, { JwtPayload } from 'jwt-decode';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import bStorage from '@/actions/BStorage';
import storageKey from '@/constants/storageKey';
import { acc } from 'react-native-reanimated';
const EXPIRE_FUDGE = 10;
const STORAGE_KEY = storageKey.userToken;

type Token = string;

type RequestsQueue = {
  resolve: (token?: string) => void;
  reject: (reason?: unknown) => void;
}[];

export type TokenRefreshRequest = (refreshToken: string) => Promise<Token>;

interface AuthTokenInterceptorConfig {
  header?: string;
  headerPrefix?: string;
  requestRefresh: TokenRefreshRequest;
}

const setAuthTokens = (tokens: Token): Promise<void> =>
  bStorage.setItem(STORAGE_KEY, tokens);

const getRefreshToken = async (): Promise<Token | undefined> => {
  const tokens = await getAuthTokens();
  return tokens ? tokens : undefined;
};

const getAccessToken = async (): Promise<Token | undefined> => {
  const tokens = await getAuthTokens();
  return tokens ? tokens : undefined;
};

const refreshTokenIfNeeded = async (
  requestRefresh: TokenRefreshRequest
): Promise<Token | undefined> => {
  // use access token (if we have it)
  let accessToken = await getAccessToken();

  // check if access token is expired
  if (!accessToken || isTokenExpired(accessToken)) {
    // do refresh
    accessToken = await refreshToken(requestRefresh);
  }

  return accessToken;
};

export const applyAuthTokenInterceptor = (
  instance: AxiosInstance,
  config: AuthTokenInterceptorConfig
): void => {
  if (!instance.interceptors)
    throw new Error(`invalid axios instance: ${instance}`);
  instance.interceptors.request.use(authTokenInterceptor(config));
};

const getAuthTokens = async (): Promise<Token | undefined> => {
  const rawTokens = await bStorage.getItem(STORAGE_KEY);
  if (!rawTokens) return;

  try {
    // parse stored tokens JSON
    return rawTokens;
  } catch (error) {
    throw new Error(`Failed to parse auth tokens: ${rawTokens}`);
  }
};

const isTokenExpired = (token: Token): boolean => {
  if (!token) return true;
  const expiresIn = getExpiresIn(token);
  return !expiresIn || expiresIn <= EXPIRE_FUDGE;
};

const getTimestampFromToken = (token: Token): number | undefined => {
  const decoded = jwtDecode<JwtPayload>(token);

  return decoded.exp;
};

const getExpiresIn = (token: Token): number => {
  const expiration = getTimestampFromToken(token);
  if (!expiration) return -1;

  return expiration - Date.now() / 1000;
};

const refreshToken = async (
  requestRefresh: TokenRefreshRequest
): Promise<Token> => {
  const acesssToken = await getRefreshToken();
  if (!acesssToken) throw new Error('No refresh token available');

  try {
    // Refresh and store access token using the supplied refresh function
    const newTokens = await requestRefresh(acesssToken);
    if (typeof newTokens === 'string') {
      await setAuthTokens(newTokens);
      return newTokens;
    }
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error;
    // Failed to refresh token
    const status = error.response?.status;
    if (status === 401 || status === 422) {
      // The refresh token is invalid so remove the stored tokens
      await bStorage.deleteItem(STORAGE_KEY);
      error.message = `Got ${status} on token refresh; clearing both auth tokens`;
    }

    throw error;
  }

  throw new Error(
    'requestRefresh must either return a string or an object with an accessToken'
  );
};

const authTokenInterceptor =
  ({
    header = 'Authorization',
    headerPrefix = 'Bearer ',
    requestRefresh,
  }: AuthTokenInterceptorConfig) =>
  async (requestConfig: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    // We need refresh token to do any authenticated requests
    const authToken = await getRefreshToken();
    if (!authToken) return requestConfig;
    const authenticateRequest = (token: string | undefined) => {
      if (token) {
        requestConfig.headers = requestConfig.headers ?? ({} as {});
        requestConfig.headers[header] = `${headerPrefix}${token}`;
      }
      return requestConfig;
    };

    // Queue the request if another refresh request is currently happening
    if (isRefreshing) {
      return new Promise((resolve: (token?: string) => void, reject) => {
        queue.push({ resolve, reject });
      }).then(authenticateRequest);
    }

    // Do refresh if needed
    let accessToken;
    try {
      setIsRefreshing(true);
      accessToken = await refreshTokenIfNeeded(requestRefresh);
    } catch (error) {
      declineQueue(error as Error);

      if (error instanceof Error) {
        error.message = `Unable to refresh access token for request due to token refresh error: ${error.message}`;
      }

      throw error;
    } finally {
      setIsRefreshing(false);
    }
    resolveQueue(accessToken);

    // add token to headers
    return authenticateRequest(accessToken);
  };

let isRefreshing = false;
let queue: RequestsQueue = [];

export function getIsRefreshing(): boolean {
  return isRefreshing;
}

export function setIsRefreshing(newRefreshingState: boolean): void {
  isRefreshing = newRefreshingState;
}

const resolveQueue = (token?: string) => {
  queue.forEach((p) => {
    p.resolve(token);
  });

  queue = [];
};

const declineQueue = (error: Error) => {
  queue.forEach((p) => {
    p.reject(error);
  });

  queue = [];
};
