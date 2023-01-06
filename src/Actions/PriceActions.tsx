import BrikApi from '@/BrikApi/BrikApi';
import { catchError, getOptions, request } from '@/Networking/request';

export const getAllBrikProducts = (
  token: string,
  page: number,
  size: number,
  search: string,
  categories: string,
  onSuccess: Function,
  onError: Function
) => {
  request(
    BrikApi.getAllProducts(page, size, search, categories),
    getOptions(token, 'GET')
  )
    .then((response) => response.json())
    .then((responseJson) => {
      onSuccess(responseJson);
    })
    .catch((error) => {
      onError(catchError(error));
    });
};

export const getProductsCategories = (
  token: string,
  page: number,
  size: number,
  search: string,
  pillar: string,
  count: boolean,
  onSuccess: Function,
  onError: Function
) => {
  request(
    BrikApi.getProductsCategories(page, size, search, pillar, count),
    getOptions(token, 'GET')
  )
    .then((response) => response.json())
    .then((responseJson) => {
      onSuccess(responseJson);
    })
    .catch((error) => {
      onError(catchError(error));
    });
};
