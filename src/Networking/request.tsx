import { production } from '../../app.json';
import axios, { AxiosBasicCredentials, AxiosHeaders } from 'axios';

interface RequestInfo {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  headers: Record<string, string>;
  body?: any;
  timeoutInterval?: number;
}

export const getOptions = (
  token = 'statictoken',
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  data?: any,
  timeout = 10000
) => {
  const options = {} as RequestInfo;
  options.method = method;
  options.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',

    token: token,
  };

  if (data) {
    options.body = data;
  }

  if (production) {
    options.timeoutInterval = timeout;
    // options.sslPinning = {
    //   certs: [''],
    // };
  } else {
    options.timeoutInterval = timeout;
    // options.sslPinning = {
    //   certs: [''],
    // };
  }
  return options;
};

export const request = axios;

export const catchError = (errorResponse: any) => {
  let validateError;

  const defaultErrorMessage = 'Error Getting Data';
  if (
    errorResponse &&
    errorResponse.bodyString &&
    errorResponse.bodyString.search('message') !== -1
  ) {
    validateError = errorResponse.bodyString.substring(
      errorResponse.bodyString.lastIndexOf('[') + 1,
      errorResponse.bodyString.lastIndexOf(']')
    );
  } else if (errorResponse.bodyString) {
    // output : Not Found (404), etc
    validateError = `${errorResponse.bodyString} ${errorResponse.status}`;
  } else {
    const dataType = typeof errorResponse;
    if (dataType === 'string') {
      const timeout = errorResponse.includes('timeout');
      if (timeout) {
        validateError = 'Timeout. Please try again later...'; // output : timeout, etc
      } else {
        validateError = errorResponse.includes('CertPathValidatorException')
          ? 'SLL Certificate Expired'
          : defaultErrorMessage; // output : actually error response from certificate pinning
      }
    } else {
      validateError = defaultErrorMessage;
    }
  }
  return validateError;
};
