import { production } from '../../app.json';
import Config from 'react-native-config';
const PRODUCTION = production;
const API_URL = PRODUCTION
  ? Config.API_URL_COMMON_PROD
  : Config.API_URL_COMMON_DEV;

export default class BrikApiCommon {
  static getLocationCoordinates = (
    longitude: number,
    latitude: number,
    distance = 'BP-LEGOK'
  ) => {
    const url = new URL(`${API_URL}/common/map/coordinates`);
    const params = url.searchParams;

    if (longitude) {
      params.append('lon', `${longitude}`);
    }
    if (latitude) {
      params.append('lat', `${latitude}`);
    }
    if (distance) {
      params.append('distance', distance);
    }

    return url.toString();
  };
  static searchPlaces = (searchValue: string) => {
    const url = new URL(`${API_URL}/common/map/places`);
    const params = url.searchParams;
    if (searchValue) {
      params.append('search', searchValue);
    }
    return url.toString();
  };

  static searchPlacesById = (id: string) => {
    const url = new URL(`${API_URL}/common/map/places/${id}`);
    return url.toString();
  };

  static filesUpload = () => {
    const url = new URL(`${API_URL}/common/file/upload`);
    return url.toString();
  };

  // --------------------------------------------------AUTHENTICATION ---------------------------------------------//

  static login = () => {
    const url = new URL(`${API_URL}/common/m/auth/login`);
    return url.toString();
  };

  static logout = () => {
    const url = new URL(`${API_URL}/common/m/auth/logout`);
    return url.toString();
  };
  static getRefreshToken = () => {
    const url = new URL(`${API_URL}/common/m/auth/refresh`);
    return url.toString();
  };

  static verifyAuth = () => {
    const url = new URL(`${API_URL} /common/m/auth/verify-auth`);
    return url.toString();
  };
}

// --------------------------------------------------AUTHENTICATION ---------------------------------------------//
