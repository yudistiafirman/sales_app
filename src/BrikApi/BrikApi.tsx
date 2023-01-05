import { production } from '../../app.json';
import Config from 'react-native-config';
const PRODUCTION = production;
const API_URL = PRODUCTION ? Config.API_URL_PROD : Config.API_URL_DEV;

export default class BrikApi {
  static uploadFile = () => {
    const url = `${API_URL}/upload`;
    return `${url}`;
  };
  static getAllProducts = (
    page: number,
    size: number,
    search: string,
    category: string
  ) => {
    const url = `${API_URL}/inventory/m/products?page=${page}&size=${size}&search=${search}&category=${category}`;
    return url;
  };

  static getProductsCategories = (
    page: number,
    size: number,
    search: string,
    pillar: string,
    count: boolean
  ) => {
    const url = `${API_URL}/inventory/m/categories?page=${page}&size=${size}&search=${search}&pillar=${pillar}&count=${count}`;
    return url;
  };

  static getLocationCoordinates = (
    longitude: number,
    latitude: number,
    distanceFrom = 'BP-LEGOK'
  ) => {
    const url = `${API_URL}/common/map/coordinates?lon=${longitude}&lat=${latitude}8&distanceFrom=${distanceFrom}`;
    return url;
  };

  static searchLocation = (search: string) => {
    const url = `${API_URL}/common/map/places&search=${search}`;
    return url;
  };
  static getSearchLocationDetail = (placeId: string) => {
    const url = `${API_URL}/common/map/places/${placeId}`;
    return url;
  };
}
