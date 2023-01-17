import { production } from '../../app.json';
import Config from 'react-native-config';
const PRODUCTION = production;
const API_URL = PRODUCTION ? Config.API_URL_INV_PROD : Config.API_URL_INV_DEV;

export default class BrikApiInventory {
  static getProductCategories = (
    page?: number,
    size?: number,
    search?: string,
    pillar?: string,
    count?: boolean
  ) => {
    const url = new URL(`${API_URL}/inventory/m/categories`);
    const params = url.searchParams;

    if (page) {
      params.append('page', `${page}`);
    }
    if (size) {
      params.append('size', `${size}`);
    }
    if (search) {
      params.append('search', search);
    }
    if (pillar) {
      params.append('pillar', pillar);
    }
    if (count) {
      params.append('count', `${count}`);
    }

    return url.toString();
  };
}
