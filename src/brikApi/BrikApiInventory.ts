import { Platform } from "react-native";
import Config from "react-native-config";

const API_URL =
    Platform.OS === "android"
        ? Config.API_URL_INV
        : __DEV__
        ? Config.API_URL_INV
        : Config.API_URL_INV_PROD;

export default class BrikApiInventory {
    static getDrivers = (page?: number, size?: number, search?: string) => {
        const url = new URL(`${API_URL}/inventory/b/driver`);
        const params = url.searchParams;

        if (page) {
            params.append("page", `${page}`);
        }
        if (size) {
            params.append("size", `${size}`);
        }
        if (search) {
            params.append("search", search);
        }
        return url.toString();
    };

    static getVehicles = (page?: number, size?: number, search?: string) => {
        const url = new URL(`${API_URL}/inventory/b/vehicle`);
        const params = url.searchParams;

        if (page) {
            params.append("page", `${page}`);
        }
        if (size) {
            params.append("size", `${size}`);
        }
        if (search) {
            params.append("search", search);
        }
        return url.toString();
    };

    static getProductCategories = (
        page?: number,
        size?: number,
        search?: string,
        pillar?: string,
        count?: boolean
    ) => {
        const url = new URL(`${API_URL}/inventory/m/category`);
        const params = url.searchParams;

        if (page) {
            params.append("page", `${page}`);
        }
        if (size) {
            params.append("size", `${size}`);
        }
        if (search) {
            params.append("search", search);
        }
        if (pillar) {
            params.append("pillar", pillar);
        }
        if (count) {
            params.append("count", `${count}`);
        }
        return url.toString();
    };

    static getProducts = (
        page?: number,
        size?: number,
        search?: string,
        category?: string,
        distance?: number,
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/inventory/m/product`);
        const params = url.searchParams;

        if (page) {
            params.append("page", `${page}`);
        }
        if (size) {
            params.append("size", `${size}`);
        }
        if (search) {
            params.append("search", search);
        }
        if (category) {
            params.append("category", category);
        }
        if (distance) {
            params.append("distance", `${distance}`);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", `${batchingPlantId}`);
        }
        return url.toString();
    };
}
