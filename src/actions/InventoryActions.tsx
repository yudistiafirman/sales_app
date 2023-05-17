import BrikApiInventory from '@/brikApi/BrikApiInventory';
import { customRequest } from '@/networking/request';

export const getAllBrikProducts = async (
  page?: number,
  size?: number,
  search?: string,
  category?: string,
  distance?: number
) => {
  return customRequest(
    BrikApiInventory.getProducts(page, size, search, category, distance),
    'GET'
  );
};

export const getProductsCategories = async (
  page?: number,
  size?: number,
  search?: string,
  pillar?: string,
  count?: boolean
) => {
  return customRequest(
    BrikApiInventory.getProductCategories(page, size, search, pillar, count),
    'GET'
  );
};

export const getDrivers = async (
  page?: number,
  size?: number,
  search?: string
) => {
  return customRequest(BrikApiInventory.getDrivers(page, size, search), 'GET');
};

export const getVehicles = async (
  page?: number,
  size?: number,
  search?: string
) => {
  return customRequest(BrikApiInventory.getVehicles(page, size, search), 'GET');
};
