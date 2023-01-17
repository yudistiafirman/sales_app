import BrikApi from '@/brikApi/BrikApi';
import BrikApiInventory from '@/brikApi/BrikApiInventory';
import { catchError, getOptions, request } from '@/networking/request';

export const getAllBrikProducts = (
  token: string,
  page?: number,
  size?: number,
  search?: string,
  categories?: string
) => {
  return request(
    BrikApiInventory.getProducts(page, size, search, categories),
    getOptions(token, 'GET')
  )
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
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
    });
};
