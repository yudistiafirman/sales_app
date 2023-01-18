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
    distanceFrom = 'BP-LEGOK'
  ) => {
    const url = new URL(`${API_URL}/common/map/coordinates`);
    const params = url.searchParams;

    if (longitude) {
      params.append('lon', `${longitude}`);
    }
    if (latitude) {
      params.append('lat', `${latitude}`);
    }
    if (distanceFrom) {
      params.append('distanceFrom', distanceFrom);
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
}
