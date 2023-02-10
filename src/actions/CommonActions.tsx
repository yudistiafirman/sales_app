import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { getOptions, request } from '@/networking/request';

export const getLocationCoordinates = async (
  longitude: number,
  latitude: number,
  distance?: string
) => {
  return request(
    BrikApiCommon.getLocationCoordinates(longitude, latitude, distance),
    await getOptions('GET')
  );
};

export const searchLocation = async (searchValue: string) => {
  return request(
    BrikApiCommon.searchPlaces(searchValue),
    await getOptions('GET')
  );
};

export const searchLocationById = async (id: string) => {
  return request(BrikApiCommon.searchPlacesById(id), await getOptions('GET'));
};

export const signIn = async (body: Record<string, string>) => {
  const params = new URLSearchParams();
  const dataToSend = Object.keys(body);
  dataToSend.forEach((val) => {
    params.append(val, body[val]);
  });
  return request(
    BrikApiCommon.login(),
    await getOptions('POST', params.toString())
  );
};

export const signOut = async () => {
  return request(BrikApiCommon.logout(), await getOptions('POST'));
};

export const uploadFileImage = async (files: any[], from: string) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('photos', file);
  });
  formData.append('name', from);
  //192.168.18.23
  //BrikApiCommon.filesUpload(),
  return request(
    BrikApiCommon.filesUpload(),
    await getOptions('POST', formData, true)
  );
};

export const allVisitationGetAction = async (search?: string) => {
  return request(
    BrikApiCommon.allVisitation(search),
    await getOptions('GET', undefined, true)
  );
};

export const projectByUserGetAction = async (search?: string) => {
  return request(
    BrikApiCommon.getProjectByUser(search),
    await getOptions('GET', undefined, true)
  );
};
export const projectGetOneById = async (projectId?: string) => {
  return request(
    BrikApiCommon.oneGetProject(projectId),
    await getOptions('GET', undefined, true)
  );
};

export const getSphDocuments = async () => {
  return request(
    BrikApiCommon.sphDocuments(),
    await getOptions('GET', undefined, true)
  );
};

export const getAddressSuggestion = async (search?: string, page?: number) => {
  return request(
    BrikApiCommon.addressSuggestion(search, page),
    await getOptions('GET', undefined, true)
  );
};
