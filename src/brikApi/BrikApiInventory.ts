import Config from 'react-native-config';
const API_URL = Config.API_URL_INV;

export default class BrikApiInventory {
  static getProductCategories = (
    page?: number,
    size?: number,
    search?: string,
    pillar?: string,
    count?: boolean
  ) => {
    const url = new URL(`${API_URL}/inventory/m/category`);
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

  static getProducts = (
    page?: number,
    size?: number,
    search?: string,
    category?: string,
    distance?: number
  ) => {
    const url = new URL(`${API_URL}/inventory/m/product`);
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
    if (category) {
      params.append('category', category);
    }
    if (distance) {
      params.append('distance', `${distance}`);
    }

    return url.toString();
  };
}
