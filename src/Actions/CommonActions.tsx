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
  );
};

export const searchLocation = (token: string, searchValue: string) => {
  return request(
    BrikApiCommon.searchPlaces(searchValue),
    getOptions(token, 'GET')
  );
};

export const searchLocationById = (token: string, id: string) => {
  return request(BrikApiCommon.searchPlacesById(id), getOptions(token, 'GET'));
};

export const signIn = (body: { phone: string; otpCode?: string }) => {
  return request(
    BrikApiCommon.login(),
    getOptions('tokenstatis', 'POST', body)
  );
};

export const signOut = () => {
  return request(BrikApiCommon.logout(), getOptions('', 'POST'));
};
