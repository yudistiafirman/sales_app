import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { getOptions, request } from '@/networking/request';
import axios from 'axios';

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

export const uploadFileImage = (files: any[], from: string) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('photos', file);
  });
  formData.append('name', from);
  return request(BrikApiCommon.filesUpload(), getOptions('POST', formData));
};

export const allVisitationGet = (search?: string) => {
  return request(BrikApiCommon.allVisitation(search), getOptions('GET'));
};
