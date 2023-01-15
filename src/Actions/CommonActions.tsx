import BrikApi from '@/brikApi/BrikApi';
import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { catchError, getOptions, request } from '@/networking/request';

export const getLocationCoordinates = (
  token: string,
  longitude: number,
  latitude: number,
  distanceFrom: string
) => {
  return request(
    BrikApiCommon.getLocationCoordinates(longitude, latitude, distanceFrom),
    getOptions(token, 'GET')
  )
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((error) => {
      catchError(error);
    });
};

export const searchLocation = (
  token: string,
  searchValue: string,
  onSuccess: Function,
  onError: Function
) => {
  request(BrikApi.searchLocation(searchValue), getOptions(token, 'GET'))
    .then((response) => response.json())
    .then((responseJson) => {
      onSuccess(responseJson);
    })
    .catch((error) => {
      onError(catchError(error));
    });
};
