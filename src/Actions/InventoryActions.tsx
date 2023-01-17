import BrikApi from '@/brikApi/BrikApi';
import BrikApiInventory from '@/brikApi/BrikApiInventory';
import { catchError, getOptions, request } from '@/networking/request';

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
  page?: number,
  size?: number,
  search?: string,
  pillar?: string,
  count?: boolean
) => {
  return request(
    BrikApiInventory.getProductCategories(page, size, search, pillar, count),
    getOptions(token, 'GET')
  )
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((error) => {
      catchError(error);
    });
};
