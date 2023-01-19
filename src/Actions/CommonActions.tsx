import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { getOptions, request } from '@/networking/request';

export const getLocationCoordinates = (
  token: string,
  longitude: number,
  latitude: number,
  distance?: string
) => {
  return request(
    BrikApiCommon.getLocationCoordinates(longitude, latitude, distance),
    getOptions(token, 'GET')
  )
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
};

export const searchLocation = (token: string, searchValue: string) => {
  return request(
    BrikApiCommon.searchPlaces(searchValue),
    getOptions(token, 'GET')
  )
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    });
};

export const searchLocationById = (token: string, id: string) => {
  return request(BrikApiCommon.searchPlacesById(id), getOptions(token, 'GET'))
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    });
};
