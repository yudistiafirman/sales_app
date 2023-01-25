import BrikApiInventory from '@/brikApi/BrikApiInventory';
import { getOptions, request } from '@/networking/request';

export const getAllBrikProducts = (
  page?: number,
  size?: number,
  search?: string,
  category?: string,
  distance?: number
) => {
  return request(
    BrikApiInventory.getProducts(page, size, search, category, distance),
    getOptions('GET')
  );
};

export const getProductsCategories = (
  page?: number,
  size?: number,
  search?: string,
  pillar?: string,
  count?: boolean
) => {
  return request(
    BrikApiInventory.getProductCategories(page, size, search, pillar, count),
    getOptions('GET')
  );
};
