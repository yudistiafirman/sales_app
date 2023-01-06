import BrikApi from '@/BrikApi/BrikApi';
import { catchError, getOptions, request } from '@/Networking/request';

export const getLocationCoordinates = (
  token: string,
  longitude: number,
  latitude: number,
  distanceFrom: string,
  onSuccess: Function,
  onError: Function
) => {
  request(
    BrikApi.getLocationCoordinates(longitude, latitude, distanceFrom),
    getOptions(token, 'GET')
  )
    .then((response) => response.json())
    .then((responseJson) => {
      onSuccess(responseJson);
    })
    .catch((error) => {
      onError(catchError(error));
    });
};

export const searchLocation = (
  token: string,
  searchValue: string,
  onSuccess: Function,
  onError: Function
) => {
  request(BrikApi.searchLocation(searchValue), getOptions(token,'GET'))
    .then((response) => response.json())
    .then((responseJson) => {
      onSuccess(responseJson);
    })
    .catch((error) => {
      onError(catchError(error));
    });
};

fetc
