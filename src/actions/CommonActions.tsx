import BrikApiCommon from '@/brikApi/BrikApiCommon';
import { customRequest } from '@/networking/request';

export const getLocationCoordinates = async (
  longitude: number,
  latitude: number,
  distance?: string
) => {
  return customRequest(
    BrikApiCommon.getLocationCoordinates(longitude, latitude, distance),
    'GET'
  );
};

export const searchLocation = async (searchValue: string) => {
  return customRequest(BrikApiCommon.searchPlaces(searchValue), 'GET');
};

export const searchLocationById = async (id: string) => {
  return customRequest(BrikApiCommon.searchPlacesById(id), 'GET');
};

export const signIn = async (body: Record<string, string>) => {
  const params = new URLSearchParams();
  const dataToSend = Object.keys(body);
  dataToSend.forEach((val) => {
    params.append(val, body[val]);
  });
  return customRequest(BrikApiCommon.login(), 'POST', params.toString());
};

export const signOut = async () => {
  return customRequest(BrikApiCommon.logout(), 'POST');
};

export const uploadFileImage = async (files: any[], from: string) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('photos', file);
  });
  formData.append('name', from);

  //http://192.168.18.23:3000/common/file/upload
  //BrikApiCommon.filesUpload(),
  return customRequest(BrikApiCommon.filesUpload(), 'POST', formData, true);
};

export const allVisitationGetAction = async (search?: string) => {
  return customRequest(
    BrikApiCommon.allVisitation(search),
    'GET',
    undefined,
    true
  );
};

export const projectByUserGetAction = async (search?: string) => {
  return customRequest(
    BrikApiCommon.getProjectByUser(search),
    'GET',
    undefined,
    true
  );
};
export const projectGetOneById = async (projectId?: string) => {
  return customRequest(
    BrikApiCommon.oneGetProject(projectId),
    'GET',
    undefined,
    true
  );
};

export const getSphDocuments = async () => {
  return customRequest(BrikApiCommon.sphDocuments(), 'GET', undefined, true);
};

export const getAddressSuggestion = async (search?: string, page?: number) => {
  return customRequest(
    BrikApiCommon.addressSuggestion(search, page),
    'GET',
    undefined,
    true
  );
};

export const postProjectDoc = async (data: {
  projectId: string;
  documentId: string;
  fileId: string;
}) => {
  return customRequest(BrikApiCommon.projectDoc(), 'POST', data, true);
};

export const getProjectDetail = async (companyId?: string) => {
  return customRequest(
    BrikApiCommon.getProjectDetail(companyId),
    'GET',
    undefined,
    true
  );
};

export const getProjectIndivualDetail = async (projectId: string) => {
  return customRequest(
    BrikApiCommon.getProjectDetailIndividual(projectId),
    'GET',
    undefined,
    true
  );
};

export const updateBillingAddress = async (projectId: string, payload: any) => {
  return customRequest(
    BrikApiCommon.updateBillingAddress(projectId),
    'PUT',
    payload,
    true
  );
};
