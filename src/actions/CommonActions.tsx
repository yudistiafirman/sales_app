import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { getOptions, request } from '@/networking/request';

export const getLocationCoordinates = (
  longitude: number,
  latitude: number,
  distance?: string
) => {
  return request(
    BrikApiCommon.getLocationCoordinates(longitude, latitude, distance),
    getOptions('GET')
  );
};

export const searchLocation = (searchValue: string) => {
  return request(BrikApiCommon.searchPlaces(searchValue), getOptions('GET'));
};

export const searchLocationById = (id: string) => {
  return request(BrikApiCommon.searchPlacesById(id), getOptions('GET'));
};

export const signIn = (body: Record<string, string>) => {
  const params = new URLSearchParams();
  const dataToSend = Object.keys(body);
  dataToSend.forEach((val) => {
    params.append(val, body[val]);
  });
  return request(BrikApiCommon.login(), getOptions('POST', params.toString()));
};

export const signOut = () => {
  return request(BrikApiCommon.logout(), getOptions('POST'));
};

export const uploadFile = (files: any[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('photos', file);
  });
  console.log(BrikApiCommon.filesUpload(), 'BrikApiCommon.filesUpload()');

  return request(BrikApiCommon.filesUpload(), getOptions('POST', formData));
};
