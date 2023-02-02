import BrikApiInventory from '@/brikApi/BrikApiInventory';
import { getOptions, request } from '@/networking/request';

export const getAllBrikProducts = async (
  page?: number,
  size?: number,
  search?: string,
  category?: string,
  distance?: number
) => {
  return request(
    BrikApiInventory.getProducts(page, size, search, category, distance),
    await getOptions('GET')
  );
};

export const getProductsCategories = async (
  page?: number,
  size?: number,
  search?: string,
  pillar?: string,
  count?: boolean
) => {
  return request(
    BrikApiInventory.getProductCategories(page, size, search, pillar, count),
    await getOptions('GET')
  );
};
