import BrikApiInventory from '@/brikApi/BrikApiInventory';
import { customRequest } from '@/networking/request';

export const getAllBrikProducts = async (
  page?: number,
  size?: number,
  search?: string,
  category?: string,
  distance?: number
) => customRequest(BrikApiInventory.getProducts(page, size, search, category, distance), 'GET');

export const getProductsCategories = async (
  page?: number,
  size?: number,
  search?: string,
  pillar?: string,
  count?: boolean
) => customRequest(BrikApiInventory.getProductCategories(page, size, search, pillar, count), 'GET');
