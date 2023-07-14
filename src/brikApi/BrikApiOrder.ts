import { Platform } from "react-native";
import Config from "react-native-config";

const API_URL =
    Platform.OS === "android"
        ? Config.API_URL_ORDER
        : __DEV__
        ? Config.API_URL_ORDER
        : Config.API_URL_ORDER_PROD;

export default class BrikApiOrder {
    static transactionTab = (batchingPlantId?: string) => {
        const url = new URL(`${API_URL}/order/m/tab/transaction`);
        const params = url.searchParams;
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };

    static getAllVisitationOrders = (
        page?: string,
        size?: string,
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/order/m/flow/quotation-letter`);
        const params = url.searchParams;
        if (page) {
            params.append("page", page);
        }
        if (size) {
            params.append("size", size);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };

    static getVisitationOrderByID = (id: string) => {
        const url = new URL(`${API_URL}/order/m/flow/quotation-letter/${id}`);
        return url.toString();
    };

    static getPurchaseOrderByID = (id: string) => {
        const url = new URL(`${API_URL}/order/m/purchase-order/${id}`);
        return url.toString();
    };

    static uploadSOSignedDocs = (id: string) => {
        const url = new URL(`${API_URL}/order/m/purchase-order/docs/${id}`);
        return url.toString();
    };

    static getDepositByID = (id: string) => {
        const url = new URL(`${API_URL}/order/m/deposit/${id}`);
        return url.toString();
    };

    static getScheduleByID = (id: string) => {
        const url = new URL(`${API_URL}/order/m/schedule/${id}`);
        return url.toString();
    };

    static deliveryOrderByID = (id: string) => {
        const url = new URL(`${API_URL}/order/m/delivery-order/${id}`);
        return url.toString();
    };

    static deliveryOrderWeightByID = (id: string) => {
        const url = new URL(`${API_URL}/order/m/delivery-order/${id}/weight`);
        return url.toString();
    };

    static orderSphPost = () => {
        const url = new URL(`${API_URL}/order/m/flow/quotation`);
        return url.toString();
    };

    static getSphByProject = (
        searchQuery: string,
        customerType: "COMPANY" | "INDIVIDU",
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/order/m/project-sph`);
        const params = url.searchParams;
        if (searchQuery) {
            params.append("search", searchQuery);
        }
        if (customerType) {
            params.append("customerType", customerType);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };

    static getConfirmedPurchaseOrder = (
        page?: string,
        size?: string,
        searchQuery?: string,
        productPo?: "1" | "0",
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/order/m/project-purchase-order`);
        const params = url.searchParams;
        if (page) {
            params.append("page", page);
        }
        if (size) {
            params.append("size", size);
        }
        if (searchQuery) {
            params.append("search", searchQuery);
        }
        if (productPo) {
            params.append("productPo", productPo);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };

    static getSphDocuments = (id: string) => {
        const url = new URL(`${API_URL}/order/m/sph/${id}`);
        return url.toString();
    };

    static purchaseOrder = (
        page?: string,
        size?: string,
        searchQuery?: string,
        status?: string,
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/order/m/purchase-order`);
        const params = url.searchParams;
        if (page) {
            params.append("page", page);
        }
        if (size) {
            params.append("size", size);
        }
        if (searchQuery) {
            params.append("search", searchQuery);
        }
        if (status) {
            params.append("status", status);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };

    static postDeposit = () => {
        const url = new URL(`${API_URL}/order/m/deposit`);
        return url.toString();
    };

    static deposit = (
        page?: string,
        size?: string,
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/order/m/deposit`);
        const params = url.searchParams;
        if (page) {
            params.append("page", page);
        }
        if (size) {
            params.append("size", size);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };

    static postSchedule = () => {
        const url = new URL(`${API_URL}/order/m/schedule`);
        return url.toString();
    };

    static schedule = (
        page?: string,
        size?: string,
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/order/m/schedule`);
        const params = url.searchParams;
        if (page) {
            params.append("page", page);
        }
        if (size) {
            params.append("size", size);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };

    static deliveryOrder = (
        searchQuery?: string,
        status?: string | string[],
        page?: string,
        size?: string,
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/order/m/delivery-order`);
        const params = url.searchParams;
        if (searchQuery) {
            params.append("search", searchQuery);
        }
        if (status) {
            const finalStatus =
                typeof status === "object" ? JSON.stringify(status) : status;
            params.append("status", finalStatus);
        }
        if (page) {
            params.append("page", page);
        }
        if (size) {
            params.append("size", size);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };
}
