import { Platform } from "react-native";
import Config from "react-native-config";

const API_URL =
    Platform.OS === "android"
        ? Config.API_URL_COMMON
        : __DEV__
        ? Config.API_URL_COMMON
        : Config.API_URL_COMMON_PROD;

export default class BrikApiCommon {
    static getLocationCoordinates = (
        longitude: number,
        latitude: number,
        distance = "BP-LEGOK"
    ) => {
        const url = new URL(`${API_URL}/common/map/coordinates`);
        const params = url.searchParams;
        if (longitude) {
            params.append("lon", `${longitude}`);
        }
        if (latitude) {
            params.append("lat", `${latitude}`);
        }
        if (distance) {
            params.append("distance", distance);
        }
        return url.toString();
    };

    static searchPlaces = (searchValue: string) => {
        const url = new URL(`${API_URL}/common/map/places`);
        const params = url.searchParams;
        if (searchValue) {
            params.append("search", searchValue);
        }
        return url.toString();
    };

    static searchPlacesById = (id: string) => {
        const url = new URL(`${API_URL}/common/map/places/${id}`);
        return url.toString();
    };

    static filesUpload = () => {
        const url = new URL(`${API_URL}/common/file/upload`);
        return url.toString();
    };

    static allVisitation = (search?: string) => {
        const url = new URL(`${API_URL}/common/m/flow/project`);
        const params = url.searchParams;

        if (search) {
            params.append("search", search);
        }

        return url.toString();
    };

    static getProjectByUser = (search?: string) => {
        const url = new URL(`${API_URL}/common/m/flow/companies-by-user`);
        const params = url.searchParams;

        if (search) {
            params.append("search", search);
        }

        return url.toString();
    };

    static oneGetProject = (projectId: string) => {
        const url = new URL(`${API_URL}/common/m/flow/project/${projectId}`);
        return url.toString();
    };

    static sphDocuments = () => {
        const url = new URL(`${API_URL}/common/m/flow/sph`);

        return url.toString();
    };

    static addressSuggestion = (search?: string, page?: number) => {
        const url = new URL(`${API_URL}/common/m/flow/address/suggestion`);
        const params = url.searchParams;
        if (search) {
            params.append("search", search);
        }
        if (page) {
            params.append("page", `${page}`);
        }
        // if (search) {
        params.append("size", "10");
        // }

        return url.toString();
    };

    static projectDoc = () => {
        const url = new URL(`${API_URL}/common/projectDoc`);

        return url.toString();
    };

    static getProjectDetail = (companyId?: string) => {
        const url = new URL(`${API_URL}/common/m/flow/project`);
        const params = url.searchParams;
        if (companyId) {
            params.append("companyId", companyId);
        }

        return url.toString();
    };

    static getProjectDetailIndividual = (projectId: string) => {
        const url = new URL(
            `${API_URL}/common/m/flow/project/${projectId}/individual`
        );
        return url.toString();
    };

    static updateBillingAddress = (projectId: string) => {
        const url = new URL(
            `${API_URL}/common/m/flow/project/${projectId}/billing-address`
        );
        return url.toString();
    };

    static updateLocationAddress = (projectId: string) => {
        const url = new URL(
            `${API_URL}/common/m/flow/project/${projectId}/location-address`
        );
        return url.toString();
    };

    // --------------------------------------------------AUTHENTICATION ---------------------------------------------//

    static login = () => {
        const url = new URL(`${API_URL}/common/m/auth/login`);
        return url.toString();
    };

    static logout = () => {
        const url = new URL(`${API_URL}/common/m/auth/logout`);
        return url.toString();
    };

    static getRefreshToken = () => {
        const url = new URL(`${API_URL}/common/m/auth/refresh`);
        return url.toString();
    };

    static verifyAuth = () => {
        const url = new URL(`${API_URL} /common/m/auth/verify-auth`);
        return url.toString();
    };
}

// --------------------------------------------------AUTHENTICATION ---------------------------------------------//
