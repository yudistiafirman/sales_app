import BrikApiCommon from "@/brikApi/BrikApiCommon";
import { customRequest } from "@/networking/request";

export const getLocationCoordinates = async (
    longitude: number,
    latitude: number,
    distance?: string
) =>
    customRequest(
        BrikApiCommon.getLocationCoordinates(longitude, latitude, distance),
        "GET"
    );

export const getAllCustomers = async (
    type: string,
    search: string,
    page: number
) =>
    customRequest(
        BrikApiCommon.getAllCustomers(type, search, page),
        "GET",
        undefined,
        true
    );

export const getOneCustomer = async (id: string) =>
    customRequest(BrikApiCommon.oneCustomer(id), "GET", undefined, true);

export const updateCustomer = async (id: string, data: any) =>
    customRequest(BrikApiCommon.oneCustomer(id), "PUT", data, true);

export const getCustomerCount = async () =>
    customRequest(BrikApiCommon.getCustomerCount(), "GET", undefined, true);

export const updateCustomerBillingAddress = async (id: string, data: any) =>
    customRequest(
        BrikApiCommon.updateCustomerBillingAddress(id),
        "PUT",
        data,
        true
    );

export const searchLocation = async (searchValue: string) =>
    customRequest(BrikApiCommon.searchPlaces(searchValue), "GET");

export const searchLocationById = async (id: string) =>
    customRequest(BrikApiCommon.searchPlacesById(id), "GET");

export const signIn = async (body: Record<string, string>) => {
    const params = new URLSearchParams();
    const dataToSend = Object.keys(body);
    dataToSend.forEach((val) => {
        params.append(val, body[val]);
    });
    return customRequest(BrikApiCommon.login(), "POST", params.toString());
};

export const signOut = async () =>
    customRequest(BrikApiCommon.logout(), "POST");

export const uploadFileImage = async (files: any[], from: string) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("photos", file);
    });
    formData.append("name", from);

    // http://192.168.18.23:3000/common/file/upload
    // BrikApiCommon.filesUpload(),
    return customRequest(BrikApiCommon.filesUpload(), "POST", formData, true);
};

export const allVisitationGetAction = async (search?: string) =>
    customRequest(BrikApiCommon.allVisitation(search), "GET", undefined, true);

export const projectByUserGetAction = async (search?: string) =>
    customRequest(
        BrikApiCommon.getProjectByUser(search),
        "GET",
        undefined,
        true
    );
export const projectGetOneById = async (projectId: string) =>
    customRequest(
        BrikApiCommon.oneGetProject(projectId),
        "GET",
        undefined,
        true
    );

export const getSphDocuments = async () =>
    customRequest(BrikApiCommon.sphDocuments(), "GET", undefined, true);

export const getAddressSuggestion = async (search?: string, page?: number) =>
    customRequest(
        BrikApiCommon.addressSuggestion(search, page),
        "GET",
        undefined,
        true
    );

export const postProjectDoc = async (data: {
    projectId: string;
    documentId: string;
    fileId: string;
}) => customRequest(BrikApiCommon.projectDoc(), "POST", data, true);

export const getProjectDetail = async (companyId?: string) =>
    customRequest(
        BrikApiCommon.getProjectDetail(companyId),
        "GET",
        undefined,
        true
    );

export const getProjectIndivualDetail = async (projectId: string) =>
    customRequest(
        BrikApiCommon.getProjectDetailIndividual(projectId),
        "GET",
        undefined,
        true
    );

export const updateBillingAddress = async (projectId: string, payload: any) =>
    customRequest(
        BrikApiCommon.updateBillingAddress(projectId),
        "PUT",
        payload,
        true
    );

export const updateLocationAddress = async (projectId: string, payload: any) =>
    customRequest(
        BrikApiCommon.updateLocationAddress(projectId),
        "PUT",
        payload,
        true
    );
